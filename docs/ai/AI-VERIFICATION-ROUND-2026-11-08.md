# Verifikasjonsrunde for KI, kilder og yrkeskontekst – 08.11.2026

## 1. Hvorfor denne runden ble gjennomført

Etter at Samtalestøtte fikk yrkes-/sektorkontekst, arbeidsgivertype, tariffkilder og en vesentlig større kildebank var det ikke lenger tilstrekkelig å teste at modellen:
- returnerte gyldig JSON
- valgte riktig hovedtema
- hadde minst én kilde ved krevende saker
- ikke brøt personvernreglene

Den viktigste nye risikoen var **plausibelt feil råd**: et svar kan se godt ut, men bruke feil profesjonsregelverk, feil tariffavtale, feil myndighetskilde eller trekke inn yrkeskontekst når yrket egentlig ikke har betydning.

Målet med denne runden var derfor å teste både:
1. at riktig kontekst og riktige kilder **kommer inn**
2. at irrelevante eller feil kilder **holdes ute**
3. at en eksplisitt avkreftet risiko ikke likevel aktiverer yrkesjuss
4. at tariff/arbeidsgivertype ikke gjettes
5. at testene selv fortsatt måler de faktiske kravene etter kode- og CSS-refaktoreringer
6. at produksjonsavhengigheter ikke har kjente høyalvorlige sårbarheter

Runden ble gjennomført som en streng intern sensorgjennomgang. Golden-fasiten er fortsatt prosjektets egen fasit og er **ikke uavhengig validert av HR-, arbeidsretts-, HMS- eller annen domeneekspert**.

---

## 2. Hva vi ønsket å finne

Testene ble designet for å finne seks forskjellige feilklasser.

### A. Kritisk produkt-/rådgivningsfeil
Eksempler:
- sikkerhetskritisk arbeid får fortsette
- modellen fastslår skyld, diagnose eller lovlighet uten grunnlag
- feil tariffavtale presenteres som gjeldende
- feil profesjonsregelverk brukes
- en forbudt kilde velges i en golden-case

### B. Kildepresisjonsfeil
Eksempler:
- modellen velger en bred oversiktsside når en konkret rettskilde finnes
- forskning brukes som juridisk hjemmel
- helsepersonelloven brukes i ordinær sykefraværsoppfølging bare fordi yrket er sykepleier
- politiregler lekker til brann/redning fordi begge ligger i samme sektor

### C. Overaktivering / kildeinflasjon
Eksempler:
- vanlig arbeidsdeling mellom tømrere utløser HMS-/byggeregler
- vanlig samarbeidsproblem i helse utløser helsepersonelloven
- privat lønnssamtale får en tilfeldig tariffavtale
- svaret viser mange kilder bare for å virke faglig sterkere

### D. Underaktivering
Eksempler:
- lærer + elevkrenkelse får ikke skolemiljøkontekst
- politietikk ved gaver/integritet blir behandlet som vanlig kontorproblem
- frisørhygiene eller hvitvaskingskrav blir oversett fordi ordene ikke står i en generell risikoliste

### E. Data-/referanseintegritetsfeil
Eksempler:
- samme yrke ligger i to sektorer
- en yrkeskilde peker på et yrke som ikke lenger finnes i den sektoren
- samme URL ligger flere ganger under ulike kilde-ID-er
- en tidskritisk tariffkilde mangler gyldighets-/verifiseringsdata

### F. Testgjeld / falske negative tester
Eksempler:
- testen leser bare gamle `styles.css` etter at CSS er modularisert
- testen forventer en gammel cacheversjon
- testen låser total golden-bank til 26 selv om banken bevisst er utvidet
- testen uttrykker gammel kildearkitektur, for eksempel at NAV skal ligge i yrkesruteren

Disse kategoriene ble skilt fra hverandre i vurderingen. Målet var ikke «grønn CI for enhver pris», men å avgjøre **om testen eller produktet tok feil** før noe ble endret.

---

## 3. Teststrategi

### Lag 1 – syntaks og testsyntaks

Produksjonskode og scripts kontrolleres med Node `--check`.

Under denne runden ble det oppdaget at testfilene selv ikke inngikk i syntakskontrollen. Dette ble rettet med:

`tests/test-test-suite-syntax.cjs`

Quality-gaten syntakssjekker nå alle JS/CJS/MJS-filer under `tests/` før resten av testpakken kjører.

**Hvorfor:** En ødelagt test skal feile tidlig og tydelig, ikke først langt inne i en lang testkjede.

---

### Lag 2 – personvern

Dagens deterministic-suite har **73 personvernscaser**.

Den kontrollerer blant annet:
- personnavn i ulike skrivemåter
- familieopplysninger
- graviditet
- alder
- kjønnet språk
- konkrete arbeidssteder
- unik rolle
- anonymisering
- at generelle yrkes-/arbeidsopplysninger ikke feilklassifiseres

**Hva vi ser etter:** både falske negative og falske positive personverntreff.

---

### Lag 3 – simulator, UI, PWA og regresjoner

Testpakken kontrollerer blant annet:
- simulatorens tre KI-endepunkter
- vern mot oppdiktet diagnose/familie
- historikk
- mobil/PWA
- offentlige assets
- tilgjengelighet på sentrale fritekstfelt
- UI-regresjoner
- kildebankvisning
- valgfritt yrkesfelt
- sammenfoldede råd
- pilot-/brukertestregresjoner

**Hvorfor:** En faglig korrekt KI er ikke nok dersom brukerflyt, personvernflate eller visning gjør funksjonen misvisende eller ubrukelig.

---

### Lag 4 – taksonomi

`tests/test-benchmark-taxonomy.cjs` kontrollerer:

- **114 benchmark-saker**
- **48 undertemaer**
- minst **2 benchmark-saker per undertema**

**Hvorfor:** Tema-/undertemaruting må ha bred dekning og ikke bare være testet på noen få demosaker.

---

### Lag 5 – kildebank og kildepolicy

Kildeøkosystemet består av:
- **58 generelle** kilder
- **86 arbeidsgiver-/yrkes-/sektorkilder**
- **7 tariff-/hovedavtale-/arbeidsgiverreferanser**

Deterministiske tester kontrollerer blant annet:
- ingen eksakte URL-duplikater
- kildehierarki
- authority_index vs konkret rettskilde
- IA/Akan klassifiseres ikke som lov
- DFØ er avgrenset til stat
- statlig HTA, KS og Spekter-kilder finnes
- tariffkilder er tidskritiske
- personopplysningsloven/GDPR finnes
- statsansatteloven og statsetikken krever `employerType=state`

**Hvorfor:** Kildens funksjon og anvendelsesområde er viktigere enn antallet kilder.

---

## 4. Golden-bank etter utvidelsen

Golden-banken er utvidet fra **26 til 66 caser**.

De 40 nye casene er delt i:

### 28 sektorcaser

Alle 14 ordinære sektorer har:
- én case der yrket **skal** være relevant
- én case der yrket **ikke skal** være relevant

Dette gir en symmetrisk test:
> God yrkesruting betyr ikke bare å aktivere profesjonskilder riktig. Den må også klare å la være.

Sektorene:
1. Utdanning og oppvekst
2. Helse og omsorg
3. Offentlig forvaltning og juss
4. Forsvar, politi og beredskap
5. Produksjon og industri
6. Bygg, anlegg og tekniske fag
7. Fiskeri, havbruk og sjø
8. Transport og logistikk
9. Handel, service, hotell og servering
10. Kontor, økonomi, finans og IT
11. Veterinær, dyrehelse og dyr
12. Offshore, energi og kraft
13. Landbruk, skogbruk og natur
14. Luftfart

### 8 arbeidsgiver-/tariffcaser

Disse tester:
- statlig HTA
- KS HTA
- Spekter/helseforetak
- privat arbeidsgiver uten kjent tariff
- ukjent arbeidsgivertype
- statlig oppsigelsessak
- kommunal oppsigelsessak
- statlig etikk

### 4 kildelekkasjecaser

Bevisste feller:
- sykepleier + ordinær sykefraværsoppfølging → NAV/arbeidsliv, **ikke** helsepersonelloven
- utvikler + overvåking → AML/personvern, **ikke** Finanstilsynet
- brann/redning + kompetanse/øvelse → brannkilde, **ikke** politi/Forsvar
- brann/redning + ordinær administrativ samarbeidskonflikt → ingen profesjonsregelverk

---

## 5. Strengere golden-fasit

Nye felt gjør kildevalget maskinelt etterprøvbart:

### `expected_source_ids`
Alle oppgitte source_ids forventes.

### `expected_source_ids_any`
Minst én av de oppgitte kildene forventes.

### `forbidden_source_ids`
Hvis modellen velger en av disse, registreres det som **kritisk kildelekkasje**.

### `source_not_required`
Casen er bevisst laget slik at kuratert kilde normalt ikke trengs. Hvis modellen likevel fyller svaret med kilder, flagges kildeinflasjon.

### `occupation_relevant`
Fasit for om yrke/sektor faktisk skal påvirke rådet.

### `needs_employer_type`
Fasit for om arbeidsgivertype må avklares før konkret tariffgrunnlag kan brukes.

Golden-schemaet tillater ikke lenger en positiv yrkescase uten eksplisitt kildefasit, eller en negativ yrkescase uten negativ oracle.

---

## 6. Ny deterministisk sektor-golden

Ny test:

`tests/test-golden-occupation-routing.cjs`

Den kjører de 28 sektorcasene direkte mot produksjonsruteren.

Kontroll:
- 14 relevante → `occupationRelevant=true`
- 14 irrelevante → `occupationRelevant=false`
- forventede profesjonskilder må finnes
- forbudte profesjonskilder må ikke finnes
- yrkesnøytrale saker skal ikke hente yrkeskilder

Siste verifiserte resultat:

**28/28 bestått · 14 relevante · 14 irrelevante**

Dette er et deterministic bevis på routinglaget, uavhengig av språkmodellens variasjon.

---

## 7. Funn som faktisk endret produktet

### 7.1 «Sekretær» lå i to sektorer

Quality-gaten fant at `sekretær` fantes både i:
- offentlig forvaltning/juss
- kontor/økonomi/finans/IT

Dette gjorde lokal klassifisering tvetydig.

Tiltak:
- generisk `sekretær` beholdes i kontor-/administrativ sektor
- offentlig kontekst kan uttrykkes gjennom mer presise alias som `statlig sekretær` og `kommunal sekretær`

### 7.2 Tre foreldreløse kildereferanser

Etter oppryddingen pekte tre offentlige kilder fortsatt på `sekretær` som om yrket lå i offentlig sektor:
- FORVALTNINGSLOVEN
- ARKIVVERKET_JOURNALING / Nasjonalarkivet
- OFFENTLEGLOVA

Alle tre ble synkronisert med det nye yrkeskartet.

### 7.3 Yrkesrelevans var for avhengig av hardkodede risikoord

Før den nye testen kunne ruteren forstå ord som:
- journal
- sikkerhet
- hviletid
- autorisasjon

men ikke like robust:
- skolemiljø
- integritet/gaver i politiet
- frisørhygiene
- hvitvasking/kundetiltak

Tiltak:
Yrkesrelevans kan nå også aktiveres når en konkret profesjons-/sektorkildes `useFor` faktisk matcher situasjonen.

### 7.4 Negasjoner måtte tas på alvor

Systemet skal ikke aktivere yrkesjuss når brukeren eksplisitt sier:
- «ingen pasientsikkerhetssak»
- «det gjelder ikke kjøre- eller hviletid»
- «ingen HMS-hendelse»
- «ikke spørsmål om autorisasjon»

Det ble derfor lagt inn negasjonsbevisst matching både i relevansvurderingen og kildekonteksten.

### 7.5 Barnehagekilde lekket til lærer

En skolecase fikk `UDIR_KINDERGARTEN_RULES` fordi brede authority_index-kilder tidligere kunne følge med automatisk innen sektoren.

Tiltak:
- `authority_index` krever nå faktisk situasjonstreff
- skole- og barnehageoversikter har eksplisitt yrkesomfang

### 7.6 Minstelønnskilden var for bred

En negativ taxisjåfør/lønn-case aktiverte allmenngjort minstelønn.

Kontroll mot Arbeidstilsynet viste at persontransportbestemmelsen gjelder turbil/turvogn/buss under bestemte vilkår, ikke taxi generelt.

Tiltak:
- taxisjåfør fjernet fra generell minstelønnsdekning
- generiske triggere som bare `lønn` fjernet
- konkrete bransje-/allmenngjøringsbegreper brukes i stedet

---

## 8. Testgjeld som ble avdekket

Flere CI-feil var **ikke produktfeil**, men tester som var blitt hengende igjen etter arkitekturendringer.

### CSS-modularisering

Disse testene leste bare den lille importfila `styles.css`:
- `test-simulation.js`
- `test-ui-regression.cjs`
- `test-bubble-cleanup.cjs`
- `test-pilot-ux.cjs`

De er oppdatert til å teste samlet:
- styles.css
- styles-core.css
- styles-responsive.css
- styles-overrides.css

### Foreldet cacheversjon

UI-testen krevde eksakt `20.11.13` på klientmoduler.

Det egentlige kravet er at personvern- og klientdata lastes **før app.js**.

Testen kontrollerer nå rekkefølge, ikke en historisk versjonsstreng.

### Golden-bank låst til 26

Pilot-regresjonstesten krevde nøyaktig 26 totalcaser.

Den kontrollerer nå at:
- de 5 pilotregresjonscasene finnes
- totalbanken kan vokse
- banken har minst 66 caser etter yrkesutvidelsen

### NAV i feil arkitekturlag

En gammel yrkestest forventet NAV inne i yrkesruteren.

Ny arkitektur:
- NAV sykefravær = generell arbeidsgiver-/arbeidslivskilde
- helsepersonellregelverk = kun når profesjonskonteksten faktisk er relevant

Testen er endret til å verifisere denne grensen.

### Testfil kunne selv ha syntaksfeil

En feil escaped streng i `test-source-policy.cjs` viste at testene ikke selv var syntakssjekket.

Tiltak:
`test-test-suite-syntax.cjs` kjører før resten av quality-gaten.

---

## 9. Automatisert Quality Gate

Fil:

`.github/workflows/quality-gate.yml`

Kjører automatisk ved push til `main`.

Steg:
1. checkout
2. Node 26
3. `npm ci`
4. full `npm test`
5. `npm audit --omit=dev --audit-level=high`
6. oppsummering av strict golden coverage

### Hvorfor CI er viktig

Tidligere kunne «alle tester OK» bety at tester var kjørt lokalt på et bestemt tidspunkt.

Med GitHub Actions kan sensor se:
- hvilken commit som ble testet
- hvilke steg som ble kjørt
- hvilke feil som oppstod
- hvilke senere commits som rettet dem

---

## 10. Sikkerhetsaudit av avhengigheter

Den første skjerpede quality-gaten fant:

### body-parser 2.3.0
**HIGH**
Denial-of-Service-sårbarhet i håndtering av komprimerte request bodies.

### qs 6.16.0
**MODERATE**
DoS-relatert feil i `qs.stringify` for spesielle array-elementer.

Tiltak:
- body-parser → **2.4.0**
- qs → **6.16.1**

Oppgraderingen ble gjort i lockfilen innenfor eksisterende Express 5.2.1 sine semver-krav.

Etter oppgraderingen besto:
- `npm ci`
- hele deterministic testpakken
- `npm audit --omit=dev --audit-level=high`

---

## 11. Verifiserte CI-resultater

### Før security-gate

Run:
**42530815713**

Commit:
`61b9908b777f1ec105a96af748560a692ada2d9a`

Resultat:
**SUCCESS**

Dette var første komplette grønne `npm test` etter opprydding av testgjeld.

### Med dependency audit

Run:
**42531088270**

Commit:
`3e3e54419a4a18b620ef4686cc88b653de9a07d6`

Resultat:
**SUCCESS**

Deterministiske tester + dependency audit besto.

### Siste quality-gate etter sektor-golden og kildepresisering

Run:
**42531396584**

Commit:
`021b7f5e45584e5f1e17ac9a25c108735b6b5891`

Resultat:
**SUCCESS**

Denne kjøringen inkluderer:
- full deterministic testpakke
- 66-case golden-schema
- 28-case deterministic sektor-golden
- 32 eksisterende yrkesbenchmark
- source policy
- tariff/avtaleruting
- personvern
- simulator/UI/PWA
- dependency audit
- repo-struktur

Dette er statusreferansen for verifikasjonsrunden 08.11.2026.

---

## 12. Hva deterministic green faktisk betyr

En grønn quality-gate dokumenterer at:
- kilde-/yrkesdata er internt konsistente
- kildepolicyregler er implementert
- 28 sektor-golden-ruter korrekt
- tariff-/arbeidsgiverlogikk oppfyller de deterministiske reglene
- personvernregresjonene består
- UI/PWA/simulator-kontrakter består
- golden-fasiten er strukturelt konsistent
- kjente HIGH npm-sårbarheter ikke er åpne etter audit

Det dokumenterer **ikke** at en språkmodell alltid vil formulere det beste mulige svaret.

---

## 13. Live KI-testing

Live-testene er et eget lag fordi modelloutput kan variere.

Kommandoer:
- `npm run test-ai:golden` – hele golden-banken
- `npm run test-ai:occupation-golden` – bare de 40 strenge yrke/sektor/tariff/kilde-casene
- `npm run test-ai:stress`
- `npm run test-ai:stress:full`

Den nye occupation-golden-runneren:
- aktiverer yrkeskontekst eksplisitt
- sender occupation, sectorId, employerType og subtopic til server
- kontrollerer expected source_ids
- kontrollerer forbidden source_ids
- flagger kildeinflasjon
- kontrollerer occupationRelevant
- kontrollerer needsEmployerType

### Status 08.11.2026

De 40 nye strenge yrkes-golden-casene er:
- strukturelt validert
- source-ID-validert
- 28 sektorcaser kjørt deterministisk mot ruteren

De er **ikke påstått bestått mot en ekstern live språkmodell i denne verifikasjonsrunden**, fordi live-runneren krever en KI-API-nøkkel i testmiljøet.

Dette skillet skal beholdes i all dokumentasjon:
> deterministic routing/schema green ≠ live model quality proven

Historiske live-resultater fra tidligere testkjøringer kan fortsatt omtales som historiske resultater med dato, men skal ikke brukes som bevis for at den nye 66-case-banken er live-godkjent.

---

## 14. Hva vi ser etter i live-vurderingen

En streng manuell/live vurdering skal særlig se etter:

### Kritiske feil – 0 toleranse i høyrisikocaser
- oppdiktet faktum
- oppdiktet lovkrav
- feil tariffområde
- feil profesjonsregelverk
- sikkerhetskritisk råd som ikke prioriterer umiddelbar risiko
- skyld/diagnose fastslås uten grunnlag
- forbudt source_id

### Kildekvalitet
- støtter kilden faktisk påstanden?
- er det den sterkeste relevante kilden?
- brukes authority_index bare som oppslagsinngang?
- brukes forskning som faglig evidens, ikke rettsgrunnlag?
- attribueres «NAV sier», «Akan anbefaler» osv. bare når kilden faktisk støtter formuleringen?

### Rådskvalitet
- menneskelig og muntlig åpning
- observerbar atferd fremfor merkelapper
- relevante åpne spørsmål
- realistiske neste steg
- riktig grad av forsiktighet
- ikke bare «kontakt HR» som standardsvar

### Stabilitet
Samme kritiske case bør kjøres flere ganger/parafraseres. Formuleringen kan variere, men:
- sikkerhetsprioritet
- hovedkilde
- tariffområde
- profesjonsavgrensning
bør være stabile.

---

## 15. Akseptansekriterier

For denne prosjektversjonen brukes følgende mål som streng intern kvalitetsstandard:

| Område | Mål |
|---|---:|
| Oppdiktede fakta/lovkrav | 0 |
| Feil tariffområde i kritiske caser | 0 |
| Forbudt profesjonskilde i kritiske caser | 0 |
| Sikkerhetskritiske deterministic/routing-caser | 100 % |
| 28 sektor-golden routing | 28/28 |
| Personvern deterministic | 73/73 |
| Undertema-benchmark | 114 saker / 48 undertemaer / minst 2 hver |
| URL-duplikater i kildebank | 0 |
| HIGH production dependency audit | 0 |
| Kilder per KI-svar | normalt 1–4 presise |
| Live golden | vurderes separat; ingen falsk påstand om bestått før faktisk kjøring |

---

## 16. Metodisk begrensning

Golden-casene er utarbeidet internt av prosjekteier/student med KI-støtte.

Det gir:
- god sporbarhet
- konsistent regressjonsvern
- eksplisitte negative forventninger
- mulighet til å teste samme krav etter endringer

Men det gir ikke uavhengig faglig validering.

En streng vurdering må derfor skille mellom:
- **intern testfasit**
- **autoritative eksterne kilder**
- **faktisk live modelloutput**
- **uavhengig ekspertevaluering**, som ikke er gjennomført

---

## 17. Læring fra runden

Den viktigste læringen er at kvalitet ikke øker lineært med antall tester eller antall kilder.

Runden viste fire forskjellige typer verdi:

1. **Tester fanget ekte produktfeil**
   - tvetydig yrke
   - foreldreløse kildereferanser
   - barnehagekilde i lærercase
   - for bred minstelønnskilde
   - underaktivering av profesjonskontekst

2. **Tester fanget testgjeld**
   - gamle CSS-forutsetninger
   - hardkodede cacheversjoner
   - gammel golden-størrelse
   - gammel NAV-arkitektur

3. **Tester måtte selv testes**
   - syntaksfeil i en test førte til egen testsyntaksgate

4. **Negative caser var minst like verdifulle som positive**
   - det er vanskeligere og viktigere å bevise at systemet lar være å bruke en plausibel, men feil kilde

Dette støtter en sentral designregel for Samtalestøtte:

> Yrke, regelverk og kilder skal brukes når de forbedrer rådet — ikke fordi systemet tilfeldigvis kjenner dem.


## 18. Reproduserbar live-KI-kjøring i GitHub Actions

Det er lagt til en separat manuell workflow:

`.github/workflows/live-ai-validation.yml`

Den startes med `workflow_dispatch` og kan kjøre:
- `occupation-golden`
- `golden`
- `stress`
- `stress-full`

Workflown krever at repository har minst én av følgende GitHub Actions-secrets:
- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`

Live-eval kjøres bevisst **ikke** automatisk på hver push. Begrunnelse:
- den koster API-bruk
- output er stokastisk
- tilfeldig modellvariasjon skal ikke blokkere vanlig CI uten menneskelig vurdering
- deterministic quality gate skal være rask og stabil

Rapportfiler under `tests/reports/` lastes opp som workflow-artifact når de finnes.

Per 08.11.2026 er denne workflown lagt til for reproduksjon, men den nye 40-case occupation-golden-pakken er fortsatt **ikke dokumentert som live-bestått** før en faktisk workflow-kjøring med provider-secret foreligger.


---

## 19. Siste verifikasjon av `main` etter dokumentasjons- og testutvidelser

Etter at den manuelle live-workflowen og dokumentasjonen var lagt inn, ble siste `main`-commit før denne rapportoppdateringen kontrollert i GitHub Actions.

Quality Gate-run:

**42531844146**

Commit:

`4268225f44ae58b8d39ce50e4a4fe6a317a74634`

Resultat:

**SUCCESS**

Kjøringen dokumenterte blant annet:

- 35 JS/CJS/MJS-filer syntakskontrollert
- **73/73 personverntester bestått**
- **24/24 simulator-kontroller bestått**
- **66 golden-caser** strukturelt validert
- **40 strenge yrke/sektor/tariff/kilde-caser** registrert i golden-banken
- **28/28 sektor-golden-rutinger bestått**, fordelt på 14 relevante og 14 irrelevante yrkescaser
- **114 benchmark-saker / 48 undertemaer**, minst to saker per undertema
- kildebank v8: **58 generelle kilder**
- yrkes-/arbeidsgiverkilder: **86**
- tariff-/avtalekilder: **7**
- **0 eksakte URL-duplikater**
- production dependency audit: **0 kjente sårbarheter** på valgt auditnivå

Denne kjøringen er den nyeste komplette deterministic quality-gaten som lå til grunn før produksjons-smoken nedenfor.

---

## 20. Produksjons-smoke mot faktisk Render-deploy

Det ble gjennomført en separat smoke-test fra en GitHub-hosted runner mot den offentlige produksjonsadressen:

`https://g46-nilsen-samtalestotte.onrender.com`

GitHub Actions-run:

**42532653228**

Resultat:

**SUCCESS**

Testen verifiserte at:

- forsiden svarte HTTP 200 og inneholdt Samtalestøtte-markør
- `/api/public-config` svarte HTTP 200 med **appVersion 20.11.5**
- `/styles.css` svarte HTTP 200
- `/app.js` svarte HTTP 200
- `/src/client-data.js` svarte HTTP 200
- `/manifest.webmanifest` svarte HTTP 200
- `/sw.js` svarte HTTP 200

Dette gir et separat bevis på at den deployede produksjonsflaten faktisk serverer forventet versjon og sentrale frontend-/PWA-assets. Smoke-testen beviser ikke i seg selv autentisert funksjonalitet eller kvaliteten på et generert KI-svar.

---

## 21. Forsøk på live occupation-golden i GitHub Actions

For å forsøke å lukke det siste gapet ble den strenge 40-case occupation-golden-suiten startet fra en midlertidig QA-gren.

GitHub Actions-run:

**42532573390**

Resultat:

**IKKE KJØRT MOT MODELL**

Workflown stoppet i den eksplisitte sikkerhetssjekken før noen live-KI-case ble kjørt fordi repository ikke hadde noen av disse GitHub Actions-secretene konfigurert:

- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`

Stegene for checkout, Node-oppsett og dependency-installasjon besto. Selve `test-ai:occupation-golden` ble deretter korrekt hoppet over.

Dette er derfor **ikke et KI-avvik** og skal heller ikke registreres som en mislykket golden-case. Resultatet dokumenterer kun en manglende CI-konfigurasjon for ekstern provider.

Konklusjonen står fast:

> 40-case occupation-golden er deterministic/schema/routing-validert, men kan ikke omtales som live modell-bestått før en faktisk kjøring med provider-secret foreligger.

Den midlertidige QA-workflowen ble deaktivert fra automatisk push etter kontrollen, slik at den ikke kan generere gjentatte feilkall.

---

## 22. Status etter denne runden

Per 08.11.2026 kan følgende hevdes med dokumentert dekning:

- deterministic quality gate på `main`: **grønn**
- personvern: **73/73**
- sektor-golden routing: **28/28**
- benchmark/taksonomi: **114 saker / 48 undertemaer**
- source policy og source integrity: **grønn**
- simulator/UI/PWA/regresjon: **grønn**
- production dependency audit: **0 kjente sårbarheter på valgt auditnivå**
- faktisk produksjonsflate, versjon og sentrale assets: **verifisert**
- live 40-case occupation-golden mot ekstern språkmodell: **ikke kjørt i GitHub Actions på grunn av manglende provider-secret**

Det siste punktet er den eneste tydelige testgaten i denne runden som fortsatt står åpen. Den skal ikke skjules eller omformuleres som bestått.


---

## 23. Supabase security/performance advisor – kontroll 09.11.2026

Som del av sluttkontrollen ble Supabase sine egne advisor-kontroller kjørt mot produksjonsprosjektet.

### Sikkerhetsfunn som ble rettet

Advisor flagget:

`public.rls_auto_enable()`

Funksjonen er en `SECURITY DEFINER` event-trigger-funksjon som automatisk aktiverer RLS på nye tabeller i `public`. Fordi funksjonen ikke hadde eksplisitte EXECUTE-rettigheter, arvet den PostgreSQL-standard der PUBLIC kan ha EXECUTE.

Dette var unødvendig og ble rettet ved å trekke direkte EXECUTE fra:
- PUBLIC
- anon
- authenticated

Funksjonen beholdes som database-event-trigger, men kan ikke lenger kalles direkte av vanlige API-roller.

Repo-migrasjon:
`database/migrations/V20-7-SUPABASE-MIGRATION.sql`

Etter endringen forsvant begge advisor-advarslene om offentlig/innlogget kjøring av SECURITY DEFINER-funksjonen.

### RLS-performance og foreign-key-indekser

Performance advisor flagget fire policies på `public.conversations` fordi `auth.uid()` ble evaluert per rad.

Policyene ble erstattet med:
`(select auth.uid()) = user_id`

og eksplisitt begrenset til `authenticated`.

I tillegg ble støtteindekser lagt på seks foreign-key-kolonner advisoren flagget:
- ai_response_feedback.user_id
- ai_usage_log.user_id
- app_settings.updated_by
- benchmark_results.created_by
- content_overrides.updated_by
- invites.user_id

Repo-migrasjon:
`database/migrations/V20-8-SUPABASE-MIGRATION.sql`

Etter endringen var:
- `auth_rls_initplan`: ingen funn
- `unindexed_foreign_keys`: ingen funn

Advisor viser naturlig nok de nye indeksene som `unused_index` umiddelbart etter opprettelse. Dette er INFO, ikke en feil, og indeksene skal ikke fjernes før produksjonsbruk over tid gir grunnlag for en slik vurdering.

### Gjenstående Supabase-advarsel

`Leaked Password Protection Disabled`

Dette er en Supabase Auth-prosjektinnstilling som aktiverer kontroll mot kjente kompromitterte passord. Den tilgjengelige prosjektkoblingen i denne verifikasjonsrunden har ingen skriveoperasjon for denne Auth-innstillingen.

Den står derfor som et eksplisitt manuelt hardening-punkt i Dashboard, ikke som en kodefeil i Samtalestøtte.

### RLS uten policy

Advisor viser INFO for flere server-only tabeller som har RLS aktivert og ingen klientpolicyer. Dette er i tråd med arkitekturen der disse tabellene håndteres gjennom serverens privilegerte backend og ikke skal være direkte tilgjengelige for anon/authenticated via Data API. Det ble derfor ikke lagt åpne policies bare for å fjerne INFO-varselet.


---

## 24. Sluttopprydding og siste produksjonskontroll – 09.11.2026

Den midlertidige Render-hooken som kunne starte occupation-golden ved oppstart ble fjernet fra produksjonskoden etter verifikasjonsarbeidet.

Fjernet:
- oppstartsblokken for `RENDER_LIVE_QA_ON_START` i `server.js`
- `scripts/render-live-qa.js`

Begrunnelse:
- midlertidig QA-infrastruktur skal ikke bli liggende i produksjonsruntime
- en eventuell gammel Render-miljøvariabel kan dermed ikke starte en ny 40-case KI-kjøring ved senere restart
- den permanente, dokumenterte veien for live-eval er `.github/workflows/live-ai-validation.yml`

### Quality Gate etter opprydding

GitHub Actions-run:

**42539766034**

Commit:

`b433a8e626ba9534a9005931ba63c0ff066745f1`

Resultat:

**SUCCESS**

Dette bekrefter at hele deterministic quality-gaten fortsatt er grønn etter at den midlertidige runtime-hooken ble fjernet.

### Siste offentlige produksjons-smoke

En kortlivet QA-workflow ble kjørt mot faktisk Render-produksjon etter oppryddingen.

GitHub Actions-run:

**42539814526**

Resultat:

**SUCCESS**

Kontrollen verifiserte:
- produksjonsforsiden svarer
- `/api/public-config` svarer
- appVersion er fortsatt **20.11.5**
- sentrale frontend-/PWA-assets kan hentes

Den midlertidige QA-grenen ble deretter reset til `main`, slik at smoke-workflowen ikke ligger igjen som ekstra prosjektkode.

### Gjenstående eksplisitte begrensninger

To forhold skal fortsatt beskrives nøkternt:

1. **40-case occupation-golden er ikke dokumentert som live-bestått mot ekstern språkmodell.**
   Forsøk på å kjøre den via GitHub stoppet fordi repository mangler provider-secret. Et senere forsøk på å bruke kortlivet produksjonstestidentitet ble blokkert av plattformens sikkerhetskontroll før hemmelighetene kunne sendes. Ingen testpassord eller provider-nøkkel ble eksponert for å omgå dette.

2. **Supabase Leaked Password Protection er deaktivert.**
   Dette er en prosjektinnstilling i Supabase Auth og må aktiveres i Supabase Dashboard. Den tilgjengelige prosjektkoblingen i denne verifikasjonen har ingen skriveoperasjon for innstillingen.

Alt øvrig som kunne verifiseres eller rettes gjennom kode, GitHub Actions og Supabase-advisors i denne runden er gjennomført og dokumentert.
