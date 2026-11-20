// Browsersammenligning av beregnede stiler, mot en låst, grønn referansecommit.
// Kjører KUN lokal deterministisk demo (to git worktrees); ingen prod, login eller ekte KI.
// Krever Chrome/Chromium på runner og Node >=22 med innebygget WebSocket.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, execFileSync } = require("node:child_process");
const assert = require("node:assert/strict");

const REF = process.env.CSS_BROWSER_BASELINE || "8b084af4bacf21c1b4c65a456e5fb3e0587ec57e";
const PORT_A = 32970, PORT_B = 32971, DEBUG = 32972;
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(),"samtalestotte-css-check-"));
const baseline = path.join(temp,"baseline");
const userDir = path.join(temp,"chrome-profile");
let processes = [], cdpsocket = null, worktree = false;
function launch(exe,args,opts={}) {
  const c = spawn(exe,args,{cwd:opts.cwd || root,env:{...process.env,...opts.env},stdio:["ignore","pipe","pipe"]});
  let tail = "";
  for(const s of [c.stderr,c.stdout]) s.on("data",data => {tail=(tail+data.toString()).slice(-1800)});
  c.tail = () => tail;
  processes.push(c);
  return c;
}
function findBrowser() {
  for(const b of [process.env.CHROME_BIN,"google-chrome","google-chrome-stable","chromium","chromium-browser"].filter(Boolean)) {
    try { return execFileSync("which",[b],{encoding:"utf8"}).trim(); }
    catch {}
  }
  throw new Error("Chromium / Google Chrome mangler på runner. Dette er en REELL testfeil.");
}
async function waitHttp(url,child,seconds=18) {
  for(let i=0;i<seconds*10;i++){
    if(child.exitCode!==null) throw new Error("Child exited while waiting for "+url+": "+child.tail());
    try {const r=await fetch(url,{signal:AbortSignal.timeout(700)});if(r.ok)return;}
    catch {}
    await sleep(100);
  }
  throw new Error("HTTP server not ready: "+url+"; "+child.tail());
}
function connect(wsUrl){
  return new Promise((resolve,reject)=>{
    const ws=new WebSocket(wsUrl);let seq=0;const pending=new Map();
    ws.addEventListener("open",()=>{
      cdpsocket=ws;
      resolve({
        async send(method,params={}){
          const id=++seq;
          return await new Promise((resolve,reject)=>{
            pending.set(id,{resolve,reject});
            ws.send(JSON.stringify({id,method,params}));
            setTimeout(()=>{
              if(pending.has(id)){pending.delete(id);reject(new Error("CDP timeout: "+method));}
            },12000).unref?.();
          });
        }
      });
    });
    ws.addEventListener("message",e=>{
      let data=JSON.parse(e.data);
      if(!data.id)return;
      const waiter=pending.get(data.id);if(!waiter)return;pending.delete(data.id);
      if(data.error)waiter.reject(new Error(JSON.stringify(data.error)));
      else waiter.resolve(data.result);
    });
    ws.addEventListener("error",reject);
    ws.addEventListener("close",()=>{
      for(const waiter of pending.values())waiter.reject(new Error("CDP closed"));
      pending.clear();
    });
  });
}
async function evaluate(cdp,src){
  const r=await cdp.send("Runtime.evaluate",{expression:src,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails)throw new Error("Browser evaluation: "+JSON.stringify(r.exceptionDetails));
  return r.result?.value;
}
// The candidate adds two deliberate keyboard-accessibility elements. Exclude only
// those new nodes from the historical index-based comparison; the separate real
// keyboard-journey test verifies their behavior. All pre-existing DOM nodes stay covered.
const cssProps=[
  "display","position","visibility","opacity","overflow","overflow-x","overflow-y",
  "width","height","min-width","max-width","min-height","max-height",
  "padding","margin","border","border-radius","box-shadow","background-color","background-image",
  "color","font-size","font-family","font-weight","line-height","letter-spacing",
  "grid-template-columns","grid-template-rows","grid-area","grid-column","grid-row",
  "flex-direction","flex","flex-wrap","align-items","justify-content","gap",
  "transform","filter","object-fit","text-align","white-space","content","z-index",
  "top","right","bottom","left","box-sizing","outline","text-decoration-line"
];
const pages=["topic-view","guidance-view","simulation-view","help-view","history-view"];
const widths=[390,768,1440];
const themes=["light","dark","hybrid"];
const states=["expanded","collapsed"];
async function capture(cdp,baseUrl,width,theme,state,view,media="screen",openDetails=false) {
  await cdp.send("Emulation.setEmulatedMedia",{media});
  await cdp.send("Emulation.setDeviceMetricsOverride",{
    width,height:900,deviceScaleFactor:1,mobile:false
  });
  await cdp.send("Page.navigate",{url:baseUrl});
  for(let i=0;i<80;i++){
    const okay=await evaluate(cdp,"document.readyState === 'complete'");
    if(okay)break;
    await sleep(90);
  }
  await evaluate(cdp,"document.fonts.ready.then(() => true)");
  await sleep(220);
  const expression="(()=>{"+
    "document.documentElement.dataset.theme="+JSON.stringify(theme)+";"+
    "const sidebar=document.querySelector('.sidebar');"+
    "sidebar?.classList.toggle('sidebar-collapsed',"+(state==="collapsed")+");"+
    "document.querySelector('.app-shell')?.classList.toggle('sidebar-collapsed-layout',"+(state==="collapsed")+");"+
    "for(const v of document.querySelectorAll('.view'))v.classList.toggle('active',v.id==="+JSON.stringify(view)+");"+
    "if("+JSON.stringify(openDetails)+"){document.querySelectorAll('#help-view details').forEach(d=>d.open=true);}"+
    "document.querySelector('#auth-dialog')?.setAttribute('hidden','');"+
    "document.querySelector('#auth-dialog')?.classList.remove('is-open');"+
    "const style=document.createElement('style');style.textContent='*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';document.head.appendChild(style);"+
    "const props="+JSON.stringify(cssProps)+";"+
    // Nye Help-seksjoner finnes bare i etterversjonen. Sammenlign fortsatt alle eksisterende noder.
    "const all=[...document.querySelectorAll('body *:not(.skip-link):not(.main-skip-target)')].filter(e=>!e.closest('.leader-reference,.leader-reference-section,.help-contact-entry'));"+
    "const result={};"+
    "all.forEach((e,i)=>{const rect=e.getBoundingClientRect();if(rect.width<0.5||rect.height<0.5)return;"+
    "const st=getComputedStyle(e),x=props.map(p=>st.getPropertyValue(p));"+
    "const bef=getComputedStyle(e,'::before'),aft=getComputedStyle(e,'::after');"+
    "result[i]=[x,bef.content,bef.display,bef.color,aft.content,aft.display,aft.color,"+
    "Math.round(rect.x*10)/10,Math.round(rect.y*10)/10,Math.round(rect.width*10)/10,Math.round(rect.height*10)/10];});"+
    "return {elements:all.length,visible:Object.keys(result).length,result};})()";
  return await evaluate(cdp,expression);
}
(async()=>{
  const chrome=findBrowser();
  execFileSync("git",["worktree","add","--detach",baseline,REF],{cwd:root,stdio:"pipe"});
  worktree=true;
  fs.symlinkSync(path.join(root,"node_modules"),path.join(baseline,"node_modules"),"dir");
  const a=launch(process.execPath,["scripts/sensor-demo.js"],{cwd:baseline,env:{PORT:String(PORT_A),NODE_ENV:"test"}});
  const b=launch(process.execPath,["scripts/sensor-demo.js"],{cwd:root,env:{PORT:String(PORT_B),NODE_ENV:"test"}});
  await Promise.all([
    waitHttp("http://127.0.0.1:"+PORT_A+"/api/public-config",a),
    waitHttp("http://127.0.0.1:"+PORT_B+"/api/public-config",b)
  ]);
  const chromeProcess=launch(chrome,[
    "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
    "--no-first-run","--no-default-browser-check","--remote-debugging-port="+DEBUG,
    "--user-data-dir="+userDir,"about:blank"
  ]);
  await waitHttp("http://127.0.0.1:"+DEBUG+"/json/version",chromeProcess,22);
  const list=await (await fetch("http://127.0.0.1:"+DEBUG+"/json/list")).json();
  const tab=list.find(t=>t.type==="page");
  assert.ok(tab?.webSocketDebuggerUrl,"No Chrome page target");
  const cdp=await connect(tab.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  let cases=0, diff=[];
  for(const width of widths)for(const theme of themes)for(const state of states)for(const page of pages){
    const left=await capture(cdp,"http://127.0.0.1:"+PORT_A+"/",width,theme,state,page);
    const right=await capture(cdp,"http://127.0.0.1:"+PORT_B+"/",width,theme,state,page);
    const keys=new Set([...Object.keys(left.result),...Object.keys(right.result)]);
    for(const key of keys){
      // Computed background-image URLs contain the local demo port, not a CSS difference.
      const canonical = obj => JSON.stringify(obj ?? null).replaceAll("http://127.0.0.1:"+PORT_A+"/","http://127.0.0.1:PORT/").replaceAll("http://127.0.0.1:"+PORT_B+"/","http://127.0.0.1:PORT/");
      const l=canonical(left.result[key]),r=canonical(right.result[key]);
      if(l!==r){diff.push({case:[width,theme,state,page],node:key,before:left.result[key],after:right.result[key]});if(diff.length>=12)break;}
    }
    if(diff.length>=12)break;
    cases++;
  }
  // Ekstra sammenligning i utskriftsmedia; dette er ikke en fysisk print-test.
  // Vi sammenligner den faktiske @media print-kaskaden mot låst referanse.
  if(!diff.length)for(const width of [390,1440])for(const page of ["guidance-view","help-view","history-view"]){
    const left=await capture(cdp,"http://127.0.0.1:"+PORT_A+"/",width,"light","expanded",page,"print");
    const right=await capture(cdp,"http://127.0.0.1:"+PORT_B+"/",width,"light","expanded",page,"print");
    const keys=new Set([...Object.keys(left.result),...Object.keys(right.result)]);
    for(const key of keys){
      const canonical=obj=>JSON.stringify(obj ?? null).replaceAll("http://127.0.0.1:"+PORT_A+"/","http://127.0.0.1:PORT/").replaceAll("http://127.0.0.1:"+PORT_B+"/","http://127.0.0.1:PORT/");
      if(canonical(left.result[key])!==canonical(right.result[key])){
        diff.push({case:["print",width,page],node:key,before:left.result[key],after:right.result[key]});
        if(diff.length>=12)break;
      }
    }
    if(diff.length>=12)break;
    cases++;
  }
  // Tester også åpne details-elementer i kildebankens visning, ikke bare standardtilstand.
  if(!diff.length)for(const width of [390,768,1440]){
    const left=await capture(cdp,"http://127.0.0.1:"+PORT_A+"/",width,"hybrid","expanded","help-view","screen",true);
    const right=await capture(cdp,"http://127.0.0.1:"+PORT_B+"/",width,"hybrid","expanded","help-view","screen",true);
    const keys=new Set([...Object.keys(left.result),...Object.keys(right.result)]);
    for(const key of keys){
      const canonical=obj=>JSON.stringify(obj ?? null).replaceAll("http://127.0.0.1:"+PORT_A+"/","http://127.0.0.1:PORT/").replaceAll("http://127.0.0.1:"+PORT_B+"/","http://127.0.0.1:PORT/");
      if(canonical(left.result[key])!==canonical(right.result[key])){
        diff.push({case:["open-help-details",width],node:key,before:left.result[key],after:right.result[key]});
        if(diff.length>=12)break;
      }
    }
    if(diff.length>=12)break;
    cases++;
  }
  if(diff.length){
    console.error("CSS browser regression: differences (first 12):",JSON.stringify(diff,null,2).slice(0,14000));
    throw new Error("Computed styles/geometry differ for "+diff.length+" sampled elements");
  }
  console.log("CSS browser parity OK: "+cases+" scenarios (90 screen + 6 print media + 3 open help details); widths 390/768/1440, three themes, expanded/collapsed sidebar, five views.");
})().catch(e=>{console.error("CSS browser parity failed:",e.stack||e);process.exitCode=1;}).finally(()=>{
  try{cdpsocket?.close();}catch{}
  for(const p of processes)try{p.kill("SIGTERM");}catch{}
  if(worktree)try{execFileSync("git",["worktree","remove","--force",baseline],{cwd:root,stdio:"pipe"});}catch(e){console.error(e.message)}
  try{fs.rmSync(temp,{recursive:true,force:true});}catch{}
});
