const assert = require("node:assert/strict");

(async () => {
  const { requiredEmployerScopedPrimaryLawIds, shouldRetainCuratedSources } = await import("../src/server/source-retention.js");

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

  console.log("SOURCE RETENTION OK: live-avvik + kildepresisjon + positive kontroller");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
