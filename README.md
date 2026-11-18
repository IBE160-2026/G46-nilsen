# Samtalestøtte

Samtalestøtte er en KI-basert webapplikasjon utviklet i IBE160 Programmering med KI ved Høgskolen i Molde.

Løsningen skal hjelpe ledere med å forberede og øve på krevende medarbeidersamtaler. Den støtter blant annet strukturering av situasjonen, forslag til åpning og spørsmål, oppfølging i samme kontekst, samtaleøvelse, refleksjon og personvernkontroll før KI-kall.

Samtalestøtte er **ikke** et HR-system, journalsystem eller beslutningsverktøy. KI-en skal støtte lederens vurdering, ikke erstatte lederens ansvar eller relevant fagkompetanse.

## Dokumentasjon og kvalitetssikring – oppdatert 18.11.2026

Dette repoet inneholder en studentprototype som er utviklet iterativt. **Produktgrunnlaget ligger i `main`, mens dokumentasjonsrevisjonen ligger på `docs/ibe160-helhetlig-revisjon-20261118`.** Dokumentasjonsgrenen inneholder ikke en produksjonsrelease.

- **Gjeldende krav:** `docs/bmad/PRD.md` (§§ 8–10; 36 identifiserte krav inkludert FR-15A og NFR-QA-01). Daterte tilleggsbeskrivelser/testtall er bevart i `docs/bmad/PRD-STATUS-OG-HISTORIKK.md`.
- **Arkitektur og stories:** `docs/bmad/ARCHITECTURE-BMAD.md` § 2.1 kobler krav til komponenter/feilmodi, og `docs/bmad/EPICS-AND-STORIES-BMAD.md` § 25.3 viser krav-til-story-spor.
- **Testbevis, ikke bare testfiler:** `docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md` skiller statiske tester, deterministiske regler, E2E/integrasjon, live modell og manuell vurdering. `docs/REVISJON-IBE160-2026-11-18.md` viser åpne avvik.
- **Siste faktisk sjekkede `main`-CI:** GitHub Actions run `43205812288` 12.11.2026 **feilet** i repo-strukturtesten på `.docs` etter tillegg av en faglærerreferanse. Etterfølgende `npm audit` ble hoppet over; se rapporten før du omtaler sluttstatus. Den smale tilpasningen er verifisert i revisjonsgrenens Quality Gate (run `44336281200`: **SUCCESS** 18.11). Dette er **ikke** en ny grønn kjøring på `main`.
- **LIVE/tale:** Kun separat pilot på `pilot-ux-v20.11` og egen Render-preview. Taletranskripsjon er **ikke produksjonssatt eller godkjent som ferdig funksjon**. FR-23 om alternativ direkte inngang er en annen hypotese, ikke synonymt med tale-LIVE.

**Tidligere revisjonsgren-CI 18.11.2026:** [GitHub Actions 44336281200](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44336281200), commit `d9234879e848219f7ea0b1fe87bf3bced9572615`, **SUCCESS** – `npm ci`, alle 31 `npm test`-delsteg, produksjonsdependency-audit (**0 sårbarheter**) og oppsummering av 66 golden-caser (40 strenge: 28 sektor, 8 tariff, 4 kildelekkasje). Dette er ikke en ny live KI-test eller E2E-/RLS-godkjenning, og `main` er fortsatt uendret.

**Utvidet revisjonsgren-CI 18.11.2026:** [GitHub Actions 44338528651](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44338528651), commit `206925b5a4d8e222c8811677d045859539f98447`, **SUCCESS** med 32 deltester, `npm audit` (0 sårbarheter), golden-oversikt (66/40), ekte HTTP-avvisningstest for uinnloggede API-kall og utvidet deterministisk demoflyt. Denne kjøringen tester **ikke** to innloggede brukere, RLS i live request-kontekst, faglige live KI-råd, fysisk mobil eller utskrift.

**Read-only Supabase-sikkerhetskontroll 18.11.2026:** Live databasedefinisjoner viser RLS på alle 10 `public`-tabeller, fire eierskapsbaserte `conversations`-policyer, ingen SELECT for `anon`, og direkte `authenticated`-rettigheter kun på `conversations`. Security Advisor viser WARN om deaktivert leaked-password protection og ni INFO om policyfrie serverstyrte tabeller. Se `docs/ai/SUPABASE-SIKKERHET-2026-11-18.md`. Ingen persondata er lest eller databaseendringer utført.

**Ny regressjonskontroll 18.11.2026:** En ny HTTP-test beviste at `/api/status` ga feil status når bare OpenRouter var konfigurert: [rød CI 44339406194](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44339406194). Minimal rettelse i `server.js` ble verifisert med [grønn CI 44339569597](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44339569597), commit `561da3d4aaa5fc425e4ed991fa93c9ea6b6947ef`: **33 deterministiske deltester**, `npm audit` 0 sårbarheter. Se `docs/ai/REGRESJON-OPENROUTER-2026-11-18.md`. Testen bruker dummy-nøkler, ikke ekte KI eller DB; produksjonsgrenen er fortsatt uendret.

Følg sensorstien nedenfor for lokal demo og deterministiske kontroller. `npm test` på studentens egen maskin dokumenterer først et resultat når kommandoen faktisk er kjørt på aktuell commit; tidligere testtall i docs er historiske.

## Ny verifisert kvalitetssikring – 18.11.2026

**Siste komplette CI-kjøring:** [44343038247](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44343038247) på revisjonsgrenen, commit `4d78bcbc02d665c3cfa0ae68289b81370621dfc3`, **SUCCESS**: 35 automatiske deltester, dependency audit med 0 sårbarheter og 66/40 golden-opptelling (ikke en ny live modellkjøring).

- **To fiktive brukere:** `tests/test-auth-history-two-users-http.cjs` kjører selve Express-serveren mot en lokal Auth/PostgREST-simulator. Opprett/les/endre/slett, eksport, uautoriserte operasjoner og databasefeil testes. Den første røde kjøringen `44341093359` fant en misvisende HTTP 500 ved oppdatering av ukjent/andres ID; nå nøytral 404. Grønn kjøring `44341831405`. Se `docs/ai/REGRESJON-HISTORIKK-TO-BRUKERE-2026-11-18.md`. **Ekte Supabase RLS med to reelle kontoer er ikke gjennomført.**
- **Feil fra KI-provider:** `tests/test-ai-provider-errors-http.cjs` med offline fetch-stub tester 503, 429, ugyldig leverandørrespons, nettverksbrudd og personvernblokkering før KI. En rød kjøring `44342507107` avdekket et falskt personnavntreff på `Hvordan`. Det delte navnefilteret og klient-/servertestene er korrigert med spørreord pluss fortsatt positiv navnegjenkjenning. Grønn kjøring `44343038247`. Se `docs/ai/REGRESJON-KI-FEIL-OG-SPORREORD-2026-11-18.md`.
- Ingen produksjonsmerge, ingen Render-deploy, ingen endringer i LIVE-piloten og ingen lesing/endring av reelle brukerrader. `main` er fortsatt produksjonsreferanse. Alle testkonklusjonene gjelder **den isolerte revisjonsgrenen**, ikke en ny `main`-CI.

**Refleksjonsrapport – lesbar sensorversjon:** [Konsentrert arbeidsutkast på ca. 2 650 ord](docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md) bygger på det originale, daterte refleksjonsutkastet (ca. 9 500 ord). Originalen er bevart for historikk og detaljer. Den nye teksten er **ikke** sjekket mot endelige ord-/formkrav fra Canvas, og er derfor ikke merket som ferdig innlevering.

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
