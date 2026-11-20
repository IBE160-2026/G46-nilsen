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

**Funn:** B113 trigget feilaktig personnavn på adjektivet «nærmeste»; den delte navnedetektoren er snevert rettet uten å endre navnereglene for faktiske navn. Den betalte serverruten baserer løpende kostnad på klientens `spentSoFar`, altså **ikke** et sikkert serverhåndhevet budsjettak. Admin-HTML har også foreldede 26/52- og 112-tall mot dagens banker på 66 golden- og 114 benchmark-caser. Ingen betalte providerkall er kjørt eller flyttet. Se [egen benchmark-/kostnadsrapport](ai/BENCHMARK-KOSTNAD-OG-KVALITET-2026-11-20.md). Reell KI-akseptanse og faglig vurdering gjenstår.

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
