const assert=require("node:assert/strict");
(async()=>{
  const { detectHistoricalSourceQuestion, isHistoricalAgreementCandidate,
    isSourceValidForQuestion, historicalSourceCaution }=await import("../src/server/historical-source-context.js");
  const { createRelevantSourceSelector }=await import("../src/server/source-ranking.js");
  const { mergeGuidanceSourceCandidates }=await import("../src/server/source-merge.js");
  const { sourceTier }=await import("../src/server/help-library.js");
  const { buildOccupationGuidanceContext }=await import("../src/server/occupation-context.js");
  const { getAgreementMap }=await import("../src/server/agreement-router.js");
  const asOf="2026-11-21";
  const historic=[
    "Hvilken hovedtariffavtale gjaldt for medbestemmelse i 2024?",
    "Hadde jeg krav på overtidstillegg i 2024?",
    "Kan vi kreve etterbetaling av lønn for 2024?",
    "Hva gjaldt om oppsigelse i 2024?",
    "En ansatt har lønnskrav fra 2024 som må avklares."
  ];
  for(const question of historic){
    const review=detectHistoricalSourceQuestion(question,asOf);
    assert.equal(review?.year,2024,"Uoppdaget historisk rettighetsspørsmål: "+question);
    assert.match(historicalSourceCaution(review),/rettstilstand|rett|avtaledekning/u,
      "Historisk rett må eksplisitt kreve kontroll av dokumenter fra perioden");
  }
  const current=[
    "Jeg ble ansatt i 2024 og skal nå ha lønnssamtale.",
    "I 2024 var det konflikt. Hvordan snakker jeg om lønn nå?",
    "Vi har ansatte fra 2023 og 2024. Hva gjelder nå for arbeidstid?",
    "En medarbeider har jobbet siden 2024. Hva bør jeg gjøre i dagens lønnssamtale?",
    "Hvordan gir jeg tilbakemelding på lønnsutvikling?"
  ];
  for(const question of current)assert.equal(
    detectHistoricalSourceQuestion(question,asOf),null,
    "Ansettelseshistorikk eller nåtidig oppfølging må IKKE tolkes som historisk rett: "+question
  );
  assert.equal(detectHistoricalSourceQuestion(
    "Hvilken tariffavtale gjaldt i 2026?",asOf),null,
    "Året 2026 er ikke et tidligere kalenderår per november 2026");
  assert.equal(detectHistoricalSourceQuestion(
    "Hvilken tariffavtale gjaldt i 2026?","2027-01-01")?.year,2026,
    "Samme spørsmål blir historisk etter norsk årsskifte");
  const multi=detectHistoricalSourceQuestion(
    "Hvilken hovedavtale gjaldt i 2023 og 2024?",asOf
  );
  assert.equal(multi?.year,null,"Flere år må ikke gjøres til én antatt avtaleperiode");
  assert.deepEqual(multi?.years,[2023,2024]);
  assert.match(historicalSourceCaution(multi),/nevnte tidligere årene/);
  assert.equal(historicalSourceCaution(null),"");
  const state=getAgreementMap().agreementAreas.find(x=>x.id==="state");
  const oldHA=state.curatedSources.find(x=>x.id==="STATE_HA_2023_2026");
  const laterHTA=state.curatedSources.find(x=>x.id==="STATE_HTA_2026_2028");
  const rev=detectHistoricalSourceQuestion(historic[1],asOf);
  assert.equal(isHistoricalAgreementCandidate(oldHA,rev),true,
    "Avtale som overlapper 2024 er KANDIDAT, ikke dokumentert anvendt");
  assert.equal(isHistoricalAgreementCandidate(laterHTA,rev),false,
    "Avtale som først gjelder fra 2026 må ikke dokumentere rett i 2024");
  assert.equal(isHistoricalAgreementCandidate({id:"AML",sourceRole:"primary_law"},rev),true,
    "Historisk spørsmål skal ikke vilkårlig fjerne alle lovkilder");
  assert.equal(isHistoricalAgreementCandidate(laterHTA,null),true,
    "Nåtidsspørsmål må fremdeles kunne bruke nåværende avtale");
  assert.equal(isHistoricalAgreementCandidate(laterHTA,multi),false,
    "Flere år må ikke gi en vilkårlig enkelt-avtale som historisk dokumentasjon");

  const undated=detectHistoricalSourceQuestion(
    "Hvilken tariffavtale gjaldt da?",asOf);
  assert.deepEqual(undated,{year:null,years:[]},
    "Historiske tariffspørsmål UTEN årstall må fortsatt utløse forbehold");
  assert.match(historicalSourceCaution(undated),/ikke er datofestet/,
    "Manglende periode skal omtales som uavklart, ikke 'nevnte tidligere år'");
  assert.equal(isHistoricalAgreementCandidate(oldHA,undated),false,
    "Udatert historisk sak må ikke tildeles vilkårlig eldre avtale");
  assert.equal(isHistoricalAgreementCandidate(oldHA,multi),false,
    "Flere år må kreve presisering av avtaleperiode");
  assert.equal(isHistoricalAgreementCandidate({sourceRole:"collective_agreement"},rev),false,
    "Udatert tariffkilde kan aldri dokumentere historiske vilkår");
  assert.equal(isHistoricalAgreementCandidate({sourceRole:"collective_agreement",validFrom:"2023-01-01"},rev),false,
    "Manglende sluttdato gir ikke nok periodedokumentasjon");
  assert.equal(isSourceValidForQuestion(oldHA,"2027-01-01",rev),true,
    "Historisk 2024-avtale må kunne gjenfinnes i 2027 til kildekontroll");
  assert.equal(isSourceValidForQuestion(oldHA,"2027-01-01",null),false,
    "Samme utløpte dokument må ALDRI være en gjeldende kandidat i 2027");
  assert.equal(isSourceValidForQuestion(laterHTA,"2027-01-01",rev),false,
    "Gjeldende 2027-avtale må ikke brukes som bevis for 2024");
  assert.equal(isSourceValidForQuestion(oldHA,"2027-01-01",undated),false,
    "Et udatert historisk spørsmål må ikke gjette arkivperiode");
  assert.equal(isSourceValidForQuestion(oldHA,"2027-01-01",multi),false,
    "Historiske saker om flere år må ikke velge én avtale");

  const archivedArgs={
    occupation:"rådgiver",employerType:"state",topic:"Lønn og utvikling",
    subtopic:"Medbestemmelse",situation:"Hvilken hovedavtale gjaldt for medbestemmelse i 2024?",
    asOf:"2027-01-01",historicalReview:rev
  };
  const historicalContext=buildOccupationGuidanceContext(archivedArgs);
  assert(historicalContext.prompt.includes("STATE_HA_2023_2026"),
    "Historisk 2024-hovedavtale må nå fram til modellens kandidatprompt også etter utløp");
  assert(!historicalContext.prompt.includes("STATE_HTA_2026_2028"),
    "Gjeldende HTA fra 2026 må ikke fremstå som kilde til rettigheter i 2024");
  const relevanceSelector=createRelevantSourceSelector({
    sourceBank:{sources:[]},occupationLegalSourceBank:{sources:[]},
    agreementCuratedSources:state.curatedSources.map(source=>({...source,employerTypes:["state"]})),
    shouldUseAgreementContext:()=>true,isLegalSourceContext:()=>false,
    sourceTier,employerScopedPrimaryLawBonus:()=>0
  });
  const ranked=relevanceSelector({},archivedArgs.situation,archivedArgs).map(source=>source.id);
  assert(ranked.includes("STATE_HA_2023_2026"),
    "Kilderangering må beholde arkivert avtale som matcher historisk år");
  assert(!ranked.includes("STATE_HTA_2026_2028"),
    "Kilderangering må fjerne avtaler som ikke gjelder historisk år");
  const merged=mergeGuidanceSourceCandidates(
    state.curatedSources,historicalContext,"state","2027-01-01",rev
  ).map(source=>source.id);
  assert(merged.includes("STATE_HA_2023_2026"),
    "Sluttfilteret skal ikke fjerne registrert historisk relevant arkivavtale");
  assert(!merged.includes("STATE_HTA_2026_2028"),
    "Sluttfilteret skal fortsatt avvise historisk feil avtale");
  const undecidedContext=buildOccupationGuidanceContext({
    ...archivedArgs,historicalReview:undated
  });
  assert(!undecidedContext.prompt.includes("STATE_HA_2023_2026") &&
         !undecidedContext.prompt.includes("STATE_HTA_2026_2028"),
    "Ukjent historisk år må ikke legge noen tariffavtale inn i prompten");

  const promptContext=buildOccupationGuidanceContext({
    occupation:"rådgiver",sectorId:"public_admin_legal",employerType:"state",
    topic:"Lønn og utvikling",subtopic:"Lønnsutvikling",
    situation:"Hvilken tariffavtale gjaldt for overtid i 2024?",
    asOf,historicalReview:rev
  });
  assert(!promptContext.prompt.includes("STATE_HTA_2026_2028"),
    "En avtale fra 2026 må heller ikke lekke inn via yrkes-/avtaleprompten");
  assert(promptContext.prompt.includes("STATE_HA_2023_2026"),
    "Avtalen som er periodisert til 2024 kan brukes som STARTPUNKT til kontroll");

  const currentContext=buildOccupationGuidanceContext({
    occupation:"rådgiver",sectorId:"public_admin_legal",employerType:"state",
    topic:"Lønn og utvikling",subtopic:"Lønnsutvikling",
    situation:"Vi må snakke om lønn og overtid nå.",asOf
  });
  assert(currentContext.prompt.includes("STATE_HTA_2026_2028"),
    "Nåtidige lønnsspørsmål må fortsatt ha aktuelle avtaler tilgjengelig");
  console.log("HISTORISK KILDEKONTROLL OK: 5 historiske, 5 nåtidige, flerårig og årsskifte, prompt og avtaleperiode; ingen KI-kall");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
