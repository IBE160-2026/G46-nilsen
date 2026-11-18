# Testbevis og kravdekning – kontrollregister 18.11.2026

**Grunnlag:** `main` commit `2ae505adc22a9ea86ef89e5cf045f4ec5f68d0cf`, 12.11.2026.  
**Status:** Utvidet til faktisk CI-kjøring 18.11.2026 på isolert revisjonsgren, inklusive produksjonsserverens uinnloggede HTTP-grense og deterministisk sensordemo. Full innlogget E2E, live KI og fysisk UX er fortsatt ikke utført.  
**Formål:** Skille testfilens eksistens fra testens faktiske beviskraft, slik faglærer etterspør.

## 1. Testnivåer – bruk riktig bevis

- **S – statisk/strukturell:** kildekodesøk, schema og tekstassert. Nyttig for regresjoner; dokumenterer ikke full brukerflyt.
- **D – deterministisk kjøring:** stabile regler/datafunksjoner, test med forventet konkret resultat. Noen av disse er isolerte VM-tester, ikke hele HTTP-serveren.
- **I – integrasjon/end-to-end:** kjør faktisk app/API/database med riktig autentisering, to fiktive brukere, mislykkede kall og negative scenarioer.
- **L – live språkmodell:** stokastisk KI-respons; oppgi modell, dato, testsett, vurderingskriterium og eventuelt menneskelig review.
- **M – manuell/fysisk:** faktisk bruk av nettleser/mobil, simulert arbeidsflyt, utskrift eller brukerundersøkelse.

Å markere et krav «IMPLEMENTERT» i PRD er en **statusopplysning**, ikke automatisk «I/E2E bestått». «Mangler» nedenfor betyr at endelig bevis **ikke er dokumentert i denne kontrollen**, ikke nødvendigvis at funksjonen er ødelagt.

## 2. Kontrollpunkter per krav

| Krav | Område | Bevisnivå/status i kontrollen | Aktuelle spor (ikke nødvendigvis tilstrekkelige) | Må fortsatt kontrolleres |
|---|---|---|---|---|
| FR-01 | Demo/klientstruktur | S + E2E ikke verifisert | `app.js`; `scripts/sensor-demo.js` | Anonymisert situasjon, reset og videreføring |
| FR-02 | Tema-/benchmark-kontrakt | D + E2E ikke verifisert | `tests/test-benchmark-taxonomy.cjs`, `src/server/topic-contracts.js` | Valg av 9/48 og avvisning av utdatert tema |
| FR-03 | Råd/schema | S + historisk L | `tests/test-guidance-quality.cjs`, `tests/test-ai-golden.js` | Faktisk muntlig åpning og ugyldig API-respons |
| FR-04 | Oppfølging | S + E2E mangler | `app.js`, `server.js` | Kontekst i samme sak og reset mellom saker |
| FR-05 | Simulator | S/D + historisk L | `tests/test-simulation.js`, `tests/test-simulation-ai.js` | Rolle, kontekst, ubegrunnet diagnose/motiv |
| FR-06 | Personvern | D + API-integrasjon gjenstår | `tests/test-privacy.js`, `tests/test-server-privacy.cjs` | Blokkering på server ved direkte API-anrop |
| FR-07 | Innlogging | Uinnlogget HTTP-grense bestått; innlogget I mangler | `server.js`, `database/` | Inn/utlogging og ugyldig sesjon |
| FR-08 | Invitasjon | Kode; I mangler | `scripts/create-invite.js`, `server.js` | Utløpt/gjenbrukt token |
| FR-09 | Historikk | Uinnlogget HTTP-grense bestått, demo lagre/slett bestått; innlogget I mangler | `tests/test-history-hotfix.cjs`, `database/` | Kryssbruker-ID, RLS, slett/refresh |
| FR-10 | Rapportering | Kode; I mangler | `app.js`, `server.js` | Lagring/brukerbeskjed/tilgang |
| FR-11 | Roller | Uinnlogget admin avvist; rollebytte med reelle konti mangler | `server.js`, `database/` | User/editor/admin over API og RLS |
| FR-12 | Admin | Kode; I mangler | `app.js`, `server.js` | Uautorisert endring, persistens |
| FR-13 | Modellvalg | Kode; I mangler | `server.js` | Tillatte provider/modeller og feilhåndtering |
| FR-14 | Benchmark | D / fler-modell L mangler | `tests/test-benchmark-taxonomy.cjs`, `tests/test-model-compare.js` | Reell sammenligningsrapport for minst to modeller |
| FR-15 | Automatisert KI-test | D + historisk L | `tests/test-golden-schema.cjs`, `tests/test-ai-golden.js` | 66 caser, eval-resultat/commit, manuell fasit |
| FR-15A | Negativ kildefasit | D + historisk L | `tests/test-golden-occupation-routing.cjs`, `tests/test-ai-golden.js` | Forbudte kilder regnes som kritiske |
| FR-16 | SOURCEBANK | D + faglig review utestående | `tests/test-sourcebank.cjs`, `tests/test-source-policy.cjs` | Korrekt kilde for konkret påstand |
| FR-17 | Brukertesting | M kvalitativ historisk | `docs/BRUKERTEST-PLAN.md`, `docs/BRUKERTEST-FUNN-OG-BACKLOG.md` | Lite utvalg; ikke representativt |
| FR-18 | Web-/kildeanalyse | D struktur / I mangler | `tests/test-source-retention.cjs`, `server.js` | Faktisk hentegrunnlag, feil og lagringsminimering |
| FR-19 | Neste spørsmål | S + E2E mangler | `tests/test-pilot-regression.cjs`, `app.js` | 2–4 forslag som ikke overtar fritekst |
| FR-20 | Utskrift | Kode/CSS, M mangler | `app.js`, `styles-core.css` | Print-preview hovedråd + videre råd, skjult navigasjon |
| FR-21 | Navigasjon | S/D + M kreves | `tests/test-pilot-ux.cjs`, `styles-responsive.css` | Sidebar preference, tooltips, mobil |
| FR-22 | Yrkes-/sektorkontekst | D + historisk L | `tests/test-occupation-router.cjs`, `tests/test-source-policy.cjs` | Negativ kilde, flagg og faktisk miljø |
| FR-23 | Direkte alternativ tekstinngang | **VIDERE ARBEID** | `docs/bmad/PRD.md` | Ikke godkjent produksjonsfunksjon; skilt fra tale-LIVE |
| AI-01 | Fakta/antakelser | Historisk L + M kreves | `tests/AI-GOLDEN-CASES.json`, `tests/test-ai-golden.js` | Usikkert faktagrunnlag |
| AI-02 | Diagnoser | D/S + historisk L | `tests/test-simulation.js`, `tests/AI-GOLDEN-CASES.json` | Medisinsk/psykologisk påstand uten grunnlag |
| AI-03 | Skyld/motiv | D/S + historisk L | `tests/test-guidance-quality.cjs`, `tests/AI-GOLDEN-CASES.json` | Skyld, motiv og tolkning |
| AI-04 | Juridisk/HR-usikkerhet | D + historisk L/M | `tests/test-source-policy.cjs`, `tests/AI-GOLDEN-CASES.json` | Kildeautoritet, tariff og avgrensning |
| AI-05 | Kontekstisolasjon | Kode; E2E mangler | `app.js`, `server.js` | Reset og flerbrukertilgang |
| AI-06 | Provideruavhengighet | Prototype; I mangler | `server.js`, `tests/test-model-compare.js` | Responskontrakt ved providerskifte |
| NFR-01 | Sikkerhet | HTTP-grense og live RLS-metadata verifisert; konto-I mangler | `tests/test-server-privacy.cjs`, `server.js`, `database/` | RLS/IDOR, rate limit, cookies, headere |
| NFR-02 | Personvern | D + I utvides | `tests/test-privacy-surfaces.cjs`, `tests/test-server-privacy.cjs` | Oppfølging, sletting, retensjon |
| NFR-03 | Brukervennlighet | S + historisk M | `tests/test-ui-regression.cjs`, `docs/BRUKERTEST-FUNN-OG-BACKLOG.md` | Fysisk mobil, skjermleser, print |
| NFR-04 | Feilhåndtering | Kode; negativ I mangler | `server.js`, `app.js` | Timeout, JSON-feil, nettutfall, DB feil |
| NFR-05 | Vedlikeholdbarhet | Revisjonsgren CI **bestått**; siste `main`-CI feilet | `tests/test-repo-structure.cjs`, `package.json` | Main-run 43205812288 feilet ved .docs |
| NFR-QA-01 | Quality Gate | Revisjonsgren run `44336281200` **bestått**; `main`-run feilet | `.github/workflows/quality-gate.yml` | Kjør faktisk full pakke inkl audit på endelig commit |

## 3. Verifiserte dokumentfakta

- `tests/AI-GOLDEN-CASES.json` inneholder **66** caser, og `data/BENCHMARK-CASES.json` inneholder **114** (opptalt direkte fra JSON i `main`).
- Golden-bankens ni temaer har henholdsvis **3, 7, 5, 9, 11, 5, 16, 4 og 6 caser** for Alkohol/rus, Fravær, Prestasjon, Lønn, Samarbeid, Oppsigelse, Sikkerhet, Livssituasjoner og Mobbing/trakassering. Summerer til 66.
- `package.json` har **31** delkommandoer i den deterministiske `test-local`-kjeden; det betyr ikke at alle er full E2E-testing.
- `tests/AI-GOLDEN-CASES.json` har eksplisitte `requirement_refs` i case-objektene; forekomst er **ikke det samme** som testresultat eller fullstendig kravdekning.
- Historisk lokal live occupation-golden mot `gpt-5.6-luna` 09.11: **40/40 OK** rapportert i `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`; dette er egen prosjektfasit, ikke ekstern ekspertgodkjenning og ikke fersk test på endelig commit.
- Siste Quality Gate på `main`, run `43205812288` 12.11, **feilet** i `tests/test-repo-structure.cjs` på mappen `.docs`. Etterfølgende `npm audit` og strict golden-oppsummering ble **hoppet over**. Forrige run `43202363894` var grønn, men gjelder en eldre commit.

**Revisjonsgren-CI 18.11.2026:** [GitHub Actions 44336281200](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44336281200), commit `d9234879e848219f7ea0b1fe87bf3bced9572615`, **SUCCESS** – `npm ci`, alle 31 `npm test`-delsteg, produksjonsdependency-audit (**0 sårbarheter**) og oppsummering av 66 golden-caser (40 strenge: 28 sektor, 8 tariff, 4 kildelekkasje). Dette er ikke en ny live KI-test eller E2E-/RLS-godkjenning, og `main` er fortsatt uendret.

**Utvidet revisjonsgren-CI 18.11.2026:** [GitHub Actions 44338528651](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44338528651), commit `206925b5a4d8e222c8811677d045859539f98447`, **SUCCESS** med 32 deltester, `npm audit` (0 sårbarheter), golden-oversikt (66/40), ekte HTTP-avvisningstest for uinnloggede API-kall og utvidet deterministisk demoflyt. Denne kjøringen tester **ikke** to innloggede brukere, RLS i live request-kontekst, faglige live KI-råd, fysisk mobil eller utskrift.

**Read-only Supabase-sikkerhetskontroll 18.11.2026:** Live databasedefinisjoner viser RLS på alle 10 `public`-tabeller, fire eierskapsbaserte `conversations`-policyer, ingen SELECT for `anon`, og direkte `authenticated`-rettigheter kun på `conversations`. Security Advisor viser WARN om deaktivert leaked-password protection og ni INFO om policyfrie serverstyrte tabeller. Se `docs/ai/SUPABASE-SIKKERHET-2026-11-18.md`. Ingen persondata er lest eller databaseendringer utført.

## 4. Viktigste åpne kvalitetsrisikoer

1. **Tilgang og RLS:** Kildestruktur/DDL og enkle assert er ikke nok til å bevise at A aldri får Bs historikk. Verifiser med to reelle testkonti mot testdatabase.
2. **Feilhåndtering:** Test med provider-timeout, nettutfall, tomt/ugyldig KI-svar, DB-feil og samtidige oppfølgingskall. Dokumenter at bruker får tydelig melding uten lekkasje.
3. **Kildeautoritet:** Positive og negative forventninger må verifiseres på modell-/kildekontrakt, ikke bare at en hvilken som helst kilde vises.
4. **KI-eval:** Egen golden-bank kan gjenspeile egen forståelse og modellevaluering; kritiske arbeidsretts-/helsepåstander bør vurderes av kompetent fagperson før bruk utenfor studentprototype.
5. **Menneskelig UX:** Mobil/PWA/utskrift og fremdrift fra råd til simulering kan ikke «godkjennes» gjennom tekstsøk alene.
6. **LIVE:** Taletranskripsjon er separat pilot og **ikke** del av denne produksjons-testdekningen.

## 5. Minimum før sluttpåstand om fullstendig bestått

Kjør full kvalitetssperre på den identifiserte **endelige** kodeversjonen, registrer GitHub Actions-run og commit, utfør nødvendige API-/RLS- og manuelle scenarioer, og bekreft at alle krav uten testbevis er merket korrekt som delvis, planlagt eller gjenstående. Oppdater deretter først `README.md` og refleksjonsrapportens endelige konklusjoner.

Se også `docs/bmad/PRD-STATUS-OG-HISTORIKK.md`, `docs/REVISJON-IBE160-2026-11-18.md` og `docs/bmad/EPICS-AND-STORIES-BMAD.md`.
