// Strict sensor path in the ACTUAL browser UI + local deterministic demo server.
// No external AI, real accounts, third-party data, or production deployment.
const assert = require("node:assert/strict");
const fs = require("node:fs"), os = require("node:os"), path = require("node:path");
const {spawn,execFileSync} = require("node:child_process");

const ROOT=path.resolve(__dirname,".."), PORT=33271, DEBUG=33272;
const BASE="http://127.0.0.1:"+PORT+"/";
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"sensor-journey-chrome-"));
const procs=[];let socket=null;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function start(exe,args,env={}){
  const p=spawn(exe,args,{cwd:ROOT,env:{...process.env,...env},stdio:["ignore","pipe","pipe"]});
  let tail="";
  for(const stream of [p.stdout,p.stderr]) stream.on("data",c=>tail=(tail+String(c)).slice(-3500));
  p.tail=()=>tail;procs.push(p);return p;
}
function browser(){
  for(const b of [process.env.CHROME_BIN,"google-chrome","google-chrome-stable","chromium","chromium-browser"].filter(Boolean)){
    try{return execFileSync("which",[b],{encoding:"utf8"}).trim();}catch{}
  }
  throw Error("Actual Chromium/Chrome is required for user-journey acceptance");
}
async function ready(url,process,seconds=30){
  for(let i=0;i<seconds*10;i++){
    if(process.exitCode!==null)throw Error("Process exited "+process.exitCode+" "+process.tail());
    try{const r=await fetch(url,{signal:AbortSignal.timeout(800)});if(r.ok)return;}catch{}
    await sleep(100);
  }
  throw Error("Endpoint timeout "+url+" "+process.tail());
}
async function connect(url){
  return new Promise((resolve,reject)=>{
    const ws=new WebSocket(url),pending=new Map();let seq=0;
    ws.addEventListener("open",()=>{
      socket=ws;
      resolve({send(method,params={}){
        const id=++seq;
        return new Promise((ok,fail)=>{
          pending.set(id,{ok,fail});ws.send(JSON.stringify({id,method,params}));
          setTimeout(()=>{if(pending.has(id)){pending.delete(id);fail(Error("CDP timeout "+method));}},15000).unref?.();
        });
      }});
    });
    ws.addEventListener("error",reject);
    ws.addEventListener("message",event=>{
      const x=JSON.parse(event.data),task=pending.get(x.id);
      if(!task)return;pending.delete(x.id);
      if(x.error)task.fail(Error(JSON.stringify(x.error)));else task.ok(x.result);
    });
    ws.addEventListener("close",()=>{for(const p of pending.values())p.fail(Error("CDP closed"));pending.clear();});
  });
}
async function js(cdp,expression){
  const x=await cdp.send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(x.exceptionDetails)throw Error("Browser exception: "+JSON.stringify(x.exceptionDetails));
  return x.result?.value;
}
async function keyboardActivate(cdp,selector){
  const target=await js(cdp,"(()=>{const el=document.querySelector("+JSON.stringify(selector)+");"+
    "if(!el)return {missing:true};el.focus({preventScroll:true});return {focused:document.activeElement===el,"+
    "tag:el.tagName,disabled:!!el.disabled,inert:!!el.closest('[inert]')}})()");
  assert.ok(target.focused && !target.disabled && !target.inert,
    "Keyboard activation target must be focusable and enabled: "+selector+" "+JSON.stringify(target));
  // CDP needs an explicit Enter character for the native click activation of
  // focused buttons in some headless Chrome versions; do not fake a DOM click.
  await cdp.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",
    windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:String.fromCharCode(13),unmodifiedText:String.fromCharCode(13)});
  await cdp.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
}
async function wait(cdp,expression,meaning){
  for(let i=0;i<160;i++){
    if(await js(cdp,"Boolean("+expression+")"))return;
    await sleep(100);
  }
  const state=await js(cdp,"({view:[...document.querySelectorAll('.view.active-view')].map(x=>x.id),profile:document.querySelector('#profile-name')?.textContent,logs:window.__sensorCalls,errors:window.__sensorErrors,notes:document.querySelector('#privacy-check')?.textContent,thinking:document.querySelector('#ai-thinking')?.textContent})");
  throw Error("Timed out waiting for "+meaning+": "+JSON.stringify(state));
}
async function serverHistory(){
  const r=await fetch(BASE+"api/history",{signal:AbortSignal.timeout(3000)});
  assert.equal(r.status,200);return (await r.json()).items;
}
const caseText="En medarbeider har hatt flere korte fraværsperioder. Jeg ønsker å avklare en god oppfølging i arbeidshverdagen.";
const followupQuestion="Hvordan følger jeg opp dersom medarbeideren er uenig?";
(async()=>{
  const demo=start(process.execPath,["scripts/sensor-demo.js"],{PORT:String(PORT),HOST:"127.0.0.1",NODE_ENV:"test",SENSOR_DEMO_CLARIFICATIONS:"1"});
  await ready(BASE+"api/public-config",demo);
  const chrome=start(browser(),[
    "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
    "--disable-background-networking","--no-first-run","--no-default-browser-check",
    "--remote-debugging-port="+DEBUG,"--user-data-dir="+path.join(tmp,"profile"),"about:blank"
  ]);
  await ready("http://127.0.0.1:"+DEBUG+"/json/version",chrome,40);
  const targets=await (await fetch("http://127.0.0.1:"+DEBUG+"/json/list")).json();
  const page=targets.find(t=>t.type==="page");assert.ok(page?.webSocketDebuggerUrl);
  const cdp=await connect(page.webSocketDebuggerUrl);
  await cdp.send("Page.enable");await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");await cdp.send("Network.setBypassServiceWorker",{bypass:true});
  await cdp.send("Emulation.setDeviceMetricsOverride",{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send("Page.addScriptToEvaluateOnNewDocument",{source:`(()=>{
    window.__sensorCalls=[];window.__sensorErrors=[];
    window.addEventListener('error',e=>window.__sensorErrors.push(String(e.message)));
    window.addEventListener('unhandledrejection',e=>window.__sensorErrors.push(String(e.reason)));
    const previous=window.fetch.bind(window);
    window.fetch=(input,options={})=>{
      const url=new URL(typeof input==='string'?input:input.url,location.href);
      if(url.pathname.startsWith('/api/')){
        let followups=null;
        if(url.pathname==='/api/generate-guidance' && typeof options.body==='string'){
          try{followups=JSON.parse(options.body).followups||null;}catch{}
        }
        window.__sensorCalls.push({path:url.pathname,method:String(options.method||'GET').toUpperCase(),followups});
      }
      return previous(input,options);
    };
  })();`});
  await cdp.send("Page.navigate",{url:BASE+"?sensor-journey=1"});
  await wait(cdp,"document.readyState==='complete' && document.querySelector('#profile-name')?.textContent?.includes('Sensor demo')","demo user login");
  await wait(cdp,"document.querySelector('#topic-grid .topic-card[data-topic-id=\\\"fravaer-oppfolging\\\"]')","real topic rendering");
  // Keyboard shortcut: Tab must expose the skip link and Enter must move
  // focus to the main landmark, without forcing keyboard users through the nav.
  assert.equal(await js(cdp,"document.querySelector('.skip-link')?.getAttribute('href')"),"#main-content");
  assert.equal(await js(cdp,"document.querySelector('#main-content')?.getAttribute('tabindex')"),"-1");
  await js(cdp,"document.activeElement?.blur()");
  await cdp.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Tab",code:"Tab",windowsVirtualKeyCode:9});
  await cdp.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Tab",code:"Tab",windowsVirtualKeyCode:9});
  const skip=await js(cdp,"(()=>{const x=document.activeElement;const r=x.getBoundingClientRect();return {name:x.className,visible:r.top>=0&&r.bottom<=window.innerHeight,focused:x.matches(':focus'),blocked:!!x.closest('[inert]')}})()");
  assert.equal(skip.name,"skip-link","Tab did not focus the first keyboard shortcut");
  assert.ok(skip.visible&&skip.focused&&!skip.blocked,"Skip-link is not visible and keyboard-focusable: "+JSON.stringify(skip));
  await cdp.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});
  await cdp.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});
  await wait(cdp,"document.activeElement?.id==='main-content'","Enter moves focus to main landmark");
  console.log("Keyboard accessibility: Tab -> visible skip link -> Enter -> main content: PASS");
  // The visual selected sidebar destination must also be announced to screen readers.
  assert.equal(await js(cdp,"document.querySelector('.nav-item[data-view=\\\"home\\\"]')?.getAttribute('aria-current')"),"page");
  // Desktop sidebar and mobile bottom navigation both contain Home.
  // Each navigation landmark may mark its own current destination.
  assert.equal(await js(cdp,"document.querySelectorAll('.sidebar .nav-item[aria-current=\\\"page\\\"]').length"),1);
  assert.equal(await js(cdp,"document.querySelectorAll('.mobile-bottom-nav .nav-item[aria-current=\\\"page\\\"]').length"),1);
  assert.equal((await serverHistory()).length,0,"Demo must begin with an empty history");
  await keyboardActivate(cdp,'#topic-grid [data-topic-id="fravaer-oppfolging"]');
  await wait(cdp,"document.querySelector('#topic-view')?.classList.contains('active-view') && document.activeElement?.id==='topic-title'","keyboard topic navigation focuses heading");
  assert.equal(await js(cdp,"document.querySelectorAll('.nav-item[aria-current=\\\"page\\\"]').length"),0,
    "When the detail view has no sidebar destination, do not announce a stale current page");
  assert.equal(await js(cdp,"document.querySelector('#topic-title').getAttribute('tabindex')"),"-1");
  await keyboardActivate(cdp,"#subtopic-grid .subtopic-card");
  await wait(cdp,"document.querySelector('#guidance-view')?.classList.contains('active-view') && document.activeElement?.id==='guidance-title'","keyboard subtopic navigation focuses guidance heading");
  // Browser history should move focus to the restored view, not leave it in
  // a now-hidden subtopic card or a stale element from the prior view.
  await js(cdp,"history.back()");
  await wait(cdp,"document.querySelector('#topic-view')?.classList.contains('active-view') && document.activeElement?.id==='topic-title'","browser back focuses topic heading");
  await js(cdp,"history.forward()");
  await wait(cdp,"document.querySelector('#guidance-view')?.classList.contains('active-view') && document.activeElement?.id==='guidance-title'","browser forward focuses guidance heading");
  console.log("Keyboard view focus: topic -> guidance -> browser back/forward: PASS");
  // An intentionally prefilled situation has its own explicit autofocus.
  // View-heading management must not override that existing product behavior.
  await js(cdp,"(()=>{showView('topic');const sub=currentTopic.subtopics[0];openGuidance(sub[0],sub[1],'En anonym situasjon om fravær.');})()");
  await wait(cdp,"document.querySelector('#guidance-view')?.classList.contains('active-view') && document.activeElement?.id==='situation'","prefilled situation retains textarea focus");
  // Strict privacy admission: a fictitious full name is blocked IN THE BROWSER
  // before analysis/guidance is allowed to leave the page.
  await js(cdp,"(()=>{const t=document.querySelector('#situation');t.value='Jeg skal snakke med Knut Hansen om fravær.';t.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#situation-form').requestSubmit()})()");
  await wait(cdp,"document.querySelector('#privacy-check')?.classList.contains('blocking') && document.querySelector('#situation')?.getAttribute('aria-invalid')==='true'","synthetic full name blocked by real privacy gateway");
  assert.equal(await js(cdp,"window.__sensorCalls.filter(x=>x.path==='/api/analyze-situation'||x.path==='/api/generate-guidance').length"),0,
    "A blocked name must not trigger any advice-provider request");
  await js(cdp,"(()=>{const t=document.querySelector('#situation');t.value="+JSON.stringify(caseText)+";t.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#situation-form').requestSubmit()})()");
  // Vi må ikke gå direkte til KI-råd når analysen faktisk trenger avklaring.
  await wait(cdp,"!document.querySelector('#followup-panel').hidden && document.querySelectorAll('#followup-questions [data-followup-question]').length===2","AI clarification questions shown in actual browser");
  assert.equal(await js(cdp,"window.__sensorCalls.filter(x=>x.path==='/api/generate-guidance').length"),0,
    "App must wait for clarification answers before generating guidance");
  await keyboardActivate(cdp,'#followup-questions [data-followup-choice="current_work_status"][data-value="Tilbake i full jobb"]');
  await keyboardActivate(cdp,'#followup-questions [data-followup-choice="support_need"][data-value="Forberede en samtale"]');
  await keyboardActivate(cdp,'#followup-questions [data-followup-choice="support_need"][data-value="Avklare arbeidsoppgaver"]');
  const selected=await js(cdp,"collectFollowupAnswers()");
  assert.deepEqual(selected,{
    current_work_status:"Tilbake i full jobb",
    support_need:["Forberede en samtale","Avklare arbeidsoppgaver"]
  },"Single-select and multi-select clarification answers must survive client serialization");
  await keyboardActivate(cdp,"#generate-guidance");
  await wait(cdp,"!document.querySelector('#prototype-result').hidden && document.querySelectorAll('#structured-guidance .guidance-card').length>=5","guidance from actual demo AI API after clarification");
  const submitted=await js(cdp,"window.__sensorCalls.find(x=>x.path==='/api/generate-guidance')?.followups");
  assert.deepEqual(submitted,selected,
    "The actual browser must send all selected clarification answers to the advice endpoint");
  console.log("AI clarification journey: dynamic questions -> keyboard single/multi-select -> server guidance with submitted answers: PASS");
  const core=await js(cdp,"({heading:document.querySelector('#guidance-title')?.textContent,opening:document.querySelector('#structured-guidance')?.textContent,ai:window.__sensorCalls.filter(x=>x.path==='/api/analyze-situation'||x.path==='/api/generate-guidance'),fallback:document.querySelector('#result-intro')?.textContent})");
  assert.ok(core.heading.toLowerCase().includes("fravær"));
  assert.ok(core.opening.includes("Forslag til åpning")&&core.opening.includes("Spørsmål som passer denne saken"));
  assert.deepEqual(core.ai.map(x=>x.path),["/api/analyze-situation","/api/generate-guidance"]);
  assert.ok(!/lokal reserve vises|ki-samtalestøtten feilet/i.test(core.fallback||""),"Advice silently fell back instead of using demo response");
  await wait(cdp,"document.querySelector('#conversation-thread') && document.querySelector('#open-simulation')","follow-up and simulator entry");
  await js(cdp,"(()=>{const x=document.querySelector('#continue-input');x.value="+JSON.stringify(followupQuestion)+";x.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#continue-form').requestSubmit()})()");
  await wait(cdp,"document.querySelectorAll('#conversation-thread .conversation-turn').length===2 && document.querySelector('#conversation-thread .formatted-reply')?.textContent?.includes('uenig')","follow-up reply with same context");
  await wait(cdp,"window.__sensorCalls.some(x=>x.path==='/api/history'&&x.method==='POST')","history saved by real client");
  await js(cdp,`(()=>{
    window.__sensorPrint='';
    const open=window.open;
    window.open=()=>({document:{write:s=>{window.__sensorPrint=s;},close:()=>{}},focus:()=>{},print:()=>{}});
    document.querySelector('#print-guidance').click();window.open=open;
  })()`);
  const print=await js(cdp,"window.__sensorPrint");
  assert.ok(print.includes("Forslag til samtalen")&&print.includes("Videre råd")&&print.includes(followupQuestion));
  assert.ok(print.includes("Forslag til åpning")&&!print.includes("undefined"),"Printed guidance must include content and context");

  await keyboardActivate(cdp,"#open-simulation");
  await wait(cdp,"document.querySelector('#simulation-view')?.classList.contains('active-view') && !document.querySelector('#simulation-panel').hidden && document.activeElement===document.querySelector('#simulation-view h1')","keyboard simulation focuses heading");
  await js(cdp,"document.querySelector('#start-simulation').click()");
  await wait(cdp,"!document.querySelector('#simulation-live').hidden","simulation started");
  await js(cdp,"(()=>{const t=document.querySelector('#simulation-input');t.value='Jeg ønsker å forstå hvordan du opplever fraværsoppfølgingen.';t.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#simulation-form').requestSubmit()})()");
  await wait(cdp,"document.querySelectorAll('#simulation-thread .simulation-bubble').length>=2 && !document.querySelector('#simulation-thread .simulation-waiting')","real simulator response");
  await js(cdp,"document.querySelector('#end-simulation').click()");
  await wait(cdp,"!document.querySelector('#simulation-feedback').hidden && document.querySelector('#simulation-feedback-content')?.textContent.includes('Du gjennomførte')","simulation feedback and reflection");
  // Rendering the reflection precedes the final awaited history POST. Wait for
  // the observable server result, not an arbitrary timeout or DOM-only success.
  let rows=[];
  for(let i=0;i<120;i++){
    rows=await serverHistory();
    if(rows.length===1 && rows[0].simulation?.feedback?.worked_well?.length &&
       rows[0].simulation?.turns?.some(x=>x.role==='leader'))break;
    await sleep(50);
  }
  assert.equal(rows.length,1,"One real journey should be persisted as one conversation");
  const saved=rows[0];
  assert.ok(saved.id);
  assert.equal(saved.situation,caseText);
  assert.ok(saved.guidance?.opening&&saved.analysis?.summary);
  assert.ok(saved.conversation?.some(x=>x.role==='user'&&x.text===followupQuestion));
  assert.ok(saved.simulation?.feedback?.worked_well?.length);
  assert.ok(saved.simulation?.turns?.some(x=>x.role==='leader'));

  await cdp.send("Page.navigate",{url:BASE+"?sensor-journey=reload"});
  await wait(cdp,"document.readyState==='complete' && document.querySelector('#profile-name')?.textContent?.includes('Sensor demo')","page reload with demo session");
  await keyboardActivate(cdp,'.nav-item[data-view="history"]');
  await wait(cdp,"document.querySelector('.nav-item[data-view=\\\"history\\\"]')?.getAttribute('aria-current')===\'page\'","history sidebar aria-current");
  await wait(cdp,"document.querySelector('#history-view')?.classList.contains('active-view') && document.activeElement===document.querySelector('#history-view h1') && document.querySelectorAll('#history-list [data-open-history]').length===1","keyboard history navigation");
  await keyboardActivate(cdp,"#history-list [data-open-history]");
  await wait(cdp,"document.querySelector('#guidance-view')?.classList.contains('active-view') && document.querySelector('#situation')?.value.length>0 && document.activeElement?.id==='guidance-title'","keyboard open saved guidance focuses meaningful heading");
  assert.ok((await js(cdp,"document.querySelector('#guidance-title')?.textContent||''")).includes("fravær") ||
    (await js(cdp,"document.querySelector('#guidance-title')?.textContent||''")).includes("Fravær"),
    "Reopened history must have a meaningful, announced heading");
  console.log("Keyboard view focus: simulation, saved history and reopened guidance: PASS");
  assert.equal(await js(cdp,"document.querySelector('#situation').value"),caseText);
  assert.equal(await js(cdp,"document.querySelectorAll('#conversation-thread .conversation-turn').length"),2);
  await js(cdp,"document.querySelector('.nav-item[data-view=\\\"history\\\"]').click()");
  await wait(cdp,"document.querySelectorAll('#history-list [data-delete-history]').length===1","history for deletion");
  await js(cdp,"(()=>{window.confirm=()=>true;document.querySelector('#history-list [data-delete-history]').click()})()");
  await wait(cdp,"document.querySelector('#history-list .history-empty')?.textContent?.includes('ingen lagrede samtaler')","history deleted from actual UI");
  assert.deepEqual(await serverHistory(),[],"Deleting in browser must remove demo history on server");
  const exportResponse=await fetch(BASE+"api/account/export");
  assert.equal(exportResponse.status,200);
  assert.equal((await exportResponse.json()).conversations.length,0,"Deleted conversation must not survive in account export");
  // The server history and account export are the authoritative deletion evidence.
  // Browser fetch-call traces reset on reload and are not a persistence assertion.
  assert.deepEqual(await js(cdp,"window.__sensorErrors"),[],"No uncaught browser errors in saved/reopened history");
  console.log("Sensor browser journey: topic -> situation -> answered clarifications -> advice -> follow-up -> printed advice -> simulation -> reflection -> saved/reloaded history -> delete -> export empty: OK");
  console.log("Proof: real Chrome DOM + real local Express sensor demo; no real AI/auth/Supabase/provider.");
})().catch(error=>{console.error("Sensor browser journey FAILED:",error.stack||error);process.exitCode=1;}).finally(()=>{
  try{socket?.close();}catch{}
  for(const p of procs)try{p.kill("SIGTERM");}catch{}
  try{fs.rmSync(tmp,{recursive:true,force:true});}catch{}
});
