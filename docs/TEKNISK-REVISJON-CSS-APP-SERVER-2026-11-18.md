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
| `app.js`, fysisk antall linjer | 4 632 | **4 329** (−303) |
| `server.js`, fysisk antall linjer | 2 100 | **2 001** (−99) |
| `!important` i all CSS | 845 før CSS-ryddingen | **694** (−151) |
| Største CSS-innholdsfil | 6 402 linjer | **1 702 linjer** (`styles-responsive.css`) |
| Innholdsmoduler under `styles-core.css` | Én kjempestor fil | **14 mindre, navngitte deler** |
| Deterministiske `npm test`-delsteg | 36 før ny app/server-modularisering | **41 definert** |

Disse tallene beskriver faktisk kildekode og konfigurerte tester på revisjonsgrenen. De betyr **ikke** at samtlige gjenstående `!important` er nødvendige, at de 14 CSS-delene er perfekt funksjonelt isolert, eller at større filer er ferdig refaktorert.

## Uttrekk fra app.js

| Ny fil | Omtrent linjer | Ansvar | Klientavhengighet |
|---|---:|---|---|
| `src/client/guidance-fallback.js` | 188 | Deterministisk lokal reserveveiledning, blant annet fravær og tverrtemadilemma | `analyzeSituation`, `currentSubtopic` og `buildDilemmaUnderstanding` injiseres |
| `src/client/topic-search.js` | 68 | Søketekstnormalisering, aliastabell og ranking av tema/undertema | `topics` sendes inn, ingen DOM |
| `src/client/situation-analysis.js` | 119 | Lokal, forklarbar analyse av fravær, oppmøte og overlappende hensyn | `topics` og aktuell temakontekst sendes inn |

De tidligere funksjonene i `app.js` ble erstattet med små delegatorer, slik at eksisterende kall og brukerflyt er bevart. De nye filene benytter eksplisitte `window.Samtalestotte...`-navnerom, fordi eksisterende frontend er **vanlig JavaScript lastet gjennom script-tagger**, ikke en bundlet ES-module-applikasjon. Ved en framtidig større omskriving ville native ES modules og dependency injection være bedre enn å utvide globale navnerom videre.

**Sikker lastrekkefølge:** `src/client-data.js` og de tre nye hjelpefilene lastes før `app.js`. De er uttrykkelig tillatt i `server.js` sin public asset-liste, er tilgjengelige i lokal sensordemo og inngår i PWA-cache. Testene kontrollerer lastrekkefølge, at API-et for frontendfiler virker og at utilgjengelige interne ressurser fortsatt avvises.

**Ny egenkontroll:** `tests/test-fallback-guidance.cjs`, `tests/test-topic-search-module.cjs`, `tests/test-situation-analysis.cjs`. Testene benytter fiktive situasjoner og er ikke en faglig godkjenning av HR-råd.

## Uttrekk fra server.js

| Ny fil | Omtrent linjer | Ansvar | Kontroll |
|---|---:|---|---|
| `src/server/history-contracts.js` | 36 | Sanitær avgrensning av historikkfelt, simuleringsturer, JSON-deserialisering, konvertering til API-respons | `tests/test-history-contracts.cjs` + eksisterende tobruker-HTTP-test |
| `src/server/source-normalization.js` | 71 | Normalisering av kilde-URL, fjerning av trackingparametre, utledning av verifiserte eksterne kilder og deduplisering | `tests/test-source-normalization.cjs` + eksisterende kildepolicytester |

Rutene for innlogging, tilgangsstyring, database og KI er foreløpig **beholdt i `server.js`**. Å flytte dem uten egen route-/middleware-plan ville være en større sikkerhetsrisiko. Uttrekkene over reduserer kjernefilens ansvar for datatransformasjon samtidig som URL-er og HTTP-kontrakter kan beholdes.

### Hvorfor testene ble endret

Den første CI-kjøringen etter historikkuttrekket fant at en eldre simulator-test fremdeles lette etter teksten `simulation: body.simulation` i **`server.js`**, selv om funksjonen nå lå i den nye historikkmodulen. Testen ble rettet til å bekrefte både importen i serveren og innholdet i modulen. Dette illustrerer en svakhet ved tekstbaserte strukturtester: De kan feile ved **korrekt** refaktorering, eller bestå uten faktisk runtime-verifikasjon. De mer representative HTTP- og nettlesertestene er derfor beholdt.

## CSS: dagens reelle testgrunnlag

CSS-kjernen er delt via ordnede `@import`-kjeder. Modulene er **navngitt etter dominerende ansvar**, men grensene er fremdeles delvis kronologiske for å bevare kaskaderekkefølgen. Det er en mellomfase, ikke bevis på perfekt komponentdesign. Vi har redusert `!important` fra 845 til 694 gjennom fjerning av identiske blokker, fullt overstyrte regler, overflødige enkeltdeklarasjoner og ytterligere 17 deklarasjoner som var overstyrt av senere ubetingede regler.

Den nye `tests/test-css-browser-regression.cjs` starter **to lokale sensordemo-servere**: Én på pinnefestet, tidligere testet referansecommit og én på aktuell revisjonsgren. Den bruker Chrome DevTools Protocol og sammenligner faktisk `getComputedStyle`, pseudo-elementer og elementgeometri i **90 scenarioer** (390, 768, 1440 piksler × lyst/mørkt/hybrid × minimert/utvidet sidemeny × fem sentrale visninger). Portspesifikke bilde-URL-er normaliseres, da de ikke er visuelle forskjeller.

Tidligere grønn test etter siste CSS-rydding: [Quality Gate #44362233570](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44362233570), **CSS-browser parity OK: 90 scenarios**. Denne testen gir klart bedre grunnlag enn et rent søk i CSS-kilden, men dekker **ikke** innloggede visninger med realistisk brukerdata, fysiske touch-interaksjoner, dialogtilstander, reell utskrift eller visuell vurdering av det estetiske uttrykket.

CSS-audit har fortsatt en eksplisitt CI-grense på **694 `!important`**. Det er et **maksimum for ny gjeld**, ikke et kvalitetsmål som sier at 694 er bra.

## Kriterier før videre splitting

1. Beskriv funksjonsansvar og avhengigheter før uttrekk.
2. Behold gjeldende eksport-/HTTP-/UI-kontrakt.
3. Legg til en liten dedikert test for nytt ansvar, i tillegg til relevante eksisterende tester.
4. Gjennomfør full Quality Gate med Chrome-UI-sammenligning og kilde-/personverntester.
5. Dokumenter hva testene beviser og hva som fremdeles krever menneskelig review.
6. Ikke gå videre til `main` uten eksplisitt beslutning og egen gjennomgang av personvern, tilgangskontroll og produksjonsbehov.

## Forelesningsforankring og kritisk vurdering

Arbeidet svarer konkret på forelesningenes fokus på **arkitektur før større endringer**, små verifiserbare stories, avhengighetskontroll, context engineering og **human in the loop**. Vi har ikke skrevet om hele systemet som om BMAD var fulgt fra første dag. Vi dokumenterer i stedet den faktiske, iterative prosessen: Filer vokste, de ble identifisert som teknisk gjeld, ansvar ble trukket ut, første tester avdekket gamle antakelser, og rettelser ble verifisert.

Samtidig gjenstår den sentrale innvendingen: `app.js` på over 4 300 linjer og `server.js` på rundt 2 000 linjer er fremdeles store. Dette er derfor **målbar framgang med gjenværende teknisk gjeld**, ikke ferdig profesjonell arkitektur. Neste beslutning bør bygge på faktisk browser-/runtime-evidens og isolere UI- og API-ansvar som det finnes gode tester for, ikke en ren linjetallmålsetting.

**Bekreftet teknisk test:** [Quality Gate #44364859955](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44364859955) på siste samlede funksjonscommit `5ba80c6f627a863a4868d3c96dc15233875fc7d2` er **SUCCESS** med 41 deterministiske deltester, 90 Chrome-scenarioer og dependency audit uten funn på valgt nivå. Dette er revisjonsgren-test, ikke produksjonssetting. Refleksjonens ordgrense og formkrav i Canvas er fortsatt ikke kontrollert.
