const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const port = 3218;
const child = spawn(process.execPath, [path.join(root, "server.js")], {
  cwd: root,
  env: {
    ...process.env,
    PORT: String(port),
    NODE_ENV: "test",
    TEST_AUTH_BYPASS: "1",
    APP_BASE_URL: `http://127.0.0.1:${port}`,
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
    SUPABASE_SECRET_KEY: "sb_secret_test",
    OPENAI_API_KEY: "",
    OPENROUTER_API_KEY: ""
  },
  stdio: ["ignore", "pipe", "pipe"]
});

let stderr = "";
child.stderr.on("data", chunk => { stderr += chunk.toString(); });

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return;
    } catch {}
    await wait(100);
  }
  throw new Error(`Produksjonsserver startet ikke i testmodus. ${stderr}`);
}

(async () => {
  try {
    await waitForServer();

    const assets = [
      "/app.js",
      "/styles.css",
      "/styles-core.css",
      "/styles-core-foundation.css",
      "/styles-core-dialogue.css",
      "/styles-core-simulation.css",
      "/styles-core-utilities.css",
      "/styles-core-01-shell.css",
      "/styles-core-02-forms.css",
      "/styles-core-03-situation.css",
      "/styles-core-04-topic-layout.css",
      "/styles-core-05-guidance.css",
      "/styles-core-06-auth-history.css",
      "/styles-core-07-reports.css",
      "/styles-core-08-simulation-flow.css",
      "/styles-core-09-simulation-controls.css",
      "/styles-core-10-auth-views.css",
      "/styles-core-11-speech-bubbles.css",
      "/styles-core-12-admin.css",
      "/styles-core-13-survey.css",
      "/styles-core-14-final-adjustments.css",
      "/styles-responsive.css",
      "/styles-overrides.css",
      "/src/client-data.js",
      "/src/client/guidance-fallback.js",
      "/src/client/benchmark-evaluation.js",
      "/src/client/admin-content.js",
      "/src/client/admin-data.js",
      "/src/client/topic-search.js",
      "/src/client/situation-analysis.js",
      "/src/client/source-presentation.js",
      "/src/privacy-name-data.js",
      "/src/privacy-detector.js",
      "/assets/images/logo.png",
      "/assets/images/logo-symbol.png",
      "/assets/images/topics/topic-livssituasjoner.png"
    ];

    for (const asset of assets) {
      const response = await fetch(`http://127.0.0.1:${port}${asset}`);
      if (!response.ok) throw new Error(`${asset} ga HTTP ${response.status}`);
      const length = Number(response.headers.get("content-length") || 0);
      const body = Buffer.from(await response.arrayBuffer());
      if (!(length > 0 || body.length > 0)) throw new Error(`${asset} ga tom respons`);
    }

    // Validate what the actual index.html references, not just the
    // separately maintained explicit allowlist above. Querystrings are
    // preserved to exercise the same cache-busted URL used by the browser.
    const pageResponse = await fetch(`http://127.0.0.1:${port}/`);
    if (!pageResponse.ok) throw new Error("Frontend entrypoint is unavailable");
    const markup = await pageResponse.text();
    const linkedAssets = new Set();
    const tagRe = /<(script|link|img)\b[^>]*>/gi;
    for (const [tag, kind] of markup.matchAll(tagRe)) {
      const attr = kind.toLowerCase() === "link" ? "href" : "src";
      const match = tag.match(new RegExp(`\\b${attr}\\s*=\\s*["']([^"']+)["']`, "i"));
      if (!match) continue;
      const href = match[1];
      if (/^(?:https?:|data:|\/\/|#)/i.test(href)) continue;
      const url = new URL(href, `http://127.0.0.1:${port}/`);
      if (url.origin !== `http://127.0.0.1:${port}`) continue;
      linkedAssets.add(url.pathname + url.search);
    }
    if (linkedAssets.size < 10) throw new Error("Too few HTML assets detected");
    for (const asset of linkedAssets) {
      const response = await fetch(`http://127.0.0.1:${port}${asset}`);
      if (!response.ok) throw new Error(`HTML-linked asset ${asset} gave HTTP ${response.status}`);
      if ((await response.arrayBuffer()).byteLength === 0) {
        throw new Error(`HTML-linked asset ${asset} returned empty content`);
      }
    }

    const secret = await fetch(`http://127.0.0.1:${port}/.env`);
    if (secret.status !== 404) throw new Error(".env skal ikke kunne serveres");

    const docs = await fetch(`http://127.0.0.1:${port}/docs/bmad/PRD.md`);
    if (docs.status !== 404) throw new Error("Dokumentasjon skal ikke kunne serveres som offentlig asset");

    const serverModule = await fetch(`http://127.0.0.1:${port}/src/server/ai-schemas.js`);
    if (serverModule.status !== 404) throw new Error("Interne servermoduler skal ikke kunne serveres offentlig");

    console.log("Offentlige frontend-assets: OK");
  } finally {
    child.kill("SIGTERM");
  }
})().catch(error => {
  console.error(error.message);
  child.kill("SIGTERM");
  process.exit(1);
});
