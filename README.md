# Samtalestøtte

**Gjeldende status og veiledning for sensor: [PROSJEKTSTATUS](docs/PROSJEKTSTATUS.md).** `main` inneholder PR #12, #14, #15, #16 (personvern) og #17 (yrkesforslag). Siste verifiserte applikasjonscommit før dokumentasjonsrevisjonen: `61d282dc` (Quality Gate [#45662862335](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45662862335) grønn, Render `live` 25.11.2026 kl. 17:16 UTC). Se [dokumentasjonsrevisjonen](docs/DOKUMENTASJONSREVISJON-2026-11-25.md). LIVE/tale er fortsatt eksperimentelt, og gamle PR-/testavsnitt nedenfor er tidsstemplede historiske øyeblikksbilder.

Samtalestøtte er en KI-basert webapplikasjon utviklet i IBE160 Programmering med KI ved Høgskolen i Molde.

Løsningen skal hjelpe ledere med å forberede og øve på krevende medarbeidersamtaler. Den støtter blant annet strukturering av situasjonen, forslag til åpning og spørsmål, oppfølging i samme kontekst, samtaleøvelse, refleksjon og personvernkontroll før KI-kall.

Samtalestøtte er **ikke** et HR-system, journalsystem eller beslutningsverktøy. KI-en skal støtte lederens vurdering, ikke erstatte lederens ansvar eller relevant fagkompetanse.

## For sensor: test appen uten tilgangsnøkler

Denne korte oppskriften gjør det mulig å kjøre **den lokale, deterministiske sensordemoen** på en ren maskin uten innlogging, API-nøkler eller tilgang til produksjon. Demoen viser den faktiske frontend-arbeidsflyten med **fiktive svar**; den dokumenterer ikke kvaliteten på live KI-råd eller den eksterne innloggingen.

```bash
git clone https://github.com/IBE160-2026/G46-nilsen.git
cd G46-nilsen
# Bruk den publiserte hovedgrenen (main):
git switch main
npm ci
npm run demo
```

Åpne **http://localhost:3000** i nettleseren. Appen viser en lokal «Sensor demo»-bruker. Prøv tema → undertema → beskriv situasjonen → få råd → spør videre → simulering → historikk → slett, samt «Skriv ut råd». Demoen bruker ingen ekte KI-leverandør eller brukerkontoer.

For å kontrollere den samme kildekoden, stopp demoen med Ctrl+C og kjør:

```bash
npm test
npm run audit:submission
```

Den siste kommandoen er en **lokal sporbarhetskontroll**, ikke bekreftelse fra Canvas. Browser-/Supabase-integrasjonstestene i GitHub Actions har egne CI-forutsetninger; beskrivelsene og eksakte bevisene finnes i [innleveringskontrollen](docs/INNLEVERINGSKONTROLL-2026-11-20.md).

**Viktig for faktisk vurdering:** Sensor bruker `main` og README-oppskriften over. Tidligere PR #12–#17 er innlemmet i hovedgrenen; det er ikke nødvendig å hente en eldre PR-gren. Den siste testede og publiserte appversjonen før denne dokumentasjonsendringen var `61d282dc`. Endelig Canvas-frist, rapportformat og studentens personlige godkjenning må fremdeles kontrolleres. **En grønn Quality Gate dokumenterer teknisk teststatus, ikke full juridisk fagakseptanse av KI-råd.**

## Historisk prosjektstatus og testbevis – 20.11.2026

**Dette er en bevart status fra 20. november, ikke dagens beslutning.** PR #12 ble slått sammen senere samme dag, og PR #14 ble også slått sammen. For gjeldende repo-status, se innleveringsstatus datert 25. november.

### Prosjektstatus, testbevis og innleveringsgrense – 20.11.2026

**Leveransestatus:** [Innleveringskontroll 20.11](docs/INNLEVERINGSKONTROLL-2026-11-20.md) er fasit for hva som kan dokumenteres. **PR #12 (125 endrede filer) er draft, og `main` inneholder ikke disse revisjonsendringene.** Leveransegren, Canvas-krav og studentens godkjenning er ikke avklart; ingen merge eller deploy er foretatt. Kjør `npm run audit:submission` for en lokal, offline sjekk. **Ikke oppgi at PR-CI er CI for `main`.**

**Samtalestøtte v20.11.5** er en studentprototype. `main` er produksjonsgrunnlaget; alle forbedringene fra den siste kvalitetsrevisjonen ligger på `docs/ibe160-helhetlig-revisjon-20261118` og **er ikke slått sammen eller deployet til produksjon**. LIVE/tale er fortsatt **kun på en separat pilotgren** (`pilot-ux-v20.11`), ikke en del av produksjonsleveransen. FR-23 (en alternativ direkte tekstinngang) er en annen hypotese enn LIVE/tale.

**Historiske milepæler, ikke gjeldende sluttstatus:** Følgende avsnitt beskriver daterte test- og kodeendringer under PR-revisjonen; tall og uavklarte forhold i hvert avsnitt var status *da det trinnet ble gjennomført*. For nyeste samlede status se [leveransekontrollen](docs/INNLEVERINGSKONTROLL-2026-11-20.md), [kravmatrisen](docs/ai/SENSOR-KJERNEFLYT-E2E-2026-11-20.md) og siste PR-Quality Gate.

**Historisk Quality Gate for adminmodul-uttrekket (før siste E2E-utvidelser):** [GitHub Actions #44752528974](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44752528974) på commit `a3ca6c2557ddfdb3c5e08ddf9f508f6e6c3dffdd` er **SUCCESS**: **45 deterministiske npm-teststeg**, egen Chrome-test av administrasjon for tre roller, 99 Chrome/CSS-paritetsscenarier, faktisk PostgreSQL/RLS-gransking med to fiktive identiteter, avhengighetsaudit og golden-opptelling. Dette gjelder **bare revisjonsgrenen**, er **ikke** live KI-evaluering og erstatter ikke ekte Supabase Auth/PostgREST-akseptanse.

**Ny faktisk lokal Auth/PostgREST-kontroll (20.11, draft PR #12):** [Quality Gate #44788004299](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44788004299) er **SUCCESS i tre jobber**, inkludert ekte lokal Supabase GoTrue + PostgREST + PostgreSQL med **to testbrukere og én testadministrator**. Serverens passordinnlogging, access/refresh-sesjon, `app_metadata`-basert adminrolle og eierbasert RLS for historikk fungerer i dette miljøet. Forsøk på å lese, endre, slette og feilaktig tilordne andres historikk blokkeres også ved **direkte PostgREST-kall**. Local Supabase CLI er fastlåst til v2.122.1 og kan bare testes på loopback; ingen live Supabase, ansatte, Render eller KI-leverandører er kontaktet. Se [Auth-/RLS-bevis og presise begrensninger](docs/ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md). **Hosted test-/produksjonskonfigurasjon og øvrige Auth-kanttilfeller er fortsatt ikke godkjent.** Dette erstatter ikke fysisk mobil-/utskriftstest eller faglig KI-vurdering.

**Mobil- og utskriftstest (20.11, draft PR #12):** Ny [Chrome-test](tests/test-mobile-print-browser.cjs) kjører **`mobile:true` med touch-hendelser**, tester 320/390/768 px uten horisontal side-overflyt og navigerer med finger-emulering til tema og undertema. Appens reelle «Skriv ut råd»-HTML rendres av Chromium til **en 2-siders PDF**, og `pdfinfo`/`pdftotext` bekrefter at hovedråd, situasjon og «Videre råd» faktisk er lesbar PDF-tekst. [Quality Gate #44794218055](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44794218055) bestod alle **tre jobber**. Dette er **ikke** en fysisk Android-/papirutskriftstest. [Samlet mobil-, print- og refleksjonskontroll](docs/ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md) skiller testbevis fra resterende manuell kontroll. Refleksjonsrapportutkastet er revidert, **ikke** ferdig innlevert eller avstemt mot Canvas-formalia.

**CSS-status:** [CSS-revisjonen](docs/CSS-REVISJON-2026-11-18.md) dokumenterer **845 → 694 `!important`** og at største CSS-fil ble redusert fra **6 402 til 1 702 linjer**, ved kontrollert opprydding og funksjonsnavngitt oppdeling i 14 ordnede moduler. Chrome sammenligner nå også print-media og åpne hjelpedetaljer (totalt 99 scenarier). **Manuell fysisk mobil-, utskrifts- og innlogget UI-review gjenstår.** Maksgrensen på 694 i CSS-auditen er vern mot ny overstyringsgjeld, ikke et tegn på at 694 er ideelt.

**Filene faglærer bemerket:** [Teknisk revisjon](docs/TEKNISK-REVISJON-CSS-APP-SERVER-2026-11-18.md) beskriver først sju testbare uttrekk, som reduserte `app.js` fra **4 632 til 4 274** linjer og `server.js` fra **2 100 til 1 844**. `app.js` vokste senere videre til **4 354** linjer. Et nytt, avgrenset administrasjonsuttrekk 20.11 flyttet fire funksjoner til `src/client/admin-data.js` og reduserte `app.js` fra **4 354 til 4 278** linjer, med eksplisitt injisert `document`, `fetch`, `escapeHtml` og dynamisk innlogget bruker. Funksjonene dekkes av isolerte kjøretidstester, ekte Chrome-adminvisning med fiktive roller og HTTP-autoriseringstester. **Hovedfilene er fremdeles store**, og ekte produksjons-Auth/PostgREST og fysisk UI-review gjenstår; ikke framstill prosjektet som ferdig refaktorert.

**Innholdsredigering (draft, 20.11):** Feltvisning, ulagrete endringer og lagring er skilt ut i `src/client/admin-content.js` med injisert `document`, `fetch`, `escapeHtml`, feltkatalog, lagringscallback og dynamisk rolle. For dette trinnet gikk `app.js` fra **4 278 til 4 284 linjer**, men fra **230 656 til 229 082 tegn**. Et par ekstra linjer for eksplisitt kobling gir altså en kortere hovedfil i tegn, men ikke færre linjer totalt i prosjektet. Modulen gir et tydeligere ansvarsskille, ikke en påstand om redusert samlet kodelengde.

**Kontroller:** Nå **46 deterministiske npm-teststeg** inklusive separat innholdsredigerings-runtime-test. Chrome-testen prøver de faktiske lagrings- og reload-dialogene som redaktør og administrator, og serverens HTTP-test dekker gyldig innhold, ugyldige feltnavn, maks tekstlengde og feil ved manglende tabell med lokale, syntetiske data. De eksisterende CSS-, admin- og PostgreSQL/RLS-testene er beholdt. Se [testbevis](docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md). Ekte Supabase Auth/PostgREST og manuell mobil-/printgjennomgang gjenstår.

**Benchmarkrevisjon (draft, 20.11):** De deterministiske delene – representativt caseutvalg og vurdering av samtaleåpninger – er skilt ut til `src/client/benchmark-evaluation.js` uten nettverk eller KI-kostnader. `app.js` er redusert fra **4 284 til 4 256 linjer**. Totalt er **48** lokale, deterministiske npm-teststeg etablert, inkludert en test av den delte navnedetektoren mot 114 fiktive benchmarkcaser. Den nye Chrome-testen kan kjøre fiktive modellresponsløp med **alle betalte API-endepunkter avskåret**. Personverntreffet i B113 viste seg å være en falsk positiv på ordet «nærmeste», og er snevert rettet. **Viktig:** betalte benchmark- og administratortestkjøringer er nå sperret i produksjonsmodus. Et servereid, minnebasert budsjettregnskap testes bare med lokal fiktiv KI-leverandør; dette er ikke et varig, distribuert eller garantert kostnadstak. Statiske administrasjonstekster har også foreldede caseantall. Se [benchmark- og kostnadsrapport](docs/ai/BENCHMARK-KOSTNAD-OG-KVALITET-2026-11-20.md).

**Kostnadsvern (draft, 20.11):** `src/server/benchmark-budget.js` har en synkron, servereid reservasjonslogg for isolerte provider-tester. `spentSoFar` fra nettleseren ignoreres. `POST /api/admin/benchmark/live` returnerer `BENCHMARK_PAID_DISABLED` utenfor uttrykkelig lokal mock-modus, og administrasjonens pilot-/fulltester returnerer `PAID_TEST_DISABLED`. Normal samtalestøtte påvirkes ikke av denne testmodussperren. To nye tester (`test-benchmark-budget` og `test-benchmark-live-http`) utvider suite til **50 deterministiske npm-steg**. Den siste testen bruker en **lokal** simulert OpenAI-leverandør med ekte Express/SDK, ingen eksterne nettverkskall. Dette er et fail-closed sikkerhetstiltak; **varig atomisk regnskap på tvers av serverinstanser gjenstår** før betalingsflyten kan godkjennes. Se [benchmarkrapport](docs/ai/BENCHMARK-KOSTNAD-OG-KVALITET-2026-11-20.md).

**Dynamiske testantall (draft, 20.11):** Administrasjonens pilot-/fulltestetiketter leses nå fra et adminbeskyttet count-only-endepunkt for den faktiske golden-casebanken. Antall beregnede KI-kall er alltid `antall caser × 2`. «Alle» i benchmark er ikke lenger `112`, men en symbolsk verdi som omfatter **hele** banken (nå 114). Klienten stopper ved motstridende API-tall og holder betalte knapper deaktivert dersom data eller serverens mock-only-tillatelse mangler. Nye HTTP-, funksjons- og Chrome-tester dokumenterer dette, og PWA-cachen er `20.11.73`. **Betalte tester forblir deaktivert i produksjon.** Se [benchmarkrapport](docs/ai/BENCHMARK-KOSTNAD-OG-KVALITET-2026-11-20.md).

**Varig PostgreSQL-budsjett (SQL-forslag i draft PR #12, 20.11):** `database/security/benchmark-budget-postgres-proposal.sql` definerer fire private RLS-beskyttede regnskapstabeller og to `SECURITY INVOKER`-RPC-er med eksplisitt tilgang kun for `service_role`. Reservasjoner og oppgjør er transaksjonelle og persistente; de låses per verifisert bruker og testes med to separate PostgreSQL-sesjoner, en faktisk databaseomstart og syntetiske budsjett-/krasjtilfeller i GitHub Actions. **Dette er et isolert, gjennomgåbart forslag – ikke migrert eller koblet til live Supabase eller Express-produksjon.** Den eksisterende betalte benchmark-/pilot-/fulltestflyten forblir deaktivert utenfor lokal testmodus, og et hardt pristak hos KI-leverandøren er ikke bevist. Se [egen arkitektur- og testrapport](docs/ai/BENCHMARK-POSTGRES-LEDGER-2026-11-20.md).

**RPC-integrasjon (draft PR #12, 20.11):** Ny `src/server/benchmark-budget-rpc.js` kobler serverens benchmark til de private PostgreSQL-funksjonene via `supabaseAdmin.rpc`, **kun i eksplisitt isolert testmodus**. Forespørsler reserveres før KI-kallet, og serveren svarer ikke 200 før oppgjøret er bekreftet. Manglende reservasjon gir 503 uten KI-kall; manglende oppgjør gir 503 med uavklart, sperrende ticket. Ekte Express/Supabase JS SDK er nå testet både mot lokale RPC/AI-simulatorer og mot **den faktiske disponibel PostgreSQL 17 via lokal PostgREST-formatbro**. Under testen ble det rettet et SQL-avvik der et avvist BUSY-kall opprettet en tom kjøre-ID. Suite har **52** ordinære npm-teststeg; ingen ekte KI-kostnader eller live Supabase-kall. Se [egen RPC-rapport](docs/ai/BENCHMARK-RPC-INTEGRASJON-2026-11-20.md). **Betalte tester er fortsatt stengt i produksjon.**

**Streng sensorbrukerreise (draft PR #12, 20.11):** Ny `tests/test-sensor-journey-browser.cjs` bruker **faktisk Chrome og ekte frontendkode** mot den lokale, deterministiske sensordemoen. Den tester at et fiktivt fullt navn stoppes før analyse-POST; deretter **tema → situasjon → råd → oppfølgingsdialog → utskrift med «Videre råd» → simulator → refleksjon → historikk → reload/gjenåpning → sletting og tom eksport**. Kjøringen er et eget påkrevd steg i Quality Gate, ikke bare en API-enhetstest. Dette er ikke ekte KI, Supabase Auth/RLS, fysisk mobil eller papirprint. Se [streng sensorkontroll og 36/36 kravstatus](docs/ai/SENSOR-KJERNEFLYT-E2E-2026-11-20.md). Gjeldende produksjon (`main`) er fortsatt **ikke** endret.

**Les i denne rekkefølgen:**

1. [PRD – 36 krav](docs/bmad/PRD.md), [arkitektur](docs/bmad/ARCHITECTURE-BMAD.md) og [epics/stories](docs/bmad/EPICS-AND-STORIES-BMAD.md) viser hva appen skal gjøre og hvordan det er tenkt implementert.
2. [Testbevis per krav](docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md) skiller statisk kontroll, deterministisk test, integrasjon, live KI og menneskelig vurdering. [Revisjonsrapporten](docs/REVISJON-IBE160-2026-11-18.md) viser hva som er rettet og hva som gjenstår.
3. [Konsentrert refleksjonsutkast](docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md) er nå på rundt **3 160 ord** (enkel opptelling inkludert overskrifter/metadata), og har ikke status som innlevert. [Originalt refleksjonsutkast](docs/REFLEKSJONSRAPPORT-UTKAST.md) med datert historikk er bevart. **Innleveringskrav, ordgrense og Del 2-rubrikk fra Canvas er fortsatt ikke bekreftet.**
4. [Sikkerhetskontroll for Supabase](docs/ai/SUPABASE-SIKKERHET-2026-11-18.md), [rolle-/RLS-test](docs/ai/SIKKERHETSTEST-ROLLER-RLS-2026-11-20.md) og [faktisk lokal Supabase Auth/PostgREST-test](docs/ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md) dokumenterer reelle, **lokale** GoTrue-sesjoner og isolasjon av to fiktive brukeres historikk gjennom PostgREST/RLS. **Hosted produksjons-/stagingkonfigurasjon er ikke validert.**
5. [KI-providerfeil og personvern](docs/ai/REGRESJON-KI-FEIL-OG-SPORREORD-2026-11-18.md) samt [OpenRouter-status](docs/ai/REGRESJON-OPENROUTER-2026-11-18.md) inneholder test → feilfunn → rettelse → ny test.

**Før endelig skoleinnlevering:** Den **ekte lokale** Supabase Auth/RLS-testen, Chromium mobil-touch og PDF-generering er nå bestått på revisjonsgrenen. Gjenstår: faktisk Canvas-oppgave/Del 2-rubrikk, studentens personlige godkjenning av refleksjonen, valgt **leveransegren og SHA**, og ny kvalitetssjekk på akkurat denne commiten. Fysisk mobil-/printreview, hosted Supabase-konfigurasjon og uavhengig KI-faglighet er fortsatt åpne begrensninger. Se [innleveringskontrollen](docs/INNLEVERINGSKONTROLL-2026-11-20.md). Supabases varsel om deaktivert kontroll mot kompromitterte passord må også vurderes før ordinær bruk.

## Rask tilgang for vurdering

### Publisert løsning

Produksjonsversjonen kan åpnes her:

`https://g46-nilsen-samtalestotte.onrender.com`

Tilgang til lukket testbruker gis separat ved behov.

Render kan bruke litt tid på første oppstart etter inaktivitet.

### Lokal demomodus uten nøkler

Installer avhengigheter:

```bash
npm install
```

Start sensordemo:

```bash
npm run demo
```

Åpne:

```text
http://127.0.0.1:3000
```

Demomodus bruker samme frontend som prosjektet, men erstatter eksterne KI-kall og databaseavhengigheter med deterministiske mock-svar. Den krever ingen `.env`, API-nøkler eller ekstern database.

### Kjør lokale tester

```bash
npm test
```

Den deterministiske testpakken gjør ingen eksterne KI-kall.

Live KI-tester, som `npm run test-ai:golden`, krever gyldig API-konfigurasjon og er valgfrie ved vurdering.

## Kjernefunksjoner

Prototypen omfatter:

- strukturert støtte til krevende medarbeidersamtaler
- 9 hovedtemaer og 48 undertemaer
- videre KI-dialog i samme sak
- Samtaleøvelse med KI-medarbeider
- personverngateway i klient og server
- innlogging, historikk og roller
- kuratert faggrunnlag og kildebruk
- valgfri yrkes-/sektorkontekst med presis ruting mot relevant særregelverk
- utskrift av situasjon og råd
- mobiltilpasset grensesnitt og PWA/installasjon
- automatiserte regresjons- og KI-tester

## Faglig og etisk avgrensning

KI-råd kan være ufullstendige eller feil. Samtalestøtte skal ikke:

- stille diagnoser
- fastslå skyld eller motiv
- gi bindende juridiske råd
- ta personalbeslutninger
- erstatte HR, jurist, BHT eller annet relevant fagmiljø

Prosjektets golden/fasit-bank er utviklet som prosjektets eget testgrunnlag og er ikke uavhengig ekspertvalidering.

## Teknologi

- HTML, CSS og JavaScript
- Node.js / Express
- Supabase
- OpenAI / OpenRouter
- Git / GitHub
- Render

## Lokal kjøring med full funksjonalitet

Klon repoet:

```bash
git clone https://github.com/IBE160-2026/G46-nilsen.git
cd G46-nilsen
```

Installer:

```bash
npm install
```

Kopier `.env.example` til `.env` og fyll inn nødvendig konfigurasjon.

Start:

```bash
npm start
```

Åpne:

```text
http://localhost:3000
```

Appen skal kjøres via Node-serveren, ikke ved å åpne `index.html` direkte.

## Viktig dokumentasjon

### Produkt og krav

- `product-brief.md` – produktproblem, målgruppe, scope og produktretning
- `docs/bmad/PRD.md` – funksjonelle og ikke-funksjonelle krav
- `docs/bmad/ARCHITECTURE-BMAD.md` – teknisk arkitektur
- `docs/bmad/UX-DESIGN-BMAD.md` – UX-prinsipper og designvalg
- `docs/bmad/EPICS-AND-STORIES-BMAD.md` – epics, stories og sporbarhet
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md` – utviklings- og implementeringsforløp

### KI, testing og faggrunnlag

- `docs/ai/AI-TESTPLAN.md` – teststrategi for KI og kvalitet
- `docs/ai/AI-LOGG-SAMTALESTOTTE.md` – dokumentert KI-bruk i utviklingen
- `docs/ai/TEST-FASIT-OG-SPORBARHET.md` – golden/fasit og kravspor
- `docs/SOURCEBANK.md` – kuratert kilde- og faggrunnlag
- `docs/OCCUPATION-SOURCE-AUDIT-2026-11-08.md` – gjennomgang av alle yrker/sektorer og særkilder
- `docs/KILDEDEKNING-OG-SPORBARHET-2026-11-20.md` – revidert oversikt over alle 15 sektorvalg, kildehierarki, web-søk-sporbarhet, 28 nye positive/negative sektorprøver og begrensninger før ekte KI-test
- `docs/DOKUMENTASJON-SYNK-2026-11-08.md` – synk av implementasjon og dokumentasjon etter arbeidsrunden 08.11
- `docs/KODESTRUKTUR-OPPRYDDING-2026-11-08.md` – vedlikeholdbarhet og filopprydding
- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md` – sikkerhet og personvern

### Refleksjon og utviklingshistorikk

- `docs/REFLEKSJONSRAPPORT-UTKAST.md`
- `docs/REFLECTION-NOTES-v20.md`
- `docs/REFLEKSJONSADDENDUM-2026-11-02.md`
- `docs/DOKUMENTASJON-SYNK-2026-11-02.md`
- `CHANGELOG.md`
- `docs/VERSJONSHISTORIKK-v20.11.md`

## Testgrunnlag

Prosjektet har blant annet tester for:

- personvern i klient og server
- samtaleøvelse
- historikk
- UI-regresjon
- kildebank
- taksonomi og benchmark
- yrkes-/sektorkontekst
- PWA og mobil
- golden/fasitbasert KI-kvalitet

Den brede benchmarkbanken inneholder 114 saker synkronisert med de 48 gjeldende undertemaene. Golden/fasitbanken inneholder nå 66 caser: 26 tidligere generelle/pilotcaser + 40 strenge yrke/sektor/tariff/kilde-caser. De 40 nye består av 28 sektorcaser, 8 arbeidsgiver-/tariffcaser og 4 kildelekkasjecaser.

## Videre arbeid

Noen funksjoner er bevisst holdt utenfor dagens ferdige leveranse, blant annet:

- full lukket/offline variant
- lokal RAG og intern KI
- tale/voice i Samtaleøvelse
- videre utvidelse og ekspertvalidering av yrkes-/sektorkilder
- fullskala representativ brukertesting

Disse områdene er dokumentert som videre arbeid og skal ikke tolkes som ferdige funksjoner.

## Repo-struktur

```text
G46-nilsen/
├── assets/
├── data/
├── database/
├── docs/
├── scripts/
├── src/
├── tests/
├── app.js
├── index.html
├── server.js
├── styles.css                 # CSS-inngangspunkt
├── styles-core.css            # grunnstiler og komponenter
├── styles-responsive.css      # responsiv/mobil/PWA
├── styles-overrides.css       # senere målrettede overrides
├── package.json
├── product-brief.md
└── README.md
```

Prosjektet er utviklet av Cecilie C. Nilsen som del av IBE160 Programmering med KI ved Høgskolen i Molde.

## Statusoppdatering 08.11.2026

Yrkes-/sektorlaget er koblet til den ordinære brukerflyten og har nå et eget autoritativt register med 86 startkilder. Kilder kan avgrenses til konkrete yrker, slik at for eksempel politiets særregler ikke automatisk brukes for brannvesen bare fordi begge ligger i samme sektor. Hjelp-siden viser kildebanken i fire hovedkategorier: Lovverk og myndigheter, Forskning og evidens, Faglig rammeverk og Yrkes- og sektorkilder.

Som vedlikeholdsgrep er den tidligere ca. 9 389 linjer lange `styles.css` splittet i tre moduler, mens `styles.css` beholdes som et lite inngangspunkt. Se dokumentasjonssynken og oppryddingsrapporten for detaljer.


## Kildedekning og etterprøvbarhet – 20.11.2026

Nye kilder og testkontrakter ligger på feilrettingsgrenen. Denne runden kontrollerer **hva som er registrert**, **hva som sendes til KI** og **hva som blir vist som kilde** – tre ulike nivåer. Det er 99 oppføringer i yrkes- og sektorregisteret, 59 generelle fagkilder og separate avtale-/tariffkilder. En registrert URL er ikke bevis for at KI har åpnet og lest siden.

Den deterministiske sektorprøven har ett positivt og ett negativt scenario for hver av 14 navngitte sektorer, mens «Annet» er et separat sektor-nøytralt valg. Ekte KI- og kildepresisjon må fortsatt verifiseres manuelt med anonymiserte saker før produksjon. Se [revisjonen av kildedekning og sporbarhet](docs/KILDEDEKNING-OG-SPORBARHET-2026-11-20.md).

**Driftsforbehold:** `OCCUPATION_CONTEXT_ENABLED` står til `false` som standard i serverkoden. Hjelp kan vise sektorregisteret også når KI-tilpasning er av. Render-miljøvariabelen og resultatene med ekte KI må kontrolleres før man hevder at alle sektorkildene brukes i produksjon.

## Kildekvalitet – revisjon 08.11.2026

Kildegrunnlaget er kvalitetsrevidert med fokus på autoritet, relevans og faktisk anvendelse fremfor antall lenker.

Se:
- `docs/SOURCE-QUALITY-AUDIT-2026-11-08.md` – full revisjon av lov, myndighet, forskning, tariff og yrkeskilder
- `tests/test-source-policy.cjs` – regresjonsvern mot duplikater, feil kildehierarki og feil tariff-/arbeidsgiveravgrensning

KI-en skiller nå eksplisitt mellom lov/forskrift, tariff/hovedavtale, myndighetsveiledning, arbeidslivsveiledning, forskning og faglige rammeverk.


## Verifikasjonsrunde 08.11.2026

Etter utvidelsen med yrke, sektor, arbeidsgivertype og tariff ble teststrategien skjerpet fra «har svaret faggrunnlag?» til også å kontrollere **om riktig kilde brukes og feil kilde holdes ute**.

Automatisk quality gate på `main` kjører:
- full `npm test`
- syntaks av både produksjonskode og testfiler
- 73 personverntester
- 114 benchmark-saker / 48 undertemaer
- 66-case golden-schema
- 28/28 deterministiske sektor-golden-rutinger
- kilde-/tariff-/yrkespolicy
- UI/PWA/simulator/regresjoner
- `npm audit --omit=dev --audit-level=high`

Siste dokumenterte grønne quality-gate for kodeendringene før denne dokumentasjonsoppdateringen: GitHub Actions run **42646984725**, commit `a8756d36c492be39e70611c0946c026234beb965`.

Se `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md` for metode, funn, feilklassifisering, tiltak, begrensninger og sporbarhet.

**Live-status 09.11.2026:** Den strenge 40-case occupation-golden-suiten er nå også kjørt lokalt mot `gpt-5.6-luna`: **40/40 OK, 0 Bør sjekkes, 0 kritiske avvik og 0 tekniske feil**. Resultatet er et dokumentert regressjonsresultat for disse casene, ikke en garanti for all framtidig modelloutput.


### Påstandsvis kildekontroll etter ekte KI-test (PR #15)

Den automatiske Quality Gate kontrollerer funksjon, kildekandidater, opphav og regresjoner, **ikke** om KI-rådenes konkrete juridiske utsagn er korrekte. En ekte akseptansetest skal produsere et **uutfylt** vurderingsskjema for fem anonymiserte saker i lokal `test-results/`. Kontrollør skal lese hele rådet og oppfølgingen, prøve alle kritiske fagkriterier og knytte hver konkret rettslig påstand til utdrag fra en originalkilde som faktisk ble vist i samme svar.

Kjør formell kontroll av den ferdig utfylte vurderingen med `npm run check-source-acceptance-review -- <run.json> <manual-review.json>`. Et skjema som ikke er gjennomgått av en person får aldri godkjent resultat. Utfylling er heller ingen automatisk juridisk attest; en ansvarlig fagperson må vurdere om kontrollen er troverdig.

Se [protokollen for manuell kildeakseptanse](docs/KILDEAKSEPTANSE-MANUELL-KONTROLL-2026-11-21.md). **Ekte fem-case KI-test ble gjennomført lokalt 25.11.2026 og rapportert 5/5 maskinelt OK; den formelle faglige vurderingen er fortsatt IKKE godkjent.** En foreløpig manuell stikkprøve av Markdown-utdraget fant manglende kontrollvarsler for sykefraværsfrister, diagnose og SHA-ansvar; varselfilter og regresjonstester er oppdatert på denne utviklingsgrenen uten etterfølgende betalt KI-omtest. Se protokollen. På Windows kopierer den frivillige ekte KI-testen nå den lesbare Markdown-rapporten automatisk til utklippstavlen med `Set-Clipboard` når rapportene er skrevet; bruk Ctrl+V i chatten. Kopiering endrer ikke testresultat eller godkjenningsstatus.

### Test de nye endringene fra Windows PowerShell (uten KI-nøkkel)

Før du tester: hent utviklingsgrenen `fix/evidence-sources-20261120` (den er **ikke** slått sammen med `main`). Kontroller `git status` før du bytter gren, så du ikke overskriver eget arbeid.

```powershell
git fetch origin
git switch fix/evidence-sources-20261120
git pull --ff-only origin fix/evidence-sources-20261120
npm ci
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-new-features.ps1
```

Skriptet kjører 29 relevante, **kostnadsfrie** kilde-, historikk-, juridisk-varsel- og benchmark-/simulatortester automatisk. Det viser en kort resultatoversikt, lagrer hele utskriften under Git-ignorert `test-results/nye-tester-<tid>.log` og kopierer **kun oppsummeringen** til Windows-utklippstavlen. Deretter kan du lime inn det korte resultatet med Ctrl+V – ikke hundrevis av logglinjer. Dersom utklippstavlen er utilgjengelig vises oppsummeringen likevel på skjermen.

**Ved tre lokale HTTP-testfeil på Windows (Node `ERR_UNSUPPORTED_ESM_URL_SCHEME`):** 25.11.2026 ble de tre simulatortestene rettet til å konvertere Windows-filstier til `file:///`-URL når Node starter `--import`. Hent oppdateringen og kjør **bare de tre feilede testene og én ny Windows-regresjon**:

```powershell
git pull --ff-only origin fix/evidence-sources-20261120
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-new-features.ps1 -FailedOnly
```

Resultatet kopieres automatisk til utklippstavlen, også med korte feilutdrag dersom noe fortsatt feiler. Hele loggen forblir på PC-en. Ingen ekte KI-kall.

**Målrettet funksjonstest for en historisk tarifsak med oppfølgingsspørsmål:** Kildeperioden fra opprinnelig situasjon skal følge med til korte spørsmål som «Hva med kravfristene?» og «Hvilken tariffavtale gjaldt da?». Hvis brukeren eksplisitt spør «Hva gjelder nå?», skal dagens kilder vurderes i stedet. Kjør alle tre relevante teststeg med én kommando; resultatet kopieres automatisk til utklippstavlen:

```powershell
git pull --ff-only origin fix/evidence-sources-20261120
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-new-features.ps1 -ConversationOnly
```

Testene kjører med syntetisk KI på lokal Express-server, **uten ekte KI-kall, API-nøkler eller deploy**. De verifiserer samtaleflyt og kildekandidatvalg, ikke at en faktisk lovpåstand støttes av originalteksten.

For hele den eksisterende offline-testpakken:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-new-features.ps1 -Full
```

Dette bruker verken ekte KI eller API-nøkkel i Git. Det er en automatisk teknisk/regresjonskontroll, **ikke en faglig faktasjekk av ekte KI-råd**.

### Live KI-validering

Live modelltesting er skilt fra vanlig CI og skal i dette prosjektet kjøres **lokalt** med API-nøkkel i en lokal `.env`-fil.

`.env` og `.env.*` er eksplisitt ignorert av Git. Ekte API-nøkler skal aldri committes, pushes eller legges i repo-filer.

Trygg lokal fremgangsmåte:

```bash
cp .env.example .env
```

Legg deretter nøkkelen kun i den lokale `.env`-filen og kjør:

```bash
npm run test-ai:occupation-golden
```

Rapportene skrives til `tests/test-results/`, som også er ignorert av Git. Endelig 40/40-kjøring 09.11.2026 er dokumentert i `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md` med rapportfilnavn og metodiske begrensninger.

For dette prosjektet er lokal `.env` eneste dokumenterte metode for live KI-test. Ekte API-nøkler skal ikke legges i Git, repo-filer eller GitHub-workflows.
