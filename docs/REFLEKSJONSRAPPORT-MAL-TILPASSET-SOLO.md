# Refleksjonsrapport – Programmering med KI

**Emne:** IBE160 Programmering med KI, høst 2026  
**Gruppe/prosjekt:** G46 – Samtalestøtte  
**Student:** [Fyll inn navn/studentnummer for endelig levering]  
**Dato:** 25.11.2026 (revidert utkast, opprinnelig utarbeidet 20.11.2026)  
**Status:** Arbeidsutkast etter skolens `reflection-report-template.md`. Teksten beskriver mine egne erfaringer slik de er dokumentert i prosjektet; den er ikke innlevert eller personlig sluttgodkjent. Gjeldende teknisk status finnes i [prosjektstatus](PROSJEKTSTATUS.md).

**Om soloprosjektet:** Jeg er eneste student i gruppen. Spørsmål som gjelder arbeidsfordeling mellom gruppemedlemmer og samarbeid med andre studenter besvares derfor med reell erfaring fra egen organisering og KI-assistert utvikling. Ingen fiktive gruppemedlemmer, møter eller samarbeidskonflikter beskrives.

## 1. Gruppeinformasjon

**Gruppenavn:** G46 – Samtalestøtte  
**Gruppemedlemmer:** Én student (meg)  
**Dato:** 25.11.2026 (revidert utkast)  

Selv om prosjektet er registrert som gruppe, har jeg vært eneste student. Jeg har hatt ansvaret for idé, prioriteringer og beslutninger. Samtidig føltes det ofte som om ChatGPT var mitt «andre gruppemedlem»: Jeg diskuterte ideer, stilte spørsmål, ble frustrert og fikk hjelp til å komme videre. Det er en beskrivelse av opplevelsen, ikke en påstand om at KI er en person eller kan ta ansvar for arbeidet.

## 2. Utviklingsprosessen

### 2.1 Oversikt over prosjektet

Jeg utviklet Samtalestøtte fordi jeg ønsket et praktisk hjelpemiddel for ledere som forbereder krevende medarbeidersamtaler. I en slik situasjon er det ikke nok å kjenne regelverk eller generelle råd. Lederen må kunne åpne samtalen på en respektfull måte, skille observasjoner fra antakelser, stille gode spørsmål, håndtere reaksjoner og avtale videre oppfølging. Målet mitt var derfor ikke å bygge enda en åpen chatbot, men en arbeidsflyt som gir støtte i øyeblikket når en konkret samtale skal gjennomføres.

Løsningen lar brukeren beskrive en situasjon, velge eller få foreslått tema, motta KI-baserte samtaleråd, stille oppfølgingsspørsmål og øve i en simulering. Fagkilder og personvern er bygget inn i denne flyten. Brukeren skal slippe å beherske prompt engineering selv. Samtalestøtte er likevel verken et HR-system eller en beslutningsmotor: KI skal ikke fastslå skyld, stille diagnoser, dikte opp motiv eller fatte personalbeslutninger.


### 2.2 Arbeidsmetodikk

Jeg startet med svært begrenset kunnskap om programmering og kan fremdeles omtrent ikke skrive kode på egen hånd. Jeg hadde aldri arbeidet i Git, og begreper som Node.js, API og backend var helt nye for meg. Læringskurven ble derfor svært bratt. Som eneste student har jeg styrt produktmålene, beskrevet ønsket funksjonalitet, prøvd løsningen og tatt beslutningene, mens KI har vært avgjørende for å skrive og endre koden. Uten et utviklingsteam eller uavhengig kodegjennomgang er det vanskelig å vite om et tilsynelatende godt forslag faktisk er riktig.

Prosjektet begynte utforskende. Jeg beskrev ønsket funksjon, KI foreslo kode, jeg testet og ga nye instruksjoner. Dette var effektivt i en enkel prototype, men etter hvert ble konsekvensene av små endringer større. Et CSS-tiltak kunne påvirke mobilvisningen, og en justering av KI-råd kunne påvirke responskontrakter og tester. Jeg oppdaget at en generell beskjed om å «fikse» noe ofte ga KI for mye tolkningsrom.

Arbeidsmåten ble derfor gradvis mer kontrollert: Jeg presiserte mål og avgrensninger, fikk hjelp av KI til å forstå endringer og feil, brukte automatiserte tester som kontroll og lærte hvordan Git-commits kunne bevare fungerende tilstander. Jeg ser dette som forskjellen mellom enkel prompt engineering og det forelesningene omtaler som **context engineering**: KI må få riktig prosjektkontekst, tidligere beslutninger, akseptansekriterier og dokumenterte feil. Ellers kan den lage kode som ser riktig ut isolert, men er feil i systemet som helhet.

Det var ingen oppgaver å fordele mellom studenter. Jeg opplevde likevel ChatGPT som en slags ekstra gruppedeltaker i det daglige, særlig fordi jeg kunne diskutere produktvalg og få teknisk hjelp når jeg sto fast. Forskjellen er at KI verken kan ta ansvar eller erstatte en medstudents kritiske vurdering. Git og GitHub ga meg etter hvert struktur for versjoner og endringer, mens dokumentasjon og tester hjalp meg å kontrollere resultatene.


### 2.3 Teknologi og verktøy

Frontend er utviklet med HTML, CSS og JavaScript. Backend bruker Node.js og Express, og Supabase benyttes til autentisering og historikk i PostgreSQL. KI-svar kommer fra konfigurerte OpenAI- eller OpenRouter-modeller. Git og GitHub brukes til versjonshåndtering, GitHub Actions til automatiske tester, og Render til publisering og separate test- og pilotmiljøer. Jeg har brukt VS Code, JSON-testbanker, Node-baserte tester og Markdown-dokumentasjon. BMAD-prinsipper har vært et rammeverk for Product Brief, PRD, arkitektur og stories. Prosjektet er ikke bygget med Next.js eller FastAPI, og jeg vil ikke påstå at hele utviklingen ble utført av autonome agentteam.


### 2.4 Utviklingsfaser

**Fase 1 – planlegging og utforsking.** Jeg begynte med å beskrive et problem fra lederhverdagen: behovet for støtte før en vanskelig samtale. Med KI utforsket jeg hvilke steg et verktøy burde inneholde, skisserte en prototype og prøvde flere løsninger. I den tidlige fasen var promptene enklere og mindre systematisk lagret. Jeg kan derfor ikke dokumentere at absolutt alle tidlige instruksjoner er bevart.

BMAD ble ikke brukt som en ferdig oppskrift før første kode. Prototypen var allerede under utvikling da Product Brief, PRD, UX, arkitektur og Epics/Stories ble formalisert. Jeg mener det ville vært misvisende å påstå at hvert planleggingsdokument var godkjent før implementeringen startet. BMAD ga derimot et nyttig rammeverk for å få kontroll på det som allerede var bygget, og for videre endringer. I november ble kravene samlet i en kanonisk PRD, koblet til konkrete arkitekturkomponenter og stories, og supplert med et register som viser hvilket testbevis hvert krav faktisk har.

**Fase 2 – utvikling, testing og revisjoner.** Jeg gikk over til mindre oppgaver og tydeligere avgrensninger. Jeg brukte KI til å kode, analysere feilsituasjoner, foreslå testtilfeller og dokumentere resultater, men prøvde å være den som bestemte om forslagene skulle aksepteres. Git-historikk og daterte testbeskrivelser dokumenterer konkrete iterasjoner. Et dokumentert eksempel på hvordan instruksjonene ble mer kritiske, er spørsmålet jeg stilte under kildearbeidet: «Er dette en god kilde til akkurat denne typen påstand, eller ligger den bare i banken fordi den virker relevant?» I stedet for bare å be om flere kilder måtte jeg kreve at hvert forslag ble vurdert opp mot yrke, sektor og konkret påstand. KI foreslo endringer i kildehierarki og tester, mens jeg bestemte at feil kildevalg skulle undersøkes og ikke bare skjules bak en grønn test. Hele arbeidsforløpet er dokumentert i KI-loggen.

De første versjonene var mer skjemabaserte og stilte flere spørsmål før brukeren fikk hjelp. Jeg vurderte dette som lite naturlig. Brukerflyten ble derfor endret slik at fritekst og korte avklaringer fikk større plass. KI kan foreslå et tema, men skal ikke velge tema basert på ett tilfeldig nøkkelord eller erstatte brukerens egen situasjonsbeskrivelse med en standardmal.

Brukertesting avdekket også uklare titler og overlappende undertemaer. Etter en systematisk gjennomgang ble listen redusert fra 56 til 48 undertemaer. Det var ikke et tall pilotbrukerne ba om. De meldte fra om uklart språk og vanskelige valg; 48 var mitt designresultat etter å ha fjernet eller slått sammen overlapp. En viktig bieffekt var at endringen måtte følges opp i både serverkontrakt og testdata. Den eksisterende benchmarkbanken ble oppdatert til 114 saker, ikke kastet og erstattet.

Forelesningen 12. november understreket verdien av mindre stories med akseptansekriterier, avhengigheter og en gjennomføringsrekkefølge. Den viste også hvordan subagenter kan redusere presset på kontekstvinduet og arbeide parallelt. Mitt prosjekt ble hovedsakelig utviklet gjennom iterativ KI-dialog og Git, ikke gjennom en dokumentert autonom prosess der subagenter implementerte alle stories. Jeg har derfor lagt størst vekt på å vise hva jeg faktisk gjorde og lærte, framfor å kopiere en prosessbeskrivelse jeg ikke har fulgt fullt ut.


## 3. Utfordringer og løsninger


### 3.1 Tekniske utfordringer

**Utfordring 1 – mobil og faktisk berøringsatferd.** Problemet var at grønne CSS-tester ikke garanterte at kontroller kunne trykkes på i mobilvisning. KI bidro med testforslag og kode, men den automatiske testen hadde selv en timingfeil.

Den senere sensorkontrollen 20. november bekreftet dette læringspunktet. Tidligere hadde jeg 99 grønne CSS-sammenligninger ved ulike skjermbredder, men testen brukte fremdeles desktop-emulering. Vi la derfor til en ekte mobilmodus i Chromium med berøringshendelser, og kontrollerte bredder på 320, 390 og 768 piksler. Den første berøringstesten feilet fordi scrollen ikke var ferdig da testen valgte fingerposisjon. Jeg ville ikke endre fungerende CSS for å få denne testen grønn; i stedet korrigerte vi tidspunktet for kontrollen og beholdt kravet om at elementet måtte være fysisk treffbart. Den samme runden viste at utskrifts-HTML alene var et svakt bevis. Derfor lot vi Chromium lage en faktisk tosidig PDF og kontrollerte teksten i den med egne PDF-verktøy. Testene besto, men jeg skiller fremdeles mellom emulering, lesbar PDF-tekst og en fysisk bruker- eller papirutskriftstest.

Mobilutviklingen lærte meg å kontrollere den faktiske visningen, ikke bare kildekoden. Ved ett tilfelle ble logoen justert i en desktop-komponent som ikke var synlig på mobil. Først da jeg fulgte den responsive DOM-/CSS-stien, ble årsaken klar. Jeg erfarte også at en vellykket Render-deploy ikke nødvendigvis beviser at riktig commit faktisk vises, eller at PWA-cache er oppdatert. En fungerende kodeendring, en vellykket deploy og et tilfredsstillende brukergrensesnitt er tre forskjellige kvalitetsnivåer.

**Utfordring 2 – serverstatus og tilgangskontroll.** En negativ HTTP-test viste at OpenRouter ikke ble riktig gjenkjent når OpenAI manglet. En annen test viste feil statuskode ved forsøk på å oppdatere en annens historikk.

Negative tester avdekket også konkrete kodefeil. Statusendepunktet for KI sjekket først bare om OpenAI var konfigurert, selv om løsningen også støttet OpenRouter. Testen med bare en dummy OpenRouter-nøkkel feilet i GitHub Actions. Serverens statuslogikk ble rettet til å bruke den felles providerkontrollen, og den påfølgende kjøringen var grønn. Testen beviste korrekt statuskontrakt, men ikke at en virkelig ekstern KI-provider ville akseptert nøkkelen.

To-brukertesten avdekket en annen feil: En bruker som forsøkte å oppdatere en annen brukers samtale, fikk HTTP 500 i stedet for 404. Eierskapsfilteret i den lokale etterligningen avviste endringen, men serveren tolket tomt resultat som en generell feil. En minimal rettelse gir nå samme nøytrale «ikke funnet»-svar for en ukjent og en annen brukers ID. Det er viktig både for forståelige feilmeldinger og for ikke å avsløre informasjon om hvem som eier en samtale.

**Utfordring 3 – kompleks arkitektur.** Hver ny funksjon ga flere avhengigheter mellom frontend, server, database og stiler. Refaktorering måtte derfor være kontrollert og ledsaget av regresjonstester. KI kunne foreslå omfattende endringer, men jeg måtte vurdere om gevinsten faktisk forsvarte risikoen.


### 3.2 Samarbeidsutfordringer

Dette punktet i malen er skrevet for flere gruppemedlemmer. Jeg har ikke hatt konflikter med andre studenter, problemer med oppgavefordeling eller teammøter, fordi jeg har vært alene. Utfordringen har i stedet vært å organisere arbeidet uten en medstudent som utfordrer kravene eller finner feil i koden. Jeg forsøkte å redusere denne svakheten gjennom dokumentert testarbeid og tilbakemeldinger fra pilotbrukere. Dette kan likevel ikke erstatte fullstendig uavhengig kodegjennomgang. Som solostudent opplevde jeg både frihet til raske produktvalg og risikoen for å bli for tett på min egen løsning.


### 3.3 KI-spesifikke utfordringer

Den største risikoen har vært at KI kan produsere feil som ser plausible ut. Det gjelder ikke bare programkode, men også testfasit, kildeutvalg, forklaringer og dokumentasjon. KI kunne dessuten foreslå større endringer enn jeg hadde ønsket, særlig i frontend. Dette skapte ekstra arbeid og regresjoner. Jeg måtte lære å stoppe og snevre inn oppgavene, lese konsekvensene og forkaste forslag som gikk utover den bestilte endringen.

Det viktigste gjennombruddet i testingen kom da jeg forsto at en «grønn» KI-test ikke nødvendigvis er en god test. Et tidlig testsystem ga pene resultater, men manglet tilstrekkelig synlighet i modellsvaret. Jeg fant også konkrete feil i testheuristikkene: «lat» ble tolket som delstreng i «arbeidsrelatert», og omtale av at skyld ikke må fastslås kunne utløse et forbud mot skyld. I slike tilfeller ville det vært feil å endre den gode KI-responsen for å tilfredsstille en dårlig test.

Golden-banken ble gradvis utvidet, til slutt til 66 caser, hvorav 40 er særlig strenge på yrke, sektor, tariff og kilder. Den første fulle live-runden av de 40 ga 37 OK og tre «bør sjekkes». Gjennomgangen viste tre forskjellige årsaker: en for rigid temafasit, en upresis testheuristikk og én reell kildeprioriteringsfeil. I sistnevnte tilfelle var statsansatteloven omtalt i rådet, men falt ut av det strukturerte kildefeltet. Jeg valgte derfor ulike tiltak: endre fasiten når flere svar var faglig forsvarlige, endre testmetoden når den målte feil, og endre systemlogikken når systemet faktisk hadde en svakhet. En ny live-kjøring 9. november mot gpt-5.6-luna ga 40/40 OK uten kritiske eller tekniske feil.

Dette resultatet må tolkes nøkternt. Det er prosjektets egen fasit, utarbeidet med KI-støtte, ikke en uavhengig juridisk eller arbeidspsykologisk ekspertvurdering. Det beviser heller ikke at alle framtidige svar fra en ikke-deterministisk modell vil være riktige. Det viser at den bestemte modellen besto et dokumentert testsett på et bestemt tidspunkt.

Det avgjørende var å skille mellom feil i KI-svaret, feil i systemets kildevalg og feil i testens egen fasit. Jeg ville ikke endre et saklig svar bare for å få en feilaktig test grønn. Da ville kvalitetssikringen blitt en øvelse i å tilfredsstille testen, ikke i å forbedre produktet.


## 4. Kritisk vurdering av KI sin påvirkning


### 4.1 Fordeler med KI-assistanse

Den største fordelen har vært utviklingshastighet og læringstilgang. KI kunne foreslå kode, forklare feilmeldinger, generere testcaser, bidra til dokumentasjon og belyse alternativer jeg selv ikke kjente. Uten KI ville jeg trolig laget en betydelig enklere applikasjon innenfor semesteret. Jeg mener likevel ikke at KI dermed automatisk ga en bedre løsning.

**Effektivitet:** KI ga rask tilgang på kodeutkast, feilforklaringer, testtilfeller og dokumentasjonsforslag. Det gjorde det mulig å bygge mer i løpet av semesteret. Gevinsten avtok når mange små endringer førte til teknisk gjeld og mer regresjonsarbeid.

**Læring:** Jeg fikk bedre forståelse for testing, API-er, autentisering, modulgrenser og kildekritikk når jeg ba KI forklare årsaker og alternativer. Den største læringen kom når jeg måtte undersøke hvorfor en tilsynelatende god løsning feilet.

**Kodekvalitet:** KI hjalp med å identifisere overstyrt CSS, skille ut avgrensede funksjoner og bygge mer representative tester. Dette var nyttig, men ikke i seg selv bevis for at kodebasen er vedlikeholdbar eller fri for feil.


### 4.2 Begrensninger og ulemper

En annen ulempe er at høy implementeringshastighet kan øke scope og teknisk gjeld. Det ble fristende å legge til administrasjon, benchmark, logging, flere modellvalg og mer avansert kildestyring. Noe økte nytteverdien, men alt økte også kompleksiteten. Jeg skulle tidligere ha prioritert kjerneflyten hardere og utsatt funksjoner som ikke var nødvendige for prosjektets første mål.

Dette er grunnen til at jeg ser **human in the loop** som mer enn en formell godkjenningsknapp. Jeg må kunne forstå hva som er foreslått, utfordre antakelsene, kontrollere tester og ta ansvar for sluttresultatet. I et soloprosjekt kan dette være krevende fordi samme person også lager kravene og vurderer dem. Jeg ville derfor ønsket mer ekstern faglig og teknisk review ved videre utvikling.

På samme måte gir deterministiske tester viktig, men annen, kunnskap. De kan kontrollere at en kilde ikke lekkes til feil yrke, at personopplysninger avvises før KI-kall, eller at responsen følger et skjema. De kan ikke alene bevise at åpningen er menneskelig, omsorgsfull eller egnet i en virkelig personalsamtale. Der trengs faglig og menneskelig vurdering.

For meg er det avgjørende å forstå **hva en bestått test er bevis for**. En strukturtest er ikke en nettlesertest, en lokal Auth-mock er ikke Supabases ekte RLS, og en mock-provider er ikke en modellkvalitetsmåling. Derfor la jeg til en faktisk Chrome-reise fra tematisk valg og situasjonsbeskrivelse, via råd, videre spørsmål, utskrifts-HTML og simulering, til lagring, gjenåpning og sletting. Den måtte også blokkere et fiktivt fullt navn **før** analyseforespørselen ble sendt. Første kjøring stoppet fordi testen leste historikken før den asynkrone lagringen var ferdig. Jeg endret testen til å vente på **lagret serverdata** framfor bare en synlig tilbakemelding. Slik oppdaget jeg at selv en test kan være feilkonstruert. Den senere testen med virkelig lokal Supabase Auth/PostgREST lukket et annet bevisgap, uten at vi samtidig kalte applikasjonen produksjonsgodkjent. Denne presisjonen var også et svar på faglærerens formative tilbakemelding om observerbare akseptanser.

En risiko for egen læring er at jeg kan bli en bestiller av kode jeg ikke fullt ut behersker. Når KI foreslår en ferdig løsning, kan jeg også bli mindre tilbøyelig til å utforske alternative design. Jeg opplevde derfor et behov for å stille mer kritiske motspørsmål: Hvorfor denne løsningen? Hva blir konsekvensene andre steder? Hva er den enkleste forsvarlige endringen?


### 4.3 Sammenligning: med og uten KI

Uten KI ville jeg ikke ha utviklet Samtalestøtte. Jeg hadde rett og slett ikke programmeringskunnskapene til å lage en slik applikasjon selv, heller ikke en vesentlig enklere versjon. Alternativet ville vært å lære programmering over langt lengre tid før jeg kunne begynne å bygge. KI var derfor en forutsetning for at prosjektet ble mulig, ikke bare et hjelpemiddel som økte hastigheten. Samtidig betyr ikke dette at all KI-generert kode var god: Det store omfanget skapte behov for testing, opprydding og kritiske valg.


### 4.4 Samlet vurdering

Det største læringsutbyttet mitt er forskjellen mellom at KI kan skrive kode og at jeg kan stå inne for et system. Den første delen er ofte rask. Den andre krever krav, arkitektur, kildekritikk, testing, brukervurdering, personvern og ærlig dokumentasjon av avgrensninger.

Samtalestøtte viser at KI kan gjøre et omfattende studentprosjekt mulig, men også at menneskelig vurdering blir viktigere når utviklingen går raskt. De mest verdifulle erfaringene kom ikke fra funksjoner som virket på første forsøk, men fra feil som tvang meg til å undersøke både produktet, testmetoden og mine egne antakelser.

Jeg vurderer KI som en netto positiv faktor for prosjektet, men bare fordi jeg etter hvert innførte mer systematisk kontroll. Erfaringen har gjort meg mer opptatt av menneskelig ansvar enn av hvor fort en modell kan skrive kode.


## 5. Etiske implikasjoner


### 5.1 Ansvar og eierskap

Når jeg bruker KI-generert kode, er det fortsatt jeg som er ansvarlig for løsningen og innleveringen. Jeg må kontrollere funksjon, sikkerhet og kildebruk, ikke bare anta at KI har gjort det riktig. KI-genererte forslag kan også reise spørsmål om lisenser, opphavsrett og mulig gjenbruk av andres materiale. Jeg bør derfor ikke beskrive all kode som selvstendig håndskrevet, og må kontrollere avhengigheter og rettigheter før eventuell videre distribusjon. I en app for vanskelige personalsamtaler er det også nødvendig at brukeren forstår at KI ikke er en juridisk, medisinsk eller HR-faglig fasit.


### 5.2 Transparens

Det bør være åpenhet om at Samtalestøtte er laget med omfattende KI-assistanse, og at produktet bruker KI til å generere råd. Git-historikk, AI-logg, PRD, testbanker og feilrettingsbeskrivelser viser deler av prosessen. Samtidig er ikke alle tidlige prompts bevart, og noe dokumentasjon ble systematisert i etterkant. Jeg mener det er mer redelig å opplyse om dette enn å framstille prosjektet som om hver beslutning fulgte en perfekt plan. Transparens må balanseres mot behovet for å holde API-nøkler, brukertekst og personopplysninger utenfor offentlige logger.


### 5.3 Påvirkning på læring og kompetanse

Forelesningene ga meg et språk for erfaringer jeg allerede hadde gjort: context engineering forklarte hvorfor eksisterende krav og beslutninger må inn i KI-oppgaven; BMAD forklarte hvorfor Product Brief, PRD, UX og arkitektur må henge sammen; epics/stories og sprintplanlegging forklarte hvorfor mindre, verifiserbare arbeidsoppgaver reduserer risiko og kontekstpress. Jeg fikk også større forståelse for hvorfor arkitektur bør begrense utilsiktet kobling mellom funksjoner, og hvorfor tester og reviews bør følge implementeringen fortløpende.

Min viktigste kompetanseutfordring har vært å forstå noe av det KI foreslår, selv om jeg ennå ikke behersker selve programmeringen. Jeg har lært hva Git, Node.js, API-er og tester brukes til, men det er stor forskjell på å forstå begrepene og å kunne skrive eller feilsøke kode uten hjelp. Hurtig kodegenerering gjør dette skillet ekstra viktig. Jeg ønsker derfor å fortsette med grunnleggende programmeringsøving parallelt med KI-assistert utvikling.


### 5.4 Arbeidsmarkedet

Jeg tror KI vil gjøre rutinepregede kodeutkast og dokumentasjonsoppgaver raskere, mens arbeid med kravforståelse, sikkerhet, arkitektur, testing og etisk vurdering blir enda viktigere. Jeg forventer ikke at behovet for utviklere forsvinner, men at oppgavene endres. Min egen inngang til prosjektet har vært behovet fra lederrollen, ikke et mål om å konkurrere med erfarne utviklere i alle tekniske detaljer. Erfaringen viser meg verdien av domenekunnskap i utvikling, men også begrensningen ved å ha teknisk forståelse som ennå er under oppbygging.


### 5.5 Datasikkerhet og personvern

I en applikasjon som brukes til personalsituasjoner kan brukeren skrive navn, helseopplysninger eller andre identifikatorer. Jeg formulerte derfor prinsippet **«anonymiser identitet, ikke nødvendig kontekst»**. Dersom all kontekst fjernes, mister KI-svaret nytten; dersom personopplysninger sendes videre, oppstår en annen risiko. Løsningen bruker personvernkontroll i nettleseren og på serveren før KI-kall, samt begrensninger for lagring og logger.

Dette var vanskeligere enn jeg først trodde. Ordet «Dag» kan være et fornavn, men «dag» er også vanlig norsk. Tidlige navneheuristikker kunne derfor blokkere ufarlig tekst. Ved en senere feiltest 18. november stoppet serveren spørsmålet «Hvordan spør jeg?» fordi «Hvordan» ble tolket som et personnavn. Testen gikk rødt, og jeg valgte å endre den delte navnedetektoren i stedet for å omskrive spørsmålet. Etter rettelsen besto både negative spørsmålstester og positive navnetester, blant annet «Knut spør …».

Jeg ser dette som et etisk og funksjonelt avveiningsproblem, ikke bare en regex-feil. For strenge filtre kan hindre brukeren i å få hjelp; for svake filtre kan sende informasjon videre som aldri burde forlatt systemet. En god testpakke må derfor kontrollere både falske positive og falske negative. Automatiske regler kan redusere risikoen, men kan ikke garantere anonymitet.

Tilgangsstyring krever tilsvarende forsiktighet. Den faktiske Supabase-databasens metadata ble først undersøkt skrivebeskyttet: Alle ti tabeller i public hadde RLS aktivert, og samtalehistorikken hadde fire eierskapsbaserte policyer. Den første HTTP-testen med to fiktive brukere brukte derimot en håndskrevet Auth/PostgREST-etterligning. Selv om den ble grønn, kunne jeg ikke hevde at den beviste ekte autentisering. Derfor utvidet vi kvalitetssjekken 20. november med en **disponibel, ekte lokal Supabase-instans**: GoTrue opprettet Alice, Bob og en administrator, og den faktiske serveren brukte innlogging, tokenfornyelse og PostgREST med prosjektets RLS-policyer. Forsøk på å lese, endre eller slette andres historikk, forfalske eierskap eller oppnå adminrolle gjennom brukerredigerbare metadata ble avvist. Dette ga et vesentlig sterkere bevis, men ingen automatisk garanti for at produksjonsprosjektet er konfigurert identisk. Jeg lot derfor produksjonsdatabasen være urørt. Supabases tidligere varsel om deaktivert kontroll av kompromitterte passord er også fortsatt et åpent driftsfunn.

Utvikling og testing bør baseres på syntetiske saker uten navn eller identifiserbare opplysninger om virkelige ansatte. KI-assistenter kan få tilgang til kode, dokumentasjon og promptinnhold, så det er viktig å kontrollere hva som sendes eksternt og aldri legge hemmeligheter i Git. En teknisk navneblokkering er ikke det samme som en garanti mot indirekte identifisering. Jeg må derfor vurdere både tekniske kontroller og tydelig informasjon til brukeren.


## 6. Teknologiske implikasjoner


### 6.1 Kodekvalitet og vedlikehold

En ulempe ved min framgangsmåte er at arkitekturen ble delvis formet av mange små endringer. Frontend og backend har fortsatt store fellesfiler og er ikke fullt isolert i vertikale slices. Jeg flyttet noen avgrensede deler til egne klient- og servermoduler, og CSS ble delt i kjerne, responsive regler og overstyringer. Det ga bedre struktur uten risikoen ved en stor omskriving tett på innlevering, men løste ikke oppbyggingen av historiske kaskaderegler. En CSS-gjennomgang i november viste hvor vanskelig det kan bli å vedlikeholde mange lag med overstyringer. Vi fant blant annet gjentatte regler for samme mobilkomponent og store mengder `!important`. KI foreslo opprydding, men jeg ville ikke godta omfattende sletting bare fordi den tekniske testen ble grønn. Vi fjernet først dokumenterte duplikater og helt overstyrte regler, beholdt rekkefølgen i stilarkene og sammenlignet faktisk visning i Chrome. Antall `!important` ble redusert fra 845 til 694. Den viktigste lærdommen var ikke prosentvis reduksjon av kode, men at vedlikehold og brukervennlighet må vurderes sammen: En kortere CSS-fil er ikke bedre hvis mobilvisningen blir ødelagt.

Vi flyttet også avgrensede deler fra store JavaScript-filer til egne moduler. En eksisterende test feilet da kode ble flyttet, selv om funksjonen virket som før; testen måtte følge den nye strukturen i stedet for å tvinge koden tilbake. Jeg ble mer bevisst på at en test må kontrollere ønsket atferd, ikke bare hvor koden står. Dersom jeg startet på nytt, ville jeg definert enklere modulgrenser og tydeligere visuelle kontrollpunkter tidligere.

KI-generert kode kan være ryddig og lesbar når oppgaven er godt avgrenset, men mange raske iterasjoner kan føre til duplisering og utilsiktede avhengigheter. Jeg oppdaget dette særlig i CSS og de store JavaScript-filene. Opprydding og moduluttrekk forbedret strukturen, men løste ikke all teknisk gjeld. Langsiktig vedlikehold krever at en annen utvikler kan forstå hvorfor noe er gjort, og at det finnes tester som avslører konsekvensene av endringer.


### 6.2 Standarder og beste praksis

En språkmodell kan gi overbevisende formuleringer selv når premissene er feil. Jeg har derfor forsøkt å skille mellom faktiske opplysninger, antakelser og avklaringsbehov. KI-en skal gi konkrete forslag som lederen faktisk kan bruke, men ikke konkludere om diagnose, skyld eller juridisk rett uten tilstrekkelig grunnlag. SOURCEBANK er en kuratert kildebank; kontrollert nettsøk kan supplere den ved behov. Særlig juridiske påstander må støtte seg på riktig lov, myndighetskilde eller relevant tariffområde, ikke bare en generelt troverdig lenke.

I sluttfasen gikk jeg fra å kontrollere om funksjonene finnes til å spørre hvordan de feiler. Vi laget blant annet tester som starter den faktiske Express-serveren med lokale testverdier, sender uinnloggede API-kall og kontrollerer at interne repo-filer ikke publiseres. En separat test kjøres mot to syntetiske brukere i en isolert lokal database-etterligning. Disse testene er mer representative for HTTP-flyten enn bare å lete etter en bestemt kodestreng.

Vi simulerte deretter 503-feil, rate limiting (429), ugyldig KI-output og brudd i forbindelsen til en lokal OpenAI-etterligning. Appens API skal da gi kontrollerte, generiske feilkoder uten å videreformidle leverandørens interne detaljer. Det var i denne testserien vi også fant den feilaktige blokkeringen av «Hvordan». Etter rettelsene besto Quality Gate 18. november med **35 automatiske deltester og 0 funn i npm audit** på revisjonsgrenen. Jeg skiller dette fra den tidligere feilende kjøringen på main og fra de historiske live KI-testene.

KI følger ikke nødvendigvis beste praksis for sikkerhet, feilkontrakter eller universell utforming. Derfor har jeg prøvd å stille eksplisitte krav til blant annet tilganger, validering, kilder og bruk av tastatur. Også testene må valideres: En dårlig test kan gi feil beslutningsgrunnlag selv når den kjører uten tekniske feil.


### 6.3 Fremtidig utvikling

Et siste eksempel på en beslutning jeg tok om å begrense omfanget, er LIVE/tale. Vi har eksperimentert med norsk transkribering, blant annet problemer med «send» som ble «fem» og «hen» som ble «han». Fordi feiltranskribering kan endre innholdet i en sensitiv personalsituasjon, ligger denne funksjonen fremdeles kun på separat pilotgren og pilot-Render. Den er **ikke** en del av den ferdige produksjonsleveransen. FR-23 om mulig direkte tekstinngang er dessuten en annen hypotese enn tale og skal ikke blandes sammen med den.

Den isolerte testen med ekte lokal Supabase Auth/PostgREST og to innloggede brukere er nå gjennomført. **Før ordinær bruk** ville jeg likevel prioritert kontroll av den faktiske skybaserte konfigurasjonen, bredere og uavhengig brukertesting, fysisk mobil- og utskriftstest, ytterligere faglig gjennomgang av KI-råd og kildegrunnlag og vurdering av intern KI for miljøer med strenge sikkerhetskrav. Jeg ville ikke utvidet med flere funksjoner før disse kontrollene var gjennomført.

Jeg tror videre utvikling med KI vil øke behovet for gode modulgrenser, sporbare beslutninger og kontroll av dataflyten. Før jeg legger til ny funksjonalitet, vil jeg prioritere uavhengig kvalitetssikring av faglige råd, testing av faktisk driftskonfigurasjon og en enklere arkitektur. For bruk i miljøer med strenge sikkerhetskrav bør en framtidig lokal eller intern KI-løsning vurderes; den er ikke implementert som ferdig løsning i dette prosjektet.


## 7. Konklusjon og læring


### 7.1 Viktigste lærdommer

1. Jeg må eie produktmålene og kunne forklare dem, selv når KI utfører mye av implementeringen.
2. Grønn test betyr at en avgrenset egenskap er kontrollert, ikke at hele systemet er godkjent.
3. Personvern, kildekritikk og sikkerhet må bygges inn tidlig.
4. Endringer må kunne spores gjennom kode, tester og begrunnede beslutninger.
5. Godt sluttprodukt er ikke det samme som flest mulig funksjoner.


### 7.2 Hva ville jeg gjort annerledes?

Jeg ville etablert Git og strukturert kravarbeid tidligere, modularisert gradvis, planlagt reelle brukerprøver før flere avanserte funksjoner og definert negative testtilfeller fra starten. Jeg ville også skilt enda tydeligere mellom brukerens produktmål og KI-assistentens forslag til teknisk løsning. Det er mitt ansvar å beslutte om ny funksjonalitet gir tilstrekkelig verdi til å forsvare ekstra sikkerhets- og vedlikeholdsarbeid.

Jeg ville etablert tydelige akseptansekriterier, små utviklingsoppgaver, code review-rutiner og avgrensninger før funksjonsomfanget ble stort. Som solostudent ville jeg også lagt opp til flere eksterne tilbakemeldinger tidligere, slik at jeg ikke ble min egen eneste vurderingsinstans.


### 7.3 Anbefalinger

Start med ett tydelig behov og en liten fungerende versjon. Bruk Git fra første dag. Be KI forklare løsninger og alternative veier, ikke bare skrive mest mulig kode. Gjennomfør negativ testing og test i faktisk nettleser. Skille mellom mock-svar, ekte KI-svar og faktiske databasetester, og vær åpen om hva hvert testnivå beviser. Ta vare på sentrale prompts, beslutninger og feilsituasjoner fortløpende; rekonstruer ikke en perfekt prosess i ettertid.


### 7.4 Personlig refleksjon (individuelt)

Som eneste student startet jeg i praksis uten erfaring med utviklingsverktøy og med svært lite kodekunnskap. Jeg opplevde ofte ChatGPT som mitt «andre gruppemedlem» – en jeg kunne spørre om alt det jeg ikke engang visste hvordan jeg skulle begynne med. Det gjorde det mulig å gå fra en idé til en fungerende applikasjon. Læringskurven var bratt, og jeg ble ofte overrasket over hvor mye som måtte læres bare for å forstå hva KI hadde gjort. Den viktigste rollen min ble å stille krav, teste det jeg så og våge å være kritisk til svarene.

Jeg er særlig opptatt av at teknologien skal gjøre vanskelige menneskelige samtaler bedre, ikke overta beslutningene. Min erfaring fra arbeidslivet hjelper meg å se slike behov, selv om jeg ennå ikke kan kode løsningen selv. Jeg merket også at jeg kunne bli utålmodig når KI foreslo nye runder med forbedringer i stedet for å fullføre den konkrete oppgaven. Etter hvert måtte jeg være tydeligere på hva som faktisk var godt nok, når vi skulle stoppe, og hvilke feil som måtte prioriteres. Mitt viktigste fremskritt er derfor ikke at jeg har blitt programmerer på et semester, men at jeg har lært å styre et KI-assistert prosjekt, stille bedre spørsmål og være mer kritisk til både forslag og testresultater.


## 8. Vedlegg (valgfritt)

- [GitHub-repo](https://github.com/IBE160-2026/G46-nilsen) – gjeldende leveransegren er `main`; PR #12 og #14–#20 er innlemmet. Se [prosjektstatus](PROSJEKTSTATUS.md) og [dokumentasjonsrevisjon](DOKUMENTASJONSREVISJON-2026-11-25.md).
- [Product Brief](../product-brief.md), [PRD](bmad/PRD.md), [arkitektur](bmad/ARCHITECTURE-BMAD.md) og [Epics/Stories](bmad/EPICS-AND-STORIES-BMAD.md).
- [KI-logg](ai/AI-LOGG-SAMTALESTOTTE.md), [testplan](ai/AI-TESTPLAN.md) og [testbevis](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md).
- [Ekte lokal Auth/PostgREST/RLS](ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md), [Chrome-reise](ai/SENSOR-KJERNEFLYT-E2E-2026-11-20.md), [mobil/PDF](ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md).
- [Teknisk CSS-/app-/serverrevisjon](TEKNISK-REVISJON-CSS-APP-SERVER-2026-11-18.md).

**Før innlevering:** Kontroller at studentopplysninger, eget språk, kildehenvisninger, personlig vurdering og alle faktiske forhold stemmer. Valg av endelig Git-commit og Canvas-frist må bekreftes. Status for repo og tester er samlet i [prosjektstatus](PROSJEKTSTATUS.md); ingen ny utviklingsrunde er nødvendig bare for å fullføre rapporten.

**Omtrentlig ordantall for dette utkastet:** ca. 5072 ord inkludert overskrifter, vedlegg, URL-tekst og metadata (whitespace-basert opptelling, ikke Canvas-telling). Skolens mal oppgir forventet 3000–5000 ord avhengig av gruppestørrelse og kompleksitet. For soloprosjektet bør faglig relevante deler dekkes uten å dikte opp gruppesamarbeid.
