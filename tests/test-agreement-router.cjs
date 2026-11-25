const fs=require("fs");
const assert=require("assert");

(async()=>{
  const cases=JSON.parse(fs.readFileSync("data/AGREEMENT-BENCHMARK-CASES.json","utf8"));
  const router=await import("../src/server/agreement-router.js");

  const irrelevant=router.suggestAgreementAreas({
    occupation:"sykepleier",
    topic:"Livssituasjoner",
    subtopic:"Samlivsbrudd",
    situation:"En medarbeider står i et samlivsbrudd."
  });
  assert.strictEqual(irrelevant.relevant,false);
  assert.strictEqual(irrelevant.needsEmployerType,false);
  assert.deepStrictEqual(irrelevant.suggestions,[]);

  const relevantMissingEmployer=router.suggestAgreementAreas({
    occupation:"sykepleier",
    topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert.strictEqual(relevantMissingEmployer.relevant,true);
  assert.strictEqual(relevantMissingEmployer.needsEmployerType,true);
  assert.deepStrictEqual(relevantMissingEmployer.suggestions,[]);
  assert(relevantMissingEmployer.employerTypeOptions.some(x=>x.id==="private"));
  assert(relevantMissingEmployer.employerTypeOptions.some(x=>x.id==="municipal"));
  assert(relevantMissingEmployer.employerTypeOptions.some(x=>x.id==="state"));
  assert(relevantMissingEmployer.employerTypeOptions.some(x=>x.id==="health_enterprise"));

  const municipal=router.suggestAgreementAreas({
    occupation:"sykepleier",
    employerType:"municipal",
    topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert.strictEqual(municipal.needsEmployerType,false);
  assert(municipal.suggestions.some(x=>x.id==="municipal"));
  const municipalArea=municipal.suggestions.find(x=>x.id==="municipal");
  assert(municipalArea.curatedSources.some(x=>x.id==="KS_HTA_2026_2028"), "KS HTA 2026-2028 mangler");
  assert(municipalArea.curatedSources.some(x=>x.id==="KS_HA_2026_2029"), "KS Hovedavtale 2026-2029 mangler");
  assert.strictEqual(municipal.confirmationRequired,true);

  const healthEnterprise=router.suggestAgreementAreas({
    occupation:"sykepleier",
    employerType:"health_enterprise",
    topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert(healthEnterprise.suggestions.some(x=>x.id==="health_enterprise"));
  const healthArea=healthEnterprise.suggestions.find(x=>x.id==="health_enterprise");
  assert(healthArea.curatedSources.some(x=>x.id==="SPEKTER_HEALTH_NEGOTIATION_2026_2029"), "Spekter helseforetakskilde mangler");

  const state=router.suggestAgreementAreas({
    occupation:"rådgiver",
    employerType:"state",
    topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling"
  });
  assert(state.suggestions.some(x=>x.id==="state"));
  const stateArea=state.suggestions.find(x=>x.id==="state");
  assert(stateArea.curatedSources.some(x=>x.id==="STATE_HTA_2026_2028"), "Statlig HTA 2026-2028 mangler i avtalekartet");
  assert(stateArea.curatedSources.some(x=>x.id==="STATE_HA_2023_2026"), "Hovedavtalen i staten mangler i avtalekartet");
  assert(stateArea.curatedSources.some(x=>x.id==="STATE_PERSONNEL_HANDBOOK"), "Statens personalhåndbok mangler i avtalekartet");

  const careerDevelopment = router.suggestAgreementAreas({
    occupation:"pilot",
    topic:"Lønn og utvikling",
    subtopic:"Karriereutvikling",
    situation:"Medarbeideren er skuffet over ikke å ha fått en intern utviklingsmulighet. Det gjelder ikke lønn, arbeidstid, tariff eller tillegg."
  });
  assert.strictEqual(careerDevelopment.relevant,false,"Bredt tema «Lønn og utvikling» skal ikke alene gjøre karrieresak tariffrelevant");
  assert.strictEqual(careerDevelopment.needsEmployerType,false);

  const explicitlyNoAgreement = router.suggestAgreementAreas({
    occupation:"utvikler",
    topic:"Lønn og utvikling",
    subtopic:"Karriereutvikling",
    situation:"Samtalen gjelder videre utvikling og ikke lønn, tariff, arbeidstid eller overtid."
  });
  assert.strictEqual(explicitlyNoAgreement.relevant,false,"Eksplisitt avkreftede avtaletema skal ikke aktivere tariffkontekst");

  const unknown=router.suggestAgreementAreas({
    occupation:"elektriker",
    employerType:"unknown",
    topic:"Prestasjon og utvikling",
    subtopic:"Arbeidstid",
    situation:"Arbeidstid og overtid er tema."
  });
  assert.strictEqual(unknown.relevant,true);
  assert.strictEqual(unknown.unresolved,true);
  assert.deepStrictEqual(unknown.suggestions,[]);

  const incidentalDuty=router.suggestAgreementAreas({
    occupation:"sykepleier",
    topic:"Sikkerhet og ansvar",
    subtopic:"Påvirket på jobb",
    situation:"Sykepleieren virker påvirket under vakt med pasientansvar."
  });
  assert.strictEqual(incidentalDuty.relevant,false, "Vanlig omtale av å være under vakt skal ikke utløse tariffspørsmål");
  assert.strictEqual(incidentalDuty.needsEmployerType,false);

  const dutyArrangement=router.suggestAgreementAreas({
    occupation:"sykepleier",
    topic:"Prestasjon og utvikling",
    subtopic:"Arbeidstid",
    situation:"Medarbeideren vil diskutere vaktplan og vakttillegg."
  });
  assert.strictEqual(dutyArrangement.relevant,true, "Vaktplan/vakttillegg skal fortsatt være avtale-relevant");
  assert.strictEqual(dutyArrangement.needsEmployerType,true);


  // En eldre avkreftelse kan ikke undertrykke en ny reell lønns- eller
  // arbeidstidssak. Dette skjedde tidligere fordi punktum forsvant
  // før negasjonskontrollen.
  const changedSituation=router.suggestAgreementAreas({
    occupation:"rådgiver",employerType:"state",
    topic:"Samarbeid og kommunikasjon",subtopic:"Arbeidsdeling",
    situation:"Det var ingen diskusjon om lønn tidligere. Nå har en ansatt spørsmål om overtid."
  });
  assert.strictEqual(changedSituation.relevant,true,
    "Ny overtidsdiskusjon må overstyre gammel avkreftelse i forrige setning");
  assert(changedSituation.suggestions.some(x=>x.id==="state"),
    "Kilden til statlig avtaleområde må bli mulig å undersøke ved ny overtidsdiskusjon");
  assert(changedSituation.suggestions.every(x=>x.id==="state"),
    "Statlig ansatt må aldri tilbys avtaleområder fra kommune, Spekter eller privat sektor");

  const noTariff=router.suggestAgreementAreas({
    occupation:"rådgiver",employerType:"state",
    topic:"Samarbeid og kommunikasjon",subtopic:"Arbeidsdeling",
    situation:"Dette handler ikke om lønn, arbeidstid, turnus, tillegg eller tariff. Kun oppgavefordeling."
  });
  assert.strictEqual(noTariff.relevant,false,
    "Eksplisitt avkreftede tariffområder skal ikke føre til kildestøy");

  const unpaidWages=router.suggestAgreementAreas({
    occupation:"butikksjef",employerType:"private",
    topic:"Samarbeid og kommunikasjon",subtopic:"Oppfølging",
    situation:"En medarbeider sier: Jeg har ikke fått utbetalt lønn denne måneden."
  });
  assert.strictEqual(unpaidWages.relevant,true,
    "Ikke fått lønn er en mulig lønns-/avtalesak, ikke et argument for å fjerne tariffkontekst");
  assert(unpaidWages.suggestions.every(x=>!["state","municipal","health_enterprise"].includes(x.id)),
    "Private arbeidsforhold må ikke få feil offentlige avtaleområder");

  const deniedPay=router.suggestAgreementAreas({
    occupation:"rådgiver",employerType:"state",
    topic:"Samarbeid og kommunikasjon",subtopic:"Arbeidsdeling",
    situation:"Ingen lønns- eller overtidsproblemer i tidligere perioder. Men nå mangler medarbeideren kveldstillegg."
  });
  assert.strictEqual(deniedPay.relevant,true,
    "Et konkret nytt krav om tillegg må bli avtale-relevant");

  const unknownEmployer=router.suggestAgreementAreas({
    occupation:"rådgiver",employerType:"unknown",
    topic:"Samarbeid og kommunikasjon",subtopic:"Arbeidsdeling",
    situation:"Nå har vi et spørsmål om overtidsbetaling."
  });
  assert.strictEqual(unknownEmployer.relevant,true);
  assert.deepStrictEqual(unknownEmployer.suggestions,[],
    "Ukjent arbeidsgivertype må aldri gjette et avtaleområde");

  console.log("Avtaleruter OK: oppfølgingsspørsmål om arbeidsgivertype brukes bare når relevant");
})().catch(err=>{console.error(err);process.exit(1);});
