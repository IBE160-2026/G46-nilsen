// Ekte Express + OpenAI SDK, men ALLE OpenAI-anrop rutes til lokal feilsimulator.
// Tester 503, 429, ugyldig JSON, frakobling og serverpersonvern uten API-nøkler.
const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
// Exercise the real server logging helper with a synthetic provider error carrying
// sensitive request data. Never include SDK error objects or raw messages in logs.
const source = fs.readFileSync(path.join(root, "server.js"), "utf8");
const logStart = source.indexOf("function logAiRouteError(");
const logEnd = source.indexOf("\nasync function createTrackedResponse(", logStart);
assert.ok(logStart >= 0 && logEnd > logStart, "Sanitized AI error logger missing");
const captured = [];
const sandbox = { console: { error: (...items) => captured.push(JSON.stringify(items)) } };
vm.runInNewContext(source.slice(logStart, logEnd) + "\nthis.safeLog = logAiRouteError;", sandbox);
sandbox.safeLog("analyze-situation", {
  status: 429, code: "rate_limit_error", message: "Knut Hansen kari@example.no",
  request: { body: "Knut Hansen kari@example.no" },
  error: { message: "PRIVATE PROVIDER DETAIL" }
});
assert.ok(captured.join("\n").includes("429") && captured.join("\n").includes("rate_limit_error"),
  "Sanitized AI error log must retain bounded technical metadata");
assert.ok(!/Knut Hansen|kari@example.no|PRIVATE PROVIDER DETAIL/.test(captured.join("\n")),
  "Provider error logger must not leak user data or provider message");
const appPort = 32621, fakePort = 32620;
const origin = `http://127.0.0.1:${appPort}`;
let fault = "503", providerCalls = 0;
const fake = http.createServer(async (req, res) => {
  providerCalls += 1;
  for await (const _ of req) {} // konsumér request; null ekte brukerdata
  if (fault === "disconnect") { req.socket.destroy(); return; }
  if (fault === "invalid") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({
      id: "resp_fake", object: "response", model: "gpt-5.6-luna",
      output_text: "ikke gyldig JSON", output: [], usage: { input_tokens: 2, output_tokens: 1 }
    }));
    return;
  }
  const status = fault === "429" ? 429 : 503;
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: { type: status === 429 ? "rate_limit_error" : "server_error", code: "SIMULATED_PROVIDER_ERROR", message: "SECRET INTERNAL MOCK ERROR" } }));
});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function api(route, data) {
  const response = await fetch(origin + route, {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(12000)
  });
  return { status: response.status, body: await response.json().catch(() => null) };
}
(async () => {
  await new Promise(resolve => fake.listen(fakePort, "127.0.0.1", resolve));
  let logs = "";
  const child = spawn(process.execPath, [
    "--import", path.join(root, "tests/support/offline-openai-fetch.mjs"),
    path.join(root, "server.js")
  ], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "test", TEST_AUTH_BYPASS: "1",
      PORT: String(appPort), APP_BASE_URL: origin,
      SUPABASE_URL: "http://127.0.0.1:9",
      SUPABASE_PUBLISHABLE_KEY: "local-fake-key",
      SUPABASE_SECRET_KEY: "local-fake-secret",
      OPENAI_API_KEY: "local-only-dummy-key",
      OPENROUTER_API_KEY: "",
      OPENAI_MODEL: "gpt-5.6-luna",
      ADMIN_EMAILS: "", TEST_FAKE_OPENAI_PORT: String(fakePort)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stderr.on("data", part => { logs = (logs + part.toString()).slice(-3000); });
  try {
    let ready = false;
    for (let i = 0; i < 90; i++) {
      if (child.exitCode !== null) throw new Error("Server exited: " + logs);
      try {
        const r = await fetch(origin + "/api/public-config", { signal: AbortSignal.timeout(800) });
        if (r.ok) { ready = true; break; }
      } catch {}
      await sleep(100);
    }
    assert.ok(ready, "Server not ready: " + logs);

    const data = { situation: "En medarbeider har kommet for sent flere ganger uten kjent årsak." };
    const errors = [
      { route: "/api/classify-topic", mode: "503", input: data, status: 503, code: "AI_TOPIC_CLASSIFICATION_FAILED" },
      { route: "/api/analyze-situation", mode: "503", input: data, status: 503, code: "AI_ANALYSIS_FAILED" },
      { route: "/api/generate-guidance", mode: "429", input: data, status: 429, code: "AI_GUIDANCE_FAILED" },
      { route: "/api/continue-conversation", mode: "503", input: { ...data, question: "Hvordan spør jeg?" }, status: 503, code: "AI_CONTINUATION_FAILED" },
      { route: "/api/simulation-turn", mode: "503", input: { ...data, turns: [{ role: "leader", text: "Hva har skjedd?" }] }, status: 503, code: "SIMULATION_FAILED" },
      { route: "/api/analyze-situation", mode: "invalid", input: data, status: 500, code: "AI_ANALYSIS_FAILED" },
      { route: "/api/analyze-situation", mode: "disconnect", input: data, status: 500, code: "AI_ANALYSIS_FAILED" }
    ];
    for (const entry of errors) {
      fault = entry.mode;
      const before = providerCalls;
      const got = await api(entry.route, entry.input);
      assert.equal(got.status, entry.status, `${entry.route} ${entry.mode}: ${JSON.stringify(got)}`);
      assert.equal(got.body?.error, entry.code, `${entry.route} ${entry.mode}`);
      assert.ok(!JSON.stringify(got.body).includes("SECRET INTERNAL"), "Provider internal error leaked");
      assert.ok(providerCalls > before, `Missing actual provider call for ${entry.route} ${entry.mode}`);
    }

    // End-to-end server privacy boundary: all seven user-facing AI endpoints
    // must reject a fictitious full name before any fake provider call.
    // The mocked SDK lets us prove that no outgoing call was attempted.
    fault = "503";
    const name = "Knut Hansen";
    const privateSituation = `${name} kommer for sent flere ganger.`;
    const validLeaderTurns = [{ role: "leader", text: "Kan vi snakke om det som skjedde?" }];
    const privacyRequests = [
      { route: "/api/classify-topic", input: { situation: privateSituation } },
      { route: "/api/analyze-situation", input: { situation: privateSituation } },
      { route: "/api/generate-guidance", input: { situation: privateSituation } },
      { route: "/api/continue-conversation", input: { situation: privateSituation, question: "Hvordan spør jeg?" } },
      { route: "/api/simulation-turn", input: { situation: privateSituation, turns: validLeaderTurns } },
      { route: "/api/simulation-help", input: { situation: privateSituation, turns: validLeaderTurns, kind: "formulation" } },
      { route: "/api/simulation-feedback", input: { situation: privateSituation, turns: validLeaderTurns } },
      // Even a clean situation must not allow identifying information in a leader turn.
      { route: "/api/simulation-turn", input: { ...data, turns: [{ role: "leader", text: "Jeg snakker om Knut Hansen." }] } }
    ];
    for (const entry of privacyRequests) {
      const beforePrivacy = providerCalls;
      const blocked = await api(entry.route, entry.input);
      assert.equal(blocked.status, 400, entry.route + ": " + JSON.stringify(blocked));
      assert.equal(blocked.body?.error, "PRIVACY_REVIEW_REQUIRED", entry.route);
      assert.equal(providerCalls, beforePrivacy, entry.route + ": personal data must be blocked before provider call");
    }

    assert.ok(!logs.includes("SECRET INTERNAL MOCK ERROR"), "Raw provider message must not leak to server stderr");

    console.log("Isolert OpenAI-providerfeiltest: 503, 429, ugyldig JSON, nettverksfeil og 8 PII-blokkeringer på 7 KI-endepunkter OK");
    console.log("Kun lokal fake provider og dummy-nøkler, ingen eksterne KI-anrop.");
  } finally {
    child.kill("SIGTERM");
    await new Promise(resolve => fake.close(resolve));
  }
})().catch(error => {
  console.error("Providerfeiltest feilet:", error.stack || error);
  process.exitCode = 1;
});
