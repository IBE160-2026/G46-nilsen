# Gjøremålsliste etter faglærers tilbakemelding – 26.10.2026

Denne listen bygger på faglærers nye vurdering av `product-brief.md` og skal brukes som arbeidsliste fram mot endelig innlevering. Målet er å rette det som faktisk kan påvirke vurderingen, uten å bygge om fungerende funksjonalitet unødvendig.

## Prioritet 1 – bør gjøres først

- [x] **Rett README etter repo-flyttingen og skill lokal Node-kompatibilitet fra Render-runtime**
  - `cd Samtalestotte` er endret til `cd G46-nilsen`.
  - Mappestrukturen starter nå med `G46-nilsen/`.
  - `engines.node` er endret fra `>=26.12.1 <27` til `>=22 <27` for lokal kompatibilitet/sensor.
  - Faglærer har verifisert `npm ci` og `npm test` på Node 23.11.
  - Render skal fortsatt bruke `NODE_VERSION=26.12.1` som sikkerhetspatchet produksjonsruntime.

- [x] **Revider Scope i product brief**
  - Scope er delt i **In for v1 – kjerne**, **Tillegg som er bygget i prototypen** og **Utenfor v1 / framtidige utvidelser**.
  - Kjerneflyten er tydelig avgrenset til situasjonsvalg, veiledning, oppfølging, simulering/refleksjon, personvern og innlogging/historikk.
  - Web search, modellsammenligning, kostnadslogging, administrasjon og SOURCEBANK er markert som bygde tillegg.
  - Full RAG, støtte til andre samtaleroller enn leder, HR-integrasjoner og lukket intern drift er markert som framtid/utenfor kjerne.
  - Teksten skiller mellom implementert funksjonalitet og graden av test/verifisering.

- [x] **Gjør Success Criteria testbare**
  - Product brief har nå sju etterprøvbare kriterier for kjerneflyt, oppfølging/simulering, historikk/RLS, personvern, golden-dekning, sensordemo og måling av utvidet KI-funksjonalitet.
  - Kriteriene er koblet til eksisterende testfiler og databaseoppsett.
  - Golden-kriteriet presiserer at testene viser samsvar med prosjektets fasit og sikkerhetsregler, ikke uavhengig faglig ekspertgodkjenning.

- [x] **Dokumenter den faktiske tidsrekkefølgen ærlig**
  - Refleksjonsrapporten og Implementation Plan forklarer nå at utviklingen startet lokalt før Git/GitHub var fullt etablert.
  - Den synlige Git-historikken viser prototypecommits før den synlige Product Brief/BMAD-formaliseringen, men brukes ikke som bevis på hele den pre-Git kronologien.
  - BMAD beskrives som et rammeverk som ble tatt i bruk mens prosjektet allerede var under utvikling, og som deretter strammet inn krav, scope, testing, arkitektur og sporbarhet.
  - AI-loggen er justert slik at den ikke fremstiller prosessen som lineær eller hevder at Git kan tidfeste hele den tidligste lokale fasen.
  - Refleksjonsutkastet er også korrigert fra `master` til at leveringsgrenen i skolerepoet er `main`.

## Prioritet 2 – faglig kvalitetssikring av KI

- [x] **Oppdater AI-TESTPLAN med begrensningene i faglig validering**
  - Testplanen skiller nå eksplisitt mellom teknisk/strukturell/fasitbasert testing og uavhengig faglig ekspertvalidering.
  - Det står tydelig at fasiten er utviklet i prosjektet og ikke er validert av HR-/arbeidsrettsekspert.
  - Begrensningen er formulert som en metodisk begrensning og koblet til produktets avgrensede rolle.
  - Det presiseres at golden-banken ikke er full faglig fasit for alle 56 undertemaer.

- [x] **Presiser rollen til Samtalestøtte**
  - AI-TESTPLAN og product brief beskriver løsningen som veiledende, støttende og treningsrettet.
  - Det står eksplisitt at løsningen ikke erstatter HR, juridisk bistand, helsepersonell eller annen relevant fagkompetanse.
  - Begrensningen brukes ikke som erstatning for faglig validering, men som en del av en ærlig risikovurdering.

- [x] **Utvid golden-testingen på de mest risikable områdene**
  - Golden-banken er utvidet fra 9 til 13 caser.
  - Mobbing/trakassering har nå tre golden-caser totalt, inkludert uønsket fysisk kontakt og samtale med den et varsel gjelder.
  - Avslutning av arbeidsforhold har nå tre golden-caser totalt, inkludert prøvetid og nedbemanning.
  - Schema-testen håndhever minst tre caser for hvert av disse to risikotemaene.
  - Live-kjøring av de fire nye casene gjenstår før de kan omtales som live-verifisert.

- [x] **Ikke overdriv hva testene beviser**
  - README og AI-TESTPLAN skiller nå tydelig mellom samsvar med prosjektets fasit/sikkerhetsregler og ekstern ekspertgodkjenning.
  - Den tidligere 9/9 live-kjøringen er beholdt som dokumentert historisk resultat, men de fire nye casene omtales ikke som live-verifisert før ny kjøring er gjort.

## Prioritet 3 – brief og produktposisjonering

- [x] **Skjerp Executive Summary**
  - Første avsnitt fungerer nå alene som kort produktbeskrivelse.
  - Teknisk kompleksitet er tatt ut av sammendraget og ligger i Project Complexity.
  - Produktets avgrensning mot generell chatbot/automatisert HR-system er tydeligere.

- [x] **Konkretiser The Problem**
  - Problemseksjonen har nå et konkret eksempel på en leder som skal håndtere en krevende samtale uten umiddelbar HR-støtte.

- [x] **Forbedre What Makes This Different**
  - Briefen sammenligner nå eksplisitt med generelle KI-chatboter, HR-maler/interne rutiner og kurs/ledertrening.
  - Teksten sier også hva alternativene kan gjøre bedre, slik at differensieringen ikke blir reklamepreget.

- [x] **Presiser primærbruker**
  - Primærbrukeren er konkretisert som leder med personalansvar, med særlig relevans for nye/mindre erfarne ledere eller situasjoner uten umiddelbar HR-støtte.
  - Sekundære brukere er tydelig markert som framtidige og utenfor kjerneflyten i v1.

## Prioritet 4 – teknisk gjeld og repo

- [ ] **Dokumenter kjent teknisk gjeld**
  - `app.js` og `server.js` er store filer.
  - Beskriv dette som kjent gjeld og et naturlig neste modulariseringssteg.
  - Ikke refaktorer store deler av fungerende kode kun for å pynte før innlevering med mindre det er nødvendig.

- [ ] **Flytt lærerens tilbakemeldingsfil fra rot etter at tiltakene er tatt**
  - Bevar den helst under f.eks. `docs/feedback/` i stedet for å slette den, slik at historikken beholdes.
  - Gjør dette først når denne arbeidslisten og nødvendige revisjoner er på plass.

## Må beholdes / styrker prosjektet

- [x] Repoet er nå riktig og Git-historikken er bevart.
- [x] Product brief, PRD, arkitektur, UX, epics/stories og implementeringsplan finnes.
- [x] Prosjektet vurderes som **vanskelig** og gjennomførbart.
- [x] Sensordemo uten nøkler fungerer.
- [x] Deterministisk testpakke finnes og faglærer fikk alle 13 delkontroller grønne.
- [x] Personverntesting finnes både klient- og serverside.
- [x] Golden-bank dekker alle 9 hovedtemaer.
- [x] Ingen hemmeligheter er sjekket inn.
- [x] Funksjonalitet og omfang vurderes som mer enn tilstrekkelig.
- [x] Design/UX og repo-ryddighet vurderes positivt.

## Hovedbudskap til refleksjonsrapporten

Prosjektet skal ikke framstilles som om en komplett BMAD-plan eksisterte før første kode. Den riktige historien er at en fungerende prototype kom først, prosjektet vokste raskt, og BMAD/context engineering ble tatt i bruk for å få kontroll på krav, scope, testing og sporbarhet. Dette er en læring og et eksempel på forbedret KI-styring.

Tilsvarende skal KI-testingen ikke framstilles som ekstern faglig godkjenning. Prosjektet har omfattende teknisk, strukturell og fasitbasert testing, men mangler uavhengig ekspertvalidering av HR-/arbeidsrettsnære råd. Samtalestøtte er derfor bevisst avgrenset til veiledning, forberedelse, trening og refleksjon, og skal ikke erstatte relevante fagpersoner eller menneskelig beslutningsansvar.
