const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync('app.js','utf8');
function section(begin,end){
  const a=app.indexOf(begin),b=app.indexOf(end,a);
  assert(a>=0&&b>a,'Could not find '+begin);
  return app.slice(a,b);
}
let active=false;
const pending=[];
let renderCount=0,clearCount=0,applied=0,steps=0,showCount=0;
const ctx={
  contentOverrides:{},contentOverridesRequestSequence:0,
  adminViewEpoch:0,currentUser:{id:'admin1',role:'admin'},
  views:{admin:{classList:{contains(name){return name==='active-view'&&active;}}}},
  requireLogin(){return true;},
  showView(name){assert.equal(name,'admin');active=true;showCount++;},
  setBreadcrumb(){},
  document:{querySelector(sel){return {textContent:'',className:''};}},
  renderAdminContentFields(){renderCount++;},
  clearAdminDirty(){clearCount++;},
  applyContentOverrides(){applied++;},
  fetch(url){assert.equal(url,'/api/content');return new Promise(resolve=>pending.push(resolve));}
};
for(const name of ['loadAdminUsers','loadAdminInvites','loadAdminFeedback','loadAdminSurvey',
  'loadAdminAiSettings','loadAdminAiUsage','loadBenchmarkConfig'])ctx[name]=async()=>{steps++;};
vm.createContext(ctx);
vm.runInContext(
  section('function isActiveAdminView(', '\nfunction clearAdminPrivateData()')+
  section('async function loadContentOverrides() {', '\nfunction renderAdminContentFields()')+
  section('async function openAdmin() {', '\nfunction isStandaloneApp()')+
  '\nthis.load=loadContentOverrides;this.enter=openAdmin;',
  ctx
);
function respond(index, payload, ok=true) {
  const resolve=pending[index];
  assert.equal(typeof resolve,'function','No pending fetch at '+index);
  resolve({ok,json:async()=>payload});
}
(async()=>{
  // A slower old response must not override the accepted newer response.
  const old=ctx.load(),newer=ctx.load();
  respond(1,{values:{label:'Newest'}});
  assert.equal((await newer).loaded,true);
  assert.equal(ctx.contentOverrides.label,'Newest');
  respond(0,{values:{label:'Old'}});
  assert.equal((await old).superseded,true);
  assert.equal(ctx.contentOverrides.label,'Newest');
  assert.equal(applied,1);

  // Leaving while opening Admin must not populate the form afterwards.
  const stale=ctx.enter();
  active=false;ctx.adminViewEpoch++;
  respond(2,{values:{label:'Gone'}});
  await stale;
  assert.equal(renderCount,0);
  assert.equal(steps,0);

  // If a second load supersedes the first, only the second owns the form.
  const opening=ctx.enter();
  const refreshed=ctx.load();
  respond(4,{values:{label:'Current'}});
  await refreshed;
  respond(3,{values:{label:'Stale'}});
  await opening;
  assert.equal(renderCount,0);
  assert.equal(steps,0);
  active=false;
  const fresh=ctx.enter();
  respond(5,{values:{label:'Final'}});
  await fresh;
  assert.equal(renderCount,1);
  assert.equal(clearCount,1);
  assert.equal(steps,7);
  assert.equal(ctx.contentOverrides.label,'Final');

  // Clicking the open-admin action while it is already active preserves edits.
  await ctx.enter();
  assert.equal(renderCount,1);
  assert.equal(showCount,3);
  console.log('Admin content: newest request wins, old view/session cannot reset editor OK');
})().catch(e=>{console.error(e);process.exitCode=1;});
