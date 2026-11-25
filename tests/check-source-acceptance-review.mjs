// Kjører kun LOKAL kvalitetskontroll av et menneskelig utfylt
// vurderingsskjema. Ingen API-nøkkel, nettverk eller KI-kall.
// Exit 0 = dokumentert manuell akseptanse for ALLE cases,
// ikke en automatisk bekreftelse av juridisk korrekthet.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateManualSourceReview } from "./support/source-acceptance-manual-review.mjs";

const args=process.argv.slice(2);
if(args.length!==2 || args.includes("--help")) {
  console.error("Bruk: node tests/check-source-acceptance-review.mjs <source-acceptance-run.json> <manual-review.json>");
  console.error("Rapportene må være fra samme lokale, anonymiserte testkjøring.");
  process.exit(2);
}
function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(file),"utf8"));
  } catch(err) {
    console.error("Kan ikke lese lokal JSON-fil: "+err.message);
    process.exit(2);
  }
}
const run=readJson(args[0]);
const review=readJson(args[1]);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const cases=JSON.parse(fs.readFileSync(
  path.join(root,"tests/AI-SOURCE-ACCEPTANCE-CASES.json"),"utf8"
)).cases;
const expected=new Map(cases.map(tc=>[tc.id,tc]));
const output=(reason)=>{
  console.error("KAN IKKE GODKJENNE: "+reason);
  process.exit(2);
};
if(!Array.isArray(run.cases) || !Array.isArray(review.cases) ||
   run.cases.length!==cases.length || review.cases.length!==cases.length) {
  output("alle fem forventede tilfellene må finnes i begge rapportene");
}
if(!run.createdAt || review.sourceRunCreatedAt!==run.createdAt ||
   review.schemaVersion!==1 || review.caseCount!==cases.length) {
  output("manuelt skjema tilhører ikke samme testkjøring / støttet skjema");
}
const runMap=new Map(run.cases.map(item=>[item.id,item]));
const reviewMap=new Map(review.cases.map(item=>[item.caseId,item]));
if(runMap.size!==cases.length || reviewMap.size!==cases.length ||
   [...expected.keys()].some(id=>!runMap.has(id)||!reviewMap.has(id))) {
  output("dupliserte eller manglende case-ID-er");
}
let approved=0, rejected=0, pending=0;
for(const tc of cases) {
  const result=evaluateManualSourceReview(tc,runMap.get(tc.id),reviewMap.get(tc.id));
  if(result.state==="REVIEWED_OK")approved++;
  else if(result.state==="REJECTED")rejected++;
  else pending++;
  console.log(tc.id+": "+result.state);
  for(const reason of result.problems) console.log("  - "+reason);
}
console.log("Manuelt kildearbeid: "+approved+"/"+cases.length+
  " faglig dokumenterte, "+rejected+" med avvik, "+pending+" ikke ferdig vurdert.");
if(approved!==cases.length) {
  console.error("IKKE FAGLIG GODKJENT. Et grønt KI-/CI-resultat erstatter ikke kontrollen.");
  process.exitCode=1;
} else {
  console.log("Alle manuelle kontrollpunkter er dokumentert. Eksakt kildestøtte er fortsatt et faglig ansvar.");
}
