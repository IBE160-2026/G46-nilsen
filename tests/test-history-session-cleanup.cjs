const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const app = fs.readFileSync('app.js','utf8');
function fragment(a,b){
  const start=app.indexOf(a),stop=app.indexOf(b,start);
  assert(start>=0&&stop>start,'Missing section: '+a);
  return app.slice(start,stop);
}
const nodes=new Map();
function element(selector){
  if(!nodes.has(selector)) nodes.set(selector,{
    hidden:false, textContent:'',innerHTML:'',className:'',
    replaceChildren(){this.innerHTML='';this.textContent='';},
    classList:{contains(){return false;}}
  });
  return nodes.get(selector);
}
let active='home';
const pending=[];
let renderItems=[],resets=0,clearAdminCount=0;
const ctx={
  currentUser:{id:'account-a',username:'A',role:'user'},
  adminIdentityKey:'',
  adminViewEpoch:0,
  historyRequestSequence:0,
  loadedHistoryItem:null,
  document:{
    querySelector:element,
    querySelectorAll(){return [];}
  },
  initialsFor:()=> 'A',
  resetConversationState(){resets++;},
  clearAdminPrivateData(){clearAdminCount++;},
  showView(view){active=view;},
  activeViewName(){return active;},
  setBreadcrumb(){},
  fetch(url){
    assert.equal(url,'/api/history');
    return new Promise(resolve=>pending.push(resolve));
  },
  renderHistory(items){renderItems=items;}
};
vm.createContext(ctx);
vm.runInContext(
  fragment('function updateAuthUi() {', '\nfunction setAppLocked(')+
  fragment('async function openHistory() {', '\nfunction renderHistory(items){')+
  '\nthis.update=updateAuthUi; this.open=openHistory;',ctx
);
function reply(index, names, ok=true){
  assert.equal(typeof pending[index],'function','Expected pending fetch '+index);
  pending[index]({ok,json:async()=>({items:names.map(name=>({title:name}))})});
}
(async()=>{
  // First login should not erase the text a user typed before signing in.
  ctx.update();
  assert.equal(resets,0);
  const first=ctx.open();
  reply(0,['Account A history']);
  await first;
  assert.equal(renderItems[0].title,'Account A history');

  // A response from A must not repaint after logout/account change.
  const oldRequest=ctx.open();
  element('#history-list').innerHTML='PRIVATE-ACCOUNT-A';
  ctx.currentUser=null;
  ctx.update();
  assert.equal(element('#history-list').innerHTML,'');
  assert.equal(ctx.loadedHistoryItem,null);
  assert.equal(resets,1,'Logout must clear prior conversations');
  reply(1,['PRIVATE-AFTER-LOGOUT']);
  await oldRequest;
  assert.equal(renderItems[0].title,'Account A history',
    'Stale history must not render after logout');

  ctx.currentUser={id:'account-b',username:'B',role:'user'};
  ctx.update();
  const current=ctx.open();
  reply(2,['Account B history']);
  await current;
  assert.equal(renderItems[0].title,'Account B history');

  // Overlapping requests by B must respect ordering.
  const slow=ctx.open();
  const latest=ctx.open();
  reply(4,['Newest history']);
  await latest;
  reply(3,['Older history']);
  await slow;
  assert.equal(renderItems[0].title,'Newest history');
  assert(clearAdminCount>=2,'Identity changes must invalidate admin data too');
  ctx.currentUser={...ctx.currentUser,role:'editor'};
  ctx.update();
  assert.equal(resets,1,'Changing a role for the same account must not discard its conversation');
  console.log('History: logout clears previous account and late requests cannot repopulate: OK');
})().catch(e=>{console.error(e);process.exitCode=1;});
