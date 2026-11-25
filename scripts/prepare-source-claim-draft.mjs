// Opprett utkast til PÅSTANDSVIS kildekontroll fra GAMMEL ekte KI-kjøring.
// Ingen kilder merkes som verifisert; alle godkjenninger forblir åpne.
// Skriver NY JSON og lesbar Markdown; ingen nettverk, KI-kall eller deploy.
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const args=process.argv.slice(2);
if(args.length!==2){
  console.error("Bruk: node scripts/prepare-source-claim-draft.mjs <source-acceptance.json> <aligned-findings.json>");
  process.exit(2);
}
const [runPath,reviewPath]=args.map(p=>path.resolve(p));
const read=p=>JSON.parse(fs.readFileSync(p,"utf8").replace(/^\uFEFF/,""));
const run=read(runPath),review=read(reviewPath);
const fail=message=>{throw Error(message);};
if(run.createdAt!=="2026-11-25T13:47:13.670Z" ||
   review.sourceRunCreatedAt!==run.createdAt ||
   review.schemaVersion!==1 || review.caseCount!==5 ||
   run.cases?.length!==5 || review.cases?.length!==5){
  fail("Verktøyet krever de originale fem anonymiserte svarene fra 25.11.2026 og tilhørende funnfil.");
}
const byCase=new Map(run.cases.map(x=>[x.id,x]));
const byReview=new Map(review.cases.map(x=>[x.caseId,x]));
if(byCase.size!==5 || byReview.size!==5)fail("Dupliserte saks-ID-er.");

const candidates=[
  ["SRC-A-UTESTENGING","followup","en skriftlig advarsel er en disiplinærreaksjon","AT_PERSONALSAKER"],
  ["SRC-A-UTESTENGING","followup","Før du vurderer den, bør du undersøke konkrete hendelser, høre begge kollegene og gi dem reell mulighet til å forklare seg og imøtegå opplysningene.","AT_PERSONALSAKER"],
  ["SRC-B-STAT-FRAVAER","first","arbeidsmiljøloven § 4-6 gir et rettslig utgangspunkt for arbeidsgivers vurdering av nødvendige tiltak så langt det er mulig.","AML_4_6_TILRETTELEGGING"],
  ["SRC-B-STAT-FRAVAER","followup","Dersom medarbeideren er sykmeldt, skal du normalt ta initiativ til oppfølgingsplan sammen med medarbeideren innen fire uker, med mindre det er åpenbart unødvendig.","NAV_SYKEFRAVAER_OPPFOLGING"],
  ["SRC-B-STAT-FRAVAER","followup","Ved helt sykefravær skal du normalt innkalle til dialogmøte 1 innen sju uker; ved delvis sykmelding vurderes behovet.","NAV_SYKEFRAVAER_OPPFOLGING"],
  ["SRC-B-STAT-FRAVAER","followup","Du kan ikke kreve å få vite diagnosen.","NAV_SYKEFRAVAER_OPPFOLGING"],
  ["SRC-B-STAT-FRAVAER","followup","Medarbeideren har en medvirkningsplikt og må bidra med arbeidsrelatert informasjon, men trenger ikke oppgi medisinske detaljer.","NAV_SYKEFRAVAER_OPPFOLGING"],
  ["SRC-D-BYGG-SHA","first","SHA-planen skal oppdateres fortløpende når det skjer endringer som har betydning for sikkerhet, helse og arbeidsmiljø","AT_BUILDING_SITE_COORDINATION"],
  ["SRC-D-BYGG-SHA","first","endringer skal gjøres kjent for berørte arbeidsgivere og arbeidstakere.","AT_BUILDING_SITE_COORDINATION"],
  ["SRC-D-BYGG-SHA","first","Ved arbeid i høyden skal risiko vurderes før arbeidet starter, og nødvendige tiltak skal iverksettes på bakgrunn av vurderingen.","AT_RISIKOVURDERING"],
  ["SRC-D-BYGG-SHA","first","Arbeidsgiver skal også sørge for at arbeidstakerne medvirker i risikovurderingen.","AT_RISIKOVURDERING"],
  ["SRC-D-BYGG-SHA","followup","Byggherren har det overordnede ansvaret for at SHA-arbeidet og planen er ivaretatt, mens koordinatoren følger opp koordineringen i prosjektet.","AT_BUILDING_SITE_COORDINATION"],
  ["SRC-D-BYGG-SHA","followup","Arbeidsgiveren har samtidig ansvar for å risikovurdere og gjennomføre sitt arbeid på en sikker måte.","AT_BUILDING_SITE_COORDINATION"],
  ["SRC-D-BYGG-SHA","followup","Hvis arbeidet allerede pågår og sikkerheten er uavklart, må det stanses forsvarlig etter rutinene.","AT_RISIKOVURDERING"]
];
for(const record of run.cases){
  if(!byReview.has(record.id))fail("Finner ikke vurderingsskjema for "+record.id);
  if(byReview.get(record.id).claims?.length)fail("Avbryter: claims er allerede fylt ut for "+record.id+"; vil ikke overskrive.");
}
for(const [caseId,part,phrase,sourceId] of candidates){
  const record=byCase.get(caseId),form=byReview.get(caseId);
  if(!record || !form)fail("Ukjent sak: "+caseId);
  const response=part==="first"?record.guidance:record.followup;
  const visibleText=part==="first"
    ? ["opening","legal_hr_note","questions","attention","next_steps","check_before_meeting","reactions"]
      .map(key=>JSON.stringify(response?.[key]||"")).join(" ")
    : String(response?.reply||"");
  if(!visibleText.includes(phrase))fail("Sitert påstand finnes ikke eksakt i "+caseId+" / "+part+": "+phrase);
  const selected=(response?.evidence_sources||[]).find(x=>x.id===sourceId && /^https?:\/\//.test(x.url||""));
  if(!selected)fail("Kilden ble ikke vist i SAMME svar: "+caseId+" / "+part+" / "+sourceId);
  form.claims.push({
    answerPart:part,claimText:phrase,sourceUrl:selected.url,
    sourceExcerpt:"",sourceCheckedAt:"",
    periodVerified:false,periodEvidence:"",
    employerScopeVerified:false,scopeEvidence:"",
    verdict:"",reason:""
  });
}
// Eksakt gammelt funn M4 for C/E SKAL fremdeles være not_met.
for(const caseId of ["SRC-C-VETERINAER","SRC-E-ORDINAER"]){
  const form=byReview.get(caseId);
  if(form.must?.[3]?.status!=="not_met")fail("Mangler dokumentert historisk M4-avvik for "+caseId);
}
const parsed=path.parse(reviewPath);
const base=path.join(parsed.dir,parsed.name+"-claim-draft");
const jsonOut=base+".json", mdOut=base+".md";
if(fs.existsSync(jsonOut)||fs.existsSync(mdOut)){
  fail("Avbryter: kladd eksisterer allerede. Ingen filer overskrevet: "+base);
}
const rows=[
  "# Påstandsvis kildekontroll – arbeidskladd",
  "",
  "Fra faktisk, opprinnelig KI-kjøring: "+run.createdAt,
  "**Alle kildevalg er kandidater, IKKE bekreftet støtte fra originalkilden.**",
  "**Ingen lov-/tariffperiode, virkeområde, kildeutdrag, eller faglig status er automatisk verifisert.**",
  "Tidligere M4-avvik for C og E er bevart.",
  ""
];
for(const r of run.cases){
  const form=byReview.get(r.id);
  rows.push("## "+r.id,"",
    "Fagkriterier: "+(form.must||[]).map(x=>x.id+"="+x.status).join("; "),
    "Kritiske kriterier: "+(form.critical||[]).map(x=>x.id+"="+x.status).join("; "),
    "Antall identifiserte rettspåstandskandidater: "+form.claims.length,
    "");
  if(!form.claims.length){
    rows.push("Ingen rettspåstand er forhåndsregistrert. Hele svarløpet må likevel kontrolleres og konklusjonen begrunnes.", "");
  }
  for(const [i,claim] of form.claims.entries()){
    rows.push("### Påstand "+(i+1)+" ["+claim.answerPart+"]",
      "KI-ordlyd: "+claim.claimText,
      "Kandidat-URL synlig i samme svar: "+claim.sourceUrl,
      "Uavklart: originalordlyd, lov-/avtaleperiode, korrekt pliktsubjekt, arbeidsgiver-/tariffvirkeområde og kontekst.",
      "");
  }
}
rows.push("## Videre manuell gjennomgang",
  "",
  "1. Les begge svarene i hver sak og kontroller om flere rettspåstander må registreres.",
  "2. Åpne HVER kandidat-URL i saken og velg et presist kildeutdrag som støtter akkurat formuleringen.",
  "3. Registrer faktiske kildeutdrag, dato, rettsversjon og gyldig virkeområde i JSON-kladden.",
  "4. Vurder hvert must og critical med konkret begrunnelse; merk funn ærlig som not_met/present.",
  "5. Bekreft claimInventoryComplete først etter at all tekst er gjennomgått.",
  "6. Kjør check-source-acceptance-review først etter reell manuell kontroll.",
  "",
  "Originale filer er ikke endret. Kladden er ikke en faglig godkjenning.",
  "");
fs.writeFileSync(jsonOut,JSON.stringify(review,null,2)+"\n",{encoding:"utf8",flag:"wx"});
fs.writeFileSync(mdOut,rows.join("\n"),{encoding:"utf8",flag:"wx"});
const summary=[
  "SAMTALESTOTTE - FAGLIG KILDEKONTROLLKLADD",
  "Opprettet "+candidates.length+" nøyaktige KI-påstander med synlige kildekandidater fra SAMME svar.",
  "Fordeling A=2 B=5 C=0 D=7 E=0.",
  "Alle kildeutdrag, dato/gyldighet, scope og alle øvrige faglige godkjenninger: FORTSATT ÅPNE.",
  "Historiske M4-avvik i C/E: bevart som NOT_MET.",
  "Ny redigerbar JSON: "+jsonOut,
  "Lesbar arbeidsliste: "+mdOut,
  "Originalrapporter er UENDRET. Ekte KI-kall: 0. Produksjon: UENDRET."
].join("\n");
console.log(summary);
if(process.platform==="win32" && process.env.SOURCE_CLAIM_DRAFT_SKIP_CLIPBOARD!=="1"){
  const result=spawnSync("powershell.exe",[
    "-NoProfile","-NonInteractive","-Command",
    "$ErrorActionPreference='Stop'; Set-Clipboard -Value $env:CLAIM_DRAFT_SUMMARY"
  ],{encoding:"utf8",windowsHide:true,timeout:12000,
    env:{...process.env,CLAIM_DRAFT_SUMMARY:summary}});
  if(result.status===0)console.log("Kort status kopiert med Set-Clipboard. Bruk Ctrl+V i ChatGPT.");
  else console.warn("Klarte ikke kopiere til utklippstavlen; se statusen i PowerShell.");
}
