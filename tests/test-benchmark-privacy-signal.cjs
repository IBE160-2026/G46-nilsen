// Kjør den faktiske, delte navnedetektoren mot den syntetiske benchmarkbanken.
// Ingen KI-kall, nettverk eller persondata. Feil her betyr at gratis bankkontroll
// vil rapportere mulig navn og krever manuell verifisering av årsaken.
const assert=require("node:assert/strict");
const fs=require("node:fs");

(async()=>{
  await import("../src/privacy-name-data.js");
  await import("../src/privacy-detector.js");
  const detector=globalThis.SamtalestottePrivacyDetector;
  assert.equal(typeof detector?.findLikelyGivenNames,"function");
  const bank=JSON.parse(fs.readFileSync("data/BENCHMARK-CASES.json","utf8"));
  const findings=(bank.cases||[]).flatMap(item=>{
    const names=detector.findLikelyGivenNames(item.situation);
    return names.length?[{id:item.id,names}]:[];
  });
  console.log("Benchmark synthetic-name diagnostic:",JSON.stringify(findings));
  assert.deepEqual(detector.findLikelyGivenNames("Til nærmeste leder har saken låst seg."),[],
    "Nærmeste i arbeidsrelasjon er et adjektiv, ikke personnavn");
  assert.ok(detector.findLikelyGivenNames("Jeg snakket med Knut om saken.").some(n=>n.toLowerCase()==="knut"),
    "Regresjonen må fortsatt gjenkjenne et faktisk personnavn");
  assert.deepEqual(findings,[],"Benchmarkbanken inneholder falske eller reelle mulige navnetreff; undersøk uten å svekke detektoren");
  console.log("Benchmark-bankens "+bank.cases.length+" caser: ingen mulige navn i delt navnedetektor");
})().catch(error=>{console.error(error);process.exitCode=1;});
