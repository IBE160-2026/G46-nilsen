// Integration: actual Express + Supabase JS RPC + OpenAI SDK, both remote services
// replaced by local loopback HTTP simulators. Real PostgreSQL is tested separately
// by GitHub's disposable-PostgreSQL CI job. Zero external provider traffic.
const assert=require("node:assert/strict");
const http=require("node:http");
const crypto=require("node:crypto");
const path=require("node:path");
const {spawn}=require("node:child_process");
const {pathToFileURL}=require("node:url");

const root=path.resolve(__dirname,"..");

const postgresContainer=process.env.BENCHMARK_PG_CONTAINER || "";
// Optional CI-only bridge: the local fake PostgREST HTTP endpoint invokes the
// ACTUAL service-role Postgres RPC in the disposable Docker container.
// It does not talk to hosted Supabase, does not expose the real service key,
// and does not approximate database transactions with JS logic.
async function callDisposablePostgres(name, args){
  if(!postgresContainer || !/^[a-f0-9]{12,64}$/i.test(postgresContainer)){
    throw Error("A disposable CI postgres container id is required");
  }
  const operations={
    benchmark_budget_reserve:[
      "(j->>'p_user_id')::uuid","(j->>'p_run_id')::uuid",
      "j->>'p_case_id'","j->>'p_model'","(j->>'p_budget_cents')::integer"
    ],
    benchmark_budget_settle:[
      "(j->>'p_user_id')::uuid","(j->>'p_ticket')::uuid",
      "(j->>'p_actual_cents')::bigint","j->>'p_outcome'"
    ]
  };
  if(!Object.hasOwn(operations,name))throw Error("Unknown test RPC "+name);
  // Base64 is safe to embed as a SQL literal and prevents interpolation of
  // user-supplied case/model strings into SQL.
  const encoded=Buffer.from(JSON.stringify(args),"utf8").toString("base64");
  const sql="SET ROLE service_role;\n"+
    "WITH params AS (SELECT convert_from(decode('"+encoded+"','base64'),'UTF8')::jsonb j) "+
    "SELECT public."+name+"("+operations[name].join(",")+")::text FROM params;\n";
  return new Promise((resolve,reject)=>{
    const p=spawn("docker",[
      "exec","-i",postgresContainer,"psql","-X","-q","-A","-t",
      "-v","ON_ERROR_STOP=1","-U","postgres","-d","test_rls"
    ],{stdio:["pipe","pipe","pipe"]});
    let stdout="",stderr="";
    p.stdout.on("data",x=>stdout+=String(x));
    p.stderr.on("data",x=>stderr+=String(x));
    p.on("error",reject);
    p.on("close",code=>{
      if(code!==0)return reject(Error("Disposable PostgreSQL RPC failed: "+stderr.slice(-300)));
      const line=stdout.trim().split("\n").at(-1);
      try{resolve(JSON.parse(line));}catch{reject(Error("Invalid disposable PostgreSQL RPC JSON: "+stdout.slice(-200)));}
    });
    p.stdin.end(sql);
  });
}

const appPort=32951,servicePort=32952,providerPort=32953;
const base="http://127.0.0.1:"+appPort, serviceUrl="http://127.0.0.1:"+servicePort;
const userId="c07792a1-447b-4caf-a144-565a50159d75";
const actor={id:userId,email:"synthetic-admin@example.invalid",
  app_metadata:{role:"admin"},user_metadata:{role:"user"},created_at:"2026-11-20T12:00:00Z"};
const runIds=[
  "f6e3eb7e-f630-43ed-941c-c664b6f2a010",
  "ac2d24e1-899e-4516-a518-9dd9119bc013",
  "df7c0a8c-a42f-4c1d-9e03-87ce9956a4a1",
  "9f972f7a-0394-4482-a079-11a4f386020a",
  "9fd918b4-8a07-4ae5-b356-d7a1b7a5514f",
  "0d5c6ab3-9c2e-4027-964d-8a953912ec50"
];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const send=(res,status,body)=>{
  res.writeHead(status,{"content-type":"application/json"});res.end(JSON.stringify(body));
};
async function read(req){
  let str="";for await(const chunk of req)str+=chunk;
  return str?JSON.parse(str):{};
}
let providerCalls=0,providerMode="success",providerDelay=0;
let reserveCalls=0,settleCalls=0,storageWrites=0;
let reserveUnavailable=false,settleUnavailable=false,storageUnavailable=false;
const events=[],tickets=new Map();
let stderr="";

(async()=>{
  const {createBenchmarkBudgetLedger}=await import(
    pathToFileURL(path.join(root,"src/server/benchmark-budget.js")).href);
  const mockBudget=createBenchmarkBudgetLedger();
  const useRealPostgres=Boolean(postgresContainer);

  const service=http.createServer(async(req,res)=>{
    const url=new URL(req.url,serviceUrl);
    if(url.pathname==="/auth/v1/user")return send(res,200,actor);
    if(url.pathname==="/rest/v1/benchmark_results"&&req.method==="GET")return send(res,200,[]);
    if(url.pathname==="/rest/v1/ai_usage_log"&&req.method==="POST"){
      await read(req);return send(res,201,[]);
    }
    if(url.pathname==="/rest/v1/benchmark_results"&&req.method==="POST"){
      storageWrites++;events.push("store");
      await read(req);
      if(storageUnavailable)return send(res,503,{code:"PGRST_TEST_STORAGE",message:"Synthetic storage outage"});
      return send(res,201,{id:"synthetic-result"});
    }
    if(url.pathname==="/rest/v1/rpc/benchmark_budget_reserve"&&req.method==="POST"){
      reserveCalls++;events.push("reserve");
      const body=await read(req);
      assert.equal(req.headers.apikey,"local-synthetic-service-only","RPC must use server secret not publishable key");
      if(reserveUnavailable)return send(res,503,{code:"RPC_UNAVAILABLE",message:"Synthetic RPC outage"});
      assert.deepEqual(Object.keys(body).sort(),["p_budget_cents","p_case_id","p_model","p_run_id","p_user_id"].sort());
      assert.equal(body.p_user_id,userId,"Never permit browser-supplied identity");
      if(useRealPostgres){
        try{return send(res,200,await callDisposablePostgres("benchmark_budget_reserve",body));}
        catch(e){return send(res,503,{code:"DISPOSABLE_PG_ERROR",message:e.message});}
      }
      const r=mockBudget.reserve({
        userId:body.p_user_id,runId:body.p_run_id,caseId:body.p_case_id,
        model:body.p_model,budgetUsd:body.p_budget_cents/100
      });
      if(!r.ok)return send(res,200,{ok:false,error:r.error});
      const ticket=crypto.randomUUID();
      tickets.set(ticket,{ticket:r.ticket,userId:body.p_user_id,settled:null});
      return send(res,200,{
        ok:true,ticket,reserved_cents:10,
        run_charged_cents:Math.round(r.runReservedUsd*100),
        day_charged_cents:Math.round(r.userDayReservedUsd*100)
      });
    }
    if(url.pathname==="/rest/v1/rpc/benchmark_budget_settle"&&req.method==="POST"){
      settleCalls++;events.push("settle");
      const body=await read(req);
      if(settleUnavailable)return send(res,503,{code:"RPC_SETTLE_FAILED",message:"Synthetic settle outage"});
      if(useRealPostgres){
        try{return send(res,200,await callDisposablePostgres("benchmark_budget_settle",body));}
        catch(e){return send(res,503,{code:"DISPOSABLE_PG_ERROR",message:e.message});}
      }
      const found=tickets.get(body.p_ticket);
      if(!found||found.userId!==body.p_user_id)return send(res,200,{
        ok:false,error:"UNKNOWN_BENCHMARK_TICKET"
      });
      if(found.settled)return send(res,200,found.settled);
      const estimated=body.p_actual_cents===null?null:body.p_actual_cents/100;
      const r=mockBudget.settle(found.ticket,estimated);
      found.settled={
        ok:true,status:body.p_outcome,already_settled:false,
        charged_cents:Math.round(r.chargedUsd*100),
        run_charged_cents:Math.round(r.runReservedUsd*100),
        day_charged_cents:Math.round(r.userDayReservedUsd*100),
        over_budget:r.overBudget
      };
      return send(res,200,found.settled);
    }
    return send(res,500,{message:"Unexpected local Supabase route "+url.pathname});
  });
  const provider=http.createServer(async(req,res)=>{
    providerCalls++;events.push("provider");
    await read(req);
    if(providerDelay)await sleep(providerDelay);
    if(providerMode==="429")return send(res,429,{
      error:{type:"rate_limit_error",message:"Synthetic rate limit",code:"TEST_429"}
    });
    return send(res,200,{
      id:"resp_fake",object:"response",model:"gpt-5.6-luna",
      output_text:"Fiktivt testsvar med null ekte kostnad.",
      output:[{id:"msg_fake",type:"message",role:"assistant",status:"completed",
        content:[{type:"output_text",text:"Fiktivt testsvar med null ekte kostnad.",annotations:[]}]}],
      usage:{input_tokens:120,output_tokens:180,total_tokens:300}
    });
  });

  await Promise.all([
    new Promise(done=>service.listen(servicePort,"127.0.0.1",done)),
    new Promise(done=>provider.listen(providerPort,"127.0.0.1",done))
  ]);
  const app=spawn(process.execPath,[
    "--import",path.join(root,"tests/support/offline-openai-fetch.mjs"),
    path.join(root,"server.js")
  ],{cwd:root,env:{
    ...process.env,NODE_ENV:"test",PORT:String(appPort),APP_BASE_URL:base,
    SUPABASE_URL:serviceUrl,
    SUPABASE_PUBLISHABLE_KEY:"local-synthetic-publishable",
    SUPABASE_SECRET_KEY:"local-synthetic-service-only",
    OPENAI_API_KEY:"local-fake-only",OPENROUTER_API_KEY:"",
    OPENAI_MODEL:"gpt-5.6-luna",TEST_AUTH_BYPASS:"0",ADMIN_EMAILS:"",
    TEST_BENCHMARK_LIVE:"1",TEST_BENCHMARK_LEDGER:"rpc",
    TEST_FAKE_OPENAI_PORT:String(providerPort)
  },stdio:["ignore","pipe","pipe"]});
  app.stderr.on("data",chunk=>stderr=(stderr+String(chunk)).slice(-5000));
  async function call(caseId,runId,budgetUsd=0.2,spentSoFar=0){
    const response=await fetch(base+"/api/admin/benchmark/live",{
      method:"POST",headers:{
        "content-type":"application/json",Origin:base,
        Cookie:"samtalestotte_access=fake-admin; samtalestotte_refresh=fake-refresh"
      },
      body:JSON.stringify({caseId,model:"gpt-5.6-luna",runId,budgetUsd,spentSoFar}),
      signal:AbortSignal.timeout(12000)
    });
    return {status:response.status,body:await response.json()};
  }
  try{
    let ready=false;
    for(let i=0;i<90;i++){
      if(app.exitCode!==null)throw Error("App exited "+app.exitCode+": "+stderr);
      try{
        const r=await fetch(base+"/api/public-config",{signal:AbortSignal.timeout(800)});
        if(r.ok){ready=true;break;}
      }catch{}
      await sleep(100);
    }
    assert.ok(ready,"App not ready "+stderr);
    const response=await fetch(base+"/api/admin/benchmark/cases",{
      headers:{Cookie:"samtalestotte_access=fake-admin; samtalestotte_refresh=fake-refresh"}
    });
    assert.equal(response.status,200);
    const info=await response.json();
    assert.equal(info.liveEnabled,true);
    const [a,b,c,d,e,f,g,h]=info.cases.slice(0,8).map(x=>x.id);
    assert.ok(h&&new Set([a,b,c,d,e,f,g,h]).size===8);
    const invalid=await call(a,"not-a-valid-run-id",0.2);
    assert.equal(invalid.status,400);
    assert.equal(providerCalls,0);
    assert.equal(reserveCalls,0,"Client invalid data must not reach RPC");

    const ok=await call(a,runIds[0],0.2,-9999);
    assert.equal(ok.status,200,"Result cannot be success until both RPC calls: "+JSON.stringify(ok.body));
    assert.equal(reserveCalls,1);assert.equal(providerCalls,1);
    assert.equal(storageWrites,1);assert.equal(settleCalls,1);
    assert.deepEqual(events.filter(x=>["reserve","provider","store","settle"].includes(x)),
      ["reserve","provider","store","settle"]);
    const repeated=await call(a,runIds[0],0.2,0);
    assert.equal(repeated.status,409);
    assert.equal(repeated.body.error,"BUDGET_DUPLICATE_CASE");
    assert.equal(providerCalls,1);

    providerDelay=320;
    const pending=call(b,runIds[1],0.2);
    for(let i=0;i<60&&providerCalls===1;i++)await sleep(15);
    assert.equal(providerCalls,2,"Pending provider call not started");
    const busy=await call(c,runIds[2],0.2);
    assert.equal(busy.status,409);
    assert.equal(busy.body.error,"BUDGET_RUN_BUSY");
    assert.equal(providerCalls,2);
    assert.equal((await pending).status,200);
    providerDelay=0;

    reserveUnavailable=true;
    const beforeProvider=providerCalls;
    const denied=await call(d,runIds[2],0.1);
    assert.equal(denied.status,503);
    assert.equal(denied.body.error,"BENCHMARK_LEDGER_UNAVAILABLE");
    assert.equal(providerCalls,beforeProvider);
    reserveUnavailable=false;

    providerMode="429";
    const rate=await call(e,runIds[3],0.1);
    assert.equal(rate.status,429);
    assert.equal(rate.body.error,"BENCHMARK_FAILED");
    assert.ok(useRealPostgres || tickets.size>=3);
    providerMode="success";
    storageUnavailable=true;
    const storage=await call(f,runIds[4],0.1);
    assert.equal(storage.status,503);
    assert.equal(storage.body.error,"BENCHMARK_STORAGE_MISSING");
    storageUnavailable=false;

    settleUnavailable=true;
    const unconfirmed=await call(g,runIds[5],0.2);
    assert.equal(unconfirmed.status,503);
    assert.equal(unconfirmed.body.error,"BENCHMARK_SETTLEMENT_UNCONFIRMED");
    const after=providerCalls;
    const halted=await call(h,runIds[2],0.1);
    assert.equal(halted.status,409);
    assert.equal(halted.body.error,"BUDGET_RUN_BUSY");
    assert.equal(providerCalls,after,"Unsettled RPC ticket must prevent a new provider call");
    assert.ok(settleCalls>=5);
    console.log("Benchmark RPC HTTP: actual Express/Supabase JS/OpenAI SDK with fake RPC and provider, sequencing, concurrency, 429, storage and settlement outages: OK");
    console.log("RPC persistence: "+(useRealPostgres?"actual disposable PostgreSQL":"synthetic JS ledger"));
    console.log("Real provider calls: 0; fake provider calls: "+providerCalls);
  }finally{
    app.kill("SIGTERM");
    await Promise.all([new Promise(resolve=>service.close(resolve)),new Promise(resolve=>provider.close(resolve))]);
  }
})().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
