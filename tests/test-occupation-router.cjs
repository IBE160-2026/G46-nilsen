const fs = require("fs");
const assert = require("assert");

(async () => {
  const benchmark = JSON.parse(fs.readFileSync("data/OCCUPATION-BENCHMARK-CASES.json", "utf8"));
  const map = JSON.parse(fs.readFileSync("data/OCCUPATION-SOURCE-MAP.json", "utf8"));
  const registry = JSON.parse(fs.readFileSync("data/OCCUPATION-LEGAL-SOURCES.json", "utf8"));
  const router = await import("../src/server/occupation-router.js");

  assert.strictEqual(map.selectionPolicy.occupationOptional, true, "Yrke skal være valgfritt");
  assert(map.sectors.some(s => s.id === "other" && s.freeText), "Annet med fritekst mangler");
  assert(registry.sources.length >= 10, "For få autoritative regelverkskilder");

  const noSelection = router.resolveOccupationContext({
    topic: "Livssituasjoner",
    subtopic: "Samlivsbrudd",
    situation: "En medarbeider går gjennom et samlivsbrudd."
  });
  assert.strictEqual(noSelection.selected, false);
  assert.strictEqual(noSelection.occupationRelevant, false);
  assert.deepStrictEqual(noSelection.sourceIds, []);

  const salmon = router.classifyOccupationLocally("lakseoppdrett");
  assert.strictEqual(salmon.matched, true);
  assert.strictEqual(salmon.ambiguous, false);
  assert.strictEqual(salmon.sectorId, "aquaculture_fisheries_maritime");

  const workshop = router.classifyOccupationLocally("verksted");
  assert.strictEqual(workshop.matched, false);
  assert.strictEqual(workshop.ambiguous, true, "Tvetydige aliases skal ikke rutest vilkårlig");
  assert(workshop.candidates.length >= 2);

  const unknown = router.classifyOccupationLocally("bibliotekar");
  assert.strictEqual(unknown.matched, false);

  const healthSafety = router.resolveOccupationContext({
    sectorId: "health_care",
    occupation: "sykepleier",
    topic: "Sikkerhet og ansvar",
    subtopic: "Påvirket på jobb",
    situation: "Sykepleieren virker påvirket under vakt med pasientansvar."
  });
  assert.strictEqual(healthSafety.occupationRelevant, true);
  assert(healthSafety.allowedDomains.includes("helsedirektoratet.no"));
  assert(healthSafety.sourceIds.includes("HDIR_HEALTH_PERSONNEL"));
  assert(!healthSafety.sourceIds.includes("DATATILSYNET_WORKPLACE_PRIVACY"), "Personvernkilde skal ikke aktiveres uten personvernkontekst");

  const sickLeaveSources = router.selectLegalSources({
    sectorId: "health_care",
    occupation: "sykepleier",
    topic: "Fravær og oppfølging",
    subtopic: "Langtidsfravær",
    situation: "Oppfølging av sykmeldt medarbeider og tilrettelegging. Ingen pasientsikkerhet, journalføring eller autorisasjon er tema."
  });
  assert(!sickLeaveSources.some(source => ["HDIR_HEALTH_PERSONNEL","HEALTH_AUTHORIZATION","HELSETILSYNET_RULES"].includes(source.id)), "Generelt sykefravær skal ikke trekke inn helsefaglig profesjonsregelverk");

  const irrelevantUnknown = router.resolveOccupationContext({
    occupation: "bibliotekar",
    topic: "Livssituasjoner",
    subtopic: "Samlivsbrudd",
    situation: "Medarbeideren står i et samlivsbrudd."
  });
  assert.strictEqual(irrelevantUnknown.occupationRelevant, false);
  assert.strictEqual(irrelevantUnknown.classificationNeeded, false, "Irrelevant fritekstyrke skal ikke utløse KI-klassifisering");
  assert.strictEqual(irrelevantUnknown.localClassification, null);

  const explicitNoSafetyIssue = router.resolveOccupationContext({
    sectorId: "construction_trades",
    occupation: "tømrer",
    topic: "Samarbeid og kommunikasjon",
    subtopic: "Uenighet",
    situation: "To tømrere krangler om oppgavefordeling, uten at sikkerhet er tema."
  });
  assert.strictEqual(explicitNoSafetyIssue.occupationRelevant, false, "Eksplisitt fravær av sikkerhetsproblem skal ikke aktivere yrkeskontekst");

  const missingSafetyRoutine = router.resolveOccupationContext({
    sectorId: "construction_trades",
    occupation: "tømrer",
    topic: "Sikkerhet og ansvar",
    subtopic: "Sikkerhetsrutiner",
    situation: "Medarbeideren har ikke fulgt sikkerhetsrutinen ved arbeid i høyden."
  });
  assert.strictEqual(missingSafetyRoutine.occupationRelevant, true, "Brudd på sikkerhetsrutine skal fortsatt aktivere yrkeskontekst");

  const negatedDriverRisk = router.resolveOccupationContext({
    sectorId: "transport_logistics",
    occupation: "taxisjåfør",
    topic: "Lønn og utvikling",
    subtopic: "Lønnskrav",
    situation: "En taxisjåfør ønsker å diskutere lønn. Det gjelder ikke kjøre- eller hviletid eller sikkerhet."
  });
  assert.strictEqual(negatedDriverRisk.occupationRelevant, false, "Eksplisitt avkreftet transport-/sikkerhetskontekst skal ikke aktivere yrkeskilder");
  assert.deepStrictEqual(negatedDriverRisk.sourceIds, []);

  const negatedConstructionRisk = router.resolveOccupationContext({
    sectorId: "construction_trades",
    occupation: "tømrer",
    topic: "Samarbeid og kommunikasjon",
    subtopic: "Roller og forventninger",
    situation: "Det er ikke snakk om sikkerhet, verneutstyr, høydearbeid eller andre HMS-forhold. Kun dårlig kommunikasjon."
  });
  assert.strictEqual(negatedConstructionRisk.occupationRelevant, false, "Negert HMS-liste skal ikke gi falsk positiv yrkeskontekst");
  assert.deepStrictEqual(negatedConstructionRisk.sourceIds, []);

  const negatedHealthRisk = router.resolveOccupationContext({
    sectorId: "health_care",
    occupation: "sykepleier",
    topic: "Prestasjon og utvikling",
    subtopic: "Måloppnåelse",
    situation: "Samtalen gjelder prioritering og samarbeid, ikke pasientsikkerhet, journalføring eller autorisasjon."
  });
  assert.strictEqual(negatedHealthRisk.occupationRelevant, false, "Negert helsefaglig risikoliste skal ikke aktivere helseregelverk");
  assert.deepStrictEqual(negatedHealthRisk.sourceIds, []);

  const healthJournal = router.resolveOccupationContext({
    sectorId: "health_care",
    occupation: "sykepleier",
    topic: "Prestasjon og utvikling",
    subtopic: "Kvalitet",
    situation: "Det er gjentatte mangler i journalføringen som kan påvirke pasientoppfølgingen."
  });
  assert.strictEqual(healthJournal.occupationRelevant, true);
  assert(!healthJournal.sourceIds.includes("AKAN_HELP_EMPLOYEE"), "Generisk ordet oppfølging skal ikke trekke inn AKAN");
  assert(!healthJournal.sourceIds.includes("DFO_PERSONNEL_MEETING"), "Generisk oppfølging skal ikke trekke inn DFO-personalsak");
  assert(healthJournal.sourceIds.includes("HDIR_HEALTH_PERSONNEL"), "Journalføringssak skal hente helsepersonellkilde");

  const policeEthics = router.selectLegalSources({
    sectorId: "defence_police_emergency",
    occupation: "politi",
    topic: "Sikkerhet og ansvar",
    subtopic: "Rolleforståelse",
    situation: "Det er spørsmål om etikk, rolleforståelse og profesjonell opptreden."
  });
  assert(policeEthics.some(source => source.id === "POLITI_ETHICAL_GUIDELINES"), "Politi skal få politiets etiske retningslinjer");

  const firefighterEthics = router.selectLegalSources({
    sectorId: "defence_police_emergency",
    occupation: "brannkonstabel",
    topic: "Sikkerhet og ansvar",
    subtopic: "Rolleforståelse",
    situation: "Det er spørsmål om etikk, rolleforståelse og profesjonell opptreden."
  });
  assert(!firefighterEthics.some(source => source.id === "POLITI_ETHICAL_GUIDELINES"), "Brannkonstabel skal ikke få politiets etiske retningslinjer");

  const stateEmploymentRules = router.selectLegalSources({
    sectorId: "public_admin_legal",
    occupation: "rådgiver",
    employerType: "state",
    topic: "Oppsigelse og avslutning av arbeidsforhold",
    subtopic: "Formell oppfølging",
    situation: "Det vurderes en formell reaksjon overfor en statsansatt."
  });
  assert(stateEmploymentRules.some(source => source.id === "STATE_EMPLOYEE_ACT"), "Statlig arbeidsgiver skal kunne få statsansatteloven");

  const municipalEmploymentRules = router.selectLegalSources({
    sectorId: "public_admin_legal",
    occupation: "rådgiver",
    employerType: "municipal",
    topic: "Oppsigelse og avslutning av arbeidsforhold",
    subtopic: "Formell oppfølging",
    situation: "Det vurderes en formell reaksjon."
  });
  assert(!municipalEmploymentRules.some(source => source.id === "STATE_EMPLOYEE_ACT"), "Kommunal arbeidsgiver skal ikke få statsansatteloven");

  const stateEthics = router.selectLegalSources({
    sectorId: "public_admin_legal",
    occupation: "rådgiver",
    employerType: "state",
    topic: "Sikkerhet og ansvar",
    subtopic: "Habilitet",
    situation: "Samtalen gjelder habilitet, gaver og interessekonflikt i staten."
  });
  assert(stateEthics.some(source => source.id === "STATE_ETHICS"), "Statlig arbeidsgiver skal kunne få statens etiske retningslinjer");

  const accountantRules = router.selectLegalSources({
    sectorId: "office_finance_it",
    occupation: "regnskapsfører",
    topic: "Sikkerhet og ansvar",
    subtopic: "Taushetsplikt",
    situation: "Det er spørsmål om taushetsplikt og regelverk i oppdraget."
  });
  assert(accountantRules.some(source => source.id === "ACCOUNTANT_RULES"), "Regnskapsfører skal få regnskapsførerregelverk");

  const developerRules = router.selectLegalSources({
    sectorId: "office_finance_it",
    occupation: "utvikler",
    topic: "Sikkerhet og ansvar",
    subtopic: "Taushetsplikt",
    situation: "Det er spørsmål om taushetsplikt og regelverk."
  });
  assert(!developerRules.some(source => source.id === "ACCOUNTANT_RULES"), "Utvikler skal ikke få regnskapsførerregelverk");

  let checked = 0;
  for (const tc of benchmark.cases || []) {
    const result = router.resolveOccupationContext({
      occupation: tc.occupation,
      sectorId: tc.sector === "other" ? null : tc.sector,
      topic: tc.topic,
      subtopic: tc.subtopic,
      situation: tc.situation
    });

    assert.strictEqual(
      result.occupationRelevant,
      tc.occupationRelevant,
      `${tc.id}: feil vurdering av om yrke er relevant`
    );

    if (tc.expectedRouting?.sector) {
      assert.strictEqual(result.sectorId, tc.expectedRouting.sector, `${tc.id}: feil lokal sektor-ruting`);
    }

    if (!tc.occupationRelevant) {
      assert.deepStrictEqual(result.sourceIds, [], `${tc.id}: irrelevante saker skal ikke hente yrkeskilder`);
    }

    if (tc.occupationRelevant && tc.sector && tc.sector !== "other") {
      assert(result.sectorId, `${tc.id}: relevant sak mangler sektor`);
    }

    checked += 1;
  }

  console.log(`Yrkesruter OK: ${checked} benchmark-saker · yrke er valgfritt · negative kontroller består`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
