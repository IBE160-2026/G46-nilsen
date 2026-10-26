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

- [ ] **Oppdater AI-TESTPLAN med begrensningene i faglig validering**
  - Golden-banken dekker 9/9 hovedtemaer, men ikke alle 56 undertemaer.
  - Fasiten er utviklet i prosjektet og er ikke uavhengig validert av HR-/arbeidsrettsfaglig ekspert.
  - Dette skal beskrives som en reell metodisk begrensning, ikke skjules.
  - Skill mellom teknisk/strukturell testing og faglig ekspertvalidering.

- [ ] **Presiser rollen til Samtalestøtte**
  - Samtalestøtte er et veiledende og støttende verktøy.
  - Løsningen kan ikke erstatte HR, juridisk bistand, helsepersonell eller annen relevant fagkompetanse i saker som krever dette.
  - KI-en skal ikke stille diagnoser, fastslå skyld/motiv, gi bindende juridiske råd eller fatte personalbeslutninger.
  - Manglende ekstern faglig validering må derfor sees sammen med produktets avgrensede rolle, men avgrensningen erstatter ikke behovet for å være åpen om testbegrensningen.

- [ ] **Utvid golden-testingen på de mest risikable områdene**
  - Legg til minst 1–2 ekstra caser for **mobbing/trakassering**.
  - Legg til minst 1–2 ekstra caser for **avslutning av arbeidsforhold**.
  - Vurder også alkohol/rus dersom tiden tillater det.
  - Test spesielt at svarene ikke blir bastante, juridisk bindende eller spekulerer i skyld/motiv.

- [ ] **Ikke overdriv hva testene beviser**
  - Formuler at testene dokumenterer konsistens mot prosjektets definerte fasit og sikkerhetsregler.
  - Ikke skriv at testene dokumenterer «faglig korrekthet» i betydningen ekspertgodkjenning.
  - Bruk heller formuleringer som «faglig rammesatt», «kildebasert», «testet mot prosjektets fasit» og «ikke eksternt ekspertvalidert».

## Prioritet 3 – brief og produktposisjonering

- [ ] **Skjerp Executive Summary**
  - La første avsnitt kunne stå alene som kort produktbeskrivelse.
  - Flytt utviklingsutfordringer/teknisk kompleksitet ut av innledningen dersom nødvendig.

- [ ] **Konkretiser The Problem**
  - Legg inn ett kort realistisk eksempel på situasjonen brukeren står i.

- [ ] **Forbedre What Makes This Different**
  - Sammenlign eksplisitt med generelle chatboter, HR-maler og kurs.
  - Vær også ærlig om hva disse alternativene kan gjøre bedre enn Samtalestøtte.

- [ ] **Presiser primærbruker**
  - Gjør situasjonen mer konkret uten å snevre produktet kunstig inn.
  - Hold sekundære brukere tydelig utenfor kjernen i v1.

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
