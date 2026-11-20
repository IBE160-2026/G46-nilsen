const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
const runner = fs.readFileSync(path.join(root, "tests/test-ai-golden.js"), "utf8");

assert.match(
  server,
  /new OpenAI\(\{\s*apiKey,\s*timeout:\s*90000,\s*maxRetries:\s*0,/,
  "OpenAI-klienten skal ha eksplisitt timeout og ingen skjulte SDK-retries"
);
assert.ok(
  server.includes("const fakeProviderBase = benchmarkLiveMockOnly") &&
  server.includes("'http://127.0.0.1:' + process.env.TEST_FAKE_OPENAI_PORT") &&
  server.includes("baseURL:fakeProviderBase") &&
  server.includes('baseURL: fakeProviderBase ||'),
  "Testmodus må tvinge begge KI-klientene til lokal simulator"
);
assert.match(
  runner,
  /AI_TEST_CASE_IDS/,
  "Golden-runneren skal kunne velge eksplisitte case-ID-er"
);
assert.match(
  runner,
  /AbortSignal\.timeout\(105000\)/,
  "Golden-runnerens HTTP-kall skal ha eksplisitt timeout"
);

console.log("LIVE AI RUNNER CONTROLS OK");
