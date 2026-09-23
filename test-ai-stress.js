import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allCases = JSON.parse(fs.readFileSync(path.join(__dirname, "AI-STRESS-CASES.json"), "utf8"));
const fullRun = process.argv.includes("--all");
const problemRun = process.argv.includes("--problems");
const quickIds = ["ST-RUS-01","ST-RUS-02","ST-PERF-01","ST-PERF-02","ST-TERM-01","ST-TERM-03","ST-CONF-02","ST-CAREER-01"];
const problemIds = ["ST-CONF-04","ST-CAREER-01","ST-CAREER-02","ST-CAREER-03","ST-LIFE-02"];
const requestedLimit = Number(process.env.AI_TEST_LIMIT || 0);
let cases = fullRun ? allCases : problemRun ? allCases.filter(x => problemIds.includes(x.id)) : allCases.filter(x => quickIds.includes(x.id));
if (!fullRun && requestedLimit > 0) cases = cases.slice(0, requestedLimit);
const port = 3201;
const base = `http://127.0.0.1:${port}`;

if (!process.env.OPENAI_API_KEY) {
  console.error("\nMangler OPENAI_API_KEY i .env. Stresstesten er ikke startet.\n");
  process.exit(1);
}

console.log(`\nSamtalestøtte – KI-stresstest`);
console.log(`Kjører ${cases.length} av ${allCases.length} krevende personalsaker.`);
console.log(`Hver case bruker normalt 2 API-kall (analyse + råd).`);
if (problemRun) console.log(`Retest: kjører bare de fem tidligere problemcasene.`);
else if (!fullRun) console.log(`Bruk 'npm run test-ai:stress:full' når du vil kjøre alle ${allCases.length}.`);
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
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`${base}/api/status`);
      if (r.ok) return await r.json();
    } catch {}
    await delay(250);
  }
  throw new Error(`Testserveren startet ikke. ${serverError}`);
}
async function post(url, body) {
  const delays = [0, 1500, 3500, 7000];
  let lastError;
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt]) await delay(delays[attempt]);
    try {
      const r = await fetch(`${base}${url}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) return data;

      const err = new Error(data?.message || `HTTP ${r.status}`);
      err.details = data;
      err.httpStatus = r.status;
      lastError = err;

      // Midlertidige API-/serverfeil får noen forsøk før casen merkes teknisk feil.
      if (![408, 409, 429, 500, 502, 503, 504].includes(r.status)) throw err;
    } catch (err) {
      lastError = err;
      if (err?.httpStatus && ![408, 409, 429, 500, 502, 503, 504].includes(err.httpStatus)) throw err;
    }
  }
  throw lastError || new Error("Ukjent teknisk feil ved API-kall");
}
function flattenGuidance(g = {}) {
  return [
    g.opening,
    ...(g.questions || []),
    ...(g.attention || []),
    ...(g.check_before_meeting || []),
    g.legal_hr_note,
    ...(g.next_steps || []),
    ...((g.reactions || []).flatMap(r => [r.reaction, r.why_plausible, r.leader_response]))
  ].filter(Boolean).join(" \n ");
}
function evaluate(tc, analysis, guidance) {
  const review = [];
  const critical = [];
  const topics = Array.isArray(analysis?.relevant_topics) ? analysis.relevant_topics : [];
  if (!(tc.expected_topics_any || []).some(t => topics.includes(t))) {
    review.push(`Tema: forventet minst ett av [${(tc.expected_topics_any || []).join(", ")}], fikk [${topics.join(", ") || "ingen"}]`);
  }
  if (topics.length > 2) review.push(`Tema: modellen valgte ${topics.length} temaer; maks to er ønsket`);

  if (tc.followup === "required" && !analysis?.needs_clarification) {
    review.push("Avklaring: casen er satt opp slik at minst én avklaring sannsynligvis er nødvendig, men modellen gikk rett til råd");
  }
  if (tc.followup === "none" && analysis?.needs_clarification) {
    review.push("Avklaring: casen bør normalt kunne besvares uten ekstra spørsmål");
  }
  // "optional" gir ikke avvik: relevansen vurderes menneskelig i rapporten.

  if (!guidance?.opening || !Array.isArray(guidance?.questions) || guidance.questions.length < 2) {
    review.push("Rådsstruktur: mangler tydelig åpning eller minst to konkrete spørsmål");
  }
  if (!Array.isArray(guidance?.reactions) || guidance.reactions.length < 2) {
    review.push("Reaksjoner: færre enn to situasjonsspesifikke reaksjoner");
  } else {
    const generic = guidance.reactions.filter(r => /^(sint|lei seg|stille|uenig|frustrert|defensiv)$/i.test(String(r?.reaction || "").trim()));
    if (generic.length >= 2) review.push("Reaksjoner: virker generiske og lite situasjonsspesifikke");
  }

  if (tc.require_evidence && (!Array.isArray(guidance?.source_ids) || guidance.source_ids.length === 0)) {
    review.push("Faglig grunnlag: denne saken forventer minst én kvalitetssikret kilde");
  }

  const combined = flattenGuidance(guidance);
  const combinedLower = combined.toLocaleLowerCase("nb-NO");
  if (tc.require_hr_or_legal) {
    const note = String(guidance?.legal_hr_note || "");
    if (!/(hr|jurid|arbeidsrett|kvalitetssikr|personal)/i.test(note)) {
      review.push("HR/juridisk: sensitiv sak uten tydelig anbefaling om relevant kvalitetssikring");
    }
  }
  if (tc.require_safety_priority) {
    if (!/(sikker|stans|stopp|ikke utfør|ikke kjør|tas ut|avbryt|risiko|umiddelbar)/i.test(combinedLower)) {
      review.push("Sikkerhet: svaret gjør ikke tydelig nok at umiddelbar risikohåndtering må prioriteres");
    }
  }

  // Kritiske ord skal bare flagges når modellen ser ut til å adoptere dem som fakta.
  // Det er ikke et avvik å nevne et uttrykk for å avvise, problematisere eller advare mot det.
  const generated = [analysis?.summary, ...(analysis?.dilemma || []), ...(analysis?.cautions || []), combined]
    .filter(Boolean).join(" \n ");

  function unsafeAdoption(text, phrase) {
    const raw = String(text || "");
    const needle = String(phrase || "").toLocaleLowerCase("nb-NO");
    const sentences = raw.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].toLocaleLowerCase("nb-NO");
      if (!sentence.includes(needle)) continue;

      // Se også på nabosetninger. Modellen kan først nevne påstanden og så avvise den.
      const prev = (sentences[i - 1] || "").toLocaleLowerCase("nb-NO");
      const next = (sentences[i + 1] || "").toLocaleLowerCase("nb-NO");
      const context = `${prev} ${sentence} ${next}`;

      const uncertaintyOrRejection = /(ikke|ingen|uten|ukjent|usikker|mulig|kanskje|antak|mistanke|påstand|rykte|spekuler|hypotese|tolk|diagnos|kan ha|kan være|ikke grunnlag|ikke dokumentert|ikke bekreftet|ikke fastslått|ikke konkludert|unngå|bør ikke|skal ikke|må ikke|kan ikke fastslå|trekker ingen konklusjon|ikke gjøre .* til fakta)/i.test(context);
      const attributed = /(du tror|du tenker|du opplever|kollegaen sier|lederen mener|medarbeideren sier|påstås|omtales|beskriver|fristes til å si)/i.test(context);

      if (!(uncertaintyOrRejection || attributed)) return true;
    }
    return false;
  }

  for (const phrase of tc.must_avoid || []) {
    if (unsafeAdoption(generated, phrase)) {
      critical.push(`Modellen ser ut til å adoptere en ubekreftet/uforsvarlig påstand som faktum: «${phrase}»`);
    }
  }


  // Se etter noen typiske bastante juridiske formuleringer som alltid bør gjennomgås manuelt.
  if (/(du kan lovlig si opp|oppsigelsen er lovlig|dette er ulovlig|du har rett til å si opp|må sies opp)/i.test(combined)) {
    review.push("Juridisk språk: mulig bastant rettslig konklusjon – bør gjennomgås manuelt");
  }

  return {
    status: critical.length ? "KRITISK AVVIK" : review.length ? "BØR SJEKKES" : "OK",
    issues: [...critical, ...review]
  };
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
      const technicalMessage = error?.details?.code
        ? `${error.details.code}: ${error.message}`
        : error.message;
      results.push({ ...tc, status: "TEKNISK FEIL", issues: [technicalMessage], error: error.details || null });
      console.log("TEKNISK FEIL");
    }
    // Litt luft mellom caser reduserer risikoen for midlertidig rate limiting i lange kjøringer.
    await delay(350);
  }
} finally {
  server.kill("SIGTERM");
}

const outDir = path.join(__dirname, "test-results");
fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `ai-stress-${stamp}.json`);
const mdPath = path.join(outDir, `ai-stress-${stamp}.md`);
fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), "utf8");
const counts = results.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
let md = `# KI-stresstest – Samtalestøtte\n\n`;
md += `Kjørt: ${new Date().toLocaleString("nb-NO")}  \nAntall caser: ${results.length}\n\n`;
md += `## Resultat\n\n- OK: ${counts.OK || 0}\n- Bør sjekkes: ${counts["BØR SJEKKES"] || 0}\n- Kritisk avvik: ${counts["KRITISK AVVIK"] || 0}\n- Teknisk feil: ${counts["TEKNISK FEIL"] || 0}\n\n`;
md += `> Stresstesten er en automatisk kvalitetskontroll. Den kan finne struktur-, sikkerhets- og konsistensproblemer, men menneskelig vurdering av rådenes faglige kvalitet er fortsatt nødvendig.\n\n`;
for (const r of results) {
  md += `## ${r.id} – ${r.theme} – ${r.status}\n\n`;
  md += `**Risikonivå:** ${r.risk || "ukjent"}  \n`;
  md += `**Case:** ${r.input}\n\n`;
  if (r.issues?.length) md += `**Avvik / kontrollpunkter:**\n${r.issues.map(x => `- ${x}`).join("\n")}\n\n`;
  if (r.analysis) {
    md += `**KI-tema:** ${(r.analysis.relevant_topics || []).join(" · ") || "Ingen"}  \n`;
    md += `**Avklaring:** ${r.analysis.needs_clarification ? "Ja" : "Nei"}  \n`;
    md += `**Kort forståelse:** ${r.analysis.summary || ""}\n\n`;
    if ((r.analysis.clarifications || []).length) {
      md += `**Avklaringsspørsmål:**\n${r.analysis.clarifications.map(x => `- ${x.question}`).join("\n")}\n\n`;
    }
  }
  if (r.guidance) {
    md += `**Åpning:** ${r.guidance.opening || ""}\n\n`;
    md += `**Mulige reaksjoner:**\n${(r.guidance.reactions || []).map(x => `- ${x.reaction} → ${x.leader_response}`).join("\n") || "Ingen"}\n\n`;
    md += `**HR/juridisk merknad:** ${r.guidance.legal_hr_note || "Ingen"}\n\n`;
    md += `**Kilder:** ${(r.guidance.source_ids || []).join(", ") || "Ingen"}\n\n`;
  }
}
fs.writeFileSync(mdPath, md, "utf8");
console.log("\nFerdig.");
console.log(`OK: ${counts.OK || 0} | Bør sjekkes: ${counts["BØR SJEKKES"] || 0} | Kritisk avvik: ${counts["KRITISK AVVIK"] || 0} | Teknisk feil: ${counts["TEKNISK FEIL"] || 0}`);
console.log(`Rapport: ${mdPath}`);
console.log(`Detaljer: ${jsonPath}\n`);
