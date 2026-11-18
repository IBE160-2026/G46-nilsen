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

## Åpne oppgaver før sluttgodkjenning

- [x] **Revisjonsgren Quality Gate utført 18.11:** run `44336281200` SUCCESS på `d9234879...`, 31 deltester + npm audit 0 sårbarheter + golden-opptelling 66/40.
- [ ] **Før eventuell merge:** fjern den midlertidige ekstra branch-triggeren fra `.github/workflows/quality-gate.yml`, vurder andre dokumentasjonsendringer og kjør Quality Gate på endelig målcommit. `main` er fortsatt uendret og siste run der feilet.
- [ ] **P0:** Fullfør innlogget E2E (HTTP uten sesjon er testet, live RLS-policyer er lest): test tilgang/RLS, historikk og admin med to fiktive kontoer, både normal og uautorisert API-/databaseadgang, uten ekte persondata.
- [ ] **P0:** Vurder å aktivere Supabases leaked-password protection før bredere bruk; nåværende advisory WARN dokumentert, ikke endret.
- [ ] **P1:** Test API-/provider-timeout, uventet/ugyldig KI-svar, nettverkstap og databasefeil. Dokumenter faktiske brukermeldinger og personverngrenser.
- [ ] **P1:** Kontroller 36 akseptanser mot reell kode/atferd og status – ikke anta at tekstassert eller krav-ID er et E2E-bevis. Marker og prioriter eventuelle hull.
- [ ] **P1:** Kjør faktisk brukerreise på desktop og fysisk mobil, inkl. PWA, personvern, oppfølgingsflyt, utskrift med hovedråd + videre råd og sensorens demomodus.
- [ ] **P1:** Gjør en kritisk menneskelig sluttgjennomgang av nye formuleringer, tekniske spor og risikopåstander i PRD/arkitektur/stories. Ingen uavhengig ekspertvalidering er dokumentert.
- [ ] **P1:** Sluttrediger refleksjonsrapporten – nå ca. 9 000 whitespace-ord – mot reell ord-/formgrense og innleveringskrav i Canvas. Konsolider kronologiske tillegg uten tap av læring.
- [ ] **P1:** Behold LIVE/tale og alternativ direkte inngang (FR-23) som **to ulike, ikke-produksjonssatte** hypoteser. Krev egne personvern-, norsk-dialekt-, kommando- og brukerprøver før noen produksjonsbeslutning.
- [ ] **P2:** Verifiser hvilke sesjonslogger som fantes lokalt fra før; AI-loggen er delvis rekonstruert og skal ikke omtales som ordrett/historisk komplett.
- [ ] **P2:** Ny kvalitetskjøring mot faktisk kildeoppdatering/yrkeregler og faglig review ved senere leveranse-/modellendringer.

Se `docs/REVISJON-IBE160-2026-11-18.md` og `docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md` for bevis og metode.
