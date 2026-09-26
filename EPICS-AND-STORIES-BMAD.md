# Epics & User Stories – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Epics & User Stories  
**Rammeverk:** BMAD  
**Status:** Planlagt implementeringsstruktur  
**Språk:** Norsk  

---

## 1. Formål

Dette dokumentet deler Samtalestøtte opp i større utviklingsområder (epics) og konkrete user stories.

Hver story skal ha tydelige akseptansekriterier slik at det er mulig å avgjøre om funksjonen er ferdig.

---

# Epic 1 – Grunnstruktur og navigasjon

## Story 1.1 – Hovedlayout

**Som bruker** vil jeg ha en tydelig og rolig hovedlayout slik at jeg raskt forstår hvor jeg skal navigere.

### Akseptansekriterier

- sidebar finnes
- hovedinnhold er tydelig separert
- hybridmodus fungerer
- logo vises korrekt
- hovednavigasjon er tilgjengelig
- layout fungerer på desktop

---

## Story 1.2 – Temaoversikt

**Som leder** vil jeg se hovedtemaene slik at jeg kan starte fra et område som passer situasjonen.

### Akseptansekriterier

- åtte hovedtemaer vises
- hvert tema er tydelig navngitt
- hvert tema kan åpnes
- visuell stil er konsistent

---

# Epic 2 – Autentisering og tilgang

## Story 2.1 – Innlogging

**Som bruker** vil jeg logge inn slik at mine samtaler og innstillinger bare er tilgjengelige for meg.

### Akseptansekriterier

- gyldig bruker kan logge inn
- feil innlogging gir generisk feilmelding
- sesjon lagres sikkert
- bruker forblir innlogget ved refresh

---

## Story 2.2 – Invitasjonsbasert registrering

**Som administrator** vil jeg begrense registrering slik at bare inviterte brukere kan opprette konto.

### Akseptansekriterier

- registrering krever gyldig token
- ugyldig token avvises
- token kan bare brukes én gang

---

## Story 2.3 – Roller

**Som administrator** vil jeg skille user, editor og admin slik at brukere bare får nødvendige rettigheter.

### Akseptansekriterier

- user finnes
- editor finnes
- admin finnes
- rolle sjekkes server-side

---

# Epic 3 – Personvern

## Story 3.1 – Personvernsjekk i frontend

**Som bruker** vil jeg få beskjed hvis jeg skriver identifiserende informasjon slik at jeg kan endre teksten før den sendes.

### Akseptansekriterier

- navn kan oppdages
- e-post kan oppdages
- telefon kan oppdages
- fødselsdata kan oppdages
- adresse kan oppdages
- kjønnet språk kan oppdages

---

## Story 3.2 – Server-side personverngateway

**Som systemeier** vil jeg at serveren kontrollerer teksten slik at frontend ikke kan omgås.

### Akseptansekriterier

- alle KI-endepunkter bruker samme gateway
- brudd stopper KI-kall
- ingen bypass via direkte API

---

## Story 3.3 – Personvernhjelp

**Som bruker** vil jeg få hjelp til å rette teksten slik at jeg slipper å formulere alt på nytt.

### Akseptansekriterier

- systemet viser hva som er oppdaget
- «Fiks personvern» finnes
- nødvendig kontekst beholdes

---

# Epic 4 – Situasjonsanalyse

## Story 4.1 – Beskriv situasjon

**Som leder** vil jeg beskrive situasjonen med egne ord slik at jeg slipper å navigere gjennom mange skjemaer.

### Akseptansekriterier

- tekstfelt finnes
- få obligatoriske felt
- personvern sjekkes
- teksten kan sendes til analyse

---

## Story 4.2 – Finn hovedtema

**Som bruker** vil jeg få forslag til hovedtema slik at systemet kan hjelpe meg videre.

### Akseptansekriterier

- KI returnerer hovedtema
- forslag vises
- bruker kan endre

---

## Story 4.3 – Finn undertema

**Som bruker** vil jeg få forslag til undertema slik at veiledningen får riktig kontekst.

### Akseptansekriterier

- undertema returneres
- høy sikkerhet kan gå direkte videre
- lav sikkerhet viser alternativer
- bruker kan overstyre

---

# Epic 5 – Samtaleveiledning

## Story 5.1 – Generer hovedveiledning

**Som leder** vil jeg få strukturert veiledning slik at jeg kan forberede samtalen bedre.

### Akseptansekriterier

Svar kan inneholde:

- mål
- struktur
- åpning
- spørsmål
- reaksjoner
- neste steg

---

## Story 5.2 – Begrensninger

**Som bruker** vil jeg vite når systemet ikke bør gi et bastant råd.

### Akseptansekriterier

- ingen diagnose
- ingen skyldkonklusjon
- ingen automatisk HR-beslutning
- eskalering anbefales ved behov

---

# Epic 6 – Oppfølgingsdialog

## Story 6.1 – Fortsett samtalen

**Som bruker** vil jeg stille oppfølgingsspørsmål slik at jeg kan utforske situasjonen videre.

### Akseptansekriterier

- tidligere kontekst beholdes
- nytt input personvernsjekkes
- svar er kortere enn hovedveiledning
- Enter sender
- Shift+Enter lager linjeskift

---

# Epic 7 – Samtalesimulering

## Story 7.1 – Start simulering

**Som leder** vil jeg starte en øvelse slik at jeg kan trene før den virkelige samtalen.

### Akseptansekriterier

- simulator kan åpnes
- situasjon brukes som kontekst
- KI spiller medarbeider

---

## Story 7.2 – Dynamisk medarbeiderrolle

**Som bruker** vil jeg at KI-en reagerer realistisk slik at øvelsen føles nyttig.

### Akseptansekriterier

KI kan uttrykke:

- motstand
- frustrasjon
- sorg
- taushet
- usikkerhet
- samarbeid

---

## Story 7.3 – Samtalekontekst

**Som bruker** vil jeg at simulatoren husker dialogen slik at svarene henger sammen.

### Akseptansekriterier

- tidligere meldinger brukes
- KI ignorerer ikke sentral kontekst
- dialogen er sammenhengende

---

## Story 7.4 – Refleksjon etter simulering

**Som bruker** vil jeg få kort refleksjon slik at jeg kan lære av øvelsen.

### Akseptansekriterier

- hva fungerte
- hva kunne forbedres
- alternative formuleringer
- neste steg

---

# Epic 8 – Historikk

## Story 8.1 – Lagre samtale

**Som bruker** vil jeg lagre arbeid slik at jeg kan finne tilbake til det senere.

### Akseptansekriterier

- samtale lagres
- tema lagres
- undertema lagres
- bruker-ID kobles riktig

---

## Story 8.2 – Åpne historikk

**Som bruker** vil jeg åpne tidligere arbeid.

### Akseptansekriterier

- bare egne samtaler vises
- samtale kan åpnes
- personvernsjekk kan kjøres ved åpning

---

## Story 8.3 – Slette historikk

**Som bruker** vil jeg slette egne data.

### Akseptansekriterier

- én samtale kan slettes
- all historikk kan slettes

---

# Epic 9 – Feedback

## Story 9.1 – Rapporter KI-svar

**Som bruker** vil jeg rapportere et dårlig svar slik at systemet kan forbedres.

### Akseptansekriterier

- kategori kan velges
- kommentar er valgfri
- kilde/funksjon registreres
- samtale er ikke vedlagt som standard

---

## Story 9.2 – Legg ved samtalen

**Som bruker** vil jeg frivillig kunne legge ved samtalen slik at problemet kan undersøkes bedre.

### Akseptansekriterier

- opt-in
- av som standard
- personvernsjekk før innsending

---

# Epic 10 – Teknisk feilrapportering

## Story 10.1 – Rapporter feil

**Som bruker** vil jeg rapportere teknisk feil uten å måtte forstå tekniske detaljer.

### Akseptansekriterier

Rapport kan inneholde:

- versjon
- tidspunkt
- side
- feilkode
- nettleser
- endpoint

Samtaletekst legges ikke ved automatisk.

---

# Epic 11 – Admin

## Story 11.1 – Admin-dashboard

**Som admin** vil jeg ha én oversikt over systemfunksjoner.

### Akseptansekriterier

- roller
- innhold
- modeller
- kostnader
- benchmark
- feedback
- kildebruk

---

## Story 11.2 – Sammenleggbare seksjoner

**Som admin** vil jeg kunne minimere seksjoner slik at siden ikke blir visuelt overfylt.

### Akseptansekriterier

- seksjoner kan utvides/minimeres
- Rediger innhold er lukket som standard

---

## Story 11.3 – Rediger innhold

**Som editor/admin** vil jeg kunne endre synlig tekst uten kodeendring.

### Akseptansekriterier

- innhold kan redigeres
- ulagrede endringer vises
- lagring krever bekreftelse

---

# Epic 12 – Modellvalg

## Story 12.1 – Velg KI-modell

**Som admin** vil jeg bytte modell slik at jeg kan balansere kvalitet og kostnad.

### Akseptansekriterier

- støttede modeller vises
- aktiv modell vises
- modell lagres i database
- redeploy er ikke nødvendig

---

# Epic 13 – Kostnadslogging

## Story 13.1 – Registrer tokenbruk

**Som systemeier** vil jeg registrere tokenbruk slik at kostnad kan beregnes.

### Akseptansekriterier

- input tokens lagres
- output tokens lagres
- modell lagres
- estimert kostnad beregnes

---

## Story 13.2 – Kostnadsoversikt

**Som admin** vil jeg se kostnad over tid.

### Akseptansekriterier

- 24 timer
- 7 dager
- 30 dager
- modellfordeling
- funksjonsfordeling

---

# Epic 14 – Modellbenchmark

## Story 14.1 – Fast testbank

**Som systemeier** vil jeg ha faste testsaker slik at modeller kan sammenlignes på likt grunnlag.

### Akseptansekriterier

- minst 47 undertemaer
- minst 2 tester per undertema
- minst 94 saker totalt

---

## Story 14.2 – Kjør benchmark

**Som admin** vil jeg kjøre samme testsak mot flere modeller.

### Akseptansekriterier

- minst 3 modeller
- samme input
- samme rammer
- resultater lagres

---

## Story 14.3 – Budsjettgrense

**Som admin** vil jeg sette kostnadsgrense slik at testing ikke blir unødvendig dyr.

### Akseptansekriterier

- kostnadsestimat før start
- hard grense
- automatisk stopp
- manuell stopp

---

# Epic 15 – Web search og kildebruk

## Story 15.1 – Gjør weboppslag

**Som KI-system** vil jeg hente oppdatert informasjon når dette er nødvendig.

### Akseptansekriterier

- web search kan aktiveres
- ikke alle saker må søke

---

## Story 15.2 – Logg kildebruk

**Som admin** vil jeg se hvilke kilder som brukes slik at vi kan vurdere SOURCEBANK.

### Akseptansekriterier

- søkestreng
- domene
- sidetittel
- URL
- modell
- tema
- undertema
- tidspunkt

---

## Story 15.3 – Ingen brukerprofilering

**Som bruker** vil jeg at kildeanalysen ikke skal brukes til å overvåke meg.

### Akseptansekriterier

- ingen samtaletekst i logg
- ingen direkte bruker-ID i kildeanalyse

---

# Epic 16 – SOURCEBANK

## Story 16.1 – Dokumentert kildebank

**Som systemeier** vil jeg ha en kildebank slik at KI-en har et tydelig faglig grunnlag.

### Akseptansekriterier

- kilder dokumenteres
- tema-relevans kan beskrives
- faglige begrensninger finnes

---

## Story 16.2 – Kandidater til offline-kunnskapsbank

**Som systemeier** vil jeg analysere webbruk slik at ofte brukte kilder kan lagres lokalt senere.

### Akseptansekriterier

- mest brukte domener
- mest brukte sider
- mest brukte søketemaer

---

# Epic 17 – Sikkerhet

## Story 17.1 – Sikre cookies

**Som systemeier** vil jeg sikre sesjoner.

### Akseptansekriterier

- HttpOnly
- Secure
- SameSite

---

## Story 17.2 – Rate limiting

**Som systemeier** vil jeg hindre misbruk.

### Akseptansekriterier

- login
- registrering
- reset
- KI-kall
- benchmark

---

## Story 17.3 – Sikker statisk servering

**Som systemeier** vil jeg bare eksponere nødvendige frontendfiler.

### Akseptansekriterier

- serverkode ikke offentlig
- SQL ikke offentlig
- tester ikke offentlig
- hemmeligheter ikke offentlig

---

# Epic 18 – Lukket intranett

## Story 18.1 – Provider-uavhengig KI-lag

**Som virksomhet** vil jeg kunne bruke intern KI slik at løsningen kan brukes uten ekstern API.

### Akseptansekriterier

- KI-lag kan byttes
- intern endpoint støttes
- resten av appen krever minimale endringer

---

## Story 18.2 – Intern database

**Som virksomhet** vil jeg kunne bruke intern database.

### Akseptansekriterier

- datamodell kan flyttes
- PostgreSQL-lignende løsning støttes

---

## Story 18.3 – Lokal kunnskapsbank

**Som virksomhet** vil jeg bruke lokale kilder uten internett.

### Akseptansekriterier

- web search kan slås av
- lokal RAG kan brukes
- godkjente interne dokumenter kan brukes

---

# Epic 19 – Brukertesting

## Story 19.1 – UX-test

**Som produkteier** vil jeg teste løsningen med reelle brukere slik at vi kan forbedre brukeropplevelsen.

### Akseptansekriterier

- 8–12 planlagte brukertester
- realistiske oppgaver
- observasjon dokumenteres
- funn prioriteres

---

## Story 19.2 – Mål for brukertest

### Akseptansekriterier

- minst 90 % fullfører hovedflyten uten hjelp
- minst 80 % vurderer støtten som relevant og konkret

---

# Epic 20 – Økonomisk bærekraft

## Story 20.1 – Estimer brukerforløp

**Som produkteier** vil jeg vite hva en typisk bruker koster slik at framtidig drift kan vurderes.

### Akseptansekriterier

- KI-kostnad estimeres
- webkostnad estimeres
- typisk forløp kan summeres

---

## Story 20.2 – Vurdere betalingsmodell

**Som produkteier** vil jeg kunne vurdere abonnement/lisens dersom løsningen får reell bruk.

### Akseptansekriterier

- kostnadsgrunnlag finnes
- betalingsmodell er ikke nødvendig i V1
- gratis/rimelig framtidig modell er mulig

---

# 21. Foreslått implementeringsrekkefølge

1. grunnstruktur og layout
2. autentisering
3. roller
4. personvern
5. tema/undertema
6. hovedveiledning
7. oppfølgingsdialog
8. simulering
9. historikk
10. feedback
11. admin
12. modellvalg
13. kostnadslogging
14. benchmark
15. web search/kilder
16. SOURCEBANK
17. sikkerhetsherding
18. brukertesting
19. intranettarkitektur
20. økonomisk evaluering

---

# 22. Definition of Done

En story er ferdig når:

- funksjonen virker
- akseptansekriteriene er oppfylt
- relevant personvern er vurdert
- relevant sikkerhet er vurdert
- funksjonen er testet
- ingen kritiske regresjoner er oppdaget
- dokumentasjon er oppdatert
