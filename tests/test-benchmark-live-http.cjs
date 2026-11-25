// Ekte Express + ekte OpenAI SDK mot lokal fake, ikke en ekte provider.
// NODE_ENV=test og TEST_BENCHMARK_LIVE=1 er KUN gyldig i den isolerte prosessen.
const assert=require("node:assert/strict");
const http=require("node:http");
const path=require("node:path");
const {pathToFileURL}=require("node:url");
const {spawn}=require("node:child_process");

const root=path.resolve(__dirname,"..");
const appPort=32941,authPort=32942,providerPort=32943;
const base="http://127.0.0.1:"+appPort, mockUrl="http://127.0.0.1:"+authPort;
let providerCalls=0, usageWrites=0, benchmarkWrites=0, mode="ok", delayMs=0;
const sleep=ms=>new Promise(done=>setTimeout(done,ms));
const send=(res,status,body)=>{res.writeHead(status,{"content-type":"application/json"});res.end(JSON.stringify(body));};
const actor={id:"c07792a1-447b-4caf-a144-565a50159d75",email:"synthetic-admin@example.invalid",
  app_metadata:{role:"admin"},user_metadata:{username:"synthetic-admin"},created_at:"2026-11-20T12:00:00.000Z"};
const auth=http.createServer(async(req,res)=>{
  const url=new URL(req.url,mockUrl);
  if(url.pathname==="/auth/v1/user")return send(res,200,actor);
  if(url.pathname==="/rest/v1/benchmark_results" && req.method==="GET")return send(res,200,[]);
  if(url.pathname==="/rest/v1/ai_usage_log" && req.method==="POST"){
    for await(const _ of req){}
    usageWrites++;
    return send(res,201,[]);
  }
  if(url.pathname==="/rest/v1/benchmark_results" && req.method==="POST"){
    for await(const _ of req){}
    benchmarkWrites++;
    return send(res,201,{id:"synthetic-result"});
  }
  return send(res,500,{message:"Unexpected fake Supabase path: "+url.pathname});
});
const provider=http.createServer(async(req,res)=>{
  providerCalls++;
  for await(const _ of req){}
  if(delayMs)await sleep(delayMs);
  if(mode==="429")return send(res,429,{error:{type:"rate_limit_error",message:"Synthetic provider throttle",code:"TEST_429"}});
  if(mode==="503")return send(res,503,{error:{type:"server_error",message:"Synthetic provider unavailable",code:"TEST_503"}});
  return send(res,200,{
    id:"resp_benchmark_fake",object:"response",model:"gpt-5.6-luna",
    output_text:"Dette er et syntetisk og kostnadsfritt testsvar.",
    output:[{id:"msg_fake",type:"message",role:"assistant",status:"completed",
      content:[{type:"output_text",text:"Dette er et syntetisk og kostnadsfritt testsvar.",annotations:[]}]}],
    usage:{input_tokens:120,output_tokens:180,total_tokens:300}
  });
});
let stderr="";
async function call(caseId,runId,budgetUsd=0.1,spentSoFar=0){
  const res=await fetch(base+"/api/admin/benchmark/live",{
    method:"POST",
    headers:{"content-type":"application/json",Origin:base,
      Cookie:"samtalestotte_access=local-admin-access; samtalestotte_refresh=local-admin-refresh"},
    body:JSON.stringify({caseId,model:"gpt-5.6-luna",runId,budgetUsd,spentSoFar}),
    signal:AbortSignal.timeout(12000)
  });
  return {status:res.status,body:await res.json().catch(()=>({}))};
}
const ID1="f6e3eb7e-f630-43ed-941c-c664b6f2a010",ID2="ac2d24e1-899e-4516-a518-9dd9119bc013",
  ID3="df7c0a8c-a42f-4c1d-9e03-87ce9956a4a1";
(async()=>{
  await Promise.all([new Promise(done=>auth.listen(authPort,"127.0.0.1",done)),
    new Promise(done=>provider.listen(providerPort,"127.0.0.1",done))]);
  const app=spawn(process.execPath,[
    "--import",pathToFileURL(path.join(root,"tests/support/offline-openai-fetch.mjs")).href,
    path.join(root,"server.js")
  ],{cwd:root,env:{
    ...process.env,NODE_ENV:"test",PORT:String(appPort),APP_BASE_URL:base,
    SUPABASE_URL:mockUrl,SUPABASE_PUBLISHABLE_KEY:"local-synthetic-key",
    SUPABASE_SECRET_KEY:"local-synthetic-secret",
    OPENAI_API_KEY:"local-only-not-real",OPENROUTER_API_KEY:"",
    OPENAI_MODEL:"gpt-5.6-luna",TEST_AUTH_BYPASS:"0",ADMIN_EMAILS:"",
    TEST_BENCHMARK_LIVE:"1",TEST_FAKE_OPENAI_PORT:String(providerPort)
  },stdio:["ignore","pipe","pipe"]});
  app.stderr.on("data",x=>stderr=(stderr+x.toString()).slice(-4000));
  try{
    let ready=false;
    for(let i=0;i<90;i++){
      if(app.exitCode!==null)throw Error("App exited "+app.exitCode+": "+stderr);
      try{const r=await fetch(base+"/api/public-config",{signal:AbortSignal.timeout(750)});if(r.ok){ready=true;break;}}catch{}
      await sleep(100);
    }
    assert.ok(ready,"App not ready: "+stderr);
    const cookies={Cookie:"samtalestotte_access=local-admin-access; samtalestotte_refresh=local-admin-refresh"};
    const cfg=await fetch(base+"/api/admin/benchmark/cases",{headers:cookies});
    assert.equal(cfg.status,200);
    const info=await cfg.json();
    assert.equal(info.liveEnabled,true);
    assert.equal(info.storageReady,true);
    assert.ok(info.totalCases>=110);
    const realCaseIds=info.cases.slice(0,8).map(x=>x.id);
    assert.equal(new Set(realCaseIds).size,8);
    const [a,b,c,d,e,f,g,h]=realCaseIds;

    assert.equal((await call(a,"not-valid",0.1)).body.error,"INVALID_BENCHMARK_BUDGET");
    assert.equal(providerCalls,0,"Invalid run must not call provider");
    delayMs=300;
    const pending=call(a,ID1,0.3);
    // Hold first call in provider to trigger synchronous in-process reservation.
    for(let i=0;i<60&&providerCalls===0;i++)await sleep(15);
    assert.equal(providerCalls,1,"First call must reach local fake provider");
    const parallel=await call(b,ID2,0.3);
    assert.equal(parallel.status,409);
    assert.equal(parallel.body.error,"BUDGET_RUN_BUSY");
    assert.equal(providerCalls,1,"Parallel call must be blocked before provider");
    const first=await pending;
    assert.equal(first.status,200,"Synthetic provider success: "+JSON.stringify(first.body));
    assert.equal(first.body.model,"gpt-5.6-luna");
    delayMs=0;
    assert.equal(providerCalls,1);

    const forged=await call(b,ID1,0.3,-100000);
    assert.equal(forged.status,200,"Server-led accounting must ignore spoofed spentSoFar");
    const repeat=await call(b,ID1,0.3,0);
    assert.equal(repeat.body.error,"BUDGET_DUPLICATE_CASE");
    const third=await call(c,ID1,0.3,0);
    assert.equal(third.status,200,"Third reservation should fit 0.30 budget");
    assert.equal((await call(d,ID1,0.3,0)).body.error,"BUDGET_LIMIT");
    assert.equal(providerCalls,3,"No provider call after budget exhausted");
    assert.equal((await call(d,ID1,0.5,0)).body.error,"BUDGET_RUN_MISMATCH");
    assert.equal(providerCalls,3);

    mode="429";
    const failed=await call(e,ID2,0.1,0);
    assert.equal(failed.status,429,"Provider 429 should be propagated to admin test");
    assert.equal(failed.body.error,"BENCHMARK_FAILED");
    const blocked=await call(f,ID2,0.1,0);
    assert.equal(blocked.body.error,"BUDGET_LIMIT","Provider errors must consume a reservation");
    assert.equal(providerCalls,4);

    mode="ok";
    const saved=await call(g,ID3,0.1,0);
    assert.equal(saved.status,200);
    assert.ok(benchmarkWrites>=4);
    assert.ok(usageWrites>=4);
    assert.equal(providerCalls,5);
    console.log("Benchmark live HTTP: fake OpenAI SDK, server spend authority, parallel lock, exhausted budget, forged spent, duplicate, provider 429, storage: OK");
    console.log("Real provider calls: 0; local simulator calls: "+providerCalls);
  }finally{
    app.kill("SIGTERM");
    await Promise.all([new Promise(done=>auth.close(done)),new Promise(done=>provider.close(done))]);
  }
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
