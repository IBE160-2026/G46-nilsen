const assert = require("node:assert/strict");

(async () => {
  const { employerScopedPrimaryLawBonus, isLegalSourceContext, joinSourceContext, requiredEmployerScopedPrimaryLawIds, shouldRetainCuratedSources } = await import("../src/server/source-retention.js");

  const ordinaryContext = {
    occupation: { occupationRelevant: false },
    agreement: { relevant: false, needsEmployerType: false, suggestions: [] }
  };

  const noSourceCases = [
    {
      id: "G-OCC-EDU-02",
      requestedTopic: "Samarbeid og kommunikasjon",
      subtopic: "Kollegakonflikt",
      situation: "To lærere er uenige om arbeidsdeling, møteform og hvem som skal forberede undervisningsmateriell. Ingen elevsak, sikkerhetshendelse eller rettighetsspørsmål er involvert."
    },
    {
      id: "G-OCC-IND-02",
      requestedTopic: "Fravær og oppfølging",
      subtopic: "Oppmøte og punktlighet",
      situation: "En produksjonsmedarbeider har kommet 10–15 minutter for sent til skiftstart fire ganger på en måned. Det er ingen sikkerhetshendelse, maskinproblem eller opplæringssak."
    },
    {
      id: "G-OCC-MAR-02",
      requestedTopic: "Livssituasjoner",
      subtopic: "Privat belastning",
      situation: "En matros forteller om et vanskelig samlivsbrudd og ønsker en støttende samtale. Det er ingen opplysninger om redusert arbeidsevne, vaktbrudd, fatigue eller sikkerhetsproblem."
    },
    {
      id: "G-OCC-FIN-02",
      requestedTopic: "Prestasjon og utvikling",
      subtopic: "Leveranser",
      situation: "En utvikler har levert fire oppgaver senere enn avtalt de siste seks ukene. Det er ingen personvern-, informasjonssikkerhets-, finans- eller complianceproblem i saken."
    },
    {
      id: "G-OCC-OFF-02",
      requestedTopic: "Livssituasjoner",
      subtopic: "Privat belastning",
      situation: "En plattformarbeider forteller om samlivsproblemer og ønsker en støttende samtale. Ingen konkrete sikkerhetsproblemer, fatigue, arbeidstidsbrudd eller redusert arbeidsevne er observert."
    },
    {
      id: "G-OCC-AGR-02",
      requestedTopic: "Samarbeid og kommunikasjon",
      subtopic: "Arbeidsdeling",
      situation: "To landbruksarbeidere er uenige om hvem som gjør ordinære vedlikeholds- og ryddeoppgaver. Det er ingen maskinrisiko, dyrevelferdssak, plantevern eller annen sikkerhetshendelse."
    },
    {
      id: "G-LEAK-POLICE-FIRE-01",
      requestedTopic: "Samarbeid og kommunikasjon",
      subtopic: "Intern samarbeidskonflikt",
      situation: "To medarbeidere i brann- og redningstjenesten samarbeider dårlig om administrativ turnusplanlegging. Det er ingen operativ hendelse, øvelsesmangel, kompetanseproblem eller sikkerhetssak."
    }
  ];

  for (const tc of noSourceCases) {
    assert.equal(
      shouldRetainCuratedSources({ ...tc, resolvedTopic: "Sikkerhet og ansvar", occupationContext: ordinaryContext }),
      false,
      `${tc.id}: eksplisitt avkreftet risiko skal ikke gi kildeinflasjon, selv om KI-analysen overklassifiserer temaet`
    );
  }

  assert.equal(
    shouldRetainCuratedSources({
      requestedTopic: "Sikkerhet og ansvar",
      subtopic: "Akutt sikkerhet",
      situation: "Det har skjedd en sikkerhetshendelse med maskin.",
      occupationContext: ordinaryContext
    }),
    true,
    "Eksplisitt høyrisikotema skal beholde kilder"
  );

  assert.equal(
    shouldRetainCuratedSources({
      requestedTopic: "Prestasjon og utvikling",
      subtopic: "Leveranser",
      situation: "Det er avdekket et konkret personvernproblem i løsningen.",
      occupationContext: ordinaryContext
    }),
    true,
    "Ikke-negert konkret risikosignal skal beholde kilder"
  );

  assert.equal(
    shouldRetainCuratedSources({
      requestedTopic: "Samarbeid og kommunikasjon",
      situation: "Vanlig samarbeidsutfordring.",
      occupationContext: {
        occupation: { occupationRelevant: true },
        agreement: { relevant: false, needsEmployerType: false, suggestions: [] }
      }
    }),
    true,
    "Materiell yrkeskontekst skal beholde yrkeskilder"
  );

  assert.equal(
    shouldRetainCuratedSources({
      requestedTopic: "Lønn og utvikling",
      situation: "Lokal lønnsforhandling.",
      employerType: "state",
      occupationContext: {
        occupation: { occupationRelevant: false },
        agreement: { relevant: true, needsEmployerType: false, suggestions: [{ id: "state" }] }
      }
    }),
    true,
    "Avklart offentlig avtaleområde skal beholde tariffkilder"
  );

  assert.deepEqual(
    requiredEmployerScopedPrimaryLawIds([
      { id:"LOVDATA_AML", sourceRole:"primary_law", sectors:["*"] },
      { id:"STATE_EMPLOYEE_ACT", sourceRole:"primary_law", employerTypes:["state"], sectors:["*"] },
      { id:"STATE_PERSONNEL_HANDBOOK", sourceRole:"official_employer_reference", employerTypes:["state"] }
    ], "state"),
    ["STATE_EMPLOYEE_ACT"],
    "Statlig arbeidsgiverspesifikk primærlov skal beholdes når den allerede er relevant kandidat"
  );

  assert.deepEqual(
    requiredEmployerScopedPrimaryLawIds([
      { id:"STATE_EMPLOYEE_ACT", sourceRole:"primary_law", employerTypes:["state"] }
    ], "municipal"),
    [],
    "Statlig primærlov skal ikke tvinges inn for kommune"
  );

  assert.equal(isLegalSourceContext("Arbeidsgiver vurderer oppsigelse."), true, "Oppsigelse skal gjenkjennes som juridisk kontekst");
  assert.equal(isLegalSourceContext("Jeg trenger korrekt overordnet regelverksretning."), true, "Sammensatt ord med regelverk skal gjenkjennes");
  assert.equal(isLegalSourceContext("Vanlig samtale om arbeidsdeling."), false, "Ordinær samarbeidsdialog skal ikke bli juridisk kontekst");

  assert.equal(
    employerScopedPrimaryLawBonus(
      { sourceRole:"primary_law", employerTypes:["state"] },
      "state"
    ),
    10,
    "Relevant arbeidsgiverspesifikk primærlov skal få tydelig prioritet"
  );
  assert.equal(
    employerScopedPrimaryLawBonus(
      { sourceRole:"primary_law", employerTypes:["state"] },
      "municipal"
    ),
    0,
    "Statlig primærlov skal ikke få bonus i kommunal sak"
  );

  // Regresjon: reelle spørsmål om lovverk, advarsel og utestenging skal ikke miste kilder.
  const legalCases = [
    ["hvilke regler", "En medarbeider møter for sent. Hvilke regler bør jeg være oppmerksom på?"],
    ["skriftlig advarsel", "Kan jeg gi en skriftlig advarsel etter flere forsinkelser?"],
    ["lovverk", "Hvilket lovverk gjelder før jeg gir en advarsel?"],
    ["utestenging", "En medarbeider opplever systematisk utestenging fra kollegaene."],
    ["holdt utenfor", "Den ene ansatte opplever å bli systematisk holdt utenfor."]
  ];
  for (const [name, situation] of legalCases) {
    assert.equal(shouldRetainCuratedSources({
      requestedTopic:"Samarbeid og kommunikasjon",
      situation,
      occupationContext:ordinaryContext
    }), true, name+" skal aktivere relevant kildegrunnlag");
  }
  assert.equal(shouldRetainCuratedSources({
    requestedTopic:"Samarbeid og kommunikasjon",
    situation:"Ingen advarsel er vurdert. Vi skal bare avklare oppgavefordeling.",
    occupationContext:ordinaryContext
  }), false, "Eksplisitt avkreftet advarsel skal ikke blåse opp kildegrunnlaget");
  assert.equal(isLegalSourceContext("Kan jeg gi en advarsel?"),true,"Advarsel er juridisk kontekst");

  // Tidligere opplysninger var avkreftet, men et NYTT spørsmål kan
  // introdusere et faktisk sikkerhets- eller rettslig kildebehov.
  const originallyNegated = "Det har ikke vært noen trussel";
  const newThreat = "Nå har medarbeideren uttalt en konkret trussel mot en kollega";
  assert.equal(shouldRetainCuratedSources({
    requestedTopic:"Samarbeid og kommunikasjon",subtopic:"Arbeidsdeling",
    situation:originallyNegated,occupationContext:ordinaryContext
  }),false,"Avkreftet trussel i opprinnelig situasjon skal ikke gi kildebelastning");
  const splitContext = joinSourceContext(originallyNegated,newThreat);
  assert(splitContext.includes("\n"),"Brukerytringer skal skilles med tydelig setningsgrense");
  assert.equal(shouldRetainCuratedSources({
    requestedTopic:"Samarbeid og kommunikasjon",subtopic:"Arbeidsdeling",
    situation:splitContext,occupationContext:ordinaryContext
  }),true,"Ny trussel i oppfølging må utløse kilder tross tidligere negasjon");
  assert.equal(joinSourceContext("  Bare arbeidsdeling. ","  Hva gjelder nå?  "),
    "Bare arbeidsdeling.\nHva gjelder nå?","Kontekstfunksjonen skal trimme og bevare ytringsgrense");
  assert.equal(joinSourceContext("",newThreat),newThreat,"Tom opprinnelig situasjon må håndteres");
  assert.equal(joinSourceContext(originallyNegated,""),originallyNegated,"Tom oppfølging må håndteres");
  assert.equal(joinSourceContext(null,undefined),"","Mangler begge input skal ikke gi 'undefined'");
  console.log("SOURCE RETENTION OK: live-avvik + juridisk kilderangering + positive kontroller");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
