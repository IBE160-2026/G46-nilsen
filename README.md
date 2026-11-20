# Samtalestøtte

Samtalestøtte er en KI-basert webapplikasjon utviklet i IBE160 Programmering med KI ved Høgskolen i Molde.

Løsningen skal hjelpe ledere med å forberede og øve på krevende medarbeidersamtaler. Den støtter blant annet strukturering av situasjonen, forslag til åpning og spørsmål, oppfølging i samme kontekst, samtaleøvelse, refleksjon og personvernkontroll før KI-kall.

Samtalestøtte er **ikke** et HR-system, journalsystem eller beslutningsverktøy. KI-en skal støtte lederens vurdering, ikke erstatte lederens ansvar eller relevant fagkompetanse.

## Prosjektstatus og dokumentasjon – 18.11.2026

**Samtalestøtte v20.11.5** er en studentprototype. `main` er produksjonsgrunnlaget; alle forbedringene fra den siste kvalitetsrevisjonen ligger på `docs/ibe160-helhetlig-revisjon-20261118` og **er ikke slått sammen eller deployet til produksjon**. LIVE/tale er fortsatt **kun på en separat pilotgren** (`pilot-ux-v20.11`), ikke en del av produksjonsleveransen. FR-23 (en alternativ direkte tekstinngang) er en annen hypotese enn LIVE/tale.

**Siste komplette Quality Gate for adminmodul-uttrekket:** [GitHub Actions #44752528974](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44752528974) på commit `a3ca6c2557ddfdb3c5e08ddf9f508f6e6c3dffdd` er **SUCCESS**: **45 deterministiske npm-teststeg**, egen Chrome-test av administrasjon for tre roller, 99 Chrome/CSS-paritetsscenarier, faktisk PostgreSQL/RLS-gransking med to fiktive identiteter, avhengighetsaudit og golden-opptelling. Dette gjelder **bare revisjonsgrenen**, er **ikke** live KI-evaluering og erstatter ikke ekte Supabase Auth/PostgREST-akseptanse.

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
3. [Konsentrert refleksjonsutkast](docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md) er på rundt 2 650 ord. [Originalt refleksjonsutkast](docs/REFLEKSJONSRAPPORT-UTKAST.md) med datert historikk er bevart. Innleveringskrav og ordgrense i Canvas er **ikke bekreftet**.
4. [Sikkerhetskontroll for Supabase](docs/ai/SUPABASE-SIKKERHET-2026-11-18.md), [sikkerhetstest av roller/RLS](docs/ai/SIKKERHETSTEST-ROLLER-RLS-2026-11-20.md) og [historikk-HTTP-test](docs/ai/REGRESJON-HISTORIKK-TO-BRUKERE-2026-11-18.md) dokumenterer faktisk RLS-metadata, lokal Express-test og en **ekte PostgreSQL/RLS-test av V20-8-policyene** med syntetiske identiteter. Dette er fremdeles **ikke** en reell tobrukertest mot Supabase Auth/PostgREST.
5. [KI-providerfeil og personvern](docs/ai/REGRESJON-KI-FEIL-OG-SPORREORD-2026-11-18.md) samt [OpenRouter-status](docs/ai/REGRESJON-OPENROUTER-2026-11-18.md) inneholder test → feilfunn → rettelse → ny test.

**Før endelig godkjenning:** Ekte Supabase Auth/RLS i isolert testprosjekt, manuell mobil-/utskrifts-/brukerreise, menneskelig kontroll av dokumentene og faktisk Canvas-rubrikk gjenstår. Supabases varsel om deaktivert kontroll mot kompromitterte passord må vurderes før ordinær bruk. Ikke oppgi at dette er bestått eller publisert bare fordi CI er grønn.

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
