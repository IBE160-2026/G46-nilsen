# Samtalestøtte

**Gjeldende prosjektstatus:** [PROSJEKTSTATUS](docs/PROSJEKTSTATUS.md). **Refleksjonsrapport etter skolens mal:** [Les hovedutkastet](docs/REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md). [Dokumentasjonsrevisjonen](docs/DOKUMENTASJONSREVISJON-2026-11-25.md) viser hvilke notater som er historiske. LIVE/tale er fortsatt eksperimentelt og er ikke del av produksjonsfunksjonen.

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

Den siste kommandoen er en **lokal dokumentasjons- og sporbarhetskontroll**, ikke en bekreftelse fra Canvas. Se [gjeldende dokumentasjonssjekkliste](docs/DOKUMENTASJON-SJEKKLISTE.md) og dokumentert [lokal Supabase-test](docs/ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md) og [mobil-/utskriftstest](docs/ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md). [Innleveringskontrollen fra 20.11](docs/INNLEVERINGSKONTROLL-2026-11-20.md) er **historisk**.

**For vurdering:** Bruk `main`, ikke eldre PR-grener. Teknisk teststatus og siste publisering er dokumentert i [prosjektstatus](docs/PROSJEKTSTATUS.md). Grønn CI er ikke uavhengig faglig eller juridisk godkjenning av KI-råd.

Historiske README-statusnotater er bevart i [arkivet](docs/archive/README-STATUSNOTATER-2026-11.md).

## Publisert løsning og testbevis

- **Publisert prototype:** [Åpne Samtalestøtte](https://g46-nilsen-samtalestotte.onrender.com). Tilgang til eventuell lukket testbruker gis separat.
- **Lokal sensordemo:** Bruk én oppskrift under [For sensor: test appen uten tilgangsnøkler](#for-sensor-test-appen-uten-tilgangsnøkler). Den kjører med fiktive svar og uten eksterne tjenester.
- **Automatiske kontroller:** `npm test` og `npm run audit:submission` er beskrevet i samme oppskrift. Live KI-tester som `npm run test-ai:golden` krever egen API-konfigurasjon og er ikke nødvendig for å kjøre demoen.

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

## Lokal kjøring med eksterne tjenester

Start med `git clone`, `git switch main` og `npm ci` fra [sensoroppskriften](#for-sensor-test-appen-uten-tilgangsnøkler), men kjør **ikke** `npm run demo`. Kopier `.env.example` til `.env`, legg inn nødvendige opplysninger for tjenestene og start med `npm start`. Åpne deretter `http://localhost:3000`.

Denne varianten krever gyldig konfigurasjon for tjenestene som brukes. Applikasjonen skal startes via Node-serveren, ikke ved å åpne `index.html` direkte. Demoen er den anbefalte metoden når sensor ikke har tilgangsnøkler.

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

## Kjent teknisk gjeld og bevisste avgrensninger

Faglærers Product Brief-tilbakemelding 26.10 påpekte store hovedfiler i `app.js` og `server.js`. Prosjektet har siden skilt ut flere klient- og servermoduler og redusert CSS-overstyringer gjennom målrettede revisjoner. Noe teknisk gjeld gjenstår, særlig i større fellesfiler og historiske stilregler. En stor omskriving mot slutten av studentprosjektet er bevisst utsatt fordi regresjonsrisikoen kan bli større enn den dokumenterte gevinsten.

Se [teknisk revisjon](docs/TEKNISK-REVISJON-CSS-APP-SERVER-2026-11-18.md), [CSS-revisjon](docs/CSS-REVISJON-2026-11-18.md) og [refleksjonsrapport etter skolens mal](docs/REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md). Grønne automatiske tester er ikke bevis for at all teknisk gjeld er fjernet.

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

