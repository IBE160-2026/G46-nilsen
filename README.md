# Samtalestøtte

Samtalestøtte er en KI-basert webapplikasjon utviklet i IBE160 Programmering med KI ved Høgskolen i Molde.

Løsningen skal hjelpe ledere med å forberede og øve på krevende medarbeidersamtaler. Den støtter blant annet strukturering av situasjonen, forslag til åpning og spørsmål, oppfølging i samme kontekst, samtaleøvelse, refleksjon og personvernkontroll før KI-kall.

Samtalestøtte er **ikke** et HR-system, journalsystem eller beslutningsverktøy. KI-en skal støtte lederens vurdering, ikke erstatte lederens ansvar eller relevant fagkompetanse.

## Prosjektstatus og dokumentasjon – 18.11.2026

**Samtalestøtte v20.11.5** er en studentprototype. `main` er produksjonsgrunnlaget; alle forbedringene fra den siste kvalitetsrevisjonen ligger på `docs/ibe160-helhetlig-revisjon-20261118` og **er ikke slått sammen eller deployet til produksjon**. LIVE/tale er fortsatt **kun på en separat pilotgren** (`pilot-ux-v20.11`), ikke en del av produksjonsleveransen. FR-23 (en alternativ direkte tekstinngang) er en annen hypotese enn LIVE/tale.

**Siste verifiserte Quality Gate på revisjonsgrenen:** [GitHub Actions #44402558539](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44402558539) på commit `70118fbc23fca83a84fb2c96523fabd55228cce8` er **SUCCESS** med **43 deterministiske deltester**, 99 Chrome-sammenligninger, npm audit uten funn på valgt nivå og datert opptelling av golden-casebanken. Dette er **ikke** en ny live KI-evaluering.

**CSS-status:** [CSS-revisjonen](docs/CSS-REVISJON-2026-11-18.md) dokumenterer **845 → 694 `!important`** og at største CSS-fil ble redusert fra **6 402 til 1 702 linjer**, ved kontrollert opprydding og funksjonsnavngitt oppdeling i 14 ordnede moduler. Chrome sammenligner nå også print-media og åpne hjelpedetaljer (totalt 99 scenarier). **Manuell fysisk mobil-, utskrifts- og innlogget UI-review gjenstår.** Maksgrensen på 694 i CSS-auditen er vern mot ny overstyringsgjeld, ikke et tegn på at 694 er ideelt.

**Filene faglærer bemerket:** [Teknisk revisjon](docs/TEKNISK-REVISJON-CSS-APP-SERVER-2026-11-18.md) viser `app.js` fra **4 632 til 4 274** linjer og `server.js` fra **2 100 til 1 844**, etter åtte avgrensede, testbare uttrekk: temasøk, situasjonsanalyse, reserveveiledning/oppfølgingsspørsmål, historikkontrakter, kildenormalisering, hjelp-kildebibliotek og kilderangering. **Hovedfilene er fremdeles store**, særlig admin-/autentiseringslogikk; ikke framstill prosjektet som ferdig refaktorert.

**Les i denne rekkefølgen:**

1. [PRD – 36 krav](docs/bmad/PRD.md), [arkitektur](docs/bmad/ARCHITECTURE-BMAD.md) og [epics/stories](docs/bmad/EPICS-AND-STORIES-BMAD.md) viser hva appen skal gjøre og hvordan det er tenkt implementert.
2. [Testbevis per krav](docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md) skiller statisk kontroll, deterministisk test, integrasjon, live KI og menneskelig vurdering. [Revisjonsrapporten](docs/REVISJON-IBE160-2026-11-18.md) viser hva som er rettet og hva som gjenstår.
3. [Konsentrert refleksjonsutkast](docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md) er på rundt 2 650 ord. [Originalt refleksjonsutkast](docs/REFLEKSJONSRAPPORT-UTKAST.md) med datert historikk er bevart. Innleveringskrav og ordgrense i Canvas er **ikke bekreftet**.
4. [Sikkerhetskontroll for Supabase](docs/ai/SUPABASE-SIKKERHET-2026-11-18.md) og [integrasjonstest med syntetiske brukere](docs/ai/REGRESJON-HISTORIKK-TO-BRUKERE-2026-11-18.md) dokumenterer faktisk RLS-metadata og en separat lokal simulert brukertest – **ikke** en reell tobrukertest mot Supabase.
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
