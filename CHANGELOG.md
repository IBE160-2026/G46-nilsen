# Pågående – pilotdrevet UX-runde 30.10.2026

- Nye brukere får minimert desktop-sidebar som standard; eksplisitt brukerpreferanse huskes fortsatt.
- Minimert sidebar viser tooltips ved hover og tastaturfokus.
- Temaikonene er justert: klokke for Fravær og oppfølging og snakkeboble for Samarbeid og kommunikasjon.
- Innstillinger bruker et flatt justeringsikon i stedet for et visuelt tyngre tannhjul.
- Samtaleøvelse-profilen får tydeligere lys kontur i mørk/hybrid sidemeny.
- Forsidens to informasjonskort bruker enkle linjeikoner og tydeligere tekst.
- Hjelp skiller tydelig mellom brukerveiledning og eksterne ressurser/lenker.
- Råd kan skrives ut som en ren visning med situasjon, tema/undertema og selve rådene.
- Oppfølgingsdialogen foreslår nye, kontekstuelle spørsmål etter hvert KI-svar.
- Pilotfunn fra e-post, fritekst og survey er synkronisert til backlog, PRD, UX-spesifikasjon og refleksjonsdokumentasjon.
- Klientcache er bumpet til 20.11.9 for å hindre at gammel app.js blir liggende etter deploy.
- Yrke/bransje-funksjonen er fortsatt avslått i produksjon og inngår ikke i denne deployrunden.

---
# v20.11.5 – Historikklogo uten wrapping og tydelig mørk hover

- Historikk-logoen er flyttet ut av overskriftsraden og inn i en egen søskenkolonne i headeren.
- Fra 641 px og opp krymper logoen dynamisk i høyrekolonnen og kan ikke wrappe under overskriften.
- Logoen er flyttet tydelig høyere i den opprinnelig tomme høyre flaten og påvirker ikke headerhøyden.
- Under 640 px skjules Historikk-logoen heller enn å havne på egen linje.
- Mørk/hybrid sidemeny bruker eksplisitt teal hover/fokus/aktiv bakgrunn med hvit tekst og ikon, slik at valget forblir lesbart.
- KI-illustrasjonen i Samtaleøvelse beholdes uten ramme, bakgrunn eller skygge.
- Versjon, cache og regresjonstester er synkronisert til 20.11.5.

---
# v20.11.4 – sentrert historikklogo og ren KI-illustrasjon

- Historikkoverskriften bruker nå en ekte responsiv høyrekolonne for logoen.
- Logoen sentreres i høyre felt og skalerer dynamisk med vindusstørrelsen via clamp().
- På mellomstore og små skjermer justeres størrelsen uten faste manuelle marger.
- KI-illustrasjonen i Samtaleøvelse vises uten ramme, bakgrunn, kortskygge eller avrundet boks.
- Versjon, cache og regresjonstester er synkronisert til 20.11.4.

---
# v20.11.3 – høyrejustert profil og bedre luft i topplinjen

- Brukerprofilen er forankret til høyre kant også i kompakt desktopvisning.
- Profilområdet tilpasser bredde med ellipsis uten å flyttes unødvendig mot venstre.
- Temavelgeren får ekstra venstrebuffer slik at den ikke ligger opp mot sidefeltknappen.
- Kompakt desktop beholder desktopnavigasjon og responderer uten å bli mobilvisning.
- Versjon, cache og regresjonstester er synkronisert til 20.11.3.

---
# v20.11.2 – kompakt desktop-topplinje og ryddige Finn tema-felter

- Rettet overlapping mellom Samtalestøtte-logo og breadcrumb på halvstore desktopvinduer.
- Høyresiden i topplinjen beholder temavelger, Ny samtale og profil uten at brukerinfo presses ut av skjermen.
- 641–1100 px bruker en to-raders kompakt desktop-topplinje fremfor mobilmodus.
- Finn tema-feltene på forside og temaside tømmes når brukeren går videre til råd.
- Midlertidig situasjonstekst i finder-state nullstilles samtidig, mens selve situasjonen beholdes i råd-flyten.
- Versjon, cache og regresjonstester er synkronisert til 20.11.2.

---
# v20.11.1 – desktoplogo og senere mobilbreakpoint

- Rettet Samtaleøvelse-illustrasjonen på web/desktop: samme KI-bilde brukes nå i lys, hybrid og mørk visning.
- Fjernet eldre temaregler som kunne bytte illustrasjonen til Samtalestøtte-/logosymbol i mørkt tema.
- Begrenset desktopillustrasjonen til en moderat, stabil størrelse slik at den ikke blåses opp på maksimerte skjermer.
- Flyttet hovedgrensen for ekte mobilmodus fra 700 til 640 CSS-piksler i CSS og JavaScript.
- Mellombredde 641–900 px beholder desktop/tablet-oppsett med to kolonner i Samtaleøvelse i stedet for å falle direkte til én mobilkolonne.
- Oppdatert regresjonstester og versjons-/cacheverdier til 20.11.1.

---
# v20.11.0 – mobil-first pilotforbedringer og PWA

- Samlet pilotgren er klargjort som produksjonsrelease etter fysisk mobiltest.
- Mobilgrensesnittet er videreutviklet med egen mobilnavigasjon, mobiltilpasset toppfelt og bedre breddeutnyttelse i Samtaleøvelse.
- Samtalestøtte-logoen er tydeligere på mobil og kan åpnes i større visning.
- Samtaleøvelse har egen KI-illustrasjon med mobiltilpasset beskjæring og større forhåndsvisning.
- PWA-støtte er lagt til med manifest, 192/512-ikoner, maskable-ikon, service worker og installasjonsveiledning.
- Installasjon er fysisk verifisert på Samsung/Chrome med standalone-visning.
- Hjelp viser komplett kildebank med 62 kilder.
- Mobilmenyen inkluderer Innstillinger og bruker samme ikonfamilie som resten av produktet.
- Regresjonstester for pilot-UX og PWA er lagt til/oppdatert.
- Versjon er synkronisert til 20.11.0 i package, lockfil, server, klient, HTML, demo, miljøeksempel og service worker-cache.
- Product Brief, README, BMAD-dokumentasjon, AI-testplan, AI-logg og refleksjonsutkast er oppdatert med sluttfasens pilotfunn.

---
# v20.10.10 – SOURCEBANK v6 og lokalt samtalefaglig grunnlag

- SOURCEBANK er utvidet fra 56 til 62 kuraterte kilder.
- Seks Hjelp-ressurser fra DFØ, BI og STAMI er nå også maskinlesbare kilder med lokalt lagrede fagprinsipper.
- Faggrunnlaget er styrket for relasjonsledelse, aktiv lytting, autonomistøttende ledelse, anerkjennelse/omsorg, feedback, psykologisk trygghet og organisatorisk rettferdighet.
- Ny lokal fagfil `FAGGRUNNLAG-SAMTALETEKNIKK-RELASJONSLEDELSE.md` er laget med tanke på framtidig lukket/offline drift.
- Seks SOURCEBANK-kilder med gammelt hovedtema «Avslutning av arbeidsforhold» er synkronisert til «Oppsigelse og avslutning av arbeidsforhold», slik at runtime-kildescoringen igjen treffer temaet fullt ut.
- Ny `tests/test-sourcebank.cjs` kontrollerer tema-synk, kilde-ID-er, lokale fagprinsipper, Hjelp-lenker og offline-fagfil og kjøres som del av `npm test`.
- Selve KI-prompten for samtaleåpninger er bevisst ikke endret i denne versjonen; faggrunnlaget etableres først og språkjusteringen testes separat.

---
# v20.10.9 – kortere undertemaer, taksonomisynk og sporbarhet

- Undertemastrukturen er forenklet fra 56 til 48 undertemaer etter pilotfunn om abstrakte, overlappende og vanskelige navigasjonsvalg. 48 var ikke et mål i seg selv; resultatet kom av en systematisk gjennomgang med korte, skannbare titler og mer forklarende beskrivelser.
- Klientdata og serverens tema-/klassifiseringskontrakt er synkronisert og låst med regresjonstest.
- Benchmarkbanken er remappet til gjeldende taksonomi uten å kaste tidligere testsaker; to nye saker dekker «Konflikt med leder». Banken har nå 114 saker og minst to per undertema.
- Ny `tests/test-benchmark-taxonomy.cjs` kontrollerer at benchmarkcaser bruker gyldige tema/undertema-par.
- README, Product Brief, PRD, arkitektur og KI-testplan er oppdatert til 48 undertemaer og versjon 20.10.9.
- Versjons- og commitspor for v20.10.4–v20.10.9 dokumenteres i `docs/VERSJONSHISTORIKK-v20.10.md`.

# v20.10.8 – personvernfunn fra full produksjonsflyt

- Full produksjonsflyt-test avdekket tre falske navnetreff før KI-kall.
- Navnedetektoren ble rettet for tvetydig «møtte», spørreordet «hva» og rolleordet «Varsleren».
- Regresjonstester låser de tre konkrete funnene samtidig som reelle navn etter «møtte» fortsatt oppdages.
- Ny fullkjøring etter rettingen fikk 26/26 caser helt frem til KI-svar.
- 25/26 åpninger besto automatisk kontroll; ett marginalt lengdeavvik (67 mot 65 ord) ble manuelt vurdert som akseptabelt.

# v20.10.7 – full produksjonsflyt-test med 26 golden/pilotcaser

- Admin kan kjøre alle 26 golden- og pilotcaser gjennom samme analyse- og veiledningsflyt som vanlige brukere.
- Testtrafikk merkes separat og resultatene logges med run-ID, case-ID, tema, modell, åpning, issues og notes.
- Situasjonsspesifikke nøkkelord brukes som manuelle noter, ikke som hard feil alene, for å unngå falske negative kvalitetsflagg.
- Første fullkjøring registrerte 26/26 saker; tre ble stoppet av personverngatewayen og ble senere brukt til å forbedre detektoren.

# v20.10.6 – pilotlogging og robust håndtering av Gemma-ratebegrensning

- Pilotresultater merkes og logges slik at faktiske produksjonsflyt-resultater kan gjennomgås samlet.
- Gemma Free 429 fra OpenRouter forklares som ekstern ratebegrensning i stedet for generell appfeil.
- Benchmark stopper resterende kall til en modell etter første bekreftede rate-limit for å unngå unødvendige feil/kall.

# v20.10.5 – fem faktiske pilotcaser i produksjonsflyten

- Fem brukerbaserte pilotcaser er lagt til goldenbanken for fravær, alkohol/rus, uønsket fysisk oppmerksomhet og lønn/forfremmelse.
- Admin kan kjøre pilotcasene gjennom den faktiske produksjonsflyten.
- Automatisk åpningskontroll måler blant annet lengde, instruksjonsaktig språk og situasjonsrelevans.

# v20.10.4 – menneskelige samtaleåpninger, oppsigelsestema og UI-regresjon

- Oppsigelsestemaet ble tydeliggjort til «Oppsigelse og avslutning av arbeidsforhold» og synkronisert mellom klient, KI-skjema og goldenbank.
- Veiledningsprompten krever korte, muntlige åpninger som kan sies direkte til medarbeideren, normalt 2–4 setninger og 30–65 ord.
- Instruksjoner til lederen, HR-/rapportstil og forsøk på å gjennomføre hele samtalen i åpningsreplikken er eksplisitt begrenset.
- Golden- og kontraktstester flagger mekaniske, instruksjonsaktige og for lange åpninger.
- Nettleserens tekstmarkering nullstilles ved samtale-/historikkbytte slik at markering ikke følger med til neste visning.
- Pilotfunn og språk-/UI-endringer ble dokumentert i backloggen.

---
# v20.10.3 – konsekvente sidehoder og roligere accordions

- Admin, Hjelp og Brukertest viser nå samme prosjektlogo ved overskriften når sidemenyen er åpen.
- Ved minimert sidemeny brukes sideikon som før, men større og litt høyere for bedre balanse mot overskriften.
- Accordion-overskrifter i Innstillinger, Admin og Hjelp følger den roligere typografien fra Om-siden.
- Alle sammenleggbare bokser er fortsatt lukket som standard.

# v20.10.2 – Admin visuelt lik Innstillinger

- Hovedkortene i Admin bruker nå samme bredde som Innstillinger.
- Samme avstand mellom accordion-kortene.
- Samme padding, høyde, skriftstørrelse, fontvekt og linjehøyde i overskriftene.
- Fjernet Admin-spesifikk minimumshøyde som gjorde boksene høyere.

---

# v20.10.0 – konsistens i simulering, historikk og fagressurser

## UI og historikk
- De to startkortene i Samtalesimulering bruker nå samme kortstil.
- «Midlertidig samtale» er samme komponent i nye og gjenåpnede støttesamtaler og ligger fortsatt rett under relevant innhold til venstre.
- Accordion-overskrifter i Innstillinger, Admin og Hjelp bruker samme typografi.

## Tema og fagressurser
- `topic-mobbing-trakassering.png` er lagt til i serverens offentlige ressursliste, slik at bildet faktisk kan lastes i nettleseren.
- Hjelp har fått seksjonen «Andre relevante fagsider» med kuraterte ressurser om krevende samtaler, motiverende intervju, relasjonsorientert ledelse og håndtering av motstand.

## Testing
- Ny `test-v20-10.cjs` kontrollerer alle punktene over.

---

# v20.9.0 – samlet retting av meny, overskrifter og samtaleflyt

- Gjenopprettet ut/inn-pilen som eneste kontroll for å åpne/lukke sidemenyen; hamburgerikonet fra v20.8 er fjernet.
- Minimert hybridmodus bruker samme topp-logo som lyst tema, mens logoen i åpen hybridmeny er uendret.
- Når sidemenyen er minimert, erstattes logoen ved sekundære sideoverskrifter av side-spesifikt ikon på samme linje som overskriften.
- Innstillinger, Admin og Hjelp åpner med alle sammenleggbare seksjoner lukket.
- «Midlertidig samtale» og «Midlertidig øvelse» har bryteren rett under teksten, helt til venstre.
- «Rapporter svar» og «Ny samtale» er flyttet under selve samtaleforslaget og gjort mer kompakte.
- Duplisert nederste «Ny samtale»/«Øv på samtalen»-rad er fjernet; simulatorens primær-CTA beholdes tydelig.
- Gjenåpnet historikksamtale viser situasjonen som et lesbart sammendrag i stedet for et aktivt inputfelt med «Få råd»-knapp.
- `product-brief.md` er oppdatert til den avtalte korte originalversjonen.

# v20.8.0 – meny og filopprydding

- Åpen sidemeny er beholdt helt uendret.
- Når sidemenyen er lukket, vises nå et kompakt menyikon i stedet for pil. Ikonet ligger på samme topplinje som innholdet i toppbaren.
- Beholder tidligere avtalte v20-funksjoner: lukket «Rediger innhold», roller, personvernkontroller, valgfritt samtalevedlegg, webkildelogging og hjelp/faglenker.
- Ryddet releasepakken for utdaterte versjons-README-er og gamle versjonsspesifikke UI-regresjonstester. Gjeldende dokumentasjon, migreringer, faggrunnlag og aktive tester er beholdt.

# CHANGELOG – Samtalestøtte

## v20.7.0 – finjustering, Product Brief og navigasjon

- Product Brief er spisset uten å gjøres lengre: intern versjonslogg er fjernet, kompleksiteten i KI, simulering, personvern, kilder, modelltesting og kostnad er tydeligere, og visjonen er endret til innen ett år.
- Product Brief omtaler vurdering av egen mobilapp basert på brukertesting og bruksmønster.
- BMAD-dokumentene er oppdatert med samme retning.
- Hjelp-knappen er koblet til Hjelp-siden.
- Hjelp og kontakt er også tilgjengelig fra Innstillinger, og Kontakt er fjernet fra hovedmenyen for å redusere menybelastning.
- Chevron på sammenleggbare seksjoner flyttes til venstre for teksten.
- Sideoverskrifter justeres tilbake til ca. 32–40 px på desktop, mens underoverskrifter holdes mindre.
- Midlertidig øvelse får samme kompakte plassering som Midlertidig samtale.
- Samtalehandlingene får mer konsistent høyde og radius.
- Simulatorlogoen flyttes ytterligere opp uten å endre andre logoer.
- Eldre historikk med feilaktig «Få råd»-prefiks renses ved innlasting.
- HR / regelverk instrueres til å gi korte, situasjonsspesifikke punkter fremfor standardtekst.
- README fremhever hele BMAD-kjeden og faggrunnlaget på tvers av temaene.
- Alle ni hovedtemaer har nå en egen `FAGGRUNNLAG-*`-fil, i tillegg til felles `SOURCEBANK`.

---

## v20.6.0 – UX-opprydding, personvern og styrt brukertest

- Nytt realistisk, nedtonet petrolfarget temabilde for **Mobbing og trakassering** er koblet til temaet som `topic-mobbing-trakassering.png`.
- README inneholder to engangs admininvitasjoner for lærer/sensor slik at vurdering kan gjøres uten lokal installasjon.

- Admin-seksjoner kollapset som standard med tydelige chevrons; Admin-symbol endret til enkel A.
- Innstillinger og Kontakt er gjort mer kompakte og har tydeligere overskriftshierarki.
- Ny Hjelp-side med kort brukerveiledning og kuraterte offentlige faglenker.
- Hovedtemaer vises 3 × 3 på desktop.
- Hybrid bruker samme hovedlogo som mørkt tema.
- Simulatorlogo flyttet ytterligere opp, og mørk CTA er dempet.
- Brukertesten bruker radioknapper, kan slås av/på av admin og kan bare leveres én gang per konto.
- Fritekstsvar og alle skårer vises i Admin.
- Førstegangs personverninformasjon krever «Jeg har lest og forstått» uten å kalles GDPR-samtykke.
- Om-siden er skrevet om med nøktern prosjektstatus, avgrensning og KI-åpenhet.
- Product Brief og øvrige BMAD-dokumenter er spisset uten å omskrive den iterative utviklingshistorien.
- Kildekoden har tydeligere seksjonskommentarer for manuell redigering.
- Nytt seriøst temabilde for Mobbing og trakassering leveres separat og ikke i ZIP.

---

## v20.5.0 – nye fagtemaer, OpenRouter og kort brukertest

- Nytt hovedtema **Mobbing og trakassering** med åtte undertemaer, inkludert varsling og samtaler med begge sider i en varslingssak.
- Fravær er oppdatert med tydelig **Tilrettelegging og arbeidsevne**, og Sikkerhet med **Vold og trusler**.
- SOURCEBANK er utvidet med faste kilder fra Arbeidstilsynet, NAV, Lovdata, LDO og FFI/MOST.
- Benchmarkbanken er utvidet fra 94 til **112 faste saker**: minst to for hvert av 56 undertemaer.
- OpenRouter er lagt til som ekstra KI-provider med `openrouter/free` og en fast gratis Gemma-modell, uten å fjerne direkte OpenAI-støtte.
- Admin kan sammenligne OpenAI- og OpenRouter-modeller og se faktisk routet modell når provider oppgir den.
- Ny kort brukertest med strukturerte 1–5-spørsmål og fritekst; lagres uten samtaletekst og uten bruker-ID.
- Admin får enkel oversikt over brukertestresultater.
- Admin kan opprette engangsinvitasjoner som bruker, redaktør eller admin med utløpsdato.
- «Øv på samtalen» er gjort tydeligere og gjentas nederst i veiledningen.
- Admin-logo i innholdsvisningen flyttes lokalt 8 px ned; godkjent snakkeboblegeometri er urørt.
- README og BMAD-dokumentasjon er oppdatert med Render cold-start, vurderingstilgang, ny taksonomi, brukertest og provider-uavhengighet.
- Ny migrering: `database/migrations/V20-5-SUPABASE-MIGRATION.sql`.

## v20.4.0 – sikkerhet og personvern
- Server-side personverngateway utvidet til å dekke navn, fødselsdata, adresse og øvrige sentrale direkte identifikatorer i tillegg til eksisterende sjekker.
- KI-/kildelogging frikoblet fra bruker-ID; Supabase-migrering nullstiller gamle koblinger og håndhever dette med trigger.
- Weboppslag lagrer nå søkestrenger, domener og konkrete kildesider (URL/tittel) når dette finnes i KI-responsen.
- Automatisk retensjon for KI-logger, feedbackvedlegg, feedback og benchmarkdata.
- Kontoeksport og utvidet kontosletting.
- Rate limiting på login, registrering, passordreset, KI og benchmark.
- Same-origin-kontroll på muterende API-kall.
- CSP, HSTS i produksjon og øvrige sikkerhetsheadere.
- Hele prosjektmappen serveres ikke lenger statisk; kun eksplisitt godkjente frontendfiler/medier kan hentes offentlig.
- Interne auth-/OpenAI-diagnostikkdetaljer fjernet fra klientresponser.
- Admin «Rediger innhold» er sammenleggbar og lukket som standard.
- Nytt dokument: `SIKKERHET-OG-PERSONVERN-v20.4.md`.

## v20.3.1 – logo-hotfix
- Hybridtemaet bruker nå original `logo.png` uten CSS-lysning, filter eller mask-overlay.
- Ingen øvrige UI- eller funksjonsendringer.

## 20.3.0 – Automatisk testbank og modellbenchmark
- Ny fast testbank med 94 saker: to saker for hvert av 47 undertemaer.
- Admin kan kjøre en gratis fulltest av testbanken uten KI-kall.
- Ny lavkost modellbenchmark som kjører samme valgte saker på Luna, Terra og Sol.
- Benchmark lagrer svar, input/output-tokens, estimert kostnad, antall weboppslag, søk, kilde-domener og svartid.
- Ekte benchmark er begrenset til maks $5 og har standardbudsjett $2; den reserverer margin før hvert nytt kall og kan stoppes manuelt.
- Testtrafikk merkes separat (`is_test`) og holdes utenfor vanlig kostnadsoversikt som standard.
- Websøkets faste verktøykostnad er nå inkludert i nye kostnadsestimater ($0,01 per søk ved gjeldende OpenAI-pris 26.09.2026), i tillegg til tokenkostnad.
- Ny migrering: `database/migrations/V20-3-SUPABASE-MIGRATION.sql`.

## v20.2 – modellstyring, kostnad, kildebruk og bedre rapportering

- Admin kan bytte mellom godkjente KI-modeller uten ny deploy.
- Modellbytte varsler om mulig kostnadsøkning.
- Tokenbruk og estimert API-kostnad logges per KI-kall.
- Admin får kostnad siste 24 timer, 7 dager og 30 dager.
- Websøk og brukte kildedomener logges uten samtaletekst, som grunnlag for framtidig offline SOURCEBANK/RAG.
- «Rapporter svar» har valgfritt «Legg ved samtalen», av som standard.
- Personvernsjekk kjøres før en samtale kan legges ved.
- Samme rapporteringsløsning brukes i vanlig veiledning, oppfølging og simulering.
- Simulatoravatarene er flyttet ytterligere 18 px ned.

## v20.1 – redigerbart innhold, smartere temaflyt og KI-feedback

- Admininnhold er delt i sammenleggbare seksjoner for enklere navigasjon.
- Langt flere synlige overskrifter, beskrivelser, hovedtemaer og undertemaer kan redigeres uten deploy.
- Tema-/undertematekster kan endres visuelt uten å endre de interne klassifiseringsverdiene.
- Lagring krever bekreftelse i popup og viser «Ulagrede endringer».
- Valgt undertema sendes nå med til KI som kontekst, men situasjonsteksten skal fortsatt veie tyngst.
- KI-svar kan rapporteres direkte fra hovedveiledning, oppfølgingssamtale og simulering. Selve samtaleteksten lagres ikke automatisk.
- Admin kan se rapporterte KI-svar.
- Lønn og utvikling bruker et tydelig $-symbol med nordøst-pil.
- Simulatorbobler er løftet 18 px for bedre visuell kobling til profilene.

## v20.0 – admin, redigerbart innhold og samlet personvern

- Ny rollemodell med bruker, redaktør og admin.
- Flere administratorer kan tildeles fra adminpanelet.
- Utvalgte tekster kan redigeres og lagres i Supabase uten ny deploy.
- Personvernsjekk er utvidet til kjønnede pronomen og flere KI-felter.
- Server-side personvernbarriere før KI-kall.
- Lagret historikk skannes for personvern ved åpning og kan anonymiseres etter brukerens valg.
- Simulatorens personvernfelt viser også normalstatus når ingen funn er gjort.
- Simulatorbobler løftes 10 px uten å endre den godkjente boblegeometrien.
- Simulatorlogo flyttes 15 px opp.
- Midlertidig øvelse bruker samme layoutprinsipp som midlertidig samtale.
- Feilrapport kan inkludere teknisk logg uten samtaletekst.

## v19.12.5 – ikonjustering og avatar/boble-finjustering

- Ikonet for «Lønn og utvikling» er justert til en tydeligere pengeseddel med dollartegn.
- Pengeseddelen er gjort litt større.
- Nordøst-pilen er flyttet litt bort fra selve seddelen for bedre lesbarhet.
- Avatarene i samtalesimuleringen er løftet opp igjen (mindre vertikal offset).
- Boblene i samtalesimuleringen er flyttet nærmere avatarene.

## v19.12.4 – personvern i alle chatter + UI-justeringer

- Oppfølgingschatten («Fortsett samtalen») får lokal personvernsjekk før hver melding sendes.
- Samtalesimuleringen sjekkes både i skrivefeltet og på nytt rett før meldingen lagres/sendes.
- Navnedeteksjonen kan finne flere navn i samme melding, for eksempel både «Kenneth» og «Tore».
- «Fiks personvern» kan erstatte alle flaggede navn i samme tekst.
- Profillogo/avatar flyttes 6 px lenger ned.
- Ikonet for «Lønn og utvikling» endres fra mynter til en tydelig pengeseddel med pil.
- v19.12.3 sin ryddede bobleløsning beholdes urørt.

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

## 19.11.0
- Bevarer situasjonsbeskrivelsen gjennom tema- og undertemaflyten slik at teksten ikke må skrives på nytt.
- Viser KI-forslått hovedtema og undertema tydeligere, også ved lavere sikkerhet.
- Beskytter alle KI- og simulatorendepunkter med gyldig innlogget bruker.
- Gjør innlogging obligatorisk for bruk av den lukkede betaversjonen; registrering krever fortsatt engangsinvitasjon.
- Bygger snakkeboblehaler om til kurvede, integrerte speech-bubble-former og gjenbruker dem i videre KI-dialog.
- Løfter infosidelogoene og lysner hovedlogoen tydeligere i hybridtema.

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



## 2026-10-26 – Sensorvennlig Node-kompatibilitet

- Skilte lokal Node-kompatibilitet fra produksjonsruntime.
- Endret `engines.node` fra `>=26.12.1 <27` til `>=22 <27` slik at sensor ikke unødvendig blokkeres lokalt.
- Render skal fortsatt bruke `NODE_VERSION=26.12.1` som sikkerhetspatchet produksjonsruntime.
- Oppdaterte README med riktig `cd G46-nilsen` og korrekt rotmappenavn.
- Oppdaterte repo-strukturtesten og sikkerhets-/AI-dokumentasjon med samme skille.


## 2026-10-26 – Presisert sporbarhet og BMAD-tidslinje

- Presisert at utviklingen startet lokalt før Git/GitHub var fullt etablert.
- Dokumentert at synlig Git-historikk viser prototypecommits før synlig Product Brief/BMAD-formalisering, uten å bruke dette som fullstendig bevis for pre-Git-rekkefølgen.
- Beskrevet BMAD som et styringsrammeverk som ble tatt i bruk mens prosjektet allerede var under utvikling, og som deretter strammet inn krav, scope, arkitektur, testing og sporbarhet.
- Fjernet formuleringer i AI-loggen som kunne gi inntrykk av en mer lineær prosess enn den faktiske.
- Korrigert branch-beskrivelsen i refleksjonsutkastet til at endelig leveringsgren er `main`.


## 2026-10-26 – Faglig testbegrensning og ekstra risikocaser

- AI-TESTPLAN skiller nå eksplisitt mellom teknisk/fasitbasert testing og uavhengig faglig ekspertvalidering.
- Dokumentert at prosjektets golden-fasit ikke er validert av HR-/arbeidsrettsekspert og derfor ikke kan brukes som bevis på universell faglig korrekthet.
- Presisert at Samtalestøtte er et veiledende, støttende og treningsrettet verktøy som ikke erstatter relevant fagkompetanse.
- Utvidet golden-banken fra 9 til 13 caser.
- Lagt til to ekstra caser for mobbing/trakassering og to ekstra caser for avslutning av arbeidsforhold.
- Schema-testen krever nå minst tre golden-caser for hvert av de to risikotemaene.
- README skiller mellom siste verifiserte 9/9 live-kjøring og de fire nye casene som ennå ikke er live-kjørt.


## 2026-10-26 – Skjerpet product brief og produktposisjonering

- Executive Summary er gjort mer selvstendig og mindre teknisk.
- The Problem har fått et konkret brukseksempel.
- What Makes This Different sammenligner nå eksplisitt med generelle KI-chatboter, HR-maler/interne rutiner og kurs/ledertrening, inkludert hva alternativene kan gjøre bedre.
- Primærbrukeren er konkretisert uten å snevre produktet unødvendig inn.
- Sekundære brukere er tydelig holdt utenfor kjerneflyten i v1.


## 2026-10-26 – Dokumentert teknisk gjeld og ryddet feedback

- README har fått en eksplisitt seksjon om kjent teknisk gjeld i `app.js` og `server.js`.
- Videre modularisering er dokumentert som et naturlig produksjonssteg, mens stor sluttrefaktorering er bevisst utsatt for å begrense regresjonsrisiko.
- Faglærers product-brief-tilbakemelding er flyttet fra repo-roten til `docs/feedback/` og beholdt som dokumentasjon.


## 2026-10-26 – Golden-bank utvidet til 21 caser

- Utvidet golden/fasit-banken fra 13 til 21 caser.
- Alle ni hovedtemaer har nå minst to golden-caser.
- Lagt inn anonymiserte/generaliserte arbeidshverdagsdilemmaer om sosial utestenging i privat fritid og avslag på høyere stilling etter forhåndskommuniserte kriterier.
- Lagt til nye caser for rusbekymring, forsentkomming, prestasjonsfall, samarbeidskonflikt, sikkerhetsrutine og belastende livssituasjon.
- Dokumentert eksplisitt at golden-fasiten er utarbeidet av student/prosjekteier med KI-støtte fra ChatGPT/OpenAI og ikke er uavhengig ekspertvalidert.
- Schema-testen krever nå minst to caser per hovedtema, ekstra dekning for høyrisikotemaene og eksplisitt provenance.
- Ny live-kjøring av den utvidede banken gjenstår før de nye casene kan omtales som live-verifisert.


## 2026-10-26 – Flerfaglig samtalegrunnlag

- Presisert at HR, jus, psykologi og andre fagområder ikke hver for seg er universell fasit for gode medarbeidersamtaler.
- SOURCEBANK skiller nå tydeligere mellom samtaleteknikk, faktainnhenting, organisatorisk rettferdighet og formelle plikter.
- Lagt til Helsedirektoratets veiledning om motiverende intervju som kilde til åpne spørsmål, refleksjon, lytting og ikke-konfronterende kommunikasjon.
- Lagt til College of Policing som kilde til generelle prinsipper for ikke-ledende og systematisk intervju/faktainnhenting, med tydelig avgrensning mot politiavhør.
- Lagt til CIPD-kilder om fair selection og konstruktiv feedback.
- Styrket Arbeidstilsynet-kilden om trakassering med habilitet, kontradiksjon, dokumentasjon og personvern.
- Oppdatert AI-TESTPLAN slik at eventuell framtidig ekstern validering beskrives som tverrfaglig og problemavhengig.


## 2026-10-26 – Synlig brukeradvarsel om KI-råd

- README har fått en egen seksjon «Veiledning – ikke faglig fasit».
- Veiledningsskjermen viser nå en fast brukeradvarsel om at KI-råd kan være ufullstendige eller feil.
- Førstegangsbekreftelsen kombinerer personverninformasjon med faglige begrensninger.
- Bruksvilkår og Om-siden beskriver relevant fagkompetanse flerfaglig fremfor å gjøre HR til universell referanse.
- UI-regresjonstesten kontrollerer at advarselen ikke utilsiktet fjernes.


## 2026-10-26 – Forenklet felles brukertest

- Beholder ett felles brukertestskjema for alle testere slik at svarene kan sammenlignes.
- Presisert at svarene lagres uten navn eller direkte kobling til kontoen.
- Oppfordrer testere til å bruke oppdiktede situasjoner og unngå personopplysninger.
- KI-spørsmålet vurderer nå både relevans og balanse.
- Fritekstfeltet inviterer testere med relevant leder-/fagbakgrunn til å kommentere råd og samtaleteknikk.


## 2026-10-26 – Presisert brukertestens kontekst

- Brukertesten opplyser kort at Samtalestøtte er utviklet som skoleprosjekt i Programmering med KI ved Høgskolen i Molde.
- Spørsmålet om faktisk bruk er utvidet fra «leder med personalansvar» til «leder- eller personalansvar» for å passe flere testere uten å legge til et ekstra spørsmål.


## 2026-10-26 – Konsistens etter utvidet golden-bank

- Product Brief skiller nå tydelig mellom benchmarkbankens 56 undertemaer og den mindre golden/fasit-banken.
- Success Criteria er oppdatert fra minst én til minst to golden-caser per hovedtema, med ekstra høyrisikodekning.
- README og AI-TESTPLAN beskriver ekstern faglig validering flerfaglig fremfor HR-sentrert.
- Refleksjonsutkastet skiller nå eksplisitt mellom den historiske 9/9-kjøringen 14.10.2026 og den senere utvidelsen til 21 caser.


## 2026-10-26 – Deterministisk sluttkontroll etter golden-utvidelse

- Kjørt `npm run test-golden-schema` på siste `main`: 21 caser, 9/9 hovedtemaer, minst to per tema, ekstra risikodekning og provenance OK.
- Kjørt hele `npm test`-pakken på siste `main`: alle deltester besto.
- Personvern: 34/34.
- Simulator: 24/24.
- Server-personvern, UI/UU, historikk, snakkeboble, clipboard, golden matcher, sensor-demo, assets, repo-struktur, package-lock og Node-kompatibilitet: OK.
- Live golden-kjøring mot faktisk KI gjenstår og skal vurderes separat.


## 2026-10-26 – Flerfaglig terminologi i golden-rapport

- Golden-rapporten bruker nå «Faglig/regelverksmerknad» i stedet for «HR/juridisk merknad».
- Automatisk kontrolltekst omtaler relevant faglig/regelverksmessig kvalitetssikring uten å gjøre HR til universell fasit.
- Underliggende responsfelt beholdes uendret for å unngå funksjonell regresjon.


## 2026-10-26 – Dokumentert pilotbrukertesting

- Lagt til `docs/BRUKERTEST-PLAN.md` med ett felles skjema for alle testpersoner.
- Dokumentert anbefalt testflyt, Render cold-start, bruk av oppdiktede/anonymiserte situasjoner og krav om ærlige svar.
- Presisert at `survey_responses` ikke inneholder bruker-ID, mens separat `survey_participation` kun markerer at en konto har svart.
- Beskrevet lite målrettet utvalg som pilot, ikke representativ effektstudie eller ekspertvalidering.
- Refleksjonsutkastet er oppdatert fra «brukertesting bør gjøres» til at en begrenset pilot nå er satt opp.


## 2026-10-26 – Personverninformasjon for brukertest

- Personvernerklæringen beskriver nå eksplisitt hvordan brukertestsvar lagres.
- Presisert at selve svarene ikke inneholder navn, e-post eller bruker-ID.
- Forklart at separat deltakelsesmarkering kun brukes for å hindre dobbeltinnsending og ikke inneholder svarene.
- Lagringsteksten presiserer at et enkelt brukertestsvar ikke kan kobles tilbake til en bestemt konto i ettertid.
- UI-regresjonstesten kontrollerer at denne informasjonen fortsatt finnes.


## 2026-10-26 – Brukertestdata inn i sikkerhetsarkitekturen

- Sikkerhets-/personverndokumentet beskriver nå `survey_responses` og `survey_participation`.
- Dokumentert at brukertestsvar lagres uten bruker-ID, mens separat deltakelsesmarkering begrenser dobbeltinnsending.
- Dokumentert personvernavveiningen: redusert profilering mot manglende mulighet til å identifisere/slette ett bestemt svar via konto.
- Arkitekturdokumentet beskriver samme datamodell og avveining.
- AI-loggen dokumenterer hvorfor ett felles skjema og en liten pilot ble valgt.


## 2026-10-26 – Verifisert feedback-kilde

- Erstattet en ustabil CIPD-bitesize-lenke med CIPDs `Performance feedback: An evidence review` (2022).
- Kildebanken bruker nå den mer etterprøvbare evidensgjennomgangen for prinsipper om spesifikk, konstruktiv, rettferdig og toveis feedback.
- URL og kilde-ID er oppdatert i både Markdown- og JSON-SOURCEBANK.


## 2026-10-26 – Mer presis Arbeidstilsynet-kilde for personalsaker

- Lagt til Arbeidstilsynets side `Personalsaker` som egen SOURCEBANK-kilde.
- Habilitet, kontradiksjon, konfidensialitet/personvern og dokumentasjon knyttes nå til denne mer presise kilden.
- Den generelle trakasseringskilden brukes fortsatt for undersøkelses- og oppfølgingsplikten, men bærer ikke alene alle saksbehandlingsprinsippene.


## 2026-10-26 – Flerfaglig kvalitetssikring i runtime

- Runtime-prompten bruker ikke lenger HR/jus som standardhenvisning for alle sensitive saker.
- Kompetanse og kildevalg skal matches til problemet: samtalefag/organisasjonspsykologi, HR/arbeidsliv, arbeidsrett, HMS/BHT eller helse ved behov.
- Veiledningsoverskriften er endret fra «HR / regelverk» til «Faglig / regelverk».
- Generell brukerintro anbefaler relevante kilder, virksomhetens rutiner og riktig fagkompetanse fremfor HR som standard.
- Internt felt `legal_hr_note` beholdes for kompatibilitet; testplanen dokumenterer dette som bevisst teknisk gjeld.
- UI-regresjon beskytter den nye flerfaglige terminologien.


## 2026-10-26 – Rettet ny UI-regresjonstest

- Statisk gjennomgang avdekket at den nye flerfaglige UI-assertionen refererte til `app` uten at `app.js` var lest inn i testen.
- `tests/test-ui-regression.cjs` leser nå `app.js` eksplisitt før assertionene kjøres.
- Dette er en testfeil, ikke en produktfeil, og ble rettet før neste lokale `npm test`.


## 2026-10-26 – Automatisk retensjon for brukertestdata

- Lagt til 365 dagers automatisk retensjon for `survey_responses`.
- Lagt til samme retensjon for `survey_participation`.
- Server-personverntesten kontrollerer at begge oppryddingsreglene finnes.
- Personvernerklæring, sikkerhetsdokument og brukertestplan er oppdatert med faktisk retensjon.


## 2026-10-26 – Presisert sikkerhetsdokumentets status

- Sikkerhets-/personvernfilens navn beholdes for Git-sporbarhet, men dokumentet markerer nå at det er videreført fra v20.4 og oppdatert gjennom v20.10.3.
- Serverkommentaren for retensjon er oppdatert slik at den også dekker brukertestdata.


## 2026-10-26 – Finjustert brukertesttekst

- Brukertesten sier nå eksplisitt at også kritiske svar er nyttige.
- Adminoversikten viser «KI relevans/balanse», i samsvar med selve spørsmålet.
- Ingen databasefelt eller svarformat er endret.


## 2026-10-26 – Oppdatert omtrentlig ordantall i refleksjonsutkast

- Refleksjonsutkastets topptekst er oppdatert fra ca. 4121 til ca. 4400 ord etter dagens dokumentasjonstillegg.


## 2026-10-26 – Presisert verifiseringsstatus etter nye commits

- Den grønne `npm test`-kjøringen fra 26.10 beholdes som dokumentert historisk verifisering.
- README, testplan, refleksjon og gjøremålsliste presiserer at senere runtime-/retensjonsendringer krever ny full testkjøring.
- Prosjektet skal ikke bruke en grønn test fra en eldre commit som bevis for nyeste kode.


## 2026-10-26 – Regresjonstest for frakoblet brukertestdata

- Server-personverntesten kontrollerer nå at selve `survey_responses`-raden ikke inneholder `user_id`.
- Testen kontrollerer samtidig at engangsbegrensningen fortsatt bruker separat `survey_participation`.
- En senere kodeendring som kobler evalueringen direkte til brukerprofilen skal dermed gi testfeil.


## 2026-10-26 – Samlet neste steg før pilot og sluttverifisering

- Gjøremålsfila har fått en egen operativ sluttsekvens: ny lokal regresjon, 21-casers live golden, Render-deploy, pilotbrukertest og analyse av resultatene.
- Dette skiller ferdige dokumentasjons-/kodeforbedringer fra oppgaver som krever lokal kjøring eller faktiske testpersoner.


## 2026-10-26 – Repo-struktur tilpasset lærerens Claude-verktøy

- Faglærer la inn `CLAUDE.md` og `.claude/skills/sesjonslogg` i repoet.
- Repo-strukturtesten feilet derfor på filer som nå er tilsiktede kurs-/verktøyfiler.
- `CLAUDE.md`, `.claude/` og den framtidige `.logs/`-mappen er nå eksplisitt tillatt.
- Testen er fortsatt streng mot andre uventede rotfiler og genererte/hemmelige filer.


## 2026-10-26 – Deterministisk teststatus grønn på nyeste kode

- Ny lokal testkjøring bekreftet at syntaks, personvern, simulator, server-personvern, UI/UU, historikk, snakkeboble, clipboard, golden-schema, golden-utils, sensor-demo og offentlige assets består.
- Repo-strukturtesten feilet først fordi faglærer hadde lagt inn `CLAUDE.md` og `.claude/`.
- Testen ble oppdatert til å tillate lærerens kursverktøy og framtidig `.logs/`, uten å tillate øvrige tilfeldige rotfiler.
- `npm run test-repo-structure` besto deretter med repo-struktur, package-lock og Node-kompatibilitet OK.
- Deterministisk teststatus er dermed grønn på nyeste kode før 21-casers live golden-kjøring.


## 2026-10-26 – Tydeligere produktdifferensiering

- Product Brief forklarer nå tydeligere hvorfor Samtalestøtte er et domenespesifikt arbeidsverktøy og ikke bare en generell chatbot med nytt grensesnitt.
- Sammenligningen mot generelle KI-chatboter, HR-maler/interne rutiner og kurs/ledertrening er gjort mer konkret og balansert.
- README fremhever at brukeren slipper å bygge prompt, sikkerhetsramme og arbeidsflyt selv.
- Refleksjonsrapportens innledning beskriver produktideen som en sammenhengende arbeidsflyt fra forberedelse til simulering og refleksjon.
- Endringen er dokumentasjon/posisjonering og påvirker ikke live golden-kjøringen.


## 2026-10-26 – Kildegrunnlag tydeliggjort som produktfortrinn

- Product Brief beskriver nå SOURCEBANK som førstevalg og kontrollert nettsøk som supplement.
- Kildehierarkiet er tydeliggjort: lov-/regelverksspørsmål skal forankres i autoritative kilder, mens samtaleteknikk skal bygge på relevant forskning og fagkunnskap.
- README forklarer at Samtalestøtte styrer både arbeidsflyt og kildebruk, ikke bare selve KI-prompten.
- Refleksjonsrapporten løfter fram prinsippet: forskjellen ligger også i hvilke rammer modellen må svare innenfor.


## 2026-10-26 – Live golden 21 caser: 19 OK + 2 manuelt akseptert

- Kjørte `npm run test-ai:golden` mot GPT-5.6 Luna med alle 21 golden-casene.
- Maskinelt resultat: **19 OK · 2 BØR SJEKKES · 0 kritiske avvik · 0 tekniske feil**.
- De to flaggede casene var `G-AVSL-03` og `G-SAMARB-02`.
- Begge ble flagget fordi testen forventet minst én eksplisitt avklaring mens responsen satte `Avklaring: Nei`.
- Manuell gjennomgang viste at begge svarene oppfylte MÅ-fasiten og sentrale BØR-punkter.
- Resultatet dokumenteres som 19 maskinelt OK + 2 manuelt akseptert, ikke som 21/21 maskinelt OK.
- Ingen runtime- eller testregel ble endret for å pynte på resultatet.


## 2026-10-26 – Personvern v2: robust navnedeteksjon

- Flyttet navnedata og navnedeteksjon til delte klient/server-moduler slik at begge lag bruker samme regler.
- Navnedeteksjonen er case-insensitiv og tester navn skrevet med små bokstaver, stor forbokstav og STORE BOKSTAVER.
- Sjeldne/ukjente navn kan oppdages gjennom tydelig personkontekst, ikke bare en hardkodet navneliste.
- Tvetydige navn/ord som Dag, Liv, Line, Finn og Even krever fortsatt personkontekst for å redusere falske positiver.
- Lagt til støtte for lokal oppdatering av navnedata fra SSB Statistikkbanken tabell 10467 og etternavn fra tabell 12891. Runtime sender aldri brukertekst til SSB.
- Brukertestens fritekst og KI-tilbakemeldingskommentar får live personvernsjekk i tillegg til eksisterende serversperre.
- Kontaktskjema/e-post får tydelig personvernpåminnelse, men ingen hard blokkering.
- Utvidet regresjonstestene med sjeldne navn, små/store bokstaver og negative kontrollsetninger.


### Personvern v2 – regresjonsfunn etter første kjøring

Første lokale testkjøring avdekket at testen kunne være grønn samtidig som navnedetektoren ga ekstra falske navnetreff. Eksemplene «medarbeideren bor …» og «medarbeideren brøt …» viste at rolle + påfølgende verb kunne tolkes som navn. Regelen ble derfor strammet inn, navneordboken brukes nå som evidens sammen med personkontekst i stedet for som ubetinget treff, og testene feiler nå på uventede navnetreff og feil anonymisering. SSB-oppdateringsscriptet ble samtidig gjort eksplisitt mot tabellmetadata for navnevariabelen og avbryter dersom uttrekket ser urimelig lite ut.


### Personvern v2 – falske positiver i tvetydige navn og setningssubjekt

- Tvetydige navn som `dag` krever nå stor forbokstav ved ordinær navnekontekst; liten bokstav kan fortsatt fanges i eksplisitte uttrykk som «snakket med per».
- Deteksjon av ukjente navn ved setningsstart bruker nå personspesifikke handlingsverb i stedet for generelle hjelpeverb som `har`, `er` og `ble`.
- Dette hindrer at vanlige setninger som «Fraværet har økt» eller «Arbeidsmiljøet har blitt bedre» blir tolket som personnavn.
- Nye negative regresjonstester dekker disse tilfellene.


## 2026-10-26 – Dokumentasjon justert til pågående prosjektstatus

- AI-testplanen beholder eldre 33/33- og 34/34-personvernkjøringer som historiske målepunkter, men markerer dem tydelig som eldre status.
- Ny verifisering dokumenterer Personvern v2 med **56/56 personverntester**, klient/server-flatekontroll og grønn samlet deterministisk testpakke.
- Dokumentert lokal SSB-navnebase ved verifisering: **2110 fornavn og 3706 etternavn**.
- Implementation Plan er endret fra «status ved levering» til **status per 26.10.2026** der prosjektet fortsatt er under aktiv utvikling.
- Formuleringer som «sluttfase», «sluttmodularisering» og «sluttverifisering» er tonet ned der de kunne gi feil inntrykk av at prosjektet allerede var ferdig.
- Historiske testresultater og utviklingsspor er beholdt; endringen rydder i statusformuleringer uten å omskrive prosjektets faktiske historikk.


## 2026-10-27 – Pilotfunn: brukerteststatus og reset mellom saker

- Første pilottilbakemelding avdekket at vellykket innsending av brukertesten ble fulgt av automatisk gjenåpning etter 250 ms, slik at brukeren så «allerede sendt» i stedet for en stabil bekreftelse. Automatisk gjenåpning er fjernet, og ferdigtilstanden bekrefter nå tydelig at svaret er registrert.
- Full reset nullstiller nå `pendingSituationText`, slik at tekst fra en tidligere sak ikke følger med når brukeren starter nytt tema/samtale.
- UI-regresjonstesten dekker begge feilene.
- Mobilopplevelse, begrepskonsistens og mer naturlig KI-språk er registrert som separate pilotfunn for videre vurdering.


### 2026-10-27 – Brukertest: sikring mot dobbelt-submit

- Kodegjennomgang fant ingen auto-submit ved navigasjon, tilbakeknapp, `pageshow` eller fokusendring.
- Send-knappen deaktiveres nå mens brukertest-POST pågår, og en klientguard hindrer flere samtidige innsendinger.
- Duplisert click-listener for «Gi tilbakemelding» i sidemenyen er fjernet; ordinær navigasjonslistener håndterer åpningen.
- `SURVEY_ALREADY_COMPLETED` vises som fullført tilstand fremfor teknisk feil.


## 2026-10-27 – personvern: falske positiver for pronomen og ansiennitet

- Navnedetektoren behandler nå vanlige norske pronomen og funksjonsord som `dem`, `de`, `dere`, `oss`, `meg`, `deg` og `seg` som sikre ikke-navn også i personlignende setningskontekst.
- Regresjon lagt til for pilotsetningen «Hvordan kan vi stille større krav til dem som er ny?».
- Aldersdeteksjon krever nå tydelig alderskontekst som «er 20 år gammel», «fyller 20 år» eller «20-åring».
- Varighet og ansiennitet som «jobbet her i 20 år» og «20 års erfaring» skal ikke lenger flagges som alder.
- Samme alderslogikk og regresjonsdekning brukes klient- og server-side.


### 2026-10-27 – personvern: eiendomsord skal ikke tolkes som navn

- Utvider grammatikklisten med norske eiendomsord som `vårt`, `våre`, `mitt`, `mine`, `ditt`, `dine`, `sitt`, `sine` og `deres`.
- Regresjon lagt til for «Dette ligger innenfor vårt ansvarsområde.» og «Våre rutiner gjelder her.»
- `Vår` beholdes som mulig faktisk fornavn og håndteres fortsatt kontekstuelt.
