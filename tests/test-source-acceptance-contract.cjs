// Kontrakttest for fem anonymiserte kildescenarioer.
// Ingen nettverk, KI-kall, tokens eller produksjonsdata.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=rel=>JSON.parse(fs.readFileSync(path.join(root,rel),"utf8"));
const cases=read("tests/AI-SOURCE-ACCEPTANCE-CASES.json").cases;
const sectors=new Set(read("data/OCCUPATION-SOURCE-MAP.json").sectors.map(x=>x.id));
const sourceIds=new Set([
  ...read("data/SOURCEBANK.json").sources,
  ...read("data/OCCUPATION-LEGAL-SOURCES.json").sources
].map(x=>x.id));
assert.equal(cases.length,5,"Akseptansepakken må bestå av akkurat fem anonymiserte scenarioer");
assert.equal(new Set(cases.map(x=>x.id)).size,5,"Alle case-ID-er må være unike");
for(const tc of cases){
  assert.match(tc.id,/^SRC-[A-E]-[A-Z0-9-]+$/,"Ugyldig case-ID");
  assert(sectors.has(tc.sectorId),tc.id+": ukjent sektor");
  assert(["private","state","municipal"].includes(tc.employerType),tc.id+": ukjent arbeidsgivertype");
  for(const key of ["occupation","topicId","subtopic","title","situation","question"]){
    assert.equal(typeof tc[key],"string",tc.id+": "+key+" må være tekst");
    assert(tc[key].trim().length>=3,tc.id+": "+key+" kan ikke være tomt");
  }
  for(const key of ["preferredSourceIds","forbidSourceIds","manualMust","manualCritical"]){
    assert(Array.isArray(tc[key]),tc.id+": "+key+" må være liste");
    assert(tc[key].length>= (key==="preferredSourceIds"&&!tc.expectEvidence ? 0 : 1),
      tc.id+": "+key+" mangler forventningsgrunnlag");
  }
  assert.equal(typeof tc.expectEvidence,"boolean");
  assert.equal(new Set(tc.preferredSourceIds).size,tc.preferredSourceIds.length);
  assert.equal(new Set(tc.forbidSourceIds).size,tc.forbidSourceIds.length);
  for(const id of [...tc.preferredSourceIds,...tc.forbidSourceIds]){
    assert(sourceIds.has(id),tc.id+": registrert kildereferanse mangler: "+id);
  }
  assert(tc.forbidSourceIds.every(id=>!tc.preferredSourceIds.includes(id)),
    tc.id+": kilden kan ikke være både anbefalt og forbudt");
  assert(tc.manualMust.length>=2 && tc.manualCritical.length>=2,
    tc.id+": faglig akseptansefasit skal inneholde flere konkrete vurderinger");
  assert(!/@[a-z0-9.-]+\.[a-z]{2,}/i.test(tc.situation+" "+tc.question),
    tc.id+": reelle personopplysninger eller e-post er ikke tillatt i cases");
}
assert.equal(cases.filter(x=>x.expectEvidence).length,4,
  "Fire etterprøvbare fag-/rettsspørsmål forventes");
assert.equal(cases.filter(x=>!x.expectEvidence).length,1,
  "Ett ordinært kontrollscenario må ikke kreve kilder");
assert.equal(cases.filter(x=>x.question).length,5,
  "Alle scenarioer må teste oppfølging, ikke bare første svar");
const server=fs.readFileSync(path.join(root,"server.js"),"utf8");
assert(server.includes('OCCUPATION_CONTEXT_ENABLED'),
  "Yrkesrelevans må være kontrollert av eksplisitt testbryter");
assert(server.includes('evidence_sources: evidenceSources'),
  "Første råd og oppfølging må levere synlig kildegrunnlag");
const liveRunner=fs.readFileSync(path.join(root,"tests/test-source-acceptance-live.js"),"utf8");
assert(liveRunner.includes('process.platform === "win32"') &&
  liveRunner.includes("Set-Clipboard") &&
  liveRunner.includes("SOURCE_ACCEPTANCE_CLIPBOARD_PATH: mdPath"),
  "Ekte KI-test må kopiere lesbar Markdown-fagrapport automatisk på Windows");
console.log("KILDE-AKSEPTANSE KONTRAKT OK: 5 syntetiske cases, kilderegister og manuell fasit; 0 ekte KI-kall");
