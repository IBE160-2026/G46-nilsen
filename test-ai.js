import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allCases = JSON.parse(fs.readFileSync(path.join(__dirname, "AI-AUTOTEST-CASES.json"), "utf8"));
const fullRun = process.argv.includes("--all");
const requestedLimit = Number(process.env.AI_TEST_LIMIT || 0);
const cases = fullRun ? allCases : allCases.slice(0, requestedLimit > 0 ? requestedLimit : 6);
const port = 3199;
const base = `http://127.0.0.1:${port}`;

if (!process.env.OPENAI_API_KEY) {
  console.error("\nMangler OPENAI_API_KEY i .env. Testen er ikke startet.\n");
  process.exit(1);
}

console.log(`\nSamtalestøtte KI-test`);
console.log(`Kjører ${cases.length} av ${allCases.length} caser.`);
console.log(`Hver case bruker normalt 2 API-kall (analyse + råd).`);
if (!fullRun) console.log(`Bruk 'npm run test-ai:full' når du vil kjøre alle ${allCases.length}.`);
console.log("");

const server = spawn(process.execPath, [path.join(__dirname, "server.js")], {
  cwd: __dirname,
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

let serverError = "";
server.stderr.on("data", d => { serverError += d.toString(); });

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(`${base}/api/status`);
      if (r.ok) return await r.json();
    } catch {}
    await delay(250);
  }
  throw new Error(`Testserveren startet ikke. ${serverError}`);
}

async function post(url, body) {
  const r = await fetch(`${base}${url}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(data?.message || `HTTP ${r.status}`);
    err.details = data;
    throw err;
  }
  return data;
}

function evaluate(tc, analysis, guidance) {
  const issues = [];
  const topics = Array.isArray(analysis?.relevant_topics) ? analysis.relevant_topics : [];
  if (!tc.expected_topics.some(t => topics.includes(t))) {
    issues.push(`Tema: forventet ett av [${tc.expected_topics.join(", ")}], fikk [${topics.join(", ") || "ingen"}]`);
  }
  if (Boolean(analysis?.needs_clarification) !== Boolean(tc.should_ask_followup)) {
    issues.push(`Avklaring: forventet ${tc.should_ask_followup ? "ja" : "nei"}, fikk ${analysis?.needs_clarification ? "ja" : "nei"}`);
  }
  if (!guidance?.opening || !Array.isArray(guidance?.questions) || guidance.questions.length < 2) {
    issues.push("Rådsstruktur: mangler tydelig åpning eller minst to konkrete spørsmål");
  }
  if (!Array.isArray(guidance?.reactions) || guidance.reactions.length < 2) {
    issues.push("Reaksjoner: færre enn to situasjonsspesifikke reaksjoner");
  } else {
    const generic = guidance.reactions.filter(r => /^(sint|lei seg|stille|uenig|frustrert)$/i.test(String(r?.reaction || "").trim()));
    if (generic.length >= 2) issues.push("Reaksjoner: virker generiske og lite situasjonsspesifikke");
  }
  if (tc.expect_evidence && (!Array.isArray(guidance?.source_ids) || guidance.source_ids.length === 0)) {
    issues.push("Faglig grunnlag: forventet minst én kilde ved sensitivt/kritisk råd");
  }
  return { status: issues.length ? "BØR SJEKKES" : "OK", issues };
}

const results = [];
try {
  const status = await waitForServer();
  console.log(`Testserver klar. Modell: ${status.model || "ukjent"}\n`);

  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i];
    process.stdout.write(`[${i + 1}/${cases.length}] ${tc.id} ${tc.theme} ... `);
    try {
      const analysis = await post("/api/analyze-situation", { situation: tc.input });
      const guidance = await post("/api/generate-guidance", { situation: tc.input, analysis, followups: {} });
      const ev = evaluate(tc, analysis, guidance);
      results.push({ ...tc, ...ev, analysis, guidance });
      console.log(ev.status);
    } catch (error) {
      results.push({ ...tc, status: "KRITISK AVVIK", issues: [error.message], error: error.details || null });
      console.log("KRITISK AVVIK");
    }
  }
} finally {
  server.kill("SIGTERM");
}

const outDir = path.join(__dirname, "test-results");
fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `ai-test-${stamp}.json`);
const mdPath = path.join(outDir, `ai-test-${stamp}.md`);
fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), "utf8");

const counts = results.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
let md = `# Automatisk KI-test – Samtalestøtte\n\n`;
md += `Kjørt: ${new Date().toLocaleString("nb-NO")}  \n`;
md += `Antall caser: ${results.length}\n\n`;
md += `## Resultat\n\n- OK: ${counts.OK || 0}\n- Bør sjekkes: ${counts["BØR SJEKKES"] || 0}\n- Kritisk avvik: ${counts["KRITISK AVVIK"] || 0}\n\n`;
md += `> Merk: Automatisk vurdering kan finne strukturelle avvik, men erstatter ikke menneskelig vurdering av om rådene faktisk er gode.\n\n`;
for (const r of results) {
  md += `## ${r.id} – ${r.theme} – ${r.status}\n\n`;
  md += `**Case:** ${r.input}\n\n`;
  if (r.issues?.length) md += `**Avvik:**\n${r.issues.map(x => `- ${x}`).join("\n")}\n\n`;
  if (r.analysis) {
    md += `**KI-tema:** ${(r.analysis.relevant_topics || []).join(" · ") || "Ingen"}  \n`;
    md += `**Avklaring:** ${r.analysis.needs_clarification ? "Ja" : "Nei"}  \n`;
    md += `**Kort forståelse:** ${r.analysis.summary || ""}\n\n`;
  }
  if (r.guidance) {
    md += `**Åpning:** ${r.guidance.opening || ""}\n\n`;
    md += `**Kilder:** ${(r.guidance.source_ids || []).join(", ") || "Ingen"}\n\n`;
  }
}
fs.writeFileSync(mdPath, md, "utf8");

console.log("\nFerdig.");
console.log(`OK: ${counts.OK || 0} | Bør sjekkes: ${counts["BØR SJEKKES"] || 0} | Kritisk avvik: ${counts["KRITISK AVVIK"] || 0}`);
console.log(`Rapport: ${mdPath}`);
console.log(`Detaljer: ${jsonPath}\n`);
