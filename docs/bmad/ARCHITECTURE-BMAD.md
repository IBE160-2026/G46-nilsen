# Architecture – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Architecture Document  
**Rammeverk:** BMAD  
**Status:** Revidert arkitektur med faktisk leveransestatus  
**Versjon ved dokumentasjon:** 20.11.0  
**Språk:** Norsk

---

# 1. Formål

Dette dokumentet beskriver den tekniske arkitekturen i den leverte Samtalestøtte-prototypen.

Dokumentet skiller mellom:

- **nåværende implementert arkitektur**
- **delvis/prototypebasert funksjonalitet**
- **framtidig målarkitektur**

Målet er å gjøre det tydelig hvordan løsningen faktisk er bygget, hvilke sikkerhets- og personvernvalg som er gjort, hvordan komponentene kommuniserer, og hvilke deler som kan videreutvikles senere.

Arkitekturen er utviklet iterativt og har blitt endret etter:

- testing
- tekniske feil
- KI-evaluering
- personvernvurderinger
- sikkerhetsgjennomgang
- brukerflyt
- kostnadsvurdering
- nye produktbehov

---

# 2. Arkitekturmål

Arkitekturen skal støtte en KI-basert applikasjon som er:

- sikker
- personvernbevisst
- testbar
- forståelig
- mulig å videreutvikle
- mulig å feilsøke
- ikke unødvendig låst til én KI-modell
- egnet som prototype for framtidig intern/lukket løsning

Den viktigste arkitekturregelen er:

> Sensitive nøkler, tilgangskontroll og sentrale sikkerhetsbeslutninger skal ligge på serversiden.

---

# 3. Arkitekturstatus

| Område | Status |
|---|---|
| Frontend | Implementert |
| Node/Express backend | Implementert |
| Supabase Auth | Implementert |
| PostgreSQL/Supabase data | Implementert |
| Rollemodell | Implementert |
| Personverngateway | Implementert og testet |
| KI-integrasjon | Implementert |
| Samtalesimulator | Implementert og testet |
| Historikk | Implementert |
| Admin | Implementert |
| Flere KI-modeller | Implementert i prototypeform |
| OpenRouter/providerlag | Implementert i prototypeform |
| Benchmark | Prototype/testform |
| Kostnads-/tokenanalyse | Prototype/testform |
| Web-/kildeanalyse | Delvis/prototype |
| Lokal RAG | Framtidig arbeid |
| Intern KI | Framtidig arbeid |
| Lukket nettverk | Framtidig målarkitektur |

---

# 4. Overordnet arkitektur

Den leverte nettversjonen består av fire sentrale hovedlag:

```text
Bruker / nettleser
        │
        ▼
Frontend
HTML / CSS / JavaScript
        │
        │ HTTPS / API
        ▼
Node.js / Express
Applikasjonsserver
        │
        ├──────────────► KI-provider
        │                OpenAI / OpenRouter
        │
        ▼
Supabase
Auth + PostgreSQL + RLS
```

Applikasjonsserveren fungerer som sikkerhets- og kontrollpunkt mellom frontend og eksterne tjenester.

Frontend skal ikke kommunisere direkte med hemmelige KI-nøkler eller Supabase service credentials.

---

# 5. Arkitekturprinsipper

## 5.1 Serveren er tillitsgrensen

Frontend regnes ikke som et tilstrekkelig sikkerhetslag.

Serveren skal derfor håndtere:

- autentisering
- autorisering
- rollevalidering
- personverngateway
- KI-routing
- hemmelige nøkler
- modellvalg
- sikkerhetskontroller
- relevante adminfunksjoner

Dette gjør at en bruker ikke skal kunne omgå kritiske regler bare ved å endre JavaScript i nettleseren.

---

## 5.2 Privacy by design

Personvern er en del av arkitekturen, ikke bare en tekst i brukergrensesnittet.

Arkitekturen skal redusere risiko gjennom:

- personvernsjekk før KI-kall
- server-side kontroll
- klientbasert forhåndsvarsling
- dataminimering
- minst mulig logging av samtaleinnhold
- bruker-eid historikk
- separasjon mellom brukerdata og teknisk analyse

Prinsippet er:

> Anonymiser identitet, ikke nødvendig kontekst.

---

## 5.3 Defense in depth

Sikkerhet baseres ikke på ett enkelt tiltak.

Flere lag skal virke sammen:

```text
brukerinput
→ klientkontroll
→ autentisering
→ servervalidering
→ personverngateway
→ autorisasjon
→ KI/provider
→ kontrollert svar
```

---

## 5.4 Provider-uavhengighet

KI-integrasjonen skal ikke spre provider-spesifikk logikk gjennom hele applikasjonen.

Serveren skal fungere som et mellomlag mellom produktlogikken og KI-leverandøren.

Dette gjør det mulig å:

- bytte modell
- sammenligne modeller
- bruke OpenAI
- bruke OpenRouter
- senere koble til intern KI

Provider-uavhengigheten er delvis implementert og er også et framtidig arkitekturmål.

---

# 6. Frontend

## Teknologi

Frontend bruker:

- HTML
- CSS
- JavaScript

Sentrale filer:

- `index.html`
- `styles.css`
- `app.js`

## Ansvar

Frontend håndterer blant annet:

- navigasjon
- hovedtemaer og undertemaer
- situasjonsinput
- personvernfeedback
- visning av KI-svar
- oppfølgingsdialog
- simulator
- historikk
- adminvisninger
- innstillinger
- UI-tilstand

## Frontend skal ikke inneholde

- OpenAI API-nøkkel
- OpenRouter API-nøkkel
- Supabase service role key
- andre serverhemmeligheter

---

# 7. Applikasjonsserver

Backend kjører Node.js og Express.

Sentral fil:

`server.js`

## Ansvar

Serveren håndterer:

- autentisering
- session/cookies
- rollevalidering
- API-endepunkter
- personverngateway
- KI-integrasjon
- modellvalg
- historikkoperasjoner
- adminfunksjoner
- benchmarklogikk
- kostnads-/tokeninformasjon
- feilbehandling
- rate limiting
- sikkerhetsheadere
- origin-kontroll
- databasekommunikasjon

Serveren er dermed applikasjonens viktigste kontrollpunkt.

---

# 8. KI-dataflyt

En typisk KI-forespørsel følger denne flyten:

```text
Bruker skriver tekst
        │
        ▼
Frontend personvernkontroll
        │
        ▼
API-kall til server
        │
        ▼
Autentisering / tilgangssjekk
        │
        ▼
Server-side personverngateway
        │
        ▼
Kontekst bygges
        │
        ▼
Modell/provider velges
        │
        ▼
KI-kall
        │
        ▼
Svar mottas
        │
        ▼
Svar returneres til frontend
```

Dette er et viktig arkitekturvalg fordi personvernkontrollen dermed ikke bare er avhengig av klientkode.

---

# 9. Personverngateway

## Status

**Implementert og automatisert testet.**

Personverngatewayen skal redusere risikoen for at identifiserende informasjon sendes videre til KI.

Kontrollen håndterer blant annet:

- navn
- e-post
- telefonnummer
- fødselsopplysninger
- identifikatorer
- direkte familieopplysninger
- mulig identifiserende arbeidsinformasjon
- kjønnede formuleringer der nøytralisering er relevant

## Arkitekturmønster

```text
Input
→ klientkontroll
→ serverkontroll
→ KI
```

Klientkontrollen gir brukerfeedback.

Serverkontrollen er den endelige barrieren før KI-kall.

## Testbevis

`tests/test-privacy.js`

Siste kontroll:

**33/33 kontroller bestått**

---

# 10. KI-integrasjon

## Status

**Implementert.**

KI-laget mottar kontekst som kan omfatte:

- systeminstruks
- situasjonsbeskrivelse
- tema
- undertema
- samtalekontekst
- simulatorrolle
- relevant faglig kontekst

KI-laget brukes til:

- situasjonsforståelse
- hovedveiledning
- oppfølgingsdialog
- temaidentifikasjon
- simulering

---

# 11. KI-regler og responskontrakt

KI-atferd er ikke kun styrt gjennom kode.

Prosjektet bruker også eksplisitte instruksjoner og dokumenterte regler.

Sentrale dokumenter:

- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`
- `docs/ai/SAMTALEPARTNER-MODELL.md`

Disse brukes til å styre blant annet:

- tone
- forsiktighet
- faglig avgrensning
- diagnoser
- skyld
- spekulasjon
- simulering
- bruk av manglende informasjon

Dette er viktig fordi KI-systemets arkitektur består av både programkode og modellstyring.

---

# 12. Modell- og providerarkitektur

## Status

**Implementert i prototypeform.**

Serveren støtter konfigurerbare KI-modeller.

Providerlaget er utviklet for å redusere koblingen mellom applikasjonen og én enkelt leverandør.

Aktuelle providere:

- OpenAI
- OpenRouter

Hemmeligheter lagres kun server-side:

- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`

## Formål

Dette gjør det mulig å:

- teste ulike modeller
- sammenligne kvalitet
- sammenligne responstid
- sammenligne kostnad
- redusere provider-lock-in

---

# 13. Autentisering

## Status

**Implementert.**

Supabase brukes til autentisering.

Autentiseringsarkitekturen støtter blant annet:

- innlogging
- utlogging
- session
- lukket registrering
- invitasjoner
- brukere
- roller

Frontend skal ikke selv avgjøre om en bruker har adminrettigheter.

Rollebeskyttelse skal kontrolleres server-side.

---

# 14. Sessions og cookies

Sessions skal bruke sikre cookie-prinsipper.

Relevant konfigurasjon omfatter:

- HttpOnly
- Secure i produksjon
- SameSite
- server-side validering
- kontrollert levetid

Formålet er å redusere risikoen for at autentiseringsinformasjon blir tilgjengelig for klientkode eller misbrukes på tvers av nettsteder.

---

# 15. Roller og autorisasjon

Systemet støtter:

- `user`
- `editor`
- `admin`

## User

Ordinære brukerfunksjoner.

## Editor

Kan i tillegg redigere godkjent innhold.

## Admin

Har tilgang til utvidede drifts- og kvalitetsfunksjoner.

## Arkitekturregel

Tilgang skal ikke sikres bare ved å skjule knapper i frontend.

Sensitive endepunkter skal validere rolle på serveren.

---

# 16. Database

## Teknologi

Supabase PostgreSQL.

Databasefiler og migreringer ligger under:

`database/`

## Dataområder kan omfatte

- brukerdata
- roller
- samtalehistorikk
- innstillinger
- feedback
- innhold
- appinnstillinger
- modellkonfigurasjon
- test-/benchmarkdata
- brukertestsvar uten direkte bruker-ID
- separat deltakelsesmarkering for engangs brukertest

---

## Brukertest og frakoblet svarlagring

Brukertestsvar lagres i `survey_responses` uten `user_id`. En separat `survey_participation`-tabell markerer kun at en konto har gjennomført testen. Dette gjør det mulig å begrense én innsending per konto uten å lagre en direkte kobling mellom konto og evalueringssvar.

Designet er en personvernavveining: det reduserer kobling/profilering, men betyr også at et enkelt svar ikke senere kan identifiseres sikkert som tilhørende en bestemt konto.

# 17. Row Level Security

RLS brukes som et ekstra datalag for tilgangskontroll.

Hovedprinsipp:

> Brukeren skal ikke kunne lese eller endre en annen brukers personlige data bare fordi klienten kjenner en ID.

RLS kombineres med server-side validering.

Dette gir flere lag med beskyttelse.

---

# 18. Historikkarkitektur

## Status

**Implementert.**

Samtalehistorikk knyttes til riktig bruker.

Typisk dataflyt:

```text
innlogget bruker
→ server
→ autentisering
→ Supabase
→ RLS
→ brukerens samtaler
```

Historikk skal ikke være en global samling samtaler.

## Testbevis

`tests/test-history-hotfix.cjs`

---

# 19. Samtalesimulator

## Status

**Implementert og testet.**

Simulatoren bruker samme grunnarkitektur som øvrige KI-funksjoner:

```text
brukermelding
→ personvernkontroll
→ server
→ simulatorinstruks
→ KI
→ simulatorsvar
```

KI spiller medarbeiderrollen.

Simulatorreglene skal redusere risikoen for:

- oppdiktede diagnoser
- oppdiktede familieforhold
- unødvendig dramatikk
- fasitsvar til lederen

## Testbevis

`tests/test-simulation.js`

Siste kontroll:

**24/24 kontroller bestått**

---

# 20. Adminarkitektur

## Status

**Implementert.**

Adminområdet bruker samme applikasjon, men tilgang til kritiske funksjoner er rollebeskyttet.

Admin kan brukes til blant annet:

- rolleadministrasjon
- innholdsredigering
- modellvalg
- benchmark
- KI-feedback
- relevant systeminformasjon

Store adminseksjoner bruker progressiv visning for å redusere visuell kompleksitet.

---

# 21. Faggrunnlag og SOURCEBANK

## Status

**Implementert som dokumentert kildegrunnlag.**

Samtalestøtte har en dokumentert SOURCEBANK.

Sentrale filer:

- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/faggrunnlag/`

Faggrunnlaget brukes til:

- systeminstruksjoner
- faglige avgrensninger
- temaorientering
- kildevalg

Dette er ikke en full lokal RAG-løsning.

---

# 22. Web- og kildearkitektur

## Status

**Delvis / prototype.**

Prosjektet har funksjoner og arkitektur for kilde-/webrelatert analyse.

Målet er å kunne registrere relevant teknisk metadata uten å lagre selve personalsaken.

Mulig teknisk metadata:

- modell
- tidspunkt
- tema
- domene
- URL
- kildebruk

Samtaletekst skal ikke automatisk brukes som teknisk kildeanalyse.

Full kildeobservability er ikke definert som ferdig produksjonsfunksjon.

---

# 23. Benchmarkarkitektur

## Status

**Prototype/testform.**

Benchmarkfunksjonaliteten er bygget for å kunne sammenligne modeller på samme eller sammenlignbart testgrunnlag. Arkitekturen og testverktøyet er implementert i prototype/testform, men en full fler-modell-benchmark er ikke dokumentert som gjennomført.

Aktuelle måleområder:

- modell
- svar
- responstid
- tokenbruk
- kostnad
- feil
- kvalitet

Benchmarkdata skal behandles separat fra ordinær brukertrafikk der dette er relevant.

Sentrale spor:

- `data/BENCHMARK-CASES.json`
- `tests/test-model-compare.js`
- benchmarklogikk i app/server

---

# 24. Testarkitektur

Testing er en del av arkitekturen, ikke bare en sluttaktivitet.

Aktive tester ligger under:

`tests/`

Eksempler:

- `tests/test-privacy.js`
- `tests/test-simulation.js`
- `tests/test-ai.js`
- `tests/test-ai-stress.js`
- `tests/test-simulation-ai.js`
- `tests/test-model-compare.js`
- `tests/test-ai-golden.js`
- `tests/test-golden-schema.cjs`
- `tests/test-golden-utils.js`
- `tests/test-history-hotfix.cjs`
- `tests/test-bubble-cleanup.cjs`
- `tests/test-server-privacy.cjs`
- `tests/test-ui-regression.cjs`
- `tests/test-clipboard.cjs`

---

# 25. Testmiljø og autentisering

Automatiserte serverbaserte tester støtte på et konkret arkitekturproblem:

Testserveren fikk `401` på autentiserte endepunkter.

En mulig løsning ville vært å svekke autentisering generelt.

Dette ble avvist.

I stedet bruker serveren en eksplisitt test-only bypass som bare kan aktiveres når:

```text
NODE_ENV=test
TEST_AUTH_BYPASS=1
```

Dette gjør at testene kan kjøres uten å redusere sikkerheten i produksjonsmodus.

Dette er et eksempel på hvordan testbarhet er bygget inn uten å kompromittere ordinær tilgangskontroll.

---

# 26. Sikkerhetsarkitektur

Sikkerheten er delt i flere lag.

## Klient

- personvernvarsling
- inputvalidering
- ingen hemmelige nøkler
- begrenset teknisk feildetalj

## Server

- autentisering
- autorisering
- rollevalidering
- personverngateway
- rate limiting
- same-origin-kontroll
- sikkerhetsheadere
- feilbehandling
- KI-nøkler server-side

## Database

- RLS
- minst nødvendige rettigheter
- separate roller
- kontrollert bruk av service credentials

---

# 27. Rate limiting

Rate limiting brukes for å redusere risiko knyttet til:

- brute force
- misbruk
- automatiserte angrep
- unødvendige KI-kostnader

Særlig relevante områder er:

- innlogging
- registrering
- KI-kall
- benchmark
- passordrelaterte endepunkter

---

# 28. Feilhåndtering

Sluttbrukeren skal få forståelige feil.

Frontend skal ikke vise:

- stack trace
- API-hemmeligheter
- interne credentials
- unødvendige leverandørdetaljer

Tekniske logger kan inneholde:

- tidspunkt
- endpoint
- feilkode
- teknisk kategori

Samtaletekst skal ikke automatisk logges som teknisk feildata.

---

# 29. Observability og kostnad

## Status

**Prototype/testform.**

Systemet har arkitektur for å kunne registrere tekniske data som:

- modell
- tokenbruk
- estimert kostnad
- responstid
- feil

Formålet er:

- modellvalg
- debugging
- benchmark
- kostnadsvurdering

Full produksjonsobservability er ikke et krav for dagens leveranse.

---

# 30. Hosting

## Status

**Implementert for prototype.**

Nettversjonen bruker:

- Render for Node/Express
- Supabase for Auth/PostgreSQL
- ekstern KI-provider

Dette er valgt fordi det gir:

- enkel deploy
- rask testing
- lav terskel for prototype
- GitHub-basert arbeidsflyt

## Begrensning

Prototypehosting kan ha begrensninger som:

- dvale ved inaktivitet
- treg første oppstart
- ekstern tjenesteavhengighet

Dette regnes som prototypebegrensning og ikke som ønsket produksjonsytelse.

---

# 31. Teknologistack

## Frontend

- HTML
- CSS
- JavaScript

## Backend

- Node.js
- Express

## Database og autentisering

- Supabase
- PostgreSQL
- Supabase Auth
- RLS

## KI

- API-baserte språkmodeller
- OpenAI
- OpenRouter

## Hosting

- Render

## Versjonskontroll

- Git
- GitHub

---

# 32. Begrunnelse for teknologivalg

## Node.js / Express

Valgt fordi:

- samme språk kan brukes i frontend og backend
- enkel API-utvikling
- godt egnet til webprototype
- enkelt å integrere eksterne KI-tjenester

## Supabase

Valgt fordi:

- autentisering
- PostgreSQL
- RLS
- rask prototypeutvikling
- god støtte for brukerbaserte data

## Render

Valgt fordi:

- enkel deploy
- GitHub-integrasjon
- egnet for Node-applikasjon
- praktisk testmiljø

## Flere KI-modeller

Valgt fordi:

- kvalitet varierer
- pris varierer
- modellmarkedet endres raskt
- lock-in reduseres

---

# 33. Arkitekturvalg som ble endret gjennom utviklingen

Arkitekturen ble ikke bestemt fullstendig før første kode.

Flere valg oppstod gjennom testing.

## Personvern

**Tidligere:** sterkere avhengighet av klientkontroll.

**Problem:** frontend alene er ikke tilstrekkelig sikkerhetsbarriere.

**Endring:** server-side personverngateway.

---

## Autentisering

**Problem:** KI- og testflyt måtte fungere sammen med lukket innlogging.

**Endring:** autentisering og sessions ble gradvis strammet inn og korrigert.

---

## Database

**Problem:** KI-generert databaseoppsett fungerte ikke nødvendigvis korrekt i faktisk drift.

**Endring:** konkrete rettigheter og migreringer ble justert etter testing.

---

## Simulator

**Problem:** språkmodellen kunne fylle inn opplysninger brukeren aldri hadde gitt.

**Endring:** strengere simulatorregler og egne automatiserte tester.

---

## Testarkitektur

**Problem:** automatiserte tester ble stoppet av ordinær auth.

**Avvist løsning:** svekke produksjonsauth.

**Valgt løsning:** eksplisitt test-only bypass.

---

## Providerarkitektur

**Tidligere:** sterkere kobling til én provider.

**Endring:** modell- og providerlaget ble utvidet slik at flere modeller kunne testes og sammenlignes.

---

# 34. Arkitekturrisikoer

## KI-leverandør endrer pris eller API

Tiltak:

- providerabstraksjon
- modellkonfigurasjon
- flere modellalternativer

---

## KI gir feil svar

Tiltak:

- systemprompt
- responskontrakt
- faggrunnlag
- tester
- menneskelig ansvar

---

## Sensitive data sendes inn

Tiltak:

- klientkontroll
- serverkontroll
- dataminimering
- anonymiseringshjelp

---

## Databasefeil eller tilgangsfeil

Tiltak:

- server-side validering
- RLS
- migreringer
- testing

---

## Prosjektet blir for komplekst

Tiltak:

- tydelige lag
- dokumentasjon
- tester
- avgrensning mellom nåværende og framtidig arkitektur

---

# 35. Kjente arkitekturbegrensninger

Den leverte løsningen er en prototype.

En kjent vedlikeholdbarhetsbegrensning er at hovedfrontend, server og stilark fortsatt er relativt store filer. Ved siste kontroll var omtrentlige størrelser:

- `app.js`: ca. 3410 linjer etter uttrekk av statiske klientdata
- `server.js`: ca. 1600 linjer etter uttrekk av tema-/KI-kontrakter
- `styles.css`: ca. 6450 linjer
- `index.html`: ca. 900 linjer

Dette fungerer i dagens prototype og er dekket av regresjonstester, men en videre produksjonsmodning bør splitte ansvar i mindre moduler. En slik sen refaktorering er bevisst ikke gjort rett før levering fordi den ville økt regresjonsrisikoen uten å endre produktverdien.

Følgende er derfor ikke fullført som produksjonsarkitektur:

- full skaleringsarkitektur
- full produksjonsobservability
- lokal RAG
- intern KI
- intern SSO
- full offline-klient
- full produksjonsherding
- omfattende lasttesting
- høytilgjengelig infrastruktur

Disse områdene skal ikke fremstilles som implementert funksjonalitet.

---

# 36. Framtidig målarkitektur – lukket nettverk

En framtidig intern variant kan bygges slik:

```text
Intern klient
      │
      ▼
Samtalestøtte
intern applikasjonsserver
      │
      ├─────────────► Intern KI
      │
      ▼
Intern database
      │
      ▼
Lokal kunnskapsbank / RAG
```

I denne varianten kan eksterne komponenter erstattes:

| Nettprototype | Mulig intern variant |
|---|---|
| OpenAI/OpenRouter | intern LLM |
| Supabase | intern PostgreSQL |
| Supabase Auth | intern identitetsløsning/SSO |
| webkilder | lokal kunnskapsbank |
| Render | intern applikasjonsserver |

Dette er en **målarkitektur**, ikke en del av dagens implementerte leveranse.

---

# 37. Lokal RAG – framtidig arkitektur

En mulig framtidig kunnskapsflyt:

```text
brukerinput
→ personverngateway
→ dokumentoppslag
→ relevante godkjente tekstutdrag
→ intern KI
→ svar
```

Mulige lokale kilder:

- interne HR-rutiner
- lederhåndbøker
- sikkerhetsprosedyrer
- arbeidsrettslige veiledere
- virksomhetsgodkjente dokumenter

Dette er ikke implementert i dagens leveranse.

---

# 38. Testbarhet og sporbarhet

Arkitekturen skal være mulig å kontrollere gjennom konkrete repo-spor.

| Arkitekturområde | Bevis |
|---|---|
| Frontend | `app.js`, `index.html`, `styles.css` |
| Server | `server.js` |
| Database | `database/` |
| Personvern – klient | `tests/test-privacy.js` |
| Personvern – server | `tests/test-server-privacy.cjs` |
| Simulator | `tests/test-simulation.js` |
| Historikk | `tests/test-history-hotfix.cjs` |
| Server-personvern | `tests/test-server-privacy.cjs` |
| UI-regresjon | `tests/test-ui-regression.cjs` |
| KI-testing | `tests/test-ai.js` |
| KI-stresstest | `tests/test-ai-stress.js` |
| Golden/fasit | `tests/AI-GOLDEN-CASES.json`, `tests/test-ai-golden.js` |
| Golden struktur/matcher | `tests/test-golden-schema.cjs`, `tests/test-golden-utils.js` |
| Modelltesting | `tests/test-model-compare.js` |
| Faggrunnlag | `docs/faggrunnlag/` |
| KI-styring | `docs/ai/` |
| Kilder | `docs/SOURCEBANK.md`, `data/SOURCEBANK.json` |

---

# 39. Sammenheng med øvrige BMAD-dokumenter

Arkitekturen skal leses sammen med:

- `product-brief.md`
- `docs/bmad/PRD.md`
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md`
- `docs/bmad/UX-DESIGN-BMAD.md`
- `docs/bmad/EPICS-AND-STORIES-BMAD.md`

KI-prosess:

- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`

Sikkerhet:

- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md`

Testing:

- `docs/ai/AI-TESTPLAN.md`
- `tests/`

---

# 40. Arkitekturens kvalitetskriterier

Arkitekturen vurderes som vellykket dersom det kan svares ja på følgende:

1. Kan frontend kjøres uten at hemmelige KI-nøkler eksponeres?
2. Valideres kritisk tilgang server-side?
3. Går sentrale KI-input gjennom server-side personverngateway?
4. Er brukerhistorikk beskyttet per bruker?
5. Kan KI-modell endres uten å bygge hele løsningen på nytt?
6. Kan sentrale sikkerhets- og personvernregler testes?
7. Er testing mulig uten å svekke produksjonsauth?
8. Er tekniske data skilt fra unødvendig samtaleinnhold?
9. Er dagens arkitektur tydelig skilt fra framtidig offlinearkitektur?
10. Kan sensor finne konkrete kode- eller testspor for sentrale arkitekturvalg?

---

# 41. Oppsummering

Samtalestøtte er bygget som en lagdelt KI-basert webapplikasjon.

Den leverte arkitekturen består hovedsakelig av:

```text
Frontend
→ Node/Express
→ sikkerhet/personvern
→ KI/provider
→ Supabase
```

De viktigste arkitekturvalgene er:

- server-side kontroll
- privacy by design
- flere sikkerhetslag
- brukerbeskyttet data
- KI-regler i tillegg til programkode
- testbarhet
- provider-uavhengighet
- tydelig skille mellom faktisk leveranse og framtidig arkitektur

Arkitekturen har blitt utviklet iterativt og endret som følge av testing og feilretting.

Det betyr at dokumentet ikke beskriver en idealisert plan som aldri ble prøvd, men den arkitekturen prosjektet faktisk har utviklet fram til versjon 20.11.0.

Framtidige mål som intern KI, lokal RAG og lukket nettverk er dokumentert separat og fremstilles ikke som ferdige deler av dagens leveranse.

# 39. Sensor-demo og kjørbarhet uten eksterne tjenester

Produksjonsarkitekturen bruker Supabase og ekstern KI-provider. For at repoet samtidig skal kunne vurderes lokalt uten studentens nøkler, betalte kontoer eller egen infrastruktur, finnes en separat test-/demoadapter:

- `scripts/sensor-demo.js`
- startes med `npm run demo`
- bruker samme `index.html`, `app.js`, `styles.css` og bildeassets som hovedproduktet
- emulerer autentisering, historikk og sentrale KI-endepunkter i minnet
- returnerer eksplisitt deterministiske mock-svar
- gjør ingen eksterne KI- eller databasekall
- endrer ikke produksjonsserveren eller produksjonsautentiseringen

Demomodus skal derfor brukes til å kontrollere brukerflyt og lokal kjørbarhet. Den skal ikke brukes som bevis på faglig kvalitet i de ekte KI-svarene; dette dokumenteres gjennom live KI-tester, golden/fasit og publisert testversjon.

Regresjonstest: `tests/test-sensor-demo.cjs`.


## Nested frontend-assets og eksplisitt allowlist

Sluttkontroll av produksjonsserveren avdekket at allowlisten inneholdt filer under `assets/images/`, mens den opprinnelige Express-ruten bare matchet ett path-segment. Dette kunne gjøre nested assets utilgjengelige fra dagens `server.js`.

Ruten ble endret til å kontrollere hele request-pathen mot samme eksplisitte allowlist. Sikkerhetsprinsippet er dermed beholdt:

- bare eksplisitt godkjente frontendfiler kan serveres
- `.env`, tester, dokumentasjon og databasefiler er fortsatt ikke offentlig tilgjengelige
- nested bilder under `assets/images/` kan faktisk nås

Dette kontrolleres av `tests/test-public-assets.cjs`, som starter produksjonsserveren i testmiljø og verifiserer både tillatte og blokkerte filer.


## Kontrollert modularisering

I utviklingsfasen fram til 26.10.2026 ble den dokumenterte vedlikeholdbarhetsgjelden redusert uten å gjennomføre en stor omskriving.

Følgende ansvar ble flyttet ut:

- `src/client-data.js`: statiske SVG-ikoner og tema-/undertemakatalog for frontend
- `src/server/topic-contracts.js`: serverens temakatalog og klassifiseringsschema
- `src/server/ai-schemas.js`: strukturskjema for analyse og veiledning

Resultat:

- `app.js` ble redusert fra ca. 3605 til ca. 3411 linjer
- `server.js` ble redusert fra ca. 1776 til ca. 1600 linjer

Autentisering, databaseflyt og levende UI-state ble bevisst ikke flyttet i denne modulariseringsrunden. Målet var å redusere ansvar i hovedfilene med lav regresjonsrisiko, ikke å maksimere antall moduler mens prosjektet fortsatt var under aktiv utvikling.

Samtidig ble produksjonsserverens håndtering av nested frontend-assets korrigert og dekket med en egen integrasjonstest.


## Verifisering etter modularisering

Etter uttrekk av klientdata, serverens temakontrakt og KI-skjemaer ble hele den deterministiske regresjonspakken kjørt på nytt med `npm test`.

Resultat: **alle tester grønne**.

Dette inkluderte blant annet:

- syntakskontroll av hovedfiler og nye moduler
- personvern 33/33
- simulator 24/24
- server-personvern
- UI-regresjon og UU-kontroller
- historikk, snakkeboble og clipboard
- golden-schema 9/9 og matcher-regresjon
- lokal sensordemo
- integrasjonstest for offentlige frontend-assets
- repo-struktur
- package-lock-konsistens

Modulariseringen beholdes derfor som en verifisert arkitekturforbedring og ikke som en utestet endring.


# Produksjonstillegg – PWA-arkitektur i v20.11.0

PWA-funksjonaliteten er lagt som et klientnært installasjons- og cachelag over den eksisterende webarkitekturen:

    Nettleser / installert PWA
            |
            +-- manifest.webmanifest + appikoner
            +-- sw.js (app-shell/cache)
            |
            v
    HTML/CSS/JavaScript
            |
            v
    Node/Express -> Supabase / KI-provider

Service workeren cacher bare eksplisitte frontendressurser og skal ikke fungere som cache for API-kall eller ikke-GET-forespørsler. Dette reduserer risikoen for at autentiserte eller dynamiske API-svar blir liggende i app-shell-cachen. Produksjonsserverens vanlige sikkerhets- og personverngrenser gjelder uendret når løsningen åpnes som installert PWA.

PWA-laget endrer dermed distribusjonsopplevelsen, men ikke tillitsgrensen: serveren er fortsatt kontrollpunkt for autentisering, autorisasjon, personverngateway, hemmeligheter og KI-kall.
