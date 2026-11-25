// Registrer de to faktiske avvikene i 25.11.2026-kjoeringen, UTEN aa
// skrive over original vurderingsfil, og UTEN aa godkjenne andre punkter.
// Krever baade originalt run-JSON og synkronisert -aligned.json.
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const args=process.argv.slice(2);
if(args.length!==2){
  console.error("Bruk: node scripts/record-source-review-findings.mjs <run.json> <manual-review-aligned.json>");
  process.exit(2);
}
const [runFile,reviewFile]=args.map(p=>path.resolve(p));
const read=p=>JSON.parse(fs.readFileSync(p,"utf8").replace(/^\uFEFF/,""));
const run=read(runFile),review=read(reviewFile);
const guard=(ok,msg)=>{if(!ok)throw Error(msg);};
guard(review.sourceRunCreatedAt===run.createdAt && review.schemaVersion===1,
  "Run og aligned-vurdering er ikke fra samme test eller samme skjemaversjon");
guard(run.cases?.length===5 && review.cases?.length===5,
  "Forventet fem caser fra 25.11.2026");
guard(run.createdAt==="2026-11-25T13:47:13.670Z",
  "Dette verktøyet er bundet til den opprinnelige 25.11.2026-testen; ikke bruk paa senere kjøringer");
guard(path.basename(reviewFile).endsWith("-aligned.json"),
  "Bruk synkronisert -aligned.json, ikke opprinnelig vurderingsfil");
const historical=new Map(run.cases.map(x=>[x.id,x]));
const form=new Map(review.cases.map(x=>[x.caseId,x]));
guard(historical.size===5 && form.size===5,"Dupliserte caser");
const checks=[
  {
    id:"SRC-C-VETERINAER",
    text:"Takk for at dere møter.",
    reason:"Gammel KI-aapning sier 'Takk for at dere møter' uten at felles møte er bekreftet; motstridende raad senere om separate samtaler.",
    note:"Faglig avvik i faktisk gammel KI-respons: felles møte forutsatt, selv om møtesammensetningen er uavklart. Nye promptregler ble lagt til etter denne kjøreturen og beviser ikke rettet modellrespons."
  },
  {
    id:"SRC-E-ORDINAER",
    text:"Før jeg bestemmer",
    reason:"Gammel KI-respons lar lederen si 'Før jeg bestemmer', selv om formell beslutningsmyndighet ikke er dokumentert i saken.",
    note:"Faglig avvik i faktisk gammel KI-respons: beslutningsfullmakt forutsatt. Nytt instruksjonsvern ble lagt inn senere, men denne kjøringen kan ikke godkjennes mot det nye M4-kriteriet."
  }
];
for(const x of checks){
  const src=historical.get(x.id),dst=form.get(x.id);
  guard(src && dst,"Case mangler: "+x.id);
  const text=JSON.stringify(src.guidance||{});
  guard(text.includes(x.text),"Ventet opprinnelig KI-sitat finnes ikke: "+x.id);
  guard(Array.isArray(dst.must) && dst.must.length===4 &&
    dst.must[3]?.id==="M4" && dst.must[3]?.status==="pending",
    "Nytt M4 mangler eller er allerede vurdert: "+x.id);
  dst.must[3].status="not_met";
  dst.must[3].reason=x.reason;
  // Ingen kontroloer- eller datoattest, ingen paastandsverifikasjon.
  if(!dst.finalNotes?.trim())dst.finalNotes=x.note;
}
const parsed=path.parse(reviewFile);
const output=path.join(parsed.dir,parsed.name+"-findings"+parsed.ext);
fs.writeFileSync(output,JSON.stringify(review,null,2)+"\n",{encoding:"utf8",flag:"wx"});
const summary=[
  "SAMTALESTOTTE - FAGLIGE AVVIK REGISTRERT",
  "Gammel KI-kjoering: "+run.createdAt,
  "SRC-C-VETERINAER M4: NOT_MET - forutsetter felles mote uten avklaring",
  "SRC-E-ORDINAER M4: NOT_MET - forutsetter lederfullmakt uten grunnlag",
  "Originale rapporter og aligned-skjema: UENDRET",
  "Nytt vurderingsutkast: "+output,
  "Andre kriterier og alle rettskildepaastander: FORTSATT IKKE GODKJENT",
  "Ny modellkontroll av C/E kreves for aa kontrollere de senere rettingene.",
  "Ekte KI-kall: 0 | Kostnad: 0 | Produksjon: UENDRET"
].join("\n");
console.log(summary);
if(process.platform==="win32"){
  const p=spawnSync("powershell.exe",[
    "-NoProfile","-NonInteractive","-Command",
    "$ErrorActionPreference='Stop'; Set-Clipboard -Value $env:REVIEW_SUMMARY_TEXT"
  ],{env:{...process.env,REVIEW_SUMMARY_TEXT:summary},encoding:"utf8",windowsHide:true,timeout:12000});
  if(p.status===0)console.log("Sammendrag kopiert automatisk via Set-Clipboard. Ctrl+V i chatten.");
  else console.warn("Klarte ikke automatisk Set-Clipboard; status er skrevet ut over.");
}
