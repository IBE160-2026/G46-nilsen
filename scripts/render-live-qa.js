import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

function logLines(prefix, chunk) {
  for (const line of String(chunk || "").split(/\r?\n/)) {
    if (line.trim()) console.log(`${prefix} ${line}`);
  }
}

function newestResultFile() {
  const dir = path.join(root, "tests", "test-results");
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir)
    .filter(name => /^ai-golden-.*\.json$/u.test(name))
    .map(name => ({ name, mtime: fs.statSync(path.join(dir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0]?.name || null;
}

export function runRenderLiveQa() {
  if (process.env.RENDER_LIVE_QA_ON_START !== "1") return;

  console.log("[LIVE-QA] Starter 40-case occupation-golden mot Render-konfigurert KI-provider.");
  const child = spawn(process.execPath, [path.join(root, "tests", "test-ai-golden.js"), "--occupation"], {
    cwd: root,
    env: {
      ...process.env,
      RENDER_LIVE_QA_ON_START: "0",
      AI_TEST_LIMIT: "0"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", chunk => logLines("[LIVE-QA][runner]", chunk));
  child.stderr.on("data", chunk => logLines("[LIVE-QA][stderr]", chunk));

  child.on("error", error => {
    console.error("[LIVE-QA] Runner kunne ikke startes:", error);
  });

  child.on("close", code => {
    try {
      const file = newestResultFile();
      if (!file) {
        console.error(`[LIVE-QA] Ingen resultatfil funnet. exit=${code}`);
        return;
      }
      const resultPath = path.join(root, "tests", "test-results", file);
      const results = JSON.parse(fs.readFileSync(resultPath, "utf8"));
      const counts = results.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      }, {});
      const summary = results.map(row => ({
        id: row.id,
        status: row.status,
        issues: row.issues || [],
        sources: row.guidance?.source_ids || [],
        occupationRelevant: row.guidance?.occupation_context?.occupationRelevant,
        needsEmployerType: row.guidance?.occupation_context?.needsEmployerType
      }));
      console.log("[LIVE-QA][RESULT] " + JSON.stringify({
        exitCode: code,
        total: results.length,
        counts,
        cases: summary
      }));
    } catch (error) {
      console.error("[LIVE-QA] Kunne ikke lese resultatrapport:", error);
    }
  });
}
