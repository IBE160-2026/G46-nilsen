import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { unsafeAdoption } from "./golden-utils.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "AI-GOLDEN-CASES.json"), "utf8"));
const allCases = data.cases || [];
const pilotOnly = process.argv.includes("--pilot");
const requestedLimit = Number(process.env.AI_TEST_LIMIT || 0);
const selectedCases = pilotOnly ? allCases.filter(tc => tc.pilot_regression) : allCases;
const cases = requestedLimit > 0 ? selectedCases.slice(0, requestedLimit) : selectedCases;
const port = 3203;
const base = `http://127.0.0.1:${port}`;

if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
  console.error("\nMangler OPENAI_API_KEY eller OPENROUTER_API_KEY i .env. Fasittesten er ikke startet.\n");
  process.exit(1);
}

console.log("\nSamtalestøtte – fasitbasert KI-test");
console.log(pilotOnly ? `Kjører ${cases.length} pilot-regresjonscaser.` : `Kjører ${cases.length} av ${allCases.length} golden cases.`);
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

  const opening = String(guidance?.opening || "").trim();
  const openingWords = opening ? opening.split(/\s+/u).filter(Boolean).length : 0;
  if (openingWords > 75) {
    review.push(`Åpning: for lang (${openingWords} ord; bør normalt være maks ca. 75)`);
  }
  if (/\b(?:du bør|bør du|kontakt HR|kontakt juridisk|følg (?:virksomhetens|lokal|intern|gjeldende)?\s*prosedyre|varsle (?:ansvarlig|nærmeste)?\s*leder|kvalitetssikre)\b/iu.test(opening)) {
    review.push("Åpning: ser ut til å inneholde instruksjoner til lederen i stedet for bare replikk");
  }
  if (/\b(?:medarbeideren|lederen)\b/iu.test(opening) && !/\bdu\b/iu.test(opening)) {
    review.push("Åpning: ser ut til å være skrevet om samtalen i tredjeperson, ikke som muntlig replikk");
  }

  const openingChecks = tc.opening_checks || null;
  if (openingChecks) {
    const maxWords = Number(openingChecks.max_words || 0);
    if (maxWords > 0 && openingWords > maxWords) {
      review.push(`Pilotåpning: ${openingWords} ord, maks ${maxWords} i denne casen`);
    }
    for (const pattern of openingChecks.forbidden_patterns || []) {
      if (new RegExp(pattern, "iu").test(opening)) {
        review.push(`Pilotåpning: inneholder uønsket mekanisk/instruksjonsaktig formulering (${pattern})`);
      }
    }
    const required = openingChecks.required_patterns_any || [];
    if (required.length && !required.some(pattern => new RegExp(pattern, "iu").test(opening))) {
      review.push("Pilotåpning: mangler et sentralt, situasjonsspesifikt element");
    }
    const sentenceCount = opening.split(/[.!?]+(?:\s|$)/u).map(x => x.trim()).filter(Boolean).length;
    if (sentenceCount > 4) {
      review.push(`Pilotåpning: ${sentenceCount} setninger; bør være maks 4`);
    }
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
      review.push("Faglig/regelverk: fasiten forventer tydelig relevant kvalitetssikring eller videre henvisning");
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
    if((r.analysis.dilemma||[]).length){
      md+=`**Dilemma / spenningspunkter:**\n${r.analysis.dilemma.map(x=>`- ${x}`).join("\n")}\n\n`;
    }
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
    md+=`**Faglig/regelverksmerknad:** ${r.guidance.legal_hr_note||"Ingen"}\n\n`;
    md+=`**Neste steg:**\n${(r.guidance.next_steps||[]).map(x=>`- ${x}`).join("\n")||"- Ingen"}\n\n`;
    md+=`**Kilder:** ${(r.guidance.source_ids||[]).join(", ")||"Ingen"}\n\n`;
    if(r.require_evidence){
      md+="**Manuell kildekontroll:** Kontroller at hver kilde faktisk støtter påstanden den brukes til, og at organisasjoner ikke tilskrives råd med en kilde som ikke støtter attribusjonen.\n\n";
    }
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
