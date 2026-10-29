# UX Design Specification – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** UX Design Specification  
**Rammeverk:** BMAD  
**Status:** Revidert UX-spesifikasjon med faktisk leveransestatus  
**Versjon ved dokumentasjon:** 20.11.5  
**Språk:** Norsk

---

# 1. Formål

Samtalestøtte skal gjøre en kompleks og potensielt sensitiv oppgave enkel å forstå og trygg å bruke.

Brukeren skal kunne gå fra en ustrukturert arbeidssituasjon til konkret forberedelse og samtaletrening uten å måtte forstå:

- KI-arkitektur
- databaser
- modellvalg
- personverngateway
- autentiseringsmekanismer
- teknisk logging

UX-en skal derfor redusere opplevd kompleksitet selv om systemet teknisk er omfattende.

Produktet skal oppleves som:

- rolig
- profesjonelt
- menneskelig
- forutsigbart
- trygt
- spesialisert for lederstøtte

Det skal ikke oppleves som en generell chatbot.

---

# 2. UX-status

| Område | Status |
|---|---|
| Hovedlayout | Implementert |
| Sidemeny | Implementert |
| Temaoversikt | Implementert |
| Lys modus | Implementert |
| Mørk modus | Implementert |
| Hybridmodus | Implementert |
| Situasjonsflyt | Implementert |
| KI-veiledning | Implementert |
| Oppfølgingsdialog | Implementert |
| Samtalesimulator | Implementert |
| Personvernfeedback | Implementert |
| Historikk | Implementert |
| Admin | Implementert |
| Sammenleggbare seksjoner | Implementert |
| Responsiv tilpasning | Implementert og fysisk pilot-testet på mobil |
| PWA/installasjon | Implementert på støttede nettlesere |
| Full tilgjengelighetsvalidering | Videre arbeid |
| Fullskala brukertesting | Videre arbeid |

---

# 3. UX-prinsipper

## 3.1 Rolig visuelt uttrykk

Samtalestøtte brukes i situasjoner som kan være krevende for brukeren.

Designet skal derfor redusere visuell uro.

Det innebærer:

- begrenset fargepalett
- rolige bakgrunner
- få konkurrerende elementer
- tydelig luft mellom komponenter
- moderat bruk av visuelle effekter
- konsekvent bruk av ikoner og illustrasjoner

Farge skal brukes funksjonelt, ikke bare dekorativt.

---

## 3.2 Tydelig visuelt hierarki

Brukeren skal raskt forstå:

1. hvor de er
2. hva hovedoppgaven er
3. hva neste handling er
4. hva som er valgfritt
5. hvordan de går videre

Dette støttes gjennom:

- overskriftsnivåer
- avstand
- kort
- seksjoner
- knappestiler
- plassering
- typografi

Primære handlinger skal være tydelige uten at hele siden består av konkurrerende knapper.

---

## 3.3 Progressiv kompleksitet

Brukeren skal ikke eksponeres for hele systemets kompleksitet samtidig.

Avanserte funksjoner skal vises først når de er relevante.

Eksempler:

- Admin-seksjoner kan åpnes ved behov.
- `Rediger innhold` er lukket som standard.
- Modell- og kostnadsinformasjon ligger i Admin.
- Personvernstatus vises uten å dominere hovedoppgaven.
- Undertemaer skal ikke skape ekstra steg dersom KI-en allerede har identifisert relevant kontekst.

---

## 3.4 Konsistens

Samme type funksjon skal så langt som mulig ha samme:

- visuelle form
- knappestil
- ikonlogikk
- kortstruktur
- spacing
- bekreftelsesmønster
- overskriftsnivå

Brukeren skal ikke måtte lære grensesnittet på nytt fra side til side.

---

## 3.5 Menneskelig språk

Språket skal være:

- profesjonelt
- tydelig
- menneskelig
- nøytralt
- ikke-dømmende

Temaer og undertemaer skal ikke fremstille medarbeidere som en samling problemer.

Eksempler:

- `motivasjon` fremfor `manglende motivasjon`
- `kvalitet og prioritering` fremfor `dårlig kvalitet`
- `livssituasjoner` fremfor mer stemplende kategorier

---

# 4. Visuell identitet

## 4.1 Logo

Logoen symboliserer dialog mellom menneske og KI.

Den består av:

- oval samtaleboble
- menneskelig profil
- diskret KI-profil
- markert element i halen

Logoen skal brukes uten filtre eller tilfeldig fargeendring.

Original logo brukes i hybridvisning.

---

## 4.2 Farger

Hoveduttrykket bruker mørke petrol/blågrønne toner kombinert med lyse arbeidsflater.

Formålet er:

- ro
- profesjonalitet
- kontrast
- tydelig navigasjon
- sammenheng mellom UI og illustrasjoner

Varselsfarger skal reserveres for situasjoner som faktisk trenger oppmerksomhet.

---

## 4.3 Illustrasjoner

Temaillustrasjoner skal:

- ha beslektet stil
- bruke beslektet fargetemperatur
- støtte temaet
- ikke dominere teksten
- bidra til gjenkjennelse

Illustrasjoner skal ikke oppleves som tilfeldige enkeltbilder.

---

## 4.4 Typografi

Typografien skal gjøre hierarkiet tydelig.

Det skal være forskjell mellom:

- hovedoverskrift
- seksjonsoverskrift
- underoverskrift
- brødtekst
- hjelpetekst
- status
- knappetekst

Unødvendig mange størrelser og vekter skal unngås.

---

# 5. Visningsmoduser

Produktet støtter:

- lys modus
- mørk modus
- hybridmodus

## Hybridmodus

Hybridmodus er hoveduttrykket.

Den kombinerer:

- mørk sidemeny
- lys arbeidsflate

Dette gir tydelig separasjon mellom navigasjon og innhold samtidig som teksttunge områder forblir lyse og lesbare.

---

# 6. Overordnet layout

Desktop er referanseplattform for prototypen.

Grunnstrukturen er:

```text
┌──────────────────────┬─────────────────────────────────┐
│                      │                                 │
│      SIDEMENY        │          HOVEDINNHOLD           │
│                      │                                 │
│ Logo                 │ Overskrift                      │
│ Navigasjon           │ Arbeidsflate                    │
│                      │                                 │
└──────────────────────┴─────────────────────────────────┘
```

Sidemenyen brukes til navigasjon.

Hovedområdet skal fokusere på én hovedoppgave om gangen.

---

# 7. Sidemeny

## Åpen meny

Når menyen er åpen:

- eksisterende struktur beholdes
- logo vises
- tekstetiketter vises
- bruker skal raskt forstå funksjonene

## Lukket meny

Når menyen er minimert:

- menyknappen vises som ikon
- ikonene skal ligge visuelt på linje med tilhørende overskrift
- samme ikonlogikk brukes konsekvent
- logo/ikon skal fortsatt være gjenkjennelig

Målet er å spare horisontal plass uten å miste navigasjonsforståelse.

---

# 8. Hovedside

Brukeren skal raskt forstå hva Samtalestøtte brukes til.

Hovedsiden skal gi naturlige innganger til arbeidet:

- velg et tema
- beskriv situasjonen med egne ord

Brukeren skal ikke måtte forstå hele temaarkitekturen før arbeidet kan begynne.

---

# 9. Temaoversikt

Hovedtemaene skal presenteres med:

- konsistent kortstruktur
- tydelig navn
- relevant illustrasjon
- konsekvent spacing
- tydelig klikkbarhet

Ni hovedtemaer skal vises uten at siden oppleves visuelt overfylt.

På desktop kan temaene organiseres i en 3 × 3-struktur når skjermbredden tillater det.

---

# 10. Tema- og undertemasider

Når et hovedtema åpnes skal brukeren få:

- tydelig temaoverskrift
- relevante undertemaer
- enkel navigasjon videre
- mulighet for `Annet` der det er relevant

Undertemaene skal:

- være forståelige
- bruke nøytralt språk
- ikke fungere som en katalog over feil ved medarbeideren

---

# 11. Situasjonsbeskrivelse

Situasjonen skal normalt kunne beskrives i ett eller få tekstfelt.

Dette er et bevisst UX-valg.

Formålet er å redusere terskelen for å komme i gang og la KI bidra til struktureringen.

Tekstfeltet skal:

- være stort nok for naturlig tekst
- ha tydelig hjelpetekst
- minne om personvern
- gi personvernfeedback før KI-kall

---

# 12. Personvern som brukeropplevelse

Personvern skal være synlig i arbeidsflyten.

Brukeren skal forstå:

- at teksten kontrolleres
- hvorfor identifiserende informasjon bør fjernes
- hva som eventuelt er oppdaget
- hva brukeren kan gjøre videre

Normal status skal være diskret.

Ved funn skal brukeren få hjelp, ikke bare blokkering.

Eksempel på normal status:

**Personvernsjekk**  
Ingen tydelige personopplysninger er oppdaget i teksten.

Ved funn skal systemet kunne vise:

- hva som er oppdaget
- hvorfor det bør endres
- handling for å rette teksten

Tomme varselbokser skal unngås.

---

# 13. KI-veiledning

KI-veiledningen skal ikke fremstå som én lang tekstvegg.

Innholdet skal deles inn i relevante seksjoner som for eksempel:

- mål for samtalen
- før samtalen
- forslag til åpning
- spørsmål
- mulige reaksjoner
- hvordan reaksjoner kan møtes
- neste steg

Korte avsnitt og tydelige overskrifter skal gjøre innholdet skannbart.

---

# 14. Primære handlinger etter KI-veiledning

Etter hovedveiledningen skal brukeren enkelt kunne:

- fortsette dialogen
- rapportere et svar
- starte ny samtale
- gå videre til simulering når relevant

Viktige handlinger skal ligge på logiske steder og ikke tvinge brukeren til å lete gjennom siden.

---

# 15. Oppfølgingsdialog

Oppfølgingsdialogen skal visuelt høre sammen med hovedveiledningen.

Den skal ikke oppleves som en tilfeldig separat chatbot.

Brukeren skal tydelig se:

- egne meldinger
- KI-svar
- hvor ny melding skrives

Der det er relevant:

- Enter sender
- Shift+Enter lager ny linje

KI-svar i oppfølgingsdialogen bør normalt være kortere enn hovedveiledningen.

---

# 16. Samtalesimulator

## Formål

Simulatoren gir brukeren et sted å øve før den virkelige samtalen.

Den skal være en tydelig treningsmodus, men fortsatt visuelt tilhøre samme produkt.

---

## Roller

Brukeren spiller lederen.

KI spiller medarbeideren.

Rollene skal være tydelige gjennom:

- sideplassering
- avatar
- meldingsboble
- eventuell etikett

---

## Meldingsbobler

Meldingsboblene skal bruke konsistent geometri.

Venstre og høyre variant skal være speilvendte versjoner av samme visuelle prinsipp.

Forskjellen skal primært være:

- plassering
- farge
- avsender

Godkjent boblegeometri skal ikke endres tilfeldig av senere KI-genererte UI-endringer.

---

## Avatarer

Avatar og boble skal plasseres slik at:

- boblehalen peker naturlig mot avsender
- avstanden mellom avatar og melding er konsistent
- rollene er lett å forstå

---

## Simulator-CTA

Handlingen for å starte simulering skal være tydelig nok til at brukeren oppdager den.

Der det er hensiktsmessig kan handlingen vises både:

- nær hovedveiledningen
- etter relevant innhold

Dette reduserer behovet for å skrolle tilbake for å finne neste steg.

---

# 17. Historikk

Historikk skal hjelpe brukeren å finne tilbake til tidligere arbeid.

Den skal ikke se ut som et journalsystem.

Visningen kan inneholde:

- tema
- undertema
- dato
- type samtale
- kort identifikasjon

Unødvendig sensitiv tekst skal ikke vises i oversikten.

Brukeren skal kunne:

- åpne
- slette
- administrere egen historikk

---

# 18. Innstillinger

Innstillinger skal samle relevante personlige valg på ett logisk sted.

Dette kan inkludere:

- visningsvalg
- personverninformasjon
- kontakt
- andre brukerinnstillinger

Sekundære funksjoner skal ikke belaste hovednavigasjonen unødvendig.

---

# 19. Hjelp

Hjelpesiden skal være enkel å skanne.

Den kan inneholde:

- kort brukerveiledning
- forklaring av sentrale funksjoner
- kuraterte faglige ressurser

Sammenleggbare seksjoner skal bruke samme visuelle mønster som andre tilsvarende sider.

---

# 20. Admin UX

Adminområdet inneholder mange funksjoner og skal derfor prioritere oversikt fremfor dekorasjon.

Store områder skal bruke progressiv visning.

Eksempler:

```text
▶ Rediger innhold
▶ KI-modell
▶ Kostnad og tokenbruk
▶ Modellbenchmark
▶ Rapporterte svar
▶ Kildebruk
▶ Roller og brukere
```

`Rediger innhold` skal være lukket som standard.

Bare relevante seksjoner skal behøve å være åpne samtidig.

---

# 21. Admin – innholdsredigering

Admin/editor skal forstå:

- hva som kan redigeres
- om det finnes ulagrede endringer
- hva lagreknappen gjør
- når endringen blir synlig

Lagring av relevante endringer skal bruke tydelig bekreftelse.

Eksempel:

> Er du sikker på at du vil lagre endringene? Endringene blir synlige for brukerne med en gang.

Handlinger:

- Avbryt
- Lagre endringer

---

# 22. Admin – modellvalg

Modellvalg skal være et kontrollert valg.

Admin skal kunne se:

- aktiv modell
- tilgjengelige modeller
- relevant kvalitets-/kostnadsinformasjon

Modellvalg skal ikke baseres på et tilfeldig fritekstfelt dersom systemet allerede kjenner modellene.

---

# 23. Admin – avansert informasjon

Kostnad, modelltesting og kildeinformasjon er avanserte funksjoner.

De skal ikke dominere hovedproduktet.

I Admin kan de presenteres med:

- tydelige seksjonsoverskrifter
- kort forklaring
- progressiv visning
- sammenleggbare områder

Dette følger prinsippet om progressiv kompleksitet.

---

# 24. Feedback og feilrapportering

Det skal skilles tydelig mellom:

## Rapporter svar

Brukes når KI-svaret for eksempel er:

- irrelevant
- faglig tvilsomt
- urealistisk
- for generelt
- basert på misforstått kontekst

## Rapporter feil

Brukes når noe teknisk ikke virker.

Brukeren skal ikke måtte forstå utviklerterminologi for å velge riktig.

---

# 25. Responsive prinsipper

Desktop er referanseplattform for prototypen.

Ved mindre skjermbredde skal designet så langt som mulig:

- komprimere sidemeny
- legge kort under hverandre
- beholde lesbare tekstfelt
- tilpasse modaler/dialoger
- unngå horisontal scrolling

Responsivitet er implementert på prototypenivå og kan videreutvikles.

En egen mobilapp er ikke del av dagens leveranse.

---

# 26. Tilgjengelighet

Produktet skal så langt som praktisk mulig støtte grunnleggende tilgjengelighetsprinsipper.

Dette inkluderer:

- tilstrekkelig kontrast
- ikke bruke farge som eneste informasjonsbærer
- forståelige etiketter
- logiske overskriftsnivåer
- hensiktsmessig tekststørrelse
- luft mellom interaktive elementer
- tastaturbruk der det er relevant

Full WCAG-validering er ikke definert som ferdig leveransekrav og er videre arbeid.

---

# 27. UX-regresjon

KI-assistert utvikling kan utilsiktet endre allerede godkjent UI.

Derfor er følgende et eksplisitt UX-prinsipp:

> En ny endring skal ikke automatisk få endre en allerede godkjent komponent dersom dette ikke er en del av oppgaven.

Særlig beskyttede komponenter har vært:

- logo
- snakkebobler
- sidemeny
- overskriftsstruktur
- adminlayout

---

# 28. Eksempel på UX-korrigering gjennom testing

En regresjonstest for samtaleboblen feilet.

Ved gjennomgang viste det seg at:

- produksjonsutseendet var korrekt
- testen krevde en foreldet CSS-kommentar

Det ville vært feil å endre fungerende UI for å tilfredsstille en dårlig test.

Testen ble derfor korrigert.

Dette illustrerer at også testene må vurderes kritisk.

### Spor

`tests/test-bubble-cleanup.cjs`

---

# 29. UX-valg og begrunnelser

## Begrenset fargepalett

**Valg:** få hovedfarger.

**Begrunnelse:** reduserer visuell støy.

---

## Hybridvisning

**Valg:** mørk navigasjon + lys arbeidsflate.

**Begrunnelse:** skiller navigasjon fra innhold og beholder lesbarhet.

---

## Få tekstfelt

**Valg:** situasjonen beskrives normalt i ett eller få felt.

**Begrunnelse:** reduserer terskelen for å starte.

---

## Nøytrale temaformuleringer

**Valg:** ikke beskrive medarbeideren gjennom negative merkelapper.

**Begrunnelse:** støtter refleksjon og reduserer forhåndsdømming.

---

## Personvern i arbeidsflyten

**Valg:** personvern vises før KI-kall.

**Begrunnelse:** gjør personvern forståelig og handlingsrettet.

---

## Sammenleggbare seksjoner

**Valg:** avanserte sider bruker progressiv visning.

**Begrunnelse:** reduserer kognitiv og visuell belastning.

---

## Separat simulator

**Valg:** rollespill har tydelig egen modus.

**Begrunnelse:** brukeren skal ikke blande rådgivning fra KI med replikkene til den simulerte medarbeideren.

---

# 30. Design som skal unngås

Samtalestøtte skal unngå:

- mange konkurrerende farger
- inkonsistente komponenter
- tilfeldig illustrasjonsstil
- lange ustrukturerte KI-svar
- for mange like sterke handlinger
- tomme varselbokser
- skjult personverninformasjon
- unødvendig teknisk språk
- inkonsekvente sammenleggbare seksjoner
- funksjoner som ser klikkbare ut uten å være det
- adminflater der alt står åpent samtidig
- KI-genererte endringer av godkjent design uten eksplisitt behov

---

# 31. Brukertesting

## Status

**Delvis / videre arbeid**

Fullskala brukertesting er ikke ferdig.

Planlagt testing skal blant annet undersøke:

- om hovedflyten forstås
- om temaene er intuitive
- om KI-støtten oppleves relevant
- om simulatoren er forståelig
- om personvernvarsler gir mening
- om historikk er lett å bruke
- om brukeren finner sentrale funksjoner

Tidligere konkrete prosentmål skal behandles som evalueringsmål, ikke som dokumenterte resultater før testene faktisk er gjennomført.

---

# 32. UX-sporbarhet

| UX-område | Spor |
|---|---|
| Hovedlayout | `index.html`, `styles.css` |
| Navigasjon | `app.js`, `styles.css` |
| Temaoversikt | `app.js`, `index.html` |
| Personvernfeedback | `app.js`, `server.js` |
| Simulator | `app.js`, `styles.css` |
| Historikk | `app.js` |
| Admin | `app.js`, `styles.css` |
| UI-regresjon | `tests/test-ui-regression.cjs` |
| Samtaleboble | `tests/test-bubble-cleanup.cjs` |
| UX-BMAD | dette dokumentet |
| Prosessendringer | `docs/ai/AI-LOGG-SAMTALESTOTTE.md` |
| Historikk | Git + `CHANGELOG.md` |

---

# 33. Kjente UX-begrensninger

Den leverte løsningen er en prototype.

Følgende kan fortsatt forbedres:

- full tilgjengelighetstesting
- omfattende mobiltesting
- fullskala brukertesting
- detaljert måling av brukerflyt
- ytterligere responsiv finjustering
- videre kvalitetssikring på ulike nettlesere og skjermstørrelser

Disse områdene skal ikke fremstilles som ferdige dersom de ikke er verifisert.

---

# 34. Forhold til øvrige BMAD-dokumenter

UX-spesifikasjonen skal leses sammen med:

- `product-brief.md`
- `docs/bmad/PRD.md`
- `docs/bmad/ARCHITECTURE-BMAD.md`
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md`
- `docs/bmad/EPICS-AND-STORIES-BMAD.md`

Prosess og KI-styring:

- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`

Testing:

- `tests/`

---

# 35. UX-kriterier ved videre utvikling

Ved nye endringer skal følgende vurderes:

1. Gjør endringen hovedoppgaven lettere?
2. Øker den visuell kompleksitet?
3. Er samme mønster brukt andre steder?
4. Påvirkes eksisterende godkjent UI?
5. Påvirkes personvernforståelsen?
6. Påvirkes navigasjonen?
7. Krever endringen responsiv kontroll?
8. Krever den ny regresjonstest?
9. Er endringen observert behov eller bare et KI-forslag?

Dette siste punktet er særlig viktig i KI-assistert utvikling.

---

# Tillegg: Faglig transparens og kilder

Samtalestøtte skal ikke kreve at brukeren stoler blindt på KI-genererte råd.

Når faglig grunnlag er relevant, skal brukergrensesnittet så langt som mulig gjøre det enkelt å:

- se at rådet har faglig forankring
- se relevante kilder eller faggrunnlag
- åpne kilder selv
- gå videre til relevante fagsider
- skille mellom generell KI-veiledning og informasjon som bygger på konkrete kilder

Kildeinformasjon skal presenteres uten å overbelaste hovedsvaret.

Det primære samtalerådet skal fortsatt være lett å lese, mens mer detaljert faggrunnlag kan gjøres tilgjengelig gjennom for eksempel:

- lenker
- sammenleggbare kildeområder
- «Les mer»
- relevante fagsider

Ved sensitive eller regelstyrte spørsmål er transparens særlig viktig.

Dette gjelder blant annet:

- arbeidsrettslige forhold
- sykefravær og tilrettelegging
- varsling
- mobbing og trakassering
- vold og trusler
- HMS og sikkerhet

Brukeren skal kunne undersøke grunnlaget selv før viktige beslutninger tas.

## UX-prinsipp

Kilder skal ikke brukes som dekorasjon eller autoritetsmarkør.

En kilde skal bare vises som støtte for et råd når den faktisk er relevant for påstanden eller vurderingen.

Det skal være tydelig forskjell mellom:

1. konkret kildeinformasjon
2. faglig forankret veiledning
3. KI-ens egen syntese eller formulering

Målet er etterprøvbarhet uten at brukergrensesnittet blir unødvendig tungt.

# 36. Oppsummering

UX-målet for Samtalestøtte er å skjule unødvendig teknisk kompleksitet og gjøre en krevende lederoppgave mer oversiktlig.

Brukeren skal først og fremst oppleve:

> «Jeg forstår hva jeg skal gjøre, jeg har kontroll, og verktøyet hjelper meg gjennom en vanskelig oppgave.»

Den visuelle og funksjonelle UX-en bygger derfor på:

- rolig visuelt uttrykk
- tydelig hierarki
- progressiv kompleksitet
- menneskelig språk
- nøytrale formuleringer
- tydelig personvern
- konsistente komponenter
- tydelig simulatorrolle
- kontrollert adminflate
- beskyttelse mot UI-regresjoner

UX-spesifikasjonen beskriver den faktiske prototypen ved versjon 20.11.0, samtidig som ikke-verifiserte områder som full tilgjengelighet og fullskala brukertesting er eksplisitt markert som videre arbeid.

# Produksjonstillegg – mobil-first UX i v20.11.0

Pilotbruk gjorde det nødvendig å behandle mobil som en egen responsiv tilstand, ikke bare som komprimert desktop. Følgende prinsipper er nå del av levert UX:

- desktop-sidefelt skjules på mobil og erstattes av mobilnavigasjon
- toppfeltet bruker en kompakt, men tydelig Samtalestøtte-identitet
- Samtaleøvelse har egen KI-illustrasjon og skal ikke forveksles med produktlogoen
- logo og illustrasjoner kan åpnes i større forhåndsvisning
- samtaleflaten bruker mer av skjermbredden på små skjermer
- installasjon som PWA er synlig i Innstillinger
- installert PWA skal oppleves som eget appvindu når nettleseren støtter standalone-visning

Et viktig pilotfunn var at en teknisk endring kan treffe feil responsiv komponent. Endringer i desktop-sidefeltet ga ingen visuell effekt på mobil fordi dette elementet var skjult ved mobilbredden. Derfor er kontroll av faktisk renderet komponent og fysisk enhet nå eksplisitt del av responsiv kvalitetssikring.


## Hotfix 20.11.1 – grense mellom desktop/tablet og mobil

Produksjonskontroll viste at responsiviteten skiftet for tidlig til et mobilpreget uttrykk på smale PC-vinduer. Hovedgrensen for mobilmodus er derfor satt til 640 CSS-piksler. Over denne bredden skal Samtaleøvelse beholde desktop/tablet-hierarki med bilde ved siden av teksten, og i 641–900 px brukes to kolonner i startvalgene fremfor én ren mobilkolonne. Samme KI-illustrasjon brukes i alle fargetemaer.


## Hotfix 20.11.2 – kompakt desktop-topplinje

Mellombredder behandles nå eksplisitt som kompakt desktop i stedet for å presses inn i enten full desktop eller mobil. I 641–1500 CSS-piksler får toppfeltet strengere plassfordeling mellom logo, breadcrumb, temavelger, ny samtale og profil. I 641–1100 kan toppfeltet bruke to rader, men beholder desktopnavigasjon og full brukerprofil.

Målet er at innhold ikke skal overlappe eller forsvinne når et PC-vindu er omtrent halvstort, samtidig som mobilmodus fortsatt først starter ved 640 CSS-piksler.


## Hotfix 20.11.3 – visuell forankring i kompakt desktop

I kompakt desktop skal brukerprofilen fortsatt oppfattes som en global kontroll og derfor ligge helt mot høyre kant. Temavelger og øvrige handlinger komprimeres før profilen flyttes. Det er samtidig lagt inn fast venstrebuffersone for kontrollgruppen slik at den utstikkende sidefeltknappen ikke kommer visuelt for tett på temavelgeren.


## Hotfix 20.11.4 – visuell balanse i Historikk og Samtaleøvelse

Historikk bruker nå en todelt header på desktop: tekstinnhold til venstre og en separat, responsiv visuell flate til høyre. Logoen sentreres i denne flaten og skalerer dynamisk, slik at den beholder balanse ved ulike vindusbredder.

I Samtaleøvelse skal KI-illustrasjonen framstå som et visuelt merke, ikke som et kort. Derfor er dekorativ ramme, bakgrunn, skygge og avrundet boks fjernet rundt illustrasjonen. Responsiv størrelse og klikkbar større visning beholdes.


## Hotfix 20.11.5 – separat visuell kolonne og hover-kontrast

Historikklogoen skal aldri konkurrere med eller wrappe under overskriften. På desktop og kompakt desktop ligger den derfor i en egen høyrekolonne fra 641 CSS-piksler og opp. Kolonnen og logoen krymper dynamisk med tilgjengelig bredde, mens mobil under 640 px skjuler den dekorative logoen. Den visuelle plasseringen ligger høyt i den ledige høyre flaten og skal ikke skape ekstra vertikal høyde i tekstinnholdet.

På mørk og hybrid sidemeny skal hover/fokus/aktiv tilstand bevare høy kontrast. Raden bruker mørk teal bakgrunn, hvit tekst og tydelig ikon i stedet for lys/hvit hoverflate.
