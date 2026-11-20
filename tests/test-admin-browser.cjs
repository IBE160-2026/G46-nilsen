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
async function wait(cdp,expression,title){
  for(let i=0;i<140;i++){
    if(await js(cdp,"Boolean("+expression+")"))return;
    await sleep(100);
  }
  throw Error("Timeout: "+title+"; state="+JSON.stringify(await js(cdp,"({profile:document.querySelector('#profile-name')?.textContent,view:document.querySelector('#admin-view')?.className,calls:window.__fixture?.calls,errors:window.__jsErrors})")));
}
function fixture(role){return "(()=>{\nconst role=ROLE_LITERAL,realFetch=window.fetch.bind(window);\nwindow.__jsErrors=[];\nwindow.addEventListener('error',e=>window.__jsErrors.push(String(e.message)));\nwindow.addEventListener('unhandledrejection',e=>window.__jsErrors.push(String(e.reason)));\nconst state={role,calls:[],status:200};window.__fixture=state;\nconst fake=(data,status=200)=>Promise.resolve(new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}}));\nwindow.fetch=(input,opt={})=>{\n const url=new URL(typeof input==='string'?input:input.url,location.href),p=url.pathname,method=String(opt.method||'GET').toUpperCase();\n if(p==='/api/auth/me')return fake({user:{id:'admin-current',username:role==='admin'?'Admin Test':role==='editor'?'Editor Test':'User Test',email:'synthetic@example.invalid',role}});\n if(p.startsWith('/api/admin/')){\n  state.calls.push({path:p,search:url.search,method,body:opt.body||null});\n  if(role!=='admin')return fake({message:'Forbidden'},403);\n  if(p==='/api/admin/users'&&method==='GET')return fake({users:[{id:'admin-current',username:'Admin Test',email:'admin@example.invalid',role:'admin'},{id:'user-2',username:'<script>unsafe</script>',email:'user&test@example.invalid',role:'user'}]});\n  if(p==='/api/admin/users/user-2/role'&&method==='PATCH')return state.status===200?fake({ok:true}):fake({message:'Rolleendring avvist'},state.status);\n  if(p==='/api/admin/ai-feedback')return fake({items:[{category:'<label>',surface:'main-guidance',created_at:'2026-11-20T09:00:00Z',comment:'<img src=x onerror=alert(1)>',include_conversation:false}]});\n  if(p==='/api/admin/ai-settings')return fake({models:[{id:'model-a',label:'Test Model',tier:'standard',inputPerMillion:1,outputPerMillion:2}],activeModel:'model-a'});\n  if(p==='/api/admin/ai-usage')return fake({summary:{cost24h:0.25,cost7d:1.5,cost30d:2,calls30d:17},topDomains:[],topQueries:[],topPages:[],recent:[]});\n  if(p==='/api/admin/survey')return fake({count:0,averages:{},responses:[]});\n  if(p==='/api/admin/survey/settings')return fake({enabled:true});\n  if(p==='/api/admin/benchmark/cases')return fake({totalCases:0,totalSubtopics:0,cases:[],models:[],storageReady:false});\n  return fake({message:'Unmocked test endpoint '+p},404);\n }\n return realFetch(input,opt);\n};\n})();".replace("ROLE_LITERAL",JSON.stringify(role));}
async function scenario(cdp,role){
  const script=await cdp.send("Page.addScriptToEvaluateOnNewDocument",{source:fixture(role)});
  try{
    await cdp.send("Page.navigate",{url:BASE+"?admin-test="+role});
    const name=role==="admin"?"Admin Test":role==="editor"?"Editor Test":"User Test";
    await wait(cdp,"document.readyState==='complete'&&document.querySelector('#profile-name')?.textContent==="+JSON.stringify(name),"load "+role);
    await js(cdp,"document.querySelector('#nav-admin')?.click()");
    if(role==="user"){
      await sleep(200);
      const v=await js(cdp,"({hidden:document.querySelector('#nav-admin').hidden,open:document.querySelector('#admin-view').classList.contains('active-view'),calls:window.__fixture.calls})");
      assert.equal(v.hidden,true);assert.equal(v.open,false);assert.equal(v.calls.length,0);return;
    }
    await wait(cdp,"document.querySelector('#admin-view')?.classList.contains('active-view')","nav "+role);
    if(role==="editor"){
      const v=await js(cdp,"({role:document.querySelector('#admin-current-role').textContent,users:document.querySelector('#admin-users-card').hidden,ai:document.querySelector('#admin-ai-card').hidden,feedback:document.querySelector('#admin-feedback-card').hidden,calls:window.__fixture.calls})");
      assert.equal(v.role,"Redaktør");assert.equal(v.users,true);assert.equal(v.ai,true);assert.equal(v.feedback,true);assert.equal(v.calls.length,0);return;
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
