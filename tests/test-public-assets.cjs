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
      "/src/client-data.js",
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

    const secret = await fetch(`http://127.0.0.1:${port}/.env`);
    if (secret.status !== 404) throw new Error(".env skal ikke kunne serveres");

    const docs = await fetch(`http://127.0.0.1:${port}/docs/bmad/PRD.md`);
    if (docs.status !== 404) throw new Error("Dokumentasjon skal ikke kunne serveres som offentlig asset");

    console.log("Offentlige frontend-assets: OK");
  } finally {
    child.kill("SIGTERM");
  }
})().catch(error => {
  console.error(error.message);
  child.kill("SIGTERM");
  process.exit(1);
});
