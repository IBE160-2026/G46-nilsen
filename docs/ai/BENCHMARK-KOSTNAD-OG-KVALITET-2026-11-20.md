# Benchmark: deterministisk evaluering, kostnadsgrense og åpne avvik

**Dato:** 20.11.2026  
**Prosjekt:** Samtalestøtte / IBE160, draft PR #12  
**Miljø:** Bare revisjonsgren, syntetiske testdata, ingen Render-deploy, betalte KI-kall eller Supabase-mutasjoner.

## Tillegg 20.11.2026 – faktisk Express + SDK + disponibel PostgreSQL, fortsatt test-only

Nå finnes en dedikert **server-only RPC-adapter** (`src/server/benchmark-budget-rpc.js`) og to nye tester. `tests/test-benchmark-rpc-http.cjs` verifiserer faktisk Express, Supabase JS SDK og OpenAI SDK mot lokale HTTP-simulatorer. I den disponible PostgreSQL-jobben videresendes **de samme RPC-kallene** fra lokal PostgREST-formatbro til den faktiske PostgreSQL 17-databasen; øvrige tjenester er fortsatt simulerte. Serveren reserverer før provider og gjør opp før den eventuelt svarer 200. Uavklarte oppgjør gir 503 og en vedvarende sperret reservasjon. **52** npm-teststeg.

Den utvidede testen avdekket en SQL-feil: en avvist `BUDGET_RUN_BUSY` opprettet en tom `budget_runs`-rad. Dette er rettet ved å utsette opprettelse til etter kontrollene, og dekket av egen SQL-regresjon. Ingen ekte Supabase PostgREST/Auth-akseptansetest eller betalte KI-kall er gjennomført. **Produksjonsbetalte tester forblir deaktivert.** Se [fullkjede-rapport](BENCHMARK-RPC-INTEGRASJON-2026-11-20.md).

---

## Tillegg 20.11.2026 – varig PostgreSQL-budsjett: gjennomtestet SQL-forslag, fortsatt ingen produksjonsintegrasjon

Forrige trinn krevde et transaksjonelt, varig regnskap på tvers av instanser. **Forslag og faktiske PostgreSQL-tester finnes nå**, men appens betalte ruter er fortsatt deaktivert i produksjon:

- `database/security/benchmark-budget-postgres-proposal.sql`: fire private tabeller med RLS, per-bruker radlås, atomisk reservasjon/oppgjør, unik ticket/case-modell, bevarte uavklarte forsøk, dagstak og service-role-only `SECURITY INVOKER`-RPC. Dette er **ikke migrert** til ekte Supabase.
- `tests/sql/benchmark-budget-postgres.sql`: ekte tilgangs- og regnskapstest i isolert PostgreSQL 17.
- `tests/sql/benchmark-budget-concurrency.sh`: to separate databaseforbindelser prøver samme eier samtidig; bare én kan reservere.
- GitHub Actions **restarter** den disponibel PostgreSQL-containeren, og `tests/sql/benchmark-budget-postgres-restart.sql` kontrollerer at uavklart reservasjon ikke forsvinner, at avklaring belaster minst 10 cent, og at 500-cent-dagsrammen ikke kan omgås via ny kjøre-ID.
- SQL-prototypen ligger under `database/security/` og utføres bare eksplisitt i disponibel CI, ikke som automatisk migrasjon. Det gjenstår server-side Supabase RPC-adapter, godkjent sikkerhetsreview/testprosjekt, administrativ avviksavklaring og **faktisk** leverandørkostbegrensning. Node-prosessens tidligere lokale minneledger blir fortsatt brukt bare i isolert HTTP-testmodus.

Se [egen design- og testrapport](BENCHMARK-POSTGRES-LEDGER-2026-11-20.md). **Dette er et steg fra regnskap på én server til et testet, atomisk SQL-design – ikke en godkjenning av betalte produksjonstester.**

---

## Tillegg 20.11.2026 – dynamisk antall fra faktiske testbanker

**Funn rettet:** Administrasjonsgrensesnittet brukte tidligere de utdaterte verdiene «Alle 26 saker / 52 KI-kall» og `<option value="112">Alle 112 saker</option>`. Dette var mer enn et tekstproblem: valget kunne utelate de to nyeste av bankens 114 benchmarkcaser.

**Ny datakilde og visning:**
- `GET /api/admin/pilot-regression/cases?summary=1` krever administratorrolle og returnerer **bare** `pilotCount`, `fullCount` og `paidRegressionEnabled`, beregnet fra `tests/AI-GOLDEN-CASES.json`. Ingen casetekster må overføres for å vise tellingene.
- `loadRegressionCounts()` i `app.js` viser riktig antall pilot-/fulltestsaker, KI-kall beregnet som `antall * 2`, og oppdaterer begge knappeetikettene. Ugyldige/manglende tall gir feilmelding og fortsatt deaktiverte betalte knapper.
- Benchmarksakenes `totalCases` valideres mot lengden av `cases` fra API. `<option value="all">` får dynamisk visning «Alle N saker», og `SamtalestotteBenchmarkEvaluation.resolveCaseCount("all", N)` bruker **alle N**. Slik kan en bank på 114, 115 eller flere caser vises og kjøres uten endring av HTML.
- Alle tre betalte knapper starter som `disabled` i HTML. Serverens `liveEnabled` og `paidRegressionEnabled` må fortsatt være eksplisitt sanne før de blir aktive. Betalt benchmark/pilot/fulltest er altså **fremdeles sperret i produksjon**, og ingen KI-kall er gjort i denne endringen.

**Konkrete testbevis:** `tests/test-benchmark-evaluation.cjs` validerer symbolsk `all` for flere bankstørrelser, inkludert alle 114 caser. `tests/test-admin-browser.cjs` bruker ekte Chrome med fiktiv 3-casers benchmarkbank og 1/3 pilot-/fulltelleverk: sjekker knappetekst, beregnet 2/6 KI-kall, `all` som sender nøyaktig tre **simulerte** benchmark-kall, bekreftelse før fulltest og deaktivering når serveren slår av betalttester. `tests/test-admin-role-http.cjs` bruker den ekte Express-ruten og sammenligner summary-tallene mot JSON-banken; vanlige brukere får fortsatt ikke lese admin-summary. Statisk UI-test hindrer at tallet 112 gjeninnføres som «alle». PWA-cachen er løftet til `20.11.73`.

**Begrensninger:** Det er ikke kjørt live modellbenchmark, og et garantert varig kostnadstak mangler. RLS-, Chrome-/CSS- og ordinære testløp må være grønne på siste commit før endelig aksept.

---

## Tillegg 20.11.2026 – serverstyrt lokal budsjettkontroll og fail-closed betalte tester

**Ny servermodul:** `src/server/benchmark-budget.js` har et **synkront, servereid reservasjonsregnskap per Node-prosess**. Den registrerer valgt run-budsjett per administrator-ID/kjøre-ID, avviser parallell kjøring for samme bruker, duplikate case/modell-par, budsjettendring underveis, ugyldig run-ID og ubegrenset forbruk ved nye run-ID-er. Brukerens *dagsramme i én prosess* er USD 5. Før hvert lokalt testsimulerte providerkall reserveres konservativt USD 0,10; faktisk estimat over dette belastes i etterkant, og både mislykkede og uklare provider-/databasetilfeller beholder minst reservasjonen. `spentSoFar` fra nettleseren **brukes ikke lenger** i serverens beslutning.

**Sikker driftsavgrensning:** Betalt `POST /api/admin/benchmark/live` er **sperret med HTTP 503 `BENCHMARK_PAID_DISABLED` i produksjon og normale utviklingsmiljøer**, uavhengig av klientens budsjett. Den nye reserveringsløkken kan kun nås ved `NODE_ENV=test`, eksplisitt `TEST_BENCHMARK_LIVE=1` og gyldig lokal `TEST_FAKE_OPENAI_PORT`. Testen starter Express med `--import tests/support/offline-openai-fetch.mjs`, som blokkerer eksterne nettverkskall og videresender OpenAI SDK-kall til en lokal, fiktiv HTTP-provider. `GET /api/admin/benchmark/cases` returnerer `liveEnabled:false` ellers, og klienten deaktiverer knappen med forklarende melding.

**Pilottestene er også sperret:** `pilot-regression` og `production-regression` er betalte analyse-/veiledningsforløp og kan ellers omgå benchmark-endepunktet. `/api/analyze-situation` og `/api/generate-guidance` avviser derfor eksplisitte administratortestmoduser med HTTP 503 `PAID_TEST_DISABLED` utenfor samme lokale testmodus; ordinære brukerforespørsler påvirkes ikke av testmodussperren. Serveren bruker nå `req.user.role` – rollen som allerede er verifisert og normalisert ved innlogging – både ved sperre og ved merking av KI-testtrafikk. Den tidligere bruken av `effectiveRole(req.user)` undersøkte feil objektform og kunne medføre manglende testmerking. Dette er rettet på revisjonsgrenen.

**Regresjonsbevis:**
- `tests/test-benchmark-budget.cjs` kontrollerer den faktiske servermodulen: ugyldig/forfalsket budsjett, reservert beløp, parallelle kall på samme/forskjellige kjøringer, budsjettøkning, duplikatpar, nytt run-ID, dagstak, tapskonservativ feilbehandling, estimat over reservasjon og dagsskifte.
- `tests/test-benchmark-live-http.cjs` kjører **ekte Express + OpenAI SDK mot lokal fiktiv KI-provider og lokal Auth/PostgREST**, med reelle HTTP-kall i loopback-only testprosess. Den prøver forfalsket `spentSoFar`, parallelle kall, utløpt budsjett, feilkode 429 og oppgjør etter suksess. **Ingen ekstern provider, nøkkel eller brukerdata benyttes.**
- `tests/test-admin-role-http.cjs` krever at produksjonsmodus nekter både benchmark og betalte pilot-/fulltester. `tests/test-admin-browser.cjs` bruker bare forhåndsmonterte `fetch`-fakes og får eksplisitt `liveEnabled:true` i syntetisk fixtures.

**Presist risikonivå:** Dette er **ikke et hardt dollar-tak** for ekte KI-leverandør. Den konservative reservasjonen er en antakelse; reelt kall kan koste mer. Ledgeren finnes bare i minnet og overlever ikke omstart, flere Render-instanser eller feil mellom providerkall og lokal bokføring. Den gir derfor kun **verifiserbar, lokal testatferd**, ikke produksjonssikker distribusjon, transaksjoner eller varig audit-logg. Produksjonssperren skal ikke fjernes før atomisk, varig per-bruker/per-kjøring-regnskap og providerkostgrenser er implementert og testet separat. Gratis testbankkjøring forblir tilgjengelig.

**Neste steg etter grønt SQL-forslag:** Integrer og test RPC-adapteren mot en isolert Supabase/PostgREST-instans, knytt leverandørens faktiske pris/timeout/retries til regnskapet og dokumenter sikker avviksavklaring og operativ drift. Behold fail-closed i produksjon inntil dette er fullført. Statiske «26/52» og «112» i admin-UI er fortsatt utdatert mot 66/114 og skal tas i egen UX-regresjon.

---

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
| Ordinær Quality Gate | 50 `npm test`-delsteg, Chrome/admin, CSS, 99 browser-paritetscenarier, PostgreSQL/RLS og avhengighetskontroll | Ikke ekte Supabase Auth/PostgREST eller live KI |

**Første komplette grønne modul-/browserkjøring:** [Quality Gate #44758243989](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44758243989), før utvidet server-HTTP-test og senere dokumentasjon. Etterfølgende CI må kontrolleres særskilt på siste commit.

## 3. Kritiske funn og gjenværende risikoer

**Funn A – navnefalsk positiv i testbank B113, rettet på revisjonsgrenen:** `POST /api/admin/benchmark/mock` rapporterte først `ok:false` med `B113 utløser personvernsjekk (name)`. Diagnosetesten kjørte den faktiske delte navnedetektoren og isolerte den feilaktige kandidaten til ordet **«nærmeste»** i «til nærmeste leder har …». Dette er et adjektiv, ikke personnavn. `src/privacy-detector.js` har derfor fått **kun dette ordet** i grammatisk ikke-navn-liste; ingen navneregler eller hardfilter ble deaktivert. Ny `tests/test-benchmark-privacy-signal.cjs` kontrollerer samtlige 114 syntetiske caser og verifiserer eksplisitt at *Knut* fortsatt detekteres som personnavn. Express-integrasjonstesten krever nå at den kostnadsfrie bankkontrollen faktisk returnerer `ok:true` og null problemer. **Endelig grønn CI på siste commit kreves før funnet lukkes.**

**Funn B – historisk usikker kostnadsgrense; nå fail-closed i produksjon:** Den tidligere betalte ruten stolte på klientens `spentSoFar` og reserverte USD 0,05. Dette er nå erstattet med testbar, servereid reservering (USD 0,10 per forsøk) **kun i lokal, simulert testmodus**; den betalte ruten er sperret i produksjon. Den minnebaserte løsningen kan fortsatt ikke garantere et hardt kostnadstak på tvers av flere prosesser/omstarter eller når et reelt providerkall blir dyrere enn reservert. Se tillegget over for kontrollgrense og gjenstående arbeid.

**Funn C – feil historiske caseantall i adminvisning, rettet på revisjonsgrenen:** Tidligere stod «Alle 26 saker / 52 KI-kall» og et faktisk begrensende «Alle 112 saker»-valg mot nå 66 golden- og 114 benchmarkcaser. Knappene og kostnadsanslagene henter nå tellinger fra golden-casebanken, og benchmarkvalg `all` omfatter alle casene som API returnerer. Se tillegg over. **Ingen betalte tester er aktivert i produksjonsmodus.**

## 4. Beslutning og neste arbeidssteg

1. Bekreft siste Quality Gate etter den snevre B113/navnefilterrettelsen. Sørg for at `test-benchmark-privacy-signal` og den faktiske gratis Express-mock-kontrollen forblir automatiske regressjonsporter.
2. Behold de nye dynamiske antalls-/UI-testene som regresjonsport ved utvidelse av benchmark- eller golden-casebanken.
3. Det **atomiske PostgreSQL-forslaget er laget og testet isolert**. Neste krav er en korrekt service-only RPC-adapter, driftbar avviksavklaring, multi-instans-integrasjon og leverandørens reelle kost-/retrybegrensning før betalte tester kan aktiveres i produksjon.
4. Først deretter vurder å isolere betalte benchmarkløp i egen modul. Ekte Supabase Auth/PostgREST og menneskelig faglig vurdering kreves fortsatt separat.

**Status:** Gratis benchmarkbank og deterministisk evaluator er verifisert. Servereid budsjettreservering og faktisk HTTP-providerløp er testet **bare lokalt og syntetisk**. Betalt benchmark og administrativ pilot/fulltest er **blokkert i produksjonsmodus** inntil et varig, distribuert regnskap og reell leverandørkost-/Auth-test er godkjent.
