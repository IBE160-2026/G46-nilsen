// Sikkerhets-smoke for den faktiske Express-serveren uten Supabase-nokler eller prod-data.
// Denne testen verifiserer uautentisert HTTP-grense, same-origin og eksponerte
// filer. Den beviser IKKE autorisert historikk, faktisk RLS eller live KI.
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const port = 32491;
const base = `http://127.0.0.1:${port}`;
const fakeSupabase = "http://127.0.0.1:9"; // localhost, ingen produksjonsforbindelse
const env = {
  ...process.env,
  NODE_ENV: "production",
  PORT: String(port),
  APP_BASE_URL: base,
  SUPABASE_URL: fakeSupabase,
  SUPABASE_PUBLISHABLE_KEY: "test-publishable-key-not-real",
  SUPABASE_SECRET_KEY: "test-secret-key-not-real",
  TEST_AUTH_BYPASS: "0",
  OPENAI_API_KEY: "",
  OPENROUTER_API_KEY: "",
  ADMIN_EMAILS: ""
};
const child = spawn(process.execPath, [path.join(root, "server.js")], {
  cwd: root, env, stdio: ["ignore", "pipe", "pipe"]
});
let stderr = "";
let stdout = "";
for (const [stream, kind] of [[child.stderr, "err"], [child.stdout, "out"]]) {
  stream.on("data", chunk => {
    const line = chunk.toString();
    if (kind === "err") stderr = (stderr + line).slice(-5000);
    else stdout = (stdout + line).slice(-5000);
  });
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function request(route, options = {}) {
  const res = await fetch(base + route, { signal: AbortSignal.timeout(5000), ...options });
  let body = null;
  try { body = await res.json(); } catch {}
  return { res, body };
}
function expectStatus(result, status, errorCode) {
  assert.equal(result.res.status, status, `Forventet ${status} på endpoint, fikk ${result.res.status}`);
  if (errorCode) assert.equal(result.body?.error, errorCode);
  assert.equal(result.res.headers.get("cache-control"), "no-store");
}
(async () => {
  try {
    let ready = false;
    for (let i = 0; i < 80; i++) {
      if (child.exitCode !== null) throw new Error(`HTTP-server sluttet med ${child.exitCode}: ${stderr}`);
      try {
        const r = await fetch(base + "/api/public-config", { signal: AbortSignal.timeout(800) });
        if (r.ok) { ready = true; break; }
      } catch {}
      await wait(100);
    }
    if (!ready) throw new Error(`HTTP-server startet ikke. stdout=${stdout} stderr=${stderr}`);

    // Reelt API, ikke et utdrag av Express-routerdefinisjoner.
    const config = await request("/api/public-config");
    assert.equal(config.res.status, 200);
    assert.ok(config.body?.appVersion);
    for (const [header, expected] of [
      ["x-content-type-options", "nosniff"],
      ["x-frame-options", "DENY"],
      ["referrer-policy", "no-referrer"],
      ["strict-transport-security", "max-age=31536000; includeSubDomains"]
    ]) {
      assert.equal(config.res.headers.get(header), expected, `Feil sikkerhetsheader: ${header}`);
    }
    assert.match(config.res.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);

    const me = await request("/api/auth/me");
    assert.equal(me.res.status, 200);
    assert.equal(me.body?.user, null, "Uinnlogget bruker skal ikke returnere en profil");

    const getProtected = [
      "/api/history", "/api/account/export", "/api/admin/users",
      "/api/admin/ai-feedback", "/api/admin/ai-settings",
      "/api/occupation-options", "/api/help-source-library",
      "/api/privacy-ack", "/api/auth/diagnostic"
    ];
    for (const route of getProtected) {
      const got = await request(route);
      expectStatus(got, 401, "AUTH_REQUIRED");
    }

    const postProtected = [
      "/api/history", "/api/generate-guidance", "/api/continue-conversation",
      "/api/classify-topic", "/api/simulation-turn", "/api/simulation-feedback",
      "/api/survey", "/api/ai-feedback", "/api/admin/invites"
    ];
    for (const route of postProtected) {
      const got = await request(route, {
        method: "POST", headers: { "content-type": "application/json", Origin: base },
        body: JSON.stringify({ situation: "Anonymisert test", question: "Hva gjør vi?" })
      });
      expectStatus(got, 401, "AUTH_REQUIRED");
    }

    for (const [route, method] of [["/api/history/not-an-id", "DELETE"], ["/api/account", "DELETE"], ["/api/admin/users/not-an-id/role", "PATCH"], ["/api/admin/content", "PUT"]]) {
      const got = await request(route, {
        method, headers: { Origin: base, "content-type": "application/json" },
        body: method === "DELETE" ? undefined : "{}"
      });
      expectStatus(got, 401, "AUTH_REQUIRED");
    }

    for (const route of ["/api/history", "/api/generate-guidance", "/api/admin/invites"]) {
      const got = await request(route, {
        method: "POST",
        headers: { Origin: "https://fremmed.example", "content-type": "application/json" },
        body: "{}"
      });
      expectStatus(got, 403, "ORIGIN_REJECTED");
    }

    for (const route of ["/.env", "/server.js", "/database/SUPABASE-SETUP.sql", "/docs/bmad/PRD.md", "/.docs/planning-artifacts/architecture/technology.md"]) {
      const res = await fetch(base + route, { signal: AbortSignal.timeout(5000) });
      assert.equal(res.status, 404, `Følsom repo-fil skal ikke serveres: ${route}`);
    }
    console.log("Faktisk Express HTTP-grense: 29 beskyttede kall, origin og sensitive assets: OK");
    console.log("Begrensning: bruker-til-bruker/RLS, DB, live KI og input etter innlogging er IKKE testet.");
  } finally {
    child.kill("SIGTERM");
  }
})().catch(error => {
  console.error("API boundary smoke feilet:", error.stack || error.message);
  console.error(stderr.slice(-2500));
  child.kill("SIGTERM");
  process.exitCode = 1;
});
