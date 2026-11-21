// Datobegrensning fra kuratert kildemetadata – ingen KI eller nettverkskall.
const assert=require("node:assert/strict");
const fs=require("node:fs");
(async()=>{
  const { isSourceValidOn }=await import("../src/server/source-validity.js");
  const { suggestAgreementAreas, getAgreementMap }=await import("../src/server/agreement-router.js");
  const { createRelevantSourceSelector }=await import("../src/server/source-ranking.js");
  const { sourceTier }=await import("../src/server/help-library.js");

  const state=getAgreementMap().agreementAreas.find(x=>x.id==="state");
  assert(state,"Statlig avtaleområde må være registrert");
  const oldHA=state.curatedSources.find(x=>x.id==="STATE_HA_2023_2026");
  const currentHTA=state.curatedSources.find(x=>x.id==="STATE_HTA_2026_2028");
  assert(oldHA && currentHTA,"Statlige avtaleperioder mangler fra kildedata");
  assert.equal(isSourceValidOn(oldHA,"2026-12-31"),true,
    "Siste gyldighetsdato er INKLUDERT");
  assert.equal(isSourceValidOn(oldHA,"2027-01-01"),false,
    "Hovedavtale oppført ut 2026 kan ikke tilbys som gjeldende i 2027");
  assert.equal(isSourceValidOn(currentHTA,"2027-01-01"),true,
    "HTA som fortsatt er gyldig må forbli tilgjengelig");
  assert.equal(isSourceValidOn(currentHTA,"2026-04-30"),false,
    "En kilde med fremtidig ikrafttredelse skal ikke tilbys for tidlig");
  assert.equal(isSourceValidOn(currentHTA,"2026-05-01"),true,
    "Første gyldighetsdato skal inkluderes");
  assert.equal(isSourceValidOn(oldHA,new Date("2026-12-31T22:30:00Z")),true);
  assert.equal(isSourceValidOn(oldHA,new Date("2026-12-31T23:30:00Z")),false,
    "Ved årsskifte må lokal norsk kalenderdato gjelde, ikke UTC-klokke");
  assert.equal(isSourceValidOn({id:"current-guidance"}, "2027-01-01"),true,
    "Kilder uten angitt utløp er ikke automatisk utløpt");
  assert.equal(isSourceValidOn({validTo:"2027-02-30"}, "2027-02-20"),false,
    "Ugyldig kalenderdato må fail-closed");
  assert.equal(isSourceValidOn({validFrom:"2027-01-02",validTo:"2027-01-01"},
    "2027-01-01"),false,"Omvendt intervall er ugyldig");
  assert.equal(isSourceValidOn({validFrom:"2027-01-01"},"2026-12-31"),false,
    "Kilde med bare fra-dato må vente til ikrafttredelse");
  assert.equal(isSourceValidOn({validTo:"2027-01-01"},"2027-01-02"),false,
    "Kilde med bare til-dato må utløpe etter siste dag");

  const stateArgs={
    occupation:"rådgiver",employerType:"state",topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling",situation:"Lønn, overtid og tariff er tema"
  };
  const areaBefore=suggestAgreementAreas({...stateArgs,asOf:"2026-12-31"});
  const areaAfter=suggestAgreementAreas({...stateArgs,asOf:"2027-01-01"});
  const beforeIds=areaBefore.suggestions.flatMap(x=>x.curatedSources||[]).map(x=>x.id);
  const afterIds=areaAfter.suggestions.flatMap(x=>x.curatedSources||[]).map(x=>x.id);
  assert(beforeIds.includes("STATE_HA_2023_2026"));
  assert(!afterIds.includes("STATE_HA_2023_2026"),
    "Utgått avtale må ikke havne i avtalerutingens forslag eller KI-prompt");
  assert(afterIds.includes("STATE_HTA_2026_2028"),
    "Gyldig hovedtariffavtale må beholdes");
  assert(areaAfter.suggestions.every(area=>area.id==="state"),
    "Avtalefilteret skal ikke blande arbeidsgivertyper");

  const agreementCuratedSources=state.curatedSources.map(x=>({...x,employerTypes:["state"]}));
  const selector=createRelevantSourceSelector({
    sourceBank:{sources:[]},occupationLegalSourceBank:{sources:[]},
    agreementCuratedSources,
    shouldUseAgreementContext:()=>true,
    isLegalSourceContext:()=>false,
    sourceTier,employerScopedPrimaryLawBonus:()=>0
  });
  const selected=(asOf)=>selector({},"Vi må drøfte lønn og medbestemmelse.",{
    employerType:"state",topic:"Lønn og utvikling",asOf
  }).map(x=>x.id);
  assert(selected("2026-12-31").includes("STATE_HA_2023_2026"),
    "Før utløp må gyldig hovedavtale kunne velges");
  assert(!selected("2027-01-01").includes("STATE_HA_2023_2026"),
    "Utgått avtale må ikke komme inn igjen via generell kilderangering");
  assert(selected("2027-01-01").includes("STATE_HTA_2026_2028"),
    "Gjeldende kilde må fortsatt kunne velges i 2027");

  const municipal=suggestAgreementAreas({
    occupation:"sykepleier",employerType:"municipal",topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling",situation:"Lønn og arbeidstid",asOf:"2027-01-01"
  });
  assert(municipal.suggestions.every(x=>x.id==="municipal"),
    "Statlige tariffavtaler skal aldri blandes inn i kommunalt område");
  assert(municipal.suggestions[0].curatedSources.some(x=>x.id==="KS_HTA_2026_2028"),
    "KS-avtale som er i kraft skal ikke fjernes");
  console.log("KILDEGYLDIGHET OK: norske datogrenser, 2026→2027, avtaleforslag, rangering og sektor; 0 KI-kall");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
