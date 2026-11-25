// Korriger B4/D3 kildekandidater i eksisterende, IKKE signert lokal
// 14-påstands-kladd. Les ORIGINAL ekte KI-JSON og verifiser at ny kilde
// var synlig i nøyaktig SAMME svar. Ingen API-kall og ingen automatisk
// bekreftelse av faktisk kildestøtte. Skriv aldri over tidligere filer.
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const args=process.argv.slice(2);
if(args.length!==2){
  console.error("Bruk: node scripts/refine-source-claim-draft.mjs <old-run.json> <claim-draft.json>");
  process.exit(2);
}
const [runPath,draftPath]=args.map(p=>path.resolve(p));
const read=p=>JSON.parse(fs.readFileSync(p,"utf8").replace(/^\uFEFF/,""));
const run=read(runPath),draft=read(draftPath);
const must=(ok,msg)=>{if(!ok)throw Error(msg);};
must(run.createdAt==="2026-11-25T13:47:13.670Z" &&
  draft.sourceRunCreatedAt===run.createdAt && draft.schemaVersion===1 &&
  draft.caseCount===5 && run.cases?.length===5 && draft.cases?.length===5,
  "Feil kjøring, schema, caseantall eller kildekladd.");
const byRun=new Map(run.cases.map(x=>[x.id,x]));
const byDraft=new Map(draft.cases.map(x=>[x.caseId,x]));
must(byRun.size===5 && byDraft.size===5,"Dupliserte case-ID-er.");
const fixes=[
  {id:"SRC-B-STAT-FRAVAER",part:"followup",
    claim:"Du kan ikke kreve å få vite diagnosen.",
    old:"https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte",
    newUrl:"https://www.nav.no/sykmeldt",
    role:"provider_url",
    note:"Den direkte NAV-siden var allerede vist som provider_url i GAMMELT oppfølgingssvar."},
  {id:"SRC-D-BYGG-SHA",part:"first",
    claim:"Ved arbeid i høyden skal risiko vurderes før arbeidet starter, og nødvendige tiltak skal iverksettes på bakgrunn av vurderingen.",
    old:"https://www.arbeidstilsynet.no/hms/risikovurdering/",
    newUrl:"https://www.arbeidstilsynet.no/regelverk/forskrifter/forskrift-om-utforelse-av-arbeid",
    role:"model_selected",
    note:"Forskrift med § 17-1 var allerede modellvalgt i GAMMELT første råd."}
];
const rows=["# Korrigerte kildekandidater – ingen faglig godkjenning","",
  "Original KI-kjøring: "+run.createdAt,"","Begge kilder er kontrollert for SYNLIGHET i samme svar. Selve rettslige kildebelegget må fortsatt vurderes manuelt.",""];
for(const fix of fixes){
  const runCase=byRun.get(fix.id), form=byDraft.get(fix.id);
  must(runCase && form,"Mangler sak "+fix.id);
  const response=fix.part==="first"?runCase.guidance:runCase.followup;
  const sources=response?.evidence_sources||[];
  must(sources.some(s=>s.url===fix.newUrl && s.evidenceRole===fix.role),
    "Ny kilde var ikke synlig i riktig svar: "+fix.id);
  const matches=(form.claims||[]).filter(x=>x.answerPart===fix.part &&
    x.claimText===fix.claim && x.sourceUrl===fix.old);
  must(matches.length===1,"Forventet en uutfylt gammel kildekandidat: "+fix.id);
  const claim=matches[0];
  must(!claim.sourceExcerpt && !claim.sourceCheckedAt && !claim.verdict &&
    !claim.periodVerified && !claim.employerScopeVerified &&
    !claim.reason,"En kandidat er allerede kontrollert! Avbryter for ikke å endre tidligere vurdering.");
  claim.sourceUrl=fix.newUrl;
  rows.push("## "+fix.id+" / "+fix.part,"",
    "KI-påstand: "+fix.claim,"Forrige kandidat: "+fix.old,
    "Bedre, faktisk vist kandidat: "+fix.newUrl,
    "Proveniens i originalt svar: "+fix.role,
    fix.note,"");
}
for(const id of ["SRC-C-VETERINAER","SRC-E-ORDINAER"]){
  must(byDraft.get(id)?.must?.[3]?.status==="not_met",
    "Gammelt, registrert M4-avvik må fortsatt stå: "+id);
}
must(draft.cases.every(c=>c.claimInventoryComplete!==true),
  "Ingen kandidatkorreksjon når noe er markert som fullstendig faglig kontrollert");
const p=path.parse(draftPath),base=path.join(p.dir,p.name+"-sources-refined");
const outJson=base+".json",outMd=base+".md";
must(!fs.existsSync(outJson)&&!fs.existsSync(outMd),
  "Korrigert kladd finnes allerede; original og tidligere kladd er urørt.");
rows.push("## Gjenstående","",
  "Denne kladden er IKKE signert. Alle krav om kildesitat, kildekontrolldato, lov-/tariffperiode, arbeidsgiverområde, fagkriterier og fullstendighet står fortsatt åpne.",
  "Minst fire ytterligere rettspåstandskandidater er nevnt i docs/KILDEKONTROLL-14-PASTANDER-2026-11-25.md.",
  "Opprinnelig JSON og begge tidligere kladder er uendret.","");
fs.writeFileSync(outJson,JSON.stringify(draft,null,2)+"\n",{encoding:"utf8",flag:"wx"});
fs.writeFileSync(outMd,rows.join("\n"),{encoding:"utf8",flag:"wx"});
const summary=[
  "SAMTALESTOTTE - KILDEKANDIDATER KORRIGERT",
  "B4: Bruker faktisk vist NAV-diagnoseside i oppfolging.",
  "D3: Bruker faktisk vist forskrift om arbeid i hoyden i forste raad.",
  "Gammel KI-JSON, forrige kladd og dokumenterte C/E-avvik: UENDRET.",
  "Ny gjennomgangskladd: "+outJson,
  "Lesbar kontrollrapport: "+outMd,
  "FAGLIG GODKJENNING: FORTSATT IKKE GITT.",
  "Ekte KI-kall: 0 | API-kostnad: 0 | Produksjon: UENDRET."
].join("\n");
console.log(summary);
if(process.platform==="win32" && process.env.SOURCE_REVIEW_SKIP_CLIPBOARD!=="1"){
  const r=spawnSync("powershell.exe",[
    "-NoProfile","-NonInteractive","-Command",
    "$ErrorActionPreference='Stop'; Set-Clipboard -Value $env:SOURCE_REVIEW_CLIPBOARD_SUMMARY"
  ],{encoding:"utf8",windowsHide:true,timeout:12000,
    env:{...process.env,SOURCE_REVIEW_CLIPBOARD_SUMMARY:summary}});
  if(r.status===0)console.log("Status kopiert automatisk med Set-Clipboard.");
  else console.warn("Kunne ikke kopiere status; den er skrevet i terminalen.");
}
