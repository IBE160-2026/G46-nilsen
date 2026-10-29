# Refleksjonsrapport – Samtalestøtte

**Emne:** IBE160 Programmering med KI  
**Prosjekt:** Samtalestøtte  
**Student:** Cecilie C. Nilsen  
**Student-ID:** [fyll inn]  
**Gruppestørrelse:** 1  
**Status:** Arbeidsutkast – oppdatert med pilot og produksjonssetting v20.11.0  
**Ordantall:** må kontrolltelles ved sluttredigering

---

## 1. Innledning og gruppeinformasjon

Denne rapporten reflekterer over utviklingen av **Samtalestøtte**, en webapplikasjon for ledere som skal forberede og øve på krevende medarbeidersamtaler. Jeg har gjennomført prosjektet alene. Det betyr at jeg både har hatt produktansvar, gjort faglige og etiske avgrensninger, styrt KI-verktøyene, testet løsningen og hatt ansvar for Git/GitHub, dokumentasjon og ferdig leveranse.

Utgangspunktet for prosjektet var et praktisk problem: krevende medarbeidersamtaler krever ofte både tydelighet, skjønn og god kommunikasjon, men ledere får ikke nødvendigvis praktisk trening i hvordan slike samtaler faktisk kan gjennomføres. Målet ble derfor å lage et verktøy som kan hjelpe en leder med å strukturere situasjonen, formulere en åpning, stille gode spørsmål, forberede seg på mulige reaksjoner og øve gjennom en simulert samtale.

En viktig produktidé var at brukeren ikke skulle måtte kunne prompt engineering for å få nyttig støtte. I stedet for å starte med et tomt chatfelt er Samtalestøtte bygget som en domenespesifikk arbeidsflyt: tema og undertema gir kontekst, personvern og sikkerhetsgrenser ligger inne i løsningen, og brukeren kan gå fra forberedelse til oppfølging, simulering og refleksjon uten å bygge opp situasjonen på nytt.

Et annet bevisst valg var å styre kunnskapsgrunnlaget. Løsningen bruker en kuratert SOURCEBANK som førstevalg, med blant annet myndighetskilder, regelverk og forskningsbasert kunnskap. Kontrollert nettsøk brukes som supplement, ikke som en erstatning for kildekritikk. For meg ble dette en viktig forskjell fra en åpen chatbot: det handler ikke bare om hva modellen kan svare på, men hvilke rammer den må svare innenfor og hvilke kilder som skal prioriteres for ulike typer påstander.

Dette ble etter hvert en tydeligere differensiering fra både generelle KI-chatboter, statiske HR-maler og ordinær ledertrening.

Samtalestøtte er ikke ment å være et HR-system, journalsystem eller beslutningsverktøy. En sentral del av prosjektet har vært å definere hva KI-en **ikke** skal gjøre. Den skal blant annet ikke stille diagnoser, fastslå skyld, anta motiv eller gi sikre juridiske konklusjoner. Den skal støtte lederens refleksjon, ikke erstatte lederens ansvar.

Prosjektet utviklet seg betydelig gjennom semesteret. Det startet som en relativt enkel webprototype med temaer og skjema, men ble etter hvert en mer kompleks løsning med frontend og backend, språkmodell, personverngateway, autentisering, historikk, roller, administrasjon, samtalesimulering, kildebank, modellstyring, kostnadslogging og flere nivåer av testing. Dette gjorde prosjektet mer krevende enn jeg først hadde sett for meg, men ga samtidig et godt grunnlag for å lære hva KI-assistert utvikling faktisk krever i praksis.

---

## 2. Utviklingsprosessen

### 2.1 Prosjektoversikt og arbeidsmåte

Utviklingsprosessen har ikke vært lineær. Den kan best beskrives som en gjentatt syklus:

**behov → KI-dialog → forslag → implementering → testing → vurdering → korrigering → ny test → dokumentasjon**

I starten var arbeidet mer utforskende. Jeg beskrev ønsket funksjon eller visuell løsning, fikk forslag fra KI og testet resultatet. Etter hvert som prosjektet vokste, ble denne arbeidsformen for lite kontrollert. En endring ett sted kunne påvirke noe annet som allerede fungerte, og KI-verktøyet kunne tolke et ønske bredere enn jeg hadde ment.

Jeg begynte derfor å jobbe mer eksplisitt med krav og avgrensninger. Godkjente designvalg skulle ikke endres uten at jeg ba om det. Større endringer skulle stoppes etter implementering slik at jeg kunne teste og godkjenne før neste steg. Dette var en viktig endring i min egen rolle. Jeg gikk gradvis fra å være en bruker som ba KI om å «lage noe» til å styre en utviklingsprosess med tydeligere krav, kontrollpunkter og regresjonstester.

Dette henger tett sammen med skillet i pensum mellom enkel «vibe programming» og mer styrt agentisk utvikling. Etter hvert ble ikke enkeltprompten det viktigste. Det viktigste ble hvilken kontekst KI-en fikk: krav, eksisterende arkitektur, låste designvalg, testresultater og hva som uttrykkelig ikke skulle endres. Jeg opplevde derfor context engineering som mer treffende for arbeidsmåten enn bare prompt engineering.

BMAD ble ikke brukt som en ferdig plan før første kode. Den tidlige fasen var mer utforskende, og en fungerende prototype begynte å ta form før BMAD-artefaktene var fullt etablert. Da prosjektet vokste i omfang og kompleksitet, ble BMAD brukt til å strukturere og stramme inn arbeidet. Product Brief tydeliggjorde problem, målgruppe og ambisjonsnivå, PRD konkretiserte funksjonelle og ikke-funksjonelle krav, arkitekturdokumentet beskrev sammenhengen mellom frontend, backend, KI, database og eksterne tjenester, og Epics/Stories gjorde det mulig å knytte funksjoner til konkrete leveranser.

Denne rekkefølgen er viktig for å forstå sporbarheten i prosjektet. Den synlige Git-historikken viser kodecommits før Product Brief og flere BMAD-dokumenter, men utviklingen hadde også startet lokalt før Git/GitHub var fullt etablert. Jeg kan derfor ikke bruke de første commitdatoene som et fullstendig bevis på den nøyaktige rekkefølgen i det aller tidligste arbeidet. Det jeg kan dokumentere, er at BMAD-formaliseringen skjedde mens prosjektet allerede var under utvikling, og at den deretter påvirket videre arbeid ved å gjøre krav, scope, testbevis og beslutninger mer eksplisitte.

Mot slutten ble det laget tydelig sporbarhet fra behov og PRD-krav til arkitektur, Epic/Story, implementasjon og testbevis. For meg ble derfor BMAD ikke et bevis på en perfekt lineær prosess, men et verktøy for å få kontroll på et prosjekt som allerede hadde begynt å vokse. Det er også mer i tråd med den faktiske læringen i prosjektet enn å framstille planleggingen som om alt var bestemt før første prototype.

### 2.2 Organisering som soloprosjekt

Siden jeg var alene på gruppen, hadde jeg ingen tradisjonell arbeidsdeling mellom gruppemedlemmer. Det gjorde noen ting enklere, fordi jeg ikke måtte koordinere beslutninger med andre. Samtidig betydde det at jeg heller ikke hadde en annen student som kunne oppdage svakheter i løsningene mine eller utfordre vurderingene mine.

Jeg brukte derfor dokumentasjon og testing som en form for strukturert motstand mot egne antakelser. Git-historikken, AI-loggen, testplanene og regresjonstestene ble viktige fordi de tvang meg til å gjøre endringer etterprøvbare. Dette samsvarer godt med pensumets framstilling av Git som mer enn bare lagring av kode i en agentisk arbeidsflyt: når KI kan gjøre store endringer raskt, blir versjonskontroll også et sikkerhetsnett for å inspisere, avgrense og eventuelt reversere endringer.

Jeg brukte i hovedsak én aktiv arbeidsgren og små commits fremfor en omfattende Pull Request-prosess. Leveringsgrenen i det endelige skolerepoet er `main`. Det er en svakhet sammenlignet med en gruppebasert arbeidsflyt med branches, code review og PR-er, men samtidig et pragmatisk valg for et soloprosjekt. Jeg forsøkte å kompensere for manglende peer review gjennom hyppige tester, dokumenterte beslutninger og eksplisitt gjennomgang av KI-genererte endringer.

Utviklingen startet før Git/GitHub var fullt etablert. Derfor ble flere tidlige versjoner lagt inn i Git på kort tid senere. Dette gjør at de første commitdatoene ikke fullt ut viser når selve utviklingsarbeidet fant sted. Jeg har valgt å dokumentere dette åpent fremfor å omskrive historikken i ettertid.

### 2.3 Bruk av KI i utviklingen

ChatGPT/OpenAI har vært brukt som utviklingsassistent gjennom store deler av prosjektet. KI-en har hatt flere roller:

- idé- og sparringspartner
- programmeringsassistent
- feilsøkingspartner
- testgenerator
- dokumentasjonsstøtte
- kvalitetssikringsverktøy

Det er likevel viktig å skille mellom at KI skrev mye av koden og at KI bestemte produktet. Produktvalg, prioriteringer, faglige grenser og aksept av løsninger har vært mitt ansvar.

Et tydelig eksempel er utviklingen av personvernløsningen. KI kunne generere regler som oppdaget navn og andre identifikatorer, men de første variantene ble for aggressive. De kunne stoppe relevant kontekst eller tolke vanlige ord som personnavn. Jeg måtte derfor presisere prinsippet: **anonymiser identitet, ikke nødvendig kontekst**.

Her ble prompt engineering alene for snevert som forklaring. For å få et stabilt resultat måtte KI-en få mer enn en formulert bestilling: eksisterende regler, tidligere feil, konkrete regresjonscaser og ønsket balanse mellom personvern og bevart kontekst måtte følge oppgaven. Det gjorde kvaliteten på konteksten rundt oppgaven minst like viktig som selve prompten.

Et annet eksempel er designarbeidet. KI kunne raskt produsere visuelle endringer, men endret noen ganger mer enn jeg hadde bedt om. Det førte til at jeg begynte å formulere tydeligere regler om hva som var «låst» design og hva som kunne endres.

Dette samsvarer med en sentral erfaring fra agentisk utvikling: utviklerens jobb flyttes delvis fra å skrive hver kodelinje selv til å formulere gode krav, inspisere endringer, teste resultatet og avgjøre om løsningen faktisk er riktig. Pensum beskriver også editorens rolle i en agentisk arbeidsflyt som mer orientert mot gjennomgang av diffs, tester og agentens endringer enn bare manuell skriving av kode. Det stemmer godt med hvordan min egen arbeidsform utviklet seg. Git fikk derfor en rolle som sikkerhetsmekanisme, fordi små commits gjorde det mulig å se hva som var endret og gå tilbake dersom en KI-endring skapte problemer.

### 2.4 Teknologi og verktøy

Prosjektet bruker en vanlig webstakk:

- HTML, CSS og JavaScript i frontend
- Node.js og Express i backend
- Supabase for autentisering og datalagring
- OpenAI/OpenRouter som KI-provider
- Git og GitHub for versjonskontroll
- Render som publisert testmiljø

I tillegg brukes JSON-baserte testbanker, Markdown-dokumentasjon og Node-baserte tester.

En grunn til at denne teknologistakken fungerte godt i KI-assistert utvikling er at teknologiene er godt dokumentert og har tydelige grensesnitt. Samtidig lærte jeg at «vanlig teknologi» ikke automatisk betyr enkel arkitektur. Når autentisering, database, språkmodell, personvern, historikk, logging, roller og simulator skal virke sammen, blir systemet komplekst selv om hver enkelt komponent isolert sett er kjent.

Mot slutten ble det også lagt til en separat lokal sensordemo. Den bruker samme frontend, men erstatter Supabase og ekte KI-kall med deterministiske mock-svar. Hensikten er ikke å simulere kvaliteten på den ekte modellen, men å gjøre kjerneflyten lokalt kjørbar uten studentens API-nøkler eller eksterne infrastruktur.

---

## 3. Viktige utviklingsfaser

### 3.1 Fra skjema til samtalepartner

De første versjonene var mer skjemabaserte enn dagens løsning. Brukeren måtte fylle inn flere felt før systemet kunne hjelpe. Jeg opplevde dette som tungvint og lite naturlig.

Løsningen ble derfor gradvis forenklet til færre inputfelt og mer bruk av fritekst. Tema og undertema gir kontekst, mens KI-en kan stille avklaringsspørsmål når det faktisk er nødvendig. Dette gjorde produktet mindre mekanisk og mer likt en samtalepartner.

Denne endringen er et godt eksempel på at første tekniske løsning ikke nødvendigvis er riktig produktløsning. KI kunne lage skjemaet raskt, men brukervurderingen måtte fortsatt gjøres av meg.

### 3.2 Fra enkel KI til kontrollert KI

Tidlige KI-svar kunne være språklig gode, men likevel faglig problematiske. En språkmodell kan formulere seg overbevisende også når den bygger på antakelser.

Det ble derfor utviklet eksplisitte regler for å skille mellom:

- fakta brukeren faktisk har oppgitt
- usikkerhet
- tolkning
- områder som krever mer informasjon

Systemprompt og responskontrakt ble gradvis strengere. KI-en skal ikke diagnostisere, fastslå motiv eller skyld, eller konstruere faktiske hendelser som ikke står i casen. Ved sensitive HR- eller juridiske temaer skal svaret markere begrensningene og vise når annen fagstøtte bør brukes.

### 3.3 Personvern som arkitektur, ikke popup

Personvern begynte som en påminnelse i brukergrensesnittet. Etter hvert ble det tydelig at dette var utilstrekkelig. Dersom et nytt felt eller API-endepunkt ble lagt til uten samme kontroll, kunne data gå rundt frontendregelen.

Løsningen ble derfor endret til forsvar i dybden:

1. lokal kontroll i brukergrensesnittet
2. server-side kontroll før sentrale KI-kall
3. dataminimering i tekniske logger
4. retensjonsregler
5. brukerens kontroll over historikk, eksport og sletting

Et konkret testproblem illustrerte hvor vanskelig dette er. Ordet «dag» er vanlig norsk, men «Dag» kan også være et navn. En første forbedring av navnedeteksjonen introduserte en ny regex-feil. Testen `Dag har kommet for sent` avslørte at KI-generert kode ikke håndterte dette korrekt. Løsningen ble rettet, og hele personvernpakken ble kjørt på nytt.

Dette ble et av de tydeligste eksemplene på hvorfor KI-generert kode må kvalitetssikres, også når selve endringen virker liten.

### 3.4 Samtalesimulatoren

Simulatoren startet som en enkel idé: KI skulle spille medarbeider. I praksis ble dette en av de mest komplekse delene av prosjektet.

Simulatoren måtte:

- holde riktig rolle
- reagere realistisk
- huske samtalekontekst
- unngå å bli en coach midt i rollespillet
- unngå å dikte opp diagnoser eller private detaljer
- gi brukeren mulighet til å avslutte og reflektere

Testing viste blant annet at KI-responsene kunne bli for perfekte eller for samarbeidsvillige. I en treningssituasjon er det ikke alltid realistisk. Det førte til strengere regler og egne simulator-tester.

Det tekniske og pedagogiske problemet var derfor ikke bare å få KI-en til å svare, men å få den til å svare på en måte som gjør øvelsen nyttig.

---

## 4. Utfordringer og hvordan de ble løst

### 4.1 KI kunne endre mer enn bestilt

En gjentakende utfordring var at KI tolket et avgrenset ønske bredt. En visuell endring kunne påvirke andre komponenter, eller en feilretting kunne endre kode som allerede fungerte.

Løsningen ble strengere endringskontroll:

- avgrense oppgaven tydelig
- behandle godkjent design som låst
- teste etter endringer
- bruke små commits
- ikke fortsette automatisk med neste større endring

Dette lærte meg at god KI-styring ikke bare handler om gode prompts. Det handler også om å styre **omfanget av handlingen**.

### 4.2 Tester kan også ta feil

En viktig erfaring kom fra golden-testingen av KI-svar. Målet var å lage representative caser med en eksplisitt fasit. Hver case fikk maskinelle kontrollpunkter, MÅ-krav, BØR-krav og kritiske feil.

Den første kjøringen kunne se overbevisende ut fordi alle casene ble markert grønne. Manuell gjennomgang viste imidlertid at rapporten ikke viste nok av KI-svaret til å kontrollere hele fasiten. Rapportgeneratoren måtte derfor bygges ut.

Senere fant testene flere interessante feil:

- ordet «skyld» kunne gi kritisk utslag selv når KI-en eksplisitt sa at skyld **ikke** skulle fastslås
- `lat` ble funnet som delstreng i `arbeidsrelatert`
- en Livssituasjoner-case var teknisk grønn, men testet egentlig prestasjon/sikkerhet mer enn Livssituasjoner
- en kilde kunne være troverdig, men likevel ikke støtte akkurat den påstanden modellen koblet den til

Dette endret måten jeg tenkte om kvalitetssikring på. Målet er ikke å få en test grønn. Målet er at testen måle det den påstår å måle.

Arbeidsformen ble derfor:

**KI-svar → automatisk kontroll → menneskelig kontroll → årsaksanalyse → rett riktig lag → regresjonstest → ny verifisering**

Etter kalibrering ga siste verifiserte golden-kjøring mot GPT-5.6 Luna 9/9 OK, uten kritiske eller tekniske avvik. Jeg ser likevel ikke dette som et bevis på at modellen alltid vil svare perfekt. Det er et bevis på at den besto ni definerte, representative kontrollcaser på det tidspunktet testen ble kjørt.

Etter faglærers tilbakemelding ble golden-banken senere utvidet til 21 caser. Alle ni hovedtemaer har nå minst to caser, og risikoområdene mobbing/trakassering og avslutning av arbeidsforhold har ekstra dekning. Den utvidede banken ble deretter kjørt live mot GPT-5.6 Luna. Det maskinelle resultatet var 19 OK, 2 BØR SJEKKES, 0 kritiske avvik og 0 tekniske feil. De to gule casene ble manuelt kontrollert mot den eksplisitte MÅ-/BØR-fasiten. Begge traff de faglige hovedkravene; flagget kom av at modellen ikke satte `Avklaring` til ja selv om svaret ellers inneholdt relevante avklarende kontrollpunkter og en forsvarlig videre prosess. Jeg valgte derfor å dokumentere resultatet som 19 maskinelt OK + 2 manuelt akseptert, i stedet for å endre testen bare for å få 21 grønne. Det er et konkret eksempel på at målet med testingen ikke er grønnest mulig rapport, men å finne ut om svaret faktisk er godt nok.

Jeg presiserte også at den manuelle fasiten er laget av meg som prosjekteier med KI-støtte og kildegrunnlag, ikke av en uavhengig ekspert. Ved videre validering ville jeg derfor brukt ulik fagkompetanse etter hva som vurderes, for eksempel samtalefag/organisasjonspsykologi for samtaleteknikk og arbeidsrett/HMS for formelle spørsmål.

### 4.3 Autentisering versus testbarhet

Automatiserte KI-tester møtte et praktisk problem da serverendepunkter krevde autentisering. En enkel løsning kunne vært å svekke eller fjerne autentisering under testing, men det ville redusert sikkerheten i produksjonskoden.

I stedet ble det laget en eksplisitt test-bypass som bare er aktiv når serveren kjører med `NODE_ENV=test` og `TEST_AUTH_BYPASS=1`.

Denne løsningen illustrerer et viktig prinsipp: testbarhet må bygges uten å gjøre produksjonsløsningen svakere.

### 4.4 Kjørbarhet for sensor

En annen utfordring er at den ekte applikasjonen er avhengig av Supabase og KI-provider. Det er uheldig dersom en sensor må ha tilgang til studentens nøkler eller eksterne kontoer for å få prosjektet til å starte lokalt.

Derfor er det lagt til en separat `npm run demo`-modus med deterministiske mock-svar. Demoen bruker samme frontend og kan vise brukerflyten uten `.env`, API-nøkkel eller database.

Dette er bevisst skilt fra ekte KI-testing. En mock-demo viser kjørbarhet og grensesnitt, men sier ingenting om den faktiske språkmodellens kvalitet.

Under sluttgjennomgangen av kjørbarhet oppdaget jeg også en konkret serverfeil: allowlisten inneholdt bilder under `assets/images/`, men serverruten var utformet for ett path-segment. I stedet for å anta at deployen oppførte seg riktig, ble ruten korrigert og det ble laget en integrasjonstest som starter den ekte serveren i testmodus og kontrollerer både tillatte frontend-assets og at interne filer fortsatt er blokkert. Dette ble et nytt eksempel på at arkitekturgjennomgang kan avdekke reelle funksjonsfeil, ikke bare kodeestetikk.

---

## 5. Kritisk vurdering av KI-bruken

### 5.1 Fordeler

Den største fordelen med KI i dette prosjektet har vært tempo. Jeg har kunnet utvikle funksjoner jeg ikke ville hatt kapasitet til å skrive fra bunnen av alene på samme tid.

KI var særlig nyttig til:

- å foreslå kode
- forklare feil
- lage testcaser
- foreslå arkitektur
- hjelpe med dokumentasjon
- oversette produktkrav til tekniske oppgaver
- identifisere risiko som burde testes

KI gjorde det også lettere å utforske flere alternativer. Jeg kunne be om en løsning, teste den, forkaste den og prøve en ny variant uten at hvert eksperiment krevde full implementeringstid.

### 5.2 Ulemper og risiko

Den viktigste ulempen er at KI kan produsere feil som ser plausible ut. Det gjør code review og testing til en nødvendig del av KI-bruken, ikke et valgfritt siste steg. Dette passer direkte med pensumets egen plassering av code review og quality som en del av utviklingssyklusen etter implementering.

Det skjedde både i produksjonskode og i testkode. Regex-feilen i personvernet er et godt eksempel. Et annet er golden-testen som feilaktig tolket `lat` inne i `arbeidsrelatert` som en kritisk karakteristikk av medarbeideren.

KI kan også gjøre prosjektet større enn nødvendig. Når det er lett å legge til funksjoner, er det også lett å miste kontroll over scope. Flere deler av Samtalestøtte, særlig admin, benchmark og logging, ble mer omfattende enn de første versjonene.

En tredje ulempe er at høy utviklingshastighet kan skape teknisk gjeld. I Samtalestøtte gjaldt dette først og fremst at `app.js` og `server.js` samlet mange ansvar. I sluttfasen valgte jeg derfor en begrenset modularisering i stedet for en full omskriving: statiske klientdata ble flyttet til `src/client-data.js`, serverens temakontrakt til `src/server/topic-contracts.js` og KI-skjemaene til `src/server/ai-schemas.js`. Dette reduserte `app.js` fra omtrent 3605 til 3411 linjer og `server.js` fra omtrent 1776 til 1600 linjer.

`styles.css` har også et høyt fysisk linjetall, men dette skyldes i stor grad at filen tidligere ble formattert mer lesbart med egenskaper på egne linjer. Jeg vurderer derfor ikke linjetallet alene som teknisk gjeld. Å komprimere CSS-en tilbake til én eller få linjer ville gjort kildekoden vanskeligere å lese uten å forbedre arkitekturen.

### 5.3 Hvordan prosjektet ville vært uten KI

Uten KI ville jeg sannsynligvis laget en langt mindre løsning. Jeg kunne fortsatt utviklet et enkelt webgrensesnitt med statiske temaer og tekstråd, men autentisering, dynamisk simulering, flerprovider-støtte, omfattende personvernkontroll og systematisk KI-testing ville vært vesentlig vanskeligere å gjennomføre innenfor samme tidsramme.

Samtidig ville mindre omfang også hatt en fordel: arkitekturen kunne blitt enklere, og jeg kunne hatt dypere manuell forståelse av en mindre kodebase.

Derfor er ikke konklusjonen at KI bare gjør utvikling bedre. KI gjør det mulig å bygge mer, men skaper samtidig behov for sterkere styring, testing og avgrensning.

### 5.4 Samlet vurdering

Min viktigste erfaring er at KI ikke erstatter utvikleransvaret. Den flytter ansvaret.

Når KI skriver koden, blir det enda viktigere å kunne:

- formulere hva som skal bygges
- forstå risikoen i endringen
- kontrollere hva som faktisk ble endret
- teste at endringen virker
- vite når KI-forslaget bør avvises
- dokumentere hvorfor løsningen ble valgt

Det viktigste læringsutbyttet i prosjektet har derfor ikke vært å lære flest mulig syntaksdetaljer. Det har vært å lære å styre et KI-assistert utviklingsløp på en måte som gir et etterprøvbart produkt.


### 5.5 Forholdet mellom pensum og min faktiske arbeidsmåte

I ettertid ser jeg en tydelig utvikling fra en mer intuitiv KI-bruk til en arbeidsmåte som ligner den agentiske prosessen beskrevet i pensum.

I starten var arbeidsmåten nærmere «beskriv ønsket resultat og se hva KI lager». Etter hvert ble arbeidet mer strukturert rundt:

- **context engineering:** gi KI relevant prosjektkontekst, tidligere beslutninger, testresultater og avgrensninger
- **prompt engineering:** formulere konkrete og kontrollerbare endringsoppgaver
- **BMAD:** holde sammen problem, krav, arkitektur, Epics/Stories og implementasjon
- **Git:** bruke små commits og historikk som kontroll- og sikkerhetsmekanisme
- **code review og testing:** behandle KI-generert kode som et forslag som må verifiseres

Det mest interessante er at jeg ikke lærte dette bare ved å lese om metodene. Behovet ble tydelig gjennom konkrete feil. Personvernregexen, foreldede tester, golden-testens falske positive og min egen regresjon under sluttmodulariseringen tvang frem en mer disiplinert arbeidsform.

På den måten ble teorien mest nyttig når den kunne forklare erfaringer jeg allerede hadde fått i prosjektet.

---

## 6. Etiske implikasjoner

Samtalestøtte behandler et område som krever særlig varsomhet. Selv om løsningen ikke skal brukes som journalsystem, vil brukere kunne beskrive reelle medarbeidere og sensitive situasjoner.

Den første etiske utfordringen er derfor personvern. Brukeren kan skrive mer enn systemet trenger. Personverngatewayen reduserer denne risikoen, men kan ikke garantere full anonymitet. Dette må kommuniseres tydelig.

Den andre utfordringen er autoritet. Et godt formulert KI-svar kan oppfattes som mer sikkert enn det faktisk er. Dette er særlig problematisk i saker om oppsigelse, helse, rus, trakassering og andre områder med juridiske eller menneskelige konsekvenser.

Derfor er produktets begrensninger en del av selve funksjonaliteten. KI-en skal ikke presenteres som fasit. Brukeren må fortsatt ha ansvar for vurderingen, og systemet skal peke videre til HR, juridisk rådgivning, BHT eller andre relevante fagpersoner når det er nødvendig.

Den tredje utfordringen gjelder logging og kvalitetssikring. For å forbedre systemet er det nyttig å vite hvilke modeller, kilder og funksjoner som brukes. Samtidig kan detaljert logging bli en ny personvernrisiko. Derfor ble teknisk KI- og kildestatistikk bevisst skilt fra bruker-ID og samtaletekst så langt som mulig.

Etisk KI-design handler dermed ikke bare om hva modellen sier. Det handler også om hvilke data som sendes, hva som lagres, hvem som får tilgang, hvor lenge data beholdes og hvordan systemets begrensninger kommuniseres.

---

## 7. Teknologiske implikasjoner

Prosjektet viser også noen mer generelle teknologiske konsekvenser av å bygge på eksterne KI-tjenester.

For det første oppstår leverandøravhengighet. Modeller, pris, API-format og tilgjengelighet kan endre seg. Derfor ble provider- og modellvalg abstrahert slik at systemet ikke er permanent bundet til én modell.

For det andre skaper KI-kall løpende kostnader. Det gjør tokenbruk og modellvalg til produktbeslutninger, ikke bare tekniske detaljer.

For det tredje kan bruk av web og eksterne tjenester være uegnet i lukkede eller sikkerhetskritiske miljøer. Dette er grunnen til at prosjektet dokumenterer en framtidig retning med intern KI, intern database og lokal kunnskapsbank/RAG. Denne arkitekturen er ikke implementert i dagens leveranse, og det er viktig å være tydelig på forskjellen mellom en framtidig arkitektur og funksjonalitet som faktisk finnes.

Til slutt viser prosjektet at KI-assistert utvikling kan produsere mye kode raskt, men at vedlikeholdbarhet må håndteres aktivt. Det relevante spørsmålet er ikke bare hvor mange fysiske linjer en fil har, men hvor mange ansvar og avhengigheter som er samlet i samme modul. En framtidig videreutvikling bør derfor prioritere videre separasjon av ansvar der det faktisk reduserer kobling og gjør endringer tryggere.

---

## 8. Hva jeg har lært

Jeg startet prosjektet med begrenset erfaring med å utvikle en full webapplikasjon med backend, autentisering, database og eksterne KI-tjenester.

Det viktigste jeg har lært er ikke at KI kan skrive kode. Det visste jeg allerede tidlig i prosjektet. Det viktigste er hvor mye arbeid som ligger mellom «KI har skrevet kode» og «jeg har en løsning jeg kan stå inne for».

Jeg har blitt bedre til å:

- beskrive krav mer presist
- dele store problemer i mindre steg
- skille produktproblem fra teknisk løsning
- bruke Git som dokumentasjon og sikkerhetsnett
- tolke testfeil i stedet for bare å forsøke å gjøre testen grønn
- skille feil i produksjonskoden fra feil i selve testen
- tenke på personvern og sikkerhet som arkitektur
- dokumentere avgrensninger ærlig
- stoppe funksjonsvekst når nytteverdien ikke forsvarer risikoen

Golden-testingen oppsummerer denne læringen best. Først var målet å få gode KI-svar. Etter hvert forsto jeg at jeg også måtte kunne vise **hvordan jeg vet at svarene er gode nok**, og samtidig kunne oppdage når selve vurderingsmetoden er feil.

---

## 9. Hva jeg ville gjort annerledes

Dersom jeg startet prosjektet på nytt, ville jeg etablert Git/GitHub fra første dag. Det ville gjort den tidlige utviklingen mer sporbar og redusert behovet for å rekonstruere deler av prosessen senere.

Jeg ville også innført en tydeligere modulstruktur tidligere. Det hadde vært enklere å splitte `app.js`, `server.js` og `styles.css` gradvis enn å gjøre det etter at filene var blitt store.

Videre ville jeg planlagt brukertesting tidligere. Prosjektet har mange automatiserte tester og mye teknisk kvalitetssikring, mens faktisk brukertesting kom sent. Mot slutten ble det derfor satt opp en liten pilot med ett felles, kort skjema for alle testpersoner. Utvalget er målrettet og lite, med rom for både vanlig helhetsvurdering, UX-blikk og innspill fra personer med relevant leder-/samtaleerfaring. Resultatene skal brukes deskriptivt og kvalitativt, ikke som statistisk dokumentasjon eller ekspertgodkjenning. For et produkt som først og fremst skal støtte mennesker i vanskelige samtaler, er faktisk brukeropplevelse minst like viktig som tekniske tester.

Jeg ville også vært strengere med scope tidligere. Muligheten til å bygge raskt med KI gjorde det fristende å legge til flere funksjoner. Noen av dem ga reell verdi, mens andre først og fremst økte kompleksiteten.

---

## 10. Anbefalinger for videre utvikling

Før Samtalestøtte eventuelt kunne brukes som ordinær virksomhetstjeneste, ville jeg prioritert:

1. mer omfattende brukertesting med faktiske ledere og et større, mer variert utvalg
2. modulering av frontend, server og stilark
3. formell sikkerhets- og personvernvurdering, inkludert nødvendige organisatoriske avklaringer
4. videre kontroll av faglige og juridiske kilder
5. kontrollert modellbenchmark med tydelig menneskelig vurderingsrubrikk
6. bedre automatisert ende-til-ende-testing av hele brukerflyten
7. vurdering av intern KI og lokal kunnskapsbase for miljøer med strengere sikkerhetskrav

Jeg ville ikke prioritert flere funksjoner før disse områdene er bedre løst.

---

## 11. Konklusjon

Samtalestøtte ble et større og mer komplekst prosjekt enn jeg først planla. Samtidig er det nettopp kompleksiteten som gjorde prosjektet lærerikt.

Den viktigste erfaringen er at KI-assistert programmering ikke reduserer behovet for kritisk vurdering. Den øker behovet for den. KI kan generere kode, tester, dokumentasjon og forslag raskt, men den kan også generere feil, dårlige antakelser og overbevisende svar som ikke holder faglig.

Prosjektet har derfor utviklet seg fra å handle om «hvordan kan KI hjelpe meg å bygge en app?» til «hvordan kan jeg styre, teste og dokumentere KI-assistert utvikling på en måte jeg kan stå inne for?».

Det er denne endringen jeg vurderer som mitt viktigste læringsutbytte fra IBE160.

---

## 12. Vedlegg og spor i repoet

Sentrale spor som underbygger refleksjonen:

- `product-brief.md`
- `docs/bmad/PRD.md`
- `docs/bmad/ARCHITECTURE-BMAD.md`
- `docs/bmad/EPICS-AND-STORIES-BMAD.md`
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md`
- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`
- `docs/ai/AI-TESTPLAN.md`
- `docs/ai/TEST-FASIT-OG-SPORBARHET.md`
- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md`
- `CHANGELOG.md`
- `tests/`
- Git-historikken

### Verifiserte testresultater som kan omtales i rapporten

- personvern: 33/33
- samtalesimulering: 24/24
- server-personvern: bestått
- UI-regresjon: bestått
- historikk-regresjon: bestått
- snakkeboble-regresjon: bestått
- clipboard-regresjon: bestått
- golden-schema: 9/9 hovedtemaer
- golden matcher-regresjon: bestått
- lokal sensor-demo-regresjon: bestått
- offentlige frontend-assets: bestått
- repo-struktur: bestått
- package-lock-konsistens: bestått
- siste verifiserte live golden-kjøring mot GPT-5.6 Luna: 21 caser, 19 OK, 2 BØR SJEKKES, 0 kritiske avvik og 0 tekniske feil; de to gule ble manuelt vurdert som faglig akseptable

**Sluttverifisering:** Hele den deterministiske `npm test`-pakken ble kjørt etter den kontrollerte modulariseringen og besto, inkludert UI-regresjon, sensor-demo, offentlige frontend-assets, repo-struktur og package-lock-konsistens. Etter at golden-banken senere ble utvidet til 21 caser og brukeradvarsler/testdokumentasjon ble oppdatert, ble hele pakken kjørt på nytt 26.10.2026 og besto fortsatt. Golden-schemaet verifiserte samtidig 21 caser, 9/9 hovedtemaer, minst to caser per tema, ekstra risikodekning og dokumentert fasitopphav. Senere samme dag ble det gjort ytterligere mindre kodeendringer i flerfaglig runtime og retensjon for brukertestdata. Disse ble derfor kontrollert på nytt. Den eneste nye feilen var i repo-strukturtesten, som ikke kjente igjen lærerens nye `CLAUDE.md` og `.claude/` som tilsiktede kursfiler. Testen ble oppdatert til å tillate disse og framtidige `.logs/`-sesjonslogger, uten å åpne for andre tilfeldige rotfiler. Repo-strukturtesten besto deretter. Jeg unngikk dermed å bruke en eldre grønn kjøring som bevis for kode som var endret etterpå.


## Tillegg 28.–29.10.2026 – produksjonsflyt som avdekket feil utenfor KI-modellen

En viktig erfaring mot slutten av prosjektet kom da jeg sluttet å teste bare KI-svaret og i stedet kjørte golden- og pilotcasene gjennom samme produksjonsflyt som vanlige brukere. Fem reelle pilotcaser var lagt til fordi tidligere svar hadde vist et tydelig mønster: åpningen ble ofte for lang og formell, og kunne inneholde råd til lederen i stedet for en faktisk replikk. Jeg strammet derfor inn prompt og schema slik at åpningen normalt skal være 2–4 korte setninger, omtrent 30–65 ord, og høres naturlig ut når den sies høyt.

Da alle 26 casene ble kjørt gjennom produksjonsflyten, ble samtlige registrert, men tre kom aldri frem til modellen. De ble stoppet av personverngatewayen. Det var særlig interessant fordi selve KI-kvaliteten ikke var årsaken. Den deterministiske navnedetektoren tolket blant annet «møtte tydelig påvirket», «med hva som har skjedd» og «Varsleren mener …» som mulige navn. Jeg valgte å rette detektoren og legge inn regresjonstester for de konkrete feilene i stedet for å omskrive testcasene. Ved ny kjøring kom 26 av 26 frem til KI-svar.

Dette gjorde skillet mellom deterministiske og ikke-deterministiske deler av løsningen tydelig. Personverngatewayen kan testes med eksakte forventninger, mens språkmodellen kan formulere samme gode råd på flere måter. De fem pilotcasene ga faktisk ulike åpninger mellom kjøringer, men de kunne likevel oppfylle de samme kravene. Derfor ble nøkkelord som bare uttrykker én mulig formulering gjort til manuelle noter, mens mer robuste kvalitetskrav som lengde, setningsantall og forbud mot instruksjonsaktig språk fortsatt brukes automatisk.

Jeg ser dette som en praktisk anvendelse av Context Engineering og forelesningens poeng om non-determinisme. Kvalitetssikring av en KI-applikasjon kan ikke bygges som om modellen var en vanlig funksjon med ett fasitsvar. Samtidig må resten av systemet rundt modellen testes strengere nettopp fordi disse delene er deterministiske og kan stoppe eller endre hele flyten.

## Tillegg 29.10.2026 – taksonomi, brukerens språk og systemisk konsistens

Reduksjonen fra 56 til 48 undertemaer var ikke en opprydding jeg gjorde for å få et penere tall. Den ble utløst av brukertest/pilot. I pilotbackloggen var et gjentakende funn at enkelte undertemakort ikke hjalp godt nok med å forstå hvilket valg som passet. Flere beskrivelser var faglig riktige, men for abstrakte, overlappende eller formulert som definisjoner. Det kom også konkret tilbakemelding på indirekte språk; formuleringer rundt «på vei mot en avslutning» ble opplevd som vage. Det bidro til at jeg valgte å bruke ordet **oppsigelse** direkte der det faktisk er det lederen vil lete etter.

Jeg gjorde derfor først en klarspråkgjennomgang av alle 56 undertemaene, og deretter en strengere gjennomgang av selve taksonomien. Spørsmålene var blant annet om en leder faktisk ville brukt eller søkt etter ordene, om kortet tydelig svarte på «er dette min situasjon?», og om to nabokort var så like at valget i praksis kunne bli tilfeldig.

Gjennomgangen viste at flere titler forsøkte å forklare både situasjon og prosess i selve overskriften, mens andre kategorier var for smale eller overlappet. Jeg valgte derfor prinsippet «kort tittel, presis beskrivelse». Resultatet ble 48 undertemaer. Tallet 48 var ikke et forhåndsmål, men konsekvensen av de konkrete sammenslåingene og avgrensningene. Blant annet ble «Forventninger til lønn» og «Nye oppgaver og ansvar» samlet under «Lønnskrav», samarbeid ble nyansert med «Konflikt med kollega» og «Konflikt med leder», og smale sikkerhetskategorier som rapportering og risikovurdering ble dekket i beskrivelsene til bredere sikkerhetstemaer.

Det er viktig å skille mellom hva brukerne faktisk sa og hva som var min designbeslutning. Pilotbrukerne ba ikke om «48 undertemaer». De ga signaler om uklarhet, overlapp og vanskelig navigasjon. Reduksjonen til 48 var min løsning på disse funnene etter en systematisk gjennomgang av hele strukturen.

Denne endringen viste igjen hvor lett kontekst kan bli inkonsistent i et større prosjekt. En taksonomi finnes ikke bare i brukergrensesnittet; den finnes også i serverens klassifiseringskontrakt, benchmarkbank, tester og dokumentasjon. Etter implementeringen fant jeg at den eldre benchmarkbanken fortsatt brukte 56 gamle undertemanavn. I stedet for å kaste 112 tidligere testsaker ble de remappet til den nye strukturen, og to nye saker for «Konflikt med leder» ble lagt til. Banken har derfor 114 saker og minst to per gjeldende undertema. En ny regresjonstest kontrollerer denne koblingen.

## Tillegg 29.10.2026 – Git-historikk som dokumentasjon

Jeg har også valgt å ikke omskrive Git-historikken bare for å gjøre den visuelt pen. GitHub-tilkoblingen som ble brukt i deler av den KI-assisterte utviklingen skriver enkelte filer sekvensielt, og ett versjonsløft kan derfor vises som flere små `chore: bump versjon`-commits. Disse representerer ikke flere separate funksjonsendringer. I stedet for å squash'e i etterkant har jeg beholdt den faktiske historikken og laget et eget versjons-/commitspor for v20.10.4–v20.10.9. Det gir bedre etterprøvbarhet og gjør det mulig å skille funksjonscommits, tester, dokumentasjon og tekniske versjonsoppdateringer.


## Tillegg 29.10.2026 – fysisk mobiltest, responsiv eksekveringssti og PWA

Mobilpiloten ga et konkret eksempel på hvorfor det ikke er nok å se at en kodeendring finnes i repoet eller at en deploy er grønn. Jeg ønsket å gjøre logoen tydeligere på mobil. De første endringene traff elementer som var relevante på desktop, men brukeren så ingen forskjell på telefonen. Først mistenkte jeg service worker/cache og tvang fram ny cacheversjon. Endringen var teknisk fornuftig, men løste ikke selve problemet.

Ved en grundigere gjennomgang av den responsive CSS-en oppdaget jeg at desktop-sidefeltet faktisk skjules helt under mobilbredden, og at den synlige merkevaren i stedet lå i mobilens toppfelt. Jeg hadde altså endret kode som eksisterte, men ikke den eksekveringsstien brukeren faktisk så. Da toppfeltet ble korrigert, ble endringen synlig med en gang.

I samme runde oppstod en regresjon fordi Samtaleøvelse-logoen/illustrasjonen ble forenklet bort til fordel for et funksjonelt ikon. Dette var teknisk ryddig, men visuelt feil for produktet. Brukeren oppdaget at merkevareidentiteten var blitt svakere. Jeg skilte derfor tydeligere mellom navigasjonsikonet, som forklarer funksjon, og den større illustrasjonen, som bygger produktidentitet. Illustrasjonen ble gjeninnført, beskåret for mobil og gjort klikkbar slik at den kan vises større.

PWA-funksjonen ble også testet fysisk på Samsung-mobil. Da piloten ble åpnet i Chrome og installert som webapp, startet den i standalone-visning uten vanlig nettlesergrensesnitt. Dette ga et mer app-lignende uttrykk uten at prosjektet måtte pakkes som en separat Android-app. Manifest, rasterikoner, service worker og installasjonsveiledning ble derfor behandlet som en del av den faktiske leveransen i v20.11.0, ikke bare som et teknisk eksperiment.

Denne feilsøkingen er et konkret eksempel på Context Engineering i praksis. KI-assistenten hadde mye korrekt kontekst om prosjektet, men handlet først ut fra en feil antakelse om hvilket DOM-/CSS-element som var aktivt på mobil. Læringen var at kontekst ikke bare handler om å huske krav; den må også inneholde den faktiske runtime-stien. Ved responsiv utvikling må jeg derfor kontrollere hvilken komponent som faktisk renderes på den aktuelle skjermbredden, og ved PWA må jeg kontrollere både kildekode, service worker/cache og fysisk nettleseratferd. Dette er også et eksempel på hvorfor brukerens direkte observasjon kan være et viktigere signal enn at en teknisk deploy ser vellykket ut.


## Tillegg 29.10.2026 – feil som først ble synlig etter produksjonssetting

Rett etter at v20.11.0 var satt i produksjon oppdaget jeg en ny visuell regresjon på desktop. Samtaleøvelse-illustrasjonen ble unaturlig stor når nettleservinduet var maksimert, mørkt tema kunne vise en annen grafikk enn de øvrige temaene, og et smalere PC-vindu fikk et mobilpreget oppsett tidligere enn ønsket. Årsaken var ikke én enkelt regel, men flere eldre responsive og temaspesifikke CSS-regler som fortsatt traff samme komponent.

Jeg valgte å lage en egen patch, v20.11.1, i stedet for å endre produksjon ustrukturert. Rettelsen samlet sluttreglene for Samtaleøvelse, brukte samme bilde i alle temaer, satte øvre størrelse på desktop og flyttet den reelle mobilgrensen fra 700 til 640 CSS-piksler. Dette ble enda et eksempel på at iterativ CSS kan akkumulere kontekst og motstridende regler selv om hver enkelt endring virket rimelig da den ble lagt til. Læringen er at sluttfasen bør inkludere eksplisitt kontroll av både maksimal desktopbredde, mellomstørrelser og mobil – ikke bare den enheten som utløste forrige feil.


## Tillegg 29.10.2026 – mellomtilstander og skjult state

Etter desktop-hotfixen kom et nytt produksjonsfunn fra et halvstort nettleservindu. Layouten var verken full desktop eller mobil, og toppfeltet forsøkte å vise logo, lang breadcrumb, temavelger, ny samtale og profil på samme rad. Resultatet var at tekst la seg over logoen og brukerprofilen ble delvis kuttet. Jeg løste dette ved å definere en eksplisitt kompakt desktoptilstand i stedet for å flytte mobilgrensen opp igjen. Dette gjorde det tydelig at responsive systemer bør testes i minst tre tilstander: stor desktop, mellomstørrelse og mobil.

I samme test oppdaget jeg et annet type problem: situasjonsteksten som var brukt i «Finn tema» ble liggende igjen i flere søkefelter etter at brukeren hadde gått videre til råd. Den synlige feilen skyldtes skjult state, ikke styling. `pendingSituationText` var nyttig mens situasjonen skulle bæres fra søkeresultat til råd, men ble ikke nullstilt når overføringen var ferdig. Rettelsen ble derfor å skille tydelig mellom midlertidig transport-state og den faktiske situasjonsteksten i råd-flyten. Dette er et godt eksempel på at samme brukeropplevelse kan inneholde både CSS-feil og state-feil, og at symptomene må spores til riktig lag før de rettes.


## Tillegg 29.10.2026 – korrekt funksjon er ikke alltid korrekt visuell hierarki

Etter at topplinjen teknisk var gjort responsiv, viste brukertest at løsningen fortsatt kunne oppleves feil: profilen var synlig, men den hadde flyttet seg for langt mot venstre, og temavelgeren lå for tett på sidefeltknappen. Dette var ikke funksjonsfeil, men feil i visuelt hierarki og plassering. Rettelsen ble å forankre profilen som fast høyrekontroll og la andre elementer komprimeres rundt den. Dette minnet meg om at responsivitet ikke bare handler om at alt får plass; elementenes rolle og forventede plassering må også bevares når vindusstørrelsen endres.


## Tillegg 29.10.2026 – fra pikselforskyvning til layoutstruktur

Historikksiden ga et nytt eksempel på forskjellen mellom å flytte et element og å løse selve layoutproblemet. Logoen var tidligere plassert ved hjelp av flex og transformasjoner i samme rad som overskriften. Det kunne se akseptabelt ut i én vindusstørrelse, men den ble aldri egentlig sentrert i den ledige høyre flaten. I stedet for å legge til enda en fast margin valgte jeg å endre layoutstrukturen i CSS: teksten og logoen fikk hver sin grid-kolonne, og logoen ble sentrert med dynamisk størrelse via `clamp()`.

Samtidig fjernet jeg kortutseendet rundt KI-illustrasjonen i Samtaleøvelse fordi brukertesten viste at selve merket var sterkt nok visuelt uten ekstra ramme. Dette er et lite, men tydelig eksempel på at sluttfasen ikke bare handlet om å få funksjonene til å virke, men om å forenkle visuell struktur og fjerne styling som ikke lenger hadde en funksjon.
