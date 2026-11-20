# Benchmark: deterministisk evaluering, kostnadsgrense og åpne avvik

**Dato:** 20.11.2026  
**Prosjekt:** Samtalestøtte / IBE160, draft PR #12  
**Miljø:** Bare revisjonsgren, syntetiske testdata, ingen Render-deploy, betalte KI-kall eller Supabase-mutasjoner.

## Tillegg 20.11.2026 – serverstyrt lokal budsjettkontroll og fail-closed betalte tester

**Ny servermodul:** `src/server/benchmark-budget.js` har et **synkront, servereid reservasjonsregnskap per Node-prosess**. Den registrerer valgt run-budsjett per administrator-ID/kjøre-ID, avviser parallell kjøring for samme bruker, duplikate case/modell-par, budsjettendring underveis, ugyldig run-ID og ubegrenset forbruk ved nye run-ID-er. Brukerens *dagsramme i én prosess* er USD 5. Før hvert lokalt testsimulerte providerkall reserveres konservativt USD 0,10; faktisk estimat over dette belastes i etterkant, og både mislykkede og uklare provider-/databasetilfeller beholder minst reservasjonen. `spentSoFar` fra nettleseren **brukes ikke lenger** i serverens beslutning.

**Sikker driftsavgrensning:** Betalt `POST /api/admin/benchmark/live` er **sperret med HTTP 503 `BENCHMARK_PAID_DISABLED` i produksjon og normale utviklingsmiljøer**, uavhengig av klientens budsjett. Den nye reserveringsløkken kan kun nås ved `NODE_ENV=test`, eksplisitt `TEST_BENCHMARK_LIVE=1` og gyldig lokal `TEST_FAKE_OPENAI_PORT`. Testen starter Express med `--import tests/support/offline-openai-fetch.mjs`, som blokkerer eksterne nettverkskall og videresender OpenAI SDK-kall til en lokal, fiktiv HTTP-provider. `GET /api/admin/benchmark/cases` returnerer `liveEnabled:false` ellers, og klienten deaktiverer knappen med forklarende melding.

**Pilottestene er også sperret:** `pilot-regression` og `production-regression` er betalte analyse-/veiledningsforløp og kan ellers omgå benchmark-endepunktet. `/api/analyze-situation` og `/api/generate-guidance` avviser derfor eksplisitte administratortestmoduser med HTTP 503 `PAID_TEST_DISABLED` utenfor samme lokale testmodus; ordinære brukerforespørsler påvirkes ikke av testmodussperren. Serveren bruker nå `req.user.role` – rollen som allerede er verifisert og normalisert ved innlogging – både ved sperre og ved merking av KI-testtrafikk. Den tidligere bruken av `effectiveRole(req.user)` undersøkte feil objektform og kunne medføre manglende testmerking. Dette er rettet på revisjonsgrenen.

**Regresjonsbevis:**
- `tests/test-benchmark-budget.cjs` kontrollerer den faktiske servermodulen: ugyldig/forfalsket budsjett, reservert beløp, parallelle kall på samme/forskjellige kjøringer, budsjettøkning, duplikatpar, nytt run-ID, dagstak, tapskonservativ feilbehandling, estimat over reservasjon og dagsskifte.
- `tests/test-benchmark-live-http.cjs` kjører **ekte Express + OpenAI SDK mot lokal fiktiv KI-provider og lokal Auth/PostgREST**, med reelle HTTP-kall i loopback-only testprosess. Den prøver forfalsket `spentSoFar`, parallelle kall, utløpt budsjett, feilkode 429 og oppgjør etter suksess. **Ingen ekstern provider, nøkkel eller brukerdata benyttes.**
- `tests/test-admin-role-http.cjs` krever at produksjonsmodus nekter både benchmark og betalte pilot-/fulltester. `tests/test-admin-browser.cjs` bruker bare forhåndsmonterte `fetch`-fakes og får eksplisitt `liveEnabled:true` i syntetisk fixtures.

**Presist risikonivå:** Dette er **ikke et hardt dollar-tak** for ekte KI-leverandør. Den konservative reservasjonen er en antakelse; reelt kall kan koste mer. Ledgeren finnes bare i minnet og overlever ikke omstart, flere Render-instanser eller feil mellom providerkall og lokal bokføring. Den gir derfor kun **verifiserbar, lokal testatferd**, ikke produksjonssikker distribusjon, transaksjoner eller varig audit-logg. Produksjonssperren skal ikke fjernes før atomisk, varig per-bruker/per-kjøring-regnskap og providerkostgrenser er implementert og testet separat. Gratis testbankkjøring forblir tilgjengelig.

**Neste steg:** Lag et transaksjonelt Supabase/PostgreSQL-regnskap med autorisert tjenestetilgang, serverstyrte reservations-ID-er, idempotens, sperre av samtidige kall på tvers av instanser, feilbehandling og mål på leverandørkostnad. Valider dette på isolert database med fiktive brukere og provider før produksjonsutrulling. Statiske «26/52» og «112» i admin-UI er fortsatt utdatert mot 66/114 og skal tas i egen UX-regresjon.

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

**Funn C – foreldet tekst i adminvisningen:** Frontendteksten oppgir «Alle 26 saker» og «52 KI-kall», mens gjeldende `tests/AI-GOLDEN-CASES.json` har **66** golden-caser; serveren returnerer dette antallet ved full pilotgjennomgang og bekreftelsen teller sakene dynamisk. Benchmarkvalg i HTML er også merket «Alle 112 saker», mens testbanken nå har **114**; dette er ikke reelt «alle». Oppdater statiske tekster og dynamisk casevalg i en egen UI-endring med Chrome-paritets-/kopitester. **Ingen reelle kostnadskall ble gjennomført nå.**

## 4. Beslutning og neste arbeidssteg

1. Bekreft siste Quality Gate etter den snevre B113/navnefilterrettelsen. Sørg for at `test-benchmark-privacy-signal` og den faktiske gratis Express-mock-kontrollen forblir automatiske regressjonsporter.
2. Oppdater feilaktige historiske antall i admin-UI, og la «alle saker» komme fra verifisert API-antall i stedet for en hardkodet verdi.
3. Utvid den **kun lokalt testede** budsjettprototypen til et delt, varig transaksjonelt serverregnskap med kostnadsvurdering, idempotens og audit-spor før noen betalte tester aktiveres i produksjon.
4. Først deretter vurder å isolere betalte benchmarkløp i egen modul. Ekte Supabase Auth/PostgREST og menneskelig faglig vurdering kreves fortsatt separat.

**Status:** Gratis benchmarkbank og deterministisk evaluator er verifisert. Servereid budsjettreservering og faktisk HTTP-providerløp er testet **bare lokalt og syntetisk**. Betalt benchmark og administrativ pilot/fulltest er **blokkert i produksjonsmodus** inntil et varig, distribuert regnskap og reell leverandørkost-/Auth-test er godkjent.
