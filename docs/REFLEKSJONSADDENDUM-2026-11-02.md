# Refleksjonsaddendum – sluttfase 01.–02.11.2026

Dette dokumentet samler refleksjonspunkter fra sluttfasen som skal innarbeides i den endelige refleksjonsrapporten. Det er opprettet fordi prosjektet fortsatt endres raskt, og fordi erfaringer ellers lett blir glemt mellom kode-, test- og dokumentasjonsrunder.

## 1. Taksonomi: fra 56 til 48 undertemaer

Reduksjonen fra 56 til 48 undertemaer var ikke et tilfeldig scope-kutt eller et mål om å få et penere tall. Den kom etter klarspråkgjennomgang, pilotbruk og tilbakemeldinger.

Flere tidligere undertemaer var:
- for vage
- overlappende
- unødvendig smale
- formulert mer som faglige definisjoner enn som valg en leder ville kjenne igjen

Prinsippet ble derfor **kort tittel, presis beskrivelse**. Undertemaer ble slått sammen, omformulert eller fjernet når forskjellen mellom dem ikke ga tydelig verdi for brukeren eller KI-konteksten.

Gjeldende V1-status er **9 hovedtemaer og 48 undertemaer**. Benchmarkbanken er synkronisert mot denne strukturen med **114 saker**, minst to per gjeldende undertema.

Læring: God kvalitet betyr ikke flest kategorier. Taksonomi er en del av brukeropplevelsen og må testes som informasjonsarkitektur, ikke bare vurderes faglig.

## 2. Kontekstoverføring mellom KI-samtaler og feil miljøvalg

I sluttfasen ble UX-endringer bevisst gjort på en separat pilotgren for å beskytte produksjonsmiljøet. Da arbeidet senere fortsatte i en ny KI-samtale, ble den ferske konteksten om pilotmiljøet ikke bevart godt nok. Eldre kontekst ble tolket som gjeldende, og assistenten begynte å arbeide mot `main`.

Feilen ble oppdaget manuelt.

Det viktige var at kodeendringen i seg selv kunne være teknisk korrekt, mens **handlingskonteksten** var feil. Vanlige kode- og regresjonstester ville derfor ikke nødvendigvis fanget problemet.

Ny arbeidsregel:
1. verifiser aktiv Git-gren før endring
2. verifiser riktig Render-service før deploy
3. ikke utled miljøvalg fra eldre chatkontekst
4. bruk pilot/preview for eksperimentelle endringer
5. behandle branch og deploymål som eksplisitt systemtilstand

Dette er et konkret eksempel på Context Engineering. Det er mer presist å beskrive hendelsen som svikt i kontekstoverføring og systemtilstand enn automatisk å kalle enhver KI-misforståelse «Context Rot».

## 3. Lange KI-dialoger og semantiske misforståelser

Sluttarbeidet med hero/UI viste også at korte referanser som «teksten» kunne tolkes feil når flere tekstelementer var i samme komponent. En endring som skulle gjelde den lille introteksten kunne bli tolket som om den gjaldt hovedoverskriften.

Tiltaket ble å gjøre semantiske grenser eksplisitte:
- «den lille introteksten» betyr et bestemt element
- hovedoverskriften er låst med mindre den nevnes uttrykkelig
- bilde og mobilvisning kan låses separat

Læring: I agentisk utvikling er «ikke endre X» ofte like viktig kontekst som selve endringsønsket.

## 4. Dokumentasjonsdrift som kvalitetsrisiko

Iterativ utvikling gjorde at kode, tester og dokumentasjon enkelte steder kom ut av takt. Eksempel:
- eldre dokumenter kunne bruke 56 undertemaer som nåstatus
- dagens løsning har 48
- goldenbanken ble utvidet i flere trinn
- mobil/PWA og utskrift kom til sent
- yrkes-/sektorlaget fikk kode, data og tester før det ble en aktiv produksjonsfunksjon

Før innlevering ble det derfor gjennomført en repo-bred konsistensgjennomgang.

Prinsipp:
- behold gamle tall når de dokumenterer en faktisk historisk fase
- merk dem som historiske
- bruk dagens kode/testdata som fasit for nåstatus
- skill tydelig mellom implementert arkitektur og aktiv brukerfunksjon
- ikke la dokumentasjonen love mer enn det som kan demonstreres

Dette følger direkte opp faglærers tilbakemelding om sporbarhet og om å skille mellom verifisert, implementert og planlagt.

## 5. Yrkes-/sektorkontekst: implementert lag er ikke det samme som ferdig funksjon

Brukertest ga forslag om yrke/bransje som valgfri kontekst. Dette førte til et eget arkitekturspor med:
- lokal yrkesruting
- kilde- og regelverkskart
- avtale-/arbeidsgiverlogikk
- egne benchmark- og regresjonstester
- backendintegrasjon i `main`

Samtidig er laget feature-flagget og ikke aktivt som ferdig produksjons-UI.

Læring: «Implementert» må ha presis betydning. Et backend- og testlag kan være implementert uten at hele sluttbrukerfunksjonen er produksjonsverifisert.

## 6. Sensorens tilbakemelding som styringssignal

Faglærers tilbakemelding 26.10 ble brukt som reell utviklingsinput, ikke bare som tekst som skulle besvares.

Den førte blant annet til:
- tydeligere skille mellom kjerne og tillegg
- testbare success criteria
- ærlig dokumentasjon av at prototype kom før full BMAD-formalisering
- sterkere golden-dekning på risikoområder
- tydelig begrensning: prosjektets fasit er ikke ekstern ekspertvalidering
- flerfaglig kildegrunnlag
- synlig advarsel om at KI-råd kan være ufullstendige eller feil
- tydeligere produktdifferensiering uten overdrevne unikhetspåstander
- mer systematisk sporbarhet mellom krav, implementasjon og test

Dette er et viktig refleksjonspunkt: tilbakemelding ble omgjort til konkrete kode-, test-, dokumentasjons- og produktendringer.

## 7. Nåstatus som skal brukes ved sluttredigering

- 9 hovedtemaer
- 48 gjeldende undertemaer
- 114 benchmarkcaser
- 26 golden/pilotcaser i dagens bank
- dokumentert live golden-kjøring 26.10: 21 caser, 19 maskinelt OK + 2 manuelt akseptert etter kontroll
- senere produksjonsflyt: 26/26 nådde KI-svar etter retting av falske personverntreff
- personverntestsett er senere dokumentert utvidet til 56/56
- simulator: 24/24 i dokumentert kontroll
- yrkes-/sektorlag: backend/data/tester finnes, men ikke ferdig aktiv produksjons-UI
- direkte samtale og tale: hypoteser/videre arbeid, ikke ferdige funksjoner
- produksjonsgrunnlag: appversjon 20.11.5, med senere dokumenterte UI/cache/PWA-patcher uten ny fullverifisert formell release

## 8. Før endelig innlevering

Den endelige refleksjonsrapporten bør bruke disse eksemplene som bevis på:
- menneskelig styring av KI
- Context Engineering
- non-determinisme
- regresjonstesting
- Git som sikkerhetsnett
- forskjellen mellom kodefeil, testfeil og kontekstfeil
- iterativ produktutvikling
- ærlig avgrensning av hva testene faktisk beviser


## 9. Mobil/PWA – brukerfunn som endret selve leveranseflaten

Mobil/PWA bør omtales som en av de største produktendringene som kom fra faktisk bruk, ikke bare som responsiv CSS.

Den opprinnelige løsningen var i praksis utviklet med desktop som hovedflate. Under pilotbruk valgte flere brukere spontant mobil. Det viste et gap mellom antatt og faktisk brukskontekst. Som følge av dette ble mobil gjort til en reell leveranseflate med egen navigasjon, kompakt toppfelt, endret breddebruk, mobiltilpasset Samtaleøvelse og fysisk test på Samsung/Chrome.

PWA kom som en naturlig videreføring: dersom brukeren faktisk skal bruke Samtalestøtte i behovsøyeblikket, er det nyttig at løsningen kan installeres og oppleves mer som et arbeidsverktøy enn som en tilfeldig nettside. Manifest, appikoner, service worker og standalone-visning ble derfor del av leveransen.

Læring: Brukertesting endret ikke bare detaljer i UI. Den endret hvor og hvordan produktet skulle kunne brukes.

## 10. Utvidet kildegrunnlag – fra «har kilder» til riktig kunnskapsgrunnlag

Faglærers tilbakemelding gjorde en viktig metodisk svakhet tydelig: prosjektets egen golden-fasit og faggrunnlag kunne ikke behandles som uavhengig ekspertvalidering, og HR/jus alene er heller ikke en universell fasit for alle råd Samtalestøtte gir.

Kildegrunnlaget ble derfor utvidet og gjort mer flerfaglig. SOURCEBANK skiller nå tydeligere mellom hva slags kunnskap som bør støtte ulike typer råd:
- lovverk og myndighetskilder for plikter, rettigheter og formelle prosesser
- organisasjonspsykologi og feedbackforskning for prestasjons- og utviklingssamtaler
- aktiv lytting, åpne spørsmål og relevante deler av motiverende intervju for samtalemetodikk
- evidensbaserte intervjuprinsipper ved faktainnhenting før konklusjon
- forskning på organisatorisk rettferdighet ved utvelgelse, avslag og forfremmelse
- arbeidsmiljøregelverk, kontradiksjon og habilitet ved varsling og trakassering

Eksempler som ble lagt til eller tydeligere brukt er Helsedirektoratets veiledning om motiverende intervju, College of Policing sine generelle prinsipper for ikke-ledende faktainnhenting og CIPD-evidens om fair selection og performance feedback.

Den viktigste læringen var at «har en kilde» ikke betyr «har riktig kilde». Kilden må både være troverdig og faktisk støtte den konkrete typen påstand som gis.

Dette styrket også grunnlaget for en framtidig lokal kunnskapsbank: jo mer eksplisitt og kuratert kildegrunnlaget er, desto mindre avhengig blir løsningen av modellens generelle kunnskap og tilfeldig nettsøk.

## 11. Tale/live – brukerbehov, ikke teknologidemonstrasjon

Ideen om tale kom fra pilotbruk og observasjonen av at Samtaleøvelse og videre dialog krever mye skriving, særlig på mobil. Målet er derfor ikke å legge til «voice» fordi teknologien finnes, men å redusere friksjon i den delen av produktet som faktisk skal ligne en samtale.

Det er skissert en trinnvis utvikling:
1. opplesing av KI-svar
2. trykk-og-snakk til tekst, der transkripsjonen vises og går gjennom eksisterende personvernkontroll før sending
3. eventuell full realtime tale-til-tale over WebRTC med naturlig turtaking og avbrytelser

Full realtime kan ikke bare kobles på dagens løsning. I en cloud-basert voice-flyt kan rå lyd sendes til ekstern leverandør før dagens tekstbaserte personverngateway har fått kontrollert en transkripsjon. Derfor krever funksjonen egen vurdering av lydbehandling, lagring, samtykke/informasjon, mikrofontilgang og teknisk arkitektur.

Voice skal dessuten være for **øvelse mot KI-medarbeideren**, ikke opptak eller analyse av en reell medarbeidersamtale.

Læring: En funksjon kan være svært relevant for brukeropplevelsen og samtidig måtte utsettes fordi den endrer personvernmodellen fundamentalt.

## 12. Offline/lukket drift som gjennomgående arkitekturretning

Offline/lukket drift bør beskrives som en gjennomgående retning i prosjektet, ikke bare som en framtidig idé i arkitekturdokumentet.

Flere valg underveis legger bevisst til rette for at eksterne tjenester senere kan erstattes:
- KI-provider er abstrahert slik at modellen kan byttes
- SOURCEBANK og temaspecifikke faggrunnlag gjør kunnskapen mer eksplisitt og flyttbar
- weboppslag logges som kilde-/domeneinformasjon uten å bruke samtaleteksten som profil, slik at man kan lære hvilke kilder en framtidig lokal fagpakke bør inneholde
- lokal RAG er skissert som framtidig alternativ til nettsøk
- intern PostgreSQL/SSO/LLM kan erstatte Supabase og eksterne KI-leverandører
- voice-design vurderer lokal/intern tale-til-tekst og full lokal voice-stack som det mest personvernbevarende langsiktige målbildet
- kildebanken skiller mellom tidsfølsomme og mer stabile kilder og skisserer en versjonert offline fagpakke som kan oppdateres kontrollert

Dette betyr ikke at dagens løsning er offline. Dagens prototype bruker eksterne tjenester. Poenget er at arkitekturen i størst mulig grad unngår å låse produktet til disse tjenestene.

Læring: Offline-kravet påvirket ikke bare framtidsvisjonen. Det påvirket hvordan kunnskap, provider-avhengighet, logging og personvern ble strukturert allerede i prototypen.
