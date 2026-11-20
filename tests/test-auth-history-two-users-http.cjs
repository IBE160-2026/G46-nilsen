// Reell HTTP-integrasjon for server.js mot en *isolert, lokal* Supabase/Auth-fake.
// Beviser token forwarding, 2-bruker-separasjon gjennom API og autorisasjonsvakter.
// Fake PostgREST håndhever eierskap; dette er IKKE en test av ekte Supabase RLS.
const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");
const path = require("node:path");

const mockPort = 32610, appPort = 32611;
const root = path.resolve(__dirname, "..");
const appUrl = `http://127.0.0.1:${appPort}`;
const mockUrl = `http://127.0.0.1:${mockPort}`;
const makeUser = (id, name, role = "user") => ({
  id, email: `${name}@example.invalid`, user_metadata: { username: name },
  app_metadata: { role }, created_at: "2026-01-01T00:00:00.000Z"
});
const alice = makeUser("11111111-1111-4111-8111-111111111111", "alice");
const bob = makeUser("22222222-2222-4222-8222-222222222222", "bob");
const admin = makeUser("33333333-3333-4333-8333-333333333333", "admin", "admin");
const byToken = new Map([["local-alice-access", alice], ["local-bob-access", bob], ["local-admin-access", admin]]);
const allRows = [];
let dbReadFails = false, idCounter = 0;
function send(res, status, data, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(data));
}
function getUser(req) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  return byToken.get(token) || null;
}
function queryId(search) {
  const str = search.get("id") || "";
  return str.startsWith("eq.") ? str.slice(3) : null;
}
function viewRow(row) {
  return {
    id: row.id, title: row.title, content: row.content,
    created_at: row.created_at, updated_at: row.updated_at
  };
}
function noRows(res) {
  send(res, 406, {
    code: "PGRST116",
    details: "The result contains 0 rows",
    hint: null,
    message: "Cannot coerce the result to a single JSON object"
  });
}
function prefersSingle(req) {
  return String(req.headers.accept || "").includes("application/vnd.pgrst.object+json");
}
async function bodyOf(req) {
  let s = "";
  for await (const part of req) s += part.toString();
  return s ? JSON.parse(s) : {};
}
const mock = http.createServer(async (req, res) => {
  const target = new URL(req.url, mockUrl);
  const user = getUser(req);
  if (target.pathname === "/auth/v1/user" && req.method === "GET") {
    return user ? send(res, 200, user) : send(res, 401, { message: "Invalid JWT", code: "bad_jwt" });
  }
  if (target.pathname === "/auth/v1/token") {
    return send(res, 400, { message: "Invalid refresh token", code: "bad_jwt" });
  }
  if (target.pathname === "/rest/v1/ai_response_feedback" && req.method === "GET") {
    return send(res, 200, []);
  }
  if (target.pathname !== "/rest/v1/conversations") {
    return send(res, 404, { code: "NOT_FOUND", message: "Local fake route absent" });
  }
  if (!user) return send(res, 401, { code: "PGRST301", message: "Invalid token" });
  if (dbReadFails && req.method === "GET") {
    return send(res, 400, { code: "PGRST100", message: "Simulated local database query failure" });
  }
  const id = queryId(target.searchParams);
  const mine = allRows.filter(row => row.user_id === user.id && (!id || row.id === id));
  if (req.method === "GET") return send(res, 200, mine.map(viewRow));
  if (req.method === "POST") {
    let payload;
    try { payload = await bodyOf(req); } catch { return send(res, 400, { message: "Invalid JSON" }); }
    if (payload.user_id !== user.id) {
      return send(res, 403, { code: "42501", message: "RLS insert denied" });
    }
    const now = new Date().toISOString();
    const record = { ...payload, id: `11111111-2222-4333-8444-${String(++idCounter).padStart(12, "0")}`, created_at: now, updated_at: now };
    allRows.push(record);
    return send(res, 201, prefersSingle(req) ? viewRow(record) : [viewRow(record)]);
  }
  if (req.method === "PATCH") {
    const body = await bodyOf(req);
    if (mine.length === 0) return prefersSingle(req) ? noRows(res) : send(res, 200, []);
    const row = mine[0];
    row.title = body.title ?? row.title;
    row.content = body.content ?? row.content;
    row.updated_at = body.updated_at ?? row.updated_at;
    return send(res, 200, prefersSingle(req) ? viewRow(row) : [viewRow(row)]);
  }
  if (req.method === "DELETE") {
    for (const row of mine) {
      const idx = allRows.findIndex(r => r.id === row.id);
      if (idx >= 0) allRows.splice(idx, 1);
    }
    return send(res, 200, mine.map(row => ({ id: row.id })));
  }
  return send(res, 405, { message: "Unsupported" });
});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const cookie = user => `samtalestotte_access=local-${user}-access; sam talestotte_refresh=local-${user}-refresh`.replace("sam talestotte", "samtalestotte");
async function api(url, user, method = "GET", payload) {
  try {
    const r = await fetch(appUrl + url, {
      method,
      headers: {
        ...(user ? { Cookie: cookie(user) } : {}),
        "Content-Type": "application/json",
        Origin: appUrl
      },
      body: payload === undefined ? undefined : JSON.stringify(payload),
      signal: AbortSignal.timeout(7000)
    });
    const body = await r.json().catch(() => null);
    return { status: r.status, body, headers: r.headers };
  } catch (error) {
    throw new Error(`Test HTTP timeout: ${method} ${url} as ${user || "anonymous"}: ${error.message}`, { cause: error });
  }
}
(async () => {
  await new Promise(resolve => mock.listen(mockPort, "127.0.0.1", resolve));
  let err = "";
  const app = spawn(process.execPath, [path.join(root, "server.js")], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "production", PORT: String(appPort), APP_BASE_URL: appUrl,
      OPENAI_API_KEY: "", OPENROUTER_API_KEY: "",
      SUPABASE_URL: mockUrl, SUPABASE_PUBLISHABLE_KEY: "local-publishable-only",
      SUPABASE_SECRET_KEY: "local-admin-secret-only", TEST_AUTH_BYPASS: "0", ADMIN_EMAILS: ""
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  app.stderr.on("data", b => { err = (err + b.toString()).slice(-3000); });
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (app.exitCode !== null) throw new Error("Express exited: " + err);
      try {
        const r = await fetch(appUrl + "/api/public-config", { signal: AbortSignal.timeout(800) });
        if (r.ok) { ready = true; break; }
      } catch {}
      await sleep(100);
    }
    assert.ok(ready, "Express did not start: " + err);

    const whoA = await api("/api/auth/me", "alice");
    const whoB = await api("/api/auth/me", "bob");
    assert.equal(whoA.body?.user?.id, alice.id, "Alice token validation failed");
    assert.equal(whoB.body?.user?.id, bob.id, "Bob token validation failed");

    const aSave = await api("/api/history", "alice", "POST", { title: "Alfa - fiktiv", situation: "Uten personopplysninger" });
    assert.equal(aSave.status, 200, "Alice create: " + JSON.stringify(aSave.body));
    const aliceId = aSave.body?.item?.id;
    assert.ok(aliceId);

    const bSave = await api("/api/history", "bob", "POST", { title: "Beta - fiktiv", situation: "Uten personopplysninger" });
    assert.equal(bSave.status, 200, "Bob create: " + JSON.stringify(bSave.body));
    const bobId = bSave.body?.item?.id;
    assert.ok(bobId && bobId !== aliceId);

    const aList = await api("/api/history", "alice");
    const bList = await api("/api/history", "bob");
    assert.deepEqual(aList.body?.items?.map(x => x.id), [aliceId]);
    assert.deepEqual(bList.body?.items?.map(x => x.id), [bobId]);
    assert.ok(!JSON.stringify(aList.body).includes("Beta - fiktiv"));
    assert.ok(!JSON.stringify(bList.body).includes("Alfa - fiktiv"));

    const wrongDelete = await api(`/api/history/${aliceId}`, "bob", "DELETE");
    assert.equal(wrongDelete.status, 404);
    assert.equal(wrongDelete.body?.error, "NOT_FOUND");

    const wrongEdit = await api("/api/history", "bob", "POST", {
      id: aliceId, title: "Forsøk på endring av andres samtale"
    });
    assert.equal(wrongEdit.status, 404, "Ukjent/andres historikk-ID bør gi 404, ikke 500");
    assert.equal(wrongEdit.body?.error, "NOT_FOUND");

    const afterAttack = await api("/api/history", "alice");
    assert.equal(afterAttack.body?.items?.[0]?.title, "Alfa - fiktiv");

    const ownEdit = await api("/api/history", "alice", "POST", { id: aliceId, title: "Egen oppdatering" });
    assert.equal(ownEdit.status, 200, "Alice own update failed");
    assert.equal(ownEdit.body?.item?.title, "Egen oppdatering");

    const exportA = await api("/api/account/export", "alice");
    assert.equal(exportA.status, 200, "Alice export failed");
    assert.deepEqual(exportA.body?.conversations?.map(x => x.id), [aliceId]);

    const unknown = await api("/api/history", undefined);
    assert.equal(unknown.status, 401);
    const forged = await api("/api/history", "forged");
    assert.equal(forged.status, 401);

    assert.equal((await api("/api/admin/content", "alice", "PUT", { key: "home.title", value: "X" })).status, 403);
    assert.equal((await api("/api/auth/diagnostic", "bob")).status, 403);
    assert.equal((await api("/api/auth/diagnostic", "admin")).status, 200);

    dbReadFails = true;
    const failedRead = await api("/api/history", "alice");
    assert.equal(failedRead.status, 500);
    assert.equal(failedRead.body?.error, "HISTORY_READ_FAILED");
    assert.ok(!JSON.stringify(failedRead.body).includes("Simulated local database query failure"), "No DB internal detail to client");
    dbReadFails = false;

    const ownDelete = await api(`/api/history/${aliceId}`, "alice", "DELETE");
    assert.equal(ownDelete.status, 200);
    assert.equal((await api("/api/history", "alice")).body?.items?.length, 0);
    assert.equal((await api("/api/history", "bob")).body?.items?.length, 1);
    console.log("Isolert 2-bruker HTTP-test: Auth, lagring, eierskap, eksport, 403/404, DB-feil og sletting: OK");
    console.log("MERK: fake Auth/PostgREST håndhever simulert RLS; ekte Supabase RLS med to kontoer er ikke testet.");
  } finally {
    app.kill("SIGTERM");
    await new Promise(resolve => mock.close(resolve));
  }
})().catch(e => { console.error("2-bruker integrasjon feilet:", e.stack || e); process.exitCode = 1; });
