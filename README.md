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

Historiske README-statusnotater er flyttet til [arkivet](docs/archive/README-STATUSNOTATER-2026-11.md). Gjeldende status finnes i [PROSJEKTSTATUS](docs/PROSJEKTSTATUS.md).

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
- `docs/ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md` – faktisk isolert Auth-/RLS-test, ikke produksjonsgodkjenning
- `docs/ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md` – dokumentert Chrome-mobiltest og PDF-kontroll
- `docs/ai/TEST-FASIT-OG-SPORBARHET.md` – golden/fasit og kravspor
- `docs/SOURCEBANK.md` – kuratert kilde- og faggrunnlag
- `docs/OCCUPATION-SOURCE-AUDIT-2026-11-08.md` – gjennomgang av alle yrker/sektorer og særkilder
- `docs/KILDEDEKNING-OG-SPORBARHET-2026-11-20.md` – revidert oversikt over alle 15 sektorvalg, kildehierarki, web-søk-sporbarhet, 28 nye positive/negative sektorprøver og begrensninger før ekte KI-test
- `docs/DOKUMENTASJON-SYNK-2026-11-08.md` – synk av implementasjon og dokumentasjon etter arbeidsrunden 08.11
- `docs/KODESTRUKTUR-OPPRYDDING-2026-11-08.md` – vedlikeholdbarhet og filopprydding
- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md` – sikkerhet og personvern

### Refleksjon og utviklingshistorikk

- `docs/REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md` – hovedutkast etter skolens mal
- `docs/DOKUMENTASJONSREVISJON-2026-11-25.md` – fil-for-fil-revisjon
- `docs/DOKUMENTASJON-SJEKKLISTE.md` – gjeldende dokumentasjons- og oppryddingsoversikt
- `docs/REFLEKSJONSRAPPORT-UTKAST.md` – historisk, eldre utkast
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

