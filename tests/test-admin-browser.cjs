// Headless browser test using the real app.js, real DOM, and local fake API responses.
// Client permission UI only; does NOT verify actual server authorization or RLS.
const assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {spawn,execFileSync}=require("node:child_process");
const PORT=33181,DEBUG=33182,BASE="http://127.0.0.1:"+PORT+"/";
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"admin-browser-"));
const children=[];let sock=null;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function start(exe,args,env={}){
  const p=spawn(exe,args,{env:{...process.env,...env},stdio:["ignore","pipe","pipe"]});let tail="";
  for(const s of [p.stdout,p.stderr])s.on("data",d=>tail=(tail+d.toString()).slice(-2800));
  p.tail=()=>tail;children.push(p);return p;
}
function browser(){
  for(const b of [process.env.CHROME_BIN,"google-chrome","google-chrome-stable","chromium","chromium-browser"].filter(Boolean)){
    try{return execFileSync("which",[b],{encoding:"utf8"}).trim();}catch{}
  }
  throw Error("Chrome or Chromium is required for browser regression");
}
async function ready(url,child,seconds=30){
  for(let i=0;i<seconds*10;i++){
    if(child.exitCode!==null)throw Error("Process exited: "+child.tail());
    try{const r=await fetch(url,{signal:AbortSignal.timeout(700)});if(r.ok)return;}catch{}
    await sleep(100);
  }
  throw Error("Endpoint unavailable: "+url+"; stderr: "+child.tail());
}
async function connect(url){
  return new Promise((resolve,reject)=>{
    const ws=new WebSocket(url),pending=new Map();let seq=0;
    ws.addEventListener("open",()=>{
      sock=ws;
      resolve({send(method,params={}){
        const id=++seq;
        return new Promise((done,fail)=>{
          pending.set(id,{done,fail});ws.send(JSON.stringify({id,method,params}));
          setTimeout(()=>{if(pending.has(id)){pending.delete(id);fail(Error("CDP timeout "+method));}},12000).unref?.();
        });
      }});
    });
    ws.addEventListener("error",reject);
    ws.addEventListener("message",e=>{
      const x=JSON.parse(e.data),p=pending.get(x.id);if(!p)return;
      pending.delete(x.id);if(x.error)p.fail(Error(JSON.stringify(x.error)));else p.done(x.result);
    });
    ws.addEventListener("close",()=>{for(const p of pending.values())p.fail(Error("CDP closed"));pending.clear();});
  });
}
async function js(cdp,expression){
  const r=await cdp.send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
  return r.result?.value;
}
async function keyPress(cdp,key,shift=false){
  const options={key,code:key,windowsVirtualKeyCode:key==='Tab'?9:key==='Escape'?27:13,
    modifiers:shift?8:0};
  await cdp.send("Input.dispatchKeyEvent",{type:"keyDown",...options});
  await cdp.send("Input.dispatchKeyEvent",{type:"keyUp",...options});
}
async function verifyKeyboardDialogs(cdp,role){
  // Real key events, not manually dispatched DOM KeyboardEvents.
  await js(cdp,"(()=>{const x=document.querySelector('#profile-button');x.focus();x.click();})()");
  await wait(cdp,"!document.querySelector('#profile-menu').hidden","profile menu opened");
  await js(cdp,"document.querySelector('[data-profile-action=history]').focus()");
  await keyPress(cdp,"Escape");
  await wait(cdp,"document.querySelector('#profile-menu').hidden","profile closed by Escape");
  assert.equal(await js(cdp,"document.activeElement?.id"),"profile-button",
    "Profile Escape must restore focus to menu opener");

  await js(cdp,"(()=>{document.querySelector('#profile-button').focus();openAuth('login',false)})()");
  await wait(cdp,"!document.querySelector('#auth-dialog').hidden&&document.activeElement?.id==='login-email'",
    "optional auth opens and focuses first input");
  assert.equal(await js(cdp,"document.querySelector('#auth-dialog')?.getAttribute('aria-modal')"),"true");
  await js(cdp,"document.querySelector('#show-register').focus()");
  await keyPress(cdp,"Tab");
  assert.equal(await js(cdp,"document.activeElement?.id"),"auth-close",
    "Tab from last control must wrap to close button inside auth dialog");
  await keyPress(cdp,"Tab",true);
  assert.equal(await js(cdp,"document.activeElement?.id"),"show-register",
    "Shift+Tab from first control must wrap to final auth control");
  await keyPress(cdp,"Escape");
  await wait(cdp,"document.querySelector('#auth-dialog').hidden","optional auth Escape");
  assert.equal(await js(cdp,"document.activeElement?.id"),"profile-button",
    "Closing optional auth must restore its opener");

  // When a user is not signed in, Escape and the close (X) button must not
  // dismiss mandatory authentication or expose the inert application.
  await js(cdp,"(()=>{currentUser=null;openAuth('login',true)})()");
  await wait(cdp,"!document.querySelector('#auth-dialog').hidden&&document.querySelector('#auth-dialog').classList.contains('required-auth')",
    "required auth shown");
  await keyPress(cdp,"Escape");
  await js(cdp,"document.querySelector('#auth-close').click()");
  assert.equal(await js(cdp,"document.querySelector('#auth-dialog').hidden"),false,
    "Mandatory auth must resist both Escape and the close button");
  assert.equal(await js(cdp,"document.querySelector('.app-shell').hasAttribute('inert')"),true,
    "App must remain locked behind mandatory auth");
  await js(cdp,"(()=>{currentUser={id:'admin-current',username:"+JSON.stringify(role==="admin"?"Admin Test":role==="editor"?"Editor Test":"User Test")+",email:'synthetic@example.invalid',role:"+JSON.stringify(role)+"};closeAuth(true);setAppLocked(false);})()");

  const trigger='.topbar-brand-button';
  await js(cdp,"(()=>{const x=document.querySelector("+JSON.stringify(trigger)+");x.focus();x.click()})()");
  await wait(cdp,"document.querySelector('#image-preview-dialog').open","native image dialog open");
  assert.equal(await js(cdp,"document.querySelector('#image-preview-dialog')?.getAttribute('aria-label')"),"Forstørret bilde");
  await keyPress(cdp,"Escape");
  await wait(cdp,"!document.querySelector('#image-preview-dialog').open","native dialog Escape close");
  assert.equal(await js(cdp,"document.activeElement?.classList.contains('topbar-brand-button')"),true,
    "Native dialog Escape should return focus to image opener");
  console.log("Keyboard dialog accessibility "+role+": profile Escape + focus; auth Tab/Shift+Tab/Escape; required auth locked; native modal Escape: PASS");
}
async function wait(cdp,expression,title){
  for(let i=0;i<140;i++){
    if(await js(cdp,"Boolean("+expression+")"))return;
    await sleep(100);
  }
  throw Error("Timeout: "+title+"; state="+JSON.stringify(await js(cdp,"({profile:document.querySelector('#profile-name')?.textContent,view:document.querySelector('#admin-view')?.className,calls:window.__fixture?.calls,errors:window.__jsErrors})")));
}
function fixture(role){return "(()=>{\nconst role=ROLE_LITERAL,realFetch=window.fetch.bind(window);\nwindow.__jsErrors=[];\nwindow.addEventListener('error',e=>window.__jsErrors.push(String(e.message)));\nwindow.addEventListener('unhandledrejection',e=>window.__jsErrors.push(String(e.reason)));\nconst state={role,calls:[],status:200,contentStatus:200,liveEnabled:true};window.__fixture=state;\nconst fake=(data,status=200)=>Promise.resolve(new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}}));\nwindow.fetch=(input,opt={})=>{\n const url=new URL(typeof input==='string'?input:input.url,location.href),p=url.pathname,method=String(opt.method||'GET').toUpperCase();\n if(p==='/api/auth/me')return fake({user:{id:'admin-current',username:role==='admin'?'Admin Test':role==='editor'?'Editor Test':'User Test',email:'synthetic@example.invalid',role}});\n if(p==='/api/analyze-situation'||p==='/api/generate-guidance'){\n   state.calls.push({path:p,search:url.search,method,body:opt.body||null});\n   if(role!=='admin')return fake({message:'Forbidden'},403);\n   return p==='/api/analyze-situation'?fake({model:'synthetic-analysis',relevant_topics:['Samarbeid']}):fake({model:'synthetic-guidance',opening:'Jeg vil gjerne forstå hvordan du opplever situasjonen.'});\n }\n if(p.startsWith('/api/admin/')){\n  state.calls.push({path:p,search:url.search,method,body:opt.body||null});\n  if(p==='/api/admin/content'&&method==='PUT')return ['editor','admin'].includes(role)?(state.contentStatus===200?fake({ok:true,saved:2}):fake({message:'Lagring avvist'},state.contentStatus)):fake({message:'Forbidden'},403);\n  if(role!=='admin')return fake({message:'Forbidden'},403);\n  if(p==='/api/admin/users'&&method==='GET')return fake({users:[{id:'admin-current',username:'Admin Test',email:'admin@example.invalid',role:'admin'},{id:'user-2',username:'<script>unsafe</script>',email:'user&test@example.invalid',role:'user'}]});\n  if(p==='/api/admin/users/user-2/role'&&method==='PATCH')return state.status===200?fake({ok:true}):fake({message:'Rolleendring avvist'},state.status);\n  if(p==='/api/admin/ai-feedback')return fake({items:[{category:'<label>',surface:'main-guidance',created_at:'2026-11-20T09:00:00Z',comment:'<img src=x onerror=alert(1)>',include_conversation:false}]});\n  if(p==='/api/admin/ai-settings')return fake({models:[{id:'model-a',label:'Test Model',tier:'standard',inputPerMillion:1,outputPerMillion:2}],activeModel:'model-a'});\n  if(p==='/api/admin/ai-usage')return fake({summary:{cost24h:0.25,cost7d:1.5,cost30d:2,calls30d:17},topDomains:[],topQueries:[],topPages:[],recent:[]});\n  if(p==='/api/admin/survey')return fake({count:0,averages:{},responses:[]});\n  if(p==='/api/admin/survey/settings')return fake({enabled:true});\n  if(p==='/api/admin/benchmark/cases')return fake({totalCases:3,totalSubtopics:1,cases:['case-1','case-2','case-3'].map(id=>({id,topicId:'test',topic:'Testtema',subtopic:'Fiktiv situasjon',variant:'A'})),models:[{id:'model-a',label:'Syntetisk testmodell'}],storageReady:true,liveEnabled:state.liveEnabled});\n  if(p==='/api/admin/benchmark/mock'&&method==='POST')return fake({ok:true,mode:'mock',checks:{cases:114,subtopics:48},problems:[]});\n  if(p==='/api/admin/benchmark/live'&&method==='POST')return fake({case_id:JSON.parse(opt.body).caseId,topic:'Testtema',subtopic:'Fiktiv situasjon',variant:'A',model:'model-a',response_text:'<img src=x onerror=alert(1)> Fiktivt råd.',estimated_cost_usd:0.01,input_tokens:10,output_tokens:20,web_search_count:0,web_search_queries:[],source_domains:[],source_pages:[],latency_ms:100});\n  if(p==='/api/admin/pilot-regression/cases'){if(url.search==='?summary=1')return fake({pilotCount:1,fullCount:3,paidRegressionEnabled:state.liveEnabled});return fake({cases:(url.search==='?mode=full'?['pilot-1','golden-2','golden-3']:['pilot-1']).map(id=>({id,theme:'Fiktivt samarbeid',input:'Testscenario uten persondata.',pilot_regression:id==='pilot-1',opening_checks:{max_words:65}})),paidRegressionEnabled:state.liveEnabled});}\n  if(p==='/api/admin/pilot-regression/result'&&method==='POST')return fake({ok:true});\n  return fake({message:'Unmocked test endpoint '+p},404);\n }\n return realFetch(input,opt);\n};\n})();".replace("ROLE_LITERAL",JSON.stringify(role));}
async function verifyContentEditingInChrome(cdp, role){
  await wait(cdp,
    "document.querySelector('#admin-content-fields textarea[data-admin-content-key=\"home.hero.title\"]')",
    role+" editable fields");
  await js(cdp,"(()=>{document.querySelector('#admin-content-editor').open=true;const x=document.querySelector('[data-admin-content-key=\"home.hero.title\"]');x.value='  Tittel fra '+window.__fixture.role+'  ';x.dispatchEvent(new Event('input',{bubbles:true}));})()");
  let state=await js(cdp,"({dirty:!document.querySelector('#admin-unsaved-indicator').hidden,enabled:!document.querySelector('#admin-save-content').disabled})");
  assert.equal(state.dirty,true,"Input must show unsaved warning");
  assert.equal(state.enabled,true,"Input must enable save");
  await js(cdp,"(()=>{const button=document.querySelector('#admin-save-content');button.focus();button.click()})()");
  await wait(cdp,"document.querySelector('#admin-save-dialog').open","save confirmation dialog");
  await keyPress(cdp,"Escape");
  await wait(cdp,"!document.querySelector('#admin-save-dialog').open","save confirmation cancelled by Escape");
  await wait(cdp,"document.activeElement?.id==='admin-save-content'",
    "Native save dialog Escape must restore focus to its save button");
  await js(cdp,"document.querySelector('#admin-save-content').click()");
  await wait(cdp,"document.querySelector('#admin-save-dialog').open","save confirmation reopened");
  assert.equal((await js(cdp,"window.__fixture.calls.filter(x=>x.path==='/api/admin/content').length")),0,
    "Confirm dialog must stop automatic write before approval");
  await js(cdp,"document.querySelector('#admin-save-confirm').click()");
  await wait(cdp,"document.querySelector('#admin-content-message').className.includes('success')","content save success");
  state=await js(cdp,"({dirty:!document.querySelector('#admin-unsaved-indicator').hidden,enabled:!document.querySelector('#admin-save-content').disabled,heading:document.querySelector('#home-view .hero-copy h1').textContent,calls:window.__fixture.calls.filter(x=>x.path==='/api/admin/content')})");
  assert.equal(state.dirty,false);
  assert.equal(state.enabled,false);
  assert.equal(state.heading,"Tittel fra "+role);
  assert.equal(state.calls.length,1);
  assert.equal(state.calls[0].method,"PUT");
  assert.equal(JSON.parse(state.calls[0].body).values["home.hero.title"],"Tittel fra "+role);

  // A rejected save must preserve both the unsaved editor and the last persisted page text.
  await js(cdp,"(()=>{window.__fixture.contentStatus=403;const x=document.querySelector('[data-admin-content-key=\"home.hero.title\"]');x.value='Må beholdes lokalt';x.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#admin-save-content').click()})()");
  await wait(cdp,"document.querySelector('#admin-save-dialog').open","rejected save confirmation");
  await js(cdp,"document.querySelector('#admin-save-confirm').click()");
  await wait(cdp,"document.querySelector('#admin-content-message').className.includes('error')","server 403 message");
  state=await js(cdp,"({message:document.querySelector('#admin-content-message').textContent,dirty:!document.querySelector('#admin-unsaved-indicator').hidden,enabled:!document.querySelector('#admin-save-content').disabled,heading:document.querySelector('#home-view .hero-copy h1').textContent,calls:window.__fixture.calls.filter(x=>x.path==='/api/admin/content')})");
  assert.equal(state.message,"Lagring avvist");
  assert.equal(state.dirty,true);
  assert.equal(state.enabled,true);
  assert.equal(state.heading,"Tittel fra "+role);
  assert.equal(state.calls.length,2);

  // "Last inn på nytt" must ask before discarding, then reset dirty state on approval.
  await js(cdp,"(()=>{window.confirm=()=>false;document.querySelector('#admin-reload-content').click()})()");
  await sleep(100);
  assert.equal(await js(cdp,"!document.querySelector('#admin-unsaved-indicator').hidden"),true,
    "Declined reload must keep unsaved work");
  await js(cdp,"(()=>{window.confirm=()=>true;document.querySelector('#admin-reload-content').click()})()");
  await wait(cdp,"document.querySelector('#admin-unsaved-indicator').hidden&&document.querySelector('#admin-save-content').disabled","accepted reload");
}
async function verifyBenchmarkIsolation(cdp){
  const paid=['/api/admin/benchmark/live','/api/analyze-situation','/api/generate-guidance'];
  const countPaid=async()=>await js(cdp,"window.__fixture.calls.filter(x=>"+JSON.stringify(paid)+".includes(x.path)).length");
  await wait(cdp,"document.querySelector('#benchmark-run-live')?.disabled===false","mock benchmark configured");
  await wait(cdp,"document.querySelector('#benchmark-case-set option[value=\\\"all\\\"]')?.textContent==='Alle 3 saker'","all option derived from loaded bank");
  const meta=await js(cdp,"({full:document.querySelector('#benchmark-case-set option[value=\\\"all\\\"]').textContent,pilot:document.querySelector('#pilot-regression-run').textContent,all:document.querySelector('#production-regression-run').textContent,description:document.querySelector('#pilot-regression-description').textContent})");
  assert.equal(meta.full,"Alle 3 saker");
  assert.equal(meta.pilot,"Kjør 1 pilotcase");
  assert.equal(meta.all,"Kjør alle 3 i produksjonsflyt");
  assert.ok(meta.description.includes("1 pilotcase bruker 2 KI-kall"));
  assert.ok(meta.description.includes("Alle 3 saker bruker 6 KI-kall"));
  const before=await countPaid();
  await js(cdp,"(()=>{window.confirm=()=>false;document.querySelector('#benchmark-run-live').click();document.querySelector('#pilot-regression-run').click()})()");
  await wait(cdp,"window.__fixture.calls.some(x=>x.path==='/api/admin/pilot-regression/cases')","pilot cases fetched before cancellation");
  await sleep(120);
  assert.equal(await countPaid(),before,"Cancelled paid benchmark/pilot actions must not send a billable request");
  await js(cdp,"document.querySelector('#benchmark-run-mock').click()");
  await wait(cdp,"document.querySelector('#benchmark-mock-result')?.textContent.includes('0 KI-kostnad')","free benchmark mock");
  const mockCalls=await js(cdp,"window.__fixture.calls.filter(x=>x.path==='/api/admin/benchmark/mock')");
  assert.equal(mockCalls.length,1,"Free benchmark must invoke only the mock API");
  assert.equal(mockCalls[0].method,"POST");
  assert.equal(await countPaid(),before,"Free benchmark unexpectedly started a provider request");

  // All billable-looking URLs are intercepted by fake fetch responses installed before page load.
  // These tests NEVER contact an actual AI provider or the production backend.
  await js(cdp,"(()=>{document.querySelector('#benchmark-case-set').value='all';window.confirm=message=>{window.__fixture.benchmarkConfirmation=message;return true;};document.querySelector('#benchmark-run-live').click()})()");
  const confirmText=await js(cdp,"window.__fixture.benchmarkConfirmation");
  assert.match(confirmText,/Kjøre 3 testsaker på 1 modeller = 3 ekte KI-kall/);
  await wait(cdp,"document.querySelector('#benchmark-live-status')?.textContent.startsWith('Ferdig:')","synthetic live benchmark completion");
  const live=await js(cdp,"window.__fixture.calls.filter(x=>x.path==='/api/admin/benchmark/live')");
  assert.equal(live.length,3,"Symbolic all must invoke all 3 fake cases, not a hardcoded subset");
  assert.deepEqual(live.map(x=>JSON.parse(x.body).caseId),["case-1","case-2","case-3"]);
  assert.ok(live.every(x=>x.method==="POST"));
  const data=JSON.parse(live[0].body);
  assert.equal(data.caseId,"case-1");
  assert.equal(data.model,"model-a");
  assert.equal(data.budgetUsd,2);
  assert.equal(data.spentSoFar,0);
  assert.equal((await js(cdp,"document.querySelector('#benchmark-results img')!==null")),false,
    "Synthetic provider HTML should be escaped in rendered benchmark results");
  assert.ok((await js(cdp,"document.querySelector('#benchmark-results').textContent")).includes("<img src=x onerror=alert(1)>"));

  await js(cdp,"document.querySelector('#pilot-regression-run').click()");
  await wait(cdp,"document.querySelector('#pilot-regression-status')?.textContent.startsWith('Ferdig:')","synthetic pilot completion");
  const pilot=await js(cdp,"window.__fixture.calls.filter(x=>x.path==='/api/analyze-situation'||x.path==='/api/generate-guidance')");
  assert.deepEqual(pilot.map(x=>x.path),["/api/analyze-situation","/api/generate-guidance"]);
  assert.equal(JSON.parse(pilot[0].body).testMode,"pilot-regression");
  assert.equal(JSON.parse(pilot[1].body).testMode,"pilot-regression");
  assert.equal((await js(cdp,"window.__fixture.calls.filter(x=>x.path==='/api/admin/pilot-regression/result').length")),1);
  const beforeFull=await countPaid();
  await js(cdp,"(()=>{window.confirm=message=>{window.__fixture.fullConfirmation=message;return false;};document.querySelector('#production-regression-run').click()})()");
  await wait(cdp,"window.__fixture.calls.some(x=>x.path==='/api/admin/pilot-regression/cases'&&x.search==='?mode=full')","full-case fetch for confirmation");
  await wait(cdp,"Boolean(window.__fixture.fullConfirmation)","full-case confirmation");
  const fullText=await js(cdp,"window.__fixture.fullConfirmation");
  assert.ok(fullText.includes("3 saker")&&fullText.includes("6 KI-kall"),
    "Full regression confirmation must reflect the current golden case bank");
  assert.equal(await countPaid(),beforeFull,"Declined full regression must not invoke a paid provider");

  // Fail-closed when server disables paid paths, while free mock remains usable.
  await js(cdp,"(()=>{window.__fixture.liveEnabled=false;loadBenchmarkConfig()})()");
  await wait(cdp,"document.querySelector('#benchmark-run-live').disabled&&document.querySelector('#pilot-regression-run').disabled&&document.querySelector('#production-regression-run').disabled","paid controls disabled by server");
  assert.equal((await js(cdp,"document.querySelector('#benchmark-case-set option[value=\\\"all\\\"]').textContent")),"Alle 3 saker");
  assert.deepEqual(await js(cdp,"window.__jsErrors"),[],"Synthetic benchmark path should not throw browser exceptions");
}
async function scenario(cdp,role){
  const script=await cdp.send("Page.addScriptToEvaluateOnNewDocument",{source:fixture(role)});
  try{
    await cdp.send("Page.navigate",{url:BASE+"?admin-test="+role});
    const name=role==="admin"?"Admin Test":role==="editor"?"Editor Test":"User Test";
    await wait(cdp,"document.readyState==='complete'&&document.querySelector('#profile-name')?.textContent==="+JSON.stringify(name),"load "+role);
    await verifyKeyboardDialogs(cdp,role);
    await js(cdp,"document.querySelector('#nav-admin')?.click()");
    if(role==="user"){
      await sleep(200);
      const v=await js(cdp,"({hidden:document.querySelector('#nav-admin').hidden,open:document.querySelector('#admin-view').classList.contains('active-view'),calls:window.__fixture.calls})");
      assert.equal(v.hidden,true);assert.equal(v.open,false);assert.equal(v.calls.length,0);return;
    }
    await wait(cdp,"document.querySelector('#admin-view')?.classList.contains('active-view')","nav "+role);
    if(role==="editor"){
      await wait(cdp,"document.querySelector('#admin-current-role')?.textContent==='Redaktør' && document.querySelector('#admin-users-card')?.hidden && document.querySelector('#admin-ai-card')?.hidden && document.querySelector('#admin-feedback-card')?.hidden","editor role gating completed");
      const v=await js(cdp,"({role:document.querySelector('#admin-current-role').textContent,users:document.querySelector('#admin-users-card').hidden,ai:document.querySelector('#admin-ai-card').hidden,feedback:document.querySelector('#admin-feedback-card').hidden,calls:window.__fixture.calls})");
      assert.equal(v.role,"Redaktør");assert.equal(v.users,true);assert.equal(v.ai,true);assert.equal(v.feedback,true);assert.equal(v.calls.length,0);
      await verifyContentEditingInChrome(cdp,role);return;
    }
    await wait(cdp,"document.querySelector('[data-admin-user=\"user-2\"] [data-save-admin-role]')&&document.querySelector('#admin-calls-30d')?.textContent==='17'","admin loaded");
    const v=await js(cdp,"({role:document.querySelector('#admin-current-role').textContent,disabled:document.querySelector('[data-admin-user=\"admin-current\"] [data-admin-role]').disabled,users:document.querySelector('#admin-users-card').hidden,ai:document.querySelector('#admin-ai-card').hidden,html:document.querySelector('#admin-users-list').innerHTML,feedback:document.querySelector('#admin-feedback-list').textContent,unsafe:document.querySelector('#admin-feedback-list img')!==null})");
    assert.equal(v.role,"Admin");assert.equal(v.disabled,true);assert.equal(v.users,false);assert.equal(v.ai,false);
    assert.ok(v.html.includes("&lt;script&gt;unsafe&lt;/script&gt;"));
    assert.ok(v.feedback.includes("<img src=x onerror=alert(1)>"));
    assert.equal(v.unsafe,false);
    await js(cdp,"(()=>{const row=document.querySelector('[data-admin-user=\"user-2\"]');row.querySelector('[data-admin-role]').value='editor';row.querySelector('[data-save-admin-role]').click()})()");
    await wait(cdp,"document.querySelector('#admin-users-message')?.className.includes('success')","role saved");
    const patches=await js(cdp,"window.__fixture.calls.filter(x=>x.method==='PATCH')");
    assert.equal(patches.length,1);assert.equal(patches[0].path,"/api/admin/users/user-2/role");assert.equal(JSON.parse(patches[0].body).role,"editor");
    await js(cdp,"(()=>{window.__fixture.status=403;const row=document.querySelector('[data-admin-user=\"user-2\"]');row.querySelector('[data-admin-role]').value='admin';row.querySelector('[data-save-admin-role]').click()})()");
    await wait(cdp,"document.querySelector('#admin-users-message')?.className.includes('error')","role denied");
    const err=await js(cdp,"({message:document.querySelector('#admin-users-message').textContent,disabled:document.querySelector('[data-admin-user=\"user-2\"] [data-save-admin-role]').disabled})");
    assert.equal(err.message,"Rolleendring avvist");assert.equal(err.disabled,false);
    await js(cdp,"(()=>{const input=document.querySelector('#admin-usage-include-tests');input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}))})()");
    await wait(cdp,"window.__fixture.calls.some(x=>x.path==='/api/admin/ai-usage'&&x.search==='?includeTests=1')","usage filter");
    await verifyContentEditingInChrome(cdp,role);
    await verifyBenchmarkIsolation(cdp);
    assert.deepEqual(await js(cdp,"window.__jsErrors"),[]);
  }finally{
    await cdp.send("Page.removeScriptToEvaluateOnNewDocument",{identifier:script.identifier});
  }
}
(async()=>{
  const demo=start(process.execPath,["scripts/sensor-demo.js"],{PORT:String(PORT),NODE_ENV:"test"});
  await ready(BASE+"api/public-config",demo,25);
  const chrome=start(browser(),[
    "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
    "--disable-background-networking","--no-first-run","--no-default-browser-check",
    "--remote-debugging-port="+DEBUG,"--user-data-dir="+path.join(temp,"profile"),"about:blank"
  ]);
  await ready("http://127.0.0.1:"+DEBUG+"/json/version",chrome,40);
  const targets=await (await fetch("http://127.0.0.1:"+DEBUG+"/json/list")).json();
  const tab=targets.find(x=>x.type==="page");assert.ok(tab?.webSocketDebuggerUrl);
  const cdp=await connect(tab.webSocketDebuggerUrl);
  await cdp.send("Page.enable");await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");await cdp.send("Network.setBypassServiceWorker",{bypass:true});
  await cdp.send("Emulation.setDeviceMetricsOverride",{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  for(const role of ["user","editor","admin"]){await scenario(cdp,role);console.log("Admin Chrome scenario "+role+": OK");}
  console.log("Admin browser: actual DOM navigation, role gating, escaping, PATCH success/error and usage checkbox OK");
})().catch(err=>{console.error("Admin browser FAILED:",err.stack||err);process.exitCode=1;}).finally(()=>{
  try{sock?.close();}catch{}
  for(const p of children)try{p.kill("SIGTERM");}catch{}
  try{fs.rmSync(temp,{recursive:true,force:true});}catch{}
});
