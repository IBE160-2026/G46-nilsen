# Teknisk arkitekturrevisjon: CSS, app.js og server.js

**Dato:** 18. november 2026  
**Arbeidsgren:** `docs/ibe160-helhetlig-revisjon-20261118`, Pull Request #12 (draft)  
**Omfang:** Faktisk kodekvalitet, modularisering, CSS-kaskade og regresjonsbevis  
**Avgrensning:** Ingen merge med `main`, ingen produksjonsdeploy, ingen endring av LIVE-pilot.

## Hvorfor denne gjennomgangen ble gjort

Faglærer skrev i [Product Brief-tilbakemeldingen](feedback/tilbakemelding-product-brief.md) fra 26. oktober, under kriterium 5 *Kodekvalitet og arkitektur*, at modularisering var begynt, men at `app.js` da var ca. 3 400 linjer og `server.js` ca. 1 600 linjer. Det ble bedt om å dokumentere dette som teknisk gjeld og en videre plan. Filene vokste etterpå: Før denne revisjonsrunden målte vi 4 632 linjer i `app.js` og 2 100 i `server.js`. At dette er vesentlig større enn ved lærerens vurdering, skal ikke skjules.

Det er **ikke** et krav å oppnå en bestemt linjegrense. Målet er ansvarsskille, færre utilsiktede sideeffekter, presise tester og bedre forståelighet. Vi valgte derfor en gradvis **strangler-style**-uttrekking av deterministiske domene-/datatransformasjoner før risikable endringer i UI, auth, KI og database.

## Resultat på revisjonsgrenen

| Mål | Før denne strukturfasen | Etter foreløpig strukturrevisjon |
|---|---:|---:|
| `app.js`, fysisk antall linjer | 4 632 | **4 274** (−358) |
| `server.js`, fysisk antall linjer | 2 100 | **1 844** (−256) |
| `!important` i all CSS | 845 før CSS-ryddingen | **694** (−151) |
| Største CSS-innholdsfil | 6 402 linjer | **1 702 linjer** (`styles-responsive.css`) |
| Innholdsmoduler under `styles-core.css` | Én kjempestor fil | **14 mindre, navngitte deler** |
| Deterministiske `npm test`-delsteg | 36 før ny app/server-modularisering | **43 bestått** |

Disse tallene beskriver faktisk kildekode og konfigurerte tester på revisjonsgrenen. De betyr **ikke** at samtlige gjenstående `!important` er nødvendige, at de 14 CSS-delene er perfekt funksjonelt isolert, eller at større filer er ferdig refaktorert.

## Uttrekk fra app.js

| Ny fil | Omtrent linjer | Ansvar | Klientavhengighet |
|---|---:|---|---|
| `src/client/guidance-fallback.js` | ca. 245 | Deterministisk lokal reserveveiledning **og utvelgelse av oppfølgingsspørsmål** | `analyzeSituation`, `currentSubtopic` og `buildDilemmaUnderstanding` injiseres |
| `src/client/topic-search.js` | 68 | Søketekstnormalisering, aliastabell og ranking av tema/undertema | `topics` sendes inn, ingen DOM |
| `src/client/situation-analysis.js` | 119 | Lokal, forklarbar analyse av fravær, oppmøte og overlappende hensyn | `topics` og aktuell temakontekst sendes inn |

De tidligere funksjonene i `app.js` ble erstattet med små delegatorer, slik at eksisterende kall og brukerflyt er bevart. De nye filene benytter eksplisitte `window.Samtalestotte...`-navnerom, fordi eksisterende frontend er **vanlig JavaScript lastet gjennom script-tagger**, ikke en bundlet ES-module-applikasjon. Ved en framtidig større omskriving ville native ES modules og dependency injection være bedre enn å utvide globale navnerom videre.

**Sikker lastrekkefølge:** `src/client-data.js` og de tre nye hjelpefilene lastes før `app.js`. De er uttrykkelig tillatt i `server.js` sin public asset-liste, er tilgjengelige i lokal sensordemo og inngår i PWA-cache. Testene kontrollerer lastrekkefølge, at API-et for frontendfiler virker og at utilgjengelige interne ressurser fortsatt avvises.

**Ny egenkontroll:** `tests/test-fallback-guidance.cjs`, `tests/test-topic-search-module.cjs`, `tests/test-situation-analysis.cjs`. Testene benytter fiktive situasjoner og er ikke en faglig godkjenning av HR-råd.

### Videreføring 20.11.2026 – admin-dataflyt flyttet fra `app.js`

**Kronologi og mål:** Tallene i tabellen over (**4 274 linjer**) er en historisk måling fra den første strukturfasen. Etter senere funksjonstillegg og formatforbedringer hadde `app.js` **4 354 linjer / 237 462 tegn**. Dette nye uttrekket reduserer den til **4 278 linjer / 230 656 tegn** (**−76 linjer / −6 806 tegn** fra umiddelbart før uttrekket). Endringen flytter ansvar, og gjør derfor ikke hele kodebasen tilsvarende mye mindre.

**Ny fil:** `src/client/admin-data.js` (egen klassisk klientmodul med `window.SamtalestotteAdminData.create()`) huser fem eksisterende funksjoner: `loadAdminUsers`, `loadAdminFeedback`, `loadAdminAiSettings`, `loadAdminAiUsage`, `formatUsd`. Innholdet er *DOM-/API-koblet*, ikke en ren domenemodul. Modulens `create({ document, fetch, escapeHtml, getCurrentUser })` synliggjør avhengighetene og lar autentiseringsrollen leses for hvert kall (i stedet for å fryse rollen ved oppstart). `app.js` beholder adminnavigasjon, innholdsredigering, benchmarking og hendelsesregistrering samt rollebeskyttet Express-server uendret.

**Kobling og cache:** `index.html` laster den nye filen før `app.js` (query-versjon `20.11.70`), både `server.js` og sensordemo eksponerer den eksplisitt, og PWA `sw.js` har den i offline-skallet med nytt cachenavn. Ingen annen serverfil blir offentlig tilgjengelig av den grunn.

**Kvalitet:** `tests/test-admin-client-runtime.cjs` kjører *selve modulen* i Node VM med injiserte fiktive svar og tester roller, escaping, rolleendring med HTTP 403, KI-statistikk og endring av aktiv rolle i samme modulinstans. Egen `tests/test-admin-browser.cjs` kjører ekte DOM- og event-interaksjon i headless Chrome med tre syntetiske rolleprofiler. `tests/test-admin-role-http.cjs` prøver den reelle Express-autorisasjonen med lokal Auth-fake; `test-ui-regression`, `test-public-assets` og `test-pwa` verifiserer modulrekkefølge og offentlig tilgjengelighet. [Quality Gate #44752528974](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44752528974) er **SUCCESS** på første komplette modulimplementering; senere dokumentasjons- og dynamisk-rolletestcommiter krever egen grønn CI.

**Begrensning og videre arbeid:** Resterende `app.js` inneholder fortsatt mye auth, innholdsredigering, simulering og benchmark. Om disse delene flyttes, må de ha egne runtime-/Chrome- og HTTP-regresjonstester før uttrekk. Ingen produksjonsmerge eller deploy er gjort, og LIVE-piloten er urørt.

### Videreføring 20.11.2026 – redigerbart innhold som separat klientansvar

**Ny fil:** `src/client/admin-content.js` (ca. 105 fysiske linjer) eier rendring av redigerbare tekstfelt, dirty-/unsaved-tilstand, klientkontroll av redaktør-/administratorrollen, lagringskall og statusmeldinger. `app.js` injiserer `document`, `fetch`, `escapeHtml`, `allContentSections`, `contentValue`, `defaultContentValue`, `persistContentOverrides` og `getCurrentUser`. Innholdskatalogen, `contentOverrides`, den generelle `GET /api/content`, dialog-/reload-eventene og serverens tilgangskontroll er beholdt i eksisterende ansvar. Uthenting av aktiv rolle skjer ved hver redigerings-/lagringshandling.

**Presise mål:** I dette trinnet ble `app.js` redusert fra **230 656 til 229 082 tegn** (−1 574), men økte fra **4 278 til 4 284 fysiske linjer** (+6) på grunn av tydelig factory-kobling. Å rapportere dette som en netto linjereduksjon ville vært misvisende. Hensikten er testbar kapsling av tilstand og mindre tett sammenkobling, ikke bare færre linjer.

**Egen regresjon:** `tests/test-admin-content-runtime.cjs` prøver rendring/HTML-escaping, markering og tilbakestilling av ulagrede endringer, vellykket `PUT /api/admin/content`, 403/503/nettverksfeil, retry og rolleveksling. `tests/test-admin-browser.cjs` tester nå også redaktør og administrator som bruker faktisk innholds-`textarea`, lagringsbekreftelse, en avvist lagring og valg om å forkaste ulagrede endringer. `tests/test-admin-role-http.cjs` prøver den **ekte Express-ruten**, med syntetisk Auth/PostgREST-fake, og verifiserer autorisert redaktør-/admin-upsert, avvisning av uvedkommende, feltnavnfilter, 20 000 tegn-grense og feil ved manglende innholdstabell. Dette er ikke ekte Supabase-persistens.

**Infrastruktur:** `index.html` laster `src/client/admin-content.js` før `app.js`, produksjonsserverens assetliste og lokal sensordemo er oppdatert, PWA-cache er løftet til `20.11.71` og asset-/PWA-/lastrekkefølge-/syntakstester kontrollert. `npm test` inneholder nå **46 delsteg**. Benchmark og KI-kostnadstriggende handlinger er ikke berørt.

**Begrensninger:** Nettleseren bruker fiktive roller og API-svar; faktisk Supabase Auth/PostgREST, databasepersistens, mobile touch-interaksjoner, fysisk utskrift og faglig vurdering av KI-råd er ikke dekket av dette uttrekket. `main`, Render, live Supabase og LIVE-pilot er urørt.

### Videreføring 20.11.2026 – kostnadsfri benchmarkevaluering

**Ny klientmodul:** `src/client/benchmark-evaluation.js` isolerer `selectCases(config,count)` og `evaluateOpening(testCase,guidance)`, uten DOM, `fetch` eller KI-klient. `app.js` beholder tynne delegatorer for eksisterende kall. Ved delutvalg benyttes representativ rundgang mellom temaer; ved utvalg av hele banken beholdes opprinnelig rekkefølge. Manglende forventede fraser gir fortsatt myk merknad for menneskelig vurdering fremfor automatisk feil.

**Målt:** `app.js` **4 284 → 4 256 linjer**, **229 082 → 227 324 tegn**, en avgrenset reduksjon på 28 linjer / 1 758 tegn. Den 39-linjers klientmodulen øker det samlede filantallet, men gir mer presis testbarhet. `index.html`, produksjonsserverens asset-allowlist, sensordemo og PWA-shell (cache `20.11.72`) er oppdatert.

**Bevis:** `tests/test-benchmark-evaluation.cjs` kjører modulen med nettverks-/DOM-feller. `tests/test-admin-browser.cjs` prøver kansellert betalt kjøring, kostnadsfri mock og fiktiv positiv benchmark/pilot i ekte Chrome der analyse-, veilednings- og live-benchmark-endepunktene alltid er mock-et. `tests/test-admin-role-http.cjs` prøver kostnadsfritt `POST /api/admin/benchmark/mock` i ekte Express med lokale syntetiske roller og uten KI-konfigurasjon. Ny `tests/test-benchmark-privacy-signal.cjs` prøver navnefilteret mot alle 114 caser. **48 deterministiske npm-teststeg** er etablert. CSS- og PostgreSQL/RLS-kontrollene beholdes.

**Funn:** B113 trigget feilaktig personnavn på adjektivet «nærmeste»; den delte navnedetektoren er snevert rettet uten å endre navnereglene for faktiske navn. Dette var det opprinnelige funnet; **nå** ignorerer en testmodus-beskyttet serversperre `spentSoFar`. Et distribuert, varig budsjettak mangler fortsatt, og betalte kjøringer er sperret i produksjon. Admin-HTML har også foreldede 26/52- og 112-tall mot dagens banker på 66 golden- og 114 benchmark-caser. Ingen betalte providerkall er kjørt eller flyttet. Se [egen benchmark-/kostnadsrapport](ai/BENCHMARK-KOSTNAD-OG-KVALITET-2026-11-20.md). Reell KI-akseptanse og faglig vurdering gjenstår.

### Videreføring 20.11.2026 – servereid budsjettprototyp uten betalte KI-kall

**Ny modul:** `src/server/benchmark-budget.js` fører et konservativt in-memory regnskap per verifisert bruker, kjøre-ID og kalenderdag, med USD 0,10 forhåndsreserve, maksimal USD 5 per bruker/dag i samme Node-prosess, anti-replay per case/modell, sperre mot parallelle kall og oppgjør i `finally` også ved provider-/lagringsfeil. Klientens `spentSoFar` ignoreres. Ekte providerkostnader er **ikke** bundet av reservasjonen, og loggen er ikke delt eller varig.

**Fail-closed driftsgrense:** `/api/admin/benchmark/live` avviser vanlig produksjon og utvikling med HTTP 503 `BENCHMARK_PAID_DISABLED`. Bare `NODE_ENV=test` + eksplisitt `TEST_BENCHMARK_LIVE=1` + lokal fake-provider-port lar testen bruke ruten. `GET /api/admin/benchmark/cases` annonserer `liveEnabled`, og admin-KI-knappen er deaktivert ellers. Administrasjonens pilot- og fulltester sperres i `/api/analyze-situation` og `/api/generate-guidance` med `PAID_TEST_DISABLED` når testmodus ikke er aktiv; vanlige samtaler er ikke blokkert av denne endringen.

**Rolleavvik rettet:** Eksisterende `effectiveRole(req.user)` på pilot-/fulltestmerking undersøkte feil objektform etter at `requireUser` allerede hadde normalisert rollen. Server bruker nå `req.user.role`, slik at administrativ testtrafikk merkes riktig og testspesifikke sperrer virker.

**Reell testgrense:** `tests/test-benchmark-budget.cjs` prøver konkurrerende reservasjoner, klientmanipulasjon, gjenbruk av run-ID, dagsbegrensning og feiloppgjør. `tests/test-benchmark-live-http.cjs` kjører *faktisk* Express/SDK mot en isolert, lokalt lyttende OpenAI-fake og fiktiv Supabase Auth/PostgREST. `tests/test-admin-role-http.cjs` prøver 503 for betalte benchmark-/pilot-/fulltester i produksjonsmodus; `tests/test-admin-browser.cjs` kontrollerer syntetisk klientsynlighet. Testpakken har nå **50** npm-delsteg.

**Åpent:** Redis/PostgreSQL-basert transaksjonelt budsjett for flere instanser og omstarter, leverandørkost-/timeout-sporing og real-world providergrense. Siden dette ikke finnes, **skal betalt benchmark ikke aktiveres i produksjon**. Ingen prod-merge, Render-deploy, Supabase-dataendring eller LIVE-endring.

### Videreføring 20.11.2026 – dynamiske adminantall og komplett caseutvalg

**Rettet konkret brukerfeil:** `index.html` hadde hardkodet «Alle 26 saker / 52 KI-kall» i pilot-/fulltesten og `value="112"` for «Alle 112 saker». Antallene i backendbankene er nå **66** golden- og **114** benchmarkcaser. Det gamle benchmarkvalget kjørte derfor ikke samtlige caser.

**Nå:** `GET /api/admin/pilot-regression/cases?summary=1` (administratorrettigheter via eksisterende `requireAdmin`) leser hele den faktiske golden-casebanken, men returnerer bare `pilotCount`, `fullCount` og `paidRegressionEnabled`; ingen syntetiske scenarietekster trengs i tellekallet. `loadRegressionCounts()` oppdaterer knappeetiketter, forklaring og forventet antall KI-kall (`antall × 2`). `loadBenchmarkConfig()` krever at `totalCases === cases.length`, oppdaterer `<option value="all">` fra aktuell liste og avviser motstridende data. `resolveCaseCount` ligger som en ren hjelper i `src/client/benchmark-evaluation.js`. Knappene starter som `disabled` og åpnes bare ved eksplisitt serverbekreftet test-only tillatelse.

**Bevis:** Unit-test av `all` på en **114-casers** syntetisk bank; ekte headless Chrome-UI med en fiktiv **3-casers** bank og **1 pilot/3 fulltester** sjekker nøyaktig tre simulerte modellkall, etiketter og 2/6 beregnede KI-kall, fulltestbekreftelse og fail-closed ved deaktivert testmodus. Express-HTTP-test sammenligner summary med faktisk JSON-bank, avviser andre roller, og frontendstrukturtest stopper reintroduksjon av `value="112"`. PWA-cache **20.11.73**. Ingen ekte KI-kall.

**Arkitekturbetraktning:** `app.js` ble noe lengre fordi innlasting og feilbehandling er formatert lesbart; det er tilsiktet og ikke framstilt som en ren linjereduksjon. Et eget adminpresentasjonsmodul kan vurderes senere hvis det gjør ansvarsgrensene tydeligere, men ikke som en kosmetisk linjetallsøvelse. Betalte tester er fortsatt blokkert i produksjonsmodus.

### Videreføring 20.11.2026 – isolert PostgreSQL-forslag for atomisk benchmark-regnskap

**SQL-forslag, ikke migrert i produksjon:** `database/security/benchmark-budget-postgres-proposal.sql` oppretter private, RLS-beskyttede `budget_owners`, `budget_days`, `budget_runs` og `budget_attempts`. Eksplisitte rettigheter begrenser både tabeller og `public.benchmark_budget_reserve/settle` (`SECURITY INVOKER`, aldri `SECURITY DEFINER`) til backend-`service_role`. Eiers radlås serialiserer alle transaksjoner for én bruker på tvers av uavhengige PostgreSQL-tilkoblinger. Run-budsjett og dagskvote kan ikke resettes via ny kjøre-ID eller klientens forbrukstall; duplikater og uavklarte forsøk blir stående.

**Ekte PostgreSQL 17-CI:** `tests/sql/benchmark-budget-postgres.sql` verifiserer SQL-grants/denied calls, RLS, transaksjonelle reserveringer, oppgjør, duplikater, feilutfall, kostnad over reserve og at andre brukere ikke kan gjøre opp hverandres tickets. `tests/sql/benchmark-budget-concurrency.sh` lar to databaseprosesser konkurrere om samme bruker og krever nøyaktig én reservasjon. GitHub Actions **restarter faktisk den isolerte databasecontaineren**, før `tests/sql/benchmark-budget-postgres-restart.sql` verifiserer at en uavklart reservasjon fortsatt blokkerer, må avklares eksplisitt og aldri refunderes uten kostnadsbevis. En 500-cent dagskvote testes med 50 syntetiske forsøk. Forslagets idempotente påføring testes to ganger.

**Avgrensning:** Node/Express bruker fremdeles in-memory-konto **kun i isolert testmodus**. SQL-funksjonene er **ikke** aktivert som Supabase-RPC på virkelig prosjekt, og integrasjon hos flere faktiske Render-instanser eller hard leverandørkostgrense er ikke verifisert. Betalte tester forblir deaktivert. Se [utvidet design og kontroll](ai/BENCHMARK-POSTGRES-LEDGER-2026-11-20.md).

### Videreføring 20.11.2026 – test-only Supabase RPC til ekte disponibel PostgreSQL

**Eget adapteransvar:** `src/server/benchmark-budget-rpc.js` bruker injisert Supabase RPC, validerer innlogget UUID, kjøre-ID, modell, case og budsjett (heltallscent), kjenner bare eksplisitte SQL-avvisningskoder og feiler lukket ved ukjent svar/nettverksfeil. `server.js` bruker `supabaseAdmin.rpc` bare med serverens verifiserte `req.user.id`; browserens `spentSoFar` ignoreres. Bare `NODE_ENV=test` med `TEST_BENCHMARK_LIVE=1`, lokal `SUPABASE_URL`, `TEST_FAKE_OPENAI_PORT` og `TEST_BENCHMARK_LEDGER=rpc` kan aktivere denne banen. OpenAI- og OpenRouter-klienten tvinges da til loopback. **Produksjon fortsatt fail-closed.**

**Ny svarrekkefølge:** Ingen betalt testprovider kan kalles ved feilet/ukjent reservasjon. Serveren venter også på oppgjøret før suksess/feil sendes til klienten. Ukjent oppgjør gir `503 BENCHMARK_SETTLEMENT_UNCONFIRMED`; mulig påløpt kostnad holdes i uavklart ticket. Resultatlagringsfeil gjøres opp som `uncertain`, providerfeil som `failed`, full suksess som `success`. Dette er fortsatt bare simulert providerflyt.

**Ekte fullkjede-test:** `tests/test-benchmark-rpc-http.cjs` kjører faktisk Express + Supabase JS RPC + OpenAI SDK. I npm-test brukes lokal fake PostgREST og lokal fake AI; i CI-PostgreSQL-jobben brukes **samme** lokale PostgREST-formatbro, men RPC utføres av den faktiske, midlertidige PostgreSQL-databasen gjennom `docker exec psql` som `service_role`. Tester reserver/AI/lagre/gjør opp-sekvens, parallelle forespørsler, duplikat, RPC-feil før provider, provider-429, resultatlagringsfeil og manglende oppgjørsbekreftelse. `tests/test-benchmark-budget-rpc.cjs` dekker isolert RPC-kontrakt og feil. **52 deterministiske npm-delsteg**, pluss Chrome/CSS, og ytterligere faktiske PostgreSQL-integrasjonstester.

**Reell feil funnet og rettet:** SQL-funksjonen opprettet `budget_runs` før `BUDGET_RUN_BUSY`, slik at avvisning etterlot en «spøkelseskjøring». Den oppretter nå ny `budget_runs` først *etter* alle avvisningskontroller. Ny SQL-regresjon krever at avvist kall mot ny kjøre-ID ikke etterlater en rad. Selve SQL-forslaget er **ikke** anvendt mot ekte Supabase. Se [presis status](ai/BENCHMARK-RPC-INTEGRASJON-2026-11-20.md).

## Uttrekk fra server.js

| Ny fil | Omtrent linjer | Ansvar | Kontroll |
|---|---:|---|---|
| `src/server/history-contracts.js` | 36 | Sanitær avgrensning av historikkfelt, simuleringsturer, JSON-deserialisering, konvertering til API-respons | `tests/test-history-contracts.cjs` + eksisterende tobruker-HTTP-test |
| `src/server/source-normalization.js` | 71 | Normalisering av kilde-URL, fjerning av trackingparametre, utledning av verifiserte eksterne kilder og deduplisering | `tests/test-source-normalization.cjs` + eksisterende kildepolicytester |
| `src/server/help-library.js` | ca. 103 | Kategorisering av Hjelp-kildebank uten Express og datahenting | `tests/test-help-library.cjs`, også for yrkesnivå og duplikatkontroll |
| `src/server/source-ranking.js` | ca. 93 | Eksisterende kildeutvelgelses-/rangeringsalgoritme med eksplisitte avhengigheter | `tests/test-source-ranking.cjs` og kildepolicytester |

Rutene for innlogging, tilgangsstyring, database og KI er foreløpig **beholdt i `server.js`**. Å flytte dem uten egen route-/middleware-plan ville være en større sikkerhetsrisiko. Uttrekkene over reduserer kjernefilens ansvar for datatransformasjon samtidig som URL-er og HTTP-kontrakter kan beholdes.

### Hvorfor testene ble endret

Den første CI-kjøringen etter historikkuttrekket fant at en eldre simulator-test fremdeles lette etter teksten `simulation: body.simulation` i **`server.js`**, selv om funksjonen nå lå i den nye historikkmodulen. Testen ble rettet til å bekrefte både importen i serveren og innholdet i modulen. Dette illustrerer en svakhet ved tekstbaserte strukturtester: De kan feile ved **korrekt** refaktorering, eller bestå uten faktisk runtime-verifikasjon. De mer representative HTTP- og nettlesertestene er derfor beholdt.

## CSS: dagens reelle testgrunnlag

CSS-kjernen er delt via ordnede `@import`-kjeder. Modulene er **navngitt etter dominerende ansvar**, men grensene er fremdeles delvis kronologiske for å bevare kaskaderekkefølgen. Det er en mellomfase, ikke bevis på perfekt komponentdesign. Vi har redusert `!important` fra 845 til 694 gjennom fjerning av identiske blokker, fullt overstyrte regler, overflødige enkeltdeklarasjoner og ytterligere 17 deklarasjoner som var overstyrt av senere ubetingede regler.

Den nye `tests/test-css-browser-regression.cjs` starter **to lokale sensordemo-servere**: Én på pinnefestet, tidligere testet referansecommit og én på aktuell revisjonsgren. Den bruker Chrome DevTools Protocol og sammenligner faktisk `getComputedStyle`, pseudo-elementer og elementgeometri i **99 scenarier**: 90 standardtilstander (390/768/1440 piksler × tre temaer × to sidemenytilstander × fem visninger), 6 tilfeller med `@media print` og 3 med åpne `details` i hjelpeseksjonen. Portspesifikke bilde-URL-er normaliseres, da de ikke er visuelle forskjeller. Print-media i Chrome er **ikke** verifikasjon av en fysisk utskrift eller PDF-layout.

Tidligere grønn test etter siste CSS-rydding: [Quality Gate #44362233570](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44362233570), **CSS-browser parity OK: 90 scenarios**. Denne testen gir klart bedre grunnlag enn et rent søk i CSS-kilden, men dekker **ikke** innloggede visninger med realistisk brukerdata, fysiske touch-interaksjoner, dialogtilstander, reell utskrift eller visuell vurdering av det estetiske uttrykket.

CSS-audit har fortsatt en eksplisitt CI-grense på **694 `!important`**. Det er et **maksimum for ny gjeld**, ikke et kvalitetsmål som sier at 694 er bra.

### Teknisk gjeld som fremdeles er målbar

Ny statisk stilkontroll viser **59 linjer over 280 tegn, 21 over 600 tegn og 9 over 1 000 tegn i `app.js`**. Flere er komprimerte admin-funksjoner for brukere, KI-forbruk, tilbakemeldinger og benchmarking. I `server.js` finnes 33 linjer over 280 tegn, men flere av de lengste er bevisst lange KI-instruksjonsstrenger. Å presse all kode sammen på én linje reduserer ikke kompleksitet; den administrative koden trenger fremtidig, funksjonsvis formatering og ansvarsdeling med egne UI-/rollebaserte tester før den flyttes.

**Ikke gjør følgende uten bedre testgrunnlag:** Flytt Auth-/admin-ruter, oppdater kildeprioritet uten faktiske faglige caser, slett mange CSS-overstyringer eller erstatt store KI-promptblokker bare for å få ned linjetall. Størrelse er sekundært til korrekt oppførsel og sporbarhet.

## Kriterier før videre splitting

1. Beskriv funksjonsansvar og avhengigheter før uttrekk.
2. Behold gjeldende eksport-/HTTP-/UI-kontrakt.
3. Legg til en liten dedikert test for nytt ansvar, i tillegg til relevante eksisterende tester.
4. Gjennomfør full Quality Gate med Chrome-UI-sammenligning og kilde-/personverntester.
5. Dokumenter hva testene beviser og hva som fremdeles krever menneskelig review.
6. Ikke gå videre til `main` uten eksplisitt beslutning og egen gjennomgang av personvern, tilgangskontroll og produksjonsbehov.

## Forelesningsforankring og kritisk vurdering

Arbeidet svarer konkret på forelesningenes fokus på **arkitektur før større endringer**, små verifiserbare stories, avhengighetskontroll, context engineering og **human in the loop**. Vi har ikke skrevet om hele systemet som om BMAD var fulgt fra første dag. Vi dokumenterer i stedet den faktiske, iterative prosessen: Filer vokste, de ble identifisert som teknisk gjeld, ansvar ble trukket ut, første tester avdekket gamle antakelser, og rettelser ble verifisert.

Samtidig gjenstår den sentrale innvendingen: `app.js` på **4 274 linjer** og `server.js` på **1 844 linjer** er fremdeles store. Dette er derfor **målbar framgang med gjenværende teknisk gjeld**, ikke ferdig profesjonell arkitektur. Neste beslutning bør bygge på faktisk browser-/runtime-evidens og isolere UI- og API-ansvar som det finnes gode tester for, ikke en ren linjetallmålsetting.

**Nyeste bekreftede tekniske test:** [GitHub Actions #44402558539](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44402558539) på commit `70118fbc23fca83a84fb2c96523fabd55228cce8` er **SUCCESS** med 43 deterministiske deltester, 99 Chrome-scenarioer og dependency audit uten funn på valgt nivå. Dette er revisjonsgren-test, ikke produksjonssetting. Refleksjonens ordgrense og formkrav i Canvas er fortsatt ikke kontrollert.


---

## Oppfølgingskontroll 25.11.2026 – kildekode vurdert mot IBE160s kodekvalitetskriterium

Denne kontrollen er en **målrettet, statisk gjennomgang** av gjeldende `main`, ikke en full kode- eller sikkerhetsrevisjon. Det historiske arbeidet på revisjonsgren ovenfor er beholdt uendret. Sensorveiledningen vurderer forståelig arkitektur, duplisering, død kode, konsistent stil, konfigurering og sporbar håndtering av KI-genererte feil.

- **Størrelse:** `app.js` har omtrent **4 598 linjer**, `server.js` omtrent **2 029**. Store filer er en vedlikeholdsrisiko, men linjetall alene er ikke et avvik. Deler er allerede trukket ut i egne moduler. Unngå omfattende ombygging uten målbare akseptansekriterier og tilhørende nettleser-/API-regresjon.
- **Faktiske koblingspunkter:** De to API-rutene `/api/generate-guidance` (ca. linje 1605) og `/api/continue-conversation` (ca. linje 1796) gjentar flere steg ved kildekontekst, yrkes-/sektorruting og synlig kildevalg. Det er en **kandidat for senere kontrollert moduluttrekk**, ikke en bekreftet funksjonsfeil. Kildepolicy, proveniens og arbeidsrettslige avgrensninger gjør en rask sammenslåing risikabel.
- **Kontrollert funn og rettelse:** `renderSuggestion` og `renderSubtopicSuggestion` i `app.js` satte tidligere enkelte tema-/undertemafelter direkte inn i `innerHTML`, i motsetning til andre visninger som brukte `escapeHtml`. Tekstene kan komme fra innholds-/temadata; sikkerhet og konsekvent rendering tilsier escaping før HTML-innsetting. Dette er nå rettet uten å endre temarankering. `tests/test-ui-regression.cjs` har fått en avgrenset **kildetekstbasert** regresjonskontroll som hindrer tilbakefall til direkte interpolering i disse to funksjonene. Testen bekrefter **ikke** en full dynamisk XSS-test i nettleser.
- **CSS:** `styles-responsive.css` og `styles-overrides.css` inneholder fortsatt mange `!important`. Den eksisterende `npm run audit:css -- --enforce-budget` og Chrome-paritetskontrollen gir viktige bevis. Ingen ny stor CSS-sletting ble gjort her: et kortere stilark er ikke i seg selv bevis på samme visuelle resultat.
- **Avgrensning:** Denne gjennomgangen har ikke kjørt sensordemo fra en ny lokal klon, ikke gjennomgått alle DOM-innsettingspunkter med nettleserfuzzing, og ikke verifisert produksjonstrafikk eller hele Git-historikken for lekkede hemmeligheter. Disse forholdene skal ikke omtales som bestått bare fordi CI er grønn.

**Relevante bevis:** `app.js`, `server.js`, `tests/test-ui-regression.cjs`, `scripts/audit-css.cjs`, [Quality Gate på main](https://github.com/IBE160-2026/G46-nilsen/actions) og øvrige daterte testnotater. Endringen gjelder bare ett konkret UI-escapingavvik; ingen påstand om at all teknisk gjeld er eliminert.


## Oppfølgingskontroll 25.11.2026 – målrettet fjerning av ubrukt klientkode

**Hypotese:** Eldre funksjoner fra ombyggingen av kilde- og temavisningen kan ligge igjen i den store `app.js` uten å være i bruk. Slike rester gir unødig navigasjon og vedlikeholdsrisiko, men skal ikke slettes uten kontroll av kallested og testavhengigheter.

**Kontroll:** Telt navneforekomster i `app.js`; kontrollert de aktuelle navnene mot `index.html` og relevante UI-/kilde-/admin- og nettlesertester. Fant én forekomst (deklarasjonen) for `openGuidanceFromSuggestion`, `loadHelpSectorSummary`, `loadHelpSourceLibrary` og `allContentFields`. Eldre `helpSourceLibraryLoaded` ble bare brukt i den ubrukte lasteren. Den faktiske hjelpesiden kaller `loadCompleteSourceLibrary` fra `showView('help')`, og den ble beholdt. `filterTopicCards` og `filterSubtopicCards` ble også undersøkt, men ble **ikke fjernet**, ettersom eksisterende testkode bruker dem som avgrensningsmarkører; ikke kall alle sjeldne funksjoner «død kode» uten å undersøke bruken.

**Utført:** De fire ubrukte funksjonene og tilhørende ubrukte tilstandsvariabel ble fjernet fra `app.js` i commit `a03fe415`. Netto reduksjon **65 linjer** (4 600 → 4 535). Ingen bevisst endring i aktiv visning, tema-/kilderuting, KI-oppsett eller CSS.

**Verifikasjon:** [Quality Gate for kodeendringen](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45699153331). Ikke påstå grønn status før alle jobbene er avsluttet; statisk kallestedskontroll alene er ikke et fullt bevis på at ingen dynamiske avhengigheter finnes. Dette er et lite vedlikeholdstiltak, **ikke** en fullført monolittrefaktorering eller sikkerhetsrevisjon.


## Oppfølging 25.11.2026 – felles kildekandidatpipeline i server

**Problem:** `/api/generate-guidance` og `/api/continue-conversation` gjentok fire trinn for kildekandidater: generelt kildesøk, sammenslåing med yrkes-/tariffkontekst, beslutning om kuraterte kilder trengs, og filtrering mot historisk gyldighet. Dette økte risikoen for utilsiktet ulikhet ved senere endringer.

**Gjennomført:** Commit `fa0d4fd4` samler **bare** disse trinnene i `scopedGuidanceSources` i `server.js`. Rutene beholder sine egne vurderinger av opprinnelig spørsmål versus ny oppfølging, historisk kildebehov, yrkeskontekst, lovkilder som automatisk foreslås, KI-instruksjoner, kildenes proveniens og juridisk påstandskontroll. Det er bevisst **ikke** gjort en bred sammenslåing av de to API-endepunktene.

**Kontroller:** `tests/test-source-retention.cjs` har fått en kjørbar, isolert kontroll av den faktiske hjelpefunksjonen mot `shouldRetainCuratedSources`, med både ordinær samtalesak og sikkerhetssak, historisk filtrering, felles tidspunkt og to kallesteder. `tests/test-source-provenance-http.cjs`, `tests/test-source-acceptance-routing.cjs` og øvrig Quality Gate fungerer som eksisterende integrasjons- og kontraktstester. Den første utgaven av tilleggstesten hadde en **egen ugyldig regex** og ble korrigert til eksplisitt strengbasert kontroll i commit `54187f3d`. Dette var en feil i testkoden, ikke et påvist avvik i kildelogikken. [Kjøring etter siste testrettelse](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45700707839) må være fullført før resultatet omtales som bestått.

**Begrensning:** Automatisk kildeutvalg og proveniensregler er ikke det samme som uavhengig juridisk kontroll av et konkret KI-svar. Refaktoreringen har ingen tilsiktet brukergrensesnitt- eller produksjonsdeployeffekt.


## Oppfølging 25.11.2026 – serverfeilhåndtering uten ubrukte feilsøkevariabler

**Funn:** Analyseruten opprettet `code`, `type`, `rawMessage` og en `hint` for API-nøkkel-/modelfeil, men ingen av verdiene ble brukt i JSON-responsen, loggen eller annen flyt. Hovedveiledning og oppfølgingsdialog opprettet tilsvarende `code`/`rawMessage` uten å bruke dem.

**Rettet:** Commit `7306fdd1` fjerner **14 linjer** ubrukte lokale variabler og ikke-eksponerte hint. De opprinnelige `console.error`-loggene, HTTP-statusberegningen, de offentlige feilkodene og de generiske klientmeldingene er uendret. Dette er ikke en endring av hvordan API-nøkkelfeil, ugyldig KI-JSON eller feil fra ekstern leverandør behandles.

**Eksisterende regresjonsbevis:** `tests/test-ai-provider-errors-http.cjs` tester HTTP 429/503, ugyldige svar, frakobling og at interne leverandørmeldinger ikke lekker til klienten. [Quality Gate etter rettingen](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45701412775) er autoritativ for testresultat; ikke merk grønt før jobbene er avsluttet.

**Begrensning:** Dette rydder bare bekreftet ubrukte variabler i tre feilstier, ikke alle gjentatte svarmønstre eller hele loggingen. En generell omlegging av statusnormalisering kan gjøres senere med eksplisitte negative API-tester for hver rute.


## Oppfølging 25.11.2026 – personvern i KI-feillogging

**Risiko funnet:** Sju brukervendte KI-ruter logget tidligere hele feilen fra SDK/provider, eksempelvis `console.error('OpenAI ... failed:', error)`. Eksterne feilobjekter kan inneholde HTTP-request-/response-data, rå fritekst, headers eller andre detaljer. Selv om JSON-feilsvaret til brukeren var nøytralt, var slik logging et unødvendig potensielt eksponeringspunkt.

**Tiltak:** Commit `b6fc9461` erstatter loggingen i temaklassifisering, situasjonsanalyse, hovedveiledning, oppfølging og tre simulatorruter med `logAiRouteError`. Denne logger bare en fast ruteetikett, normalisert HTTP-status og en kort, formatbegrenset maskinkode. Den logger **ikke** `error.message`, `error.stack` eller hele `error`. Eksisterende HTTP-statusberegning og offentlige responskontrakter er beholdt.

**Regresjon:** `tests/test-ai-provider-errors-http.cjs` har fått en kontroll som utfører faktisk logger-funksjon med et konstruert feilobjekt som inneholder navn, e-post og leverandørdetaljer. Testen krever at dette ikke logges, men at status/kode bevares. I tillegg kontrolleres den isolerte Express-testens stderr mot den simulerte leverandørens hemmelige feilmelding. Commit `77a0208f`. Ingen reelle brukerdata eller eksterne KI-kall benyttes.

**Avgrensning:** Dette er en målrettet utbedring av **de sju KI-rutene**, ikke et bevis på at samtlige logger i server, database-SDK eller produksjonsinfrastruktur er fri for sensitive data. For eksempel skal benchmark- og autentiseringslogger vurderes separat. [Quality Gate](https://github.com/IBE160-2026/G46-nilsen/actions) må fullføres på relevant commit før den kalles grønn.


## Oppfølging 25.11.2026 – autentisering, admin og loggdataminimering

**Funn:** Autentiseringsrutene og enkelte DB-/admin-feilstier logget hele Supabase-feilobjekter, eller `error.message`, som kan inneholde requestdetaljer, e-postadresser eller tokens. Endepunktet `POST /api/admin/pilot-regression/result` logget også `opening`, `issues`, `notes`, modellnavn og fritekstbasert kjøre-ID direkte fra forespørselsinnholdet. Det er ikke tilstrekkelig å påstå at dette alltid er testdata: serveren aksepterer faktisk innsendt tekst.

**Gjort:** Commit `95114f66` innførte `logSafeOperationalError` for utvalgte innloggings-, invitasjons-, passordreset-, innholds-, historikk- og administrasjonsfeil. Loggeren skriver bare et fast område, normalisert status og en kort maskinkode; ingen rå `error` eller `error.message`. Admin-testresultatloggen skriver nå bare forhåndsdefinert testcase, modus, tema, teststatus og antall rapporterte avvik/notater. Commit `cf3433df` fjerner ubrukte variable for fritekstene som ikke lenger skal logges. Eksternt JSON-svar, autentiseringskrav og databaseoperasjoner er ikke tilsiktet endret.

**Ny test:** `tests/test-server-privacy.cjs` utfører den faktiske operasjonelle loggerfunksjonen med et fiktivt feilobjekt som inneholder e-post, passord, token og navn. Den krever at alle disse utelates og at tekniske status-/kodefelt bevares. Den inspiserer også selve admin-resultatloggen og krever at fritekstfelt ikke serialiseres. Commits `72f033fa` og `29a9a9b5`. Ingen reelle identiteter eller nøkler brukes.

**Teststatus:** Se [GitHub Actions på main](https://github.com/IBE160-2026/G46-nilsen/actions) for eksakt commit etter at jobbene er ferdige. Tidligere logging av fritt innhold i benchmark/testresultatene og øvrige SDK-feil skal fortsatt vurderes separat; denne rettelsen er **ikke en full loggrevisjon av hele løsningen**.


## Oppfølging 25.11.2026 – benchmark: leverandørfeil uten råtekst i logger og API

**Funn:** `POST /api/admin/benchmark/live` logget tidligere `error?.message` og det underliggende `error?.error`-objektet fra KI-leverandøren. Det samme endepunktet kunne sende `error.message` tilbake til administrasjonsgrensesnittet ved feil. Selv med admin-tilgang er dette unødvendig eksponering av eksterne, ubetrodde feildetaljer; de kan inneholde opplysninger fra forespørselen.

**Rettet:** Commit `2ef2471d` erstatter råloggingen med den allerede etablerte `logSafeOperationalError('benchmark-provider', error)`. Generiske leverandørfeil bruker nå en fast norsk melding. Den særskilte meldingen for ratebegrenset Gemma Free beholdes, det samme gjør status, `BENCHMARK_FAILED`, case-ID, modell og formatbegrenset maskinkode. Budsjettreservasjon og etterfølgende oppgjør er uendret.

**Test:** Commit `d5c84da2` utvider den isolerte faktiske Express + OpenAI SDK HTTP-testen `tests/test-benchmark-live-http.cjs`. En syntetisk 429-leverandørfeil bærer et fiktivt navn/e-post-/token-liknende signal; testen krever at markørene ikke vises i API-svaret eller serverens stderr. Testen fortsetter også å verifisere at leverandørfeil opptar budsjettreservasjon. [Quality Gate på main](https://github.com/IBE160-2026/G46-nilsen/actions) er fasit for faktisk bestått status; dette notatet innebærer ikke at testen er grønn før kjøringen er ferdig.

**Avgrensning:** Den ordinære benchmark-resultatlagringen inneholder fortsatt modellens genererte tekst som testartefakt og er bare ment for autoriserte administratorer, syntetiske caser og den isolerte testmodusen. Dette er ingen påstand om at alle databaselagre eller telemetriflater er fullstendig undersøkt.
