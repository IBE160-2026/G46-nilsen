# PRD – leveransestatus, testbevis og restarbeid

**Statusdato:** 20.11.2026. **Rolle:** Rapport om faktisk kode/teststatus, ikke nye funksjonelle krav. Kravene står i [PRD.md](PRD.md).

## Metode og kildegrunnlag

- Faktisk implementasjon vurderes mot `G46-nilsen/main` 12.11.2026 og kvalitetsgrenen `audit/ibe160-final-quality-2026-11-20`. Det som bare er dokumentert fra eldre testkjøringer, merkes som historiske resultater.
- `npm test` er deterministisk; den verifiserer ikke kvaliteten til en ekstern språkmodell. `npm run demo` viser lokal mockflyt, ikke Supabase/live KI.
- Faglærers vurdering 12.11.2026: `docs/bmad/tilbakemelding-prd.md`. PRD før konsolideringen finnes i `docs/bmad/historikk/PRD-2026-11-12.md`.

## Krav → implementasjon → test → begrensning

| Krav | Omfang | Implementasjon/spor | Dokumentert test/aktivitet | Det som fortsatt krever kontroll |
|---|---|---|---|---|
| **FR-01 Situasjonsbeskrivelse** | Kjerne | app.js, server.js | tests/test-pilot-regression.cjs | Statisk/regresjon; manuell ende-til-ende gjenstår |
| **FR-02 Tema og undertema** | Kjerne | src/client-data.js, app.js | tests/test-benchmark-taxonomy.cjs; tests/test-ui-regression.cjs | Struktur/regresjon; manuell temaovergang gjenstår |
| **FR-03 Hovedveiledning** | Kjerne | server.js, docs/ai/AI-RESPONSE-CONTRACT.md | tests/test-guidance-quality.cjs; tests/test-ai-golden.js | Regresjon, egen fagfasit; live vurderes separat |
| **FR-04 Oppfølgingsdialog** | Kjerne | app.js, server.js | tests/test-pilot-regression.cjs | Kontekst i faktisk nettleser må kontrolleres |
| **FR-05 Samtaleøvelse** | Kjerne | app.js, server.js | tests/test-simulation.js; tests/test-simulation-ai.js | Deterministiske kontroller; live/personvurdering separat |
| **FR-06 Personverngateway** | Kjerne | src/privacy-detector.js, server.js | tests/test-privacy.js; tests/test-server-privacy.cjs; tests/test-privacy-surfaces.cjs | Regresjon dekker definerte caser; ikke full anonymitetsgaranti |
| **FR-07 Autentisering** | Kjerne | server.js, database/ | tests/test-server-privacy.cjs | To reelle kontoer, sesjonsfornyelse og RLS må bekreftes |
| **FR-08 Engangsinvitasjoner** | Kjerne/drift | server.js, scripts/create-invite.js | Manuell API-test | Brukt/utløpt/ugyldig invitasjon må bekreftes |
| **FR-09 Historikk** | Kjerne | server.js, app.js | tests/test-history-hotfix.cjs | Eierskap og sletting trenger to-konto-test |
| **FR-10 Rapportere KI-svar** | Utvidelse | server.js, app.js | tests/test-privacy-surfaces.cjs | Frivillig vedlegg og admin-tilgang trenger E2E-test |
| **FR-11 Roller** | Utvidelse/drift | server.js, database/ | Manuell rolle/API-test | Må testes med user/editor/admin på server |
| **FR-12 Admin** | Utvidelse/drift | server.js, app.js | Manuell E2E + API-test | Modell, feedback, kostnad og innhold må verifiseres |
| **FR-13 Modellvalg** | Prototype | server.js, app.js | tests/test-model-compare.js | Live providerbytte er ikke verifisert av CI |
| **FR-14 Benchmark** | Prototype | data/BENCHMARK-CASES.json, server.js | tests/test-benchmark-taxonomy.cjs; tests/test-model-compare.js | 114 strukturelle saker, ikke full live-modellsammenligning |
| **FR-15 Automatisert KI-test** | Kvalitet | tests/AI-GOLDEN-CASES.json | tests/test-golden-schema.cjs; tests/test-golden-utils.js | Live KI-kvalitet testes utenfor CI |
| **FR-15A Kildepresisjon og negativ fasit** | Kvalitet | data/OCCUPATION-SOURCE-MAP.json | tests/test-golden-occupation-routing.cjs; tests/test-source-policy.cjs | Kildevalidering er intern, ikke uavhengig fagdom |
| **FR-16 Faggrunnlag/kildebank** | Kjerne/kvalitet | data/SOURCEBANK.json, docs/SOURCEBANK.md | tests/test-sourcebank.cjs; tests/test-source-policy.cjs | Faglig riktighet krever ekstern vurdering |
| **FR-17 Brukertesting** | Kvalitet/pilot | docs/BRUKERTEST-FUNN-OG-BACKLOG.md | Dokumentert kvalitativ pilot | Ikke statistisk representativ; ny definert pilot anbefalt |
| **FR-18 Web-/kildeanalyse** | Prototype/delvis | server.js, src/server/source-retention.js | tests/test-source-retention.cjs | Eksterne kilder/dato må kontrolleres manuelt |
| **FR-19 Videre spørsmål** | Kjerneutvidelse | app.js, server.js | tests/test-guidance-quality.cjs | Reell interaksjon på mobil/PC gjenstår |
| **FR-20 Utskrift** | Utvidelse | app.js, styles-core.css | Manuell forhåndsvisning | Sjekk alt sammenfoldet innhold i utskriftsvisning |
| **FR-21 Minimert navigasjon** | UX | app.js, styles-responsive.css | tests/test-pilot-ux.cjs | Manuell mobil/PC test gjenstår |
| **FR-22 Valgfritt yrke/tariff** | Utvidelse | src/server/occupation-router.js, data/OCCUPATION-LEGAL-SOURCES.json | tests/test-occupation-router.cjs; tests/test-golden-occupation-routing.cjs | Feature flagg og faglig innhold må sjekkes |
| **FR-23 Direkte åpen samtale** | Framtidig hypotese | docs/VOICE-DESIGN.md | Ingen ferdig funksjon i v1 | Må ikke omtales som implementert |

## Funn som må være synlige for sensor

1. **Historisk teststatus:** 73 personvernscenarier og 24 simulator-kontroller, golden-schema 66 caser, 114 benchmarktilfeller på 48 undertemaer, og 40/40 rapportert live KI-yrkestest mot gpt-5.6-luna 09.11.2026. Dette er resultater for avgrensede testsett, ikke garanti for juridisk/faglig kvalitet.
2. **Siste `main`-CI før revisjonen:** Run `43205812288` (12.11.2026) var rød fordi et urelatert Pytagoras-dokument lå i `.docs/`, og struktursjekken avviste mappen. Dokumentet ble fjernet **kun i arbeidsgrenen**. Etter opprettet draft-PR #13 ble quality gate på arbeidsgrenen grønn. `main` og Render-produksjon er uendret.
3. **Åpent om kodekvalitet:** `app.js` og `server.js` er store. De tre aktive CSS-filene har totalt 845 `!important`, inkludert gjentakelser. Opprydding bør skje med visuell regresjonskontroll; mål ikke bare antall linjer.
4. **Oppgave og planlegging:** Den tidlige prototypen kom før fullstendig BMAD. Eksisterende dokumenter skal ikke tilbakedateres eller fremstilles som om alle krav var definert før implementasjon.

## Prioritert verifisering før merge og innlevering

- [ ] Quality Gate grønn på siste commit i PR #13, inkludert `npm ci`, `npm test`, høy-alvorlig `npm audit` og golden-oppsummering.
- [ ] To reelle kontoer: historikkisolasjon, serverautorisering, utlogging/innlogging og kontobytte (FR-07/09/11/12).
- [ ] Gjennomfør UJ-01 og UJ-02 i faktisk nettleser på PC og mobil; kontroller feiltilfeller og utskrift (FR-01–06/19–21).
- [ ] Manuell fag- og kildekritisk prøving av representative høyrisiko KI-svar, utover maskinell fasit.
- [ ] Verifiser produsert deploy og faktisk pilotversjon separat fra GitHub-revisjonen; PR #13 skal ikke automatisk deployes til produksjon.
- [ ] Gjennomgå PRD/README/arkitektur/stories/AI-logg og refleksjon, slik at kravstatus er konsistent og verifiserbar.

## Hva som ikke er gjort i denne dokumentrevisjonen

Ingen ny live KI-kjøring, ingen uavhengig ekspertvalidering, ingen to-konto-test mot Supabase og ingen visuell nettlesertest er gjennomført av denne PRD-revisjonen. De må ikke fremstilles som bestått.
