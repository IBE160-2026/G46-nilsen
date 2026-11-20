const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app.js','utf8');

function extract(begin, end) {
  const start = source.indexOf(begin);
  const stop = source.indexOf(end,start);
  assert(start >= 0 && stop > start, 'Could not extract '+begin);
  return source.slice(start,stop);
}
const modules = [
  extract('function isActiveAdminView(', '\nfunction showView(name,'),
  extract('async function loadAdminUsers(){', '\nasync function loadAdminFeedback()'),
  extract('async function loadAdminFeedback(){', '\nasync function loadAdminAiSettings()'),
  extract('async function loadAdminAiSettings(){', '\nfunction formatUsd('),
  extract('function formatUsd(', '\nfunction benchmarkSelectedModels()'),
  extract('let benchmarkConfigRequestSequence = 0;', '\nasync function runBenchmarkMock()'),
  extract('async function loadAdminSurvey(){', '\nasync function loadAdminInvites()')
];
const nodes = new Map();
function node(name) {
  if (!nodes.has(name)) nodes.set(name,{
    hidden:false, disabled:false, checked:false, innerHTML:'',textContent:'',
    replaceChildren(){this.innerHTML='';this.textContent='';},
    querySelectorAll(){return [];}
  });
  return nodes.get(name);
}
let active=true;
const pending=[];
const ctx={
  currentUser:{id:'admin1',role:'admin'},
  adminViewEpoch:0,
  adminContentDirty:false,
  views:{admin:{classList:{contains(key){return key==='active-view'&&active;}}}},
  document:{querySelector:node},
  fetch(url){return new Promise(resolve=>pending.push({url,resolve}));},
  escapeHtml(value){return String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;');},
  renderBenchmarkSummary(){},
  renderBenchmarkResults(){},
  Date,console
};
vm.createContext(ctx);
vm.runInContext(modules.join('\n')+
  '\nthis.loadUsers=loadAdminUsers;this.loadFeedback=loadAdminFeedback;' +
  'this.loadSurvey=loadAdminSurvey;this.loadModel=loadAdminAiSettings;' +
  'this.loadUsage=loadAdminAiUsage;this.loadBenchmark=loadBenchmarkConfig;' +
  'this.clearPrivate=clearAdminPrivateData;this.cache=()=>benchmarkConfig;',ctx);

function reply(url,payload,ok=true){
  const idx=pending.findIndex(x=>x.url===url);
  assert(idx>=0,'No pending '+url);
  const request=pending.splice(idx,1)[0];
  request.resolve({ok,json:async()=>payload});
}
async function check() {
  // A late feedback response must not expose the content to a new session.
  const f=ctx.loadFeedback();
  ctx.currentUser={id:'user2',role:'user'};
  reply('/api/admin/ai-feedback',{items:[{
    category:'Report',comment:'PRIVATE-SNAPSHOT',
    include_conversation:true,conversation_snapshot:{text:'SECRET'},
    created_at:'2026-11-20T10:00:00Z'
  }]});
  await f;
  assert(!node('#admin-feedback-list').innerHTML.includes('PRIVATE-SNAPSHOT'));
  assert(!node('#admin-feedback-list').innerHTML.includes('SECRET'));

  // A late survey response from a former view must not restore private comments.
  ctx.currentUser={id:'admin1',role:'admin'};
  const survey=ctx.loadSurvey();
  ctx.adminViewEpoch++;
  reply('/api/admin/survey',{count:1,averages:{},responses:[
    {created_at:'2026-11-20T10:00:00Z',improvement_text:'PRIVATE-SURVEY'}
  ]});
  reply('/api/admin/survey/settings',{enabled:true});
  await survey;
  assert(!node('#admin-survey-summary').innerHTML.includes('PRIVATE-SURVEY'));
  assert.equal(node('#admin-survey-enabled').checked,false);

  // Model configuration, user list and feedback must not repopulate after leaving.
  const model=ctx.loadModel();
  const users=ctx.loadUsers();
  const feedback=ctx.loadFeedback();
  active=false;ctx.adminViewEpoch++;
  reply('/api/admin/ai-settings',{models:[{id:'stale',label:'Old'}],activeModel:'stale'});
  reply('/api/admin/users',{users:[{id:'u',username:'PRIVATE-USER',role:'user'}]});
  reply('/api/admin/ai-feedback',{items:[{comment:'PRIVATE-FEEDBACK'}]});
  await Promise.all([model,users,feedback]);
  assert(!node('#admin-ai-model').innerHTML.includes('Old'));
  assert(!node('#admin-users-list').innerHTML.includes('PRIVATE-USER'));
  assert(!node('#admin-feedback-list').innerHTML.includes('PRIVATE-FEEDBACK'));

  // The latest usage filter response wins even if the older request returns last.
  active=true;
  node('#admin-usage-include-tests').checked=false;
  const oldUsage=ctx.loadUsage();
  node('#admin-usage-include-tests').checked=true;
  const latestUsage=ctx.loadUsage();
  const usage=(count)=>({summary:{cost24h:1,cost7d:1,cost30d:1,calls30d:count},
    topDomains:[],topQueries:[],topPages:[],recent:[]});
  reply('/api/admin/ai-usage?includeTests=1',usage(27));
  await latestUsage;
  assert.equal(node('#admin-calls-30d').textContent,'27');
  reply('/api/admin/ai-usage?includeTests=0',usage(1));
  await oldUsage;
  assert.equal(node('#admin-calls-30d').textContent,'27');

  // No stale benchmark config should be retained by the app after navigation.
  const benchmark=ctx.loadBenchmark();
  ctx.adminViewEpoch++;
  reply('/api/admin/benchmark/cases',{totalCases:12,models:[],storageReady:true});
  await benchmark;
  assert.equal(ctx.cache(),null);

  // Cleared administrator data are not kept in hidden DOM nodes.
  node('#admin-feedback-list').innerHTML='PRIVATE-ATTACHMENT';
  node('#admin-users-list').innerHTML='PRIVATE-EMAIL';
  node('#admin-survey-summary').innerHTML='PRIVATE-SURVEY';
  node('#admin-ai-model').innerHTML='PRIVATE-MODEL';
  node('#admin-content-fields').innerHTML='PRIVATE-EDITOR';
  ctx.clearPrivate();
  for (const name of [
    '#admin-feedback-list','#admin-users-list','#admin-survey-summary',
    '#admin-ai-model','#admin-content-fields','#benchmark-results'
  ]) assert.equal(node(name).innerHTML,'','DOM did not clear '+name);
  assert.equal(node('#admin-calls-30d').textContent,'–');
  assert.equal(node('#benchmark-run-live').disabled,true);
  assert.equal(ctx.cache(),null);
  console.log('Sensitive admin views: stale sessions, request ordering and DOM cleanup OK');
}
check().catch(error=>{console.error(error);process.exitCode=1;});
