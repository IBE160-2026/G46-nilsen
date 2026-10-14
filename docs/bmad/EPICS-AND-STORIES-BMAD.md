# Epics & User Stories – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Epics & User Stories  
**Rammeverk:** BMAD  
**Status:** Revidert med faktisk leveransestatus  
**Versjon ved dokumentasjon:** 20.10.3  
**Språk:** Norsk

---

# 1. Formål

Dette dokumentet bryter Samtalestøtte ned i større utviklingsområder (epics) og konkrete user stories.

Dokumentet er revidert etter iterativ utvikling og viser derfor både:

- hva som faktisk er implementert
- hva som er delvis/prototypebasert
- hva som er videre arbeid

Målet er å gjøre sammenhengen mellom:

**behov → story → implementasjon → test → leveransestatus**

tydelig og etterprøvbar.

---

# 2. Statuskategorier

Stories merkes med:

- **IMPLEMENTERT** – finnes i levert prototype
- **IMPLEMENTERT OG TESTET** – finnes og har eksplisitt testbevis
- **PROTOTYPE/DELVIS** – deler finnes, men området er ikke ferdig produksjonsfunksjon
- **VIDERE ARBEID** – planlagt, men ikke del av ferdig leveranse

---

# Epic 1 – Grunnstruktur og brukeropplevelse

## Story 1.1 – Hovedlayout

**Status:** IMPLEMENTERT

**Som bruker** vil jeg ha en tydelig hovedlayout slik at jeg raskt forstår hvor jeg skal navigere.

### Akseptansekriterier

- sidemeny finnes
- hovedinnhold er tydelig separert
- navigasjon er konsistent
- logo brukes konsekvent
- layout fungerer på relevante skjermstørrelser

### Spor

- `index.html`
- `styles.css`
- `app.js`

---

## Story 1.2 – Lys, mørk og hybrid visning

**Status:** IMPLEMENTERT

**Som bruker** vil jeg kunne bruke en visning som passer situasjonen min.

### Akseptansekriterier

- lys visning fungerer
- mørk visning fungerer
- hybridvisning fungerer
- sentrale komponenter forblir lesbare

---

## Story 1.3 – Sammenleggbare seksjoner

**Status:** IMPLEMENTERT

**Som bruker** vil jeg kunne åpne og lukke innholdsseksjoner slik at grensesnittet ikke oppleves overfylt.

### Akseptansekriterier

- sammenleggbare områder er visuelt forståelige
- chevron/indikator viser at innhold kan åpnes
- sekundære sider bruker progressiv visning der dette er hensiktsmessig

---

# Epic 2 – Temaer og situasjonsforståelse

## Story 2.1 – Hovedtemaer

**Status:** IMPLEMENTERT

**Som leder** vil jeg kunne orientere meg gjennom relevante samtaletemaer.

### Akseptansekriterier

Ni hovedtemaer finnes:

1. Alkohol og rus
2. Fravær og oppfølging
3. Prestasjon og utvikling
4. Lønn og utvikling
5. Samarbeid og kommunikasjon
6. Avslutning av arbeidsforhold
7. Sikkerhet og ansvar
8. Livssituasjoner
9. Mobbing og trakassering

### Spor

- `app.js`
- `index.html`
- `docs/faggrunnlag/`

---

## Story 2.2 – Situasjon i egne ord

**Status:** IMPLEMENTERT

**Som leder** vil jeg beskrive situasjonen med egne ord slik at jeg slipper omfattende skjemaer.

### Akseptansekriterier

- fritekstfelt finnes
- få obligatoriske felt
- personvernkontroll kjøres
- teksten kan brukes som KI-kontekst

---

## Story 2.3 – Temaidentifikasjon

**Status:** IMPLEMENTERT

**Som bruker** vil jeg få forslag til relevant tema og undertema.

### Akseptansekriterier

- KI kan foreslå tema
- KI kan foreslå undertema
- bruker kan korrigere forslag
- løsningen kan gå videre uten unødvendige mellomsteg

---

# Epic 3 – Personvern

## Story 3.1 – Personvernsjekk i klient

**Status:** IMPLEMENTERT

**Som bruker** vil jeg få beskjed dersom teksten kan identifisere en person.

### Akseptansekriterier

Kontrollen kan reagere på blant annet:

- navn
- e-post
- telefon
- fødselsopplysninger
- identifikatorer
- relevante familieopplysninger
- mulig identifiserende arbeidsinformasjon

---

## Story 3.2 – Server-side personverngateway

**Status:** IMPLEMENTERT OG TESTET

**Som systemeier** vil jeg at serveren kontrollerer tekst før KI-kall slik at frontend ikke er eneste sikkerhetsbarriere.

### Akseptansekriterier

- sentrale KI-flyter går gjennom serverkontroll
- personvernbrudd kan stoppe KI-kall
- kontrollen kan ikke omgås bare ved å manipulere klientkode

### Testbevis

`tests/test-privacy.js`

Siste kontroll:

**33/33 bestått**

---

## Story 3.3 – Personvernhjelp

**Status:** IMPLEMENTERT

**Som bruker** vil jeg få hjelp til å generalisere teksten uten å miste nødvendig kontekst.

### Prinsipp

> Anonymiser identitet, ikke nødvendig kontekst.

---

# Epic 4 – KI-basert samtalestøtte

## Story 4.1 – Hovedveiledning

**Status:** IMPLEMENTERT

**Som leder** vil jeg få strukturert støtte slik at jeg kan forberede samtalen.

### Veiledningen kan inneholde

- mål
- struktur
- åpning
- relevante spørsmål
- mulige reaksjoner
- hvordan reaksjoner kan møtes
- videre steg

### Spor

- `server.js`
- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`

---

## Story 4.2 – Faglige begrensninger

**Status:** IMPLEMENTERT

**Som bruker** vil jeg at KI-en skal være forsiktig der den ikke har grunnlag for bastante konklusjoner.

### Akseptansekriterier

- ingen oppdiktede diagnoser
- ingen automatiske skyldkonklusjoner
- ingen automatisk HR-beslutning
- faglig eller juridisk bistand anbefales når relevant
- usikkerhet kommuniseres tydelig

---

# Epic 5 – Oppfølgingsdialog

## Story 5.1 – Fortsett samtalen

**Status:** IMPLEMENTERT

**Som bruker** vil jeg kunne stille oppfølgingsspørsmål.

### Akseptansekriterier

- relevant kontekst beholdes
- nye innspill personvernsjekkes
- svar kan bygge på tidligere dialog
- unødvendig repetisjon begrenses

---

## Story 5.2 – Ny samtale uten gammel kontekst

**Status:** IMPLEMENTERT

**Som bruker** vil jeg at en ny samtale starter rent.

### Akseptansekriterier

- gammel sak skal ikke lekke inn i ny sak
- relevant samtaletilstand nullstilles

---

# Epic 6 – Samtalesimulering

## Story 6.1 – Start simulering

**Status:** IMPLEMENTERT

**Som leder** vil jeg øve på samtalen før den gjennomføres.

### Akseptansekriterier

- simulator kan åpnes
- situasjon brukes som kontekst
- KI spiller medarbeider

---

## Story 6.2 – Realistisk medarbeiderrolle

**Status:** IMPLEMENTERT OG TESTET

**Som bruker** vil jeg at medarbeideren reagerer realistisk uten å dikte opp vesentlige fakta.

### Akseptansekriterier

KI kan uttrykke eksempelvis:

- motstand
- frustrasjon
- usikkerhet
- sorg
- taushet
- samarbeid

KI skal ikke automatisk dikte opp:

- diagnose
- familieforhold
- hendelser
- motiv

---

## Story 6.3 – Samtalekontekst

**Status:** IMPLEMENTERT OG TESTET

**Som bruker** vil jeg at dialogen skal henge sammen over flere meldinger.

### Testbevis

`tests/test-simulation.js`

Siste kontroll:

**24/24 bestått**

---

## Story 6.4 – Refleksjon

**Status:** IMPLEMENTERT

**Som bruker** vil jeg kunne reflektere over hvordan samtalen gikk.

Refleksjon kan omfatte:

- hva som fungerte
- alternative formuleringer
- hva som kunne gjøres annerledes
- neste steg

---

# Epic 7 – Autentisering

## Story 7.1 – Innlogging

**Status:** IMPLEMENTERT

**Som bruker** vil jeg logge inn slik at mine data tilhører meg.

### Akseptansekriterier

- gyldig bruker kan logge inn
- ugyldig innlogging avvises
- session beholdes
- logout fungerer

---

## Story 7.2 – Lukket registrering

**Status:** IMPLEMENTERT

**Som systemeier** vil jeg kontrollere hvem som kan opprette konto.

### Akseptansekriterier

- registrering krever invitasjon
- ugyldig invitasjon avvises
- invitasjon kan ha begrenset levetid
- invitasjonen gir definert rolle

---

# Epic 8 – Roller og tilgang

## Story 8.1 – User, editor og admin

**Status:** IMPLEMENTERT

**Som administrator** vil jeg skille brukerroller slik at personer kun får nødvendige rettigheter.

Roller:

- `user`
- `editor`
- `admin`

### Akseptansekriterier

- rollene finnes
- kritisk tilgang sjekkes server-side
- frontend alene avgjør ikke rettighet

---

# Epic 9 – Historikk

## Story 9.1 – Lagre samtale

**Status:** IMPLEMENTERT

**Som bruker** vil jeg kunne lagre samtalen og finne den igjen.

---

## Story 9.2 – Åpne egen historikk

**Status:** IMPLEMENTERT

**Som bruker** vil jeg bare se mine egne samtaler.

### Akseptansekriterier

- brukerdata knyttes til riktig konto
- andre brukeres historie skal ikke være tilgjengelig
- RLS/serverkontroll brukes

---

## Story 9.3 – Slette historikk

**Status:** IMPLEMENTERT

**Som bruker** vil jeg kunne slette egne samtaledata.

---

## Testbevis

`tests/test-history-hotfix.cjs`

---

# Epic 10 – Feedback og feilrapportering

## Story 10.1 – Rapporter KI-svar

**Status:** IMPLEMENTERT

**Som bruker** vil jeg rapportere et problematisk KI-svar.

### Rapport kan inneholde

- kategori
- kommentar
- modell
- tidspunkt
- teknisk referanse

Samtaleinnhold skal ikke legges ved automatisk.

---

## Story 10.2 – Frivillig samtalevedlegg

**Status:** IMPLEMENTERT

**Som bruker** vil jeg aktivt kunne velge om samtalen skal følge med en rapport.

### Akseptansekriterier

- opt-in
- av som standard
- personvernkontroll før innsending

---

## Story 10.3 – Teknisk feilrapportering

**Status:** IMPLEMENTERT / PROTOTYPE

**Som bruker** vil jeg kunne rapportere teknisk feil uten å måtte forstå tekniske detaljer.

Teknisk metadata kan omfatte:

- versjon
- tidspunkt
- side/funksjon
- feilkategori
- nettleser

Samtaletekst skal ikke automatisk inkluderes.

---

# Epic 11 – Admin

## Story 11.1 – Admin-dashboard

**Status:** IMPLEMENTERT

**Som administrator** vil jeg ha tilgang til relevante drifts- og kvalitetsfunksjoner.

Området kan omfatte:

- roller
- innhold
- modeller
- benchmark
- KI-feedback
- kostnadsinformasjon
- kilde-/systeminformasjon

---

## Story 11.2 – Sammenleggbare adminseksjoner

**Status:** IMPLEMENTERT

**Som administrator** vil jeg kunne minimere store seksjoner.

### Akseptansekriterier

- seksjoner kan åpnes og lukkes
- `Rediger innhold` er lukket som standard
- adminområdet skal ikke bli visuelt unødvendig tungt

---

## Story 11.3 – Redigerbart innhold

**Status:** IMPLEMENTERT

**Som editor eller admin** vil jeg kunne endre godkjent innhold uten å endre kildekode.

---

# Epic 12 – Modell- og providerstyring

## Story 12.1 – Velg KI-modell

**Status:** IMPLEMENTERT I PROTOTYPEFORM

**Som administrator** vil jeg kunne velge støttet KI-modell uten å endre applikasjonskoden.

### Akseptansekriterier

- støttede modeller finnes
- aktiv modell kan velges
- modellvalg håndteres på server/database-nivå

---

## Story 12.2 – Flere providere

**Status:** IMPLEMENTERT I PROTOTYPEFORM

**Som systemeier** vil jeg redusere avhengigheten av én KI-leverandør.

Aktuelle providere:

- OpenAI
- OpenRouter

Dette gjør det også enklere å vurdere intern KI senere.

---

# Epic 13 – KI-testing

## Story 13.1 – Automatisk KI-test

**Status:** IMPLEMENTERT

**Som systemeier** vil jeg teste KI-svar systematisk.

### Spor

- `tests/test-ai.js`
- `tests/test-ai-stress.js`
- `tests/test-ai-golden.js`
- `tests/AI-GOLDEN-CASES.json`
- `tests/test-golden-schema.cjs`
- `tests/test-golden-utils.js`
- `tests/cases/`

Siste verifiserte golden-kjøring mot GPT-5.6 Luna: **9/9 OK**, 0 bør sjekkes, 0 kritiske avvik og 0 tekniske feil.

---

## Story 13.2 – Stresstest

**Status:** IMPLEMENTERT

**Som systemeier** vil jeg teste krevende personalsaker slik at svakheter kan oppdages.

---

## Story 13.3 – Test selve testlogikken

**Status:** IMPLEMENTERT SOM ARBEIDSMÅTE

**Som systemeier** vil jeg kunne korrigere tester som gir falske resultater.

Konkrete eksempler:

- `skyld` ga falsk kritisk treff selv når KI-en eksplisitt avviste skyldkonklusjon
- `lat` ble feilaktig funnet som delstreng i `arbeidsrelatert`
- en grønn Livssituasjoner-case viste seg semantisk å teste prestasjon/sikkerhet mer enn Livssituasjoner
- en rapport viste ikke nok av KI-svaret til at menneskelig fasit kunne etterprøves

Dette førte til mer kontekstbevisst testlogikk, helords-/frasematching, strengere temadekning og bedre rapportering for manuell vurdering.

---

# Epic 14 – Modellbenchmark

## Story 14.1 – Faste benchmark-caser

**Status:** PROTOTYPE/TESTFORM

**Som systemeier** vil jeg bruke samme testgrunnlag på flere modeller.

### Spor

- `data/BENCHMARK-CASES.json`

---

## Story 14.2 – Sammenlign modeller

**Status:** PROTOTYPE/TESTFORM

**Som systemeier** vil jeg kunne sammenligne modeller på:

- kvalitet
- responstid
- kostnad
- tokenbruk
- stabilitet

### Spor

`tests/test-model-compare.js`

Verktøyet er implementert, men full fler-modell-sammenligning er ikke dokumentert som gjennomført.

---

## Story 14.3 – Blind sammenligning

**Status:** IMPLEMENTERT I TESTFORM

**Som evaluator** vil jeg kunne vurdere svar uten at modellnavnet påvirker vurderingen.

---

# Epic 15 – Kostnad og teknisk måling

## Story 15.1 – Token- og kostnadsdata

**Status:** PROTOTYPE/TESTFORM

**Som systemeier** vil jeg kunne vurdere KI-kostnad slik at modellvalg ikke bare baseres på kvalitet.

Aktuelle data:

- modell
- input/output tokens
- estimert kostnad
- responstid

---

## Story 15.2 – Kostnad som beslutningsgrunnlag

**Status:** PROTOTYPE/VIDERE ANALYSE

**Som produkteier** vil jeg kunne sammenligne kostnad og kvalitet mellom modeller.

Full økonomisk produktmodell er ikke del av dagens leveranse.

---

# Epic 16 – SOURCEBANK og faggrunnlag

## Story 16.1 – Dokumentert fagbank

**Status:** IMPLEMENTERT

**Som systemeier** vil jeg ha et dokumentert faggrunnlag.

### Spor

- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/faggrunnlag/`

---

## Story 16.2 – Temaorientert faggrunnlag

**Status:** IMPLEMENTERT

**Som systemeier** vil jeg ha egne faggrunnlag for hovedtemaene slik at KI-styringen kan bygge på relevant kontekst.

---

# Epic 17 – Web- og kildeanalyse

## Story 17.1 – Kontrollert webbruk

**Status:** DELVIS / PROTOTYPE

**Som systemeier** vil jeg kunne hente oppdatert ekstern informasjon når det er nødvendig.

Dette skal ikke forstås som at alle svar alltid bruker web.

---

## Story 17.2 – Kildeanalyse

**Status:** DELVIS / PROTOTYPE

**Som administrator** vil jeg kunne analysere hvilke kilder systemet bruker.

Mulig metadata:

- modell
- tema
- domene
- URL
- tidspunkt

---

## Story 17.3 – Ingen brukerprofilering

**Status:** ARKITEKTURKRAV

**Som bruker** vil jeg at teknisk kildeanalyse ikke brukes til å rekonstruere personalsaken min.

### Akseptansekriterier

- samtaletekst lagres ikke automatisk i slik analyse
- direkte identitet skal unngås der den ikke er nødvendig

---

# Epic 18 – Sikkerhet

## Story 18.1 – Sikre sessions

**Status:** IMPLEMENTERT

### Krav

- HttpOnly
- Secure i produksjon
- SameSite
- server-side verifisering

---

## Story 18.2 – Rate limiting

**Status:** IMPLEMENTERT

**Som systemeier** vil jeg redusere misbruk og kostnadsangrep.

---

## Story 18.3 – Hemmeligheter server-side

**Status:** IMPLEMENTERT

**Som systemeier** vil jeg hindre at KI- eller databasehemmeligheter eksponeres i frontend.

---

## Story 18.4 – Begrenset statisk eksponering

**Status:** IMPLEMENTERT PÅ PROTOTYPENIVÅ

Serverkode, tester, SQL-filer og hemmeligheter skal ikke eksponeres som ordinære frontendressurser.

---

# Epic 19 – Testbar autentisering

## Story 19.1 – Automatiserte tester uten å svekke produksjonsauth

**Status:** IMPLEMENTERT

**Som utvikler** vil jeg kunne kjøre automatiserte servertester uten å fjerne ordinær autentisering.

### Bakgrunn

Automatiserte tester fikk `401` på autentiserte endepunkter.

Å svekke produksjonsautentiseringen ble avvist.

### Valgt løsning

Test-only bypass aktiveres kun når:

```text
NODE_ENV=test
TEST_AUTH_BYPASS=1
```

### Resultat

- tester kan kjøre
- produksjonsauth beholdes

Dette er et konkret eksempel på kritisk vurdering av en teknisk løsning.

---

# Epic 20 – UI-regresjon

## Story 20.1 – Beskytt etablerte UI-komponenter

**Status:** IMPLEMENTERT SOM TEST-/ARBEIDSPRAKSIS

**Som produkteier** vil jeg unngå at nye KI-genererte endringer ødelegger godkjent design.

### Viktige komponenter

- logo
- samtalebobler
- sidemeny
- adminseksjoner
- tema- og overskriftsstruktur

---

## Story 20.2 – Korriger feil test fremfor fungerende kode

**Status:** GJENNOMFØRT

En samtalebobletest feilet fordi den krevde en gammel CSS-kommentar.

Produksjonskoden fungerte.

Den foreldede testen ble derfor korrigert i stedet for å endre fungerende UI.

### Spor

`tests/test-bubble-cleanup.cjs`

---

# Epic 21 – Brukertesting

## Story 21.1 – Test hovedflyten med brukere

**Status:** DELVIS / VIDERE ARBEID

**Som produkteier** vil jeg få reelle brukere til å prøve løsningen slik at problemer som automatiserte tester ikke finner kan avdekkes.

Aktuelle områder:

- navigasjon
- samtaleflyt
- KI-kvalitet
- simulator
- personvernforståelse
- historikk

---

## Story 21.2 – Strukturert testfeedback

**Status:** IMPLEMENTERT/PROTOTYPE

Testbrukere kan gi strukturert tilbakemelding.

Fullskala brukertesting er fortsatt videre arbeid.

---

# Epic 22 – Repo og leveranse

## Story 22.1 – Ryddig prosjektstruktur

**Status:** IMPLEMENTERT

**Som evaluator** vil jeg forstå repoet raskt.

Struktur:

- `assets/`
- `data/`
- `database/`
- `docs/`
- `tests/`

Gamle og overflødige filer er ryddet bort, mens Git-historikken er beholdt.

---

## Story 22.2 – Kjørbar README

**Status:** IMPLEMENTERT

**Som evaluator** vil jeg kunne følge README for å forstå og kjøre prosjektet.

### Spor

`README.md`

---

## Story 22.3 – Sporbar utviklingshistorikk

**Status:** IMPLEMENTERT

**Som evaluator** vil jeg kunne følge utviklingen gjennom Git.

Git-historikken viser blant annet:

- tidlige prototyper
- personvernendringer
- KI-integrasjon
- testing
- simulator
- autentisering
- admin
- benchmark
- BMAD
- feilrettinger
- revert
- sluttkvalitetssikring

Tidlige versjoner ble utviklet før prosjektet var koblet til Git/GitHub og ble senere lagt inn i repository.

---

# Epic 23 – Framtidig lukket/offline løsning

## Story 23.1 – Intern KI

**Status:** VIDERE ARBEID

**Som virksomhet** vil jeg på sikt kunne bruke intern KI uten ekstern API.

---

## Story 23.2 – Intern database og identitet

**Status:** VIDERE ARBEID

En framtidig variant kan bruke:

- intern PostgreSQL
- intern identitetsløsning
- SSO

---

## Story 23.3 – Lokal kunnskapsbank/RAG

**Status:** VIDERE ARBEID

En framtidig lukket variant kan bruke lokale godkjente dokumenter i stedet for ekstern webtilgang.

Dette er ikke del av dagens implementerte leveranse.

---

# 24. Definition of Done

En story regnes som ferdig når relevante krav er oppfylt.

For implementerte stories skal følgende vurderes:

- funksjonen virker
- akseptansekriteriene er vurdert
- relevant personvern er vurdert
- relevant sikkerhet er vurdert
- funksjonen er testet på egnet nivå
- kjente kritiske regresjoner er håndtert
- dokumentasjon er oppdatert
- status i BMAD-dokumentasjonen samsvarer med faktisk leveranse

Ikke alle stories krever samme type test.

Eksempel:

- ren UX-story kan kreve visuell/manuell kontroll
- personverngateway krever automatiserte tester
- KI-kvalitet krever både automatiserte og menneskelige vurderinger

---

# 25. Sporbarhetsmatrise

| Epic | Status | Viktigste bevis |
|---|---|---|
| 1 UX/layout | Implementert | `index.html`, `styles.css`, `app.js` |
| 2 Tema/situasjon | Implementert | app + faggrunnlag |
| 3 Personvern | Implementert/testet | `tests/test-privacy.js` |
| 4 KI-veiledning | Implementert | server + KI-dokumentasjon |
| 5 Oppfølging | Implementert | app/server |
| 6 Simulator | Implementert/testet | `tests/test-simulation.js` |
| 7 Autentisering | Implementert | Supabase/server |
| 8 Roller | Implementert | server/admin |
| 9 Historikk | Implementert | Supabase + regresjonstest |
| 10 Feedback | Implementert | app/server |
| 11 Admin | Implementert | app/server |
| 12 Modell/provider | Prototype | server/admin |
| 13 KI-testing | Implementert | `tests/` |
| 14 Benchmark | Prototype/test | benchmarkdata/tests |
| 15 Kostnad | Prototype/test | modell-/benchmarklogikk |
| 16 SOURCEBANK | Implementert | `docs/`, `data/` |
| 17 Web/kilde | Delvis/prototype | server/admin |
| 18 Sikkerhet | Implementert på prototypenivå | server + sikkerhetsdokument |
| 19 Test-auth | Implementert | server + tester |
| 20 UI-regresjon | Implementert | regresjonstester |
| 21 Brukertesting | Delvis | testopplegg |
| 22 Repo/leveranse | Implementert | README/Git |
| 23 Lukket løsning | Videre arbeid | arkitekturdokument |

---


## 25.1 End-to-end-sporbarhet

Tabellen viser den røde tråden fra produktbehov via krav og arkitektur til implementasjon/test.

| Produktbehov | PRD | Arkitektur | Epic/Story | Implementasjon / testbevis |
|---|---|---|---|---|
| Situasjonsbasert KI-støtte | FR-01, FR-03, AI-01 | 8, 10, 11 | Epic 2, Epic 4 | `app.js`, `server.js`, `tests/test-ai.js`, golden-test |
| Personvern før KI-kall | FR-06, NFR-02 | 9, 26 | Epic 3 | `tests/test-privacy.js`, `tests/test-server-privacy.cjs` |
| Samtaletrening | FR-05, AI-02, AI-03 | 19 | Epic 6 | simulator i app/server, `tests/test-simulation.js` |
| Innlogging og egen historikk | FR-07, FR-09 | 13, 16–18 | Epic 7, Epic 9 | Supabase/server, `tests/test-history-hotfix.cjs` |
| Rollebasert administrasjon | FR-11, FR-12 | 15, 20 | Epic 8, Epic 11 | app/server/adminlogikk |
| Flere modeller/provider | FR-13, AI-06 | 12 | Epic 12 | modellabstraksjon i `server.js` |
| Systematisk KI-kvalitet | FR-15, AI-01–04 | 24, 25 | Epic 13 | KI-/stress-/golden-tester, 9/9 siste golden |
| Modellbenchmark | FR-14 | 23 | Epic 14 | `data/BENCHMARK-CASES.json`, `tests/test-model-compare.js` – prototype/testform |
| Faglig grunnlag og kilder | FR-16, FR-18 | 21, 22 | Epic 16, Epic 17 | `data/SOURCEBANK.json`, `docs/faggrunnlag/`, serverlogikk |
| Sikkerhetsherding | NFR-01, NFR-04 | 26–30 | Epic 18, Epic 19 | rate limit, headers, same-origin, test-auth, sikkerhetsdokument |
| Sensor-kjørbar leveranse | NFR-05 | 24, 30, 38 | Epic 22 | README, `npm test`, publisert testversjon |
| Lukket/offline retning | videre mål | 35–37 | Epic 23 | dokumentert framtidig arkitektur, ikke implementert |

Denne matrisen er en navigasjonshjelp. Detaljerte krav og statuser ligger fortsatt i PRD og de enkelte Epic/Story-seksjonene.

---

# 26. Sammenheng med BMAD

Stories skal leses sammen med:

- `product-brief.md`
- `docs/bmad/PRD.md`
- `docs/bmad/ARCHITECTURE-BMAD.md`
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md`
- `docs/bmad/UX-DESIGN-BMAD.md`

KI-utvikling:

- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`

Testing:

- `docs/ai/AI-TESTPLAN.md`
- `tests/`

Historisk utvikling:

- `CHANGELOG.md`
- Git commit-historikken

---

# 27. Oppsummering

Epics og stories viser hvordan Samtalestøtte har utviklet seg fra en enkel prototype til en betydelig mer kompleks KI-applikasjon.

Kjernefunksjonene som er implementert omfatter:

- situasjonsanalyse
- samtalestøtte
- personverngateway
- simulator
- autentisering
- historikk
- roller
- admin
- faggrunnlag
- KI-testing
- modell-/providerarbeid

Prosjektet har også prototypeområder knyttet til:

- benchmark
- kostnadsanalyse
- kildeanalyse

Og eksplisitt framtidig arbeid knyttet til:

- større brukertesting
- lokal RAG
- intern KI
- lukket nettverk

Denne statusdelingen gjør at dokumentet kan sammenlignes direkte med kode, tester og faktisk levert applikasjon uten at framtidige ambisjoner framstår som ferdig implementert funksjonalitet.