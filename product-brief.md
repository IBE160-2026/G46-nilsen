# Product Brief: Samtalestøtte

**Leveransestatus:** Produksjonsgrunnlag 20.11.5 · videre dokumentert arbeidsrunde og patcher gjennom 08.11.2026  

## Executive Summary

Samtalestøtte er et KI-basert arbeidsverktøy for ledere med personalansvar som skal forberede, gjennomføre og reflektere over krevende medarbeidersamtaler. Løsningen samler strukturert veiledning, oppfølgingsdialog, samtalesimulering og refleksjon i én arbeidsflyt, med personvern og menneskelig beslutningsansvar som tydelige rammer.

Prototypen dekker ni hovedtemaer: fravær, prestasjon, samarbeid, lønn, alkohol og rus, sikkerhet, livssituasjoner, mobbing og trakassering og avslutning av arbeidsforhold. KI-en kan foreslå mål, spørsmål og formuleringer, forberede lederen på mulige reaksjoner og opptre som medarbeider i en treningssamtale.

Produktet er responsivt og kan installeres som en PWA/webapp på støttede nettlesere, slik at mobilbruk ikke er avhengig av et tradisjonelt nettleservindu. Produktet skal ikke være en generell chatbot eller et automatisert HR-system. Målet er et praktisk lederverktøy som styrker forberedelse, trening og refleksjon uten å overta lederens ansvar eller erstatte relevant fagkompetanse.

## The Problem

Ledere forventes å håndtere krevende medarbeidersamtaler profesjonelt, men får ikke alltid praktisk trening i hvordan slike samtaler faktisk gjennomføres.

Utfordringen handler blant annet om hvordan samtalen åpnes, hvilke spørsmål som bør stilles, hvordan man holder seg til observerbare forhold, og hvordan man håndterer reaksjoner som sinne, taushet eller avvisning.

I praksis forbereder mange ledere seg alene, søker informasjon på nettet, bruker generelle KI-verktøy eller kontakter HR. Disse alternativene dekker deler av behovet, men gir ikke nødvendigvis en samlet arbeidsflyt for forberedelse, øvelse og refleksjon. Generelle KI-verktøy gir også personvernutfordringer dersom brukeren legger inn identifiserende opplysninger fra reelle personalsaker.

Et typisk behov kan være en ny eller lite erfaren leder som neste dag skal ta opp gjentatt korttidsfravær, prestasjonsproblemer eller en vanskelig samarbeidskonflikt og ikke har HR tilgjengelig der og da. Lederen trenger ikke nødvendigvis en ferdig beslutning, men hjelp til å forberede en ryddig åpning, relevante spørsmål og hva det er viktig å unngå å konkludere med for tidlig.

Samtalestøtte skal derfor kombinere praktisk lederstøtte med tydelige rammer for personvern, sikkerhet, kildebruk og menneskelig ansvar.

## The Solution

Brukeren velger et hovedtema og undertema eller beskriver situasjonen med egne ord. Systemet skal deretter kunne gi støtte til:

- mål og struktur for samtalen
- relevante spørsmål og formuleringer
- mulige reaksjoner fra medarbeideren
- oppfølgingsdialog med KI
- refleksjon og neste steg
- dynamisk samtalesimulering
- utskrift av situasjon, hovedråd og videre råd for praktisk bruk før samtalen

Innloggede brukere skal kunne ha egen historikk og gå tilbake til tidligere arbeid.

Personvern skal være integrert i løsningen. Tekst som sendes til ekstern KI skal kontrolleres både i brukergrensesnittet og på serveren. Systemet skal redusere unødvendige identifiserende opplysninger uten å fjerne nødvendig kontekst.

KI-en skal ikke diagnostisere medarbeidere, fastslå motiv eller skyld, gi bindende juridiske råd eller ta personalmessige beslutninger på vegne av lederen.

## What Makes This Different

Samtalestøtte er ikke bare en generell chatbot pakket inn i et nytt grensesnitt. Løsningen er bygget rundt den konkrete arbeidsprosessen en leder står i når en krevende medarbeidersamtale skal forberedes, gjennomføres og reflekteres over.

I en generell KI-chat må brukeren selv formulere gode prompter, gi nødvendig kontekst, sette faglige grenser og vurdere hva som bør anonymiseres. Samtalestøtte flytter mye av dette ansvaret inn i selve produktet. Lederen velger eller beskriver situasjonen og føres gjennom en domenespesifikk arbeidsflyt med forberedelse, mål, spørsmål, mulige reaksjoner, oppfølging, samtalesimulering og refleksjon. Ni hovedtemaer og 48 undertemaer gir systemet strukturert kontekst uten at brukeren trenger å kunne prompt engineering.

Personvern og faglige begrensninger er også bygget inn i arbeidsflyten. Identifiserende opplysninger kontrolleres både i klient og server før tekst sendes til ekstern KI, og modellen instrueres eksplisitt om blant annet å unngå diagnoser, antakelser om motiv og skyld, oppdiktede fakta og bastante juridiske konklusjoner.

En annen viktig forskjell er hvordan kunnskapsgrunnlaget styres. Samtalestøtte har en kuratert SOURCEBANK som førstevalg, med blant annet norske myndighetskilder, regelverk og forskningsbasert kunnskap innen arbeidsliv, organisasjonspsykologi og samtalemetodikk. Kildetype tilpasses spørsmålet: juridiske påstander bør forankres i gjeldende lov eller myndighetskilder, mens råd om samtaleteknikk bør bygge på relevant forskning og fagkunnskap. Nettsøk brukes som supplement når fagbanken ikke dekker behovet godt nok, og søket skal prioritere troverdige og relevante kilder framfor å behandle alle treff som likeverdige.

Dette gir løsningen et mer avgrenset og kontrollert kunnskapsgrunnlag enn en generell chatbot alene. Målet er ikke å gjøre KI-en til en faglig fasit, men å redusere risikoen for at overbevisende råd bygger på tilfeldige, svake eller irrelevante kilder.

HR-maler og interne rutiner kan være mer autoritative for virksomhetens egne regler og prosesser, men er i hovedsak statiske. Kurs og ledertrening kan gi større faglig dybde og menneskelig veiledning, men er ikke nødvendigvis tilgjengelig i det øyeblikket lederen står foran en konkret samtale. Generelle KI-verktøy er på sin side mer fleksible enn Samtalestøtte og kan brukes til langt flere oppgaver.

En viktig nyanse er forskjellen mellom **kurs/trening** og **løpende støtte i behovsøyeblikket**. Norske tilbud som DFØs «Den vanskelige samtalen» og Verdi CoachLab viser at digital samtaletrening og KI-basert øvelse allerede finnes. Verdi-appen viser også at løpende KI-samtale med utgangspunkt i brukerens egen situasjon ikke i seg selv er unikt. Samtalestøtte skal derfor ikke bygge produktpåstanden på at andre mangler KI eller dialog.

Samtalestøttes særpreg ligger derfor i kombinasjonen: **situasjonsspesifikk KI-støtte, en fast lederrettet arbeidsflyt, dynamisk samtaletrening, innebygget personvern, faglige sikkerhetsgrenser og systematisk kvalitetstesting i én løsning.** I tillegg er løsningen ment å kunne brukes når en konkret arbeidssituasjon faktisk oppstår, ikke bare som et læringsløp på forhånd. Målet er ikke å erstatte fagpersoner eller lederens skjønn, men å gjøre det enklere å gå fra «jeg må ta en vanskelig samtale» til konkret forberedelse og øvelse på en mer strukturert og ansvarlig måte.

## Project Complexity

Prosjektets tekniske kompleksitet oppstår fordi flere avhengige lag må fungere samtidig: brukergrensesnitt, serverlogikk, språkmodell, personvern, autentisering, datalagring, historikk, kildebruk, simulator og administrasjon.

KI-laget skal støtte flere modeller uten at resten av applikasjonen må bygges om. Samtidig skal løsningen kunne registrere responstid, tokenbruk, estimert kostnad og kildebruk slik at modeller kan sammenlignes systematisk.

Personvernkontrollen må finnes både i klient og server. Utfordringen er å redusere identifiserende informasjon uten å fjerne så mye kontekst at KI-støtten blir dårligere.

Simulatoren skal holde en konsistent medarbeiderrolle gjennom flere meldinger og reagere dynamisk på brukerens formuleringer. Samtidig må den styres slik at den ikke diagnostiserer, tillegger personer skjulte motiver eller fremstiller spekulasjoner som fakta.

Prosjektet skal også ha systematisk KI-testing på flere nivåer. Benchmarkbanken dekker de 48 gjeldende undertemaene med faste testsituasjoner, mens golden/fasit-banken nå har 66 caser. Av disse er 40 laget spesielt for yrke, sektor, arbeidsgivertype, tariff og kildepresisjon, med både positive og negative forventninger.

Reduksjonen fra 56 til 48 undertemaer var et bevisst produktvalg etter klarspråkgjennomgang, pilotbruk og tilbakemeldinger. Flere tidligere undertemaer var for vage, overlappende eller så smale at de gjorde valget vanskeligere uten å tilføre nyttig KI-kontekst. De ble derfor slått sammen, omformulert eller fjernet. Målet var ikke færre kategorier i seg selv, men en tydeligere taksonomi som bruker ord ledere faktisk vil kjenne igjen. Et representativt utvalg skal kunne kjøres mot flere modeller for å sammenligne blant annet kvalitet, stabilitet, responstid, kostnad og kildebruk.

Web search skal være kontrollert og sporbar. Systemet skal kunne registrere hvilke eksterne kilder som faktisk brukes, uten at selve personalsamtalen automatisk lagres i denne loggen.

Kompleksiteten ligger derfor først og fremst i samspillet mellom KI-kvalitet, personvern, datalagring, kildebruk, testing og brukeropplevelse.

## Who This Serves

Primærbrukeren i v1 er en leder med personalansvar som står foran en krevende medarbeidersamtale og trenger praktisk støtte raskt. Behovet kan være særlig tydelig for en ny eller mindre erfaren leder, eller i en liten eller mellomstor virksomhet der HR-støtte ikke er tilgjengelig i øyeblikket, men løsningen er ikke avgrenset til disse situasjonene.

Sekundære brukere kan på sikt være HR-funksjoner, lederutviklere og virksomheter som ønsker en mer konsistent og ansvarlig måte å tilby KI-basert samtalestøtte og trening på. Disse er ikke en del av kjernebrukeren eller hovedflyten i v1.

## Success Criteria

Prosjektet regnes som vellykket når følgende kan etterprøves:

1. **Brukeren kan gå fra situasjon til konkret støtte.** Brukeren kan velge eller beskrive en situasjon og få strukturert veiledning med mål, spørsmål og forslag til videre håndtering. Dette kontrolleres blant annet i sensordemoen og KI-testene.
2. **Brukeren kan fortsette samme arbeidsflyt.** Brukeren kan stille oppfølgingsspørsmål og gå videre til samtalesimulering og refleksjon uten å starte situasjonen på nytt. Simulatorens sentrale funksjoner er dekket av `tests/test-simulation.js` og sensordemoen.
3. **Innloggede brukere har egen historikk.** Samtaler kan lagres og åpnes igjen, og Supabase Row Level Security begrenser lesing, oppdatering og sletting til den innloggede brukerens egne samtaler. Historikkflyt og regresjoner kontrolleres i testpakken og databaseoppsettet.
4. **Personvernkontroll finnes både i klient og server.** Definerte typer identifiserende opplysninger skal oppdages før tekst sendes videre til ekstern KI. Dette kontrolleres blant annet av `tests/test-privacy.js` og `tests/test-server-privacy.cjs`.
5. **Alle ni hovedtemaer er representert med flere caser i den fasitbaserte KI-testingen.** Golden-banken skal ha minst to representative caser per hovedtema og ekstra dekning på definerte høyrisikotemaer. Strukturen kontrolleres av `tests/test-golden-schema.cjs`. Golden-resultater dokumenterer samsvar med prosjektets definerte fasit, kildegrunnlag og sikkerhetsregler, ikke uavhengig ekspertgodkjenning av faglig innhold.
6. **Kjernefunksjonene kan vurderes uten API-nøkler eller ekstern database.** `npm run demo` skal starte en deterministisk sensordemo, og `npm test` skal kunne kjøres uten eksterne KI-kall. `tests/test-sensor-demo.cjs` kontrollerer den sentrale demo-flyten.
7. **Utvidet KI-funksjonalitet kan måles separat fra kjernen.** Når live KI er konfigurert, kan systemet registrere modell, responstid, tokenbruk, estimert kostnad og kildebruk. Dette er et tillegg for sammenligning og evaluering, ikke et krav for at kjerneflyten i v1 skal fungere.
8. **Mobilbruk er en faktisk leveranseflate.** Kjerneflyten skal fungere responsivt på mobil, og løsningen skal kunne installeres som standalone PWA i nettlesere som støtter dette. Pilot-UX og PWA-oppsett kontrolleres i egne regresjonstester, mens fysisk mobiltest brukes som supplement fordi nettleseratferd og installasjon ikke kan verifiseres fullt ut med statiske tester.

Detaljert kobling mellom krav og testfiler finnes i README og `docs/ai/AI-TESTPLAN.md`.

## Scope

### In for v1 – kjerne

Første versjon skal demonstrere en sammenhengende og fungerende arbeidsflyt for en leder som skal forberede og øve på en krevende medarbeidersamtale. Kjernen består av at brukeren kan:

- velge eller beskrive en situasjon og få strukturert KI-støtte
- følge opp med spørsmål og videre dialog om samme situasjon
- øve i en dynamisk samtalesimulering og reflektere over gjennomføringen
- bruke løsningen med personvernkontroll før tekst sendes til ekstern KI
- logge inn, lagre egen historikk og gå tilbake til tidligere arbeid
- bruke løsningen responsivt på mobil og installere den som PWA der nettleseren støtter dette

Disse delene er bygget i prototypen. Kritiske deler av kjerneflyten er dekket av deterministiske tester og dokumenterte KI-tester, med testspor beskrevet i README og testplanen.

### Tillegg som er bygget i prototypen

Prosjektet inneholder også funksjonalitet som går utover minimumskjernen:

- rollebasert administrasjon for user/editor/admin
- kontrollert web search og registrering av brukte kilder
- modellvalg, modellsammenligning og benchmark-funksjoner
- logging av responstid, tokenbruk og estimert KI-kostnad
- en kuratert SOURCEBANK som faglig og teknisk grunnlag

Disse funksjonene er implementert for å undersøke kvalitet, sporbarhet og drift, men er ikke nødvendige for å demonstrere den grunnleggende brukerreisen i v1. Testdekning og modenhet varierer mellom funksjonene og er dokumentert separat.

### Utenfor v1 / framtidige utvidelser

Følgende ligger utenfor kjernen i studentprototypen:

- full RAG-løsning som automatisk henter kontekst fra en større lokal kunnskapsbase
- rollebasert samtalestøtte tilpasset andre brukerroller enn leder
- full integrasjon mot HR-systemer eller journalsystemer
- produksjonsklar drift i lukkede nettverk med intern språkmodell og intern database
- automatiserte personalbeslutninger eller andre beslutningsstøttefunksjoner som overtar lederens ansvar

Løsningen skal ikke være et HR-system, journalsystem eller automatisert beslutningssystem. Den skal ikke fatte personalavgjørelser, stille diagnoser, fastslå skyld eller motiv, gi bindende juridiske råd eller erstatte HR, juridisk bistand eller annen relevant fagkompetanse.

### Planlagt utprøving: direkte samtale

En mulig videreutvikling er en mer direkte samtaleinngang der brukeren kan beskrive en krevende arbeidssituasjon og starte dialog uten å gå gjennom hele den strukturerte flyten først. Dette er **ikke en ferdig eller verifisert funksjon i nåværende produkt**, og skal behandles som en hypotese.

Testen bør undersøke om en slik inngang gir raskere og mer naturlig støtte uten at løsningen mister fordelene ved strukturert temakontekst, personvern, arbeidslivsavgrensning og kildebruk. Den bør også sammenlignes eksplisitt med generell KI-chat og norske digitale samtalepartnere.

## Vision

Samtalestøtte skal kunne utvikles fra en studentprototype til en fleksibel plattform for ansvarlig KI-basert lederstøtte og samtaletrening.

På sikt kan løsningen få en større kuratert kunnskapsbank med virksomhetsspesifikke regler og dokumenter. Data om hvilke eksterne kilder som faktisk brukes, kan gi grunnlag for å bygge en lokal SOURCEBANK/RAG-løsning med mer kontrollerte kilder.

Arkitekturen skal også kunne støtte en lukket variant med intern språkmodell, intern database og lokale dokumenter for virksomheter som ikke kan bruke eksterne skytjenester. Brukeropplevelsen bør kunne beholdes selv om den underliggende KI-leverandøren byttes ut.

På lengre sikt kan Samtalestøtte brukes både som støtte før reelle medarbeidersamtaler og som treningsverktøy der ledere kan øve på krevende situasjoner før de møter en faktisk medarbeider.

Ambisjonen er å utvikle et verktøy som gjør det enklere å forberede seg godt, øve på krevende samtaler og bruke kvalitetssikret støtte når behovet oppstår.


## Iterativ produktutvikling og behov som oppstod underveis

Flere av funksjonene som nå inngår i eller vurderes for Samtalestøtte var **ikke planlagt i den opprinnelige produktideen**. De har oppstått gjennom faktisk bruk, egne observasjoner under utviklingen og tilbakemeldinger fra testpersoner.

Eksempler:
- PWA/installasjon som app-lignende webapp oppstod fordi mobil viste seg å være en reell brukerflate.
- Minimert sidebar, bedre ikoner og roligere informasjonsstruktur kom fra pilotfunn om at grensesnittet kunne oppleves som omfattende.
- Utskrift ble foreslått av testbruker som ønsket å ta med samtalemalen videre.
- Videre råd og nye oppfølgingsforslag ble utviklet fordi brukeren ellers måtte finne neste spørsmål alene.
- Yrkes-/sektorkontekst og kobling mot relevant regelverk/avtaleverk kom fra brukertest. Funksjonen er nå koblet gjennom produksjonskoden som valgfri kontekst, med lokal ruting, profesjonsavgrensede kilder og negative kontroller som skal hindre overjuridifisering. Serveren beholder feature flagg som driftskontroll.
- Direkte samtale vurderes fordi en mer åpen inngang kan redusere friksjon for brukere som ikke ønsker å gå gjennom hele strukturen først.
- Tale vurderes som ny inputkanal fordi samtaleøvelse og videre dialog krever mye skriving.

Dette viser at produktet ikke har fulgt en fast funksjonsliste fra start. Arbeidsformen har vært iterativ: behov har blitt oppdaget, vurdert og enten implementert, forkastet eller lagt som kontrollert videre arbeid.

### Hypotese: tale kan redusere terskelen for samtaleøvelse

Surveydataene viser at ikke alle testpersonene har brukt eller vurdert samtaleøvelsen. Datagrunnlaget er lite og sier ikke sikkert hvorfor.

En mulig forklaring er likevel at samtaleøvelse og videre dialog krever relativt mye tekstinntasting. Det kan skape høyere terskel enn hovedveiledningen, særlig på mobil.

Derfor vurderes en pilot der brukeren kan:
1. aktivere mikrofon manuelt
2. snakke inn en ytring
3. få lyd transkribert til tekst
4. få transkripsjonen kontrollert av samme personvernfilter som øvrige tekstfelt
5. sende godkjent tekst videre til Samtalestøtte
6. få KI-svaret lest opp med naturlig tale

Dette skal testes som en separat pilot og ikke regnes som del av produksjonsløsningen før nytte, personvern, transkripsjonskvalitet og brukeropplevelse er verifisert.


## Statusoppdatering 08.11.2026 – faglig presisjon per yrke

Yrkes-/sektorlaget ble videreutviklet fra grov sektorbasert kildebruk til profesjonsavgrenset kildebruk. Det autoritative registeret inneholder nå 85 startkilder, og alle yrkene i kildekartet er gjennomgått med tanke på særregler, autorisasjon, sertifikatkrav, etiske retningslinjer og andre profesjonskrav som kan være relevante i en krevende medarbeidersamtale.

Viktig produktregel: løsningen skal ikke forsøke å finne «en egen lov» for hvert yrke. Der generelt arbeidsmiljø-/HMS- eller sektorregelverk er riktig nivå, er det bedre enn å presentere en irrelevant profesjonskilde.

Som del av samme arbeidsrunde ble kildebanken i Hjelp forenklet til fire hovedkategorier, og den store CSS-filen ble modulært splittet for bedre vedlikeholdbarhet.


### Quality gate 08.11.2026

Kvalitetsstrategien er skjerpet slik at systemet ikke bare må finne *en* faglig kilde, men den mest relevante kilden og samtidig holde feil profesjons-/tariffkilder ute. Alle 14 sektorer har både relevant og irrelevant yrkes-golden-case. GitHub Actions kjører full deterministic testpakke og high-level dependency audit ved push til `main`.

Siste verifiserte status i denne runden: 66 golden-caser, 28/28 deterministic sektor-golden, 73 personvernscaser, 114 benchmark-saker / 48 undertemaer og grønn dependency audit. Live språkmodelltesting holdes som et separat bevisnivå.

Detaljer: `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`.
