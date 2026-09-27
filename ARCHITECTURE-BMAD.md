# Architecture – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Architecture Document  
**Rammeverk:** BMAD  
**Status:** Planlagt arkitektur for første versjon  
**Språk:** Norsk  

---

## 1. Formål

Dette dokumentet beskriver den planlagte tekniske arkitekturen for Samtalestøtte.

Målet er å gjøre løsningen:

- sikker
- modulær
- testbar
- kostnadskontrollerbar
- personvernvennlig
- enkel å videreutvikle
- uavhengig av én bestemt KI-leverandør
- mulig å tilpasse til lukket intranett uten internettilgang

Arkitekturen skal støtte både dagens nettbaserte prototype og en framtidig intern variant.

---

# 2. Arkitekturprinsipper

## 2.1 Tydelig separasjon mellom lag

Løsningen skal deles i tydelige lag:

1. frontend
2. applikasjonsserver
3. autentisering/database
4. KI-integrasjon
5. kilde-/web-lag
6. sikkerhet/personvern
7. admin og observability

Dette reduserer kobling mellom komponentene og gjør det enklere å bytte leverandører senere.

---

## 2.2 Provider-uavhengighet

KI-leverandøren skal ikke være hardkodet inn i hele applikasjonen.

Applikasjonen skal bruke et abstraksjonslag slik at følgende kan byttes:

- ekstern KI-modell
- intern KI-modell
- OpenAI-kompatibelt API
- intern REST-tjeneste
- lokal modellserver

Samme prinsipp gjelder database og kunnskapskilder.

---

## 2.3 Privacy by design

Personvern skal være en del av arkitekturen, ikke et tillegg.

Det innebærer:

- personvernsjekk før KI-kall
- minst mulig logging av brukerinnhold
- bruker-eid historikk
- separasjon mellom brukerdata og teknisk analyse
- server-side kontroll i tillegg til frontend-kontroll
- eksplisitt samtykke før samtalevedlegg deles i feedback

---

# 3. Hovedarkitektur – nettversjon

```text
┌──────────────────────────┐
│        Nettleser         │
│  HTML / CSS / JavaScript │
└─────────────┬────────────┘
              │ HTTPS
              ▼
┌──────────────────────────┐
│    Node / Express API    │
│                          │
│ - autentisering          │
│ - personverngateway      │
│ - KI-routing             │
│ - admin-endepunkter      │
│ - logging                │
│ - kostnadsberegning      │
└──────┬────────┬──────────┘
       │        │
       │        ├───────────────────────────┐
       │                                    │
       ▼                                    ▼
┌───────────────┐                  ┌──────────────────┐
│   Supabase    │                  │   KI-leverandør │
│               │                  │                  │
│ Auth          │                  │ Luna/Terra/Sol   │
│ PostgreSQL    │                  │ eller annen LLM  │
│ RLS           │                  │                  │
└──────┬────────┘                  └────────┬─────────┘
       │                                    │
       │                                    ▼
       │                           ┌──────────────────┐
       │                           │   Web search     │
       │                           │  ved behov       │
       │                           └──────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Samtalehistorikk, roller │
│ feedback, admininnhold,  │
│ logger og benchmark      │
└──────────────────────────┘
```

---

# 4. Frontend

Frontend skal levere hele brukeropplevelsen.

Teknologi:

- HTML
- CSS
- JavaScript

Ansvar:

- navigasjon
- tema/undertema
- situasjonsinput
- personvernfeedback
- hovedveiledning
- oppfølgingsdialog
- simulator
- historikk
- admin
- benchmarkvisning
- kostnadsvisning

Frontend skal ikke inneholde:

- service role-nøkler
- KI-API-nøkler
- sensitive databasehemmeligheter

---

# 5. Applikasjonsserver

Backend skal kjøre på Node.js med Express.

Ansvar:

- autentiserte API-kall
- session/cookie-håndtering
- rollevalidering
- personverngateway
- KI-kall
- modellvalg
- benchmarklogikk
- web search logging
- kostnadsberegning
- feilhåndtering
- adminendepunkter
- sikkerhetsheadere
- rate limiting

Serveren skal være eneste lag som kan kommunisere med hemmelige nøkler og eksterne KI-tjenester.

---

# 6. Database og autentisering

Supabase brukes i nettversjonen.

Komponenter:

- Supabase Auth
- PostgreSQL
- Row Level Security
- database-tabeller
- rolle- og tilgangsdata

Data kan omfatte:

- brukerprofiler
- roller
- historikk
- innstillinger
- feedback
- redigerbart innhold
- modellvalg
- benchmarkresultater
- teknisk KI-bruksdata
- kilde-/webmetadata

---

# 7. Datamodell – prinsipper

## 7.1 Brukerdata

Brukerdata skal være direkte knyttet til bruker-ID der dette er nødvendig.

Eksempler:

- profil
- samtalehistorikk
- egne innstillinger

## 7.2 Teknisk analyse

Teknisk analyse skal så langt som mulig være frikoblet fra identifiserbar bruker.

Eksempler:

- tokenbruk
- estimert kostnad
- web search metadata
- kildebruk
- benchmarkdata

Formålet er å analysere systemet, ikke enkeltbrukeren.

---

# 8. KI-integrasjon

KI-laget skal være modulært.

Det skal kunne motta:

- systemprompt
- situasjonsbeskrivelse
- hovedtema
- undertema
- relevant historikk
- SOURCEBANK-kontekst
- simulatorrolle

KI-laget skal kunne returnere:

- strukturert veiledning
- oppfølgingssvar
- simulatorsvar
- tema/undertema
- kildebruk
- tokenbruk
- teknisk metadata

---

# 9. Modellvalg

Admin skal kunne velge mellom støttede modeller.

Aktivt modellvalg skal ligge i konfigurasjon/database og leses av serveren.

Dette gjør det mulig å:

- bytte modell uten redeploy
- teste billigere modell
- bruke sterkere modell ved behov
- sammenligne kvalitet og kostnad

---

# 10. Modellbenchmark

Benchmark skal kjøre samme testsak mot flere modeller.

For hver kjøring lagres:

- case-id
- modell
- svar
- tokens
- estimert kostnad
- responstid
- web search
- søkestrenger
- kilder
- eventuelle feil

Benchmarktrafikk skal merkes separat fra vanlig brukertrafikk.

---

# 11. Web search og kildeovervåking

KI skal kunne gjøre weboppslag når oppdatert eller presis informasjon er nødvendig.

Logg kan inneholde:

- søkestreng
- modell
- tema
- undertema
- domene
- sidetittel
- URL
- tidspunkt

Loggen skal ikke inneholde:

- samtaletekst
- personnavn
- direkte brukeridentitet der dette ikke er nødvendig

Formålet er:

- kvalitetskontroll
- identifisering av ofte brukte kilder
- utvikling av SOURCEBANK
- grunnlag for offline-modus

---

# 12. SOURCEBANK

SOURCEBANK skal være det dokumenterte faglige grunnlaget for løsningen.

Første nivå:

- manuelle kilder
- tema-relevante regler
- faglig avgrensning
- lenker og veiledning

Videre nivå:

- dokumenter delt i tekstbiter
- embeddings
- lokal søkemotor
- RAG

---

# 13. Lukket intranett – målarkitektur

```text
┌─────────────────────────────┐
│     Intern klient / PC      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Intern Samtalestøtte-server │
│ Node / tilsvarende          │
└───────┬─────────┬───────────┘
        │         │
        │         ├────────────────────┐
        │                              │
        ▼                              ▼
┌──────────────┐              ┌───────────────────┐
│ Intern DB    │              │ Intern KI-modell  │
│ PostgreSQL   │              │ vLLM/Ollama/API   │
└──────┬───────┘              └────────┬──────────┘
       │                               │
       ▼                               ▼
┌──────────────┐              ┌───────────────────┐
│ Intern auth  │              │ Lokal SOURCEBANK  │
│ / SSO        │              │ / RAG             │
└──────────────┘              └───────────────────┘

Ingen internettilgang nødvendig
```

---

# 14. Intern KI

Lukket variant skal kunne bruke:

- OpenAI-kompatibelt internt API
- vLLM
- Ollama
- intern REST-tjeneste
- annen virksomhetsgodkjent modellserver

Målet er å gjøre KI-integrasjonen utskiftbar uten å endre hele appen.

---

# 15. Lokal RAG / kunnskapsbank

I lukket miljø skal web search erstattes av lokale kilder.

Flyt:

```text
brukerinput
→ personverngateway
→ intern KI
→ lokalt oppslag
→ relevante tekstutdrag
→ KI-svar
```

Lokale kilder kan være:

- HR-rutiner
- interne prosedyrer
- arbeidsrettslige veiledere
- sikkerhetsregler
- lederhåndbøker
- godkjente eksterne kilder som er importert lokalt

---

# 16. Sikkerhetsarkitektur

Sikkerhet skal bygges i flere lag.

## 16.1 Klient

- personvernvarsling
- inputvalidering
- ingen hemmelige nøkler
- minimal teknisk informasjon

## 16.2 Server

- autentisering
- autorisering
- role checks
- privacy gateway
- rate limiting
- origin-kontroll
- sikkerhetsheadere
- logging uten sensitiv tekst

## 16.3 Database

- RLS
- minst nødvendige rettigheter
- separate adminroller
- kontroll på service role
- slettestrategi

---

# 17. Sessions og cookies

Sessions skal bruke sikre cookies.

Krav:

- HttpOnly
- Secure i produksjon
- SameSite
- kontrollert levetid
- server-side verifisering

---

# 18. Rate limiting

Rate limits skal beskytte:

- login
- registrering
- passordreset
- KI-kall
- benchmark

Dette reduserer risiko for:

- brute force
- misbruk
- kostnadsangrep
- uønsket trafikk

---

# 19. Feilhåndtering

Bruker skal få:

- forståelig feilmelding
- ingen intern stack trace
- ingen leverandørhemmeligheter
- ingen API-detaljer

Serveren kan logge:

- feilkode
- endpoint
- tidspunkt
- teknisk kategori

Samtaletekst skal ikke logges automatisk.

---

# 20. Hosting – nettversjon

Planlagt nettarkitektur:

- Render: Node/Express
- Supabase: Auth + PostgreSQL
- OpenAI eller annen API-basert KI
- web search via KI-laget

Fordeler:

- rask utrulling
- enkel testing
- lav inngangskostnad
- egnet for prototype

Begrensninger:

- ekstern avhengighet
- kostnader
- nettverkskrav
- ikke egnet for alle lukkede miljøer

---

# 21. Observability og kostnad

Systemet skal måle:

- tokenbruk
- modell
- kostnad
- responstid
- web search
- feilkoder

Dette brukes til:

- modellvalg
- økonomisk analyse
- feilsøking
- benchmark
- produktstrategi

---

# 22. Økonomisk arkitektur

Kostnadsdata skal være en del av teknisk arkitektur.

Komponenter med mulig kostnad:

- KI-kall
- web search
- database
- hosting
- lagring
- trafikk

Systemet skal gjøre det mulig å vurdere:

- kostnad per bruker
- kostnad per scenario
- kostnad per modell
- skaleringskostnad

---

# 23. Skalering

Hvis bruken øker skal arkitekturen kunne skaleres ved å:

- øke backend-kapasitet
- oppgradere database
- bruke caching
- redusere unødvendige KI-kall
- bytte til billigere modell
- bruke lokal RAG
- dele opp tjenester ved behov

---

# 24. Tilgjengelighet uten nett

Full offline-klient er ikke V1.

Arkitekturen skal likevel ikke være unødvendig avhengig av:

- eksterne fonter
- CDN
- tredjepartsbilder
- dynamiske webressurser

Dette gjør senere intranettversjon enklere.

---

# 25. Tekniske risikoer

## KI-leverandør endres

Tiltak:
- abstraksjonslag
- modellkonfigurasjon

## Prisøkning

Tiltak:
- kostnadslogging
- modellbytte
- lokal modell

## Databasevekst

Tiltak:
- retention
- sletting
- aggregert logging

## Web search endres

Tiltak:
- SOURCEBANK
- lokal RAG

## Sensitive brukerdata

Tiltak:
- privacy gateway
- minimert logging
- RLS

---

# 26. Teknologistack

## Frontend

- HTML
- CSS
- JavaScript

## Backend

- Node.js
- Express

## Database/Auth

- Supabase
- PostgreSQL
- Supabase Auth
- RLS

## KI

- API-basert språkmodell
- flere støttede modeller

## Hosting

- Render

## Versjonskontroll

- Git
- GitHub

---

# 27. Arkitekturvalg og begrunnelser

## Node/Express

Valgt fordi:

- JavaScript kan brukes på både frontend og backend
- enkel API-integrasjon
- godt egnet for studentprosjekt og webapplikasjon

## Supabase

Valgt fordi:

- autentisering
- PostgreSQL
- RLS
- rask prototypeutvikling

## Render

Valgt fordi:

- enkel deploy
- GitHub-integrasjon
- egnet for Node

## Flere KI-modeller

Valgt fordi:

- kvalitet og pris varierer
- leverandørmarkedet endres raskt
- reduserer lock-in

---

# 28. Mål for arkitekturen

Arkitekturen skal gjøre det mulig å svare ja på følgende:

- Kan vi bytte KI-modell uten å bygge hele løsningen på nytt?
- Kan vi skille brukerdata fra teknisk analyse?
- Kan vi beskytte historikk per bruker?
- Kan vi måle kostnad?
- Kan vi se kildebruk?
- Kan vi kjøre løsningen uten web search?
- Kan vi flytte den til intern KI senere?
- Kan vi erstatte ekstern database med intern database?
- Kan vi bruke lokal kunnskapsbank?
- Kan vi teste komponentene uavhengig?

---

# 29. Oppsummering

Samtalestøttes arkitektur skal støtte en avansert KI-applikasjon uten å låse produktet til én leverandør.

Nettversjonen skal bruke:

- frontend
- Node/Express
- Supabase
- ekstern KI
- kontrollert web search

En framtidig lukket versjon skal kunne bruke:

- intern server
- intern database
- intern autentisering
- intern KI
- lokal RAG
- ingen internettilgang

Arkitekturen skal kombinere:

- sikkerhet
- personvern
- KI-fleksibilitet
- kostnadskontroll
- observability
- testbarhet
- framtidig offline/intranett-støtte


## v20.5 – providerlag, brukertest og testmiljø

KI-arkitekturen utvides fra én direkte OpenAI-klient til et providerlag der modellmetadata bestemmer om kallet går direkte til OpenAI eller via OpenRouter. Begge nøkler leses kun server-side (`OPENAI_API_KEY` / `OPENROUTER_API_KEY`). OpenRouter brukes via OpenAI-kompatibelt API og gjør det mulig å benchmarke gratis og betalte modeller gjennom samme applikasjonsflyt. Provider-uavhengigheten støtter også den langsiktige planen om intern KI på lukket nett.

Brukertestdata lagres i en separat `survey_responses`-tabell uten kobling til samtaler eller bruker-ID. Invitasjoner utvides med rolle og utløpsdato. Dette er bevisste skiller mellom produktbruk, evaluering og identitet.

Dagens publiserte testmiljø kjører på Render. Gratis testhosting kan gå i dvale ved inaktivitet og gi treg første innlasting. Dette er en prototypebegrensning, ikke et ytelsesmål for produksjon eller lukket intranett.

## v20.6 – evaluering og personvernmarkører
Brukertestsvar lagres uten bruker-ID. En separat deltakertabell med kun bruker-ID og tidspunkt hindrer dobbel innsending uten å koble identiteten til svarinnholdet. Personvernbekreftelse lagres separat som tidspunkt per konto. Brukertest kan aktiveres/deaktiveres via app-innstilling uten kodeendring eller sletting av eksisterende data.

