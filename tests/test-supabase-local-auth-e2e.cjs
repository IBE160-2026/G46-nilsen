// Integration against the *actual* local Supabase Auth (GoTrue), PostgREST and
// PostgreSQL/RLS stack started by Supabase CLI in a disposable CI environment.
// Never use this script with a hosted project or real user records.
const assert = require("node:assert/strict");
const {spawn} = require("node:child_process");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const port = 32977;
const appUrl = "http://127.0.0.1:" + port;
const supabaseUrl = process.env.SUPABASE_URL || "";
const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";
const secretKey = process.env.SUPABASE_SECRET_KEY || "";
const delay = ms => new Promise(resolve => setTimeout(resolve,ms));
function checkIsolation() {
  if (process.env.SUPABASE_AUTH_LOCAL_CI !== "1") throw Error("Requires isolated local Supabase CI flag");
  const url = new URL(supabaseUrl);
  if (url.protocol !== "http:" || url.hostname !== "127.0.0.1" ||
      !/^(54321|[0-9]{5})$/.test(url.port) || url.pathname !== "/")
    throw Error("Refusing non-local Supabase URL");
  if (!anonKey || !secretKey) throw Error("Missing local-only CLI keys");
}
function readCookies(response) {
  const list = response.headers.getSetCookie?.() || [];
  const cookies = list.map(item => item.split(";")[0]).filter(Boolean);
  const access = cookies.find(x => x.startsWith("samtalestotte_access="));
  const refresh = cookies.find(x => x.startsWith("samtalestotte_refresh="));
  assert.ok(access && refresh, "Express must issue access + refresh cookies");
  assert.ok(list.every(item => item.includes("HttpOnly") && item.includes("SameSite=Lax")));
  return access + "; " + refresh;
}
async function api(url, cookie, method="GET", json) {
  const response = await fetch(appUrl + url, {
    method,
    headers:{
      ...(cookie ? {Cookie:cookie}:{}),
      Origin: appUrl,
      ...(json===undefined ? {}:{"content-type":"application/json"})
    },
    body:json===undefined?undefined:JSON.stringify(json),
    signal:AbortSignal.timeout(10000)
  });
  let body;
  try {body=await response.json();} catch {body=null;}
  return {response, status:response.status, body};
}
async function waitForExpress(child, stderr) {
  for(let i=0;i<150;i++){
    if(child.exitCode!==null)throw Error("Express exited "+child.exitCode+": "+stderr());
    try {
      const response=await fetch(appUrl+"/api/public-config",{signal:AbortSignal.timeout(800)});
      if(response.ok)return;
    } catch {}
    await delay(100);
  }
  throw Error("Express did not become ready: "+stderr());
}
(async()=>{
  checkIsolation();
  const {createClient} = await import("@supabase/supabase-js");
  const opts={auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}};
  const admin=createClient(supabaseUrl,secretKey,opts);
  const anon=createClient(supabaseUrl,anonKey,opts);
  const users=[];
  let child,errors="";
  try {
    const unique=String(process.pid)+"-"+String(Date.now());
    const create=async(name,role="user",userMetadata={})=>{
      const email=name+"-"+unique+"@test.example.com";
      const password="Local!"+unique+"-Case9";
      const {data,error}=await admin.auth.admin.createUser({
        email,password,email_confirm:true,
        app_metadata:{role},
        user_metadata:{username:name,...userMetadata}
      });
      if(error||!data?.user?.id)throw Error("Real local GoTrue user creation failed: "+(error?.message||"empty"));
      users.push(data.user.id);
      return {id:data.user.id,email,password};
    };
    const alice=await create("alice","user",{role:"admin"});
    const bob=await create("bob");
    const manager=await create("manager","admin");
    assert.notEqual(alice.id,bob.id);
    assert.equal(users.length,3,"Must use three separate *real* local GoTrue users");

    child=spawn(process.execPath,[path.join(root,"server.js")],{
      cwd:root,
      env:{
        ...process.env,
        NODE_ENV:"production",PORT:String(port),APP_BASE_URL:appUrl,
        SUPABASE_URL:supabaseUrl,
        SUPABASE_PUBLISHABLE_KEY:anonKey,
        SUPABASE_SECRET_KEY:secretKey,
        TEST_AUTH_BYPASS:"0",ADMIN_EMAILS:"",
        OPENAI_API_KEY:"",OPENROUTER_API_KEY:"",
        TEST_BENCHMARK_LIVE:"0"
      },
      stdio:["ignore","pipe","pipe"]
    });
    child.stderr.on("data",c=>errors=(errors+String(c)).slice(-3000));
    await waitForExpress(child,()=>errors);

    async function login(user) {
      const r=await api("/api/auth/login",null,"POST",{
        identifier:user.email,password:user.password
      });
      assert.equal(r.status,200,"Real GoTrue password login "+r.status+" "+JSON.stringify(r.body));
      assert.equal(r.body.user.id,user.id);
      return readCookies(r.response);
    }
    const cookieAlice=await login(alice);
    const cookieBob=await login(bob);
    const cookieAdmin=await login(manager);
    const userA=await api("/api/auth/me",cookieAlice);
    const userB=await api("/api/auth/me",cookieBob);
    assert.equal(userA.status,200);
    assert.equal(userB.status,200);
    assert.equal(userA.body.user.role,"user",
      "User-editable user_metadata.role must NOT grant admin");
    assert.equal((await api("/api/auth/diagnostic",cookieAlice)).status,403);
    assert.equal((await api("/api/auth/diagnostic",cookieAdmin)).status,200,
      "Only GoTrue app_metadata.admin may use admin endpoints");

    const a=await api("/api/history",cookieAlice,"POST",{
      title:"A: syntetisk privat samtale",situation:"En medarbeider har uventet fravær."
    });
    const b=await api("/api/history",cookieBob,"POST",{
      title:"B: syntetisk privat samtale",situation:"Planlegge en konkret oppfølgingssamtale."
    });
    assert.equal(a.status,200,"Alice failed saving with actual RLS "+JSON.stringify(a.body));
    assert.equal(b.status,200,"Bob failed saving with actual RLS "+JSON.stringify(b.body));
    const idA=a.body.item?.id, idB=b.body.item?.id;
    assert.ok(idA&&idB&&idA!==idB);
    const aList=await api("/api/history",cookieAlice);
    const bList=await api("/api/history",cookieBob);
    assert.deepEqual(aList.body.items.map(x=>x.id),[idA]);
    assert.deepEqual(bList.body.items.map(x=>x.id),[idB]);
    assert.ok(!JSON.stringify(aList.body).includes("B: syntetisk"));
    assert.ok(!JSON.stringify(bList.body).includes("A: syntetisk"));

    assert.equal((await api("/api/history/"+idA,cookieBob,"DELETE")).status,404,
      "Bob must not delete Alice history via Express");
    const stolen=await api("/api/history",cookieBob,"POST",{
      id:idA,title:"Bob forsøker å endre A"
    });
    assert.equal(stolen.status,404,"PostgREST RLS update of other owner's ID must report 404");
    assert.equal((await api("/api/history",cookieAlice)).body.items[0].title,"A: syntetisk privat samtale");
    assert.equal((await api("/api/history",cookieAlice,"POST",{
      id:idA,title:"A oppdaterer sin egen samtale"
    })).status,200);

    // DIRECT requests to real PostgREST. Browser/Express cannot be our only barrier.
    const asUser=accessCookie=>{
      const token=decodeURIComponent(accessCookie.split("; ")[0].slice("samtalestotte_access=".length));
      return createClient(supabaseUrl,anonKey,{
        ...opts,global:{headers:{Authorization:"Bearer "+token}}
      });
    };
    const dbA=asUser(cookieAlice),dbB=asUser(cookieBob);
    const directA=await dbA.from("conversations").select("id,user_id,title");
    const directB=await dbB.from("conversations").select("id,user_id,title");
    assert.equal(directA.error,null,"Real PostgREST SELECT should work for A");
    assert.equal(directB.error,null,"Real PostgREST SELECT should work for B");
    assert.deepEqual(directA.data.map(x=>String(x.id)),[String(idA)]);
    assert.deepEqual(directB.data.map(x=>String(x.id)),[String(idB)]);
    assert.equal(directA.data[0].user_id,alice.id);
    assert.equal(directB.data[0].user_id,bob.id);

    const {data:readOther,error:readError}=await dbB.from("conversations")
      .select("id").eq("id",idA);
    assert.equal(readError,null);
    assert.deepEqual(readOther,[],"Bob cannot read Alice row even through real PostgREST");

    const transfer=await dbB.from("conversations")
      .update({user_id:alice.id}).eq("id",idB).select("id");
    assert.ok(transfer.error,"WITH CHECK must prevent changing owner to another user");
    const forge=await dbB.from("conversations").insert({
      user_id:alice.id,title:"Forged owner"
    }).select("id");
    assert.ok(forge.error,"INSERT policy must reject another owner's user_id");
    const directDelete=await dbB.from("conversations").delete().eq("id",idA).select("id");
    assert.equal(directDelete.error,null);
    assert.deepEqual(directDelete.data,[],"Direct PostgREST DELETE must be blocked by actual RLS");
    assert.equal((await dbA.from("conversations").select("id").eq("id",idA)).data?.length,1);

    const anonRead=await anon.from("conversations").select("id");
    assert.ok(anonRead.error,"Anonymous PostgREST must not be able to read history");
    const unauth=await api("/api/history",null);
    assert.equal(unauth.status,401);
    assert.equal((await api("/api/history","samtalestotte_access=invalid; samtalestotte_refresh=invalid")).status,401);

    const accountA=await api("/api/account/export",cookieAlice);
    assert.equal(accountA.status,200);
    assert.deepEqual(accountA.body?.conversations?.map(x=>x.id),[idA]);
    assert.ok(!JSON.stringify(accountA.body).includes("B: syntetisk"));
    // Exercise the real GoTrue refresh endpoint from Express without a valid access JWT.
    const withoutAccess="samtalestotte_access=expired-synthetic-access; "+
      cookieAlice.split("; ").find(x=>x.startsWith("samtalestotte_refresh="));
    const refresh=await api("/api/auth/me",withoutAccess);
    assert.equal(refresh.status,200,"Real refresh token must recover an expired access token");
    assert.equal(refresh.body.user.id,alice.id);
    const renewed=readCookies(refresh.response);
    assert.equal((await api("/api/history",renewed)).body.items.length,1);

    assert.equal((await api("/api/history/"+idA,renewed,"DELETE")).status,200);
    assert.equal((await api("/api/history",renewed)).body.items.length,0);
    assert.equal((await api("/api/history",cookieBob)).body.items.length,1,
      "Alice cleanup must not delete Bob history");
    console.log("Real LOCAL Supabase acceptance: GoTrue password login + refresh, role metadata, PostgREST RLS, Express own CRUD, cross-user 404, direct forgery rejection, anonymous denial, export and deletion: PASS");
    console.log("All 3 users are synthetic; target = 127.0.0.1 only; hosted project calls = 0.");
  } finally {
    if(child)child.kill("SIGTERM");
    if(users.length){
      const {error}=await admin.from("conversations").delete().in("user_id",users);
      if(error)console.warn("Local-only cleanup of test rows: "+error.code);
      for(const id of users){
        const {error:e}=await admin.auth.admin.deleteUser(id);
        if(e)console.warn("Local-only synthetic GoTrue cleanup issue: "+e.code);
      }
    }
  }
})().catch(e=>{console.error("Local Supabase Auth/PostgREST integration FAILED:",e.stack||e);process.exitCode=1;});
