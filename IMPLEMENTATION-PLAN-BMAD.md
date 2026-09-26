# Implementation Plan – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Revidert Implementation Plan  
**Rammeverk:** BMAD-støttedokument  
**Status:** Revidert plan basert på iterativ utvikling  
**Språk:** Norsk  

---

## 1. Formål

Denne implementeringsplanen beskriver hvordan Samtalestøtte struktureres videre innenfor BMAD-rammeverket.

Utviklingen av Samtalestøtte har ikke fulgt en strengt lineær prosess. Produktet har blitt utviklet iterativt, der funksjoner, brukerflyt, sikkerhet, personvern og tekniske løsninger har blitt vurdert og justert underveis. Nye behov har oppstått som følge av testing, tekniske utfordringer, refleksjon rundt brukeropplevelse og nye ideer som har blitt identifisert etter hvert som løsningen har blitt mer komplett.

Planen skal derfor ikke leses som en påstand om at alle faser ble gjennomført i denne rekkefølgen fra første dag. Den fungerer som en revidert struktur for videre arbeid og som dokumentasjon på hvordan prosjektets ulike deler henger sammen.

---

## 2. Utviklingsmetodikk

Samtalestøtte utvikles med en kombinasjon av:

- BMAD som planleggings- og dokumentasjonsrammeverk
- iterativ produktutvikling
- kontinuerlig testing
- gradvis kravjustering
- brukerorientert design
- teknisk risikovurdering
- refleksjon og forbedring underveis

Arbeidsmåten kan beskrives som:

```text
idé
→ planlegging
→ prototype
→ testing
→ observasjon
→ justering
→ ny test
→ videreutvikling
```

Dette betyr at Product Brief, PRD, UX, Architecture og Epics & Stories kan revideres når ny kunnskap oppstår.

Målet er ikke å late som alle beslutninger var kjent på forhånd, men å sikre at dokumentasjonen til slutt gjenspeiler den løsningen som faktisk planlegges og leveres.

---

## 3. Hvorfor planen revideres

Flere viktige funksjoner og krav har blitt tydeligere først etter at deler av løsningen var bygget.

Eksempler:

- behovet for en sterkere server-side personverngateway
- modellbenchmark og kostnadslogging
- monitorering av weboppslag
- adminstyrt modellvalg
- tydeligere rollemodell
- forbedret samtalesimulering
- behov for SOURCEBANK og framtidig RAG
- plan for lukket intranett
- sikrere sletting og logging
- tydeligere skille mellom teknisk feilrapportering og rapportering av KI-svar
- behov for automatisert testbank
- tydeligere UX-prinsipper
- krav om at adminseksjoner kan minimeres

Disse endringene representerer ikke nødvendigvis feil i den opprinnelige ideen. De viser at prosjektet har modnet gjennom faktisk utvikling og testing.

---

# 4. Fase 1 – Fundament

## Leveranser

- prosjektstruktur
- Git-repository
- frontendgrunnlag
- Node/Express
- databasekobling
- hosting
- grunnleggende layout

## Exit criteria

- app starter lokalt
- app kan deployes
- frontend og backend kommuniserer

---

# 5. Fase 2 – Autentisering og data

## Leveranser

- Supabase Auth
- login/logout
- invitasjon
- cookies/session
- roller
- RLS
- historikktabeller

## Begrunnelse

Innlogging ble vurdert som nødvendig fordi løsningen skal lagre personlig historikk og skille ordinære brukere fra redaktører og administratorer.

## Exit criteria

- bruker kan logge inn
- bruker kan ikke lese andres data
- adminrolle valideres server-side

---

# 6. Fase 3 – Personvern

## Leveranser

- frontend privacy checker
- server privacy gateway
- anonymiseringshjelp
- personvernstatus
- redusert teknisk logging av identifiserende data

## Iterativ læring

Personvernkontrollen ble gradvis utvidet etter hvert som flere brukerflyter ble lagt til. Det ble tydelig at kontroll i frontend alene ikke var tilstrekkelig, og server-side kontroll ble derfor definert som et nødvendig sikkerhetslag.

## Exit criteria

- KI-kall kan ikke omgå privacy gateway
- definerte identifikatorer testes
- tekniske logger lagrer minst mulig brukerrelatert informasjon

---

# 7. Fase 4 – Kjernefunksjon

## Leveranser

- 9 hovedtemaer
- undertemaer
- situasjonsanalyse
- temaidentifikasjon
- hovedveiledning
- oppfølging

## Iterativ læring

Brukerflyten ble forenklet etter vurdering av hvor mange valg brukeren måtte gjøre. Dersom KI-en allerede kan identifisere både tema og undertema, bør brukeren ikke tvinges gjennom unødvendige mellomsteg.

## Exit criteria

- komplett standard brukerflyt fungerer

---

# 8. Fase 5 – Simulering

## Leveranser

- simulator
- medarbeiderrolle
- samtalekontekst
- avatarer/bobler
- refleksjon
- personvernkontroll i simulator

## Iterativ læring

Simulatoren ble en større del av produktet enn først antatt. Visuell plassering, boblegeometri, rolleforståelse og personvernsjekk måtte justeres flere ganger for å gjøre øvelsen tydelig og konsistent.

## Exit criteria

- flertrinns simulering fungerer uten konteksttap
- bruker forstår tydelig hvem som spiller leder og medarbeider

---

# 9. Fase 6 – Historikk og feedback

## Leveranser

- lagring
- åpning
- sletting
- rapporter svar
- valgfritt samtalevedlegg
- teknisk feilrapport

## Iterativ læring

Det ble vurdert som viktig å skille mellom:

- kvalitet på KI-svar
- tekniske feil

Samtalevedlegg til feedback skal være frivillig og avslått som standard.

## Exit criteria

- data er brukerbeskyttet
- feedback kan lagres uten automatisk samtaletekst

---

# 10. Fase 7 – Admin

## Leveranser

- roller
- innholdsredigering
- sammenleggbare seksjoner
- modellvalg
- kostnadsoversikt
- kildeoversikt
- benchmark

## Iterativ læring

Admin vokste i omfang etter hvert som flere drifts- og kvalitetsfunksjoner ble identifisert. For å unngå en visuelt overfylt side skal store seksjoner kunne minimeres. «Rediger innhold» skal være lukket som standard.

## Exit criteria

- adminfunksjoner er server-beskyttet
- rediger innhold er minimert som standard

---

# 11. Fase 8 – Modell- og kostnadssystem

## Leveranser

- modellabstraksjon
- tokenlogging
- kostnadsestimat
- responstid
- funksjonsfordeling

## Begrunnelse

Det ble vurdert som utilstrekkelig å velge KI-modell kun på bakgrunn av opplevd kvalitet. De mest kapable modellene er ofte dyrere, og derfor skal kvalitet vurderes opp mot faktisk kostnad og responstid.

## Exit criteria

- minst tre modeller kan registreres og sammenlignes

---

# 12. Fase 9 – Benchmark

## Leveranser

- minst 112 testsaker
- minimum to per undertema
- gratis mocktest
- ekte benchmark
- budsjettgrense
- resultatvisning

## Iterativ læring

Full benchmark på alle saker og modeller kan bli kostbar. Teststrategien ble derfor delt i:

1. stor lavkost/mock-basert testbank
2. mindre representativ ekte modellbenchmark

Dette gjør det mulig å teste bredt uten unødvendige API-kostnader.

## Exit criteria

- samme testsak kan kjøres mot flere modeller
- testtrafikk er separert
- benchmark kan stoppes ved budsjettgrense

---

# 13. Fase 10 – Web og SOURCEBANK

## Leveranser

- kontrollerte weboppslag
- søkelogg
- kilde-URL
- domener
- adminoversikt
- SOURCEBANK-kandidater

## Iterativ læring

Det ble identifisert et behov for å vite hvilke nettsider KI faktisk bruker. Dette skal ikke brukes til å overvåke brukere, men til å finne hvilke kilder som bør inngå i en framtidig lokal kunnskapsbank.

## Exit criteria

- kildebruk kan analyseres uten brukerprofilering
- samtaletekst lagres ikke i kildeanalysen

---

# 14. Fase 11 – Sikkerhetsherding

## Leveranser

- rate limiting
- security headers
- statisk filbegrensning
- debugfjerning
- retention
- kontosletting
- sikkerhetsdokumentasjon

## Iterativ læring

Sikkerhetskravene ble utvidet etter en mer systematisk gjennomgang av appen. Dette omfatter blant annet sterkere server-side kontroll, mindre informasjonslekkasje og tydeligere separasjon mellom brukerdata og tekniske logger.

## Exit criteria

- sikkerhetsregresjonstest består
- dokumenterte sikkerhetstiltak er implementert eller eksplisitt avgrenset

---

# 15. Fase 12 – Brukertesting

## Plan

Det planlegges **8–12 ordinære brukertester**.

Så langt det er praktisk mulig skal flere testpersoner ha ledererfaring, personalansvar eller HR-/lederutviklingsbakgrunn.

Testoppgaver kan være:

- start en ny sak
- beskriv en situasjon
- bruk KI-forslag til tema og undertema
- få veiledning
- bruk simulator
- trigge personvernvarsel
- bruk historikk
- rapporter et KI-svar

## Hva brukertesten skal brukes til

Brukertesting skal ikke bare bekrefte at løsningen fungerer. Den skal aktivt brukes til å finne:

- utydelige brukerflyter
- misforståtte begreper
- visuelt rot
- funksjoner brukerne ikke finner
- personvernvarsler som ikke forstås
- simulering som oppleves urealistisk
- nye behov som ikke ble identifisert tidligere

Funn fra brukertesting kan føre til nye eller reviderte krav.

## Exit criteria

- testfunn dokumenteres
- høyprioritetsfunn vurderes
- relevante BMAD-dokumenter oppdateres ved større endringer

---

# 16. Fase 13 – Arkitektur for lukket nettverk

## Leveranser

- dokumentert intern KI-variant
- dokumentert intern database
- lokal RAG-design
- ingen nødvendig web dependency
- provider abstraction

## Begrunnelse

Løsningen skal kunne være relevant i virksomheter der eksterne KI-tjenester eller internettilgang ikke er tillatt. Det skal derfor planlegges for intern KI, intern database og lokal kunnskapsbank.

## Exit criteria

- overgang fra cloud til intern løsning kan forklares teknisk
- hvilke komponenter som må erstattes er dokumentert

---

# 17. Fase 14 – Evaluering

## Evaluering

Prosjektet skal vurderes på:

- kvalitet
- kostnad
- sikkerhet
- personvern
- UX
- modellvalg
- kildebruk
- skalerbarhet
- brukertestfunn
- samsvar mellom planlagt og faktisk produkt

## Sluttleveranser

- oppdatert Product Brief
- PRD
- UX Design
- Architecture
- Epics & Stories
- Implementation Plan
- sikkerhetsdokumentasjon
- testdokumentasjon
- refleksjonsgrunnlag

---

# 18. Endringskontroll

Når nye ideer eller behov oppstår, skal de ikke automatisk legges til produktet.

Ved større endringer skal følgende vurderes:

1. Hvilket problem løser endringen?
2. Hører den hjemme i V1?
3. Påvirker den Product Brief?
4. Påvirker den Scope?
5. Påvirker den PRD?
6. Påvirker den UX?
7. Påvirker den Architecture?
8. Krever den ny Epic eller Story?
9. Krever den nye tester?
10. Påvirker den personvern, sikkerhet eller kostnad?

Dette gjør det mulig å være iterativ uten å miste kontroll over prosjektets omfang.

---

# 19. Forholdet mellom BMAD og iterativ utvikling

BMAD-dokumentene skal brukes som styringsdokumenter, men ikke behandles som uforanderlige.

Prosjektet skal kunne revidere dokumentene når:

- testing avdekker et problem
- brukerfeedback viser et nytt behov
- sikkerhetsgjennomgang avdekker risiko
- kostnadsdata viser at en løsning er lite bærekraftig
- en ny teknisk løsning gir et bedre alternativ
- scope må reduseres eller presiseres

Det viktige er at endringen dokumenteres og begrunnes.

---

# 20. Refleksjonsgrunnlag

Den iterative prosessen skal brukes aktivt i refleksjonsnotatet.

Aktuelle refleksjonspunkter:

- hvilke funksjoner som endret retning underveis
- hvorfor personvernarkitekturen ble utvidet
- hvordan simuleringen ble forbedret gjennom visuell og funksjonell testing
- hvorfor kostnad ble et eget produktkrav
- hvordan weboppslag førte til idéen om lokal SOURCEBANK
- hvorfor intern KI/offline arkitektur ble relevant
- hvordan BMAD ble brukt selv om utviklingen ikke var lineær
- hvordan brukertesting påvirket eller forventes å påvirke produktet

---

# 21. Oppsummering

Samtalestøtte utvikles ikke etter en modell der hele produktet defineres perfekt før første kodelinje.

Prosessen er iterativ:

```text
planlegg
→ bygg
→ test
→ lær
→ juster
→ dokumenter
→ bygg videre
```

BMAD brukes for å strukturere og dokumentere beslutningene, mens testing og erfaring brukes for å forbedre produktet.

Denne implementeringsplanen er derfor en revidert plan som viser hvordan utviklingen skal struktureres videre og hvordan tidligere læring innarbeides i prosjektet.


## v20.5 – neste iterasjon

Denne iterasjonen følger prosjektets faktiske arbeidsmåte: behov ble oppdaget gjennom faglig gjennomgang og bruk av prototypen, og implementeres deretter med oppdatering av dokumentasjon og tester.

1. Utvide temataksonomien til 9 hovedtemaer / 56 undertemaer.
2. Utvide SOURCEBANK med faste autoritative kilder for mobbing, trakassering, varsling, tilrettelegging og vold/trusler.
3. Regenerere fast benchmark til 112 saker og legge inn flere regelverksnære kildetester.
4. Legge OpenRouter til providerlaget og benchmarkpanelet.
5. Legge inn kort brukertest og anonymisert lagring i Supabase.
6. Legge inn rollebaserte, utløpende vurderingsinvitasjoner.
7. Gjøre simulator-CTA mer synlig uten å endre godkjent boblegeometri.
8. Oppdatere README, BMAD-filer og changelog i samme versjon.
9. Kjør statiske tester og eksisterende regresjonstester før pakking.
