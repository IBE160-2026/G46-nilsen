# Implementation Plan – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Revidert Implementation Plan  
**Rammeverk:** BMAD  
**Status:** Revidert plan og status ved levering  
**Språk:** Norsk

---

## 1. Formål

Denne implementeringsplanen beskriver hvordan Samtalestøtte er strukturert og videreutviklet innenfor BMAD-rammeverket.

Utviklingen har ikke fulgt en strengt lineær prosess. Produktet har blitt utviklet iterativt, der funksjoner, brukerflyt, sikkerhet, personvern og tekniske løsninger har blitt vurdert og justert underveis.

Nye behov har oppstått som følge av:

- testing
- tekniske problemer
- vurdering av KI-svar
- brukeropplevelse
- personvern- og sikkerhetsgjennomgang
- nye funksjonelle behov
- erfaring fra faktisk bruk av prototypen

Planen skal derfor ikke leses som en påstand om at alle fasene var fullt definert før utviklingen startet.

Den fungerer både som:

1. struktur for gjennomført og videre arbeid
2. dokumentasjon av hvordan prosjektets deler henger sammen
3. kobling mellom krav, implementasjon, testing og læring

---

# 2. Utviklingsmetodikk

Samtalestøtte er utviklet med en kombinasjon av:

- BMAD som planleggings- og dokumentasjonsrammeverk
- iterativ produktutvikling
- KI-assistert programmering
- kontinuerlig testing
- gradvis kravjustering
- brukerorientert design
- teknisk risikovurdering
- personvern- og sikkerhetsvurdering
- refleksjon og forbedring underveis

Den praktiske arbeidsformen kan oppsummeres slik:

```text
behov
→ planlegg
→ spesifiser
→ bygg med KI
→ test
→ vurder
→ oppdag feil eller svakhet
→ juster krav eller løsning
→ test igjen
→ dokumenter
→ bygg videre
```

Product Brief, PRD, UX, Architecture, Epics & Stories og Implementation Plan kan derfor revideres når ny kunnskap oppstår.

Målet er ikke å fremstille utviklingsprosessen som mer lineær enn den faktisk har vært, men å dokumentere hvordan prosjektet har utviklet seg og hvorfor viktige valg ble tatt.

---

# 3. Forholdet mellom BMAD og faktisk utvikling

BMAD-dokumentene brukes som styrings- og dokumentasjonsverktøy, men de skal ikke leses som om hele planen eksisterte før første prototype. Den tidlige utviklingen var utforskende, og BMAD ble tatt i bruk og videreutviklet mens prosjektet allerede var i bevegelse.

Dette var ikke bare dokumentasjon i ettertid. Etter at BMAD-strukturen kom på plass ble krav tydeligere, scope ble mer eksplisitt, testbevis ble koblet til krav, og større endringer ble vurdert mot eksisterende arkitektur og akseptansekriterier.

I prosjektet har flere funksjoner blitt identifisert eller vesentlig endret etter at utviklingen allerede var i gang.

Eksempler er:

- server-side personverngateway
- samtalesimulering
- Supabase Auth og historikk
- rollemodell
- adminfunksjoner
- modellvalg
- modellbenchmark
- kostnadslogging
- kildebruk
- SOURCEBANK
- OpenRouter
- automatisert testbank
- brukertesting
- sikkerhetsherding
- mulig framtidig lukket/offline arkitektur

Dette betyr at BMAD-dokumentasjonen både inneholder opprinnelige planer og senere revisjoner basert på erfaring.

Større endringer dokumenteres gjennom:

- BMAD-dokumentene
- AI-loggen
- CHANGELOG
- tester
- Git-historikken

---

# 4. Fase 1 – Teknisk fundament

## Mål

Etablere et kjørbart teknisk fundament som kan videreutvikles iterativt.

## Leveranser

- prosjektstruktur
- Git-repository
- HTML/CSS/JavaScript-frontend
- Node.js/Express-server
- klient/server-kommunikasjon
- grunnleggende layout
- hosting/testmiljø
- miljøvariabler

## Exit criteria

- appen starter lokalt
- frontend og backend kommuniserer
- appen kan kjøres via Node-server
- nødvendige hemmeligheter ligger utenfor repoet
- prosjektet kan deployes

## Status ved levering

**Gjennomført.**

Sentrale filer:

- `server.js`
- `app.js`
- `index.html`
- `styles.css`
- `.env.example`
- `package.json`

---

# 5. Fase 2 – KI-integrasjon

## Mål

Gå fra statisk prototype til faktisk KI-basert samtalestøtte.

## Leveranser

- OpenAI-integrasjon på serversiden
- modellkonfigurasjon
- situasjonsanalyse
- temasortering
- avklaringslogikk
- KI-generert samtalestøtte
- videre dialog i samme kontekst

## Viktig arkitekturvalg

API-nøkler skal ikke ligge i frontend.

KI-kall håndteres derfor gjennom serveren.

## Iterativ læring

Tidlige KI-svar var mer begrensede og generiske. Funksjonaliteten ble derfor utviklet gradvis fra enkel analyse til mer komplett samtalestøtte.

Det ble også nødvendig å utvikle diagnostikk som kunne skille mellom:

- feil i applikasjonen
- API-feil
- modellfeil
- konfigurasjonsfeil
- faglig svake KI-svar

## Exit criteria

- KI kan motta situasjon og returnere relevant støtte
- server håndterer API-nøkler
- samtalekontekst kan videreføres
- ny samtale starter uten gammel kontekst

## Status ved levering

**Gjennomført.**

---

# 6. Fase 3 – Kjernefunksjon og brukerflyt

## Mål

Gi brukeren en enkel vei fra situasjon til konkret samtalestøtte.

## Leveranser

- ni hovedtemaer
- undertemaer
- situasjonsbeskrivelse
- temasortering
- KI-veiledning
- oppfølgingsdialog
- forslag til åpning
- forslag til spørsmål
- mulige reaksjoner
- håndtering og videre oppfølging

## Iterativ læring

Den første brukerflyten var mer skjemabasert.

Dette ble vurdert som unødvendig tungvint.

Løsningen ble derfor forenklet slik at:

- brukeren kan beskrive situasjonen mer naturlig
- KI kan stille oppfølgingsspørsmål ved behov
- unødvendige mellomsteg reduseres

## Exit criteria

- standard brukerflyt fungerer fra situasjon til veiledning
- bruker kan fortsette dialogen uten å miste kontekst

## Status ved levering

**Gjennomført.**

---

# 7. Fase 4 – Personvern

## Mål

Redusere risikoen for at identifiserende eller unødvendig personinformasjon sendes til KI.

## Leveranser

- klientbasert personvernkontroll
- server-side personverngateway
- navnedeteksjon
- deteksjon av identifiserende opplysninger
- anonymisering/generaliseringslogikk
- kjønnede formuleringer
- redusert logging av personrelatert informasjon

## Prinsipp

**Anonymiser identitet, ikke nødvendig kontekst.**

## Iterativ læring

De første personvernreglene kunne bli for strenge og markere tekst som ikke burde stoppes.

Dette førte til mer kontekstbevisste regler.

Eksempler på nødvendig skille:

- konkret arbeidssted vs. generell bransje
- unik rolle vs. generell stillingstype
- konkrete familieopplysninger vs. generell familiesituasjon
- navn vs. vanlige norske ord

## Exit criteria

- sentrale KI-kall går gjennom personverngateway
- identifiserende opplysninger oppdages i representative tester
- anonymisering bevarer nødvendig kontekst der det er mulig
- tekniske logger lagrer minst mulig brukerrelatert informasjon

## Status ved levering

**Gjennomført og automatisert testet.**

Sentrale tester:

`tests/test-privacy.js`

Ved siste kontroll:

**33/33 kontroller OK**

---

# 8. Fase 5 – Autentisering og data

## Mål

Gi brukere personlig historikk og beskytte data mellom kontoer.

## Leveranser

- Supabase Auth
- login/logout
- lukket registrering
- engangsinvitasjoner
- session/cookies
- historikk
- RLS
- server-side tilgangskontroll

## Iterativ læring

Database- og tilgangsoppsett måtte testes i faktisk miljø.

Et konkret eksempel var at samtalelagring krevde korrigering av database-rettigheter gjennom en `GRANT`-endring.

Dette viste behovet for å validere KI-generert databaseoppsett i faktisk drift.

## Exit criteria

- bruker kan logge inn
- registrering styres gjennom invitasjon
- bruker kan ikke lese andres historikk
- server validerer tilgang

## Status ved levering

**Gjennomført.**

Databaseoppsett:

- `database/SUPABASE-SETUP.sql`
- `database/migrations/`

---

# 9. Fase 6 – Historikk og feedback

## Mål

La brukeren lagre, åpne og administrere tidligere samtaler.

## Leveranser

- lagring
- åpning
- sletting
- historikkvisning
- rapportering av KI-svar
- teknisk feilrapportering
- frivillig samtalekontekst ved feedback

## Viktig designvalg

Det skilles mellom:

1. rapportering av kvaliteten på et KI-svar
2. teknisk feilrapportering

Samtaletekst skal ikke automatisk lagres i tekniske logger.

## Exit criteria

- historikk er brukerbeskyttet
- lagret samtale kan åpnes igjen
- feedback kan sendes uten automatisk full samtaletekst

## Status ved levering

**Gjennomført.**

Regresjonstest:

`tests/test-history-hotfix.cjs`

---

# 10. Fase 7 – Samtalesimulering

## Mål

Gi lederen mulighet til å øve på selve samtalen.

## Leveranser

- simulator
- KI i medarbeiderrolle
- samtalekontekst
- reaksjonsstiler
- direkte simulering
- hjelp underveis
- refleksjon etter øvelsen
- midlertidig øvelse
- avatarer og samtalebobler
- personvernkontroll

## Iterativ læring

Simulatoren ble større og mer kompleks enn først forventet.

Testing avdekket blant annet:

- unaturlige reaksjoner
- for polert språk
- oppdiktede detaljer
- risiko for oppdiktet diagnose
- risiko for oppdiktet familieinformasjon
- visuelle problemer med bobler og roller

Dette førte til strengere KI-regler og flere regresjonstester.

## Exit criteria

- flertrinns simulering fungerer
- kontekst beholdes
- KI skal ikke dikte opp sentrale personopplysninger
- brukeren forstår tydelig leder- og medarbeiderrollen

## Status ved levering

**Gjennomført og testet.**

Automatisk kontroll:

`tests/test-simulation.js`

Ved siste kontroll:

**24/24 kontroller OK**

---

# 11. Fase 8 – Roller og admin

## Mål

Skille mellom ordinær bruker, redaktør og administrator.

## Roller

### Bruker

Kan bruke kjernefunksjonene.

### Redaktør

Kan i tillegg redigere utvalgt innhold.

### Admin

Kan blant annet administrere:

- roller
- innhold
- modeller
- benchmark
- kostnadsinformasjon
- kildebruk
- testrelaterte funksjoner

## Arkitekturkrav

Kritiske rettigheter skal håndheves server-side og ikke bare skjules i brukergrensesnittet.

## UX-krav

Store adminseksjoner skal kunne minimeres.

`Rediger innhold` skal være lukket som standard.

## Exit criteria

- server validerer adminrettigheter
- redaktør og admin har ulike rettigheter
- store adminområder kan skjules/minimeres

## Status ved levering

**Gjennomført.**

---

# 12. Fase 9 – Modellstyring og provider-abstraksjon

## Mål

Kunne bytte og sammenligne KI-modeller uten å bygge applikasjonen på nytt.

## Leveranser

- modellkonfigurasjon
- adminstyrt modellvalg
- OpenAI
- OpenRouter
- provider-abstraksjon
- modellmetadata
- token- og kostnadslogging

## Begrunnelse

Modellvalg skal ikke bare baseres på maksimal modellkapasitet.

Følgende må vurderes sammen:

- kvalitet
- kostnad
- responstid
- sikkerhet
- stabilitet

## Exit criteria

- flere modeller kan registreres
- aktiv modell kan styres
- provider kan abstraheres fra øvrig app-logikk

## Status ved levering

**Gjennomført i prototypeform.**

---

# 13. Fase 10 – Testing av KI

## Mål

Teste KI-svar systematisk og ikke bare manuelt.

## Leveranser

- korte KI-tester
- fulltester
- stresstester
- problemcaser
- simulator-live-tester
- golden/fasitbasert KI-test
- golden schema- og matcherregresjon
- modell-sammenligning
- testdata

## Testtyper

Prosjektet inneholder blant annet:

- `npm run test-ai`
- `npm run test-ai:full`
- `npm run test-ai:stress`
- `npm run test-ai:stress:full`
- `npm run test-ai:stress:problems`
- `npm run test-simulation:live`
- `npm run test-golden-schema`
- `npm run test-golden-utils`
- `npm run test-ai:golden`
- `npm run test-model-compare`

## Iterativ læring

Testene måtte også kvalitetssikres.

Eksempel:

Enkelte KI-tester kunne markere et svar som problematisk på bakgrunn av et nøkkelord selv når modellen faktisk avviste den problematiske påstanden.

Dette førte til mer kontekstbevisst testlogikk. Senere golden-kjøringer ga også konkrete regresjoner for falske treff på `skyld`, delstrengstreffet `lat` i `arbeidsrelatert`, og en Livssituasjoner-case som teknisk var grønn uten å teste temaet presist nok.

Et annet eksempel var automatiserte testservere som fikk `401` på `/api/status`.

I stedet for å svekke ordinær autentisering ble det lagt inn en eksplisitt test-bypass som bare aktiveres når testmiljøet bruker:

- `NODE_ENV=test`
- `TEST_AUTH_BYPASS=1`

## Exit criteria

- KI-testene kan startes automatisert
- testserver kan kjøre uten å svekke produksjonsauth
- flere typer KI-caser kan vurderes systematisk

## Status ved levering

**Gjennomført.**

---

# 14. Fase 11 – Benchmark og kostnad

## Mål

Sammenligne modeller på mer enn subjektiv opplevelse.

## Vurderingsområder

- situasjonsforståelse
- konkrete råd
- nyansering
- risiko
- samtaleformulering
- faglig relevans
- responstid
- kostnad

## Leveranser

- benchmark-caser
- modellkjøring
- kostnadsestimat
- responstid
- resultatvisning
- blind modell-sammenligning

## Iterativ læring

Full kjøring av et stort testsett mot flere modeller kan bli kostbart.

Strategien ble derfor delt mellom:

1. bredere lavkost-testing
2. mindre representativ ekte modellbenchmark

Blind sammenligning brukes for å redusere påvirkning fra kjennskap til modellnavn.

## Exit criteria

- samme testcase kan sammenlignes mellom modeller
- modellresultat kan vurderes uten å vite modellnavnet på forhånd
- kostnad og responstid kan inngå i vurderingen

## Status ved levering

**Gjennomført i prototype/testform.**

Benchmarkdata, modellkjøring og blind evalueringsflyt er implementert som verktøy. En full fler-modell-benchmark er ikke dokumentert som gjennomført, og leveransen skal derfor ikke fremstille dette som et ferdig sammenligningsresultat.

---

# 15. Fase 12 – Faggrunnlag og SOURCEBANK

## Mål

Gi KI-løsningen et tydeligere og mer kontrollert faglig grunnlag.

## Leveranser

- felles SOURCEBANK
- temaspecifikt faggrunnlag
- autoritative kilder
- struktur per hovedtema

## Struktur

Felles kildebank:

- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`

Temaspesifikt faggrunnlag:

`docs/faggrunnlag/`

## Iterativ læring

Fagbanken ble gradvis utvidet.

Det ble også tydelig at KI ikke burde låses fullstendig til en statisk kildebank dersom oppdatert informasjon er nødvendig.

Faglig sikkerhet krever derfor både:

- kuraterte kilder
- tydelige KI-regler
- forsiktighet ved usikre faglige og juridiske spørsmål

## Exit criteria

- alle hovedtemaer har faglig grunnlag
- felles kildebank er tilgjengelig
- KI-reglene beskriver hvordan usikkerhet håndteres

## Status ved levering

**Gjennomført.**

---

# 16. Fase 13 – Web- og kildebruk

## Mål

Få bedre innsikt i hvilke kilder systemet bruker.

## Leveranser

- kilde-/webregistrering
- søkestreng
- tidspunkt
- modell
- tema
- domene
- sidetittel
- URL
- informasjon om web faktisk ble brukt

## Personvernkrav

Denne loggingen skal ikke brukes til brukerprofilering.

Samtaletekst og personopplysninger skal ikke automatisk lagres i denne loggen.

## Formål

Kildeanalysen kan brukes til:

- kvalitetssikring
- å identifisere relevante domener
- videre utvikling av SOURCEBANK
- framtidig lokal kunnskapsbank

## Status ved levering

**Delvis/prototypebasert gjennomført.**

Videre utvikling er mulig.

---

# 17. Fase 14 – Sikkerhetsherding

## Mål

Redusere teknisk risiko før videre testing og eventuell ordinær bruk.

## Leveranser

- rate limiting
- security headers
- same-origin-kontroll
- begrenset statisk filtilgang
- server-side personvern
- redusert debug-eksponering
- dataretensjon
- kontoeksport
- sikkerhetsdokumentasjon

## Iterativ læring

Sikkerhetsarbeidet ble utvidet etter systematisk gjennomgang av appen.

Det ble tydelig at sikkerhet ikke kunne behandles som én enkelt funksjon, men måtte ligge på tvers av:

- API
- autentisering
- filer
- logging
- KI-kall
- database
- brukerdata

## Exit criteria

- relevante sikkerhetsregresjonstester består
- sentrale sikkerhetstiltak er dokumentert
- avgrensninger er eksplisitte

## Status ved levering

**Gjennomført på prototypenivå.**

Dokumentasjon:

`docs/SIKKERHET-OG-PERSONVERN-v20.4.md`

---

# 18. Fase 15 – Design og brukeropplevelse

## Mål

Gi løsningen et konsistent og forståelig uttrykk.

## Fokusområder

- sidemeny
- hovednavigasjon
- lys/mørk/hybrid visning
- typografi
- ikoner
- temabilder
- samtalebobler
- handlingsknapper
- responsive visninger
- adminlayout

## Iterativ læring

Dette var ett av områdene med flest KI-korrigeringer.

KI-endringer kunne påvirke mer enn bestilt.

Det ble derfor innført sterkere regler for videre arbeid:

- godkjente visuelle komponenter skal ikke endres uten avtale
- eksisterende logoer og bilder skal ikke erstattes automatisk
- godkjent snakkeboblegeometri skal ikke endres tilfeldig
- nye større endringer skal ikke bygges før eksplisitt klarsignal

## Exit criteria

- sentrale visninger har konsistent struktur
- samme funksjon bør ha samme visuelle hierarki
- simulatorroller er tydelige
- design fungerer på relevante skjermstørrelser

## Status ved levering

**Gjennomført, med fortsatt potensial for videre finjustering.**

UX-dokumentasjon:

`docs/bmad/UX-DESIGN-BMAD.md`

---

# 19. Fase 16 – Brukertesting

## Mål

Teste løsningen med faktiske brukere og identifisere problemer som ikke nødvendigvis oppdages gjennom utviklertesting.

## Planlagte områder

Brukertest kan blant annet omfatte:

- opprette konto
- starte ny samtale
- beskrive situasjon
- bruke KI-veiledning
- finne relevant tema
- bruke simulator
- trigge personvernkontroll
- bruke historikk
- rapportere KI-svar

## Hva brukertesting skal undersøke

- utydelige brukerflyter
- misforståtte begreper
- visuelt rot
- funksjoner brukeren ikke finner
- personvernvarsler som ikke forstås
- urealistisk simulering
- nye behov

## Exit criteria

- testfunn dokumenteres
- høyprioritetsfunn vurderes
- relevante krav oppdateres ved behov

## Status ved levering

**Påbegynt/videre arbeid.**

Brukertesting er en del av prosjektets videre kvalitetsarbeid og er ikke ferdig som fullskala evaluering.

---

# 20. Fase 17 – Mulig lukket/offline arkitektur

## Mål

Vurdere hvordan løsningen kan brukes i virksomheter der ekstern KI eller internett ikke er tilgjengelig eller tillatt.

## Mulig framtidig arkitektur

- intern KI-modell
- intern database
- lokal kunnskapsbank
- lokal RAG
- ingen nødvendig ekstern webavhengighet
- provider-abstraksjon

## Begrunnelse

Samtalestøtte kan være relevant i organisasjoner med strengere sikkerhetskrav enn ordinære skyløsninger støtter.

Dette er derfor et arkitekturspor for framtidig videreutvikling.

## Exit criteria for framtidig løsning

- hvilke cloud-komponenter som må erstattes kan forklares
- KI-provider kan byttes gjennom abstraksjonslaget
- lokal kunnskapsbank kan beskrives arkitektonisk

## Status ved levering

**Planlagt videre arbeid – ikke implementert i leveransen.**

---

# 21. Endringskontroll

Nye ideer eller behov skal ikke automatisk legges til produktet.

Ved større endringer skal følgende vurderes:

1. Hvilket problem løser endringen?
2. Hører den hjemme i prosjektets nåværende scope?
3. Påvirker den Product Brief?
4. Påvirker den PRD?
5. Påvirker den UX?
6. Påvirker den arkitektur?
7. Krever den ny Epic eller Story?
8. Krever den nye tester?
9. Påvirker den personvern?
10. Påvirker den sikkerhet?
11. Påvirker den kostnad?
12. Påvirker den eksisterende godkjent funksjonalitet?

Dette gjør det mulig å arbeide iterativt uten å miste kontroll over scope.

---

# 22. Eksempler på endringer som oppstod gjennom testing

Følgende viser hvordan planen faktisk har blitt påvirket av gjennomføring og testing.

## Personvern

**Opprinnelig:** enklere frontendkontroll.

**Erfaring:** kunne omgås av andre KI-flyter og var for grov enkelte steder.

**Endring:** server-side gateway og mer kontekstbevisst anonymisering.

---

## Supabase

**Opprinnelig:** KI-generert databaseoppsett.

**Erfaring:** samtalelagring fungerte ikke fullt ut.

**Endring:** konkret database-rettighet måtte korrigeres.

---

## Simulator

**Opprinnelig:** KI spiller medarbeider.

**Erfaring:** svar kunne bli for polerte eller inneholde oppdiktede opplysninger.

**Endring:** strengere regler og automatiserte simulator-tester.

---

## KI-testing

**Opprinnelig:** regelbaserte vurderinger av problematiske svar.

**Erfaring:** enkelte tester ga falske utslag.

**Endring:** mer kontekstbevisst testing og manuell vurdering i tillegg.

---

## Testautentisering

**Problem:** automatiserte KI-tester fikk 401 fra autentiserte serverendepunkter.

**Vurdert løsning:** fjerne eller svekke autentisering.

**Valgt løsning:** eksplisitt test-only bypass.

Dette bevarte produksjonssikkerheten samtidig som automatiserte tester kunne kjøres.

---

## UI-regresjon

**Problem:** en samtalebobletest feilet.

**Analyse:** appen var korrekt, men testen krevde en gammel CSS-kommentar.

**Endring:** den foreldede testen ble korrigert i stedet for å endre fungerende produksjonskode.

---

# 22.1 Lokal sensordemo

For å gjøre leveransen etterprøvbar uten studentens hemmeligheter eller eksterne tjenester er det lagt til en isolert lokal demomodus.

- `npm run demo` starter samme frontend med deterministiske mock-svar
- ingen `.env`, Supabase eller KI-nøkkel er nødvendig
- `tests/test-sensor-demo.cjs` verifiserer oppstart, demo-bruker, analyse, veiledning, historikk og simulator
- produksjonsserveren er uendret

Demomodus er et vurderings- og testverktøy, ikke en erstatning for ekte KI-testing.

---

# 23. Status ved levering

Ved levering er hoveddelen av produktet implementert.

| Område | Status | Spor |
|---|---|---|
| Teknisk fundament | Gjennomført | rotkode, `package.json` |
| KI-integrasjon | Gjennomført | `server.js` |
| Kjerneflyt | Gjennomført | `app.js`, `server.js` |
| Personvern | Gjennomført/testet | `tests/test-privacy.js` |
| Autentisering | Gjennomført | Supabase/server |
| Historikk | Gjennomført | Supabase/regresjonstest |
| Simulator | Gjennomført/testet | `tests/test-simulation.js` |
| Roller/admin | Gjennomført | app/server |
| Modellstyring | Gjennomført | modell-/adminlogikk |
| KI-testing | Gjennomført | `tests/`, inkl. golden/fasit og matcherregresjon |
| Benchmark | Prototype/testform – full fler-modell-kjøring ikke dokumentert | benchmarklogikk/data |
| SOURCEBANK | Gjennomført | `docs/`, `data/` |
| Sikkerhetsherding | Gjennomført på prototypenivå | sikkerhetsdokumentasjon |
| Brukertesting | Påbegynt/videre arbeid | dokumentasjon/app |
| Lukket/offline løsning | Framtidig arbeid | arkitekturdokumentasjon |

Avvik og endringer fra tidligere planer er dokumentert i:

- `CHANGELOG.md`
- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`
- Git-historikken

---

# 24. Repo- og leveransestruktur

Ved sluttfasen ble repoet gjennomgått for å gjøre strukturen tydeligere.

Dokumentasjon:

`docs/`

BMAD:

`docs/bmad/`

KI-dokumentasjon:

`docs/ai/`

Faggrunnlag:

`docs/faggrunnlag/`

Tester:

`tests/`

Testdata:

`tests/cases/`

Bilder:

`assets/images/`

Database:

`database/`

Runtime-/referansedata:

`data/`

Denne oppryddingen ble gjort uten å omskrive Git-historikken, slik at tidligere utviklingsspor fortsatt er tilgjengelige.

---

# 25. Forholdet mellom plan og Git-historikk

Utviklingen startet før prosjektet var koblet til Git/GitHub.

Tidlige versjoner ble derfor utviklet lokalt før de senere ble lagt inn i repository. Den synlige Git-historikken viser samtidig at prototypecommits ligger før den første synlige committen av Product Brief og de øvrige BMAD-artefaktene. På grunn av den lokale oppstartsfasen kan Git alene ikke brukes til å rekonstruere den eksakte rekkefølgen før repository var etablert.

Det som kan dokumenteres sikkert, er at BMAD-formaliseringen skjedde mens utviklingen allerede var i gang, og at BMAD deretter ble brukt aktivt til å stramme inn krav, scope, arkitektur, testing og sporbarhet.

Dette forklarer hvorfor mange tidlige versjonscommits er konsentrert i perioden 23.–27. september 2026.

Etter at Git/GitHub var etablert, ble repository brukt fortløpende til:

- utvikling
- testing
- feilretting
- dokumentasjon
- repo-opprydding

Commit-datoen for en tidlig versjon viser derfor tidspunktet den ble lagt inn i Git, ikke nødvendigvis tidspunktet hele arbeidet bak versjonen først ble gjort.

Git-historikken er ikke omskrevet for å skape en kunstig tidslinje.

---

# 26. Sammenheng med øvrige BMAD-dokumenter

Denne planen skal leses sammen med:

- `product-brief.md`
- `docs/bmad/PRD.md`
- `docs/bmad/UX-DESIGN-BMAD.md`
- `docs/bmad/ARCHITECTURE-BMAD.md`
- `docs/bmad/EPICS-AND-STORIES-BMAD.md`

KI-prosessen er dokumentert i:

- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`

Testing er dokumentert gjennom:

- `docs/ai/AI-TESTPLAN.md`
- `tests/`

Sikkerhet og personvern:

- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md`

---

# 27. Evaluering

Prosjektet skal vurderes langs flere dimensjoner:

- funksjonalitet
- KI-kvalitet
- sikkerhet
- personvern
- UX
- kostnad
- modellvalg
- kildebruk
- testbarhet
- vedlikeholdbarhet
- samsvar mellom planlagt og faktisk produkt

Ikke alle videreutviklingsmål må være ferdige for at prototypen skal være en komplett prosjektleveranse.

Det viktige er å skille tydelig mellom:

- implementert
- delvis implementert
- planlagt videre arbeid

---

# 28. Refleksjonsgrunnlag

Sentrale temaer for refleksjon etter utviklingen er:

- hvordan prosjektet gikk fra skjema til samtalepartner
- hvorfor personvernarkitekturen ble utvidet
- hvordan simulatoren vokste i omfang
- hvordan tester også kunne inneholde feil
- hvordan KI-forslag ble korrigert eller reversert
- hvorfor kostnad og modellvalg ble egne krav
- hvordan Supabase-oppsett måtte korrigeres i faktisk drift
- hvordan sikkerhetskrav utviklet seg gjennom prosjektet
- hvordan BMAD ble brukt i en iterativ, ikke-lineær prosess
- hvordan Git-historikken dokumenterer iterasjoner og feilretting
- hvilke funksjoner som fortsatt bør videreutvikles etter prosjektleveransen

---

# 29. Oppsummering

Samtalestøtte er ikke utviklet etter en modell der hele produktet ble perfekt definert før første kodelinje.

Utviklingsprosessen har vært:

```text
planlegg
→ bygg
→ test
→ vurder
→ lær
→ juster
→ test igjen
→ dokumenter
→ bygg videre
```

BMAD har blitt brukt til å strukturere krav, arkitektur, UX og videre arbeid.

KI har blitt brukt aktivt i utviklingen, men KI-genererte forslag har blitt testet, vurdert, korrigert og enkelte ganger forkastet.

Implementeringsplanen er derfor både:

- en struktur for produktets utvikling
- en oversikt over faktisk gjennomført arbeid
- en dokumentasjon av hvordan nye krav oppstod
- et grunnlag for videre refleksjon og utvikling

Ved levering er kjerneproduktet, personvern, autentisering, historikk, simulator, admin, KI-testing og sentrale sikkerhetsmekanismer implementert i prototypeform.

Videre arbeid gjelder særlig mer omfattende brukertesting, videre modell-/benchmarkarbeid og eventuell framtidig lukket/offline arkitektur.