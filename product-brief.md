# Product Brief: Samtalestøtte

## Executive Summary

Samtalestøtte skal utvikles som en KI-basert webapplikasjon for ledere som skal forberede, gjennomføre og reflektere over krevende samtaler med medarbeidere. Mange ledere møter situasjoner som fravær, prestasjon, samarbeid, lønn, rus, sikkerhet, livssituasjoner og avslutning av arbeidsforhold uten å ha fått særlig praktisk trening i hvordan slike samtaler faktisk bør håndteres. Løsningen skal ikke ta beslutninger på vegne av lederen, men gi strukturert støtte slik at lederen kan møte samtalen bedre forberedt, formulere seg tydeligere og reflektere over mulige reaksjoner og neste steg.

Produktet skal kombinere strukturert samtalestøtte med dynamisk KI-simulering. Brukeren skal kunne beskrive en situasjon, få hjelp til å identifisere relevant tema og undertema, få forslag til mål, struktur, spørsmål og formuleringer, og deretter øve i en simulert samtale hvor KI-en spiller medarbeideren og reagerer på lederens valg underveis. Personvern og sikkerhet skal være en del av selve arkitekturen, med kontroll av tekst før KI-kall, rollebasert tilgang, bruker-eid historikk og minimal logging av tekniske data.

Løsningen skal samtidig utformes slik at den ikke låses til én KI-leverandør eller til internettilgang. En ordinær nettversjon skal kunne bruke eksterne språkmodeller og kontrollerte weboppslag, mens arkitekturen skal kunne tilpasses lukkede intranett med interne språkmodeller, intern database og lokal kunnskapsbank uten internettilgang. Dette er særlig relevant for virksomheter der informasjonssikkerhet, personvern eller tekniske begrensninger gjør eksterne KI-tjenester uegnet.

## The Problem

Ledere forventes å håndtere krevende medarbeidersamtaler på en profesjonell måte, men mange får begrenset praktisk trening i hvordan slike samtaler gjennomføres. Teori om kommunikasjon og ledelse gir et viktig grunnlag, men gir ikke nødvendigvis trening i den konkrete situasjonen: Hvordan åpner man samtalen? Hvilke spørsmål bør stilles? Hvordan holder man seg til observerbare forhold? Hva gjør man hvis medarbeideren blir sint, lei seg, avvisende eller taus? Hvordan følger man opp etterpå?

I praksis løses dette ofte ved at lederen forbereder seg alene, søker etter informasjon på nettet, bruker generelle KI-verktøy eller kontakter HR når HR er tilgjengelig. Generelle KI-verktøy kjenner imidlertid ikke nødvendigvis konteksten, virksomhetens rammer eller hvilke personvernkrav som bør gjelde når personalsaker beskrives. Nettinformasjon kan være fragmentert, og kommersielle treningsløsninger er ofte rettet mot større virksomheter eller krever abonnement.

Konsekvensen kan være at samtaler utsettes, blir dårlig strukturert eller gjennomføres med for liten forberedelse. Det kan skape usikkerhet for både leder og medarbeider, øke risikoen for misforståelser og konflikt og gjøre det vanskeligere å skille fakta, antakelser og følelser. Samtidig kan ledere som bruker generelle KI-tjenester komme til å dele mer personinformasjon enn nødvendig.

Samtalestøtte skal derfor løse to problemer samtidig: behovet for praktisk, situasjonsnær lederstøtte og behovet for at KI-støtten skjer innenfor tydelige rammer for personvern, sikkerhet, kildebruk og menneskelig ansvar.

## The Solution

Samtalestøtte skal gi lederen ett samlet arbeidsrom for hele prosessen rundt en krevende samtale. Brukeren skal kunne beskrive situasjonen med egne ord eller starte fra et relevant hovedtema og undertema. Systemet skal hjelpe med å forstå hva slags samtale brukeren står overfor og gi konkret støtte til forberedelse, blant annet mål for samtalen, struktur, spørsmål, formuleringseksempler og mulige reaksjoner fra medarbeideren.

Brukeren skal kunne fortsette dialogen med KI-en og stille oppfølgingsspørsmål uten å måtte starte på nytt. Historikken skal gjøre det mulig å gå tilbake til tidligere arbeid. Løsningen skal også ha en egen samtalesimulator der KI-en går inn i rollen som medarbeider. Målet er at brukeren skal kunne øve på formuleringer og håndtere ulike reaksjoner i et trygt miljø før den virkelige samtalen gjennomføres.

KI-støtten skal være faglig avgrenset. Systemet skal ikke diagnostisere medarbeidere, fastslå motiv eller skyld eller ta HR-, juridiske eller personalmessige beslutninger på vegne av lederen. Ved situasjoner som krever juridisk, HR-faglig, medisinsk eller sikkerhetsmessig vurdering skal løsningen tydelig vise begrensningene og anbefale videre vurdering.

Personvern skal være integrert i brukerflyten. Tekst som kan sendes til KI skal kontrolleres før den forlater applikasjonen. Direkte identifikatorer og andre personvernrisikoer skal varsles eller blokkeres, og prinsippet skal være å redusere identifiserbarhet uten å fjerne den konteksten som er nødvendig for å gi nyttig veiledning.

## What Makes This Different

Samtalestøtte skal ikke utvikles som en generell chatbot med et nytt navn. Løsningen skal være et spesialisert arbeidsverktøy for krevende medarbeidersamtaler, med en fast brukerflyt fra situasjonsforståelse og forberedelse til øvelse, oppfølging og refleksjon.

Markedsundersøkelsen viser at det finnes både norske og internasjonale løsninger for KI-basert lederstøtte og samtaletrening, men de identifiserte alternativene er i stor grad kommersielle bedriftsprodukter, abonnementstjenester eller KI-agenter bygget på eksisterende plattformer. Samtalestøtte skal derfor ikke hevde at konseptet er unikt, men differensiere seg gjennom kombinasjonen av funksjoner og arkitektur.

De viktigste forskjellene skal være:

- norsk kontekst og struktur rundt typiske medarbeidersamtaler
- kombinasjon av forberedelse, oppfølging, refleksjon og dynamisk KI-simulering i samme løsning
- personvernkontroll både i brukergrensesnittet og på serveren før KI-kall
- kuratert fag- og kildegrunnlag som kan videreutvikles til lokal kunnskapsbank
- monitorering av hvilke eksterne kilder KI-en faktisk bruker, uten å lagre samtaletekst eller profilere enkeltbrukere
- systematisk sammenligning av KI-modeller på kvalitet, kildebruk, responstid og kostnad
- rollebasert administrasjon av innhold og modellvalg
- arkitektur som skal kunne flyttes fra ekstern KI og webtilgang til interne KI-modeller, intern database og lokal SOURCEBANK/RAG i et lukket nettverk

Prosjektets fortrinn er derfor ikke en påstand om en unik språkmodell eller proprietær KI-teknologi. Fortrinnet ligger i hvordan kjent KI-teknologi kombineres med domenespesifikk brukerflyt, sikkerhet, personvern, simulering, kvalitetstesting og mulighet for drift i miljøer med strenge nettverksbegrensninger.

## Who This Serves

Primærbrukeren er en leder med personalansvar som står foran en krevende medarbeidersamtale og trenger praktisk støtte raskt. Brukeren trenger ikke være ekspert på HR, arbeidsrett eller KI. Løsningen skal være forståelig uten opplæring og hjelpe lederen fra en ustrukturert situasjonsbeskrivelse til en tydeligere plan for samtalen.

For denne brukeren betyr suksess at vedkommende føler seg bedre forberedt, har et tydelig formål med samtalen, har relevante spørsmål og formuleringer tilgjengelig og har fått mulighet til å øve på hvordan ulike reaksjoner kan møtes.

Sekundære brukere er HR-funksjoner, lederutviklere og virksomheter som ønsker en mer konsistent og ansvarlig måte å gi ledere samtalestøtte på. Løsningen kan også være relevant i virksomheter med begrenset eller ingen internettilgang, der interne språkmodeller og interne kunnskapskilder må brukes.

## Success Criteria

Første versjon regnes som vellykket når følgende kriterier er oppfylt:

- minst 90 % av representative brukertester kan gjennomføres uten hjelp til navigasjon eller forklaring av hovedflyten
- brukertestere vurderer støtten som relevant og konkret i minst 80 % av testscenarioene
- det gjennomføres en planlagt brukertest med om lag 8–12 personer, helst med flere deltakere som har leder- eller personalansvar
- alle 56 definerte undertemaer har minst to faste testsaker, slik at testbanken inneholder minst 112 KI-scenarioer
- et representativt utvalg av testcasene kjøres mot minst tre KI-modeller for å sammenligne kvalitet, stabilitet, responstid, weboppslag og kostnad
- personverntestene skal fange opp definerte direkte identifikatorer før tekst sendes til ekstern KI
- serveren skal ha en egen personverngateway slik at klientkontrollen ikke kan omgås ved direkte API-kall
- en innlogget bruker skal bare kunne lese og endre egen samtalehistorikk
- testkjøringer skal kunne skilles fra ordinær brukertrafikk
- løsningen skal kunne registrere tokenbruk, estimert kostnad, responstid og web-/kildebruk for modelltesting uten å lagre samtaletekst i tekniske kildelogger
- administrator skal kunne bytte støttet KI-modell uten kodeendring eller ny deploy
- arkitekturen skal dokumentere hvordan ekstern KI og web search kan erstattes av intern KI og lokal kunnskapsbank i et lukket nettverk
- kritiske brukerflyter, personvernregler og sikkerhetsfunksjoner skal dekkes av automatiserte tester før levering

Testing skal ikke bare brukes til å vurdere om funksjonene virker, men også til å finne ut hvor dyr løsningen faktisk er i bruk. Prosjektet skal derfor følge tokenbruk og estimert kostnad per KI-kall, per testscenario og for representative brukerforløp. Dette skal gi grunnlag for å vurdere hvilken modell som gir best balanse mellom kvalitet og kostnad.

## Scope

### In scope for første versjon

Første versjon skal være en fungerende webbasert prototype for krevende medarbeidersamtaler. Den skal dekke ni hovedtemaer med tilhørende undertemaer og gi strukturert KI-støtte før og under forberedelsen av samtalen. Den skal inkludere oppfølging i dialogform, samtalesimulering, bruker-eid historikk, personvernkontroll før KI-kall, rollebasert administrasjon, fag- og kildegrunnlag, kontrollert web search der dette er relevant, rapportering av KI-svar og tekniske feil samt test- og benchmarkfunksjoner for kvalitet, kostnad og kildebruk.

Innlogging skal inngå fordi løsningen håndterer personlig brukerhistorikk og potensielt sensitivt arbeidsrelatert innhold. Innlogging skal muliggjøre sikker tilgang til egne samtaler, skille ordinære brukere fra redaktører og administratorer og gjøre det mulig å tilby sletting og eksport av egne data.

Kostnadsmåling skal inngå fordi de modellene som gir best kvalitet ofte også er blant de dyrere å bruke. Løsningen skal derfor kunne måle faktisk tokenbruk og estimert kostnad slik at modellvalg kan baseres på dokumentert nytte, ikke bare antakelser om at den kraftigste modellen alltid er best.

Arkitekturen skal være modulær nok til at KI-leverandør og kunnskapskilde kan erstattes. Det skal dokumenteres hvordan løsningen kan driftes i et lukket intranett med intern språkmodell, intern database og lokal kunnskapsbank uten internettilgang. Full produksjonssetting i et slikt lukket miljø er avhengig av tilgang til virksomhetens interne infrastruktur og er derfor ikke et krav for studentprototypen.

### Explicitly out of scope

Første versjon skal ikke være et HR-system, personalsystem, journalsystem eller saksbehandlingssystem. Den skal ikke fatte beslutninger om medarbeidere, gjøre automatiserte personalvurderinger, stille diagnoser, gi bindende juridiske råd eller erstatte HR, juridisk bistand, bedriftshelsetjeneste eller lederens eget ansvar.

Løsningen skal ikke trene eller finjustere en egen språkmodell på brukernes samtaler. Brukerinnhold skal heller ikke brukes som skjult treningsdata. Full integrasjon mot virksomhetens HR-systemer, automatisk dokumentasjon i personalmapper og produksjonsklar utrulling i klassifiserte/lukkede nettverk ligger utenfor første versjon.

## Vision

Hvis Samtalestøtte lykkes, skal løsningen i løpet av to til tre år kunne utvikles fra en prototype til en fleksibel plattform for ansvarlig KI-basert lederstøtte og praktisk samtaletrening.

Den nettbaserte versjonen kan videreutvikles med en større kuratert kunnskapsbank, bedre kildehåndtering og virksomhetsspesifikke regler og dokumenter. Data om hvilke eksterne kilder som faktisk brukes, skal kunne brukes til å identifisere hvilke dokumenter og nettsider som bør inngå i en lokal SOURCEBANK/RAG-løsning. På denne måten kan kunnskapsgrunnlaget gradvis flyttes fra åpne nettsøk til kontrollerte og kvalitetssikrede kilder.

Parallelt skal arkitekturen kunne støtte en lukket variant for organisasjoner som ikke kan sende informasjon til eksterne skytjenester. I en slik løsning skal Samtalestøtte kunne kjøres på virksomhetens intranett med interne språkmodeller, intern autentisering og database, lokale dokumenter og ingen internettilgang. Brukeropplevelsen skal i hovedsak være den samme uavhengig av om KI-en leveres fra en ekstern API-tjeneste eller en modell som kjører internt.

Dersom løsningen etter hvert viser seg å ha reell nytte og etterspørsel, kan den utvikles videre som en betalt tjeneste eller virksomhetslisens. Begrunnelsen er først og fremst å dekke løpende kostnader til KI-kall, database, hosting og øvrig infrastruktur. Kostnadsmodellen skal kunne baseres på faktisk målt bruk fremfor antakelser.

Samtidig utvikler KI-markedet seg svært raskt. Modeller som i dag er kostbare kan senere bli billigere, og rimeligere eller gratis modeller kan etter hvert bli gode nok til å dekke hele eller deler av behovet. Samtalestøtte skal derfor ikke bygges rundt en forutsetning om at en bestemt betalt modell alltid er nødvendig. Fleksibelt modellvalg og provider-uavhengig arkitektur skal gjøre det mulig å redusere kostnader eller tilby gratisnivåer dersom teknologiutviklingen gjør dette forsvarlig.

På lengre sikt kan løsningen bli et verktøy både for individuell lederstøtte og systematisk ledertrening, hvor simuleringer, kvalitetssikret kunnskap og kontrollerte tilbakemeldingssløyfer gjør det mulig å øve på krevende samtaler uten at KI-en overtar beslutningsansvaret. Målet er ikke å erstatte menneskelig ledelse, men å gjøre ledere bedre forberedt når samtalene faktisk må tas.


## Oppdatering v20.5 – faglig bredde, brukertest og modellvalg

Prosjektets temastruktur utvides med et niende hovedtema, **Mobbing og trakassering**, fordi dette har egne krav til ivaretakelse, varsling, faktaundersøkelse og nøytralitet som ikke dekkes godt nok av vanlig konflikt/samarbeid. I forsvarssektoren knyttes temaet også til MOST (mobbing og seksuell trakassering), men menyen bruker et sivilt og selvforklarende navn. Under **Fravær og oppfølging** samles tilrettelegging og arbeidsevne som ett tydelig undertema, og **Vold og trusler** legges under Sikkerhet.

Den faste KI-testbanken økes fra 94 til **112 saker**, fortsatt minimum to saker per undertema. Regelverksnære og høyrisiko temaer får egne kildetester. OpenRouter tas inn som alternativ provider for å kunne sammenligne gratis, rimelige og premium-modeller uten å låse løsningen til én leverandør.

Brukertesten bygges inn som en kort undersøkelse på omtrent to minutter. Den måler forståelighet, navigasjon, relevans, konkret nytte, simulatorverdi, personvernforståelse og sannsynlighet for reell bruk. Hovedflyt uten hjelp skal fortsatt vurderes gjennom observasjon i tillegg til selvrapport.
