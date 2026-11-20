// Teststyrt regresjon: KI-status skal vise OpenRouter-only korrekt.
// Starter faktisk server.js, MEN med fiktive lokale Supabase-verdier,
// test-auth-bypass og dummy OpenRouter-nokkel. Ingen reell KI/DB/nett-kall.
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function withServer(port, configured, check) {
  const origin = `http://127.0.0.1:${port}`;
  const env = {
    ...process.env,
    NODE_ENV: "test", TEST_AUTH_BYPASS: "1", PORT: String(port),
    APP_BASE_URL: origin,
    SUPABASE_URL: "http://127.0.0.1:9",
    SUPABASE_PUBLISHABLE_KEY: "not-a-real-key",
    SUPABASE_SECRET_KEY: "not-a-real-secret",
    OPENAI_API_KEY: "",
    OPENROUTER_API_KEY: configured ? "dummy-openrouter-test-key" : "",
    ADMIN_EMAILS: ""
  };
  const child = spawn(process.execPath, [path.join(root, "server.js")], {
    cwd: root, env, stdio: ["ignore", "pipe", "pipe"]
  });
  let errorLog = "";
  child.stderr.on("data", chunk => { errorLog = (errorLog + chunk.toString()).slice(-2000); });
  try {
    let ready = false;
    for (let i = 0; i < 80; i++) {
      if (child.exitCode !== null) throw new Error(`server terminated: ${errorLog}`);
      try {
        const response = await fetch(origin + "/api/public-config", { signal: AbortSignal.timeout(700) });
        if (response.ok) { ready = true; break; }
      } catch {}
      await sleep(100);
    }
    if (!ready) throw new Error("server did not start: " + errorLog);
    async function api(route, method = "GET") {
      const response = await fetch(origin + route, {
        method, headers: { "content-type": "application/json" },
        body: method === "GET" ? undefined : "{}",
        signal: AbortSignal.timeout(8000)
      });
      return { status: response.status, body: await response.json() };
    }
    await check(api);
  } finally {
    child.kill("SIGTERM");
  }
}
(async () => {
  await withServer(32492, false, async api => {
    const status = await api("/api/status");
    assert.equal(status.status, 200);
    assert.equal(status.body.aiConfigured, false);
    assert.equal(status.body.model, null);
    for (const route of [
      "/api/classify-topic", "/api/analyze-situation", "/api/generate-guidance",
      "/api/continue-conversation", "/api/simulation-turn",
      "/api/simulation-help", "/api/simulation-feedback"
    ]) {
      const response = await api(route, "POST");
      assert.equal(response.status, 503, `Manglende provider: ${route}`);
      assert.equal(response.body.error, "AI_NOT_CONFIGURED");
    }
  });
  await withServer(32493, true, async api => {
    const status = await api("/api/status");
    assert.equal(status.status, 200);
    assert.equal(status.body.aiConfigured, true, "OpenRouter-only skal regnes som KI-konfigurert");
    assert.equal(status.body.model, "openrouter/free");
  });
  console.log("KI-providerstatus: ingen provider 503, OpenRouter-only er aktivert: OK");
  console.log("Kun dummy-nokler og lokal Supabase. Ingen KI-output eller produksjonsbrukere testet.");
})().catch(error => {
  console.error("KI-providerstatus-regresjon feilet:", error.stack || error);
  process.exitCode = 1;
});
