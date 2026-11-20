# Benchmark: deterministisk evaluering, kostnadsgrense og åpne avvik

**Dato:** 20.11.2026  
**Prosjekt:** Samtalestøtte / IBE160, draft PR #12  
**Miljø:** Bare revisjonsgren, syntetiske testdata, ingen Render-deploy, betalte KI-kall eller Supabase-mutasjoner.

## 1. Avgrenset kodeuttrekk

`src/client/benchmark-evaluation.js` er en **ren, kostnadsfri klientmodul** for:

- `selectCases(config,count)`: representativ fordeling på tema med rundgang ved delutvalg. Ved valg av hele banken beholdes eksisterende originalrekkefølge; ingen mutasjon av inngangscaser.
- `evaluateOpening(testCase,guidance)`: maskinelle åpningskontroller (tomme svar, ordgrense, for mange setninger, instruksjoner til leder og uheldige mønstre). Manglende forventet situasjonsspråk er fortsatt en **merknad for menneskelig vurdering**, ikke automatisk stryk.

De gamle funksjonene i `app.js` delegerer nå til modulen. Uttrekket reduserte `app.js` fra **4 284 til 4 256 linjer** og **229 082 til 227 324 tegn** (−28 linjer / −1 758 tegn). Hjelperen inneholder ingen `fetch`, DOM, servertilgang, API-nøkkel eller KI-klient. Den kostet **ingen KI-kall** å teste.

**Uforandret på revisjonsgrenen:** `runPilotRegression`, `runBenchmarkLive` og serverens faktiske betalte endepunkter er ikke flyttet eller kjørt mot en KI-provider. Admin-/benchmarkgrensesnitt, kostnadsflyt og øvrige funksjoner er beholdt; bare den deterministiske evaluerings-/utvalgslogikken er flyttet.

## 2. Kjørte tester og bevisnivå

| Bevis | Hva testes | Begrensning |
|---|---|---|
| `tests/test-benchmark-evaluation.cjs` | Faktisk ny modul i isolert Node VM: caseutvalg, fullbankrekkefølge, ordgrense, forbudte mønstre, for mange setninger og myke merknader, null nettverk | Verifiserer ikke kvaliteten på ekte modellrespons |
| `tests/test-admin-browser.cjs` | Ekte headless Chrome med tre fiktive roller; admin: kansellerte betalte kjøringer uten POST; gratis mock-POST; positiv **syntetisk** benchmark og pilot med testdata og avskjærte API-svar; status og HTML-escaping | Alle testens `fetch`-svar er simulert; ingen ekte KI/DB |
| `tests/test-admin-role-http.cjs` | Faktisk Express-rute `POST /api/admin/benchmark/mock` uten AI-nøkler; 401/403 for andre roller, responskontrakt og kontroll av at lokal Auth/PostgREST-fake ikke berøres | Selve testbanken kan rapportere `ok:false`; det er et kvalitetsfunn og ikke det samme som feil i ruten |
| `tests/test-benchmark-taxonomy.cjs` | 114 saker, 48 tema-/undertemaparsrelasjoner, minst to saker per undertema | Tester taksonomi, ikke fullstendig personvern eller faglig fasit |
| Ordinær Quality Gate | 47 `npm test`-delsteg, Chrome/admin, CSS, 99 browser-paritetscenarier, PostgreSQL/RLS og avhengighetskontroll | Ikke ekte Supabase Auth/PostgREST eller live KI |

**Første komplette grønne modul-/browserkjøring:** [Quality Gate #44758243989](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44758243989), før utvidet server-HTTP-test og senere dokumentasjon. Etterfølgende CI må kontrolleres særskilt på siste commit.

## 3. Kritiske funn og gjenværende risikoer

**Funn A – personvernkontroll av testbank:** `POST /api/admin/benchmark/mock` fungerer uten KI-provider, men rapporterer `ok:false` med *`B113 utløser personvernsjekk`*. B113 er en fiktiv samtale om konflikt mellom medarbeider og leder uten eksplisitte navn, men dens formulering utløser dagens detektor. **Dette er ikke ferdig godkjent.** Serverens mock rapporterer nå bare typekategorier (uten personopplysningstekst) for å kunne diagnostisere om dette skyldes reell risiko eller falsk positiv. Ikke endre personverndetektor eller golden-case blindt for å få grønn markering.

**Funn B – kostnadsgrensen er ikke selvstendig håndhevet på server:** Betalt `POST /api/admin/benchmark/live` tar imot `spentSoFar` og `budgetUsd` fra klienten, og bruker et fast tillegg på USD 0,05 før hvert kall. Det finnes ikke en dokumentert autoritativ, serverlagret løpende budsjettføring per kjøring. En klient kan derfor potensielt sende utdatert/manipulert bruktbeløp, og ett API-kall kan koste mer enn estimert reserve. **Budsjettkontrollen kan ikke markedsføres som garantert kostnadstak.** Krever separat serverstyrt budsjett-/kvotereservasjon, samtidighetskontroll, test med mock provider og gjennomgang av oppgjør etter feil/lagringsbrudd, **før** reelle KI-kostnadstester slippes løs.

**Funn C – foreldet tekst i adminvisningen:** Frontendteksten oppgir «Alle 26 saker» og «52 KI-kall», mens gjeldende `tests/AI-GOLDEN-CASES.json` har **66** golden-caser; serveren returnerer dette antallet ved full pilotgjennomgang og bekreftelsen teller sakene dynamisk. Benchmarkvalg i HTML er også merket «Alle 112 saker», mens testbanken nå har **114**; dette er ikke reelt «alle». Oppdater statiske tekster og dynamisk casevalg i en egen UI-endring med Chrome-paritets-/kopitester. **Ingen reelle kostnadskall ble gjennomført nå.**

## 4. Beslutning og neste arbeidssteg

1. Gjør B113-feiltypen eksplisitt, undersøk hvorfor den utløses og rett enten den fiktive testsaken eller en dokumentert falsk positiv uten å svekke navnefilteret.
2. Oppdater feilaktige historiske antall i admin-UI, og la «alle saker» komme fra verifisert API-antall i stedet for en hardkodet verdi.
3. Legg inn ekte serverstyrt, per-bruker/per-kjøring budsjettgrense med atomiske reservasjoner, abort og audit-spor. Verifiser med **lokal mock-provider**, ikke live AI.
4. Først deretter vurder å isolere betalte benchmarkløp i egen modul. Ekte Supabase Auth/PostgREST og menneskelig faglig vurdering kreves fortsatt separat.

**Status:** Klientmodul og nettlesertest av fiktive resultater er testet; live benchmark og full testbankkvalitet er **ikke** godkjent.
