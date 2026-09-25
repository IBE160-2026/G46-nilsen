import fs from "node:fs";

const baseUrl = process.env.SIMULATION_TEST_URL || "http://localhost:3000";
const cases = JSON.parse(fs.readFileSync("SIMULATION-TEST-CASES-V19-2.json", "utf8"));
const genericSurprise = [
  /samarbeidet fungerer (ganske )?bra/i,
  /det går (egentlig )?greit/i,
  /jeg vil gjerne høre hva du tenker/i
];
const meta = [/som medarbeider/i,/i denne øvelsen/i,/rollespill/i,/som KI/i,/du bør som leder/i];

async function call(body) {
  const res = await fetch(`${baseUrl}/api/simulation-turn`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });
  const raw = await res.text();
  let data;
  try { data = JSON.parse(raw); }
  catch { throw new Error(`Ikke JSON (${res.status}): ${raw.slice(0,160)}`); }
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return String(data.reply || "").trim();
}

function evaluate(reply, tc) {
  const lower = reply.toLowerCase();
  const flags = [];
  if (reply.length > 700) flags.push(`langt svar (${reply.length} tegn)`);
  if (reply.length < 5) flags.push("svært kort svar");
  if (meta.some(r => r.test(reply))) flags.push("rollebrudd/metatekst");
  const hits=(tc.forbidden||[]).filter(x=>lower.includes(x.toLowerCase()));
  if(hits.length) flags.push(`mulig uønsket/oppdiktet detalj: ${hits.join(", ")}`);
  if(tc.style === "surprise" && genericSurprise.some(r=>r.test(reply))) flags.push("Overrask meg virker fortsatt generisk");
  return flags;
}

const lines=[
  "# Live-test Samtalesimulator v19.2",
  `Kjørt: ${new Date().toLocaleString("nb-NO")}`,
  `Base URL: ${baseUrl}`,
  ""
];
let ok=0, flagged=0, failed=0;
for(const tc of cases){
  process.stdout.write(`${tc.id} [${tc.fidelity}] ... `);
  try{
    const turns=[{role:"leader",text:tc.leader}];
    const reply=await call({situation:tc.situation,analysis:null,followups:{},guidance:null,fidelity:tc.fidelity,mode:"solo",style:tc.style,turns});
    const flags=evaluate(reply,tc);
    if(flags.length){flagged++;console.log("BØR SJEKKES");}else{ok++;console.log("OK");}
    lines.push(
      `## ${tc.id} – ${flags.length ? "Bør sjekkes" : "OK"}`,
      `**Modus:** ${tc.fidelity === "factual" ? "Hold deg til saken" : "Utfordre meg"}`,
      `**Stil:** ${tc.style}`,
      `**Situasjon:** ${tc.situation}`,
      `**Leder:** ${tc.leader}`,
      `**Medarbeider:** ${reply}`,
      flags.length ? `**Automatiske flagg:** ${flags.join("; ")}` : "**Automatiske flagg:** Ingen",
      `**Se spesielt etter:** ${tc.focus}`,
      "",
      "**Menneskelig vurdering:** Realisme: ___  Faktatrohet/modus: ___  Reaksjonsstil: ___  Treningsverdi: ___",
      "","---",""
    );
  }catch(err){failed++;console.log("TEKNISK FEIL");lines.push(`## ${tc.id} – Teknisk feil`,`**Feil:** ${err.message}`,"","---","");}
}
lines.splice(3,0,`Resultat: ${ok} OK · ${flagged} bør sjekkes · ${failed} tekniske feil`,"","> Faktamodus og fri modus vurderes etter forskjellige mål. Automatiske flagg erstatter ikke menneskelig vurdering.","");
fs.mkdirSync("test-results",{recursive:true});
const out=`test-results/simulation-v19-2-${new Date().toISOString().replace(/[:.]/g,"-")}.md`;
fs.writeFileSync(out,lines.join("\n"));
console.log(`\nRapport: ${out}`);
if(failed) process.exitCode=2; else if(flagged) process.exitCode=1;
