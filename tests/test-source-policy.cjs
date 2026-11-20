const fs=require("fs");
const assert=require("assert");

const sourceBank=JSON.parse(fs.readFileSync("data/SOURCEBANK.json","utf8"));
const occupationBank=JSON.parse(fs.readFileSync("data/OCCUPATION-LEGAL-SOURCES.json","utf8"));
const agreementMap=JSON.parse(fs.readFileSync("data/AGREEMENT-SOURCE-MAP.json","utf8"));
const server=fs.readFileSync("server.js","utf8");
const sourceRanking=fs.readFileSync("src/server/source-ranking.js","utf8");
const helpLibrary=fs.readFileSync("src/server/help-library.js","utf8");
const app=fs.readFileSync("app.js","utf8");
const systemPrompt=fs.readFileSync("docs/ai/AI-SYSTEMPROMPT.md","utf8");

const agreementSources=(agreementMap.agreementAreas||[]).flatMap(area=>area.curatedSources||[]);
const all=[
  ...(sourceBank.sources||[]),
  ...(occupationBank.sources||[]),
  ...agreementSources
];

function normUrl(value){
  return String(value||"").trim().toLowerCase()
    .replace(/^https?:\/\//,"")
    .replace(/^www\./,"")
    .replace(/[?#].*$/,"")
    .replace(/\/+$/,"");
}

const seenUrl=new Map();
for(const source of all){
  const url=normUrl(source.url);
  if(!url) continue;
  if(!seenUrl.has(url)) seenUrl.set(url,[]);
  seenUrl.get(url).push(source.id);
}
const duplicateUrls=[...seenUrl.entries()].filter(([,ids])=>ids.length>1);
assert.deepStrictEqual(duplicateUrls,[],"Kildebankene skal ikke inneholde samme URL under flere ID-er");

const occById=new Map((occupationBank.sources||[]).map(s=>[s.id,s]));
for(const id of [
  "LOVDATA_AML",
  "AT_INTERNKONTROLL",
  "AML_CH9_CONTROL_MEASURES",
  "AT_WHISTLEBLOWING_ROUTINES",
  "AT_CONTROL_MONITORING",
  "DATATILSYNET_WORKPLACE_PRIVACY",
  "PERSONOPPLYSNINGSLOVEN",
  "AT_EMPLOYER_DUTIES",
  "IA_AGREEMENT_2025_2028",
  "AKAN_MODEL"
]){
  assert(occById.has(id),"Mangler overordnet arbeidsgiverkilde: "+id);
}

assert.equal(occById.get("IA_AGREEMENT_2025_2028").bindingStatus,"non_binding_framework","IA skal ikke klassifiseres som bindende lov");
assert.equal(occById.get("AKAN_MODEL").bindingStatus,"non_binding_guidance","Akan skal ikke klassifiseres som bindende lov");
assert(!occById.get("AKAN_HELP_EMPLOYEE").useFor.includes("oppfølging"),"Generisk «oppfølging» skal ikke trigge Akan");
assert(!occById.get("AKAN_MODEL").useFor.includes("arbeidsliv"),"Generisk «arbeidsliv» skal ikke trigge Akan");
assert.deepStrictEqual(occById.get("STATE_EMPLOYEE_ACT")?.employerTypes,["state"],"Statsansatteloven skal styres av statlig arbeidsgivertype");
assert.deepStrictEqual(occById.get("STATE_ETHICS")?.employerTypes,["state"],"Statens etiske retningslinjer skal styres av statlig arbeidsgivertype");

for(const id of [
  "AT_RULES","FINANSTILSYNET_RULES","HAVTIL_RULES_PDF","HELSETILSYNET_RULES",
  "LUFTFART_RULES","SDIR_RULES","UDIR_SCHOOL_RULES"
]){
  assert.equal(occById.get(id)?.sourceRole,"authority_index",id+" skal være oppslagsinngang, ikke direkte rettsgrunnlag");
}

const generalIds=new Set((sourceBank.sources||[]).map(s=>s.id));
assert(generalIds.has("NAV_SYKEFRAVAER_OPPFOLGING"),"NAV sykefraværsoppfølging skal ligge i generell fagbank, ikke yrkesruteren");
assert(generalIds.has("NAV_SAMTALESTOTTE_ARBEIDSGIVER"),"NAV samtalestøtte for arbeidsgiver mangler i generell fagbank");
assert(!generalIds.has("FOR_VEILEDNING_LED2403"),"Smal emneside skal ikke være generell fagkilde");
assert(!generalIds.has("COLLEGE_POLICING_INVESTIGATIVE_INTERVIEWING"),"Britisk politiguide skal ikke være generell samtalekilde");

for(const id of ["DFO_PERSONALSAKER_FORBEREDELSE_2026","DFO_PERSONALSAKER_GJENNOMFORING_2026"]){
  const source=(sourceBank.sources||[]).find(s=>s.id===id);
  assert.deepStrictEqual(source?.employer_types,["state"],id+" må være avgrenset til staten");
}

const areaById=new Map((agreementMap.agreementAreas||[]).map(a=>[a.id,a]));
const hasAgreement=(area,id)=>Boolean(areaById.get(area)?.curatedSources?.some(s=>s.id===id));
assert(hasAgreement("state","STATE_HTA_2026_2028"),"Gjeldende statlig HTA mangler");
assert(hasAgreement("state","STATE_HA_2023_2026"),"Gjeldende/forlenget hovedavtale i staten mangler");
assert(hasAgreement("state","STATE_PERSONNEL_HANDBOOK"),"Statens personalhåndbok mangler");
assert(hasAgreement("municipal","KS_HTA_2026_2028"),"KS HTA 2026-2028 mangler");
assert(hasAgreement("municipal","KS_HA_2026_2029"),"KS Hovedavtale 2026-2029 mangler");
assert(hasAgreement("health_enterprise","SPEKTER_HEALTH_NEGOTIATION_2026_2029"),"Spekter helseforetak-kilde mangler");

for(const source of agreementSources){
  assert.strictEqual(source.timeSensitive,true,source.id+": tariff-/avtalekilde skal være tidskritisk");
  assert(/^\d{4}-\d{2}-\d{2}$/.test(source.lastVerified||""),source.id+": tariff-/avtalekilde mangler lastVerified");
}


assert(server.includes("allCuratedSourceById"),"Serveren samler ikke kilde-ID-er på tvers av bankene");
assert(app.includes('<option value="">Ikke valgt</option>'),"Arbeidsgivertype skal ikke defaultes til privat");
assert(server.includes("createRelevantSourceSelector") && sourceRanking.includes("if (!matchedTopics.length && !matchedHints.length) continue;") && sourceRanking.includes("if (onlyBroadTopics && hints.length && !hasSpecificMatch) continue;") && sourceRanking.includes("containsNonNegatedContextTerm"),"Kilder skal kreve relevant, ikke-negert konteksttreff og ikke få automatisk plass fra et bredt tema");
assert(sourceRanking.includes("authority_index") && helpLibrary.includes("authority_index"),"Kilderangering og kildebank må skille oppslagsinngang fra konkret myndighetskilde");
assert(server.includes("Tariff/HTA/Hovedavtale gjelder bare når riktig avtaleområde faktisk er relevant"),"Tariffavgrensning mangler i KI-reglene");
assert(server.includes("mergeGuidanceSourceCandidates"),"Veiledningen prioriterer ikke yrkes-/tariffkilder sammen med generell fagbank");
assert(server.includes("allowedCandidateIds"),"Modellens source_ids avgrenses ikke til faktisk tilbudte kandidat-kilder");
assert(server.includes("ordinær samtalesak uten et konkret kildebehov"),"Kildeinflasjon er ikke eksplisitt dempet i prompten");

assert(systemPrompt.includes("Gjeldende lov og forskrift"),"Systemprompt mangler kildehierarki");
assert(systemPrompt.includes("Akan-modellen eller IA-avtalen som lovpålagte krav") || systemPrompt.includes("Akan-modellen eller IA-avtalen som lovpålagte krav."),"Systemprompt mangler AKAN/IA-avgrensning");
assert(systemPrompt.includes("Spekter har flere hovedavtaler/overenskomster"),"Systemprompt mangler Spekter-presisering");

for(const source of occupationBank.sources||[]){
  if(source.timeSensitive){
    assert(/^\d{4}-\d{2}-\d{2}$/.test(source.lastVerified||""),source.id+": tidskritisk kilde mangler lastVerified");
  }
}

// Sektorrevisjon 20.11: autoritative kilder må ha tydelig rolle og gyldig sektor.
const occupationMap=JSON.parse(fs.readFileSync("data/OCCUPATION-SOURCE-MAP.json","utf8"));
const sectorIds=new Set((occupationMap.sectors||[]).map(sector=>sector.id));
assert.equal((occupationMap.sectors||[]).filter(sector=>sector.id!=="other").length,14,"Alle 14 faktiske sektorgrupper må kunne revideres");
for(const sector of (occupationMap.sectors||[]).filter(sector=>sector.id!=="other")){
  const sectorSources=(occupationBank.sources||[]).filter(source=>(source.sectors||[]).includes(sector.id));
  assert(sectorSources.length>=4,sector.label+": urimelig tynt sektortillegg");
}
for(const source of occupationBank.sources||[]){
  for(const sector of source.sectors||[]) assert(sector==="*"||sectorIds.has(sector),source.id+": ukjent sektor");
}
for(const id of [
  "LOVDATA_DYREHELSEPERSONELLOVEN","LOVDATA_DYREVELFERDSLOVEN",
  "DMP_VETERINARY_MEDICINES","VETINST_DYREHELSE_FAG",
  "VETINST_DYREHELSERAPPORT_2025","DNV_VETERINARY_ETHICS",
  "LOVDATA_HELSEPERSONELLOVEN","LOVDATA_OPPLAERINGSLOVA_2023",
  "LOVDATA_BARNEHAGELOVEN","LOVDATA_LUFTFARTSLOVEN"
]) assert(occById.has(id),"Sektorspesifikk fag-/lovkilde mangler: "+id);
const veterinary=(occupationBank.sources||[]).filter(x=>(x.sectors||[]).includes("veterinary_animal_health"));
assert(veterinary.length>=11,"Veterinærsektoren må ha bredere forankring enn Mattilsynet alene");
assert(new Set(veterinary.map(x=>x.authority)).size>=5,"Veterinærkilder må representere ulike faglige autoriteter");
assert.equal(occById.get("DNV_VETERINARY_ETHICS")?.bindingStatus,"non_binding_professional_guidance","Yrkesetikk må ikke fremstilles som lov");
assert.equal(occById.get("VETINST_DYREHELSE_FAG")?.bindingStatus,"non_binding_research","Forskningskilde må ikke fremstilles som rettslig hjemmel");
for(const id of ["LOVDATA_DYREHELSEPERSONELLOVEN","LOVDATA_DYREVELFERDSLOVEN","LOVDATA_HELSEPERSONELLOVEN","LOVDATA_OPPLAERINGSLOVA_2023","LOVDATA_BARNEHAGELOVEN","LOVDATA_LUFTFARTSLOVEN"]) {
  assert.equal(occById.get(id)?.sourceRole,"primary_law",id+" må klassifiseres som primær rettskilde");
}
const leaderHelp=fs.readFileSync("index.html","utf8");
const styled=fs.readFileSync("styles-overrides.css","utf8");
const quickIds = [
  "LOVDATA_AML","AT_EMPLOYER_DUTIES","NAV_SYKEFRAVAER_OPPFOLGING",
  "AT_PERSONALSAKER","DATATILSYNET_WORKPLACE_PRIVACY","AKAN_MODEL",
  "DFO_PERSONALSAKER_FORBEREDELSE_2026","STAMI_PSYKOSOSIALT_ARBEIDSMILJO_2026"
];
for(const id of quickIds) {
  assert(helpLibrary.includes('id:"'+id+'"'),"Oppslagsverk mangler kuratert kilde: "+id);
  assert(all.some(source=>source.id===id),"Hurtigoppslag har kilde-ID utenfor fagbankene: "+id);
}
assert((leaderHelp.match(/Oppslagsverk for ledere/g)||[]).length===1,"Hjelp må ikke vise to oppslagsverk");
assert(leaderHelp.includes('id="leader-quick-references"'),"Hjelp mangler kuratert oppslagsverk");
assert((leaderHelp.match(/data-open-info="contact"/g)||[]).length >= 2,"Om og Hjelp må begge ha Kontakt-inngang");
assert((leaderHelp.match(/class="help-contact-entry/g)||[]).length === 1,"Hjelp må bare ha én Kontakt-seksjon");
assert(leaderHelp.indexOf("leader-reference-section")<leaderHelp.indexOf("BRUK AV SAMTALESTØTTE"),"Oppslagsverket skal ligge først i Hjelp");
assert(styled.includes("dialog.image-preview-dialog .brand-logo-dialog-card img"),"Manglende helbildefremvisning");
assert(app.includes("readableSourceTier")&&app.includes("Hvorfor kilden er relevant"),"Kildebanken må forklare kildevalg og nivå");
assert(app.includes('class="spoken-example"')&&styled.includes(".spoken-example"),"Muntlige formuleringer må ha egen visuell stil");
assert(server.includes("evidence_sources: evidenceSources")&&server.includes("source_ids', 'supplementary_sources'"),"Oppfølging skal returnere strukturerte kilder");
assert(app.includes("renderContinuationEvidence(verifiedSources)")&&app.includes("setConversationTurnSources"),"Oppfølgingskilder må vises og følge historikk");

console.log(`Kildepolicy OK: ${sourceBank.sources.length} generelle · ${occupationBank.sources.length} arbeidsgiver/yrke · ${agreementSources.length} tariffkilder · ingen URL-duplikater`);
