// Only the actual service-role RPC adapter is evaluated; no network or Supabase mutation.
const assert=require("node:assert/strict");
const {pathToFileURL}=require("node:url");
const path=require("node:path");
const userId="c07792a1-447b-4caf-a144-565a50159d75";
const runId="f6e3eb7e-f630-43ed-941c-c664b6f2a010";
const ticket="d427b975-0c19-4794-8ef3-2adcfc417197";

(async()=>{
  const {createBenchmarkRpcBudgetLedger}=await import(pathToFileURL(path.resolve("src/server/benchmark-budget-rpc.js")).href);
  const sent=[];
  let next={data:{ok:true,ticket,reserved_cents:10,run_charged_cents:10,day_charged_cents:10},error:null};
  const ledger=createBenchmarkRpcBudgetLedger({rpc:async(name,args)=>{sent.push({name,args});return next;}});
  const entry={userId,runId,caseId:"B001",model:"gpt-5.6-luna",budgetUsd:0.3};
  for(const bad of [null,undefined,Infinity,"0.3",0.009,0.333,5.001,-1]){
    const a=await ledger.reserve({...entry,budgetUsd:bad});
    assert.equal(a.ok,false,String(bad));
    assert.equal(a.error,"INVALID_BENCHMARK_BUDGET");
  }
  assert.equal(sent.length,0,"Malformed budgets must be rejected before RPC");
  assert.equal((await ledger.reserve({...entry,userId:"forged-user"})).status,400);
  assert.equal((await ledger.reserve({...entry,runId:"invalid"})).status,400);
  assert.equal((await ledger.reserve({...entry,caseId:"x".repeat(81)})).status,400);
  assert.equal((await ledger.reserve({...entry,model:"".repeat(1)})).status,400);
  assert.equal(sent.length,0);
  const r=await ledger.reserve({...entry,spentSoFar:-1e9});
  assert.equal(r.ok,true);
  assert.equal(r.ticket,ticket);
  assert.equal(r.runReservedUsd,0.1);
  assert.equal(sent.length,1);
  assert.equal(sent[0].name,"benchmark_budget_reserve");
  assert.deepEqual(sent[0].args,{
    p_user_id:userId,p_run_id:runId,p_case_id:"B001",
    p_model:"gpt-5.6-luna",p_budget_cents:30
  });
  next={data:{ok:false,error:"BUDGET_RUN_BUSY"},error:null};
  const busy=await ledger.reserve(entry);
  assert.equal(busy.ok,false);
  assert.equal(busy.status,409);
  assert.equal(busy.error,"BUDGET_RUN_BUSY");
  next={data:{ok:false,error:"INVALID_BENCHMARK_BUDGET"},error:null};
  assert.equal((await ledger.reserve(entry)).status,400);

  next={data:{ok:true,charged_cents:14,run_charged_cents:14,day_charged_cents:14,over_budget:false},error:null};
  const settled=await ledger.settle(ticket,0.131,{userId,outcome:"success"});
  assert.equal(settled.chargedUsd,0.14);
  assert.equal(settled.runReservedUsd,0.14);
  assert.equal(sent.at(-1).name,"benchmark_budget_settle");
  assert.deepEqual(sent.at(-1).args,{
    p_user_id:userId,p_ticket:ticket,p_actual_cents:14,p_outcome:"success"
  });
  await ledger.settle(ticket,undefined,{userId,outcome:"failed"});
  assert.equal(sent.at(-1).args.p_actual_cents,null,"Unknown usage must be passed through as unknown");
  assert.equal(sent.at(-1).args.p_outcome,"failed");

  next={data:{ok:true,already_settled:true,status:"success",charged_cents:14},error:null};
  assert.equal((await ledger.settle(ticket,0.1,{userId,outcome:"success"})).alreadySettled,true);
  const count=sent.length;
  await assert.rejects(()=>ledger.settle(ticket,0.1,{userId:"user-controlled",outcome:"success"}),
    /utilgjengelig|kan ikke bekrefte/);
  assert.equal(sent.length,count);

  for(const invalid of [
    {data:null,error:{code:"PGRST202"}},
    {data:{ok:false,error:"FAKE_VALIDATION_BYPASS"},error:null},
    {data:{ok:true,ticket:"bad",reserved_cents:10,run_charged_cents:10,day_charged_cents:10},error:null},
    {data:{ok:true,ticket,reserved_cents:9,run_charged_cents:9,day_charged_cents:9},error:null}
  ]){
    next=invalid;
    await assert.rejects(()=>ledger.reserve(entry),e=>e.code==="BENCHMARK_LEDGER_UNAVAILABLE");
  }
  const throws=createBenchmarkRpcBudgetLedger({rpc:async()=>{throw Error("broken connection");}});
  await assert.rejects(()=>throws.reserve(entry),e=>e.code==="BENCHMARK_LEDGER_UNAVAILABLE");
  assert.throws(()=>createBenchmarkRpcBudgetLedger(),/RPC/);
  console.log("Benchmark RPC adapter: UUID/cent validation, service-only arguments, budget denial, idempotent settlement, fail-closed PostgREST outage: OK");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
