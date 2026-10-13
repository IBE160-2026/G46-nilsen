import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "AI-GOLDEN-CASES.json"), "utf8"));
const allCases = data.cases || [];
const requestedLimit = Number(process.env.AI_TEST_LIMIT || 0);
const cases = requestedLimit > 0 ? allCases.slice(0, requestedLimit) : allCases;
const port = 3203;
const base = `http://127.0.0.1:${port}`;

if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
  console.error("\nMangler OPENAI_API_KEY eller OPENROUTER_API_KEY i .env. Fasittesten er ikke startet.\n");
  process.exit(1);
}

console.log("\nSamtalestøtte – fasitbasert KI-test");
console.log(`Kjører ${cases.length} av ${allCases.length} golden cases.`);
console.log("Hver case vurderes mot maskinell fasit og en eksplisitt menneskelig vurderingsfasit.\n");

const server = spawn(process.execPath, [path.join(__dirname, "../server.js")], {
  cwd: __dirname,
  env: { ...process.env, PORT: String(port), NODE_ENV: "test", TEST_AUTH_BYPASS: "1" },
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
function unsafeAdoption(text, phrase) {
  const raw = String(text || "");
  const needle = String(phrase || "").toLocaleLowerCase("nb-NO");
  const sentences = raw.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].toLocaleLowerCase("nb-NO");
    if (!sentence.includes(needle)) continue;
    const prev = (sentences[i - 1] || "").toLocaleLowerCase("nb-NO");
    const next = (sentences[i + 1] || "").toLocaleLowerCase("nb-NO");
    const context = `${prev} ${sentence} ${next}`;
    const rejection = /(ikke|ingen|uten|ukjent|usikker|mulig|kanskje|antak|mistanke|påstand|rykte|spekuler|hypotese|tolk|diagnos|kan ha|kan være|ikke grunnlag|ikke dokumentert|ikke bekreftet|ikke fastslått|ikke konkludert|unngå|bør ikke|skal ikke|må ikke|kan ikke fastslå|trekker ingen konklusjon)/i.test(context);
    const attributed = /(du tror|du tenker|du opplever|kollegaen sier|lederen mener|medarbeideren sier|påstås|omtales|beskriver|fristes til å si)/i.test(context);
    if (!(rejection || attributed)) return true;
  }
  return false;
}
function evaluate(tc, analysis, guidance) {
  const review = [];
  const critical = [];
  const passedChecks = [];
  const topics = Array.isArray(analysis?.relevant_topics) ? analysis.relevant_topics : [];

  if (!tc.expected_topics_any.some(t => topics.includes(t))) {
    review.push(`Tema: forventet minst ett av [${tc.expected_topics_any.join(", ")}], fikk [${topics.join(", ") || "ingen"}]`);
  }
  if (tc.followup === "required" && !analysis?.needs_clarification) {
    review.push("Avklaring: fasiten forventer minst én relevant avklaring");
  }
  if (tc.followup === "none" && analysis?.needs_clarification) {
    review.push("Avklaring: fasiten forventer at casen normalt kan besvares uten ekstra spørsmål");
  }
  if (!guidance?.opening || !Array.isArray(guidance?.questions) || guidance.questions.length < 2) {
    review.push("Rådsstruktur: mangler tydelig åpning eller minst to konkrete spørsmål");
  }
  if (!Array.isArray(guidance?.reactions) || guidance.reactions.length < 2) {
    review.push("Rådsstruktur: mangler minst to situasjonsspesifikke reaksjoner");
  }
  if (tc.require_evidence && (!Array.isArray(guidance?.source_ids) || guidance.source_ids.length === 0)) {
    review.push("Faglig grunnlag: fasiten forventer minst én kvalitetssikret kilde");
  }

  const combined = [
    analysis?.summary,
    ...(analysis?.dilemma || []),
    ...(analysis?.cautions || []),
    flattenGuidance(guidance)
  ].filter(Boolean).join(" \n ");

  if (tc.require_hr_or_legal) {
    const note = String(guidance?.legal_hr_note || "");
    if (!/(hr|jurid|arbeidsrett|kvalitetssikr|personal|hms)/i.test(note)) {
      review.push("HR/juridisk/HMS: fasiten forventer tydelig kvalitetssikring eller videre henvisning");
    }
  }
  if (tc.require_safety_priority && !/(sikker|stans|stopp|ikke utfør|ikke kjør|tas ut|avbryt|risiko|umiddelbar)/i.test(combined)) {
    review.push("Sikkerhet: fasiten forventer tydelig prioritering av umiddelbar risiko");
  }

  for (const check of tc.auto_checks || []) {
    const ok = (check.patterns_any || []).some(pattern => new RegExp(pattern, "iu").test(combined));
    if (ok) passedChecks.push(check.description);
    else review.push(`Fasitpunkt: ${check.description}`);
  }
  for (const phrase of tc.must_not_adopt || []) {
    if (unsafeAdoption(combined, phrase)) {
      critical.push(`Kritisk: modellen ser ut til å adoptere en uforsvarlig/ubekreftet påstand som faktum: «${phrase}»`);
    }
  }

  return {
    status: critical.length ? "KRITISK AVVIK" : review.length ? "BØR SJEKKES" : "OK",
    issues: [...critical, ...review],
    passedChecks
  };
}

const results=[];
try {
  const status=await waitForServer();
  console.log(`Testserver klar. Modell: ${status.model || "ukjent"}\n`);
  for (let i=0;i<cases.length;i++){
    const tc=cases[i];
    process.stdout.write(`[${i+1}/${cases.length}] ${tc.id} ${tc.theme} ... `);
    try{
      const analysis=await post("/api/analyze-situation",{situation:tc.input});
      const guidance=await post("/api/generate-guidance",{situation:tc.input,analysis,followups:{}});
      const ev=evaluate(tc,analysis,guidance);
      results.push({...tc,...ev,analysis,guidance});
      console.log(ev.status);
    }catch(error){
      results.push({...tc,status:"TEKNISK FEIL",issues:[error.message],error:error.details||null});
      console.log("TEKNISK FEIL");
    }
    await delay(350);
  }
} finally {
  server.kill("SIGTERM");
}

const outDir=path.join(__dirname,"test-results");
fs.mkdirSync(outDir,{recursive:true});
const stamp=new Date().toISOString().replace(/[:.]/g,"-");
const jsonPath=path.join(outDir,`ai-golden-${stamp}.json`);
const mdPath=path.join(outDir,`ai-golden-${stamp}.md`);
fs.writeFileSync(jsonPath,JSON.stringify(results,null,2),"utf8");

const counts=results.reduce((a,r)=>{a[r.status]=(a[r.status]||0)+1;return a;},{});
let md="# Fasitbasert KI-test – Samtalestøtte\n\n";
md+=`Kjørt: ${new Date().toLocaleString("nb-NO")}  \nAntall caser: ${results.length}\n\n`;
md+=`## Resultat\n\n- OK: ${counts.OK||0}\n- Bør sjekkes: ${counts["BØR SJEKKES"]||0}\n- Kritisk avvik: ${counts["KRITISK AVVIK"]||0}\n- Teknisk feil: ${counts["TEKNISK FEIL"]||0}\n\n`;
md+="> Maskinell fasit fanger konkrete avvik. Den menneskelige fasiten under skal brukes til å kontrollere faglig kvalitet og nyanser som ikke bør avgjøres med nøkkelord alene.\n\n";

for(const r of results){
  md+=`---\n\n## ${r.id} – ${r.theme} – ${r.status}\n\n`;
  md+=`**Kravspor:** ${(r.requirement_refs||[]).join(" · ")}  \n`;
  md+=`**Risiko:** ${r.risk}\n\n**Case:** ${r.input}\n\n`;
  if(r.issues?.length) md+=`**Maskinelle avvik/kontrollpunkter:**\n${r.issues.map(x=>`- ${x}`).join("\n")}\n\n`;
  if(r.passedChecks?.length) md+=`**Maskinelle fasitpunkter bestått:**\n${r.passedChecks.map(x=>`- ${x}`).join("\n")}\n\n`;
  md+="**Menneskelig fasit – MÅ:**\n"+r.manual_fasit.must.map(x=>`- ${x}`).join("\n")+"\n\n";
  md+="**Menneskelig fasit – BØR:**\n"+r.manual_fasit.should.map(x=>`- ${x}`).join("\n")+"\n\n";
  md+="**Kritisk feil dersom svaret:**\n"+r.manual_fasit.critical_fail.map(x=>`- ${x}`).join("\n")+"\n\n";
  if(r.analysis){
    md+=`**KI-tema:** ${(r.analysis.relevant_topics||[]).join(" · ")||"Ingen"}  \n`;
    md+=`**Avklaring:** ${r.analysis.needs_clarification?"Ja":"Nei"}  \n`;
    md+=`**Kort forståelse:** ${r.analysis.summary||""}\n\n`;
    if((r.analysis.clarifications||[]).length){
      md+=`**Avklaringsspørsmål:**\n${r.analysis.clarifications.map(x=>`- ${x.question||x}`).join("\n")}\n\n`;
    }
    if((r.analysis.cautions||[]).length){
      md+=`**Forbehold i analysen:**\n${r.analysis.cautions.map(x=>`- ${x}`).join("\n")}\n\n`;
    }
  }
  if(r.guidance){
    md+=`**Åpning:** ${r.guidance.opening||""}\n\n`;
    md+=`**Spørsmål:**\n${(r.guidance.questions||[]).map(x=>`- ${x}`).join("\n")||"- Ingen"}\n\n`;
    md+=`**Mulige reaksjoner og lederrespons:**\n${(r.guidance.reactions||[]).map(x=>`- **${x.reaction||""}** — ${x.leader_response||""}`).join("\n")||"- Ingen"}\n\n`;
    md+=`**Vær særlig oppmerksom på:**\n${(r.guidance.attention||[]).map(x=>`- ${x}`).join("\n")||"- Ingen"}\n\n`;
    md+=`**Sjekk før møtet:**\n${(r.guidance.check_before_meeting||[]).map(x=>`- ${x}`).join("\n")||"- Ingen"}\n\n`;
    md+=`**HR/juridisk merknad:** ${r.guidance.legal_hr_note||"Ingen"}\n\n`;
    md+=`**Neste steg:**\n${(r.guidance.next_steps||[]).map(x=>`- ${x}`).join("\n")||"- Ingen"}\n\n`;
    md+=`**Kilder:** ${(r.guidance.source_ids||[]).join(", ")||"Ingen"}\n\n`;
    if((r.guidance.supplementary_sources||[]).length){
      md+=`**Supplerende kilder:**\n${r.guidance.supplementary_sources.map(x=>`- ${x.title||"Uten tittel"} — ${x.url||""}`).join("\n")}\n\n`;
    }
  }
}

fs.writeFileSync(mdPath,md,"utf8");
console.log("\nFerdig.");
console.log(`OK: ${counts.OK||0} | Bør sjekkes: ${counts["BØR SJEKKES"]||0} | Kritisk avvik: ${counts["KRITISK AVVIK"]||0} | Teknisk feil: ${counts["TEKNISK FEIL"]||0}`);
console.log(`Rapport: ${mdPath}`);
console.log(`Detaljer: ${jsonPath}\n`);
