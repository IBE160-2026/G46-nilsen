// Kostnadsfri revurdering av ALLEREDE lagret målrettet ekte KI-rapport.
// Bruker bare lokal JSON + eksisterende evaluator. Ingen AI/API/nettverk/Render.
// Skriver egen rapport; original og manuelle godkjenninger endres aldri.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { evaluateSourceAcceptanceCase } from "../tests/support/source-acceptance-evaluator.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const dir=path.join(root,"test-results");
const args=process.argv.slice(2);
if(args.length>1){
  console.error("Bruk: node scripts/reassess-source-recheck.mjs [source-recheck-....json]");
  process.exit(2);
}
let input;
if(args.length){
  input=path.resolve(args[0]);
}else{
  const choices=fs.readdirSync(dir).filter(name=>
    /^source-recheck-\d{4}-.*\.json$/.test(name)
  ).map(name=>({name,path:path.join(dir,name),
    mtime:fs.statSync(path.join(dir,name)).mtimeMs}));
  if(!choices.length){
    console.error("Fant ingen målrettet source-recheck-*.json i test-results.");
    process.exit(2);
  }
  input=choices.sort((a,b)=>b.mtime-a.mtime)[0].path;
}
const raw=fs.readFileSync(input,"utf8");
const run=JSON.parse(raw.replace(/^\uFEFF/,""));
const expected=["SRC-C-VETERINAER","SRC-E-ORDINAER"];
const seen=(run.cases||[]).map(x=>x.id);
if(run.targeted!==true || run.environment!=="isolated-local-test" ||
  run.provider!=="openai" || !Array.isArray(run.cases) ||
  seen.length!==2 || seen.some(x=>!expected.includes(x)) ||
  new Set(seen).size!==2 || !expected.every(id=>seen.includes(id))){
  console.error("Rapporten er ikke en isolert, målrettet omtest med akkurat C og E.");
  process.exit(2);
}
const all=JSON.parse(fs.readFileSync(path.join(root,"tests/AI-SOURCE-ACCEPTANCE-CASES.json"),"utf8")).cases;
const testCases=new Map(all.map(x=>[x.id,x]));
const decisions=run.cases.map(record=>{
  const previous=Array.isArray(record.issues)?record.issues:[];
  const issues=record.technicalError
    ? ["Teknisk feil: "+record.technicalError]
    : evaluateSourceAcceptanceCase(testCases.get(record.id),record.guidance,record.followup);
  return {id:record.id,previous,issues};
});
const now=new Date().toISOString().replace(/[:.]/g,"-");
const out=path.join(path.dirname(input),"source-recheck-offline-"+now+".md");
const lines=[
  "# Kostnadsfri reanalyse av lagret ekte KI-omtest",
  "",
  "Originalfil: "+input,
  "Opprinnelig tidsstempel: "+run.createdAt,
  "Automatisk reanalyse: "+new Date().toISOString(),
  "",
  "**Ingen nye modellkall. Kun ny evaluering av eksisterende JSON.**",
  "**Dette er verken juridisk faktasjekk eller formell faglig godkjenning.**",
  ""
];
for(const x of decisions){
  lines.push("## "+x.id,"",
    "Opprinnelige maskinelle signaler: "+x.previous.length,
    ...x.previous.map(s=>"- FØR: "+s),
    "Maskinelle signaler med rettet evaluator: "+x.issues.length,
    ...x.issues.map(s=>"- NÅ: "+s),
    x.issues.length===0 ? "Ny maskinell evaluering: OK (ikke faglig signoff)."
      : "Ny maskinell evaluering: ÅPENT AVVIK.",
    "");
}
const unresolved=decisions.filter(x=>x.issues.length);
lines.push("Sammendrag: "+(2-unresolved.length)+"/2 uten maskinelle signaler ved revurdering.",
  "Originalrapport og tidligere registrerte avvik er UENDRET.",
  "Den opprinnelige fem-case-kildekontrollen står fremdeles åpen.",
  "Beslutning om faglig godkjenning krever separat dokumentert vurdering.",
  "");
fs.writeFileSync(out,lines.join("\n"),{encoding:"utf8",flag:"wx"});
console.log("SAMTALESTOTTE - KOSTNADSFRI REANALYSE");
for(const x of decisions)console.log(x.id+": før "+x.previous.length+" varsel, nå "+x.issues.length+" varsel");
console.log("Rapport: "+out);
console.log("Originalfil uendret. Ingen API-kall. Ingen formell faglig godkjenning.");
if(process.platform==="win32" && process.env.SOURCE_RECHECK_SKIP_CLIPBOARD!=="1"){
  const clipboard=spawnSync("powershell.exe",[
    "-NoProfile","-NonInteractive","-Command",
    "$ErrorActionPreference='Stop'; Set-Clipboard -Value ([IO.File]::ReadAllText($env:SOURCE_RECHECK_CLIPBOARD_PATH,[Text.Encoding]::UTF8))"
  ],{env:{...process.env,SOURCE_RECHECK_CLIPBOARD_PATH:out},
    encoding:"utf8",windowsHide:true,timeout:12000});
  if(clipboard.status===0)console.log("Rapport kopiert med Set-Clipboard. Lim inn med Ctrl+V.");
  else console.warn("Kunne ikke kopiere automatisk. Rapporten er lagret pa PC-en.");
}
if(unresolved.length)process.exitCode=1;
