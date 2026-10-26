# AI-logg – Samtalestøtte

## 1. Formål

Denne loggen dokumenterer hvordan generativ KI, hovedsakelig ChatGPT/OpenAI, er brukt i utviklingen av **Samtalestøtte**.

Formålet er å synliggjøre utviklingsprosessen, ikke bare sluttproduktet. Loggen viser derfor:

- hvilke behov og problemer jeg tok opp med KI
- hvilke forslag KI kom med
- hvilke forslag jeg valgte å bruke
- hvilke forslag jeg avviste eller endret
- feil og svakheter jeg oppdaget gjennom testing
- hvordan krav og løsninger ble justert underveis
- hvordan KI ble brukt til programmering, testing, dokumentasjon og kvalitetssikring

Loggen er rekonstruert fra tilgjengelig ChatGPT-historikk, prosjektfiler, versjonslogg og Git-historikk. Den er **ikke en ordrett utskrift av alle prompts eller samtaler**.

Der jeg ikke kan dokumentere nøyaktig ordlyd fra en tidligere KI-dialog, beskriver jeg derfor hensikten og resultatet i stedet for å konstruere en prompt i ettertid.

---

# 2. Hvordan KI ble brukt

ChatGPT har hatt flere roller gjennom prosjektet:

1. **Idé- og sparringspartner**
   - drøfting av problem og målgruppe
   - valg av funksjoner
   - brukerflyt og UX
   - vurdering av avgrensninger

2. **Programmeringsassistent**
   - HTML, CSS og JavaScript
   - Node.js/Express
   - OpenAI-integrasjon
   - Supabase
   - OpenRouter
   - autentisering og roller

3. **Test- og feilsøkingspartner**
   - testcaser
   - regresjonstester
   - personverntester
   - KI-testing
   - feilsøking av API, Supabase og autentisering

4. **Dokumentasjonsstøtte**
   - Product Brief
   - PRD
   - arkitektur
   - UX
   - epics/stories
   - implementeringsplan
   - README
   - testplaner

5. **Kvalitetssikringsverktøy**
   - kontroll av personvern
   - vurdering av KI-svar
   - identifisering av risiko
   - gjennomgang av repo og testoppsett
   - sammenligning av KI-modeller

KI har ikke hatt myndighet til å bestemme hva produktet skulle være. Jeg har selv bestemt mål, funksjoner, designretning, faglige begrensninger og hva som skulle godkjennes eller forkastes.

---

# 3. Arbeidsmåte

Utviklingen har ikke vært lineær.

Den typiske arbeidsformen har vært:

**behov → prompt/dialog → forslag → implementering → testing → feil eller svakhet → nytt krav → korrigering → ny test**

Etter hvert ble dette også en eksplisitt regel i samarbeidet med KI: større endringer skulle ikke bygges videre før jeg hadde vurdert resultatet og gitt klarsignal.

Det har vært viktig fordi KI flere ganger:

- endret mer kode enn jeg ba om
- misforsto designkrav
- foreslo løsninger som fungerte teknisk, men ikke passet produktet
- laget for generiske KI-svar
- laget tester som ga falske positive eller falske negative
- foreslo personvernregler som var for aggressive
- laget UI-endringer som brøt tidligere godkjent design

Disse situasjonene førte til nye og mer presise krav.

---

# 4. Tidlig produktutvikling – v1–v5

## v1 – Første fungerende prototype

### Behov

Jeg ønsket å få fram en fungerende prototype for ledere som skal forberede krevende medarbeidersamtaler. Den tidlige utviklingen var utforskende, og BMAD/Product Brief var ennå ikke fullt etablert som styringsrammeverk i den synlige Git-historikken.

Løsningen skulle blant annet ha:

- hovedtemaer
- undertemaer
- enkel navigasjon
- sidemeny
- grunnleggende personverninformasjon

### KI-bidrag

ChatGPT hjalp med første struktur i HTML, CSS og JavaScript.

Det første utkastet hadde åtte hovedtemaer og en mer skjemabasert brukerflyt.

### Min vurdering

Jeg vurderte prototypen visuelt og funksjonelt og identifiserte tidlig problemer med:

- for mange felt
- for mye skjema
- layout
- visuell hierarki
- hvor intuitiv løsningen var

### Merknad om Git-historikken

Utviklingen av Samtalestøtte startet før prosjektet var koblet til Git/GitHub. De tidlige versjonene ble derfor utviklet og lagret lokalt før de senere ble lagt inn i Git-repositoriet. Dette forklarer hvorfor mange av de tidlige versjonscommitene har datoer konsentrert rundt 23.–27. september 2026, selv om selve utviklingsarbeidet og KI-dialogene hadde startet tidligere.

Etter at Git/GitHub kom på plass, ble Git brukt fortløpende til versjonskontroll, testing, feilretting, dokumentasjon og videreutvikling. Commit-datoene for de tidligste versjonene viser derfor tidspunktet de ble lagt inn i Git, ikke nødvendigvis tidspunktet hele utviklingsarbeidet bak hver versjon ble utført.

Git-historikken er ikke omskrevet i ettertid for å gi inntrykk av en annen tidslinje.

### Endring

I stedet for å låse løsningen til første KI-utkast fortsatte utviklingen iterativt.

---

## v2 – Færre inputfelt

### Problem

Første løsning krevde for mye informasjon fra brukeren før KI kunne hjelpe.

### Dialog med KI

Jeg utfordret behovet for alle feltene og ønsket en enklere arbeidsflyt.

KI foreslo å samle hovedinformasjonen i ett større situasjonsfelt, samtidig som tema og undertema ga kontekst.

### Beslutning

Dette ble valgt.

KI skulle heller stille avklaringsspørsmål ved behov enn at brukeren måtte fylle ut et omfattende skjema på forhånd.

### Læring

Dette var et tidlig eksempel på at prosjektet beveget seg bort fra et klassisk HR-skjema og mot en samtalepartner.

---

## v3 – Temasider og visuell identitet

Jeg ønsket at hovedtemaene skulle føles som egne områder i løsningen.

ChatGPT hjalp med struktur og integrasjon av temabilder.

Flere av KI-forslagene ble senere justert eller byttet fordi de ikke traff ønsket stil.

Dette viste tidlig at generert design måtte vurderes manuelt.

---

## v4–v5 – Regler for trygg KI

### Problem

I personalsaker kan det være problematisk dersom KI presenterer antakelser som fakta.

### Krav fra meg

KI skulle blant annet ikke:

- dikte opp diagnoser
- fastslå motiv
- fastslå skyld
- tillegge medarbeideren personlighetstrekk uten grunnlag
- fremstille usikre juridiske vurderinger som sikre fakta

### Resultat

ChatGPT bidro til eksplisitte sikkerhetsregler og skillet mellom:

- fakta brukeren faktisk har oppgitt
- antakelser
- områder som krever mer informasjon

Dette utviklet seg senere til systemprompt og responskontrakt.

---

# 5. Fra generisk KI til systematisk KI-styring – v6–v10

## v6 – Første systematiske KI-testing

Jeg ønsket ikke bare å kontrollere om API-et svarte, men om svarene faktisk var gode.

ChatGPT hjalp med å lage representative testscenarier.

Testene viste at teknisk fungerende KI ikke nødvendigvis betyr faglig god KI.

Dette førte til sterkere fokus på:

- relevans
- sikkerhet
- nyansering
- hallusinasjoner
- praktisk anvendbarhet

---

## v7 – To-trinns forståelse

### Problem

KI kunne svare for generisk eller stille spørsmål som ikke var nødvendige.

### Forslag

ChatGPT foreslo å skille mellom:

1. forståelse av situasjonen
2. behov for avklaringer og støtte

### Resultat

Dette reduserte unødvendige spørsmål og ga bedre grunnlag for temasortering og veiledning.

---

## v8 – Samtalepartner fremfor skjema

Jeg ønsket et mindre mekanisk verktøy.

KI ble derfor i større grad brukt som samtalepartner, der brukeren kunne uttrykke situasjonen naturlig.

Dette var et viktig produktvalg og påvirket senere både grensesnitt og KI-arkitektur.

---

## v9–v10 – Hurtigsvar og kontekst

ChatGPT hjalp med:

- klikkbare svaralternativer
- videre KI-dialog
- lagring av kontekst gjennom samtalen

Testing viste samtidig problemer med:

- ujevn størrelse på svaralternativer
- feil visuell prioritet
- gammel tekst som kunne følge med til ny samtale
- elementer som ble liggende igjen i inputfelt

Disse problemene ble senere rettet gjennom flere regresjoner.

---

# 6. Reell KI-integrasjon og personvern – v11–v16

## v11 – OpenAI på serversiden

ChatGPT hjalp med overgangen fra prototype til faktiske KI-kall.

API-nøkkelen ble lagt på serveren og ikke i frontend.

Dette var et bevisst sikkerhetsvalg.

---

## v12–v14 – Personvern før KI-kall

### Behov

Jeg ønsket å redusere risikoen for at brukeren sendte identifiserende informasjon til KI.

### Første løsning

ChatGPT hjalp med regler for blant annet:

- navn
- alder
- kontaktopplysninger
- identifikatorer

### Problem

De første reglene var for aggressive og stoppet også relevant kontekst.

### Korrigering

Jeg krevde et tydeligere skille mellom identitet og nødvendig situasjonsinformasjon.

Dette utviklet seg til prinsippet:

> **Anonymiser identitet, ikke nødvendig kontekst.**

Senere personverntester viste også behov for å skille mellom eksempelvis:

- konkret arbeidssted
- generell bransje
- unik stilling
- vanlig rollebeskrivelse
- konkrete familieopplysninger
- generell familiesituasjon

Dette ble gradvis forbedret gjennom testing.

---

## v15–v16 – Diagnostikk og full samtalestøtte

ChatGPT hjalp med bedre diagnostikk rundt KI-kall slik at jeg kunne skille mellom:

- feil i appen
- API-feil
- modellfeil
- konfigurasjonsfeil
- svak kvalitet på selve KI-svaret

KI-veiledningen ble deretter utvidet fra en innledende analyse til blant annet:

- mulig åpning
- spørsmål
- reaksjoner
- håndtering
- oppfølging
- HR-/juridiske varsler

Jeg oppdaget senere at enkelte HR- og juridiske råd kunne bli for standardiserte. Dette ble derfor videre bearbeidet.

---

# 7. Faglig forankring og KI-testing – v17-serien

## Fag- og kildebank

Jeg ønsket at KI-svarene skulle bygge på mer enn generell språkmodellkunnskap.

ChatGPT hjalp med struktur for:

- SOURCEBANK
- faggrunnlag
- temaspesifikke kilder

Jeg stilte senere strengere krav til:

- troverdige kilder
- relevans
- oppdatering
- at KI ikke skulle late som en kilde sa mer enn den faktisk gjorde

---

## Automatiserte KI-tester

Det ble utviklet:

- korte KI-tester
- fulltester
- stresstester
- tester av tidligere problemcaser

### Viktig feil funnet

Noen automatiske tester tolket et ord eller uttrykk isolert og markerte et svar som problematisk selv når KI faktisk **avviste** den problematiske påstanden.

Dette var et eksempel på at selve testen kunne være feil.

Testlogikken måtte derfor bli mer kontekstbevisst.

### Læring

Automatisert KI-testing kan støtte vurderingen, men kan ikke erstatte manuell kvalitetsvurdering.

---

# 8. Supabase og autentisering – v18

## Behov

Jeg ønsket:

- ekte brukerkontoer
- lukket registrering
- sikker historikk
- tilgangskontroll

### KI-bidrag

ChatGPT hjalp med:

- Supabase Auth
- database
- RLS
- invitasjoner
- lagring av historikk

### Konkret problem

KI-generert databaseoppsett fungerte ikke fullt ut i faktisk drift.

Samtalelagringen krevde blant annet en konkret `GRANT`-retting.

Dette ble oppdaget gjennom praktisk testing.

### Betydning

Dette var et tydelig eksempel på at KI-generert konfigurasjon ikke kunne aksepteres uten verifikasjon i faktisk miljø.

---

# 9. Samtalesimulator – v19

## v19.0–v19.1 – Første simulator

Jeg ønsket å gå fra bare samtaleforberedelse til faktisk øving.

KI skulle spille medarbeider.

ChatGPT hjalp med:

- simulatorstruktur
- treningsmoduser
- reaksjonsstiler
- hjelp underveis
- refleksjon etter øvelse
- automatiserte tester

### Feil oppdaget

Noen KI-genererte medarbeidersvar inneholdt detaljer eller reaksjoner som ikke var godt nok forankret i situasjonen.

Automatiske tester godkjente også enkelte svar jeg manuelt vurderte som unaturlige.

### Korrigering

Simulatorreglene ble skjerpet for å hindre:

- oppdiktede diagnoser
- oppdiktet familieinformasjon
- overdreven psykologisering
- kunstig eller for polert språk

---

## v19.2–v19.12 – UX og visuell kontroll

Dette var perioden med flest iterative designjusteringer.

ChatGPT hjalp med blant annet:

- samtalebobler
- profilbilder
- avatarer
- temaer
- sidemeny
- knapper
- responsivitet
- simulatorflyt

### Problem

KI gjorde flere ganger større visuelle endringer enn jeg hadde bedt om.

Eksempler:

- eksisterende logoer ble foreslått erstattet
- godkjent boblegeometri ble endret
- knapper med samme funksjon fikk ulik utforming
- overskrifter fikk ulik størrelse
- ikoner havnet feil

### Ny arbeidsregel

Jeg begynte derfor å kreve at:

- eksisterende godkjente elementer ikke skulle endres uten avtale
- KI ikke skulle bygge nye versjoner før jeg sa «go/kjør»
- godkjent geometri og layout skulle behandles som låst

Dette er et konkret eksempel på at KI-bruken ble mer styrt etter erfaring med tidligere feil.

---

# 10. Admin, roller og kontroll – v20.0–v20.4

## Roller

Jeg ønsket:

- bruker
- redaktør
- admin

ChatGPT hjalp med rollemodell og server-side tilgangskontroll.

Jeg ønsket spesielt at kritiske rettigheter ikke bare skulle skjules i grensesnittet, men håndheves på serveren.

---

## Personvern i alle KI-felt

Jeg stilte krav om at personvernbarrieren skulle gjelde på tvers av KI-funksjoner og ikke bare hovedsamtalen.

Dette førte til server-side kontroll i tillegg til klientkontroll.

---

## Modellstyring og kostnad

Jeg ønsket å kunne sammenligne modeller på:

- kvalitet
- responstid
- kostnad

ChatGPT hjalp med modellvalg og logging.

Jeg stilte samtidig krav om at teknisk logging ikke skulle bli brukerprofilering eller automatisk lagring av sensitive samtaler.

---

# 11. BMAD og arkitektur – v20.3–v20.7

ChatGPT ble brukt til å strukturere prosjektet gjennom:

- Product Brief
- PRD
- UX-design
- arkitektur
- epics og stories
- implementeringsplan

Jeg var samtidig opptatt av at dokumentasjonen ikke skulle fremstille prosjektet som mer lineært enn det faktisk hadde vært.

Prosjektet ble utviklet eksperimentelt og iterativt, og BMAD-dokumentene ble brukt til å samle og tydeliggjøre retningen etter hvert som produktet ble mer komplekst.

---

## Endringer i Product Brief

Jeg ba blant annet om at:

- kompleksiteten skulle beskrives realistisk
- briefen skulle være kort nok
- summary skulle fungere som elevator pitch
- videre arbeid skulle ha et realistisk tidsperspektiv

Dette førte til flere iterasjoner i stedet for én KI-generert sluttekst.

---

# 12. Nye temaer og videre kvalitetssikring – v20.5–v20.7

Prosjektet ble utvidet til ni hovedtemaer.

Jeg var spesielt opptatt av språk og faglig balanse innen:

- mobbing
- seksuell trakassering
- vold og trusler
- tilrettelegging
- arbeidsevne

Jeg korrigerte blant annet KI når språk kunne implisere at trakassering faktisk hadde skjedd før situasjonen var avklart.

Dette følger samme prinsipp som ellers i prosjektet:

**KI skal ikke trekke sikre konklusjoner som ikke er støttet av brukerens informasjon.**

---

# 13. Sluttføring og regresjonsarbeid – v20.8–v20.10.3

Denne fasen handlet i stor grad om kvalitetssikring og opprydding fremfor nye hovedfunksjoner.

## Repo-struktur

Ved gjennomgang av repoet ble det tydelig at mange historiske filer og testversjoner gjorde strukturen vanskeligere å forstå.

Sammen med ChatGPT gikk jeg systematisk gjennom:

- dokumentasjon
- bilder
- testfiler
- migreringer
- arkivfiler
- runtime-data
- README
- package scripts

### Endringer

Blant annet ble:

- dokumentasjon flyttet til `docs/`
- BMAD-dokumenter samlet under `docs/bmad/`
- KI-dokumentasjon samlet under `docs/ai/`
- faggrunnlag samlet under `docs/faggrunnlag/`
- bilder samlet under `assets/images/`
- temabilder samlet under `assets/images/topics/`
- Supabase-filer samlet under `database/`
- tester samlet under `tests/`
- testdata samlet under `tests/cases/`
- runtime-data samlet under `data/`
- gamle historiske tester og arkivkopier fjernet fra aktivt repo

Alle berørte stier ble kontrollert og oppdatert.

Dette var ikke bare kosmetisk opprydding. Flytting av filer avdekket flere steder der kode og tester hadde implisitte avhengigheter til gammel mappestruktur.

---

## Testserver og autentisering

Etter flytting og opprydding feilet en KI-test gjentatte ganger med:

`401 GET /api/status`

### Analyse

Serveren krevde autentisering også når den automatiserte testen startet sin egen server.

Det ville vært feil å fjerne autentiseringskravet fra selve appen.

### Løsning

I stedet ble det laget en eksplisitt test-bypass som bare aktiveres når:

- `NODE_ENV=test`
- `TEST_AUTH_BYPASS=1`

Dette gjorde det mulig å automatisere tester uten å svekke autentisering i ordinær drift.

Samme problem ble senere oppdaget i modell-sammenligningstesten og korrigert på samme måte.

### Læring

Dette var et konkret eksempel på forskjellen mellom:

- å «få testen til å virke»
- å rette testen uten å svekke produksjonssikkerheten

---

## Personverntester

Ved sluttkontroll ble personvernreglene testet mot 29 automatiserte caser.

Resultat:

**29/29 kontroller OK**

Testene omfattet blant annet:

- navn
- familieopplysninger
- alder
- graviditetsdetaljer
- konkret arbeidssted
- unik rolle
- kjønnede formuleringer
- anonymisering

Eksempel:

En tekst som beskrev konkrete døtre på bestemte alderstrinn ble generalisert til at medarbeideren har flere barn i småskolealder.

Dette viser at personvernarbeidet ikke bare handler om blokkering, men om å bevare nødvendig kontekst når det er mulig.

---

## Simulatortester

Simulatoren ble ved sluttkontroll testet med 24 automatiserte kontroller.

Resultat:

**24/24 kontroller OK**

Testene kontrollerte blant annet:

- simulatorvisning
- navigasjon
- direkte simulering
- personvernkontroll
- midlertidig øvelse
- API-endepunkter
- forbud mot oppdiktet diagnose
- forbud mot oppdiktet familie
- feedback
- historikk
- samtalebobler

---

## Foreldet regresjonstest oppdaget

En eldre test for samtaleboblene feilet.

Første mistanke var at den aktive CSS-implementasjonen var ødelagt.

Ved gjennomgang viste det seg i stedet at testen krevde at en gammel kommentar med versjonsnummer skulle finnes i CSS:

`v19.12.3 – ENESTE aktive snakkebobleimplementasjon`

Den faktiske `.speech-bubble-shape`-implementasjonen eksisterte fortsatt og var i orden.

### Beslutning

Jeg valgte ikke å endre appen for å tilfredsstille en foreldet test.

I stedet ble den meningsløse kontrollen av kommentartekst fjernet fra testen.

Regresjonstesten besto deretter.

### Læring

Dette er et eksempel på kritisk bruk av automatiserte tester:

**En test som feiler betyr ikke automatisk at produktkoden er feil. Selve testen må også vurderes.**

---

# 14. Modelltesting

Prosjektet inneholder også støtte for sammenligning av ulike KI-modeller.

Modelltestingen vurderer blant annet:

- situasjonsforståelse
- konkrete råd
- nyansering og risiko
- samtaleformuleringer
- faglig relevans
- responstid
- kostnad

Blind sammenligning brukes for å redusere risikoen for at kjennskap til modellnavnet påvirker vurderingen.

Modelltester gjør faktiske API-kall og tar derfor betydelig lengre tid enn lokale regresjonstester.

---

# 15. Eksempler på kritisk KI-styring

Følgende eksempler oppsummerer situasjoner der KI-forslag **ikke** bare ble akseptert:

## Eksempel 1 – For mange inputfelt

**KI/første løsning:** Flere strukturerte felter.

**Min vurdering:** For tungvint.

**Endring:** Ett hovedfelt og oppfølgingsspørsmål ved behov.

---

## Eksempel 2 – Personvernregler for strenge

**Første løsning:** Fjernet eller blokkerte for mye kontekst.

**Min vurdering:** Nyttig informasjon gikk tapt.

**Endring:** Prinsippet «Anonymiser identitet, ikke nødvendig kontekst».

---

## Eksempel 3 – Supabase fungerte ikke i drift

**KI-generert oppsett:** Databaseregler og lagring.

**Problem:** Lagring feilet.

**Analyse:** Manglende database-rettighet.

**Endring:** Konkret `GRANT`-retting.

---

## Eksempel 4 – Simulator fant på informasjon

**KI-svar:** Kunne legge til detaljer som ikke var oppgitt.

**Min vurdering:** For lite realistisk og potensielt misvisende.

**Endring:** Strengere simulatorregler og flere tester.

---

## Eksempel 5 – Automatisk KI-test ga feil vurdering

**Test:** Markerte enkelte svar som problematiske ut fra nøkkelord.

**Min vurdering:** Modellen hadde egentlig avvist den problematiske påstanden.

**Endring:** Testlogikken ble mer kontekstbevisst.

---

## Eksempel 6 – KI endret godkjent design

**KI-endring:** Endret logo, boblegeometri eller andre komponenter samtidig med en annen oppgave.

**Min vurdering:** Endringen gikk utenfor bestillingen.

**Endring:** Godkjente komponenter ble låst og nye versjoner skulle ikke bygges uten eksplisitt «go».

---

## Eksempel 7 – Test feilet, men appen var riktig

**Feil:** `test-bubble-cleanup` feilet.

**Analyse:** Testen lette etter en gammel CSS-kommentar.

**Beslutning:** Ikke endre fungerende appkode for å gjøre en foreldet test grønn.

**Endring:** Testen ble gjort relevant for faktisk implementasjon.

---

## Eksempel 8 – KI-test stoppet på autentisering

**Feil:** Testserver fikk 401 på `/api/status`.

**Mulig enkel løsning:** Fjerne auth på endepunktet.

**Min vurdering:** Ville svekket sikkerheten.

**Endring:** Test-only autentiseringsbypass bundet til testmiljø.

---

# 16. Kvalitetssikring av KI-generert kode

KI-generert kode er ikke vurdert som korrekt bare fordi den kjører.

Jeg har brukt flere former for kontroll:

- manuell testing i nettleser
- visuell kontroll
- automatiserte regresjonstester
- personverntester
- simulatortester
- KI-testsett
- stresstester
- modell-sammenligning
- gjennomgang av serverlogger
- Supabase-testing
- Render-testing
- Git-diff og kontroll av endrede filer

Ved større endringer har jeg flere ganger stoppet videre utvikling når resultatet ikke samsvarte med bestillingen.

---

# 17. Dokumentasjon og sporbarhet

Denne loggen må ses sammen med resten av repoet.

## Produkt og plan

- `product-brief.md`
- `docs/bmad/PRD.md`
- `docs/bmad/ARCHITECTURE-BMAD.md`
- `docs/bmad/UX-DESIGN-BMAD.md`
- `docs/bmad/EPICS-AND-STORIES-BMAD.md`
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md`

## KI

- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`
- `docs/ai/AI-TESTPLAN.md`
- `docs/ai/SAMTALEPARTNER-MODELL.md`

## Sikkerhet og faggrunnlag

- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md`
- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/faggrunnlag/`

## Tester

- `tests/`

## Utviklingshistorikk

- `CHANGELOG.md`
- Git commit-historikken

Versjonsnumrene i denne loggen viser utviklingsfasene. Etter at Git/GitHub var etablert, er Git-historikken den viktigste kilden til når konkrete endringer ble committet. For den tidligste lokale fasen viser commitdatoene når versjonene ble lagt inn i Git, ikke nødvendigvis når hele arbeidet bak dem først ble utført.

---

# 18. Begrensninger ved AI-loggen

Denne loggen er laget for å dokumentere en faktisk utviklingsprosess, ikke for å rekonstruere en kunstig perfekt prosess i ettertid.

Derfor er det viktig å presisere:

- ikke alle KI-prompts er lagret ordrett
- mange utviklingsøkter besto av lange dialoger og gjentatte små korrigeringer
- noen designvalg ble endret flere ganger
- enkelte tester og løsninger ble senere forkastet
- noen BMAD-dokumenter ble oppdatert etter hvert som prosjektet utviklet seg
- prosjektet har vært mer iterativt enn lineært

Jeg mener dette gir et mer korrekt bilde av KI-assistert utvikling enn å fremstille det som om én prompt førte direkte til én ferdig løsning.

---

# 19. Hva jeg har lært om KI-assistert utvikling

Arbeidet med Samtalestøtte har vist at det å bruke KI til programmering ikke først og fremst handler om å få KI til å produsere mest mulig kode.

Det viktigste har vært å kunne:

- formulere problemet presist
- kontrollere hva KI faktisk endrer
- oppdage når et forslag er teknisk riktig, men produktmessig feil
- teste løsningen
- stille strengere krav etter feil
- forstå konsekvensene av sikkerhets- og personvernvalg
- skille feil i produktet fra feil i testene
- unngå at KI fortsetter å endre allerede godkjente deler
- dokumentere hvorfor en løsning ble valgt

Et mønster gjennom hele prosjektet har vært at de beste resultatene kom når jeg ikke bare ba KI om en løsning, men vurderte resultatet kritisk og brukte feilene til å forbedre neste krav.

---

# 20. Oppsummering

ChatGPT har vært brukt omfattende gjennom hele Samtalestøtte-prosjektet, men ikke som en autonom utvikler.

KI har hjulpet med:

- idéutvikling
- UX
- kode
- API-integrasjon
- Supabase
- personvern
- sikkerhet
- tester
- feilsøking
- faggrunnlag
- modelltesting
- BMAD
- dokumentasjon

Samtidig har en betydelig del av utviklingsarbeidet bestått i å kontrollere, korrigere eller avvise KI-forslag.

Prosessen kan oppsummeres slik:

**planlegg → spesifiser → bygg med KI → test → vurder kritisk → identifiser svakhet → presiser krav → korriger → test igjen → dokumenter**

Det er denne iterative kontrollen av KI, mer enn selve kodegenereringen, som har vært den viktigste delen av utviklingsprosessen.

---

## 2026-10-13 – Utvidet lokal regresjonstest og personvernverifisering

Personverntestene ble utvidet med regresjonscaser for tvetydige navn og vanlige ord, blant annet skillet mellom:

- `Dette skjer hver dag.` → skal ikke tolkes som navn
- `Hver dag har vi møte.` → skal ikke tolkes som navn
- `Dag har kommet for sent.` → skal tolkes som navnet Dag
- `Jeg snakket med Dag i går.` → skal tolkes som navnet Dag

Første kjøring avdekket en feil i regexen som skulle kontrollere stor forbokstav i tvetydige navn. Feilen ble rettet i både klient- og serverlogikken, mens regresjonstestene ble beholdt.

Etter retting ble hele den lokale deterministiske testpakken kjørt med `npm test`.

Verifisert resultat:

- personvern: **33/33**
- samtalesimulering: **24/24**
- server-personvern: **bestått**
- UI-regresjon: **bestått**
- historikk-regresjon: **bestått**
- snakkeboble-regresjon: **bestått**
- clipboard-regresjon: **bestått**

Dette dokumenterer en komplett kjede fra testfunn til årsaksanalyse, korrigering og ny regresjonsverifisering.


---

## 2026-10-13 – Fasitbasert KI-testing og kravsporbarhet

Testoppsettet ble gjennomgått med mål om å gjøre forventede resultater tydeligere og mer etterprøvbare.

Gjennomgangen viste at:

- eksisterende KI-tester allerede kontrollerte tema, avklaringsbehov, struktur og enkelte sikkerhetskrav
- stresstestene hadde sterkere eksplisitte forventninger enn den ordinære KI-testen
- den ordinære KI-testbanken dekket åtte hovedtemaer, mens produktet nå har ni
- benchmarkbanken hadde 112 faste saker og dekket alle ni temaer

Tiltak:

1. Den ordinære KI-testbanken ble utvidet med tre caser for **Mobbing og trakassering**.
2. En egen golden/fasit-bank ble opprettet med minst én representativ case per hovedtema.
3. Hver golden case ble koblet til konkrete FR-/AI-krav.
4. Fasiten skiller mellom:
   - maskinelle kontrollpunkter
   - hva et godt svar **må** inneholde
   - hva det **bør** inneholde
   - hva som regnes som **kritisk feil**
5. En lokal `test-golden-schema` ble lagt til for å kontrollere fasitbanken og 9/9 temadekning uten API-kostnad.
6. En `test-ai:golden` ble lagt til for ekte KI-kjøring mot samme fasit.

Bevisst valg:

Det ble ikke laget en ordrett «riktig tekst»-fasit. Språkmodeller kan formulere faglig gode svar på flere måter. For rigide nøkkelordstester kan derfor teste selve formuleringen i stedet for kravet. Kritiske feil, sikkerhet, tema og andre konkrete kriterier kontrolleres automatisk, mens faglig kvalitet vurderes mot en eksplisitt menneskelig fasit.

Dette styrker sporbarheten fra **krav → testcase → forventet resultat → KI-svar → vurdering**.


---

## 2026-10-14 – Lokal verifisering av fasitbanken

Etter at golden/fasitbanken og kravsporbarheten var lagt inn, ble hele den deterministiske testpakken kjørt på nytt.

Resultat:

- personvern: **33/33**
- samtalesimulering: **24/24**
- server-personvern: **bestått**
- UI-regresjon: **bestått**
- historikk-regresjon: **bestått**
- snakkeboble-regresjon: **bestått**
- clipboard-regresjon: **bestått**
- golden/fasit-schema: **9 caser og 9/9 hovedtemaer dekket**

Dette bekrefter at fasitbanken er teknisk gyldig og komplett på hovedtemanivå før den brukes mot ekte KI-svar.


---

## 2026-10-14 – Golden KI-test: 9/9 OK

Etter at golden/fasitbanken var verifisert lokalt, ble de ni representative casene kjørt mot den konfigurerte modellen **GPT-5.6 Luna**.

Resultat:

- 9 av 9 caser: **OK**
- 0: **BØR SJEKKES**
- 0: **KRITISK AVVIK**
- 0: **TEKNISK FEIL**

Alle ni hovedtemaer var representert.

Resultatet dokumenterer at modellen i denne kjøringen oppfylte de maskinelle fasitkravene for tema, struktur, sikkerhets-/kvalitetskontroller og eksplisitte forbud mot enkelte uforsvarlige konklusjoner.

Det ble bevisst ikke konkludert med at dette alene beviser full faglig kvalitet. Golden-testen kombineres med menneskelig fasit, ordinær KI-test, stresstest, benchmark og brukertesting for å redusere risikoen for at én testmetode blir behandlet som fasit for hele produktet.


---

## 2026-10-14 – Manuell golden-gjennomgang avdekket rapporteringshull

Første golden-kjøring ga automatisk **9/9 OK**. Deretter ble rapporten kontrollert manuelt mot den eksplisitte menneskelige fasiten.

To læringspunkter kom frem:

1. Rapporten viste ikke hele KI-svaret. Den viste hovedsakelig situasjonsforståelse, åpning og kilder, mens fasiten også krevde vurdering av spørsmål, reaksjoner, HR/juridisk merknad og neste steg. Rapportgeneratoren ble derfor utvidet slik at en menneskelig kontroll faktisk kan etterprøve hele fasiten.
2. I fraværscasen la KI-åpningen til at fraværet hadde «gjort det vanskeligere å planlegge og følge opp arbeidet». Denne konsekvensen var ikke oppgitt i casen. Det ble vurdert som et manuelt **BØR SJEKKES**-punkt, ikke et kritisk avvik. Funnet viser hvorfor maskinell 9/9 ikke skal behandles som full faglig fasit.

Automatisk resultat og menneskelig vurdering holdes derfor eksplisitt adskilt.


---

## 2026-10-14 – Full manuell golden-vurdering

Den første fullt etterprøvbare golden-rapporten ble gjennomgått manuelt etter at rapportgeneratoren var utvidet med spørsmål, reaksjoner, forbehold, HR/juridisk merknad og neste steg.

Maskinelt resultat:

- 7 OK
- 1 BØR SJEKKES
- 1 KRITISK AVVIK

Manuell kontroll viste:

- **G-PREST-01:** Godt svar. Maskinflagget skyldtes at fasiten krevde avklaring før råd, selv om casen kunne besvares forsvarlig med forbehold. Testkravet ble gjort valgfritt.
- **G-SAMARB-01:** Godt svar. Det kritiske flagget var en falsk positiv fordi triggeren `skyld` også traff formuleringer som eksplisitt advarte mot å fastslå skyld. Triggeren ble gjort mer presis.
- **G-RUS-01:** Faglig og sikkerhetsmessig godt svar, men manuell kildekontroll fant svak kildepresisjon: en perifer Politiet-lenke ble brukt rundt 112, og en formulering om Akan stod med en Arbeidstilsynet-kilde. Dette ble vurdert som **BØR SJEKKES**, ikke kritisk innholdsavvik.

Samlet menneskelig vurdering av de ni svarene:

- **8 OK**
- **1 BØR SJEKKES**
- **0 kritiske innholdsavvik**

Læringen var at både produkt og tester må kvalitetssikres. En grønn test kan overse kildeproblemer, mens en rød test kan skyldes en dårlig testregel. Dette er nå dokumentert som del av prosjektets KI-styring og kvalitetssikring.


---

## 2026-10-14 – Temadekning var grønn, men én case testet feil tema

Etter kilde- og fasitkalibreringen ga golden-testen **9/9 OK**. Manuell kontroll fant likevel en testdesign-svakhet:

`G-LIV-01` var merket som **Livssituasjoner**, men selve situasjonen beskrev bare en sliten medarbeider med flere feil og ukjent årsak. Modellen klassifiserte derfor saken som **Sikkerhet og ansvar / Prestasjon og utvikling**.

Testen hadde tidligere lov til å bestå på `Prestasjon og utvikling`, og kunne derfor gi et misvisende inntrykk av at alle ni hovedtemaer var verifisert.

Casen ble endret slik at medarbeideren eksplisitt har opplyst om en krevende livssituasjon uten å dele private detaljer, og forventet tema ble strammet til kun **Livssituasjoner**.

Dette dokumenterer at også grønn testdekning må kontrolleres semantisk: en test kan være teknisk bestått og likevel ikke bevise det den hevder å teste.


---

## 2026-10-14 – Kritisk flagg skyldtes delstrengsmatch

Etter at Livssituasjoner-casen var gjort tematisk entydig, ga neste golden-kjøring 8 OK og 1 kritisk avvik i `G-FRAV-01`.

Testen rapporterte at modellen hadde adoptert påstanden «lat». Manuell kontroll viste at svaret aldri kalte medarbeideren lat. Årsaken var at testmotoren brukte delstrengsmatching: `sentence.includes("lat")`. Dermed kunne bokstavsekvensen `lat` også treffes inne i ord som `relatert` og `arbeidsrelatert`.

Matcherlogikken ble flyttet til en egen testbar hjelpefunksjon og endret til helords-/frasekontroll med Unicode-normalisering.

Det ble samtidig lagt til en lokal regresjonstest som eksplisitt kontrollerer at:

- `Medarbeideren er lat.` skal fanges
- `arbeidsrelatert` og `relatert` skal ikke fanges som `lat`
- eksplisitte avvisninger som `Ikke kall medarbeideren lat` ikke skal gi kritisk avvik
- flerdelte kritiske fraser fortsatt kan fanges

Læringen er at testkoden selv må behandles som produksjonskritisk kvalitetssikringskode: et rødt automatisk flagg skal etterprøves før produktlogikken endres.


---

## 2026-10-14 – Endelig golden-verifisering: 9/9 etter testkalibrering

Etter flere runder med både automatisk og manuell vurdering ble golden-testen kjørt på nytt etter at følgende svakheter var rettet:

- falske positive i kritiske triggere
- for rigid krav om avklaringssteg i én prestasjonscase
- mangelfull rapportering for menneskelig kontroll
- svak kildepresisjon i én høyrisikocase
- en Livssituasjoner-case som tidligere kunne bestå uten å bli klassifisert som Livssituasjoner
- delstrengsmatching der `lat` kunne treffes inne i `arbeidsrelatert`

Siste kjøring mot **GPT-5.6 Luna** ga:

- 9/9 **OK**
- 0 **BØR SJEKKES**
- 0 **KRITISK AVVIK**
- 0 **TEKNISK FEIL**

`G-LIV-01` besto som **Livssituasjoner**.

Denne sluttkjøringen er viktig fordi 9/9-resultatet ikke bare er et resultat av å gjøre testen mindre streng. Testopplegget ble samtidig gjort mer presist:

- falske positive ble fjernet
- temadekning ble strengere
- kildepresisjon ble lagt inn som eksplisitt vurderingspunkt
- kritiske triggere ble gjort mer robuste
- menneskelig fasit ble beholdt ved siden av automatikken

Prosessen viser forskjellen mellom å optimalisere for grønn test og å forbedre testens validitet.


---

## 2026-10-14 – Kontrollert modularisering og asset-feil

I en streng sluttgjennomgang ble store hovedfiler identifisert som prosjektets tydeligste kodekvalitetssvakhet.

I stedet for en risikabel totalrefaktorering ble tre rene ansvar flyttet ut:

- statiske klientdata → `src/client-data.js`
- serverens temakontrakt → `src/server/topic-contracts.js`
- KI-responsskjemaer → `src/server/ai-schemas.js`

Dette reduserte størrelsen på `app.js` og `server.js` uten å flytte autentisering, databaseflyt eller levende UI-state.

Under samme gjennomgang ble det oppdaget at produksjonsserverens eksplisitte asset-allowlist inneholdt nested bilder, mens ruten som serverte filer bare håndterte ett path-segment. Dette ble rettet uten å åpne en generell statisk mappe. En ny integrasjonstest kontrollerer at tillatte frontend-assets kan hentes, samtidig som `.env`, dokumentasjon og interne servermoduler forblir utilgjengelige.

Læring: kodekvalitet bør forbedres med målrettede endringer og testbevis, ikke ved å refaktorere mest mulig rett før levering.


---

## 2026-10-15 – Full regresjon grønn etter modularisering

Etter den kontrollerte modulariseringen og rettingen av serverens nested asset-rute ble hele `npm test`-pakken kjørt på nytt.

Alle tester besto, inkludert de nye kontrollene for:

- klientmodulens innlastingsrekkefølge
- offentlige frontend-assets
- blokkering av interne filer
- lokal sensordemo
- repo-struktur
- package-lock-konsistens

Dette var et eksplisitt stoppunkt: videre refaktorering ble ikke prioritert fordi de største lavrisiko-forbedringene var gjennomført og regresjonspakken var grønn. Videre oppdeling av særlig CSS og gjenværende hovedfiler vurderes som framtidig produksjonsmodning, ikke nødvendig leveransearbeid.


---

## 2026-10-15 – Korrigering av linjetall som kvalitetsmål

I sluttvurderingen ble `styles.css` først omtalt som teknisk gjeld fordi filen hadde rundt 6450 fysiske linjer.

Dette ble korrigert etter ny gjennomgang. Det høye linjetallet skyldes i stor grad formattering som tidligere ble gjort for å gjøre CSS-en lettere å finne frem i og lese. Samme CSS kunne teknisk komprimeres til svært få linjer uten at arkitekturen ble bedre.

Læring: fysisk linjetall er et svakt kvalitetsmål alene. Vedlikeholdbarhet bør heller vurderes ut fra ansvar, kobling, duplisering, testbarhet og hvor lett en endring kan gjøres uten sideeffekter.

Derfor ble den kontrollerte modulariseringen beholdt for `app.js` og `server.js`, mens CSS-en ikke ble minifisert bare for å få et lavere linjetall.


---

## 2026-10-23 – Render-sikkerhetsvarsel og Node-runtime

Render sendte et sikkerhetsvarsel om eMudhra-sertifikatkompromittering og flere nye Node.js-sårbarheter. Samtalestøtte er relevant fordi løsningen kjører Node.js og gjør utgående HTTPS-kall til eksterne tjenester.

Første vurdering var å låse runtime eksakt til Node 26.12.1. Dette ble revurdert fordi en eksakt pinning også ville hindre automatisk bruk av senere sikkerhetspatcher innen samme hovedversjon.

Endelig løsning:

`package.json -> engines.node = ">=26.12.1 <27"`

Dette valget:

- avviser eldre, ikke-patchede Node 26-versjoner
- tillater nyere Node 26-sikkerhetsoppdateringer
- hindrer automatisk hopp til Node 27 uten ny vurdering

Render-dokumentasjonen anbefaler en øvre grense for slike versjonsintervaller, og eksisterende Render-tjenester kan ellers beholde eldre standardversjoner.

`package-lock.json` ble synkronisert med samme runtime-krav. Sikkerhetsdokumentasjonen og README ble oppdatert tilsvarende.

Neste operasjonelle steg er redeploy på Render slik at tjenesten faktisk bygges med oppdatert Node-runtime og sertifikatlager.

### Refleksjon

Dette var et eksempel på at sikkerhetsoppdatering ikke bare betyr «bruk siste versjon». Kravet måtte balansere tre hensyn:

1. være ny nok til å inneholde sikkerhetsfiksen
2. tillate senere patcher i samme hovedversjon
3. unngå ukontrollert major-oppgradering som kan gi kompatibilitetsfeil

Valget ble derfor et avgrenset semver-intervall i stedet for en eksakt versjon eller en ubundet `>=26`.


## 2026-10-26 – Node-kravet ble skilt mellom produksjon og sensor

Faglærer verifiserte hele den deterministiske testpakken på Node 23.11 og påpekte at `engines.node = ">=26.12.1 <27"` kunne gjøre lokal oppstart unødvendig streng for sensor.

Den tidligere løsningen blandet sammen to forskjellige behov:

- produksjonen på Render skal bruke en sikkerhetspatchet runtime
- sensor skal kunne kjøre demo og deterministiske tester uten å måtte installere nøyaktig samme produksjonsruntime

Tiltaket ble derfor endret til:

- `package.json -> engines.node = ">=22 <27"` som kompatibilitetsområde
- Render beholder `NODE_VERSION=26.12.1` som produksjonskrav
- README dokumenterer eksplisitt forskjellen mellom lokal kompatibilitet og produksjonssikkerhet

Dette er også et eksempel på at et sikkerhetstiltak kan bli for strengt når samme regel brukes i en annen kontekst enn den opprinnelig var ment for.


## 2026-10-26 – Brukertest som egen valideringslinje

Etter at den tekniske og golden-baserte testingen var blitt omfattende, ble det tydelig at prosjektet fortsatt manglet nok faktisk brukerinnsikt. Det ble derfor satt opp en liten pilotbrukertest med samme korte skjema for alle testpersoner.

Valget om ett felles skjema var bevisst:
- svarene blir mer sammenlignbare
- testpersoner med ulik bakgrunn kan fortsatt gi mer spesifikke vurderinger i fritekst
- utvalget kan inneholde både UX-blikk, helhetsvurdering og relevant leder-/samtaleerfaring uten å late som dette er separate vitenskapelige studier

Personvern ble kontrollert mot faktisk databaseimplementasjon. `survey_responses` lagrer ikke bruker-ID, mens `survey_participation` bare markerer at en konto har sendt inn. Dokumentasjonen ble oppdatert slik at løsningen ikke omtaler svarene som «helt anonyme», men som lagret uten navn eller direkte kobling til konto.

Det ble også eksplisitt dokumentert at et lite, målrettet utvalg ikke er representativt og at positive svar fra personer med relevant bakgrunn ikke automatisk er ekspertvalidering. Målet med piloten er å finne forbedringspunkter, ikke å produsere gode skårer.
