# UX Design Specification – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** UX Design Specification  
**Rammeverk:** BMAD  
**Status:** Planlagt brukeropplevelse for første versjon  
**Språk:** Norsk

---

## 1. Formål

UX-designet for Samtalestøtte skal gjøre en kompleks og potensielt sensitiv oppgave enkel å forstå og trygg å bruke.

Brukeren skal kunne gå fra en krevende og ofte ustrukturert arbeidssituasjon til en tydelig plan for samtalen uten å måtte forstå hvordan KI, databaser, personvernkontroll eller kildebruk fungerer teknisk.

Designet skal derfor prioritere ro, tydelighet, lav visuell belastning, forutsigbar navigasjon, konsistent språk, få valg om gangen, tydelig tilbakemelding fra systemet, høy opplevd kontroll og personvern som en naturlig del av arbeidsflyten.

Løsningen skal oppleves som et spesialisert arbeidsverktøy for ledere, ikke som en generell chatbot.

---

## 2. UX-prinsipper

### 2.1 Rolig og konsistent visuelt uttrykk

Samtalestøtte skal bruke en begrenset og gjennomgående fargepalett. Mange sterke eller konkurrerende farger kan gjøre grensesnittet visuelt urolig og gjøre det vanskeligere å se hva som er viktig. Derfor skal hovedfarger, bakgrunnsfarger, kort, illustrasjoner, ikoner og bilder holdes innenfor samme visuelle tema.

Illustrasjoner og bilder skal så langt som mulig bruke beslektede nyanser og uttrykk, slik at siden oppleves som én helhet fremfor en samling enkeltstående elementer.

Farger skal brukes funksjonelt:

- hovedfarge for identitet og viktige handlinger
- nøytrale bakgrunner for arbeidsflater
- diskrete kontrastfarger for navigasjon og status
- varselsfarger bare når brukeren faktisk trenger oppmerksomhet

Farge skal ikke brukes bare for dekorasjon dersom det svekker oversikten.

### 2.2 Visuelt hierarki

Brukeren skal raskt kunne forstå hvor de er, hva de skal gjøre nå, hva som er viktigst, hva som er valgfritt og hvor de går videre.

Hierarkiet skal skapes med tydelige overskrifter, avstand og gruppering, kort og seksjoner, begrenset bruk av farger, konsistente knappestiler, størrelse og vekt på tekst og plassering av primære handlinger.

Primære handlinger skal være tydelige uten at hele skjermbildet fylles med konkurrerende knapper.

### 2.3 Progressiv kompleksitet

Brukeren skal ikke presenteres for alle funksjoner samtidig. Løsningen skal vise det som er nødvendig i den aktuelle delen av arbeidsflyten, og mer avanserte funksjoner skal kunne åpnes ved behov.

Eksempler:

- Admin-seksjonen **Rediger innhold** skal være minimert som standard.
- Avanserte modell- og kostnadsdata skal ligge i Admin, ikke i hovedflyten.
- Personvernforklaringer skal være tydelige, men ikke dominere siden dersom ingen problemer er oppdaget.
- Undertemaer skal hjelpe brukeren videre, men ikke skape unødvendige ekstra steg dersom KI-en allerede har identifisert riktig kontekst.

### 2.4 Gjenkjennelighet fremfor læring

Komponenter som gjør samme jobb skal se og oppføre seg likt. Samme knappetype skal brukes for tilsvarende handlinger, samme visuelle form for personvernstatus, samme mønster for bekreftelsesdialoger og samme kortstruktur der funksjonene er sammenlignbare.

Brukeren skal ikke måtte lære en ny måte å bruke systemet på fra side til side.

### 2.5 Menneskelig språk

Tekst i grensesnittet skal være profesjonell, men menneskelig. Språket skal være tydelig, unngå unødvendig teknisk terminologi, unngå å stemple medarbeideren negativt og beskrive situasjoner nøytralt.

Tema og undertema skal derfor så langt som mulig formuleres nøytralt. Eksempler er «motivasjon» fremfor «manglende motivasjon», «kvalitet og prioritering» fremfor «dårlig kvalitet» og «livssituasjoner» fremfor kategorier som kan oppleves som problemstempling.

---

## 3. Visuell identitet

### 3.1 Logo

Samtalestøttes logo skal symbolisere dialog mellom menneske og KI. Logoen består av en oval snakkeboble, en menneskelig profil, en diskret KI-profil og et visuelt markert element i snakkeboblens hale.

Logoen skal brukes uten visuelle filtre som endrer originalens farger eller lysstyrke. I hybridvisning skal original `logo.png` brukes.

### 3.2 Fargebruk

Hoveduttrykket skal bruke en rolig palett med mørk petrol/blågrønne toner kombinert med lyse arbeidsflater.

Begrunnelsen er å skape et profesjonelt uttrykk, redusere visuell støy, støtte tydelig kontrast mellom navigasjon og innhold, gi en rolig ramme rundt sensitive temaer og skape sammenheng mellom app, illustrasjoner og ikoner.

Fargepaletten skal brukes konsekvent på tvers av sidebar, kort, knapper, illustrasjoner, ikoner, meldingsbobler, statusfelt og temaillustrasjoner.

### 3.3 Bilder og illustrasjoner

Illustrasjoner skal ikke ha tilfeldig stil eller store variasjoner i fargetemperatur og metning. De skal bruke et beslektet visuelt uttrykk, holde seg innenfor samme fargefamilie, støtte temaet uten å dominere og bidra til gjenkjennelse.

Målet er at illustrasjonene skal støtte navigasjon og stemning, ikke konkurrere med teksten.

### 3.4 Typografi

Typografien skal prioritere lesbarhet. Det skal være tydelig forskjell mellom hovedoverskrift, seksjonsoverskrift, brødtekst, hjelpetekst, status og knappetekst. Det skal unngås unødvendig mange skriftstørrelser og vekter.

---

## 4. Temaer og visningsmoduser

Løsningen skal støtte lys modus, mørk modus og hybridmodus.

### 4.1 Hybridmodus

Hybridmodus er hoveduttrykket. Denne kombinerer mørk sidebar med lys hovedflate og gir tydelig visuell separasjon mellom navigasjon og arbeid.

Begrunnelsen er å beholde en tydelig app-følelse samtidig som hovedinnholdet har en lys og lesbar arbeidsflate.

---

## 5. Overordnet layout

Desktop-layout skal være hovedprioritet i første versjon.

Grunnstruktur:

```text
┌────────────────────┬────────────────────────────────────┐
│                    │                                    │
│     SIDEBAR        │           HOVEDINNHOLD             │
│                    │                                    │
│ Logo               │ Overskrift                         │
│ Navigasjon         │ Arbeidsflate                       │
│                    │                                    │
└────────────────────┴────────────────────────────────────┘
```

Sidebar brukes til hovednavigasjon, historikk, simulator, admin for autoriserte brukere, innstillinger, personvern, kontakt og informasjon om løsningen.

Hovedområdet skal ha god luft og tydelig fokus på én oppgave om gangen.

---

## 6. Hovedbrukerflyt

### 6.1 Start

Brukeren skal raskt forstå hva løsningen gjør. Startflaten skal tilby to naturlige innganger: velg et tema eller beskriv situasjonen med egne ord.

Brukeren skal ikke tvinges til å forstå tema-strukturen før vedkommende kan begynne.

### 6.2 Situasjonsbeskrivelse

Tekstfeltet skal være stort nok til at brukeren kan beskrive situasjonen naturlig, ha tydelig eksempel/hjelpetekst, minne brukeren om ikke å bruke navn eller unødvendige identifikatorer og gi personvernfeedback før innsending.

Når KI-en har analysert situasjonen, skal systemet foreslå hovedtema og undertema. Brukeren skal kunne endre dette enkelt.

### 6.3 Tema og undertema

Klikk på hovedtema skal åpne en egen side eller arbeidsflate med undertemaer.

Undertemaer skal være tydelig navngitt, ha korte forklaringer ved behov, være visuelt konsistente og inkludere mulighet for «Annet».

Dersom KI-en allerede har identifisert både hovedtema og undertema med høy nok sikkerhet, skal brukeren kunne føres direkte videre uten et unødvendig ekstra valg.

---

## 7. Veiledningsvisning

Veiledningen skal presenteres strukturert og ikke som én lang KI-tekst. Aktuelle seksjoner kan være mål for samtalen, før samtalen, forslag til åpning, spørsmål, mulige reaksjoner, hvordan reaksjonene kan møtes og neste steg.

Svarene skal ha korte avsnitt og tydelige overskrifter.

Brukeren skal kunne fortsette samtalen, stille oppfølgingsspørsmål, rapportere et dårlig svar og gå videre til simulering dersom dette er relevant.

---

## 8. Oppfølgingsdialog

Oppfølgingsdialogen skal ligne en samtale, men ikke føles som en separat tilfeldig chatbot. Den skal visuelt være koblet til hovedveiledningen.

KI-svar skal være kortere enn hovedsvaret. Enter skal sende melding, mens Shift + Enter skal lage ny linje. Brukeren skal tydelig kunne se hvem som har skrevet hva.

---

## 9. Samtalesimulering

### 9.1 Formål

Simulatoren skal gi brukeren et trygt sted å øve på formuleringer før den virkelige samtalen. Simulatoren skal føles som en separat treningsmodus, men bruke samme visuelle språk som resten av Samtalestøtte.

### 9.2 Roller

KI spiller medarbeideren og brukeren spiller lederen. Dette skal være visuelt tydelig gjennom avatarer, plassering, meldingsbobler og etiketter ved behov.

### 9.3 Meldingsbobler

Meldingsboblene skal bruke samme godkjente geometri gjennom hele simulatoren. Venstre og høyre boble skal være speilvendte varianter av samme grunnform. Forskjellen skal hovedsakelig ligge i side, farge og avsender.

Formen skal ikke endres mellom meldinger.

### 9.4 Avatarer

Avatar og meldingsboble skal plasseres slik at halen visuelt peker naturlig mot riktig person. Avstand mellom profil og boble skal være konsistent gjennom hele simuleringen.

### 9.5 Personvern i simulator

Personvernkontrollen skal alltid være synlig, men diskret.

Normal tilstand:

**Personvernsjekk**  
Ingen tydelige personopplysninger er oppdaget i teksten.

Ved funn skal boksen vise hva som er oppdaget, hvorfor dette bør endres og handlingen «Fiks personvern».

Ingen tom varselboks skal vises.

---

## 10. Historikk

Historikk skal gjøre det enkelt å finne tilbake til tidligere arbeid. Brukeren skal kunne se tema, undertema, dato, samtaletype og kort identifikasjon av samtalen uten å eksponere sensitiv tekst unødvendig.

Historikk skal ikke fremstå som et journalsystem.

Brukeren skal enkelt kunne åpne, slette og slette all historikk.

---

## 11. Personvern som UX

Personvern skal ikke bare eksistere i bakgrunnen som teknisk kontroll. Brukeren skal forstå hvorfor personopplysninger ikke bør legges inn, hva systemet har oppdaget, hva som kan gjøres med teksten og når tekst sendes videre til KI.

Personvernvarsler skal være tydelige uten å skremme brukeren unødvendig. Normal status skal kommunisere at kontrollen er gjennomført. Ved problemer skal systemet hjelpe brukeren med å rette teksten, ikke bare blokkere den.

---

## 12. Admin UX

Admin skal være funksjonell fremfor dekorativ. Siden vil kunne inneholde mange funksjoner og skal derfor bruke sammenleggbare seksjoner.

Eksempel:

```text
▶ Rediger innhold
▶ KI-modell
▶ Kostnad og tokenbruk
▶ Modellbenchmark
▶ Rapporterte svar
▶ Weboppslag og kildebruk
▶ Roller og brukere
```

**Rediger innhold skal være minimert som standard.**

Bare den seksjonen administratoren arbeider med skal behøve å være åpen.

### 12.1 Innholdsredigering

Systemet skal vise hvilke tekster som er redigerbare, om det finnes ulagrede endringer, tydelig lagreknapp og bekreftelsesdialog før publisering.

Bekreftelsesdialog:

> Er du sikker på at du vil lagre endringene? Endringene blir synlige for brukerne med en gang.

Handlinger:

- Avbryt
- Lagre endringer

### 12.2 Modellvalg

Admin skal kunne se aktiv modell, tilgjengelige modeller, enkel beskrivelse av kostnad/kvalitetsnivå og eventuell advarsel ved valg av dyrere modell.

Modellvalg skal være et kontrollert valg fra liste, ikke et fritt tekstfelt.

### 12.3 Kostnad og tokenbruk

Kostnadsdata skal presenteres på en måte som er forståelig uten teknisk ekspertise. Aktuelle visninger er siste 24 timer, 7 dager og 30 dager, antall KI-kall, tokenbruk, estimert kostnad, fordeling på funksjon og modell.

Målet er å gjøre økonomisk konsekvens synlig, ikke å overbelaste administrator med rådata.

### 12.4 Weboppslag og kildebruk

Admin skal kunne se søkestreng, modell, tema/undertema, domene, sidetittel, URL og tidspunkt.

Oversikten skal brukes til å identifisere mest brukte kilder, gjentatte søk og kandidater til SOURCEBANK/RAG. Den skal ikke vise hvem som gjorde oppslaget eller gjengi brukerens samtaletekst.

---

## 13. Benchmark UX

Benchmark skal gjøre sammenligning enkel. Samme testsak skal kunne vises side om side for flere modeller.

```text
TESTSAK
────────────────────────────────────────────
LUNA        TERRA        SOL
Svar        Svar         Svar
Tokens      Tokens       Tokens
Kostnad     Kostnad      Kostnad
Tid         Tid          Tid
Web         Web          Web
Kilder      Kilder       Kilder
```

Brukeren skal kunne se kostnadsestimat før teststart, sette budsjettgrense, stoppe testen, se fremdrift, åpne detaljer per testsak og se faktiske weboppslag.

Testdata skal være tydelig merket som testtrafikk.

---

## 14. Feedback og feilrapportering

Det skal skilles visuelt og språklig mellom **Rapporter svar** og **Rapporter feil**.

Rapporter svar brukes når KI-svaret er irrelevant, faglig tvilsomt, urealistisk, for generelt eller misforstår kontekst.

Rapporter feil brukes når noe teknisk ikke virker.

Dette skillet skal redusere risikoen for at brukeren må forstå tekniske kategorier.

---

## 15. Tilgjengelighet

Løsningen skal så langt som praktisk mulig følge grunnleggende tilgjengelighetsprinsipper. Det innebærer blant annet tilstrekkelig kontrast, at tekst ikke er avhengig av farge alene, tydelig fokus ved tastaturnavigasjon, forståelige knappeetiketter, passende tekststørrelse, god luft mellom interaktive elementer, støtte for Enter/Shift + Enter der det er relevant og semantiske overskrifter.

---

## 16. Responsive prinsipper

Desktop er hovedplattform i V1. Designet skal likevel unngå unødvendige låsninger som gjør senere mobiltilpasning vanskelig.

Ved mindre skjermbredde skal sidebar kunne komprimeres, kort kunne legges under hverandre, tekstfelt fortsatt være brukbare og dialoger tilpasses skjermbredden.

Full mobiloptimalisering er ikke et hovedkrav i første versjon.

---

## 17. UX-testing

Det planlegges **8–12 ordinære brukertester**.

Testpersonene skal få realistiske oppgaver, eksempelvis:

1. Forbered en prestasjonssamtale.
2. Beskriv en situasjon og bruk KI-forslaget til tema.
3. Finn relevante formuleringer.
4. Start en simulering.
5. Skriv inn informasjon som bør utløse personvernvarsel.
6. Finn tilbake til en tidligere samtale.
7. Rapporter et lite nyttig KI-svar.

Det skal observeres om brukeren finner frem uten forklaring, hvor brukeren stopper opp, om begrepene forstås, om personvernvarsler gir mening, om simuleringen føles intuitiv, om den visuelle strukturen oppleves rolig eller overveldende og om brukeren forstår forskjellen mellom KI-råd og menneskelig beslutningsansvar.

Mål:

- minst 90 % skal kunne gjennomføre hovedflyten uten hjelp
- minst 80 % skal vurdere veiledningen som relevant og konkret

---

## 18. Designvalg og begrunnelser

### Begrenset fargepalett

**Valg:** Få hovedfarger og beslektede nyanser.  
**Begrunnelse:** Reduserer visuell støy og skaper et mer konsistent arbeidsmiljø.

### Bilder i samme stil og fargetema

**Valg:** Temaillustrasjoner skal bruke beslektede farger og uttrykk.  
**Begrunnelse:** Hindrer at illustrasjonene konkurrerer om oppmerksomheten og gjør løsningen visuelt sammenhengende.

### Mørk sidebar + lys arbeidsflate

**Valg:** Hybridmodus som hovedvisning.  
**Begrunnelse:** Gir tydelig navigasjonsområde samtidig som teksttunge arbeidsflater forblir lyse og lesbare.

### Få tekstfelt

**Valg:** Situasjonen skal normalt beskrives i ett eller få felt.  
**Begrunnelse:** Reduserer terskelen for å komme i gang og lar KI-en hjelpe med struktureringen i stedet for at brukeren må fylle ut et omfattende skjema.

### Nøytrale temaformuleringer

**Valg:** Unngå en meny som fremstår som en katalog over feil ved medarbeidere.  
**Begrunnelse:** Språket skal støtte refleksjon fremfor å forhåndsdømme situasjonen.

### Personvern i arbeidsflyten

**Valg:** Personvernsjekk skjer før KI-kall og vises i selve grensesnittet.  
**Begrunnelse:** Brukeren skal forstå hva som skjer og få hjelp til å redusere identifiserende informasjon før data sendes videre.

### Sammenleggbare adminseksjoner

**Valg:** Store adminområder skal kunne minimeres.  
**Begrunnelse:** Admin inneholder mange avanserte funksjoner. Sammenlegging reduserer visuell kompleksitet og gjør siden lettere å navigere.

### Separat simulator

**Valg:** Samtalesimulering har en tydelig egen modus.  
**Begrunnelse:** Vanlig veiledning og rollespill har forskjellige mål. Tydelig separasjon reduserer risikoen for at brukeren blander rådgivning fra KI med replikkene til den simulerte medarbeideren.

---

## 19. Design som skal unngås

Samtalestøtte skal unngå:

- mange konkurrerende farger
- tilfeldig variasjon mellom illustrasjoner
- lange ustrukturerte KI-svar
- for mange knapper på samme nivå
- tomme varselbokser
- skjult personverninformasjon
- unødvendig teknisk språk
- flere ulike løsninger på samme type brukerhandling
- animasjoner som distraherer fra innholdet
- funksjoner som ser klikkbare ut uten å være det
- adminflater der alt er ekspandert samtidig

---

## 20. Oppsummering

UX-designet skal gjøre Samtalestøtte rolig, forståelig og forutsigbar til tross for at systemet teknisk er komplekst.

Den visuelle utformingen skal være konsistent i farger, nyanser, illustrasjoner, kort, knapper, dialoger, meldingsbobler og typografi.

Brukeren skal først og fremst oppleve:

> «Jeg skjønner hva jeg skal gjøre, jeg har kontroll, og verktøyet hjelper meg gjennom en vanskelig oppgave.»

Den tekniske kompleksiteten – KI, personvern, database, modellvalg, kostnadsmåling og kildebruk – skal i størst mulig grad håndteres av systemet uten å skape tilsvarende kompleksitet i brukeropplevelsen.
