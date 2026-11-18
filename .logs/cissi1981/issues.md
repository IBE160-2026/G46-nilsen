# Åpne punkter – IBE160 Samtalestøtte

Oppdatert 18.11.2026. **Omfatter hele prosjektet.** `main` er produksjonsgrunnlag; dokumentasjonsrevisjon i `docs/ibe160-helhetlig-revisjon-20261118`. LIVE er bare pilot.

## Utført i dokumentasjonsrunden (ikke det samme som full produkttest)

- [x] Konsolidert `docs/bmad/PRD.md` etter faglærertilbakemelding 12.11: FR-15A, FR-19–23 og NFR-QA-01 i hovedkrav, 36 krav med observerbare akseptanser, tydelig MVP, brukerreiser, mål, motmål og begreper.
- [x] Flyttet datert test-/statushistorikk uten sletting til `docs/bmad/PRD-STATUS-OG-HISTORIKK.md`.
- [x] Knyttet 36/36 eksakte krav-ID-er til Architecture (AD-01–10), Epics/Stories (§ 25.3) og testbevisregister. Dette er **sporbarhet**, ikke bestått testdekning.
- [x] Dokumentert logiske avhengigheter med redigerbart diagram; avgrenset mot faktisk maskinelt uttrekk og påstått microservice-/subagentbruk.
- [x] Opprettet `docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md` for statisk, deterministisk, integrasjon, live og manuell evidens.
- [x] Oppdatert implementeringsplan, refleksjonsutkast, KI-logg, AI-TESTPLAN og README med faglig teori, Git-historie, dokumentkilder og reell CI-status.
- [x] Kontrollerte GitHub Actions-logg: siste `main`-CI 12.11 feilet på lærerens fil i `.docs`; korrigerte strukturtesten snevert på **dokumentasjonsgrenen**.
- [x] Statisk kontrollert at 36 kravoverskrifter er unike, alle 36 refereres i tre oppfølgingsdokumenter, og 31 lokale testkommandoer i `package.json` finnes. Dette er **ikke** `npm test`.
- [x] Rettet lenker slik at LIVE-spesifikasjonen peker til **pilotgrenen** og ikke en manglende fil i main-grunnlaget.

- [x] Live Supabase-metadatasjekk uten persondata/endringer: 10/10 RLS; 4 `conversations`-policyer; ingen anon SELECT; auth-tabelltilgang kun `conversations`.
- [x] HTTP-autorisasjonsgrense i faktisk Express-server bestått: 22 uinnloggede kall, 3 ugyldige Origin, 5 interne stier; utvidet deterministisk sensor-demo.
- [x] Ny Quality Gate 18.11, run `44338528651`, **SUCCESS** med 32 deltester og audit 0 sårbarheter.

- [x] Testdrev OpenRouter-only `/api/status`: rød run `44339406194` bekreftet feilen, minimal fix i `server.js`, grønn run `44339569597` med 33 tester/audit. Ingen prod-merge.

## Nye testfunn og rettelser – 18.11.2026

**Siste komplette CI-kjøring:** [44343038247](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44343038247) på revisjonsgrenen, commit `4d78bcbc02d665c3cfa0ae68289b81370621dfc3`, **SUCCESS**: 35 automatiske deltester, dependency audit med 0 sårbarheter og 66/40 golden-opptelling (ikke en ny live modellkjøring).

- **To fiktive brukere:** `tests/test-auth-history-two-users-http.cjs` kjører selve Express-serveren mot en lokal Auth/PostgREST-simulator. Opprett/les/endre/slett, eksport, uautoriserte operasjoner og databasefeil testes. Den første røde kjøringen `44341093359` fant en misvisende HTTP 500 ved oppdatering av ukjent/andres ID; nå nøytral 404. Grønn kjøring `44341831405`. Se `docs/ai/REGRESJON-HISTORIKK-TO-BRUKERE-2026-11-18.md`. **Ekte Supabase RLS med to reelle kontoer er ikke gjennomført.**
- **Feil fra KI-provider:** `tests/test-ai-provider-errors-http.cjs` med offline fetch-stub tester 503, 429, ugyldig leverandørrespons, nettverksbrudd og personvernblokkering før KI. En rød kjøring `44342507107` avdekket et falskt personnavntreff på `Hvordan`. Det delte navnefilteret og klient-/servertestene er korrigert med spørreord pluss fortsatt positiv navnegjenkjenning. Grønn kjøring `44343038247`. Se `docs/ai/REGRESJON-KI-FEIL-OG-SPORREORD-2026-11-18.md`.
- Ingen produksjonsmerge, ingen Render-deploy, ingen endringer i LIVE-piloten og ingen lesing/endring av reelle brukerrader. `main` er fortsatt produksjonsreferanse. Alle testkonklusjonene gjelder **den isolerte revisjonsgrenen**, ikke en ny `main`-CI.

## Åpne oppgaver før sluttgodkjenning

- [x] **Revisjonsgren Quality Gate utført 18.11:** run `44336281200` SUCCESS på `d9234879...`, 31 deltester + npm audit 0 sårbarheter + golden-opptelling 66/40.
- [ ] **Før eventuell merge:** fjern den midlertidige ekstra branch-triggeren fra `.github/workflows/quality-gate.yml`, vurder andre dokumentasjonsendringer og kjør Quality Gate på endelig målcommit. `main` er fortsatt uendret og siste run der feilet.
- [ ] **P0:** Fullfør ekte Supabase-Auth/RLS E2E i separat testprosjekt med to fiktive kontoer. Isolert lokal to-bruker HTTP-test og live RLS-metadata er gjennomført, men erstatter ikke dette., både normal og uautorisert API-/databaseadgang, uten ekte persondata.
- [ ] **P0:** Vurder å aktivere Supabases leaked-password protection før bredere bruk; nåværende advisory WARN dokumentert, ikke endret.
- [x] **P1 delvis:** Lokal API-providerfeilsimulering gjennomført (503/429/ugyldig svar/frakobling) og nøytrale API-feilmeldinger testet; direkte personverngateway verifisert. Timeout over reelle tjenestegrenser, appens faktiske klientmelding og database-retry/latens er **ikke** testet.
- [ ] **P1:** Test reell provider-timeout/retry, databasebrudd i dedikert testmiljø og menneskelig vurdering av klientens feilmeldinger.
- [ ] **P1:** Kontroller 36 akseptanser mot reell kode/atferd og status – ikke anta at tekstassert eller krav-ID er et E2E-bevis. Marker og prioriter eventuelle hull.
- [ ] **P1:** Kjør faktisk brukerreise på desktop og fysisk mobil, inkl. PWA, personvern, oppfølgingsflyt, utskrift med hovedråd + videre råd og sensorens demomodus.
- [ ] **P1:** Gjør en kritisk menneskelig sluttgjennomgang av nye formuleringer, tekniske spor og risikopåstander i PRD/arkitektur/stories. Ingen uavhengig ekspertvalidering er dokumentert.
- [ ] **P1:** Sluttrediger refleksjonsrapporten – nå ca. 9 000 whitespace-ord – mot reell ord-/formgrense og innleveringskrav i Canvas. Konsolider kronologiske tillegg uten tap av læring.
- [ ] **P1:** Behold LIVE/tale og alternativ direkte inngang (FR-23) som **to ulike, ikke-produksjonssatte** hypoteser. Krev egne personvern-, norsk-dialekt-, kommando- og brukerprøver før noen produksjonsbeslutning.
- [ ] **P2:** Verifiser hvilke sesjonslogger som fantes lokalt fra før; AI-loggen er delvis rekonstruert og skal ikke omtales som ordrett/historisk komplett.
- [ ] **P2:** Ny kvalitetskjøring mot faktisk kildeoppdatering/yrkeregler og faglig review ved senere leveranse-/modellendringer.

Se `docs/REVISJON-IBE160-2026-11-18.md` og `docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md` for bevis og metode.
