const fs=require("fs");
const assert=require("assert");

const sourceBank=JSON.parse(fs.readFileSync("data/SOURCEBANK.json","utf8"));
const occupationBank=JSON.parse(fs.readFileSync("data/OCCUPATION-LEGAL-SOURCES.json","utf8"));
const agreementMap=JSON.parse(fs.readFileSync("data/AGREEMENT-SOURCE-MAP.json","utf8"));
const server=fs.readFileSync("server.js","utf8");
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

assert(server.includes("allCuratedSourceById"),"Serveren samler ikke kilde-ID-er på tvers av bankene");
assert(app.includes("<option value=\\"\\">Ikke valgt</option>"),"Arbeidsgivertype skal ikke defaultes til privat");
assert(server.includes("if (!matched) continue;"),"Kilder skal ikke få automatisk plass uten konkret treff");
assert(server.includes("authority_index"),"Serveren skiller ikke oppslagsinngang fra konkret myndighetskilde");
assert(server.includes("Tariff/HTA/Hovedavtale gjelder bare når riktig avtaleområde faktisk er relevant"),"Tariffavgrensning mangler i KI-reglene");
assert(systemPrompt.includes("Gjeldende lov og forskrift"),"Systemprompt mangler kildehierarki");
assert(systemPrompt.includes("Akan-modellen eller IA-avtalen som lovpålagte krav") || systemPrompt.includes("Akan-modellen eller IA-avtalen som lovpålagte krav."),"Systemprompt mangler AKAN/IA-avgrensning");
assert(systemPrompt.includes("Spekter har flere hovedavtaler/overenskomster"),"Systemprompt mangler Spekter-presisering");

for(const source of occupationBank.sources||[]){
  if(source.timeSensitive){
    assert(/^\d{4}-\d{2}-\d{2}$/.test(source.lastVerified||""),source.id+": tidskritisk kilde mangler lastVerified");
  }
}

console.log(`Kildepolicy OK: ${sourceBank.sources.length} generelle · ${occupationBank.sources.length} arbeidsgiver/yrke · ${agreementSources.length} tariffkilder · ingen URL-duplikater`);
