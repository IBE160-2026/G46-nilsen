## v19.12.3 – ryddet snakkeboblekode

- Fjerner gamle og konkurrerende boble-/haleimplementasjoner.
- Én aktiv snakkebobleimplementasjon står igjen.
- Preview 9 er fasit: KI-boblen er masterformen, lederboblen er identisk speilvendt.
- Beholder v19.12.2-hotfixen for samtale og historikk.
- Ingen PNG-filer er endret eller pakket med.

## v19.12.2 – hotfix for samtale og historikk

- Retter dupliserte etiketter som `DuDU` og `SamtalestøtteSAMTALESTØTTE`.
- Samtalehistorikk lagrer nå bare selve meldingsteksten, ikke hele boble-DOM-en.
- SVG/UI-markup kan ikke lenger bli med i nye historikklagringer.
- Eldre forurensede historikkmeldinger renses ved innlasting.
- Escapet `**fet tekst**` og `\:` vises riktig i oppfølgingssvar.
- Ingen endringer i snakkebobledesign/CSS i denne hotfixen.

## v19.12.1 – fast størrelse på snakkeboblehale

- Boblekroppen kan igjen vokse naturlig med tekstmengden.
- Halen er et eget SVG-element med fast størrelse og strekkes aldri sammen med boblen.
- Simulatorhalen er gjort litt mindre enn halen i v19.12.0.
- Hovedsamtalen bruker samme løsning i en enda mer diskret størrelse.
- Høyre hale er kun en speilvendt variant av venstre.
- Infosidelogoene flyttes ytterligere 5 px opp.

## v19.12.0 – ekte SVG-bobler, mørk variant og kortere oppfølgingssvar

- Brukerens snakkeboblepath rendres nå som et faktisk SVG-element i hver samtaleboble.
- Ingen mask, CSS-trekant eller separat hale brukes lenger.
- Høyre boble er samme SVG-form speilvendt.
- Egen mørk-tema-variant med mørkere fyll og lysere, tynn kant.
- Hybridtema beholder lyse bobler i hovedinnholdet.
- Infosidelogoene flyttes 15 px opp fra v19.11.10.
- Oppfølgingssvar i «Fortsett samtalen» begrenses normalt til ca. 90–160 ord, maksimalt 4 korte avsnitt eller 3 punkter og 1–2 formuleringseksempler.
- KI skal ikke gjenta hele hovedveiledningen i et oppfølgingssvar.

## v19.11.10 – brukerens egen snakkeboble

- Bruker nå `snakkeboble.svg` direkte som fasit for hele boblesilhuetten.
- PowerPoint-bakgrunn, gradient, skygge og tykk originalstrek er fjernet fra SVG-filen.
- Boblekropp og hale er én sammenhengende SVG-path; ingen CSS-trekant eller pålimt pil.
- Høyre boble er bare en speilvendt variant av samme SVG.
- Samme form brukes i simulator og hovedsamtale, med mer kompakt størrelse i hovedsamtalen.
- Infosidelogoene flyttes 35 px ned fra v19.11.9-posisjonen.

## v19.11.9 – speech bubbles, logoplassering og stille auto-innlogging

- Erstatter CSS-pseudo-haler med en egen kurvet SVG-hale som visuelt smelter inn i boblen.
- Samme speech-bubble-form brukes i simulator og hovedsamtale; hovedsamtalen har en mindre variant.
- Fjerner alle gamle trekant-/pilhaler helt.
- Flytter infosidelogoene omtrent 82 px opp på desktop, i tråd med ønsket om minst ca. 2 cm.
- Beholder persistent innlogging, men sjekker eksisterende session før innloggingsvinduet vises, slik at login ikke blinker ved gyldig session.
- Invitasjons- og passordreset-lenker åpner fortsatt riktig auth-panel direkte.

## v19.11.8 – UI-opprydding og glemt passord

- Kontaktskjema vises før e-postalternativet på Kontakt.
- Infosidelogoene løftes tydeligere slik at boblehalen peker mot overskriften.
- Hybridlogoen lysnes mer, med ekstra lys gradering over første del av ordmerket.
- Snakkeboblene i simulator og hovedsamtale får mindre, roligere og mer integrerte haler.
- Enter sender i vanlig samtalemodus; Shift+Enter lager linjeskift.
- Synlig innloggingsdebug fjernes, mens normale feilmeldinger beholdes.
- Legger til «Glemt passord?» med e-postbasert Supabase-reset og valg av nytt passord.
- Registrering er fortsatt kun mulig med gyldig engangsinvitasjon.

## v19.11.7 – auth/KI hotfix

- KI- og simulatorkall sender nå eksplisitt innloggingscookies med `credentials: include`.
- Serveren validerer access-token stateless direkte mot Supabase i stedet for å være avhengig av en lokal auth-session.
- Utløpt access-token fornyes med refresh-token og nye HttpOnly-cookies sendes tilbake.
- 401-feil logger nå om access-/refresh-cookie faktisk var med i forespørselen.
- Meldingen «Ekte KI er ikke tilgjengelig» brukes ikke lenger feilaktig ved auth-problemer.

## v19.11.6 – persistent innlogging på Render

- Fjerner det midlertidige serverminnet (`Map`) som lagret aktive innlogginger.
- Supabase access- og refresh-token lagres nå i sikre, HttpOnly-cookies.
- Innlogging overlever dermed Render-redeploy, sleep og serverrestart.
- Supabase-session fornyes ved behov og roterte token lagres tilbake i cookie.
- Frontend sender eksplisitt same-origin credentials på auth-kall.
- Gamle `samtalestotte_session`-cookies ryddes ved utlogging.

## v19.11.5 – innlogging hotfix

- Retter JavaScript-feilen `carriedSituation is not defined` i `resetConversationState()`.
- Feilen stoppet `app.js` under oppstart og gjorde at knapper/innlogging ikke fikk registrert hendelseslyttere.
- Beholder midlertidig innloggingsfeilsøker for å verifisere hele kjeden etter deploy.

# v19.11.3 – tvungen innloggingsport

- Innloggingsvinduet vises umiddelbart når nettsiden åpnes dersom ingen gyldig sesjon finnes.
- Hele appskallet er `inert` og kan ikke klikkes eller fokuseres før innlogging er godkjent.
- Eksisterende brukere kan logge inn med brukernavn/e-post og passord.
- Nye profiler kan fortsatt bare opprettes med gyldig, ubrukt invitasjonskode.
- Invitasjonslenker åpner registreringspanelet direkte og fyller inn koden automatisk.

# v19.11.2 – hurtigfiks innlogging

- Bytter native dialog for innlogging til et robust, fast overlay som ikke låser siden uten synlig innloggingsboks.
- Logg på-knappen åpner alltid innloggingsfeltet.
- Innlogging støtter både e-post og brukernavn.
- Fjerner automatisk tvangsmodal ved sideinnlasting; beskyttede handlinger åpner innlogging ved behov.
- Beholder server-side sperre på beskyttede API-er.

# v19.11.1 – hurtigfiks innlogging

- Rettet påloggingsknappen slik at innloggingsdialogen alltid åpnes for utloggede brukere.
- Innloggingsdialogen forklarer tydelig at innlogging kreves for å bruke Samtalestøtte.
- Fjernet firkantet hoverflate rundt hele profil/Logg på-elementet.
- Oppdatert cache-versjon på CSS og JavaScript slik at Render-klienten henter de nye filene etter deploy.

# Versjon 19.10 – smartere temaforståelse og forbedret førsteflyt

- Ny KI-basert temaklassifisering som vurderer hele situasjonen i stedet for å stole på enkle nøkkelord.
- Eksplisitt skille mellom vanlig nett-/telefonbruk og faktiske sikkerhets- eller rusrelaterte signaler.
- Ved høy eller middels sikkerhet går brukeren direkte videre til foreslått hovedtema og undertema, med enkel «Endre tema»-mulighet.
- Ved lav sikkerhet vises noen få relevante temavalg i stedet for å late som systemet vet sikkert.
- Lokal personvernsjekk er lagt inn før første tema- og undertemaforslag, slik at tydelige identifikatorer stoppes før KI-kallet.
- Snakkeboblehalene i simuleringen er bygget om til en betydelig lengre, integrert og avsmalnende form.
- Hovedlogoen i hybridmenyen er lysnet for bedre kontrast.
- De små logosymbolene ved Om, Kontakt, Innstillinger, Historikk, Personvern og Vilkår er løftet slik at boblehalen visuelt peker mot øvre del av overskriften.
- Ny statisk test: `npm run test-ui:v19.10`.

# v19.9.0 – Hybridtema og siste visuelle justeringer

- Lagt til nytt tema **Hybrid** og gjort det til standard: mørk petrolfarget sidemeny med lys tekst og lyst hovedinnhold.
- Flyttet **Historikk** opp i hovedmenyen og **Innstillinger** ned sammen med Om og Kontakt.
- Gjort logoen på Om, Kontakt, Innstillinger, Historikk, Personvern og Vilkår mindre og plassert den direkte til høyre for selve overskriften.
- Kontakt-siden viser «Foretrekker du e-post?» først og kontaktskjemaet under, i konsistente fullbredde bokser.
- Kontaktadressen er låst til **cecilie.c.nilsen@himolde.no**, slik at en gammel lokal `.env` ikke overstyrer den.
- Simulatorens chatbobler er endret til en mer klassisk chatboble: avrundet tekstboks med en myk, integrert hale mot avsenderens profil.
- Hybrid er lagt til i både topplinjens temavelger og Innstillinger.
- Personvernerklæringen omtaler også Hybrid som et lokalt lagret temavalg.
- Forsidebildet kan byttes til den nye realistiske, tekstfrie varianten separat; PNG-filer følger fortsatt ikke med i kodepakken.

---


# v19.7.0 – Simulatorpolering og personvern i live-chat

- Snakkebobler i simuleringen har fått lengre, mykere og tydeligere haler som peker mot profilene uten å treffe avatarene.
- «Personvern», «Utvid samtalen» og «Avslutt øvelse» bruker samme kompakte pill-stil.
- Personvernkontrollen kjører nå også på hver melding i simuleringen før sending. Tydelige identifikatorer blokkeres, mens mykere funn gir råd om generalisering.
- Brukeren kan generalisere flagget tekst direkte i simuleringsfeltet før sending.
- Logo på Om, Kontakt, Innstillinger, Historikk og juridiske sider er større og plassert til høyre for overskriftsteksten.


## 19.6.0
- La personvernspåminnelse synlig på Samtalesimulering.
- Enter sender melding i simulatoren; Shift + Enter gir linjeskift.
- Gjorde «Ny samtale» i toppbaren mer kompakt.
- Tilpasset «Utvid samtalen» til øvrig knappestil og hindret grid-rader i å strekkes ved utvidelse.
- Gjorde snakkeboblehaler tydeligere både på simulatorinnganger og i live-chatten.
- Innførte mer petrolpreget og konsekvent hover-feedback i lys og mørk modus.
- Flyttet symbolslogo ved siden av overskriften på innstillinger, historikk, personvern, vilkår, om og kontakt.
# CHANGELOG – Samtalestøtte

## v19.5 – Opprydding før brukertest

### Navigasjon og tema
- Fjernet duplisert «Ny samtale» fra sidemenyen fordi Hjem dekker samme inngang.
- Toppknappen heter nå «＋ Ny samtale» og skjules på Hjem-siden.
- Fargetemavelgeren er gjort mer kompakt både i toppfeltet og under Innstillinger.

### Historikk og mørk modus
- Rettet feil der Historikk-kort og juridiske dokumenter kunne bruke hardkodet lys bakgrunn i mørk modus.
- Historikk, tomtilstand og juridiske sider følger nå appens felles tema-variabler.

### Personvernkontroll
- Personvernkontrollen er delt i to nivåer.
- Tydelige identifikatorer som navn, e-post, telefon, fødselsdata, identifikasjonsnummer og adresse blokkerer fortsatt sending.
- Indirekte opplysninger som eksakt alder, konkret arbeidssted, unik rolle og detaljerte familieopplysninger gir nå en myk anbefaling om generalisering, men stopper ikke brukeren.
- Kjønnede pronomen alene («han/hun») blokkeres ikke lenger.
- Når ingen tydelige identifikatorer finnes, vises kun en kompakt statuslinje i stedet for en stor grønn boks.
- Samme to-nivå-prinsipp brukes når en ny samtalesimulering startes direkte.

### Layout og identitet
- Personvern- og informasjonsbokser er smalere og sentrert for tydeligere hierarki.
- Eksisterende Samtalestøtte-logo vises på Innstillinger, Historikk, Personvern, Bruksvilkår, Om og Kontakt.
- Ingen logo-, profil-, hero- eller temabildefiler er endret i denne versjonen.

### Dokumentasjon
- `package.json` oppdatert til v19.5.0.
- Hele tidligere changelog-historikken er bevart.

---

## v19.4 – Tydeligere øvelsesrom og simulatorchat

### Samtaleflyt og oppmerksomhet
- Selve øvelsesområdet er gjort visuelt tydeligere slik at brukeren raskere ser hvor samtalen starter.
- Introduksjonsteksten i tom chat vises som en kort instruksjon i stedet for en stor, tom snakkeboble.
- Samtaleområdet er gjort høyere som standard, slik at flere meldinger kan vises samtidig.
- Lagt til **Utvid samtalen / Normal størrelse** i statuslinjen for brukere som ønsker å se mer av dialogen uten å avslutte øvelsen.

### Avatarer og snakkebobler
- Profilavatarene i selve simuleringschatten er gjort større og viser hele profilen med `object-fit: contain` i stedet for hard beskjæring.
- **Kun i simuleringschatten** speilvendes avatarene slik at begge profilene vender inn mot dialogen: medarbeider/KI fra venstre mot høyre, leder fra høyre mot venstre.
- Denne speilvendingen påvirker ikke logo, sidemeny eller andre illustrasjoner i appen.
- Snakkeboblenes haler er gjort lengre og tydeligere slik at de peker mot riktig avatar og er lettere å lese som dialog.
- Maksbredden på meldingsboblene er økt noe for bedre utnyttelse av større skjermer.

### Simulatorinnganger
- **Øv på eksisterende samtale** er endret til **Øv på denne samtalen**.
- Valget skjules helt når det ikke finnes en aktiv samtale med nok kontekst, i stedet for å vises deaktivert uten tydelig nytte.
- Når valget skjules, tilpasses startflaten automatisk til to relevante innganger.
- Øv-på-samtalen-kortet i vanlig KI-veiledning er gjort mer synlig med tydeligere petrolflate, sterkere knapp og logosymbol.

### Kontroller i øvelsen
- **Si dette** er flyttet til venstre side i tråd med primærhandlingene ellers i løsningen.
- KI-støtte ligger fortsatt ved siden av som sekundær handling når støtte er aktivert.
- Statuslinjen bruker logosymbolet i stedet for en generisk liten boble.

### Testing og dokumentasjon
- Lagt til `test-simulation-v19-4.js` for å kontrollere avatarretning, full profilvisning, utvidbar chat, skjuling av irrelevant eksisterende-samtale-valg og venstrejustert primærhandling.
- `package.json` oppdatert til v19.4.0.
- `README-V19.md` oppdatert med v19.4-endringene.
- Eksisterende changelog-historikk er bevart; v19.4 er lagt øverst uten å overskrive tidligere versjoner.

---

## v19.3 – Simulatoridentitet, mørkmodus og utvidet Om-side

### Samtalesimulator
- **Overrask meg** er strammet ytterligere inn. Reaksjonen skal nå gi lederen noe reelt uventet å forholde seg til, og unngå standardsvar om uklare forventninger når dette ikke faktisk er overraskende.
- I **Hold deg til saken** skal overraskelsen ligge i reaksjon, spørsmål eller perspektiv uten å etablere nye fakta.
- I **Utfordre meg** kan overraskelsen fortsatt bestå av en plausibel ny rollespillopplysning.
- **Følelsesmessig berørt** er justert mot kortere, mindre ferdigpolerte svar med mer naturlig nøling og mindre umiddelbar problemløsning.

### Logo og samtalebobler
- Simulatorens topp bruker nå en egen hardt beskåret symbolfil fra den eksisterende Samtalestøtte-logoen. Ordmerket er ikke lenger en del av ressursen som vises i simulatoren.
- Logosymbolet er gjort betydelig større i simulatorens hovedflate.
- KI-profilen fra logoen brukes som avatar for medarbeider/KI i rollespillet.
- Menneskeprofilen fra logoen brukes som avatar for bruker/lederen.
- Samtaleboblene har fått større og tydeligere haler, mer avrundet form og tydeligere avstand mellom avatar og tekst, slik at dialogen leses som snakkebobler fremfor vanlige kort.
- Simulatorikonet i sidemenyen bruker en egen beskåret KI-profil i stedet for hele logoen.

### Mørk modus
- Personvernadvarsler bruker en tydeligere, dus rosafarge i mørk modus.
- Tekst og kant på advarselsflater er justert for bedre kontrast.
- Godkjent/klar-til-sending-status bruker en lysere petrolfarge som skiller seg fra appens øvrige mørke flater.

### Om Samtalestøtte
- Om-siden er utvidet med bakgrunnen for hvorfor løsningen er utviklet.
- Beskriver gapet som kan oppstå mellom generell lederkunnskap og praktisk trening i krevende samtaler.
- Forklarer tydeligere hvordan KI-støtten og samtalesimulatoren brukes som praktisk supplement, ikke som fasit eller erstatning for faglig vurdering.
- Utviklerinformasjonen er anonymisert til **studenten CCN**.
- Det fremgår at løsningen er utviklet av studenten CCN i samarbeid med **ChatGPT fra OpenAI** som del av en prosjektoppgave ved Høgskolen i Molde.
- Ansvarsfordelingen i utviklingsprosessen beskrives: studenten har hatt ansvar for behovsforståelse, faglig retning, krav, innhold og produktvalg; ChatGPT er brukt som støtte i idéutvikling, programmering, testing og kvalitetssikring.

### Testing og dokumentasjon
- Lagt til strukturell v19.3-test for nye logoressurser, avatarer, mørkmodusfarger, Om-side og simulatorprompt.
- `README-V19.md` oppdatert til v19.3.
- Komplett `CHANGELOG.md` fra v1 er bevart og v19.3 er lagt øverst uten å erstatte tidligere historikk.

---

## v19.2 – To simuleringsmoduser og visuell opprydding

### Samtalesimulering
- Lagt til to tydelig forskjellige simuleringsmoduser før valg av støtte og reaksjonsstil.
- **Hold deg til saken** er ny standardmodus. Medarbeideren kan improvisere følelser, holdninger, spørsmål, motstand og reaksjoner, men skal ikke etablere nye verifiserbare fakta som ikke finnes i saken eller den tidligere dialogen.
- Faktamodusen er eksplisitt instruert til å unngå sikre ja/nei-svar på forhold som ikke er kjent, for eksempel alkoholinntak, tidligere hendelser eller arbeidsrutiner som ikke er beskrevet.
- **Utfordre meg** tillater plausible, relevante og uventede rollespillopplysninger for generell trening.
- Nye opplysninger i fri modus er uttrykkelig definert som **simulerte rollespillfakta** og skal ikke behandles som fakta om den virkelige saken.
- Fri modus skal ikke motsi etablerte fakta eller introdusere ekstreme/svært sensitive vendinger bare for å gjøre øvelsen vanskeligere.
- Valgt simuleringsmodus lagres sammen med selve simuleringen i historikken.

### Reaksjonsstiler
- **Følelsesmessig berørt** er justert slik at følelsen kan komme tydeligere fram gjennom nøling, pauser og vansker med å konkretisere, uten melodrama eller oppdiktede årsaker.
- **Usikker og tilbaketrukket** tillater tydeligere korte og forsiktige svar.
- **Overrask meg** er styrket slik at reaksjonen faktisk skal være mindre forutsigbar og kan utfordre lederen med spørsmål, kort avvisning, uventet enighet eller et annet perspektiv.
- I fri modus kan Overrask meg også bruke en plausibel ny opplysning når dette gir treningsverdi.

### Simulator-UI
- Oppsettet er nå: simuleringsmodus → treningsstøtte → reaksjonsstil.
- Aktiv modus forklares tydelig i en egen rollegrense-/informasjonsboks.
- Simulatorens statuslinje viser både simuleringsmodus og reaksjonsstil.
- Bedre avstand mellom statusinformasjon og **Avslutt øvelse**.
- Samtaleboblene er gjort litt større og luftigere.

### Logo og navigasjon
- Simulatorens hovedside bruker den eksisterende Samtalestøtte-logoen uten ordmerket ved å vise bare symbolområdet av den faktiske logoressursen.
- Simulatorikonet i sidemenyen bruker KI-profilen fra den faktiske logoen i stedet for et generisk snakkebobleikon.
- **Ny samtale** bruker nå snakkebobleikon.
- **Om** og **Kontakt** er flyttet til en tydelig separat seksjon nederst i sidemenyen.

### Mørk modus og statusflater
- Personvern-, varsel- og informasjonsbokser er harmonisert i størrelse, padding og hjørneradius.
- Den sterke grønne OK-statusen i mørk modus er tonet ned til en dempet petrolflate.
- Varslingsfargen i mørk modus er endret fra brunlig tone til en roligere støvrosa/beige retning.

### Testing
- Lagt til egen strukturell v19.2-test for de nye simuleringsmodusene og UX-endringene.
- Lagt til nytt live-testsett som skiller mellom **Hold deg til saken** og **Utfordre meg**.
- Faktamodus-testene ser spesielt etter små oppdiktede fakta som tidligere passerte automatiske kontroller.
- Fri modus-testene vurderer om improvisasjonen er plausibel, relevant og uten ekstreme eller usikre sidespor.
- Ny kommando: `npm run test-simulation:v19.2`.
- Ny live-kommando: `npm run test-simulation:v19.2:live`.

### Dokumentasjon
- `README-V19.md` oppdatert til v19.2.
- Den komplette changelog-historikken fra v1 er gjenopprettet i prosjektpakken.
- Fast vedlikeholdsregel beholdes: nye versjoner skal legges øverst i samme `CHANGELOG.md`; eldre historikk skal aldri erstattes av en gammel kopi.

---

> **Rekonstruert 25.09.2026**
>
> Denne filen er rekonstruert fra tidligere versjoner, prosjektpakker, testresultater og dokumentert utviklingshistorikk etter at en nyere prosjektpakke utilsiktet overskrev den løpende `CHANGELOG.md`.
>
> **Fast regel fra nå av:** `CHANGELOG.md` er én kontinuerlig prosjektfil. Nye versjoner skal legges øverst i filen. Filen skal aldri erstattes av en eldre kopi fra en ZIP-pakke.
>
---

## v19.1 – Simulator som egen modul og live-testing

### Samtalesimulering
- Samtalesimulatoren ble flyttet fra å være en funksjon inne i en eksisterende samtale til en egen hovedmodul i applikasjonen.
- Brukeren kan starte simulering fra en eksisterende samtale og gjenbruke konteksten fra saken.
- Brukeren kan også starte en ny simulering direkte uten å gå gjennom vanlig KI-veiledning først.
- Direkte simulering krever en kort beskrivelse av situasjonen før øvelsen starter.
- Simulatorens startside fikk egne innganger for:
  - øvelse basert på eksisterende samtale
  - ny simulering
  - tidligere øvelser
- Midlertidige øvelser kan gjennomføres uten lagring i historikken.

### Brukeropplevelse
- Simulatoren fikk et tydeligere visuelt skille fra vanlig samtalestøtte.
- Leder og medarbeider vises som hver sin side av dialogen.
- Reaksjonsstil og treningsmodus vises under øvelsen.
- Simulatoren viderefører valgene fra v19.0 for selvstendig trening og trening med KI-støtte.

### Testing
- Eget live-testsett for samtalesimulatoren ble lagt til.
- Første live-test bestod av 8 representative personalsaker:
  - fravær
  - prestasjon
  - rus/bekymring
  - sikkerhetskritisk samarbeid
  - rolle/lønn/utvikling
  - livssituasjon
  - prøvetid/avslutning
  - «Overrask meg»
- Første live-test: **8 OK · 0 bør sjekkes · 0 tekniske feil** etter automatiske kontroller.
- Manuell gjennomgang viste at enkelte svar kunne introdusere nye konkrete detaljer selv om automatiske tester ikke flagget dem.
- En ekstra runde 2 ble derfor laget for å presse simulatoren med:
  - klønete lederformuleringer
  - stillhet og emosjonelle reaksjoner
  - utfordring av lederens premiss
  - forsvar og ansvarsforskyvning
  - ledende spørsmål
  - sikkerhetsdialog
  - «Overrask meg»
- Runde 2: **8 OK · 0 bør sjekkes · 0 tekniske feil** etter automatiske kontroller.
- Manuell evaluering viste behov for et tydeligere skille mellom faktabasert simulering og friere trening. Dette ble grunnlag for planleggingen av v19.2.

---

## v19.0 – Samtalesimulering

### Ny hovedfunksjon
- Lagt til **«Øv på samtalen»** etter KI-veiledningen.
- KI-en spiller medarbeideren.
- Brukeren trener i lederrollen og skriver det vedkommende faktisk ville sagt.
- Samtalen bruker konteksten fra den aktuelle saken.

### Treningsmodus
- Lagt til:
  - **Øv selv** – KI-en spiller bare medarbeideren, uten hjelp underveis.
  - **Øv med KI-støtte** – brukeren kan be om støtte underveis.
- KI-støtten er valgfri og vises først når brukeren ber om den.
- Støtten kan gi hjelp til neste formulering, spørsmål eller respons.

### Reaksjonsstiler
- Lagt til flere medarbeiderstiler:
  - samarbeidsvillig
  - usikker / tilbaketrukket
  - defensiv / uenig
  - følelsesmessig berørt
  - frustrert / kritisk
  - **Overrask meg**
- Reaksjonene skal være realistiske og dynamiske, uten karikatur.

### Avslutning og refleksjon
- Øvelsen kan avsluttes når som helst.
- Etter øvelsen gis faglig refleksjon uten poeng eller karakter.
- Tilbakemeldingen struktureres rundt:
  - hva som fungerte godt
  - hva som kunne vært tydeligere
  - alternativ formulering
  - viktigste læringspunkt
- Lagt til mulighet for å prøve samme samtale på nytt.

### Personvern og sikkerhet
- Simulatoren fikk egne regler mot å finne på diagnoser, familieforhold, konfliktbakgrunn, motiv eller annen sensitiv informasjon som ikke finnes i saken.
- Midlertidige samtaler skal heller ikke lagre simuleringen.
- Simulatoren bruker eksisterende personvernkontroll.

### Testing
- **16/16 simulator-kontroller bestått.**
- **26/26 personverntester bestått.**
- `app.js` og `server.js` bestod syntakssjekk før pakking.

---

## v18.3 – UX, personvern og beta-informasjon

### Navigasjon
- «Forbered samtale» ble erstattet med **«Ny samtale»** i venstremenyen.
- Lagt til **Ny samtale** nederst i samtalevisningen slik at brukeren slipper å scrolle til toppen.
- Reduserte overlapp mellom flere innganger som gjorde samme jobb.

### Profil og innlogging
- Profilmenyen lukkes når brukeren klikker utenfor menyen.
- Profilmenyen kan lukkes med `Esc`.
- Innloggingsvinduet kan lukkes ved klikk utenfor dialogen.

### Om og kontakt
- **Om Samtalestøtte** og **Kontakt** åpnes i hovedinnholdsfeltet i stedet for langt nede på den eksisterende siden.
- Om-siden beskriver formålet med løsningen.
- Det opplyses at Samtalestøtte er utviklet av **Cecilie C. Nilsen** i forbindelse med en prosjektoppgave ved **Høgskolen i Molde**.
- Produktstatus ble endret til:
  - **Betaversjon – under utvikling og testing**
- Personvernerklæring, bruksvilkår og kontakt ble gjort tilgjengelig fra Om-siden.

### Personvern
- Navnedeteksjonen ble forbedret slik at den ikke er avhengig av stor forbokstav.
- Norske navn kan gjenkjennes også med små bokstaver.
- Eksempler som ble eksplisitt vurdert/testet inkluderer:
  - `trude`
  - `knut`
  - `kine`
  - `gro`
  - `reidun`
  - `cecilie`
- Kontekst rundt ordet brukes for å redusere falske positiver.
- Navnekontrollen utføres lokalt før teksten sendes til KI.

### Testing
- **26/26 personverntester bestått.**

---

## v18.2 – Om, kontakt, feilrapportering og UI-forbedringer

### Om Samtalestøtte
- Lagt til egen Om-funksjon med kort beskrivelse av hva applikasjonen er og hva den skal brukes til.
- Presisert at rådene er veiledende og ikke erstatter HR-, juridisk eller annen nødvendig faglig vurdering.

### Kontakt og tilbakemelding
- Lagt til egen kontakt-/tilbakemeldingsfunksjon for testbrukere.
- Brukeren kan melde:
  - tekniske feil
  - dårlige eller uklare KI-svar
  - feil i kildehenvisninger
  - personvernproblemer
  - forbedringsforslag
- Lagt til **«Rapporter feil»** direkte fra samtalevisningen.
- Versjonsnummer kan brukes i forbindelse med feilrapportering.
- Kontaktadresse kan konfigureres via miljøvariabel.

### Samtaleflyt
- Flere tilgjengelige innganger til **Ny samtale** ble lagt til.
- «Ikke lagre denne samtalen» ble gjort om til en mer diskret løsning for **Midlertidig samtale**.
- Midlertidig samtale betyr at samtalen ikke lagres i historikken.

### Supabase
- Oppdatert oppsett for nødvendige tabellrettigheter.
- `authenticated`-rollen fikk nødvendige CRUD-rettigheter til `conversations`, mens RLS fortsatt begrenser brukeren til egne data.

---

## v18.1 – Supabase Auth, historikk og invitasjoner

### Migrering fra lokal pilotlagring
- Konto- og historikkfunksjonene fra v18.0 ble flyttet fra lokal JSON-lagring til Supabase.
- Supabase ble lagt inn som varig backend for pilot/test.

### Supabase Auth
- Innlogging og kontoer flyttet til **Supabase Auth**.
- E-post brukes som autentiseringsidentitet.
- Eksisterende lokale passordfiler og egen lokal passordverifisering ble erstattet av Supabase Auth.

### Historikk
- Samtalehistorikk flyttet til Supabase-databasen.
- Tabell `conversations` ble etablert med bruker-ID og samtaledata.
- Row Level Security (RLS) ble aktivert.
- Policies ble laget for at en bruker bare kan:
  - lese egne samtaler
  - opprette egne samtaler
  - oppdatere egne samtaler
  - slette egne samtaler

### Lukket registrering
- Invitasjonsløsningen ble flyttet til Supabase.
- Éngangs-invitasjoner beholdes som mekanisme for lukket pilot.
- `create-invite.js` ble oppdatert for Supabase.
- `service_role` fikk nødvendige tabellrettigheter til invitasjonstabellen.

### Teknisk oppsett
- `@supabase/supabase-js` ble lagt til som avhengighet.
- Miljøvariabler for Supabase ble innført:
  - `SUPABASE_URL`
  - `SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SECRET_KEY`
- Secret key brukes kun server-side.
- Publishable key brukes sammen med RLS.

### Feilretting
- Lagring av samtaler feilet først på grunn av manglende tabellrettigheter for `authenticated`.
- Dette ble rettet med eksplisitte databaseprivilegier uten å deaktivere RLS.

---

## v18.0 – Konto, historikk og lukket pilot

### Brukerkonto
- Første komplette pilot for brukerkontoer.
- Lokal kontoimplementasjon med:
  - brukernavn
  - e-post
  - passord
- Passord lagres ikke i klartekst.
- Lokal implementasjon brukte `scrypt`-basert hashing.
- Innlogget bruker vises med initialer og brukernavn.
- Uinnlogget bruker ser «Logg på».

### Lukket pilot
- Registrering begrenses gjennom éngangs-invitasjonslenker.
- Invitasjonslenker kan opprettes lokalt.
- Inviterte brukere registrerer egen e-post, brukernavn og passord.
- Invitasjonen kan bare brukes én gang.

### Historikk
- Innloggede brukere kan lagre samtaler i historikken.
- Mulighet for:
  - visning av tidligere samtaler
  - sletting av enkeltsamtaler
  - sletting av all historikk
  - sletting av konto
- Lagt til valg for å ikke lagre en samtale.
- Ny samtale varsler dersom brukeren har aktivt innhold som ikke er lagret.

### Personvern og juridisk informasjon
- Første utkast til:
  - personvernerklæring
  - bruksvilkår
- Brukeren får ansvar for å unngå unødvendige identifikatorer og følge virksomhetens taushets-, sikkerhets- og interne regler.
- Samtidig ble det presisert i prosjektarbeidet at personvernansvar ikke kan «avtales bort» gjennom bruksvilkår.

### Teknisk begrensning
- v18.0 brukte lokal JSON-lagring for konto og historikk.
- Dette ble uttrykkelig vurdert som pilot/prototype og ikke som produksjonsklar lagring for ekstern drift.

### Testing
- Personverntestene ble utvidet til **22/22 bestått**.

---

## v17.10 – Personvern, fagbank og UI

### Personvern
- Personvernkontrollen ble utvidet til å se etter kombinasjoner som kan gjøre en person identifiserbar.
- Eksempler:
  - antall barn + kjønn + eksakt alder
  - familieforhold + konkrete alderstrinn
  - rolle + sted + annen spesifikk informasjon
- Eksempel på generalisering:
  - «har to døtre på 7 og 9» → «har flere barn i småskolealder»
  - «har en sønn på 16» → «har et barn i tenårene»
  - «har tre barn på 2, 5 og 8» → «har flere barn i barnehage- og småskolealder»
- Prinsipp etablert:
  - **Anonymiser identitet, ikke situasjonsrelevant kontekst.**

### Arbeidssted og organisasjonskontekst
- Eksakte arbeidssteder kan generaliseres til funksjonell kontekst i stedet for å fjernes helt.
- Eksempler:
  - konkret barnehage → «en barnehage»
  - konkret forsvarsavdeling → «en sikkerhetskritisk virksomhet»
  - konkret HR-avdeling → «en intern støtteavdeling»
  - unik spesialiststilling → «en spesialisert fagrolle»

### Fag- og kildebank
- Fagbanken ble utvidet til **33 kuraterte kilder**.
- Minimum fem kilder per hovedtema.
- Kildehierarki:
  - norsk lov og myndighet
  - anerkjente norske fagmiljøer
  - systematiske oversikter/metaanalyser
  - sentrale fagfellevurderte artikler og teorier
- Faglig lag omfatter blant annet:
  - LMX
  - psykologisk trygghet
  - transformasjonsledelse
  - situasjonsledelse med forbehold
  - selvbestemmelsesteori
  - målsetting
  - feedback
  - organisatorisk rettferdighet
  - JD-R
  - relasjonell ledelse
  - motiverende intervju
  - aktiv lytting
  - konfliktteori
  - endringskommunikasjon
  - intensjonsbasert ledelse / mission command
- Kildebanken er en kvalitetsforankring, ikke en lukket liste.
- KI kan supplere med relevante, pålitelige og oppdaterte kilder ved behov.
- Mental helse fikk bredere kildegrunnlag, blant annet NAV, WHO og STAMI.

### UI
- Nytt og mer konsekvent ikonsett for de åtte hovedtemaene.
- Ikonene følger samme tynne petrol/teal-stil.
- «Slik forstår jeg det»-området ble visuelt tydeligere som KI-generert innhold og mindre likt brukerens eget tekstfelt.

### Testing
- **17/17 personverntester bestått.**

---

## v17.9 – UX-flyt og mer presis temaforståelse

### KI-flyt
- KI-en identifiserer hovedtema og undertema samtidig.
- Reduserer unødvendig repetisjon og ekstra steg.
- Kortere og mer kompakt situasjonsforståelse.

### Avklaringsspørsmål
- Svaralternativer kan velges som flervalg når flere svar er relevante.
- Brukergrensesnittet bruker eksisterende valgbare knapper/chips i stedet for tradisjonelle checkbokser.
- Etter avklaring scrolles visningen automatisk til KI-ventestatus/spinner.

### Startfelt
- Tekst fra startsiden videreføres som førsteutkast inn i samtalen.
- Målet er at teksten enkelt kan erstattes ved skriving, men også beholdes og redigeres ved behov.

### Brukeropplevelse
- Mindre gjentakelse av brukerens situasjonsbeskrivelse.
- Fokus på raskere overgang fra beskrivelse til relevant støtte.

---

## v17.8 – Forbedret navne- og kontekstdeteksjon

### Personvern
- Forbedret lokal deteksjon av norske personnavn.
- Rettet falsk positiv der ordet «personen» kunne tolkes som navn.
- Rettet tilfeller der navn skrevet med liten forbokstav, blant annet `knut`, kunne passere.
- Kontekst rundt mulige navn ble brukt for å skille navn fra vanlige ord.

### Testing
- Eget sett med navne-/personverntester.
- **9 tester** knyttet til navne- og kontekstlogikk ble brukt i denne fasen.

---

## v17.7 – Ny KI-flyt

### Samtaleflyt
- KI-flyten ble forenklet slik at brukeren møter færre unødvendige trinn.
- Målet ble tydeligere:
  - forstå situasjonen
  - stille kun nødvendige avklaringsspørsmål
  - gå videre til konkrete råd
- Flyten ble tilpasset ønsket om en samtalepartner fremfor et tradisjonelt HR-skjema.

---

## v17.6 – Tematest og stabilisering av stresstest

### Automatisert kvalitetssikring
- Temakontrollen i stresstesten ble gjort mer fleksibel.
- Reduserte feil der et faglig relevant svar ble flagget kun fordi temaklassifiseringen ikke var formulert helt likt forventet resultat.

### Testresultat
- Full stresstest endte med:
  - **37 OK**
  - **0 bør sjekkes**
  - **0 kritiske avvik**
  - **0 tekniske feil**
- Testresultatet dokumenterer struktur-, sikkerhets- og konsistenskontroll, ikke at alle faglige råd automatisk er perfekte.

---

## v17.5 – Testmotor, tekniske feil og negasjon

### Testmotor
- Forbedret klassifisering av tekniske feil.
- Lagt til bedre retry-håndtering.
- Forbedret hvordan testen tolker negasjoner.
- Reduserte falske kritiske treff når modellen eksplisitt avviser eller korrigerer en problematisk påstand.

---

## v17.4 – Smartere kontroll av påstander

### Stresstest
- Forbedret deteksjon av når KI-en adopterer en ubekreftet påstand versus når den omtaler påstanden kritisk eller korrigerer den.
- Viktig for saker som:
  - mistanke om rus
  - motivasjon/«dårlig holdning»
  - skyld og intensjon
- Testlogikken ble mindre sårbar for å flagge riktig sikkerhetsadferd som feil.

---

## v17.3 – Personalsak-stresstest

### Testing
- Utvidet testsett til **37 krevende personalsaker**.
- Testene dekker blant annet:
  - alkohol/rus
  - prestasjon
  - fravær
  - konflikt
  - sikkerhet
  - livssituasjon
  - lønn/utvikling
  - prøvetid og avslutning
- Egen problemtest kunne kjøres mot tidligere feilcaser.

### Testkommandoer
- `npm run test-ai:stress`
- `npm run test-ai:stress:full`
- `npm run test-ai:stress:problems`

---

## v17.2 – Automatiserte KI-tester

### Testing
- Første mer systematiske automatiserte testregime for KI-svar.
- Hurtigtest med **6 caser**.
- Full test med **24 caser**.
- Kontrollerte blant annet struktur, sikkerhet og konsistens.

---

## v17.1 – UI-hotfix

### UI
- Mindre visuelle og funksjonelle feil etter v17 ble rettet.
- Stabiliserte grensesnittet før videre arbeid med automatiserte tester og KI-kvalitet.

---

## v17 – Fagbank og UX

### Kilder og faglig forankring
- Etablerte første mer helhetlige kilde-/fagbank for Samtalestøtte.
- Kilder ble knyttet til relevante temaer og råd.
- Grunnlaget ble lagt for sporbar «Faglig grunnlag»-visning og senere større kildebank.

### Brukeropplevelse
- Videreutviklet presentasjonen av KI-råd og faglig støtte.
- Målet var at empirisk forankring skulle være tilgjengelig uten å gjøre hovedsvaret tungt og akademisk.

---

## v16 – Full KI-veiledning

**Pakke:** `samtalestotte-prototype-v16-full-ai-guidance.zip`

### KI-funksjonalitet
- Ekte KI ble utvidet fra situasjonsanalyse til hele rådgivningsløpet.
- KI genererer:
  - forslag til åpning av samtalen
  - relevante spørsmål
  - saksspesifikke mulige reaksjoner fra medarbeider
  - forslag til hvordan reaksjonene kan håndteres
  - oppmerksomhetspunkter
  - HR-/juridiske varsler der relevant
  - forslag til videre oppfølging
- Lagt til videre dialog etter det første rådet.

### Retning
- Samtalestøtte gikk fra analyseverktøy til en mer komplett KI-basert samtalepartner.

---

## v15 – KI-diagnostikk

### Teknisk diagnostikk
- Lagt til bedre diagnostikk rundt KI-kall og feil.
- Gjorde det lettere å skille mellom:
  - feil i appen
  - feil i API-kall
  - modell-/responsproblemer
  - manglende eller ugyldig konfigurasjon
- Forberedte appen for mer komplett KI-veiledning i v16.

---

## v14 – Ett felt og personvernretting

### Inndata
- Videreførte retningen mot ett hovedfelt for brukerens situasjon.
- Reduserte skjemapreg og unødvendige separate inputfelt.

### Personvern
- Rettet feil og friksjon i personvernkontrollen rundt ett-felts-løsningen.
- Målet var at personvernet skulle være strengt uten å gjøre normal bruk unødvendig vanskelig.

---

## v13 – Personvern med kontekst

### Personvern
- Personvernkontrollen ble mer kontekstbevisst.
- Videreutviklet forskjellen mellom:
  - klare identifikatorer som bør blokkeres
  - situasjonsrelevant kontekst som bør beholdes eller generaliseres
- La grunnlaget for senere prinsipp om å anonymisere identitet uten å fjerne nødvendig kontekst.

---

## v12 – Personvern, UX og søk

**Pakke:** `samtalestotte-prototype-v12-privacy-ux-search.zip`

### Lokal personvernkontroll
- Lagt til blokkering/deteksjon før KI-kall for:
  - personnavn
  - alder
  - fødselsdata
  - e-post
  - telefonnummer
  - person-/ansatt-ID
  - adresse
  - enkelte personlige pronomen/identitetsmarkører
- Personvernkontroll skjer lokalt før teksten sendes videre.

### UX
- Auto-utvidende tekstfelt.
- Bedre plassering av send/handling.
- Tydelig KI-ventestatus/spinner.

### Søk og tema
- Forbedret temasøk.
- Flere synonymer og bedre kobling mellom formulering og relevant tema.

---

## v11 – Første ekte KI-integrasjon

**Pakke:** `samtalestotte-prototype-v11-real-ai-stage1.zip`

### Ekte KI
- Første serverside-integrasjon med OpenAI API.
- API-nøkkel holdes utenfor frontend.
- KI brukes til første fase av situasjonsforståelsen.

### Analyse
- KI identifiserer:
  - hva som er oppgitt som fakta
  - hva som kan være antakelser/tolkninger
  - sentralt dilemma
  - inntil to relevante hovedtemaer
- KI stiller **0–3 avklaringsspørsmål** ved behov.
- Målet er å stille spørsmål bare når mer informasjon faktisk er nødvendig.

---

## v10 – Videre dialog i samme kontekst

### Samtaleflyt
- Lagt til mulighet for å fortsette samtalen etter første svar.
- Videre spørsmål og svar bruker samme sakskontekst.
- Rettet problemer med kontekst som ble borte eller ble videreført feil.
- «Ny samtale» skal starte med ren samtalekontekst, mens relevante bruker-/tema-innstillinger kan beholdes.

---

## v9 – Raske svaralternativer

### Avklaringsdialog
- Lagt til raske svaralternativer for avklaringsspørsmål.
- Målet var å redusere skrivearbeid og gjøre flyten raskere.
- Brukeren kan fortsatt gi mer utfyllende svar ved behov.

---

## v8 – Samtalepartner fremfor skjema

### Produktretning
- KI-opplevelsen ble gjort mer dialogbasert.
- Samtalestøtte beveget seg bort fra klassisk skjema-/HR-bot-følelse.
- Brukeren beskriver situasjonen mer naturlig, og KI-en responderer som en støttepartner.

---

## v7 – To-trinns relevans

### KI-logikk
- Innførte en mer strukturert to-trinns vurdering av situasjonen.
- Først forstå hva saken handler om.
- Deretter avgjøre hvilke avklaringer og hvilken støtte som faktisk er relevant.
- Reduserte unødvendige eller generiske spørsmål.

---

## v6 – Testgrunnlag for KI

### Kvalitet
- Første systematiske grunnlag for å teste KI-funksjonene.
- Testscenarier ble etablert for å kontrollere hvordan Samtalestøtte håndterer krevende situasjoner.
- La grunnlaget for de senere automatiserte testregimene i v17-serien.

---

## v5 – Dynamiske forslag og støtte ved usikkerhet

### KI-/innholdslogikk
- Støtten ble mer dynamisk og mindre statisk.
- Løsningen skulle gi nyttige forslag selv når brukeren ikke hadde full informasjon.
- Retningen ble at KI-en skulle være nyttig under usikkerhet uten å fylle kunnskapshull med sikre konklusjoner.

---

## v4 – Sikkerhetsregler for KI

### Sikkerhet og kvalitet
- Første tydelige KI-sikkerhetsregler ble lagt inn.
- KI skal ikke:
  - dikte opp fakta
  - fastslå diagnose
  - fastslå motiv eller personlighet uten grunnlag
  - presentere antakelser som fakta
- Sensitiv HR-/juridisk tematikk skal håndteres med forsiktighet og behov for relevant fagstøtte.

---

## v3 – Visuelle temasider og temabilder

**Pakke:** `samtalestotte-prototype-v3-topic-images-scripted.zip`

### Temaopplevelse
- Hovedtemaene fikk mer visuelle temasider.
- Temabilder ble integrert i løsningen/scriptet.
- Bildene og innholdet ble koblet tydeligere til valgt tema.
- Videreutviklet appfølelse fremfor en enkel nettside.

---

## v2 – Forenklet situasjonsbeskrivelse og sterkere visuell profil

**Pakker:**
- `samtalestotte-prototype-v2.zip`
- `samtalestotte-prototype-v2-complete.zip`

### Inndata
- Mange separate felt ble samlet til **ett stort situasjonsfelt**.
- Valgfritt hjelpefelt/veiledning rundt hva brukeren kan skrive.
- Retningen ble at KI-en heller skulle stille oppfølgingsspørsmål når nødvendig enn å kreve et stort skjema på forhånd.

### UI
- Større og tydeligere temakort.
- Høyere kontrast og renere visuell struktur.
- Videre integrasjon av valgt logo.
- Forbedrede ikoner.
- Venstremeny og lys/mørk/system-tema videreutviklet.

### Personvern
- Tydeligere veiledning om anonymisering.
- Forberedelse for automatisk deteksjon av identifiserende informasjon.

### Samtalestøtte
- Mer strukturert støtte rundt situasjonsbeskrivelsen.
- Grunnlaget lagt for KI-baserte oppfølgingsspørsmål.

---

## v1 – Første fungerende prototype

**Pakke:** `samtalestotte-prototype-v1.zip`

### Første produktversjon
- Første komplette fungerende prototype i ren HTML, CSS og JavaScript.
- Levert som ZIP.

### Struktur
- Venstremeny.
- Navigasjon mellom hovedvisninger.
- Åtte hovedtemaer:
  1. Alkohol og rus
  2. Fravær og oppfølging
  3. Prestasjon og utvikling
  4. Lønn og utvikling
  5. Samarbeid og kommunikasjon
  6. Avslutning av arbeidsforhold
  7. Sikkerhet og ansvar
  8. Livssituasjoner
- Undertemaer med hjelpetekster.
- Første skjema for å beskrive situasjonen.

### UI
- Lys modus.
- Mørk modus.
- Systemmodus.
- Første versjon av app-lignende layout.

### Personvern
- Første personvernpåminnelser om å unngå navn og identifiserende detaljer.

### Videre retning
- v1 etablerte grunnstrukturen som senere versjoner videreutviklet til en KI-basert samtalepartner.

---

# Viktige milepæler på tvers av versjonene

## Produktretning
- v1–v3: fungerende prototype, temaer, visuell struktur og enklere inndata.
- v4–v10: KI-regler, dialoglogikk, relevans og kontinuerlig samtalekontekst.
- v11–v16: ekte KI-integrasjon, personvernkontroll og full KI-veiledning.
- v17-serien: faglig forankring, automatiserte stresstester, personvern og finjustert UX.
- v18-serien: konto, historikk, Supabase, lukket beta, Om/Kontakt og brukeradministrasjon.
- v19-serien: samtalesimulering og treningsmodul.

## Personvern
- Personvernkontrollen har utviklet seg fra en enkel påminnelse i v1 til lokal deteksjon, kontekstforståelse, generalisering og automatiserte personverntester.
- Grunnprinsipp:
  - **Anonymiser identitet, ikke situasjonsrelevant kontekst.**
- Klare identifikatorer skal håndteres før informasjon sendes til KI.

## KI-kvalitet
- KI skal skille mellom:
  - dokumenterte/oppgitte fakta
  - brukerens påstander
  - antakelser og tolkninger
- KI skal ikke fastslå motiv, diagnose, skyld eller juridisk resultat uten grunnlag.
- Ved sensitive arbeidsrettslige saker brukes HR-/juridisk merknad fremfor bastante konklusjoner.

## Testing
- Testregimet ble gradvis utvidet fra manuelle scenarioer til automatiserte KI-, stresstest-, personvern- og simulatortester.
- Milepæler:
  - v17.2: 6 hurtigtester / 24 fulltester
  - v17.3–17.6: 37 krevende personalsaker
  - v17.6: 37/37 uten automatiske avvik
  - v17.10: 17/17 personverntester
  - v18.0: 22/22 personverntester
  - v18.3: 26/26 personverntester
  - v19.0: 16/16 simulatorkontroller + 26/26 personverntester
  - v19.1: to live-runder à 8 simulatorcaser uten tekniske/automatiske avvik

---

# Vedlikeholdsregel for CHANGELOG.md

Fra og med neste versjon skal følgende alltid gjøres:

1. Les gjeldende `CHANGELOG.md` fra prosjektets siste versjon.
2. Legg ny versjon **øverst** uten å slette tidligere innhold.
3. Ikke kopier inn en eldre `CHANGELOG.md` fra en tidligere ZIP.
4. Kontroller at minst første og siste historiske versjon fortsatt finnes før pakking.
5. `CHANGELOG.md` skal inngå i samme Git-commit som versjonen den dokumenterer.
6. Ved generering av ny ZIP skal den oppdaterte, komplette changelog-filen være kilden – aldri en lagret eldre mal.


## 19.11.0
- Bevarer situasjonsbeskrivelsen gjennom tema- og undertemaflyten slik at teksten ikke må skrives på nytt.
- Viser KI-forslått hovedtema og undertema tydeligere, også ved lavere sikkerhet.
- Beskytter alle KI- og simulatorendepunkter med gyldig innlogget bruker.
- Gjør innlogging obligatorisk for bruk av den lukkede betaversjonen; registrering krever fortsatt engangsinvitasjon.
- Bygger snakkeboblehaler om til kurvede, integrerte speech-bubble-former og gjenbruker dem i videre KI-dialog.
- Løfter infosidelogoene og lysner hovedlogoen tydeligere i hybridtema.
