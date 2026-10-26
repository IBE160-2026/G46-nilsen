# Product Brief: Samtalestøtte

## Executive Summary

Samtalestøtte er et KI-basert arbeidsverktøy for ledere som skal forberede, gjennomføre og reflektere over krevende medarbeidersamtaler. Løsningen dekker blant annet fravær, prestasjon, samarbeid, lønn, alkohol og rus, sikkerhet, livssituasjoner, mobbing og trakassering og avslutning av arbeidsforhold.

Produktet skal ikke være en generell chatbot. Brukeren føres gjennom en strukturert arbeidsflyt fra situasjonsforståelse og forberedelse til oppfølging, refleksjon og samtalesimulering. KI-en skal kunne foreslå mål, spørsmål og formuleringer, forberede lederen på mulige reaksjoner og opptre som medarbeider i en treningssamtale.

Utviklingsutfordringen er å få KI-kvalitet, personvern, autentisering, historikk, kildebruk, simulering, modelltesting og kostnadsmåling til å fungere sammen i én løsning. Arkitekturen skal samtidig være leverandøruavhengig slik at eksterne KI-tjenester senere kan erstattes av interne modeller og lokale kunnskapskilder.

Målet er et praktisk lederverktøy der KI styrker forberedelse, trening og refleksjon uten å overta beslutningsansvaret.

## The Problem

Ledere forventes å håndtere krevende medarbeidersamtaler profesjonelt, men får ikke alltid praktisk trening i hvordan slike samtaler faktisk gjennomføres.

Utfordringen handler blant annet om hvordan samtalen åpnes, hvilke spørsmål som bør stilles, hvordan man holder seg til observerbare forhold, og hvordan man håndterer reaksjoner som sinne, taushet eller avvisning.

I praksis forbereder mange ledere seg alene, søker informasjon på nettet, bruker generelle KI-verktøy eller kontakter HR. Disse alternativene dekker deler av behovet, men gir ikke nødvendigvis en samlet arbeidsflyt for forberedelse, øvelse og refleksjon. Generelle KI-verktøy gir også personvernutfordringer dersom brukeren legger inn identifiserende opplysninger fra reelle personalsaker.

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

Samtalestøtte er et spesialisert arbeidsverktøy, ikke en generell chatbot med nytt grensesnitt.

Løsningen kombinerer ni hovedtemaer og 56 undertemaer med forberedelse, oppfølging, refleksjon og simulering i samme arbeidsflyt. I tillegg skal den ha personvernkontroll i klient og server, bruker-eid historikk, kontrollert web search, kildehåndtering, rollebasert administrasjon og modelltesting.

Fortrinnet ligger ikke i å utvikle en egen språkmodell, men i hvordan KI, personvern, simulering, testing og domenespesifikk brukerflyt bygges sammen.

## Project Complexity

Prosjektets tekniske kompleksitet oppstår fordi flere avhengige lag må fungere samtidig: brukergrensesnitt, serverlogikk, språkmodell, personvern, autentisering, datalagring, historikk, kildebruk, simulator og administrasjon.

KI-laget skal støtte flere modeller uten at resten av applikasjonen må bygges om. Samtidig skal løsningen kunne registrere responstid, tokenbruk, estimert kostnad og kildebruk slik at modeller kan sammenlignes systematisk.

Personvernkontrollen må finnes både i klient og server. Utfordringen er å redusere identifiserende informasjon uten å fjerne så mye kontekst at KI-støtten blir dårligere.

Simulatoren skal holde en konsistent medarbeiderrolle gjennom flere meldinger og reagere dynamisk på brukerens formuleringer. Samtidig må den styres slik at den ikke diagnostiserer, tillegger personer skjulte motiver eller fremstiller spekulasjoner som fakta.

Prosjektet skal også ha systematisk KI-testing. De 56 undertemaene skal inngå i faste testsituasjoner, og et representativt utvalg skal kunne kjøres mot flere modeller. Dette gjør det mulig å sammenligne blant annet kvalitet, stabilitet, responstid, kostnad og kildebruk.

Web search skal være kontrollert og sporbar. Systemet skal kunne registrere hvilke eksterne kilder som faktisk brukes, uten at selve personalsamtalen automatisk lagres i denne loggen.

Kompleksiteten ligger derfor først og fremst i samspillet mellom KI-kvalitet, personvern, datalagring, kildebruk, testing og brukeropplevelse.

## Who This Serves

Primærbrukeren er en leder med personalansvar som står foran en krevende medarbeidersamtale og trenger praktisk støtte raskt.

Sekundære brukere kan være HR-funksjoner, lederutviklere og virksomheter som ønsker en mer konsistent og ansvarlig måte å tilby KI-basert samtalestøtte og trening på.

## Success Criteria

Prosjektet regnes som vellykket dersom prototypen demonstrerer at hovedflyten fungerer og kan evalueres systematisk.

Det innebærer at brukeren kan gå fra situasjonsvalg til KI-støtte og simulering, at innloggede brukere bare får tilgang til egen historikk, og at personvernregler og kritiske funksjoner kan testes.

Løsningen skal også kunne sammenligne KI-modeller og registrere responstid, tokenbruk, estimert kostnad og kildebruk.

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
