# Product Requirements Document (PRD) – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Product Requirements Document (PRD)  
**Rammeverk:** BMAD  
**Status:** Planlagt produktkrav for første versjon  
**Språk:** Norsk  

---

## 1. Formål

Samtalestøtte skal utvikles som en KI-basert webapplikasjon for ledere som skal forberede, gjennomføre, øve på og reflektere over krevende medarbeidersamtaler.

Løsningen skal gi praktisk støtte uten å overta lederens ansvar. Den skal hjelpe brukeren med å strukturere en samtale, finne gode spørsmål og formuleringer, forstå mulige reaksjoner og øve i en simulert dialog med en KI-styrt medarbeider.

Produktet skal samtidig ha tydelige grenser for personvern, sikkerhet, kildebruk og menneskelig beslutningsansvar.

---

## 2. Bakgrunn og produktbegrunnelse

Prosjektet bygger på et praktisk behov: krevende medarbeidersamtaler er en vanlig del av lederrollen, men mange ledere får lite praktisk trening før de må håndtere slike situasjoner selv.

Samtalestøtte skal derfor ikke bare levere generelle KI-svar. Produktet skal gi en strukturert prosess som kombinerer forberedelse, KI-veiledning, simulering, oppfølging, refleksjon, personvern og faglig kildebruk.

Flere valg i løsningen er direkte knyttet til denne konteksten:

- **Innlogging** er nødvendig fordi historikk og innstillinger skal tilhøre én bruker, og fordi sensitive arbeidsrelaterte data ikke skal være tilgjengelige for andre.
- **Rollebasert tilgang** er nødvendig fordi administratorer og redaktører skal kunne vedlikeholde produktet uten å få samme funksjoner som ordinære brukere.
- **Kostnadsmåling** er nødvendig fordi høyere KI-kvalitet ofte innebærer høyere API-kostnad. Modellvalg skal derfor vurderes ut fra både kvalitet og økonomi.
- **Modellbenchmark** er nødvendig fordi det ikke kan antas at den dyreste modellen alltid gir nok merverdi til å forsvare kostnaden.
- **Personverngateway** er nødvendig fordi brukere kan skrive om virkelige medarbeidere og sensitive arbeidsforhold.
- **Kildeovervåking** er nødvendig for å forstå hvilke nettsider og dokumenter systemet faktisk bruker, og for å kunne bygge en framtidig lokal kunnskapsbank.
- **Provider-uavhengig arkitektur** er nødvendig fordi teknologi, pris og tilgjengelighet i KI-markedet endrer seg raskt.

---

## 3. Produktmål

Samtalestøtte skal:

- gjøre det enklere for ledere å forberede krevende samtaler
- gi strukturert og konkret KI-støtte fremfor generelle chatbot-svar
- tilby dynamisk samtalesimulering
- redusere risikoen for at identifiserende personopplysninger sendes til ekstern KI
- gi brukeren kontroll over egen historikk
- gjøre KI-kvalitet, kostnad og kildebruk målbar
- støtte flere KI-modeller uten at resten av applikasjonen må bygges om
- kunne videreutvikles til bruk i lukkede nettverk uten internettilgang
- kunne bruke en lokal kunnskapsbank/RAG i stedet for åpne nettsøk

---

## 4. Ikke-mål

Første versjon skal ikke:

- være et HR-system
- være et personalsystem eller journalsystem
- lagre formelle personalsaker
- ta beslutninger om medarbeidere
- automatisere oppsigelser, advarsler eller andre personalvedtak
- stille medisinske eller psykologiske diagnoser
- fastslå motiv, skyld eller sannhet i konflikter
- erstatte HR, juridisk bistand, bedriftshelsetjeneste eller lederens skjønn
- trene eller finjustere en egen språkmodell på brukerdata
- bruke samtaler som skjult treningsgrunnlag
- integreres direkte i personalmapper eller HR-systemer i første versjon
- kreve produksjonsklar utrulling i et klassifisert/lukket nettverk

---

## 5. Brukergrupper

### 5.1 Primærbruker

Ledere med personalansvar som står foran en krevende samtale med en medarbeider.

Typiske behov:

- få struktur på en uoversiktlig situasjon
- finne et tydelig mål for samtalen
- formulere en god åpning
- finne relevante spørsmål
- forberede seg på reaksjoner
- øve før samtalen
- reflektere etter samtalen
- få støtte raskt uten omfattende opplæring

### 5.2 Sekundærbrukere

- HR-funksjoner
- lederutviklere
- virksomheter som ønsker mer konsistent samtalestøtte
- organisasjoner med lukkede nettverk eller begrenset internettilgang
- administratorer/redaktører som vedlikeholder innhold og systemoppsett

---

## 6. Hovedtemaer

Første versjon skal støtte disse åtte hovedtemaene:

1. Alkohol og rus
2. Fravær
3. Prestasjon
4. Lønn
5. Samarbeid
6. Oppsigelse / avslutning av arbeidsforhold
7. Sikkerhet
8. Livssituasjoner

Hvert hovedtema skal ha undertemaer. Undertemaene skal fungere som kontekst for KI-en, ikke som et rigid regelverk.

Dersom brukerens beskrivelse allerede gjør tema og undertema tilstrekkelig tydelig, skal systemet kunne foreslå begge direkte og la brukeren korrigere valget.

---

## 7. Prioritering

Kravene klassifiseres som:

- **MUST** – nødvendig for første fungerende leveranse
- **SHOULD** – viktig og ønsket i første versjon dersom tid tillater
- **COULD** – videreutvikling eller sekundær funksjonalitet

---

# 8. Funksjonelle krav

## 8.1 Autentisering og brukerkonto

### Begrunnelse

Innlogging er et personvern- og tilgangskrav, ikke bare en komfortfunksjon. Løsningen skal lagre brukerens egne samtaler og innstillinger, og det må derfor finnes en sikker mekanisme som knytter data til riktig bruker. Innlogging gjør det også mulig å tilby sletting og eksport av egne data og å skille ordinære brukere fra editor- og adminroller.

### MUST

- Brukere skal kunne logge inn sikkert.
- Registrering skal kun være mulig via gyldig invitasjon.
- Sesjonen skal kunne beholdes mellom sideoppdateringer.
- Innlogget bruker skal bare ha tilgang til egne samtaler.
- Bruker skal kunne logge ut.
- Bruker skal kunne be om tilbakestilling av passord.
- Bruker skal kunne slette egen konto.
- Bruker skal kunne eksportere egne data.

### SHOULD

- Admin-kontoer bør kunne sikres med ekstra autentiseringskrav/MFA der infrastrukturen støtter det.

---

## 8.2 Roller og tilgang

Systemet skal støtte tre roller:

- `user`
- `editor`
- `admin`

### MUST

**User**
- bruke samtalestøtte
- bruke simulering
- se/slette egen historikk
- rapportere dårlige KI-svar
- rapportere tekniske feil

**Editor**
- ha samme rettigheter som user
- kunne redigere godkjent innhold
- ikke kunne tildele adminrolle

**Admin**
- ha samme rettigheter som editor
- administrere roller
- administrere KI-modell
- se systemstatistikk
- se rapporterte KI-svar
- se teknisk logging der dette er relevant
- se kilde-/weboppslagsstatistikk

Rollebeskyttelse skal håndheves på serveren, ikke bare i brukergrensesnittet.

---

## 8.3 Situasjonsbeskrivelse

### MUST

Brukeren skal kunne beskrive situasjonen med få tekstfelt.

Systemet skal:

1. gjennomføre personvernsjekk
2. analysere teksten
3. foreslå hovedtema og undertema
4. la brukeren endre forslag
5. bruke beskrivelsen som kontekst for videre veiledning

Systemet skal ikke kreve at brukeren først navigerer manuelt gjennom flere menyer dersom KI-en allerede har identifisert relevant tema og undertema med tilstrekkelig sikkerhet.

---

## 8.4 Temaidentifikasjon

### MUST

KI-en skal kunne foreslå:

- hovedtema
- undertema

Ved lav sikkerhet skal brukeren få flere relevante alternativer.

Ved middels/høy sikkerhet skal systemet kunne gå direkte til foreslått undertema.

Brukeren skal alltid kunne overstyre KI-ens forslag.

---

## 8.5 Hovedveiledning

### MUST

Veiledningen skal kunne inneholde:

- forslag til mål med samtalen
- forslag til struktur
- formulering av åpning
- relevante spørsmål
- forhold lederen bør være oppmerksom på
- mulige reaksjoner fra medarbeideren
- forslag til hvordan reaksjoner kan møtes
- forslag til neste steg
- tydelig avgrensning når saken krever HR/juridisk/faglig bistand

Svarene skal være:

- konkrete
- korte nok til praktisk bruk
- menneskelig formulert
- ikke-diagnostiserende
- ikke-beslutningstagende

---

## 8.6 Oppfølgingsdialog

### MUST

Brukeren skal kunne fortsette samtalen med KI-en etter hovedveiledningen.

Oppfølgingen skal:

- beholde relevant kontekst
- unngå unødvendig repetisjon
- svare kortere enn hovedveiledningen
- kunne gi formuleringseksempler
- kunne stille nødvendige avklaringsspørsmål

Alle nye brukerinnspill skal passere samme personverngateway før KI-kall.

---

## 8.7 Samtalesimulering

### MUST

Systemet skal ha en egen simulering der KI-en spiller medarbeideren.

Simulatoren skal:

- bruke valgt tema/undertema og situasjonsbeskrivelse som kontekst
- reagere dynamisk på lederens formuleringer
- opprettholde samtalekontekst gjennom flere meldinger
- kunne uttrykke realistiske reaksjoner som usikkerhet, motstand, frustrasjon, sorg, taushet eller samarbeid
- ikke bli karikert eller unødvendig dramatisk
- ikke gi fasitsvar til lederen mens den spiller medarbeider
- la brukeren avslutte øvelsen
- støtte refleksjon etterpå

### SHOULD

Etter simuleringen bør brukeren kunne få en kort refleksjon over:

- hva som fungerte
- hva som kunne vært formulert annerledes
- alternative formuleringer
- mulig neste steg

---

## 8.8 Historikk

### MUST

Brukeren skal kunne:

- se tidligere samtaler
- åpne en tidligere samtale
- fortsette eller lese den
- slette én samtale
- slette all egen historikk

Historikken skal være bruker-eid og beskyttet med databasepolicy/RLS.

Gamle samtaler skal også kunne gjennomgå personvernsjekk ved åpning.

---

## 8.9 Personverngateway

### MUST

Alle tekstfelt som kan føre til KI-kall skal gå gjennom samme personvernlogikk.

Kontrollen skal skje:

1. i brukergrensesnittet for umiddelbar tilbakemelding
2. på serveren som endelig sikkerhetsbarriere

Kontrollen skal minst håndtere:

- navn
- e-post
- telefonnummer
- fødselsdato
- alder der den kan bidra til identifisering
- person-/ansattnummer
- adresse
- arbeidssted/unik rolle der dette kan identifisere person
- direkte familieopplysninger
- kjønnet språk der det ikke er nødvendig

Prinsipp:

> Anonymiser identitet, ikke nødvendig kontekst.

Systemet skal ikke love full anonymisering. Det skal kommunisere at kontrollen reduserer identifiserbarhet, men ikke kan garantere at en person aldri kan gjenkjennes indirekte.

---

## 8.10 Rapportering av KI-svar

### MUST

Brukeren skal kunne velge **Rapporter svar** under KI-svar.

Rapporten skal kunne inneholde:

- type problem
- valgfri kommentar
- teknisk referanse
- hvilken del av appen svaret kom fra
- modell
- tidspunkt

Kategorier kan være:

- misforstod situasjonen
- faglig tvilsomt
- for generelt
- irrelevant
- urealistisk
- ignorerte tidligere kontekst
- annet

### MUST

Valget **Legg ved samtalen** skal være av som standard.

Dersom brukeren velger dette:

- personvernsjekk skal kjøres først
- bruker skal forstå at samtaleinnhold sendes med rapporten

---

## 8.11 Teknisk feilrapportering

### SHOULD

Brukeren bør kunne rapportere tekniske feil.

Teknisk rapport kan automatisk inneholde:

- appversjon
- tidspunkt
- side/funksjon
- feilkode
- nettlesertype
- endpoint/action

Samtaletekst skal ikke inkluderes automatisk.

---

# 9. KI-krav

## 9.1 Modellarkitektur

### Begrunnelse

De mest kapable språkmodellene er ofte også dyrere i bruk. Samtidig utvikler KI-markedet seg raskt, og pris/kvalitet-forholdet kan endre seg betydelig i løpet av prosjektets levetid. Systemet skal derfor ikke låses til én modell.

### MUST

Systemet skal bruke eksisterende språkmodeller via API.

Applikasjonen skal ikke være hardkodet til én enkelt modell.

Admin skal kunne velge mellom støttede modeller uten kodeendring eller ny deploy.

---

## 9.2 Modellbenchmark

### Begrunnelse

Prosjektet skal ikke anta at den kraftigste eller dyreste modellen automatisk er det beste valget. Samme testgrunnlag skal brukes til å sammenligne kvalitet, stabilitet, responstid, kildebruk og kostnad.

### MUST

Systemet skal kunne sammenligne minst tre KI-modeller på samme testgrunnlag.

For hver kjøring skal følgende kunne registreres:

- modell
- input tokens
- output tokens
- estimert kostnad
- responstid
- antall weboppslag
- søkestrenger
- brukte domener/kilder
- eventuelle feil
- svartekst i benchmarkmodus

Testtrafikk skal merkes separat fra ordinær brukertrafikk.

### MUST

Benchmark skal ha:

- synlig kostnadsestimat
- hard budsjettgrense
- mulighet til å stoppe kjøring
- mulighet til å ekskludere testtrafikk fra vanlig kostnadsstatistikk

---

## 9.3 Testbank

### MUST

Hvert undertema skal ha minst to faste testsaker.

Med 47 undertemaer innebærer dette minst:

**94 testsaker**

Testbanken skal dekke:

- typiske saker
- vanskelige/tvetydige saker
- personvern
- temaidentifikasjon
- tilfeller som ikke krever web
- tilfeller som bør kreve web
- ulike nivåer av sensitivitet

Ikke alle 94 saker må kjøres mot alle betalte modeller i hver benchmarkrunde. Et representativt delutvalg skal brukes til ekte modellbenchmark for å holde testkostnaden under kontroll.

---

## 9.4 Web search og kildebruk

### SHOULD

KI-en skal kunne bruke kontrollerte weboppslag når oppdatert eller presis ekstern informasjon er nødvendig.

Systemet skal kunne registrere:

- søkestreng
- tidspunkt
- modell
- hovedtema
- undertema
- domene
- sidetittel
- full URL
- om web search ble brukt

### MUST

Web-/kildeloggen skal ikke lagre:

- samtaletekst
- direkte identifiserende personopplysninger
- bruker-ID dersom dette ikke er nødvendig

Formålet er systemanalyse og utvikling av framtidig SOURCEBANK, ikke overvåking av enkeltbrukere.

---

# 10. Testing og evaluering

Testing skal gjennomføres på flere nivåer.

## 10.1 Automatiserte tekniske tester

### MUST

Det skal utvikles tester for:

- syntaks/regresjon
- autentisering
- tilgangskontroll
- personverngateway
- historikk
- kritiske adminfunksjoner
- benchmarklogikk

---

## 10.2 KI-testing

### MUST

Det skal finnes minst 94 faste testscenarioer, med minimum to per undertema.

Formålet er å teste:

- temaforståelse
- undertemaforståelse
- kvalitet på veiledning
- stabilitet
- personvern
- web search
- kildebruk
- responstid
- tokenbruk
- estimert kostnad

Et representativt delutvalg skal kjøres mot minst tre ekte KI-modeller.

---

## 10.3 Vanlig brukertesting

### SHOULD

Det planlegges **8–12 ordinære brukertester**.

Så langt det er praktisk mulig bør flere testpersoner ha:

- ledererfaring
- personalansvar
- HR-/lederutviklingsbakgrunn

Brukertestingen skal undersøke:

- om hovedflyten forstås uten forklaring
- om tema- og undertemavalg oppleves naturlig
- om rådene er relevante og konkrete
- om simuleringen oppleves realistisk og nyttig
- om personvernvarsler forstås
- om historikk og navigasjon er intuitive
- om brukerne opplever løsningen som et supplement til eget skjønn, ikke som beslutningsmyndighet

### Mål

- minst 90 % skal kunne gjennomføre hovedflyten uten hjelp
- minst 80 % skal vurdere samtalestøtten som relevant og konkret

---

## 10.4 Kostnadstesting

### MUST

Prosjektet skal bruke testingen til å estimere reell driftskostnad.

Det skal kunne måles:

- kostnad per KI-kall
- kostnad per testscenario
- kostnad per komplett brukerforløp
- kostnadsforskjell mellom modeller
- kostnad knyttet til web search der dette er relevant

Dette skal brukes som grunnlag for modellvalg og framtidig produktmodell.

---

# 11. SOURCEBANK og kunnskapsgrunnlag

## 11.1 Første versjon

### MUST

Systemet skal ha et dokumentert fag- og kildegrunnlag som kan brukes til:

- systemprompt
- faglige begrensninger
- råd om kildebruk
- kontroll av høyrisikotemaer

## 11.2 Videre utvikling

### SHOULD

Kildebruk fra reelle og syntetiske tester skal kunne analyseres for å identifisere:

- mest brukte domener
- mest brukte sider
- mest brukte søketemaer

Dette skal brukes som beslutningsgrunnlag for hvilke kilder som bør inngå i lokal SOURCEBANK/RAG.

---

# 12. Offline / lukket intranett

## 12.1 Arkitekturkrav

### MUST

Systemarkitekturen skal dokumenteres slik at eksterne tjenester kan erstattes.

Nettversjon:

```text
Bruker
→ Samtalestøtte frontend
→ Node/Express backend
→ ekstern KI
→ Supabase
→ eventuelt web search
```

Lukket variant:

```text
Bruker
→ Samtalestøtte
→ intern applikasjonsserver
→ intern KI-modell
→ intern database
→ lokal SOURCEBANK/RAG
→ ingen internettilgang
```

## 12.2 Krav til lukket variant

### SHOULD

Arkitekturen skal støtte at:

- ekstern OpenAI-lignende API erstattes av intern endpoint
- intern modell kan eksponeres via OpenAI-kompatibelt API, vLLM, Ollama eller intern REST
- ekstern database kan erstattes med intern PostgreSQL eller tilsvarende
- autentisering kan flyttes til intern identitetsløsning
- web search kan deaktiveres fullstendig
- lokale dokumenter kan brukes som kunnskapsgrunnlag
- eksterne fonter, CDN-er og andre nettavhengigheter kan fjernes

Full utrulling i lukket produksjonsmiljø er utenfor V1.

---

# 13. Admin

## 13.1 Admin-dashboard

### MUST

Admin skal kunne:

- se systemstatus
- administrere roller
- redigere godkjent innhold
- velge aktiv KI-modell
- se kostnads-/tokenstatistikk
- se benchmarkresultater
- se rapporterte KI-svar
- se kilde-/weboppslagsstatistikk

### MUST

Seksjonen **Rediger innhold** skal være sammenleggbar og minimert som standard.

---

## 13.2 Innholdsredigering

### SHOULD

Admin/editor skal kunne redigere:

- overskrifter
- beskrivelser
- hjelpetekster
- knappeetiketter
- tomtilstander
- personverntekst
- simulatorbeskrivelser
- tema- og undertematekster

Teknisk/systemkritisk tekst skal holdes adskilt fra ordinært redigerbart innhold.

### MUST

Lagring skal kreve eksplisitt bekreftelse.

Systemet skal vise:

- ulagrede endringer
- deaktivert lagreknapp når ingenting er endret
- bekreftelsesdialog før publisering

---

# 14. Ikke-funksjonelle krav

## 14.1 Sikkerhet

### MUST

Systemet skal ha:

- server-side tilgangskontroll
- RLS/databaseregler
- HttpOnly session cookies
- Secure cookies i produksjon
- SameSite-beskyttelse
- rate limiting
- same-origin-kontroll for muterende kall
- sikkerhetsheadere
- CSP
- HSTS i produksjon
- begrenset statisk filservering
- ingen hemmelige nøkler i frontend
- ingen detaljerte debugmeldinger til sluttbruker
- server-side personverngateway
- begrenset logging av sensitiv informasjon

---

## 14.2 Personvern

### MUST

Systemet skal følge prinsipper om:

- dataminimering
- formålsbegrensning
- minst mulig lagring
- bruker-eid historikk
- eksplisitt valg ved deling av samtale med feedback
- begrenset lagringstid for tekniske logger
- separasjon mellom brukerdata og kildeanalyse

---

## 14.3 Lagringstid

### SHOULD

Følgende retningslinjer skal støttes:

- samtalehistorikk: til bruker sletter den eller kontoen
- detaljerte KI-logger: begrenset periode
- web-/kildelogger: detaljert periode, deretter aggregert/anonymisert statistikk
- feedback med samtalevedlegg: kortere lagringstid enn generell feedback

---

## 14.4 Ytelse

### SHOULD

Vanlige brukerhandlinger skal oppleves responsive.

KI-kall skal vise tydelig lastestatus.

Feil skal håndteres uten at bruker mister hele arbeidsflyten.

---

## 14.5 Tilgjengelighet og UX

### SHOULD

Løsningen skal:

- være forståelig uten opplæring
- bruke konsistente komponenter
- ha tydelig navigasjon
- ha lys/mørk/hybrid visning
- ha god kontrast
- støtte tastaturbruk
- bruke tydelige varsler og tilbakemeldinger
- unngå unødvendig teknisk språk i brukerflaten

---

# 15. Data og lagring

## 15.1 Brukerdata

Kan omfatte:

- brukerprofil
- rolle
- innstillinger
- samtalehistorikk
- rapportert feedback

## 15.2 Teknisk data

Kan omfatte:

- modell
- tokenbruk
- estimert kostnad
- responstid
- teknisk feiltype
- web search metadata

Teknisk logging skal ikke brukes til å rekonstruere brukerens personalsaker.

---

# 16. Økonomisk bærekraft og produktmodell

## 16.1 Bakgrunn

KI-tjenester, database og hosting kan medføre løpende kostnader. De beste modellene i en gitt periode kan også være blant de dyreste. Produktet må derfor kunne dokumentere kostnadene før en eventuell kommersiell videreføring.

## 16.2 Kostnadsmodell

### MUST

Systemet skal kunne måle eller estimere:

- tokenkostnad per KI-kall
- samlet KI-kostnad per periode
- kostnad per testscenario
- kostnad per typisk brukerforløp
- forskjell mellom ulike KI-modeller
- kostnad ved web search
- database- og hostingkostnader som del av totalbildet der disse blir relevante

## 16.3 Mulig betalingsmodell

### COULD

Dersom løsningen viser seg å ha reell etterspørsel, kan en senere versjon tilbys som:

- abonnement
- virksomhetslisens
- betalt premiumversjon
- gratis basisversjon med betalte utvidelser

Formålet med betaling skal først og fremst være å dekke løpende kostnader til KI, database, hosting, drift og videreutvikling.

## 16.4 Teknologiutvikling

Produktstrategien skal ta høyde for at KI-markedet endres raskt.

Det er mulig at:

- dagens dyre modeller blir betydelig billigere
- rimeligere modeller får samme eller bedre kvalitet
- gratis eller lokale modeller blir gode nok for hele eller deler av løsningen

Produktet skal derfor ikke bygges rundt en forutsetning om at en bestemt betalt modell alltid må brukes.

Provider-uavhengig arkitektur og adminstyrt modellvalg skal gjøre det mulig å redusere kostnader dersom teknologiutviklingen tillater det.

---

# 17. Suksessmåling

Første versjon skal evalueres på:

### Brukeropplevelse

- 8–12 planlagte ordinære brukertester
- minst 90 % gjennomfører hovedflyten uten hjelp
- minst 80 % vurderer veiledningen som relevant og konkret

### Testdekning

- minst 94 faste KI-testsaker
- minst 2 per undertema
- automatiserte personvern- og regresjonstester

### KI-kvalitet

- minst tre modeller kan sammenlignes
- tokenbruk, kostnad og responstid kan måles
- kildebruk kan analyseres

### Personvern og sikkerhet

- direkte KI-kall skal ikke kunne omgå serverens personverngateway
- brukere skal ikke kunne lese andres historikk
- samtaletekst skal ikke lagres i tekniske kildelogger
- adminfunksjoner skal være server-beskyttet

### Arkitektur

- systemet skal dokumentere hvordan ekstern KI/web kan erstattes med intern KI/lokal kunnskapsbank

### Økonomi

- prosjektet skal kunne estimere kostnad per typisk brukerforløp
- kostnadsforskjeller mellom modellene skal være dokumentert
- modellvalg skal kunne begrunnes i både kvalitet og kostnad

---

# 18. Akseptansekriterier for V1

V1 kan regnes som ferdig når:

1. innlogging og rollemodell fungerer
2. alle åtte hovedtemaer fungerer
3. undertemaer brukes som KI-kontekst
4. situasjon kan beskrives og analyseres
5. KI kan gi strukturert hovedveiledning
6. oppfølgingsdialog fungerer
7. samtalesimulering fungerer
8. historikk fungerer og er brukerbeskyttet
9. personvernkontroll fungerer både klient- og server-side
10. rapportering av KI-svar fungerer
11. admin kan administrere innhold og modellvalg
12. benchmark kan sammenligne modeller
13. testbank inneholder minimum to saker per undertema
14. token-, kostnads- og kildebruk kan måles
15. sikkerhetstiltak er dokumentert og testet
16. arkitektur for lukket/offline drift er dokumentert
17. kritiske automatiserte tester består
18. minst én ordinær brukertestrunde er gjennomført eller planlagt med dokumentert testopplegg
19. kostnad per representativt KI-forløp kan estimeres

---

# 19. Risikoer og avhengigheter

## 19.1 KI-kvalitet

Språkmodeller kan gi feil, inkonsistente eller for bastante svar.

Tiltak:

- tydelig systemprompt
- faglig kildegrunnlag
- avgrensninger
- modellbenchmark
- rapporteringsfunksjon
- menneskelig ansvar beholdes

## 19.2 Personvern

Brukere kan skrive identifiserende eller sensitive opplysninger.

Tiltak:

- klientkontroll
- serverkontroll
- anonymiseringshjelp
- dataminimering
- begrenset logging
- tydelig personverninformasjon

## 19.3 Kostnad

KI- og webkall kan gi uforutsigbare kostnader.

Tiltak:

- tokenmåling
- kostnadslogging
- modellvalg
- benchmark med budsjettgrense
- bruk av billigere modeller der kvaliteten er tilstrekkelig

## 19.4 Leverandøravhengighet

Ekstern KI, database eller hosting kan endre pris eller tilgjengelighet.

Tiltak:

- provider-uavhengig arkitektur
- dokumentert intern KI-variant
- lokal SOURCEBANK/RAG som framtidig alternativ

## 19.5 Omfang

Prosjektet har høy kompleksitet og kan bli for stort.

Tiltak:

- MUST/SHOULD/COULD-prioritering
- tydelig Scope
- eksplisitt out-of-scope
- modulær utvikling
- faste akseptansekriterier

---

# 20. Videre arbeid etter V1

Mulig videreutvikling:

- lokal RAG/kunnskapsbank
- automatisert kildekuratering
- intern KI-modell
- intern autentisering
- organisasjonsspesifikke fagregler
- virksomhetsspesifikk admin
- bedre analyse av kvalitet over tid
- avansert simulering med flere reaksjonsprofiler
- mobiltilpasning
- tilgjengelighetsforbedringer
- integrasjoner mot interne systemer der dette er juridisk og teknisk forsvarlig
- kommersiell tjeneste dersom reell etterspørsel og kostnadsgrunnlag tilsier det
- gratis eller rimeligere nivå dersom framtidige KI-modeller gjør dette mulig

---

# 21. Oppsummering

Samtalestøtte skal utvikles som et domenespesifikt KI-system for praktisk lederstøtte, ikke som en generell chatbot.

V1 kombinerer:

- strukturert samtaleveiledning
- tema- og undertemaforståelse
- dynamisk KI-simulering
- historikk
- autentisering og roller
- personverngateway
- sikkerhetsarkitektur
- fag- og kildegrunnlag
- web search
- kildeovervåking
- modellbenchmark
- token- og kostnadsmåling
- administrasjon
- automatisert testing
- ordinær brukertesting
- dokumentert overgang til intern KI og lokal kunnskapsbank
- vurdering av økonomisk bærekraft og framtidig produktmodell

Kompleksiteten skal håndteres gjennom tydelig avgrensning, kravprioritering, måling og systematisk testing.
