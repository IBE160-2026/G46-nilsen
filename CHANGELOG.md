# CHANGELOG – Samtalestøtte

> **Rekonstruert 25.09.2026**
>
> Denne filen er rekonstruert fra tidligere versjoner, prosjektpakker, testresultater og dokumentert utviklingshistorikk etter at en nyere prosjektpakke utilsiktet overskrev den løpende `CHANGELOG.md`.
>
> **Fast regel fra nå av:** `CHANGELOG.md` er én kontinuerlig prosjektfil. Nye versjoner skal legges øverst i filen. Filen skal aldri erstattes av en eldre kopi fra en ZIP-pakke.
>
> v19.2 er ikke tatt med her fordi den ikke er ferdig bygget og verifisert.

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

