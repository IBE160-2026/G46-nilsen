# Product Requirements Document – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Product Requirements Document  
**Rammeverk:** BMAD  
**Status:** Revidert PRD med leveransestatus  
**Versjon ved dokumentasjon:** 20.10.9  
**Språk:** Norsk

---

# 1. Formål

Samtalestøtte er en KI-basert webapplikasjon for ledere som skal forberede og øve på krevende samtaler med medarbeidere.

Løsningen skal gi praktisk støtte til:

- å strukturere situasjonen
- forberede samtalen
- finne relevante spørsmål og formuleringer
- vurdere mulige reaksjoner
- øve gjennom samtalesimulering
- reflektere over videre oppfølging

KI skal støtte lederens vurderinger, ikke overta beslutningsansvaret.

Produktet skal derfor kombinere praktisk KI-støtte med tydelige grenser for:

- personvern
- sikkerhet
- faglig usikkerhet
- juridiske og HR-relaterte vurderinger
- menneskelig ansvar

---

# 2. Produktproblem

Krevende medarbeidersamtaler er en vanlig del av lederrollen, men mange ledere får begrenset praktisk trening før situasjonene oppstår.

Eksisterende generelle KI-verktøy kan gi hjelp, men mangler ofte:

- struktur for lederens arbeidsflyt
- relevant faglig kontekst
- personvernbeskyttelse før KI-kall
- simulering av selve samtalen
- tydelige begrensninger mot diagnoser, skyld og bastante konklusjoner
- systematisk kvalitetssikring

Samtalestøtte skal derfor være et domenespesifikt støtteverktøy fremfor en generell chatbot.

---

# 3. Produktmål

Produktet skal:

1. gjøre det enklere å forberede krevende medarbeidersamtaler
2. gi konkret og situasjonstilpasset KI-støtte
3. redusere risikoen for deling av identifiserende informasjon
4. tilby praktisk samtaletrening
5. støtte flere relevante samtaletemaer
6. gi innloggede brukere tilgang til egen historikk
7. støtte kvalitetssikring av KI gjennom testing og modellvurdering
8. kunne videreutvikles uten å være låst til én enkelt KI-provider

---

# 4. Ikke-mål

Samtalestøtte skal ikke:

- være et HR-system
- være et personalsystem eller journalsystem
- lagre formelle personalsaker
- ta beslutninger om medarbeidere
- automatisere oppsigelser eller andre personalvedtak
- stille medisinske eller psykologiske diagnoser
- fastslå motiv, skyld eller sannhet i konflikter
- erstatte HR, jurist, bedriftshelsetjeneste eller lederens eget skjønn
- trene egen språkmodell på brukerdata
- bruke brukerens samtaler som skjult treningsgrunnlag
- være ferdig produksjonsløsning for klassifiserte eller lukkede nettverk

---

# 5. Primærbruker

Primærbrukeren er en leder som står foran en krevende samtale med en medarbeider.

Typiske behov:

- forstå hva som er kjernen i situasjonen
- finne mål for samtalen
- formulere en god åpning
- stille relevante spørsmål
- forberede seg på reaksjoner
- øve på samtalen
- reflektere før eller etter samtalen

Sekundære brukergrupper kan være:

- HR
- lederutviklere
- redaktører
- systemadministratorer

---

# 6. Hovedtemaer

Leveransen støtter ni hovedtemaer:

1. Alkohol og rus
2. Fravær og oppfølging
3. Prestasjon og utvikling
4. Lønn og utvikling
5. Samarbeid og kommunikasjon
6. Oppsigelse og avslutning av arbeidsforhold
7. Sikkerhet og ansvar
8. Livssituasjoner
9. Mobbing og trakassering

Hvert tema kan ha undertemaer som brukes som kontekst for KI-en.

Brukeren skal ikke være låst til en rigid menystruktur dersom situasjonen beskrives bedre med egne ord.

---

# 7. Kravstatus

Denne PRD-en skiller mellom:

- **IMPLEMENTERT** – finnes i dagens prototype
- **DELVIS** – deler finnes, men området er ikke fullt ferdigstilt
- **VIDERE ARBEID** – planlagt eller ønsket videreutvikling

Dette er gjort for å skille tydelig mellom faktisk leveranse og framtidig ambisjon.

---

# 8. Funksjonelle krav

## FR-01 – Situasjonsbeskrivelse

**Status:** IMPLEMENTERT

Brukeren skal kunne beskrive en krevende situasjon i fritekst.

Systemet skal kunne bruke teksten som kontekst for videre KI-støtte.

Brukeren skal ikke måtte fylle ut et omfattende HR-skjema før KI-en kan hjelpe.

### Akseptansekriterier

- bruker kan skrive situasjonen i hovedfeltet
- teksten kan analyseres av KI
- relevant kontekst videreføres i samtalen
- ny samtale starter uten gammel samtalekontekst

### Spor i repoet

- `app.js`
- `server.js`

---

## FR-02 – Tema og undertema

**Status:** IMPLEMENTERT

Systemet skal støtte de ni definerte hovedtemaene og tilhørende undertemaer.

KI kan foreslå relevant tema ut fra brukerens tekst.

Brukeren skal kunne korrigere eller velge tema selv.

### Spor

- `app.js`
- `index.html`
- `docs/faggrunnlag/`

---

## FR-03 – KI-basert hovedveiledning

**Status:** IMPLEMENTERT

KI-veiledningen skal kunne gi støtte til:

- mål for samtalen
- struktur
- mulig åpning
- relevante spørsmål
- mulige reaksjoner
- hvordan reaksjoner kan møtes
- videre oppfølging

Svarene skal være praktiske og menneskelig formulert.

KI skal være tilbakeholden med bastante HR-, juridiske og psykologiske konklusjoner.

### Spor

- `server.js`
- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`

---

## FR-04 – Oppfølgingsdialog

**Status:** IMPLEMENTERT

Brukeren skal kunne fortsette dialogen med KI etter første veiledning.

### Krav

- relevant kontekst beholdes
- unødvendig repetisjon begrenses
- KI kan gi konkrete formuleringseksempler
- nye brukerinnspill skal passere personvernkontroll

### Spor

- `app.js`
- `server.js`

---

## FR-05 – Samtalesimulering

**Status:** IMPLEMENTERT

Systemet skal tilby en egen simulator der KI spiller medarbeider.

Simulatoren skal:

- bruke situasjonen som kontekst
- reagere på lederens formuleringer
- opprettholde dialog over flere meldinger
- kunne uttrykke ulike realistiske reaksjoner
- unngå oppdiktede diagnoser og personopplysninger
- la brukeren avslutte øvelsen
- støtte refleksjon etterpå

### Testbevis

- `tests/test-simulation.js`
- siste kontroll: **24/24 kontroller bestått**

---

## FR-06 – Personverngateway

**Status:** IMPLEMENTERT

Alle sentrale tekstfelt som kan føre til KI-kall skal passere personvernkontroll.

Kontrollen skal finnes både:

1. i klienten for rask tilbakemelding
2. på serveren som siste sikkerhetsbarriere

### Kontrollen skal blant annet kunne reagere på

- navn
- e-postadresse
- telefonnummer
- identifikatorer
- fødselsopplysninger
- direkte familieopplysninger
- konkret arbeidssted eller unik rolle der dette kan øke identifiserbarheten
- kjønnede formuleringer der nøytralisering er relevant

### Prinsipp

**Anonymiser identitet, ikke nødvendig kontekst.**

Systemet skal ikke love full anonymitet.

### Testbevis

- `tests/test-privacy.js`
- siste kontroll: **33/33 kontroller bestått**

---

## FR-07 – Autentisering

**Status:** IMPLEMENTERT

Systemet skal ha brukerkontoer og lukket registrering.

### Krav

- bruker kan logge inn
- bruker kan logge ut
- registrering krever gyldig invitasjon
- sesjon kan beholdes mellom sideoppdateringer
- innlogget bruker skal ikke kunne lese andre brukeres historikk

### Spor

- `server.js`
- Supabase-oppsett
- `database/`

---

## FR-08 – Engangsinvitasjoner

**Status:** IMPLEMENTERT

Nye kontoer opprettes gjennom engangsinvitasjoner.

Invitasjoner kan brukes til kontrollert tilgang til beta- og vurderingsmiljø.

### Spor

- `scripts/create-invite.js`
- adminfunksjoner
- serverlogikk

---

## FR-09 – Historikk

**Status:** IMPLEMENTERT

Innlogget bruker skal kunne:

- se tidligere samtaler
- åpne en tidligere samtale
- lese eller fortsette relevante samtaler
- slette egen historikk

Historikk skal være knyttet til riktig bruker.

### Testbevis

- `tests/test-history-hotfix.cjs`

---

## FR-10 – Rapportering av KI-svar

**Status:** IMPLEMENTERT

Brukeren skal kunne rapportere et KI-svar som oppleves problematisk.

Rapporteringen kan inneholde:

- type problem
- kommentar
- teknisk referanse
- modell
- tidspunkt

Samtaleinnhold skal ikke inkluderes automatisk.

---

## FR-11 – Roller

**Status:** IMPLEMENTERT

Systemet støtter tre roller:

- `user`
- `editor`
- `admin`

### User

Kan bruke ordinære brukerfunksjoner.

### Editor

Kan i tillegg redigere godkjent innhold.

### Admin

Kan i tillegg administrere sentrale systemfunksjoner.

Kritiske rettigheter skal valideres server-side.

---

## FR-12 – Admin

**Status:** IMPLEMENTERT

Adminområdet skal gi tilgang til relevante drifts- og kvalitetsfunksjoner.

Dette omfatter blant annet:

- roller
- innholdsredigering
- modellvalg
- benchmark
- kostnadsinformasjon
- rapporterte KI-svar
- kilde-/systeminformasjon

Store adminområder skal kunne minimeres for å redusere visuell belastning.

---

## FR-13 – Modellvalg

**Status:** IMPLEMENTERT I PROTOTYPEFORM

Systemet skal ikke være permanent låst til én KI-modell.

Admin skal kunne velge mellom støttede modeller.

Arkitekturen skal støtte flere providere.

### Støttede prinsipper

- OpenAI
- OpenRouter
- modellkonfigurasjon via server

### Spor

- `server.js`
- adminlogikk
- `data/BENCHMARK-CASES.json`

---

## FR-14 – Modellbenchmark

**Status:** IMPLEMENTERT I PROTOTYPE/TESTFORM

Prosjektet skal kunne sammenligne KI-modeller på et felles testgrunnlag.

Aktuelle vurderingsområder:

- kvalitet
- situasjonsforståelse
- relevans
- responstid
- tokenbruk
- kostnad

Systemet inneholder også støtte for blind modell-sammenligning.

Selve benchmarkverktøyet og testgrunnlaget er implementert i prototype/testform. En full fler-modell-benchmark er ikke dokumentert som gjennomført og skal derfor ikke fremstilles som et ferdig evalueringsresultat.

### Spor

- `tests/test-model-compare.js`
- benchmarklogikk i app/server
- `data/BENCHMARK-CASES.json`

---

## FR-15 – Automatisert KI-testing

**Status:** IMPLEMENTERT

Prosjektet skal ha automatiserte testoppsett for KI-svar.

Dette omfatter:

- kort KI-test
- full KI-test
- stresstest
- problemcaser
- simulator-live-test
- modell-sammenligning

### Spor

- `tests/test-ai.js`
- `tests/test-ai-stress.js`
- `tests/test-simulation-ai.js`
- `tests/test-model-compare.js`
- `tests/test-ai-golden.js`
- `tests/test-golden-schema.cjs`
- `tests/test-golden-utils.js`
- `tests/AI-GOLDEN-CASES.json`
- `tests/cases/`

Automatisert vurdering skal brukes som støtte og ikke erstatte manuell vurdering av KI-kvalitet.

Golden/fasittesten knytter representative KI-caser til eksplisitte kravreferanser, maskinelle kontrollpunkter og en menneskelig vurderingsfasit med `MÅ`, `BØR` og kritiske feil. Fasitbankens struktur og 9/9 temadekning kan verifiseres uten API-nøkkel.

---

## FR-16 – Faggrunnlag

**Status:** IMPLEMENTERT

Produktet skal ha dokumentert faglig grunnlag.

Dette finnes som:

- felles SOURCEBANK
- temaspecifikke faggrunnlag
- KI-regler for faglig usikkerhet

### Spor

- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/faggrunnlag/`

---

## FR-17 – Brukertesting

**Status:** DELVIS / VIDERE ARBEID

Produktet skal kunne brukertestes systematisk.

Brukertesting skal undersøke blant annet:

- om hovedflyten forstås
- om navigasjonen er tydelig
- om KI-svar oppleves relevante
- om simulatoren oppleves realistisk
- om personverninformasjonen forstås

Fullskala brukertesting er ikke definert som ferdig leveransekrav.

Resultater fra brukertesting kan brukes til videre revisjon av krav og UX.

---

## FR-18 – Web- og kildeanalyse

**Status:** DELVIS / PROTOTYPE

Systemet har funksjoner og arkitektur knyttet til kilde- og webbruk.

Målet er å kunne analysere hvilke kilder som brukes uten å bygge brukerprofiler eller lagre unødvendig samtaleinnhold.

Videre utvikling av dette området er mulig.

---

# 9. KI-krav

## AI-01 – Fakta og antakelser

**Status:** IMPLEMENTERT SOM KI-REGEL

KI skal skille mellom:

- informasjon brukeren faktisk har oppgitt
- mulige tolkninger
- antakelser
- informasjon som mangler

---

## AI-02 – Ingen oppdiktede diagnoser

**Status:** IMPLEMENTERT OG TESTET

KI skal ikke dikte opp medisinske eller psykologiske diagnoser.

Dette gjelder også simulatoren.

---

## AI-03 – Ingen oppdiktet skyld eller motiv

**Status:** IMPLEMENTERT SOM KI-REGEL

KI skal ikke fastslå:

- skyld
- motiv
- personlighet
- sannheten i en konflikt

uten tilstrekkelig grunnlag.

---

## AI-04 – HR og juridiske spørsmål

**Status:** IMPLEMENTERT SOM KI-REGEL

KI skal være tydelig på usikkerhet og anbefale relevant faglig bistand når situasjonen krever det.

---

## AI-05 – Kontekst

**Status:** IMPLEMENTERT

KI skal beholde nødvendig samtalekontekst, men ny samtale skal ikke arve uvedkommende tidligere kontekst.

---

## AI-06 – Modelluavhengighet

**Status:** IMPLEMENTERT I PROTOTYPEFORM

KI-laget skal støtte at modell/provider kan endres uten at hele applikasjonen bygges om.

---

# 10. Ikke-funksjonelle krav

## NFR-01 – Sikkerhet

**Status:** IMPLEMENTERT PÅ PROTOTYPENIVÅ

Systemet skal blant annet bruke:

- server-side tilgangskontroll
- databasepolicy/RLS
- sikre sessions/cookies
- rate limiting
- same-origin-kontroll
- sikkerhetsheadere
- begrenset offentlig filtilgang
- server-side personverngateway
- API-nøkler utenfor frontend

### Dokumentasjon

`docs/SIKKERHET-OG-PERSONVERN-v20.4.md`

---

## NFR-02 – Personvern

**Status:** IMPLEMENTERT

Produktet skal følge prinsipper om:

- dataminimering
- formålsbegrensning
- minst mulig unødvendig logging
- bruker-eid historikk
- frivillig deling av samtaleinnhold
- separasjon mellom brukerdata og teknisk analyse

---

## NFR-03 – Brukervennlighet

**Status:** IMPLEMENTERT MED VIDERE FORBEDRINGSMULIGHET

Løsningen skal ha:

- tydelig navigasjon
- konsekvente komponenter
- forståelige tilbakemeldinger
- lys/mørk/hybrid visning
- responsiv utforming
- minst mulig unødvendig teknisk språk

UX er iterativt forbedret gjennom prosjektet.

---

## NFR-04 – Feilhåndtering

**Status:** IMPLEMENTERT

Tekniske feil skal så langt som mulig håndteres uten at brukerflyten kollapser.

Sluttbruker skal ikke eksponeres for unødvendig tekniske debugdetaljer.

---

## NFR-05 – Vedlikeholdbarhet

**Status:** IMPLEMENTERT SOM ARKITEKTURMÅL

Kode, dokumentasjon, tester og ressurser skal holdes logisk adskilt.

Repoet er organisert i:

- `assets/`
- `data/`
- `database/`
- `docs/`
- `tests/`

---

# 11. Testing og kvalitetssikring

## T-01 – Personvern

**Status:** BESTÅTT

Kommando:

```bash
npm run test-privacy
```

Siste kontroll:

**33/33 bestått**

---

## T-02 – Samtalesimulering

**Status:** BESTÅTT

Kommando:

```bash
npm run test-simulation
```

Siste kontroll:

**24/24 bestått**

---

## T-03 – Server-personvern

**Status:** IMPLEMENTERT

```bash
npm run test-server-privacy
```

---

## T-04 – UI-regresjon

**Status:** IMPLEMENTERT

```bash
npm run test-ui-regression
```

---

## T-05 – Historikk

**Status:** BESTÅTT VED SISTE KONTROLL

```bash
npm run test-history-hotfix
```

---

## T-06 – Samtaleboble-regresjon

**Status:** BESTÅTT VED SISTE KONTROLL

```bash
npm run test-bubble-cleanup
```

En tidligere versjon av testen feilet fordi den kontrollerte en foreldet CSS-kommentar fremfor faktisk funksjonalitet.

Testen ble korrigert fremfor å endre fungerende produksjonskode.

---

## T-07 – KI-tester

**Status:** IMPLEMENTERT

```bash
npm run test-ai
npm run test-ai:full
npm run test-ai:stress
npm run test-ai:stress:full
npm run test-ai:stress:problems
npm run test-ai:golden
npm run test-golden-schema
```

KI-testene gjør faktiske modellkall og krever API-konfigurasjon.

Siste verifiserte golden/fasittest etter testkalibrering: **9/9 OK mot GPT-5.6 Luna**, med 0 bør sjekkes, 0 kritiske avvik og 0 tekniske feil. Alle ni hovedtemaer er eksplisitt representert i fasitbanken.

---

## T-08 – Modell-sammenligning

**Status:** IMPLEMENTERT

```bash
npm run test-model-compare
```

Testen støtter blind sammenligning av KI-modeller.

---

# 12. Akseptansekriterier for levert prototype

Leveransen anses som funksjonelt komplett som prosjektprototype når følgende er oppfylt:

1. appen kan startes og brukes
2. innlogging fungerer
3. lukket registrering fungerer
4. ni hovedtemaer er tilgjengelige
5. situasjonsbeskrivelse kan analyseres
6. KI gir strukturert samtalestøtte
7. oppfølgingsdialog fungerer
8. personverngateway beskytter sentrale KI-flyter
9. samtalesimulering fungerer
10. historikk er tilgjengelig for innlogget bruker
11. rollemodell finnes
12. adminfunksjoner finnes
13. KI-modell kan konfigureres
14. automatiserte tester finnes
15. sentrale personvern- og simulator-tester består
16. dokumentasjon gjør løsning og prosess etterprøvbar

---

# 13. Status ved levering

| Område | Status | Bevis |
|---|---|---|
| Webapplikasjon | Implementert | `app.js`, `index.html`, `server.js` |
| KI-veiledning | Implementert | server + systemprompt |
| 9 hovedtemaer | Implementert | app + faggrunnlag |
| Personverngateway | Implementert/testet | 33/33 tester |
| Simulator | Implementert/testet | 24/24 tester |
| Autentisering | Implementert | Supabase/server |
| Historikk | Implementert | Supabase/regresjonstest |
| Roller | Implementert | app/server |
| Admin | Implementert | app/server |
| Modellvalg | Implementert i prototypeform | admin/server |
| Benchmark | Prototype/testform | benchmarkfiler |
| KI-testing | Implementert | `tests/` |
| Faggrunnlag | Implementert | `docs/faggrunnlag/` |
| SOURCEBANK | Implementert | `docs/`, `data/` |
| Brukertesting | Delvis/videre arbeid | testopplegg |
| Web/kildeanalyse | Delvis/prototype | server/admin |
| Lukket/offline løsning | Videre arbeid | arkitekturdokumentasjon |

---

# 14. Kjente avgrensninger

Leveransen er en prototype og har derfor bevisste avgrensninger.

Blant annet:

- full produksjonsherding er ikke gjennomført
- fullskala brukertesting gjenstår
- lukket/offline løsning er ikke implementert
- modellbenchmark er et test- og prototypeområde
- enkelte admin- og analysefunksjoner kan videreutvikles
- KI-kvalitet kan aldri garanteres fullt ut gjennom automatiserte regler

Disse områdene skal ikke fremstilles som ferdige krav i dagens leveranse.

---

# 15. Risikoer

## R-01 – KI kan gi svake eller feilaktige svar

Tiltak:

- systemprompt
- responskontrakt
- faggrunnlag
- testcaser
- menneskelig ansvar
- rapporteringsfunksjon

---

## R-02 – Personopplysninger kan bli skrevet inn

Tiltak:

- klientkontroll
- serverkontroll
- anonymisering
- tydelig informasjon
- dataminimering

---

## R-03 – KI-testing kan gi falske resultater

Tiltak:

- manuell vurdering
- kontekstbevisste tester
- regresjonstesting av selve testlogikken

---

## R-04 – Eksterne tjenester kan endre seg

Tiltak:

- provider-abstraksjon
- konfigurerbart modellvalg
- dokumentert framtidig lokal arkitektur

---

## R-05 – Prosjektomfang kan bli for stort

Tiltak:

- tydelig avgrensning
- skille mellom levert og framtidig funksjonalitet
- modulær utvikling
- prioritering
- dokumentert endringskontroll

---

# 16. Videre arbeid

Følgende er eksplisitt videre arbeid og ikke nødvendige ferdigkrav for dagens leveranse:

- større ordinær brukertest
- ytterligere tilgjengelighetstesting
- videre benchmarking av KI-modeller
- videre kildeanalyse
- lokal RAG/kunnskapsbank
- intern KI-modell
- intern database/autentisering
- full lukket nettverksvariant
- ytterligere mobiltilpasning eller egen mobilapp
- videre sikkerhetsherding før eventuell ordinær produksjonsbruk

---

# 17. Sporbarhet mot øvrig dokumentasjon

Denne PRD-en skal leses sammen med:

## Produkt og utvikling

- `product-brief.md`
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md`
- `docs/bmad/ARCHITECTURE-BMAD.md`
- `docs/bmad/UX-DESIGN-BMAD.md`
- `docs/bmad/EPICS-AND-STORIES-BMAD.md`

## KI

- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`
- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`
- `docs/ai/AI-TESTPLAN.md`

## Sikkerhet og faglig grunnlag

- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md`
- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/faggrunnlag/`

## Testing

- `tests/`
- `tests/cases/`

## Historikk

- `CHANGELOG.md`
- Git commit-historikken

---

# 18. Endringskontroll

Når et nytt krav vurderes, skal følgende spørsmål stilles:

1. Hvilket problem løser det?
2. Er det nødvendig for levert prototype?
3. Påvirker det personvern?
4. Påvirker det sikkerhet?
5. Påvirker det KI-atferd?
6. Krever det nye tester?
7. Påvirker det eksisterende brukerflyt?
8. Krever det endring i PRD, arkitektur eller UX?
9. Er det implementert, delvis implementert eller videre arbeid?

Dette skal redusere risikoen for at nye KI-genererte forslag automatisk blir lagt inn i produktet uten vurdering.

---


# 19. Oppsummering

Samtalestøtte er levert som en omfattende KI-basert prototype for lederstøtte ved krevende medarbeidersamtaler.

Kjerneleveransen består av:

- strukturert samtalestøtte
- ni hovedtemaer
- oppfølgingsdialog
- personverngateway
- samtalesimulator
- autentisering
- historikk
- roller og admin
- faglig kildegrunnlag
- automatiserte tester
- KI-testing og modellvurdering

Produktet er utviklet iterativt.

PRD-en beskriver derfor både hva som faktisk er levert og hvilke områder som er eksplisitt videre arbeid.

Dette skillet er viktig for at krav, kode, tester og dokumentasjon skal kunne sammenlignes direkte uten at framtidige ambisjoner framstår som ferdig funksjonalitet.


# Tillegg – faglig transparens og brukerinnsyn

## Produktkrav: Etterprøvbart faggrunnlag

**Status:** IMPLEMENTERT / DELVIS VIDEREUTVIKLING

Samtalestøtte skal ikke være en svart boks der brukeren må stole blindt på KI-genererte råd.

Når faglig grunnlag er relevant for et råd, skal løsningen så langt som mulig gjøre det mulig for brukeren å:

- se at rådet har faglig forankring
- se relevante kilder eller faggrunnlag
- åpne relevante fagtekster eller fagsider
- følge lenker til autoritative eksterne kilder når slike brukes
- undersøke grunnlaget selv før viktige beslutninger tas

Dette er særlig viktig ved spørsmål om:

- lovverk og formelle personalprosesser
- sykefravær og tilrettelegging
- varsling
- mobbing og trakassering
- vold og trusler
- HMS og sikkerhet

## Krav til KI og kildebruk

Systemet skal skille mellom:

1. konkret informasjon fra en kilde
2. faglig forankret veiledning
3. KI-modellens egen sammenstilling eller formulering

KI skal ikke fremstille modellens egen syntese som et direkte utsagn fra en kilde.

Kilder skal bare presenteres som støtte når de faktisk er relevante for påstanden eller rådet.

Systemet skal ikke konstruere eller finne på kilder dersom konkret kildegrunnlag ikke er tilgjengelig.

## Brukeropplevelse

Faggrunnlag skal være tilgjengelig uten å gjøre hovedveiledningen unødvendig tung.

Aktuelle løsninger kan være:

- kildehenvisninger i eller under KI-svaret
- «Les mer»
- sammenleggbare kildeområder
- relevante fagsider
- lenker til myndighetskilder eller annet faggrunnlag

Brukeren skal kunne velge hvor mye faglig detalj som ønskes.

## Sporbarhet

Kravet støttes av:

- `docs/faggrunnlag/`
- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`
- `docs/ai/SAMTALEPARTNER-MODELL.md`
- `docs/bmad/UX-DESIGN-BMAD.md`

Prinsippet er at KI-støtte skal være **etterprøvbar**, ikke bare overbevisende formulert.