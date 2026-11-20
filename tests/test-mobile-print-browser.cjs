// Real headless mobile touch emulation and Chrome printable PDF from actual UI.
// No real users or provider calls, physical device review still required.
// Strict sensor path in the ACTUAL browser UI + local deterministic demo server.
// No external AI, real accounts, third-party data, or production deployment.
const assert = require("node:assert/strict");
const fs = require("node:fs"), os = require("node:os"), path = require("node:path");
const {spawn,execFileSync} = require("node:child_process");

const ROOT=path.resolve(__dirname,".."), PORT=33471, DEBUG=33472;
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

async function setMobile(cdp,width,height) {
  await cdp.send("Emulation.setDeviceMetricsOverride",{width,height,screenWidth:width,
    screenHeight:height,deviceScaleFactor:2,mobile:true});
  await cdp.send("Emulation.setTouchEmulationEnabled",{enabled:true,maxTouchPoints:1});
}
async function touch(cdp,selector) {
  await js(cdp,"(()=>{const el=document.querySelector("+JSON.stringify(selector)+");"+
    "if(el)el.scrollIntoView({behavior:'instant',block:'center',inline:'nearest'})})()");
  // The app enables smooth scrolling in some layouts; hit-test only after
  // the scrolling and responsive visual viewport have settled.
  await sleep(220);
  const value=await js(cdp,"(()=>{const el=document.querySelector("+JSON.stringify(selector)+");"+
    "if(!el)return {error:'missing'};const r=el.getBoundingClientRect();"+
    "const x=r.left+r.width/2,y=r.top+r.height/2;const hit=document.elementFromPoint(x,y);"+
    "return {x,y,rect:{top:r.top,bottom:r.bottom,width:r.width,height:r.height},"+
    "blocker:hit?.tagName+'#'+(hit?.id||''),viewport:window.innerHeight,"+
    "found:!!(hit&&(hit===el||el.contains(hit)))}})()");
  assert.ok(value.found,"Touch target blocked or hidden: "+selector+" "+JSON.stringify(value));
  await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:value.x,y:value.y}]});
  await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
}
(async()=>{
  const demo=start(process.execPath,["scripts/sensor-demo.js"],{PORT:String(PORT),HOST:"127.0.0.1",NODE_ENV:"test"});
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
  await cdp.send("Page.addScriptToEvaluateOnNewDocument",{
    source:"window.__mobileErrors=[];window.addEventListener('error',e=>window.__mobileErrors.push(e.message));window.addEventListener('unhandledrejection',e=>window.__mobileErrors.push(String(e.reason)));"
  });
  for(const [width,height] of [[320,700],[390,844],[768,1024]]) {
    await setMobile(cdp,width,height);
    await cdp.send("Page.navigate",{url:BASE+"?mobile-print="+width});
    await wait(cdp,"document.readyState==='complete' && document.querySelector('#profile-name')?.textContent?.includes('Sensor demo')","mobile login at "+width);
    await wait(cdp,"document.querySelector('#topic-grid [data-topic-id]')","topics rendered "+width);
    const layout=await js(cdp,"(()=>{const r=document.querySelector('#profile-button').getBoundingClientRect();return {width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,visual:window.visualViewport.width,profile:{left:r.left,right:r.right},errors:window.__mobileErrors}})()");
    assert.ok(Math.abs(layout.visual-width)<3,"Broken real mobile viewport: "+JSON.stringify(layout));
    assert.ok(layout.scroll-layout.width<=2,"Horizontal overflow "+width+": "+JSON.stringify(layout));
    assert.ok(layout.profile.left>=-1&&layout.profile.right<=width+1,"Profile off-screen "+width+": "+JSON.stringify(layout));
    assert.deepEqual(layout.errors,[],"Mobile JavaScript exception "+width);
    console.log("Mobile viewport "+width+" x "+height+": no horizontal document overflow, profile visible: PASS");
  }
  await setMobile(cdp,390,844);
  await cdp.send("Page.navigate",{url:BASE+"?mobile-print=touch"});
  await wait(cdp,"document.querySelector('#topic-grid [data-topic-id=\"fravaer-oppfolging\"]')","touch topic available");
  await touch(cdp,"#topic-grid [data-topic-id=\"fravaer-oppfolging\"]");
  await wait(cdp,"document.querySelector('#topic-view')?.classList.contains('active-view')","touch opened topic");
  await touch(cdp,"#subtopic-grid .subtopic-card");
  await wait(cdp,"document.querySelector('#guidance-view')?.classList.contains('active-view')","touch opened subtopic");
  await js(cdp,"(()=>{const x=document.querySelector('#situation');x.value="+JSON.stringify(caseText)+";x.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#situation-form').requestSubmit()})()");
  await wait(cdp,"!document.querySelector('#prototype-result').hidden && document.querySelectorAll('#structured-guidance .guidance-card').length>=5","mobile guidance");
  const layout=await js(cdp,"({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,errors:window.__mobileErrors})");
  assert.ok(layout.scroll-layout.width<=2,"Mobile advice causes horizontal overflow "+JSON.stringify(layout));
  await js(cdp,"(()=>{const x=document.querySelector('#continue-input');x.value="+JSON.stringify(followupQuestion)+";x.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#continue-form').requestSubmit()})()");
  await wait(cdp,"document.querySelectorAll('#conversation-thread .conversation-turn').length===2","mobile follow-up reply");
  const html=await js(cdp,"(()=>{let html='';const original=window.open;window.open=()=>({document:{write:s=>{html=s},close:()=>{}},focus:()=>{},print:()=>{}});try{document.querySelector('#print-guidance').click()}finally{window.open=original}return html})()");
  assert.ok(html.startsWith("<!doctype html>"),"Actual UI did not generate print markup");
  for(const phrase of ["Forslag til samtalen","Videre råd","Forslag til åpning",followupQuestion,caseText])
    assert.ok(html.includes(phrase),"Print markup missing "+phrase);
  await cdp.send("Page.navigate",{url:"data:text/html;base64,"+Buffer.from(html).toString("base64")});
  await wait(cdp,"document.readyState==='complete' && document.querySelector('h1')?.textContent?.includes('Forslag til samtalen')","printed document loaded");
  await cdp.send("Emulation.setEmulatedMedia",{media:"print"});
  const state=await js(cdp,"({advice:document.querySelectorAll('.advice-section').length,followups:document.querySelectorAll('.followup-item').length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth})");
  assert.ok(state.advice>=5&&state.followups===1,"Print preview lost advice/follow-up "+JSON.stringify(state));
  assert.ok(state.overflow<=2,"Print HTML horizontally clipped "+JSON.stringify(state));
  const result=await cdp.send("Page.printToPDF",{
    printBackground:true,preferCSSPageSize:true,paperWidth:8.27,paperHeight:11.69,
    marginTop:0.4,marginBottom:0.4,marginLeft:0.35,marginRight:0.35
  });
  assert.equal(typeof result.data,"string","Chrome printToPDF returned no PDF data");
  const pdf=Buffer.from(result.data,"base64");
  assert.ok(pdf.subarray(0,5).toString()==="%PDF-"&&pdf.length>6000,
    "Chromium could not produce nonempty A4 PDF");
  const info=execFileSync("pdfinfo",["-"],{input:pdf,encoding:"utf8",timeout:10000});
  const pages=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
  assert.ok(Number.isInteger(pages)&&pages>=1&&pages<=8,"Invalid/oversized print PDF, pages="+pages);
  const extracted=execFileSync("pdftotext",["-layout","-","-"],{
    input:pdf,encoding:"utf8",timeout:10000
  });
  for(const phrase of ["Forslag til samtalen","Videre råd","Forslag til åpning","Hvordan følger jeg opp","En medarbeider har hatt"])
    assert.ok(extracted.includes(phrase),"Rendered PDF loses text "+phrase);
  assert.ok(!/undefined|\[object Object\]/.test(extracted),"PDF has serialization artifacts");
  console.log("Mobile touch at 390px: topic, subtopic, advice and follow-up through real Chrome: PASS");
  console.log("Actual print popup -> Chrome print media -> "+pages+" page PDF with extractable main/follow-up text: PASS");
  console.log("Limitations: Mobile device emulation, NOT physical Android; PDF preview, NOT a paper printer test.");
})().catch(e=>{console.error("Mobile/print acceptance FAILED:",e.stack||e);process.exitCode=1;}).finally(()=>{
  try{socket?.close();}catch{}
  for(const p of procs)try{p.kill("SIGTERM");}catch{}
  try{fs.rmSync(tmp,{recursive:true,force:true});}catch{}
});
