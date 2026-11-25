// Synkroniser et gammelt manuelt vurderingsskjema med NYE fagkriterier
// uten å skrive om originalen eller oppgi noe som godkjent.
// Ingen nettverk, KI-kall, hemmeligheter eller produksjonsdata.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args=process.argv.slice(2);
if(args.length!==2){
  console.error("Bruk: node scripts/prepare-source-review.mjs <run.json> <manual-review.json>");
  process.exit(2);
}
const [runPath,reviewPath]=args.map(p=>path.resolve(p));
const read=file=>JSON.parse(fs.readFileSync(file,"utf8").replace(/^\uFEFF/,""));
const run=read(runPath), review=read(reviewPath);
const current=read(path.join(root,"tests/AI-SOURCE-ACCEPTANCE-CASES.json")).cases;
function guard(yes,message){
  if(!yes)throw Error(message);
}
guard(run.createdAt && review.sourceRunCreatedAt===run.createdAt,
  "Rapport og vurderingsskjema maa komme fra samme KI-kjoering.");
guard(review.schemaVersion===1 && run.cases?.length===current.length &&
  review.cases?.length===current.length && review.caseCount===current.length,
  "Feil skjemaversjon eller antall saker.");
const runMap=new Map(run.cases.map(x=>[x.id,x]));
const reviewMap=new Map(review.cases.map(x=>[x.caseId,x]));
guard(runMap.size===current.length && reviewMap.size===current.length,
  "Sakene har dupliserte ID-er.");
const changes=[];
for(const tc of current){
  const oldRun=runMap.get(tc.id), item=reviewMap.get(tc.id);
  guard(oldRun && item && item.schemaVersion===1,"Ugyldig eller manglende sak: "+tc.id);
  for(const [key,field,prefix] of [
    ["manualMust","must","M"],["manualCritical","critical","C"]
  ]){
    const historical=oldRun[key], newest=tc[key], existing=item[field];
    guard(Array.isArray(historical) && Array.isArray(newest) && Array.isArray(existing),
      tc.id+": mangler opprinnelige kriterier.");
    guard(historical.length<=newest.length &&
      historical.every((criterion,i)=>newest[i]===criterion),
      tc.id+": gamle kriterier ble endret, ikke bare utvidet; krever manuell gjennomgang.");
    guard(existing.length>=historical.length && existing.length<=newest.length &&
      existing.every((entry,i)=>entry?.id===prefix+(i+1) &&
        entry?.criterion===newest[i]),
      tc.id+": eksisterende vurderinger kan ikke kobles trygt mot kriteriene.");
    const added=newest.length-existing.length;
    for(let i=existing.length;i<newest.length;i++){
      existing.push({id:prefix+(i+1),criterion:newest[i],status:"pending",reason:""});
    }
    if(added)changes.push(tc.id+" "+field+": "+added+" nytt PENDING-kriterium");
  }
}
// Ikke skriv tilbake til originalen; aldri skriv over en tidligere generert fil.
const parsed=path.parse(reviewPath);
const output=path.join(parsed.dir,parsed.name+"-aligned"+parsed.ext);
fs.writeFileSync(output,JSON.stringify(review,null,2)+"\n",{encoding:"utf8",flag:"wx"});
const summary=[
  "SAMTALESTOTTE - KILDEKONTROLL FORBEREDT",
  "Samme ekte KI-rapport: "+run.createdAt,
  "Kriterier fra senere kodeendringer er synkronisert.",
  ...(changes.length?changes:["Ingen kriterier lagt til."]),
  "Original vurderingsfil er UENDRET.",
  "Nytt vurderingsskjema: "+output,
  "Godkjenning er IKKE gitt. Faglige funn og kriterier maa fortsatt vurderes.",
  "Ingen ekte KI-kall, ingen API-kostnader, ingen deploy."
].join("\n");
console.log(summary);
if(process.platform==="win32"){
  const tmp=path.join(parsed.dir,"source-review-clipboard-summary.txt");
  fs.writeFileSync(tmp,summary,"utf8");
  try{
    const p=spawnSync("powershell.exe",[
      "-NoProfile","-NonInteractive","-Command",
      "$ErrorActionPreference='Stop'; Set-Clipboard -Value ([IO.File]::ReadAllText($env:REVIEW_CLIPBOARD_FILE,[Text.Encoding]::UTF8))"
    ],{env:{...process.env,REVIEW_CLIPBOARD_FILE:tmp},encoding:"utf8",windowsHide:true,timeout:12000});
    if(p.status===0)console.log("Kort status er kopiert med Set-Clipboard. Bruk Ctrl+V i chatten.");
    else console.error("Kunne ikke kopiere status automatisk; se statusen skrevet ut over.");
  } finally {
    fs.rmSync(tmp,{force:true});
  }
}
