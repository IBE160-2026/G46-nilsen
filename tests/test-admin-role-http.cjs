// Faktisk Express-HTTP mot isolert, lokal Supabase Auth-fake.
// Ingen ekte brukere, database, nøkler eller eksterne nettverkskall.
// Tester serverens rollegrenser – IKKE ekte Supabase RLS eller ekte Auth.
const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");
const path = require("node:path");

const root=path.resolve(__dirname,"..");
const mockPort=32630,appPort=32631;
const mockUrl="http://127.0.0.1:"+mockPort;
const appUrl="http://127.0.0.1:"+appPort;
const actor=(id,name,role,userMetadata={})=>({
  id,email:name+"@example.invalid",
  app_metadata:{role},
  user_metadata:{username:name,...userMetadata},
  created_at:"2026-11-20T09:00:00.000Z"
});
const users={
  ordinary:actor("11111111-1111-4111-8111-111111111111","ordinary","user"),
  editor:actor("22222222-2222-4222-8222-222222222222","editor","editor"),
  admin:actor("33333333-3333-4333-8333-333333333333","admin","admin"),
  forged:actor("44444444-4444-4444-8444-444444444444","forged","user",{role:"admin",isAdmin:true}),
  invalid:actor("55555555-5555-4555-8555-555555555555","invalid","superadmin"),
  target:actor("66666666-6666-4666-8666-666666666666","target","user")
};
users.target.app_metadata.protected_test_flag="keep";
const tokens=new Map(Object.entries(users).map(([name,user])=>["local-"+name+"-access",user]));
const calls=[];
const contentWrites=[];
let rejectContentWrites=false;
const json=(res,status,data)=>{
  res.writeHead(status,{"Content-Type":"application/json"});
  res.end(JSON.stringify(data));
};
async function parseBody(req){
  let text="";
  for await(const part of req)text+=part.toString();
  return text?JSON.parse(text):{};
}
const mock=http.createServer(async (req,res)=>{
  const url=new URL(req.url,mockUrl);
  const token=String(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
  const user=tokens.get(token);
  if(url.pathname==="/auth/v1/user"&&req.method==="GET"){
    return user?json(res,200,user):json(res,401,{message:"Invalid JWT",code:"bad_jwt"});
  }
  if(url.pathname==="/auth/v1/token")return json(res,400,{message:"Invalid refresh token"});
  if(url.pathname==="/auth/v1/admin/users"&&req.method==="GET"){
    calls.push({type:"admin-list"});
    return json(res,200,{users:Object.values(users),aud:"authenticated",next_page:null});
  }
  if(url.pathname.startsWith("/auth/v1/admin/users/")){
    const id=decodeURIComponent(url.pathname.slice("/auth/v1/admin/users/".length));
    const found=Object.values(users).find(x=>x.id===id);
    calls.push({type:"admin-user",method:req.method,id});
    if(!found)return json(res,404,{message:"User not found"});
    if(req.method==="GET")return json(res,200,{user:found});
    if(req.method==="PUT"){
      const body=await parseBody(req);
      assert.deepEqual(Object.keys(body),["app_metadata"],"Role changes must only touch app_metadata");
      found.app_metadata={...body.app_metadata};
      return json(res,200,{user:found});
    }
  }
  // Isolated PostgREST upsert – only for explicit content editor HTTP tests.
  if(url.pathname==="/rest/v1/content_overrides"&&req.method==="POST"){
    if(rejectContentWrites)return json(res,404,{code:"42P01",message:"relation public.content_overrides does not exist"});
    const body=await parseBody(req);
    contentWrites.push({rows:body,conflict:url.searchParams.get("on_conflict")});
    calls.push({type:"content-write",method:req.method,path:url.pathname});
    return json(res,201,[]);
  }
  if(url.pathname.startsWith("/rest/v1/")){
    calls.push({type:"database",path:url.pathname,method:req.method});
    return json(res,500,{message:"Unexpected DB request in isolated role test"});
  }
  return json(res,404,{message:"Unexpected local mock path: "+url.pathname});
});
const sleep=ms=>new Promise(done=>setTimeout(done,ms));
async function request(route,who,method="GET",body,headers={}){
  const cookie=who?"samtalestotte_access=local-"+who+"-access; samtalestotte_refresh=local-"+who+"-refresh":null;
  const response=await fetch(appUrl+route,{
    method,
    headers:{
      "Content-Type":"application/json",
      Origin:appUrl,
      ...(cookie?{Cookie:cookie}:{}),
      ...headers
    },
    body:body===undefined?undefined:JSON.stringify(body),
    signal:AbortSignal.timeout(8000)
  });
  return {status:response.status,body:await response.json().catch(()=>({}))};
}
(async()=>{
  await new Promise(resolve=>mock.listen(mockPort,"127.0.0.1",resolve));
  let serverErrors="";
  const app=spawn(process.execPath,[path.join(root,"server.js")],{
    cwd:root,
    env:{
      ...process.env,
      NODE_ENV:"production",
      PORT:String(appPort),APP_BASE_URL:appUrl,
      SUPABASE_URL:mockUrl,
      SUPABASE_PUBLISHABLE_KEY:"isolated-public-key",
      SUPABASE_SECRET_KEY:"isolated-service-key",
      ADMIN_EMAILS:"",TEST_AUTH_BYPASS:"0",
      OPENAI_API_KEY:"",OPENROUTER_API_KEY:""
    },
    stdio:["ignore","pipe","pipe"]
  });
  app.stderr.on("data",buf=>serverErrors=(serverErrors+buf.toString()).slice(-4000));
  try{
    let ready=false;
    for(let i=0;i<110;i++){
      if(app.exitCode!==null)throw Error("Express exited: "+serverErrors);
      try{
        const r=await fetch(appUrl+"/api/public-config",{signal:AbortSignal.timeout(700)});
        if(r.ok){ready=true;break;}
      }catch{}
      await sleep(100);
    }
    assert.ok(ready,"Express was not ready: "+serverErrors);
    const guarded=[
      ["GET","/api/admin/users",undefined],
      ["PATCH","/api/admin/users/"+users.target.id+"/role",{role:"admin"}],
      ["GET","/api/admin/ai-feedback",undefined],
      ["GET","/api/admin/ai-settings",undefined],
      ["PUT","/api/admin/ai-settings",{model:"gpt-5.6-luna"}],
      ["GET","/api/admin/ai-usage",undefined],
      ["GET","/api/admin/benchmark/cases",undefined],
      ["POST","/api/admin/benchmark/mock",{}],
      ["GET","/api/admin/survey",undefined],
      ["PUT","/api/admin/survey/settings",{enabled:false}],
      ["POST","/api/admin/invites",{role:"admin"}],
      ["GET","/api/auth/diagnostic",undefined]
    ];
    let denied=0;
    for(const who of [null,"ordinary","editor","forged","invalid"]){
      for(const [method,route,body] of guarded){
        const r=await request(route,who,method,body);
        const expected=who===null?401:403;
        assert.equal(r.status,expected,method+" "+route+" "+(who||"anonymous")+": "+JSON.stringify(r.body));
        assert.equal(r.body.error,who===null?"AUTH_REQUIRED":"ADMIN_REQUIRED");
        denied++;
      }
    }
    assert.ok(!calls.some(x=>x.type==="admin-list"||x.type==="admin-user"),"Denied requests reached Supabase admin users API: "+JSON.stringify(calls));
    const editorContent=await request("/api/admin/content","editor","PUT",{values:null});
    assert.equal(editorContent.status,400,"Editor must pass requireContentEditor before validating input");
    assert.equal(editorContent.body.error,"INVALID_CONTENT");
    // Positive role-based writes must use the actual Express endpoint, not a browser mock.
    const editorWrite=await request("/api/admin/content","editor","PUT",{values:{
      "home.hero.title":"Oppdatert av redaktør",
      "privacy.intro":"Nytt personvern",
      "bad.key":"should not persist",
      "admin.system":"should not persist"
    }});
    assert.equal(editorWrite.status,200,"Editor should be able to persist allowed fields: "+JSON.stringify(editorWrite.body));
    assert.equal(editorWrite.body.saved,2);
    assert.equal(contentWrites.length,1);
    assert.equal(contentWrites[0].conflict,"content_key");
    assert.deepEqual(contentWrites[0].rows.map(x=>x.content_key).sort(),["home.hero.title","privacy.intro"]);
    assert.equal(contentWrites[0].rows.find(x=>x.content_key==="home.hero.title").content_value,"Oppdatert av redaktør");
    assert.ok(contentWrites[0].rows.every(x=>x.updated_by===users.editor.id));
    assert.ok(contentWrites[0].rows.every(x=>!Number.isNaN(Date.parse(x.updated_at))));
    const adminWrite=await request("/api/admin/content","admin","PUT",{values:{
      "contact.intro":"x".repeat(20024)
    }});
    assert.equal(adminWrite.status,200,"Admin should be able to persist allowed fields");
    assert.equal(adminWrite.body.saved,1);
    assert.equal(contentWrites.length,2);
    assert.equal(contentWrites[1].rows[0].content_value.length,20000,"Long text must be bounded on server");
    assert.equal(contentWrites[1].rows[0].updated_by,users.admin.id);
    const emptyWrite=await request("/api/admin/content","editor","PUT",{values:{"not-allowed":"ignore"}});
    assert.equal(emptyWrite.status,200);
    assert.equal(emptyWrite.body.saved,0);
    assert.equal(contentWrites.length,2,"No upsert when all keys are forbidden");
    rejectContentWrites=true;
    const dbFailure=await request("/api/admin/content","editor","PUT",{values:{"home.hero.title":"Should fail"}});
    rejectContentWrites=false;
    assert.equal(dbFailure.status,503,"Missing content table should be reported as setup error");
    assert.equal(dbFailure.body.error,"CONTENT_TABLE_MISSING");
    assert.equal(contentWrites.length,2,"Failed DB request must not count as persisted");

    const adminContent=await request("/api/admin/content","admin","PUT",{values:null});
    assert.equal(adminContent.status,400);
    for(const who of [null,"ordinary","forged","invalid"]){
      const r=await request("/api/admin/content",who,"PUT",{values:{"home.title":"forged"}});
      assert.equal(r.status,who===null?401:403,"Cannot modify editable content: "+who);
      assert.equal(r.body.error,who===null?"AUTH_REQUIRED":"EDITOR_REQUIRED");
    }
    // Den gratis fulltesten er et eget, adminbeskyttet og deterministisk endepunkt.
    // Verifiser at dette ikke kaller Auth Admin, PostgREST eller KI-tjenester.
    const callsBeforeMock=calls.length;
    const freeBenchmark=await request("/api/admin/benchmark/mock","admin","POST",{});
    assert.equal(freeBenchmark.status,200,"Gratis benchmark mock bør fungere uten KI-nøkkel: "+JSON.stringify(freeBenchmark.body));
    assert.equal(freeBenchmark.body.mode,"mock");
    assert.ok(Array.isArray(freeBenchmark.body.problems),"Mock må oppgi konkrete kvalitetsavvik, også når testbanken ikke består");
    assert.equal(freeBenchmark.body.ok,freeBenchmark.body.problems.length===0,
      "Mockens ok-flagg må samsvare med dokumenterte problemer");
    assert.equal(freeBenchmark.body.ok,true,"Den kostnadsfrie testbanken må bestå etter at navnefeil er løst: "+freeBenchmark.body.problems.join("; "));
    console.log("Gratis benchmark – bankkontroll:",JSON.stringify({ok:freeBenchmark.body.ok,problems:freeBenchmark.body.problems.slice(0,25)}));
    assert.ok(freeBenchmark.body.checks.cases>=100,"Mock skal bruke faktisk testbank");
    assert.equal(calls.length,callsBeforeMock,"Gratis fulltest må ikke bruke Auth Admin eller PostgREST");
    // Prod må være fail-closed: dette skal IKKE sende et betalt providerkall
    // selv om klienten later som om den ikke har brukt penger.
    const disabled=await request("/api/admin/benchmark/live","admin","POST",{
      caseId:"B001",model:"gpt-5.6-luna",
      runId:"f6e3eb7e-f630-43ed-941c-c664b6f2a010",
      budgetUsd:5,spentSoFar:0
    });
    assert.equal(disabled.status,503);
    assert.equal(disabled.body.error,"BENCHMARK_PAID_DISABLED");
    assert.equal((await request("/api/auth/diagnostic","admin")).status,200);
    assert.equal((await request("/api/auth/me","forged")).body.user.role,"user");
    assert.equal((await request("/api/auth/me","invalid")).body.user.role,"user");
    assert.equal((await request("/api/auth/me","editor")).body.user.role,"editor");
    const list=await request("/api/admin/users","admin");
    assert.equal(list.status,200,"Admin list failed: "+JSON.stringify(list.body));
    assert.ok(list.body.users.some(x=>x.id===users.target.id));
    assert.equal(list.body.users.find(x=>x.id===users.forged.id).role,"user");
    assert.equal(list.body.users.find(x=>x.id===users.invalid.id).role,"user");
    const patch="/api/admin/users/"+users.target.id+"/role";
    const before=calls.length;
    const self=await request("/api/admin/users/"+users.admin.id+"/role","admin","PATCH",{role:"user"});
    assert.equal(self.status,400);
    assert.equal(self.body.error,"SELF_ROLE_CHANGE");
    const invalidRole=await request(patch,"admin","PATCH",{role:"root"});
    assert.equal(invalidRole.status,400);
    assert.equal(invalidRole.body.error,"INVALID_ROLE");
    assert.equal(calls.length,before,"Self/invalid role validation should not call Supabase Admin API");
    const unknown=await request("/api/admin/users/00000000-0000-4000-8000-000000000099/role","admin","PATCH",{role:"editor"});
    assert.equal(unknown.status,404);
    assert.equal(unknown.body.error,"USER_NOT_FOUND");
    const update=await request(patch,"admin","PATCH",{role:"editor"});
    assert.equal(update.status,200,"Valid admin role change failed: "+JSON.stringify(update.body));
    assert.equal(update.body.user.role,"editor");
    assert.equal(users.target.app_metadata.role,"editor");
    assert.equal(users.target.app_metadata.protected_test_flag,"keep","Other app_metadata must be retained");
    assert.equal((await request("/api/auth/me","target")).body.user.role,"editor");
    const permittedRetentionRequests=new Set([
      "DELETE /rest/v1/ai_usage_log",
      "PATCH /rest/v1/ai_response_feedback",
      "DELETE /rest/v1/ai_response_feedback",
      "DELETE /rest/v1/benchmark_results",
      "DELETE /rest/v1/survey_responses",
      "DELETE /rest/v1/survey_participation"
    ]);
    assert.ok(calls.filter(x=>x.type==="database").every(x=>permittedRetentionRequests.has(x.method+" "+x.path)),
      "Unexpected database request beyond server retention cleanup: "+JSON.stringify(calls));
    console.log("Admin HTTP roles: "+denied+" denials; editor/admin content writes, field filtering, size limit, DB setup error, role changes: OK");
    console.log("Isolated local Auth only. No production records, live Supabase account, or actual RLS tested.");
  }finally{
    app.kill("SIGTERM");
    await new Promise(resolve=>mock.close(resolve));
  }
})().catch(e=>{console.error("Admin HTTP role regression failed:",e.stack||e);process.exitCode=1;});
