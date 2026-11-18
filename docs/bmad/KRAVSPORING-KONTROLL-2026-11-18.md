# Kravsporingskontroll – Samtalestøtte

**Dato:** 18.11.2026  
**Referansegren:** `main`, commit `2ae505adc22a9ea86ef89e5cf045f4ec5f68d0cf`  
**Arbeidsgren:** `docs/ibe160-helhetlig-revisjon-20261118`  
**Formål:** et ærlig kontrollark for å lukke gap mellom PRD, arkitektur, epics/stories, implementasjon og tester.

> **Les før bruk:** «Ja/Nei» nedenfor betyr **utelukkende at eksakt krav-ID finnes/ikke finnes som tekst** i det aktuelle dokumentet. «Nei» betyr ikke nødvendigvis at funksjonaliteten mangler. Kolonnen «tekniske spor/testkandidater» viser konkrete steder som bør undersøkes; den er **ikke et nytt verifisert testresultat**. PRD-status er gjengitt fra dokumentet, ikke godkjent på nytt av denne revisjonen.

## Kanoniske krav fra PRD

PRD inneholder 23 FR-krav (FR-01–FR-23), seks KI-krav (AI-01–AI-06) og fem NFR-krav (NFR-01–NFR-05): **34 krav**. I tillegg finnes senere `FR-15A`, `NFR-QA-01` og kravtekster uten stabil ID; disse må konsolideres før matrisen er endelig.

| ID | Krav | Status som påstått i PRD | ID i Epics | ID i Architecture | Tekniske spor/testkandidater – **ikke nyverifisert** |
|---|---|---|:---:|:---:|---|
| FR-01 | Situasjonsbeskrivelse | IMPLEMENTERT | Ja | **Nei** | `app.js`; vurder UI-flyt manuelt |
| FR-02 | Tema og undertema | IMPLEMENTERT | Ja | **Nei** | `src/client-data.js`; `tests/test-benchmark-taxonomy.cjs` |
| FR-03 | KI-basert hovedveiledning | IMPLEMENTERT | Ja | **Nei** | `server.js`, `src/server/ai-schemas.js`; `tests/test-guidance-quality.cjs` (statisk) |
| FR-04 | Oppfølgingsdialog | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; vurder faktisk kontekstflyt |
| FR-05 | Samtaleøvelse (samtalesimulering) | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; `tests/test-simulation.js` (hovedsakelig statisk) |
| FR-06 | Personverngateway | IMPLEMENTERT | Ja | **Nei** | `src/privacy-detector.js`, `server.js`; `tests/test-privacy.js`, `tests/test-server-privacy.cjs` |
| FR-07 | Autentisering | IMPLEMENTERT | Ja | **Nei** | `server.js`, `database/`; autentisering og sesjon må integrasjonstestes |
| FR-08 | Engangsinvitasjoner | IMPLEMENTERT | Ja | **Nei** | `scripts/create-invite.js`, `server.js`; ingen entydig FR-test identifisert |
| FR-09 | Historikk | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; `tests/test-history-hotfix.cjs` (statisk) |
| FR-10 | Rapportering av KI-svar | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; rapportflyt og persistering må verifiseres |
| FR-11 | Roller | IMPLEMENTERT | Ja | **Nei** | `server.js`, `database/`; RLS/rollegrenser må valideres |
| FR-12 | Admin | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; administrasjon må valideres per rolle |
| FR-13 | Modellvalg | IMPLEMENTERT I PROTOTYPEFORM | Ja | **Nei** | `server.js`; modelleksponering og adgangskontroll må valideres |
| FR-14 | Modellbenchmark | IMPLEMENTERT I PROTOTYPE/TESTFORM | Ja | **Nei** | `data/BENCHMARK-CASES.json`; `tests/test-model-compare.js`, `tests/test-benchmark-taxonomy.cjs` |
| FR-15 | Automatisert KI-testing | IMPLEMENTERT | Ja | **Nei** | `tests/AI-GOLDEN-CASES.json`, `tests/test-ai-golden.js`, `tests/test-golden-schema.cjs` (faktisk fil har .cjs) |
| FR-16 | Faggrunnlag | IMPLEMENTERT | Ja | **Nei** | `data/SOURCEBANK.json`, `data/OCCUPATION-LEGAL-SOURCES.json`; `tests/test-source-policy.cjs` |
| FR-17 | Brukertesting | PILOT GJENNOMFØRT / VIDERE EVALUERING | Ja | **Nei** | `docs/BRUKERTEST-PLAN.md`, `docs/BRUKERTEST-FUNN-OG-BACKLOG.md`; kvalitativt bevis |
| FR-18 | Web- og kildeanalyse | DELVIS / PROTOTYPE | Ja | **Nei** | `server.js`, `data/SOURCEBANK.json`; kildevisning/verifisering må vurderes |
| AI-01 | Fakta og antakelser | IMPLEMENTERT SOM KI-REGEL | Ja | **Nei** | `server.js`, `docs/ai/AI-SYSTEMPROMPT.md`; golden-kriterier må knyttes eksplisitt |
| AI-02 | Ingen oppdiktede diagnoser | IMPLEMENTERT OG TESTET | Ja | **Nei** | `src/server/ai-schemas.js`, `server.js`; `tests/test-guidance-quality.cjs`, golden-caser |
| AI-03 | Ingen oppdiktet skyld eller motiv | IMPLEMENTERT SOM KI-REGEL | Ja | **Nei** | `server.js`, `docs/ai/AI-SYSTEMPROMPT.md`; golden-caser |
| AI-04 | HR og juridiske spørsmål | IMPLEMENTERT SOM KI-REGEL | **Nei** | **Nei** | `server.js`, `data/SOURCEBANK.json`; høy-risiko golden-caser og faglig manuell vurdering |
| AI-05 | Kontekst | IMPLEMENTERT | **Nei** | **Nei** | `app.js`, `server.js`; test faktisk fortsettelsesdialog uten kontekstlekkasje |
| AI-06 | Modelluavhengighet | IMPLEMENTERT I PROTOTYPEFORM | Ja | **Nei** | `server.js`, `tests/test-model-compare.js`; delvis/prototype |
| NFR-01 | Sikkerhet | IMPLEMENTERT PÅ PROTOTYPENIVÅ | Ja | **Nei** | `server.js`, `database/`; sikkerhetstester, RLS og produksjonskonfigurasjon |
| NFR-02 | Personvern | IMPLEMENTERT | Ja | **Nei** | `src/privacy-detector.js`, `server.js`; `tests/test-privacy.js`, `tests/test-privacy-surfaces.cjs` |
| NFR-03 | Brukervennlighet | IMPLEMENTERT MED VIDERE FORBEDRINGSMULIGHET | **Nei** | **Nei** | `docs/BRUKERTEST-FUNN-OG-BACKLOG.md`, `tests/test-pilot-ux.cjs`; fysisk UX-test |
| NFR-04 | Feilhåndtering | IMPLEMENTERT | Ja | **Nei** | `server.js`, `app.js`; API-timeout, nettutfall og feilbeskjeder krever scenariotester |
| NFR-05 | Vedlikeholdbarhet | IMPLEMENTERT SOM ARKITEKTURMÅL | Ja | **Nei** | `tests/test-repo-structure.cjs`, `package.json`, modulstruktur; CI-kjøring 12.11 feilet |
| FR-19 | Videre oppfølgingsflyt | ikke eksplisitt lokalisert | **Nei** | **Nei** | `app.js`; `tests/test-pilot-regression.cjs`, manuell flyttest |
| FR-20 | Utskrift av samtalestøtte | ikke eksplisitt lokalisert | **Nei** | **Nei** | `app.js`; utskrift av hovedråd/videre råd må testes i nettleser |
| FR-21 | Rolig standardnavigasjon | ikke eksplisitt lokalisert | **Nei** | **Nei** | `styles-responsive.css`, `app.js`; `tests/test-pilot-ux.cjs`, fysisk mobiltest |
| FR-22 | Yrke/bransje som valgfri kontekst | ikke eksplisitt lokalisert | **Nei** | **Nei** | `src/server/occupation-router.js`, `src/server/occupation-context.js`; `tests/test-occupation-router.cjs` |
| FR-23 | Direkte samtale som alternativ inngang | ikke eksplisitt lokalisert | **Nei** | **Nei** | KUN PILOT (`pilot-ux-v20.11`, `docs/pilot/LIVE-V1-PILOT-SPEC.md`); ikke produksjonsbevis |

## Viktige metodefunn

1. **Arkitekturens 0/34 eksakte ID-treff** er et sporbarhetsproblem: dokumentet omtaler relevante komponenter, men eksplisitte FR/NFR/AI-koblinger mangler. Løs med seksjonsvise koblinger, ikke ved å legge inn en tilfeldig kravliste uten teknisk begrunnelse.
2. **Epics-dokumentet har 26/34 eksakte ID-treff.** Manglende ID-er: `AI-04`, `AI-05`, `NFR-03`, `FR-19`, `FR-20`, `FR-21`, `FR-22`, `FR-23`. Les innholdet før mapping: flere kan allerede ha funksjonelt overlappende stories.
3. **PRD inneholder ekstra ID-mønstre og sene tillegg:** FR-15A, NFR-QA-01, kildekrav og modulær frontend uten ID. Dette bekrefter hovedfunn i faglærers formative PRD-tilbakemelding 12.11.
4. En fil som `tests/test-ui-regression.cjs` kan sjekke tekst/DOM-struktur uten at reell brukerflyt er kjørt. Skill **fil finnes**, **statisk assert**, **deterministisk runtime**, **live KI** og **manuelt fysisk testet**.
5. 66 golden-caser og 114 benchmark-caser er opptalt fra JSON-filene på `main`. Live resultat 40/40 er historisk dokumentert 09.11 i `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`, men ikke kjørt på nytt her.
6. FR-23 og LIVE er **ikke produksjonskrav med oppfylt status**. LIVE er begrenset til pilotgren/-tjeneste inntil separat kvalitetssikring og eksplisitt beslutning.

## Krav til videre verifikasjon

For hver ID må ansvarlig gå gjennom: (a) konkret observerbar akseptanse, (b) riktig nåstatus, (c) kodefil/funksjon, (d) testnavn og resultat/commit, (e) avvik eller manuell sjekk, (f) dato og miljø. Inntil dette er gjort er matrisen et **revisjonsgrunnlag**, ikke bevis på full dekning.

Se også `docs/REVISJON-IBE160-2026-11-18.md` og `docs/bmad/tilbakemelding-prd.md`.
