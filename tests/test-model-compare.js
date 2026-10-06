import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.OPENAI_API_KEY) {
  console.error("\nMangler OPENAI_API_KEY i .env. Modelltesten er ikke startet.\n");
  process.exit(1);
}

const allCases = JSON.parse(fs.readFileSync(path.join(__dirname, "cases/AI-STRESS-CASES.json"), "utf8"));
const quickIds = ["ST-RUS-02", "ST-PERF-04", "ST-TERM-03", "ST-CAREER-01", "ST-LIFE-02"];
const fullIds = [
  ...quickIds,
  "ST-CONF-01", "ST-CONF-04", "ST-CAREER-02", "ST-SAFE-03", "ST-MOT-04"
];
const selectedIds = process.argv.includes("--all") ? fullIds : quickIds;
const cases = selectedIds.map(id => allCases.find(x => x.id === id)).filter(Boolean);
const models = ["gpt-5.6-luna", "gpt-5.6-terra"];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForServer(base, stderrRef) {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`${base}/api/status`);
      if (r.ok) return await r.json();
    } catch {}
    await delay(250);
  }
  throw new Error(`Testserveren startet ikke. ${stderrRef.value}`);
}

async function post(base, url, body) {
  const waits = [0, 1500, 3500, 7000];
  let lastError;
  for (const wait of waits) {
    if (wait) await delay(wait);
    try {
      const r = await fetch(`${base}${url}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) return data;
      const err = new Error(data?.message || `HTTP ${r.status}`);
      err.status = r.status;
      err.details = data;
      lastError = err;
      if (![408,409,429,500,502,503,504].includes(r.status)) throw err;
    } catch (err) {
      lastError = err;
      if (err.status && ![408,409,429,500,502,503,504].includes(err.status)) throw err;
    }
  }
  throw lastError || new Error("Ukjent teknisk feil");
}

async function runModel(model, port) {
  const base = `http://127.0.0.1:${port}`;
  const stderrRef = { value: "" };
  const server = spawn(process.execPath, [path.join(__dirname, "../server.js")], {
    cwd: __dirname,
    env: { ...process.env, PORT: String(port), OPENAI_MODEL: model, NODE_ENV: "test", TEST_AUTH_BYPASS: "1" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  server.stderr.on("data", d => { stderrRef.value += d.toString(); });

  try {
    const status = await waitForServer(base, stderrRef);
    if (status.model !== model) throw new Error(`Forventet ${model}, men server rapporterte ${status.model}`);
    const results = {};
    for (let i = 0; i < cases.length; i++) {
      const tc = cases[i];
      process.stdout.write(`[${model}] ${i+1}/${cases.length} ${tc.id} ... `);
      try {
        const analysis = await post(base, "/api/analyze-situation", { situation: tc.input });
        const guidance = await post(base, "/api/generate-guidance", { situation: tc.input, analysis, followups: {} });
        results[tc.id] = { analysis, guidance };
        console.log("OK");
      } catch (err) {
        results[tc.id] = { error: err?.message || String(err) };
        console.log("FEIL");
      }
      await delay(300);
    }
    return results;
  } finally {
    server.kill("SIGTERM");
    await delay(500);
  }
}

function esc(v) { return String(v ?? "").trim(); }
function renderResult(r) {
  if (!r || r.error) return `**Teknisk feil:** ${esc(r?.error || "Ukjent feil")}`;
  const a = r.analysis || {};
  const g = r.guidance || {};
  let s = "";
  s += `**Situasjonsforståelse**  \n${esc(a.summary)}\n\n`;
  if ((a.cautions || []).length) s += `**Vær oppmerksom på i analysen**\n${a.cautions.map(x => `- ${esc(x)}`).join("\n")}\n\n`;
  s += `**Forslag til åpning**  \n${esc(g.opening)}\n\n`;
  s += `**Spørsmål**\n${(g.questions || []).map(x => `- ${esc(x)}`).join("\n") || "- Ingen"}\n\n`;
  s += `**Mulige reaksjoner**\n`;
  for (const x of g.reactions || []) {
    s += `- **${esc(x.reaction)}** — ${esc(x.leader_response)}\n`;
  }
  s += `\n**Vær særlig oppmerksom på**\n${(g.attention || []).map(x => `- ${esc(x)}`).join("\n") || "- Ingen"}\n\n`;
  if (g.legal_hr_note) s += `**HR / regelverk**  \n${esc(g.legal_hr_note)}\n\n`;
  s += `**Videre oppfølging**\n${(g.next_steps || []).map(x => `- ${esc(x)}`).join("\n") || "- Ingen"}\n\n`;
  s += `**Kilde-ID-er**  \n${(g.source_ids || []).join(", ") || "Ingen"}\n`;
  return s;
}

function assignmentFor(caseId) {
  // Stabil blindfordeling uten randomness: bruk første byte i SHA-256.
  const n = crypto.createHash("sha256").update(`samtalestotte-ab-${caseId}`).digest()[0];
  return n % 2 === 0
    ? { A: "gpt-5.6-luna", B: "gpt-5.6-terra" }
    : { A: "gpt-5.6-terra", B: "gpt-5.6-luna" };
}

console.log("\nSamtalestøtte – blind modelltest Luna vs Terra");
console.log(`Caser: ${cases.length}. Hver case kjøres én gang med hver modell.`);
console.log(`Dette gir normalt ${cases.length * 4} API-kall (analyse + råd × to modeller).`);
console.log("Standard er 5 krevende caser. Bruk --all for 10 caser.\n");

const byModel = {};
byModel[models[0]] = await runModel(models[0], 3211);
byModel[models[1]] = await runModel(models[1], 3212);

const outDir = path.join(__dirname, "test-results");
fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outDir, `modelltest-blind-${stamp}.md`);
const keyPath = path.join(outDir, `modelltest-fasit-${stamp}.md`);
const rawPath = path.join(outDir, `modelltest-data-${stamp}.json`);

let report = `# Blind A/B-test – Samtalestøtte\n\n`;
report += `Kjørt: ${new Date().toLocaleString("nb-NO")}  \n`;
report += `Antall caser: ${cases.length}  \n\n`;
report += `Les **ikke fasitfilen** før du har vurdert svarene. For hver case: les A og B og noter hvilket svar du foretrekker.\n\n`;
report += `Vurder gjerne: 1) situasjonsforståelse, 2) konkrete råd, 3) nyansering/risiko, 4) samtaleformuleringer, 5) faglig relevans.\n\n`;

let key = `# Fasit – Luna vs Terra\n\nÅpne denne først etter at du har vurdert blindrapporten.\n\n`;
const raw = { created_at: new Date().toISOString(), cases: [] };

for (const tc of cases) {
  const assign = assignmentFor(tc.id);
  const a = byModel[assign.A][tc.id];
  const b = byModel[assign.B][tc.id];
  report += `---\n\n## ${tc.id} – ${tc.theme}\n\n**Case**  \n${tc.input}\n\n`;
  report += `### Svar A\n\n${renderResult(a)}\n\n`;
  report += `### Svar B\n\n${renderResult(b)}\n\n`;
  report += `### Din vurdering\n\n- Foretrekker: A / B / omtrent likt\n- Kort hvorfor:\n\n`;
  key += `- **${tc.id}:** A = ${assign.A}, B = ${assign.B}\n`;
  raw.cases.push({ id: tc.id, theme: tc.theme, input: tc.input, assignment: assign, A: a, B: b });
}

fs.writeFileSync(reportPath, report, "utf8");
fs.writeFileSync(keyPath, key, "utf8");
fs.writeFileSync(rawPath, JSON.stringify(raw, null, 2), "utf8");

console.log("\nFerdig. Ikke åpne fasiten først.");
console.log(`Blindrapport: ${reportPath}`);
console.log(`Fasit:       ${keyPath}`);
console.log(`Rådata:      ${rawPath}\n`);



