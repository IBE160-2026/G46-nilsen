# Product Brief: Samtalestøtte

## Executive Summary

Samtalestøtte er et KI-basert arbeidsverktøy for ledere med personalansvar som skal forberede, gjennomføre og reflektere over krevende medarbeidersamtaler. Løsningen samler strukturert veiledning, oppfølgingsdialog, samtalesimulering og refleksjon i én arbeidsflyt, med personvern og menneskelig beslutningsansvar som tydelige rammer.

Prototypen dekker ni hovedtemaer: fravær, prestasjon, samarbeid, lønn, alkohol og rus, sikkerhet, livssituasjoner, mobbing og trakassering og avslutning av arbeidsforhold. KI-en kan foreslå mål, spørsmål og formuleringer, forberede lederen på mulige reaksjoner og opptre som medarbeider i en treningssamtale.

Produktet skal ikke være en generell chatbot eller et automatisert HR-system. Målet er et praktisk lederverktøy som styrker forberedelse, trening og refleksjon uten å overta lederens ansvar eller erstatte relevant fagkompetanse.

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

Samtalestøttes særpreg ligger derfor i kombinasjonen: **situasjonsspesifikk KI-støtte, en fast lederrettet arbeidsflyt, dynamisk samtaletrening, innebygget personvern, faglige sikkerhetsgrenser og systematisk kvalitetstesting i én løsning.** Målet er ikke å erstatte fagpersoner eller lederens skjønn, men å gjøre det enklere å gå fra «jeg må ta en vanskelig samtale» til konkret forberedelse og øvelse på en mer strukturert og ansvarlig måte.

## Project Complexity

Prosjektets tekniske kompleksitet oppstår fordi flere avhengige lag må fungere samtidig: brukergrensesnitt, serverlogikk, språkmodell, personvern, autentisering, datalagring, historikk, kildebruk, simulator og administrasjon.

KI-laget skal støtte flere modeller uten at resten av applikasjonen må bygges om. Samtidig skal løsningen kunne registrere responstid, tokenbruk, estimert kostnad og kildebruk slik at modeller kan sammenlignes systematisk.

Personvernkontrollen må finnes både i klient og server. Utfordringen er å redusere identifiserende informasjon uten å fjerne så mye kontekst at KI-støtten blir dårligere.

Simulatoren skal holde en konsistent medarbeiderrolle gjennom flere meldinger og reagere dynamisk på brukerens formuleringer. Samtidig må den styres slik at den ikke diagnostiserer, tillegger personer skjulte motiver eller fremstiller spekulasjoner som fakta.

Prosjektet skal også ha systematisk KI-testing på flere nivåer. Benchmarkbanken dekker de 48 gjeldende undertemaene med faste testsituasjoner, mens en mindre golden/fasit-bank brukes til strengere regresjonskontroll av representative og risikoutsatte saker. Et representativt utvalg skal kunne kjøres mot flere modeller for å sammenligne blant annet kvalitet, stabilitet, responstid, kostnad og kildebruk.

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

Detaljert kobling mellom krav og testfiler finnes i README og `docs/ai/AI-TESTPLAN.md`.

## Scope

### In for v1 – kjerne

Første versjon skal demonstrere en sammenhengende og fungerende arbeidsflyt for en leder som skal forberede og øve på en krevende medarbeidersamtale. Kjernen består av at brukeren kan:

- velge eller beskrive en situasjon og få strukturert KI-støtte
- følge opp med spørsmål og videre dialog om samme situasjon
- øve i en dynamisk samtalesimulering og reflektere over gjennomføringen
- bruke løsningen med personvernkontroll før tekst sendes til ekstern KI
- logge inn, lagre egen historikk og gå tilbake til tidligere arbeid

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

## Vision

Samtalestøtte skal kunne utvikles fra en studentprototype til en fleksibel plattform for ansvarlig KI-basert lederstøtte og samtaletrening.

På sikt kan løsningen få en større kuratert kunnskapsbank med virksomhetsspesifikke regler og dokumenter. Data om hvilke eksterne kilder som faktisk brukes, kan gi grunnlag for å bygge en lokal SOURCEBANK/RAG-løsning med mer kontrollerte kilder.

Arkitekturen skal også kunne støtte en lukket variant med intern språkmodell, intern database og lokale dokumenter for virksomheter som ikke kan bruke eksterne skytjenester. Brukeropplevelsen bør kunne beholdes selv om den underliggende KI-leverandøren byttes ut.

På lengre sikt kan Samtalestøtte brukes både som støtte før reelle medarbeidersamtaler og som treningsverktøy der ledere kan øve på krevende situasjoner før de møter en faktisk medarbeider.

Ambisjonen er å utvikle et verktøy som gjør det enklere å forberede seg godt, øve på krevende samtaler og bruke kvalitetssikret støtte når behovet oppstår.
