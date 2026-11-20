// Pure ledger contract: no paid API, credentials, DB or HTTP.
const assert=require("node:assert/strict");
const { pathToFileURL }=require("node:url");
const path=require("node:path");
const ID="f6e3eb7e-f630-43ed-941c-c664b6f2a010";
const OTHER="ac2d24e1-899e-4516-a518-9dd9119bc013";
(async()=>{
  const {createBenchmarkBudgetLedger}=await import(pathToFileURL(path.resolve("src/server/benchmark-budget.js")).href);
  const input=(runId=ID,caseId="B001",budgetUsd=0.3,userId="admin-1")=>
    ({userId,runId,caseId,model:"gpt-5.6-luna",budgetUsd});
  let date="2026-11-20T12:00:00Z";
  const ledger=createBenchmarkBudgetLedger({clock:()=>new Date(date)});
  for(const b of [-1,0,0.009,5.01,NaN,Infinity,0.333,undefined,"1",null]){
    const r=ledger.reserve({...input(ID,"bad-"+String(b)),budgetUsd:b});
    assert.equal(r.ok,false,"invalid budget accepted: "+String(b));
    assert.equal(r.status,400);
  }
  assert.equal(ledger.reserve(input("not-a-uuid")).error,"INVALID_BENCHMARK_BUDGET");
  const first=ledger.reserve({...input(),spentSoFar:-99999});
  assert.equal(first.ok,true);
  assert.equal(first.runReservedUsd,0.1);
  assert.equal(ledger.reserve(input(ID,"B002")).error,"BUDGET_RUN_BUSY","Parallel same-run calls must be rejected before provider use");
  assert.equal(ledger.reserve(input(OTHER,"B002")).error,"BUDGET_RUN_BUSY","Parallel cross-run calls for one user must also be denied");
  assert.equal(ledger.reserve(input(ID,"B001",0.4)).error,"BUDGET_RUN_MISMATCH");
  const otherUser=ledger.reserve(input(OTHER,"B001",0.1,"other-admin"));
  assert.equal(otherUser.ok,true,"Different owners must have independent budgets");
  ledger.settle(otherUser.ticket,null);
  const settled=ledger.settle(first.ticket,0.01);
  assert.equal(settled.chargedUsd,0.1,"Do not refund reservation based on low estimate");
  assert.throws(()=>ledger.settle(first.ticket,0.1),/allerede avsluttet/);
  assert.equal(ledger.reserve(input(ID,"B001")).error,"BUDGET_DUPLICATE_CASE");
  const second=ledger.reserve({...input(ID,"B002"),spentSoFar:0});
  assert.equal(second.ok,true,"A forged spentSoFar must never change the accumulated server ledger");
  ledger.settle(second.ticket,0.08);
  const third=ledger.reserve({...input(ID,"B003"),spentSoFar:0});
  assert.equal(third.ok,true);
  ledger.settle(third.ticket,0.001);
  assert.equal(ledger.reserve(input(ID,"B004")).error,"BUDGET_LIMIT","Run budget must stop additional calls");
  assert.equal(ledger.reserve(input(ID,"B004",0.31)).error,"BUDGET_RUN_MISMATCH","No raising the run budget after start");
  const next=ledger.reserve(input(OTHER,"B010",5));
  assert.equal(next.ok,true,"New run can use remaining daily allocation");
  const accounting=ledger.settle(next.ticket,0.25);
  assert.equal(accounting.chargedUsd,0.25,"Charge actual estimate exceeding reservation");
  assert.equal(accounting.userDayReservedUsd,0.55);
  assert.equal(ledger.reserve(input(OTHER,"B010",5)).error,"BUDGET_DUPLICATE_CASE");

  const daily=createBenchmarkBudgetLedger();
  // Starting a fresh runId must NOT reset the user/day spending cap.
  for(let i=0;i<50;i++){
    const p=daily.reserve(input(OTHER,"B"+String(i),5));
    assert.equal(p.ok,true,"Daily request "+i+" should fit");
    daily.settle(p.ticket,null); // unknown cost burns the entire allowance
  }
  assert.equal(daily.reserve(input(ID,"new-run",5)).error,"BUDGET_LIMIT","New run IDs must not bypass the per-user daily cap");
  assert.equal(daily.reserve(input(ID,"new-run",5,"unrelated-user")).ok,true,"Other user should keep separate daily budget");

  const expensive=createBenchmarkBudgetLedger({clock:()=>new Date(date)});
  const one=expensive.reserve(input(ID,"B001",0.1));
  const over=expensive.settle(one.ticket,0.18);
  assert.equal(over.overBudget,true,"Expensive actual response must be flagged as overspend");
  assert.equal(expensive.reserve(input(ID,"B002",0.1)).error,"BUDGET_LIMIT");
  const failed=createBenchmarkBudgetLedger();
  const err=failed.reserve(input(ID,"B001",0.1));
  assert.equal(failed.settle(err.ticket,NaN).chargedUsd,0.1,"Unknown provider cost must not be refunded");
  assert.equal(failed.reserve(input(ID,"B002",0.1)).error,"BUDGET_LIMIT");
  date="2026-11-21T12:00:00Z";
  assert.equal(ledger.reserve(input(ID,"B001")).error,"BUDGET_RUN_MISMATCH","Do not replay an old run across days");
  assert.equal(ledger.reserve(input("0d5c6ab3-9c2e-4027-964d-8a953912ec50","new-day")).ok,true,"New day may accept new run");
  console.log("Benchmark budget ledger: validation, atomic reservations, two users, spoofing, overlap, daily limit, provider cost overrun, no refund, duplicate and day rollover: OK");
})().catch(e=>{console.error(e);process.exitCode=1;});
