# AI-logg – Samtalestøtte

## Formål og avgrensning

Denne loggen dokumenterer hvordan generativ KI (ChatGPT/OpenAI) er brukt i utviklingen av **Samtalestøtte**. Den er rekonstruert fra tilgjengelig prosjekt- og samtalehistorikk, inkludert tidligere ChatGPT-samtaler og prosjektets versjonslogg.

Loggen er **ikke en ordrett utskrift av alle promptene**. Målet er å gi en kort og ærlig oversikt over hva studenten ba om hjelp til, hva KI foreslo eller produserte, hva som ble misforstått eller måtte korrigeres, og hvordan løsningen utviklet seg. Der detaljene ikke kan gjenfinnes sikkert i samtalehistorikken, beskrives kun det som kan dokumenteres fra prosjektets versjonshistorikk.

Studenten har gjennom hele prosjektet tatt beslutninger om behov, faglig retning, funksjoner, design og hva som skulle beholdes eller forkastes. ChatGPT er brukt som idépartner, programmeringsassistent, teststøtte, dokumentasjonsstøtte og kvalitetssikringsverktøy.

---

## v1 – Første fungerende prototype

**Studentens behov:** Jeg ønsket å gå fra Product Brief til en faktisk fungerende prototype med temaer for vanskelige medarbeidersamtaler, sidemeny og enkel navigasjon.

**KI-bruk:** ChatGPT foreslo og laget første prototype i HTML, CSS og JavaScript med åtte hovedtemaer, undertemaer, lys/mørk/systemtema og personvernpåminnelser.

**Korrigering/læring:** Første utkast ble raskt vurdert visuelt av meg. Jeg likte retningen, men pekte tidlig på layoutproblemer og at løsningen måtte videreutvikles iterativt.

---

## v2 – Forenklet inndata og tydeligere design

**Studentens behov:** Jeg stilte spørsmål ved hvorfor brukeren skulle fylle ut mange felt og ønsket en enklere løsning.

**KI-bruk:** ChatGPT foreslo å samle mesteparten av inndataen i ett stort situasjonsfelt, beholde tema/undertema som kontekst og la KI stille oppfølgingsspørsmål ved behov. Logo og temakort ble også videreutviklet.

**Korrigering/læring:** Dette var et viktig produktvalg der dialog med KI førte til en enklere brukerflyt enn den første skjemabaserte løsningen.

---

## v3 – Temabilder og tydeligere temasider

**Studentens behov:** Jeg ønsket mer visuell identitet og at temaene skulle føles som egne sider, ikke bare som tekst i et skjema.

**KI-bruk:** ChatGPT hjalp med struktur for temasider og integrasjon av temabilder.

**Korrigering/læring:** Flere visuelle elementer ble senere justert eller byttet fordi de ikke passet ønsket stil. Det ble tydelig at generert design måtte vurderes manuelt og ikke bare aksepteres.

---

## v4 – Sikkerhetsregler for KI

**Studentens behov:** Jeg ønsket at KI ikke skulle finne på diagnoser, motiv, skyld eller andre sikre konklusjoner i personalsaker.

**KI-bruk:** ChatGPT foreslo eksplisitte regler for hva KI ikke skulle gjøre, blant annet å skille fakta fra antakelser og være forsiktig med HR- og juridiske forhold.

**Korrigering/læring:** Dette ble starten på et mer systematisk arbeid med AI-sikkerhet, ikke bare funksjonalitet.

---

## v5 – Dynamisk støtte ved usikkerhet

**Studentens behov:** Jeg ønsket at løsningen skulle være nyttig selv om lederen ikke hadde full informasjon.

**KI-bruk:** ChatGPT foreslo at KI skulle kunne gi støtte under usikkerhet, men uten å fylle kunnskapshull med oppdiktede fakta.

**Korrigering/læring:** Fokus flyttet seg fra statiske råd til situasjonstilpasset veiledning.

---

## v6 – Første systematiske KI-testing

**Studentens behov:** Jeg ønsket å finne ut om KI-svarene faktisk var gode nok og trygge.

**KI-bruk:** ChatGPT hjalp med å lage testscenarier og struktur for systematisk testing.

**Korrigering/læring:** Det ble tydelig at en fungerende KI-integrasjon ikke var nok; svarene måtte testes på representative og vanskelige personalsaker.

---

## v7 – To-trinns forståelse

**Studentens behov:** Jeg ønsket mindre generiske svar og færre unødvendige spørsmål.

**KI-bruk:** ChatGPT foreslo en todelt logikk: først forstå situasjonen, deretter avgjøre hvilke avklaringer og hvilken støtte som var relevant.

**Korrigering/læring:** Dette reduserte gjentakelser og la grunnlag for senere mer presis temaklassifisering.

---

## v8 – Samtalepartner fremfor skjema

**Studentens behov:** Jeg ønsket at løsningen skulle oppleves mer som en samtalepartner og mindre som et HR-skjema.

**KI-bruk:** ChatGPT foreslo en mer dialogbasert flyt der brukeren skriver naturlig og KI følger opp.

**Korrigering/læring:** Produktretningen ble tydeligere: KI skulle støtte refleksjon og samtaleforberedelse, ikke bare fylle ut felter.

---

## v9 – Raske svaralternativer

**Studentens behov:** Jeg ønsket mindre skrivearbeid i avklaringsdialogen.

**KI-bruk:** ChatGPT foreslo klikkbare svaralternativer kombinert med mulighet for fritekst.

**Korrigering/læring:** Senere måtte flere av disse elementene justeres visuelt fordi knapper og svaralternativer fikk ulik størrelse og hierarki.

---

## v10 – Samtalekontekst og videre dialog

**Studentens behov:** Jeg ønsket at brukeren skulle kunne fortsette samtalen uten at KI mistet hva saken handlet om.

**KI-bruk:** ChatGPT hjalp med logikk for å videreføre kontekst mellom spørsmål og svar og samtidig starte rent ved «Ny samtale».

**Korrigering/læring:** Kontekst viste seg å være krevende; senere versjoner måtte rette tilfeller der gammel tekst eller knappeinnhold ble med videre.

---

## v11 – Første ekte KI-integrasjon

**Studentens behov:** Jeg ønsket å gå fra prototype til reelle KI-kall.

**KI-bruk:** ChatGPT hjalp med serverside-integrasjon mot OpenAI API. API-nøkkel ble holdt utenfor frontend. KI-en analyserte fakta/antakelser, dilemma, tema og stilte inntil noen få avklaringsspørsmål.

**Korrigering/læring:** I denne fasen var ikke hele rådgivningsløpet KI-generert ennå. Integrasjonen ble utvidet stegvis i senere versjoner.

---

## v12 – Personvern før KI-kall

**Studentens behov:** Jeg ønsket at løsningen skulle oppdage navn, alder og andre identifiserende detaljer før teksten ble sendt til KI.

**KI-bruk:** ChatGPT hjalp med lokal personvernsjekk, auto-utvidende tekstfelt, tydelig ventestatus og mer tolerant temasøk.

**Korrigering/læring:** Første personvernregler ble for strenge enkelte steder og måtte senere gjøres mer kontekstbevisste.

---

## v13 – Mer kontekstbevisst personvern

**Studentens behov:** Jeg ønsket at personvernkontrollen ikke skulle fjerne relevant informasjon unødvendig.

**KI-bruk:** ChatGPT foreslo skille mellom klare identifikatorer og situasjonsrelevant kontekst som kunne generaliseres.

**Korrigering/læring:** Dette utviklet seg senere til prinsippet: **«Anonymiser identitet, ikke nødvendig kontekst.»**

---

## v14 – Ett hovedfelt og personvernjustering

**Studentens behov:** Jeg ønsket å holde fast ved ett hovedfelt og redusere friksjon fra personvernkontrollen.

**KI-bruk:** ChatGPT hjalp med å tilpasse personvernlogikken til ett-feltsløsningen.

**Korrigering/læring:** Flere falske positiver viste at regelbasert personvernsjekk måtte testes mot naturlig norsk språk.

---

## v15 – KI-diagnostikk

**Studentens behov:** Jeg trengte å forstå om feil skyldtes appen, API-et, modellen eller konfigurasjonen.

**KI-bruk:** ChatGPT foreslo og hjalp med mer teknisk diagnostikk rundt KI-kall og feilhåndtering.

**Korrigering/læring:** Dette gjorde det mulig å skille funksjonsfeil fra kvaliteten på selve KI-svaret.

---

## v16 – Full KI-veiledning

**Studentens behov:** Jeg ønsket at KI skulle gi hele samtalestøtten, ikke bare første analyse.

**KI-bruk:** ChatGPT hjalp med å utvide KI-svarene til åpning av samtalen, spørsmål, mulige reaksjoner, håndtering, oppfølging og relevante HR-/juridiske varsler.

**Korrigering/læring:** Senere så jeg at de juridiske/HR-relaterte tekstene kunne bli for standardiserte. Dette ble tatt opp igjen i v20-serien.

---

## v17 – Fagbank og faglig forankring

**Studentens behov:** Jeg ønsket at rådene skulle kunne knyttes til faglige kilder og ikke bare være genererte formuleringer.

**KI-bruk:** ChatGPT hjalp med å etablere en fag- og kildebank og med å presentere «faglig grunnlag» uten å gjøre hovedsvaret for akademisk.

**Korrigering/læring:** Kildebanken ble senere utvidet betydelig, og jeg stilte stadig strengere krav til hvilke kilder som skulle brukes.

---

## v17.2–v17.5 – Automatiserte KI-tester og stresstesting

**Studentens behov:** Jeg ønsket å teste krevende personalsaker systematisk og finne farlige eller svake svar.

**KI-bruk:** ChatGPT hjalp med hurtigtester, fulltester og problemtester, inkludert saker om rus, fravær, konflikt, sikkerhet, lønn og avslutning.

**Korrigering/læring:** Testlogikken ga noen falske treff når KI faktisk avviste en problematisk påstand. Testene måtte derfor gjøres mer kontekstbevisste.

---

## v17.8–v17.10 – Personvern, temaforståelse og større fagbank

**Studentens behov:** Jeg ønsket bedre navnedeteksjon, raskere temaflyt og et sterkere faglig grunnlag.

**KI-bruk:** ChatGPT hjalp med å forbedre navne-/kontekstdeteksjon, foreslå tema og undertema samtidig og utvide fagbanken med blant annet relasjonell ledelse, LMX, psykologisk trygghet, motivasjon, feedback og konfliktteori.

**Korrigering/læring:** Jeg krevde at fagbanken skulle være kuratert, men samtidig ikke låse KI til en statisk liste dersom oppdatert og troverdig informasjon var nødvendig.

---

## v18.1 – Supabase, autentisering og historikk

**Studentens behov:** Jeg ønsket ekte brukerkontoer, sikker historikk og lukket registrering.

**KI-bruk:** ChatGPT hjalp med migrering fra lokal lagring til Supabase Auth og database, RLS-regler og engangsinvitasjoner.

**Korrigering/læring:** Rettigheter i Supabase måtte feilsøkes manuelt. Blant annet krevde samtalelagring en konkret `GRANT`-retting. Dette er et eksempel på at KI-generert oppsett måtte testes i faktisk drift.

---

## v18.2–v18.3 – Kontakt, feilrapportering og brukerflyt

**Studentens behov:** Jeg ønsket bedre støtte for testbrukere, flere innganger til ny samtale og mulighet for midlertidige samtaler.

**KI-bruk:** ChatGPT hjalp med Om-side, Kontakt, feilrapportering, «Midlertidig samtale» og UX-forbedringer.

**Korrigering/læring:** Flere plasseringer av samme handling skapte senere visuell inkonsistens. Jeg har flere ganger måttet påpeke at knapper med samme funksjon må se like ut.

---

## v19.0–v19.1 – Samtalesimulering

**Studentens behov:** Jeg ønsket en øvelsesmodus der KI spiller medarbeider og lederen kan trene før den virkelige samtalen.

**KI-bruk:** ChatGPT foreslo simulatorstruktur, treningsmoduser, reaksjonsstiler, refleksjon etterpå og senere en egen simulator-modul med live-tester.

**Korrigering/læring:** Automatiske tester godkjente enkelte svar som jeg manuelt oppfattet som for oppdiktede eller unaturlige. Dette førte til strengere simulatorregler og flere testcaser.

---

## v19.2–v19.4 – Simulatorens språk, identitet og UX

**Studentens behov:** Jeg ønsket tydeligere forskjell på treningsmoduser og mer realistiske reaksjoner.

**KI-bruk:** ChatGPT hjalp med «Hold deg til saken», «Utfordre meg», «Overrask meg», følelsesmessige reaksjoner, avatarer og samtalebobler.

**Korrigering/læring:** Jeg måtte korrigere flere forslag fordi reaksjonene ble for polerte eller fordi visuelle endringer ikke traff ønsket uttrykk. Boblegeometrien ble etter hvert låst for å unngå nye utilsiktede endringer.

---

## v19.5–v19.12 – Personvern og omfattende UX-finjustering

**Studentens behov:** Jeg ønsket mer konsekvent mørk/hybrid visning, bedre personvern, tydeligere navigasjon, riktige logoer/ikoner og mindre visuell støy.

**KI-bruk:** ChatGPT foreslo og implementerte en rekke små UX-, tema-, personvern- og simulatorjusteringer.

**Korrigering/læring:** Dette er perioden med flest designkorrigeringer. Jeg måtte flere ganger presisere at eksisterende logoer/bilder ikke skulle overskrives, at godkjent boblegeometri ikke skulle endres, og at KI ikke skulle lage nye versjoner før jeg uttrykkelig sa «go/kjør». Enkelte tidligere KI-endringer gjorde for store inngrep eller endret mer enn jeg hadde bedt om.

---

## v20.0 – Admin, roller og samlet personvern

**Studentens behov:** Jeg ønsket en administrasjonsdel med roller og redigerbart innhold, samtidig som personvernet skulle gjelde alle KI-felt.

**KI-bruk:** ChatGPT hjalp med rollemodell, admin/redaktør, Supabase-lagring av innhold og en server-side personvernbarriere.

**Korrigering/læring:** Det ble viktig å skille mellom hva som kan løses teknisk og hva som fortsatt krever organisatoriske rutiner og menneskelig ansvar.

---

## v20.1–v20.2 – Modellstyring, rapportering, kostnad og kildebruk

**Studentens behov:** Jeg ønsket å kunne bytte KI-modell uten deploy, sammenligne kostnad/kvalitet og se hvilke kilder som faktisk brukes.

**KI-bruk:** ChatGPT hjalp med modellstyring, token-/kostnadslogging, rapportering av KI-svar og logging av web-/kildebruk uten å lagre selve samtaleteksten i tekniske logger.

**Korrigering/læring:** Jeg var tydelig på at kildeovervåking ikke skulle kunne brukes til profilering av enkeltbrukere.

---

## v20.3–v20.4 – Dokumentasjon, arkitektur og videre sikkerhetsarbeid

**Studentens behov:** Jeg ønsket bedre BMAD-dokumentasjon, tydeligere sikkerhetsarkitektur og en plan for mulig lukket/offline bruk.

**KI-bruk:** ChatGPT hjalp med PRD, UX-, arkitektur-, epics- og implementasjonsdokumenter samt beskrivelser av provider-uavhengig arkitektur, intern KI og lokal kunnskapsbank/RAG.

**Korrigering/læring:** Jeg ønsket at dokumentasjonen skulle være ærlig om at utviklingen var iterativ, ikke fremstille prosjektet som om alt var planlagt lineært fra starten.

---

## v20.5 – Nye temaer, OpenRouter og brukertest

**Studentens behov:** Jeg ønsket faglig bredere tematikk, spesielt mobbing/seksuell trakassering, tilrettelegging/arbeidsevne og vold/trusler. Jeg ønsket også å teste gratis, rimelige og dyrere KI-modeller og bygge inn brukertest.

**KI-bruk:** ChatGPT foreslo utvidelse til ni hovedtemaer, større testbank, OpenRouter som alternativ provider og en kort brukerundersøkelse.

**Korrigering/læring:** Jeg påpekte at mobbing/seksuell trakassering måtte ha riktig språk, ikon og bilde, og at systemet ikke skulle trekke konklusjon om skyld eller at trakassering faktisk hadde skjedd bare fordi det var meldt.

---

## v20.6 – Personvern, Hjelp og brukertest

**Studentens behov:** Jeg ønsket førstegangs personverninformasjon, Hjelp/faglige ressurser, bedre survey-håndtering og flere UX-rettinger.

**KI-bruk:** ChatGPT hjalp med videre BMAD/Product Brief-oppdateringer, survey-logikk, admin-invitasjoner og nytt temabilde for mobbing/trakassering.

**Korrigering/læring:** Flere ting ble ikke koblet riktig eller ble bare delvis gjennomført. Hjelp-knappen manglet klikk-handler, enkelte knapper var fortsatt inkonsistente, «Midlertidig øvelse» fikk feil plassering og overskrifter ble redusert mer enn ønsket. Jeg oppdaget dette ved egen testing og krevde korrigering.

---

## v20.7 – Finjustering og Product Brief

**Studentens behov:** Jeg ønsket at Product Brief tydeligere skulle vise KI-kompleksiteten uten å bli lengre, at framtidsperspektivet skulle være innen ett år, og at mobilapp skulle vurderes. Jeg ønsket også moderate overskrifter, venstreplasserte chevrons og bedre README-struktur.

**KI-bruk:** ChatGPT omskrev Product Brief, oppdaterte BMAD-dokumenter og gjorde flere UI-/dokumentasjonsendringer.

**Korrigering/læring:** Etterpå fant jeg fortsatt flere inkonsistenser: knapper i tidligere samtaler var ulike, sideoverskrifter var ikke helt samordnet, temaikonet for mobbing/seksuell trakassering var ikke endret som avtalt, profilmenyen hadde unødvendig «Rapporter feil», og logo-/ikonlogikken ved åpen/lukket sidemeny måtte presiseres på nytt.

---

## Videre endringer identifisert etter v20.7

I den pågående gjennomgangen har jeg sammen med ChatGPT identifisert flere forbedringer som skal vurderes før neste bygg:

- alle sammenleggbare seksjoner skal være lukket som standard
- «Midlertidig øvelse» skal ha samme kompakte plassering som «Midlertidig samtale»
- handlingsknapper som «Ny samtale», «Øv på samtalen», «Fortsett/Spør videre» skal ha tydeligere og mer konsekvent hierarki
- hovedoverskrift på forside og temasider skal følge samme responsive størrelsesregel
- ved åpen sidemeny kan Samtalestøtte-logo vises ved sideoverskriften; ved lukket sidemeny skal sidens ikon vises på samme linje som overskriften
- Admin-siden skal følge samme visuelle system som øvrige menysider
- profilmenyen skal ikke inneholde «Rapporter feil»; dette hører hjemme på Kontakt/feilrapportering
- det bør vurderes flere tverrgående fagsider, blant annet samtaleteknikk, relasjonsledelse, feedback/prestasjon, lønnssamtaler og konflikt/samarbeid
- faggrunnlaget for mobbing og seksuell trakassering bør balanseres slik at det ikke blir uforholdsmessig dominert av seksuell trakassering

---

## Oppsummering av hvordan KI er brukt

ChatGPT har vært brukt til:

- idéutvikling og drøfting av produktvalg
- forslag til brukerflyt og UX
- generering og redigering av HTML, CSS, JavaScript og Node.js-kode
- integrasjon mot OpenAI, Supabase og senere OpenRouter
- utforming av systemprompt, svarstruktur og sikkerhetsregler
- personvernlogikk og testscenarier
- utvikling av samtalesimulator og testregime
- feilsøking av kode, API-kall, Render og Supabase
- fag- og kildebank, med manuell vurdering og senere krav om mer kuraterte kilder
- benchmarkoppsett for modellkvalitet, responstid og kostnad
- BMAD-dokumentasjon, README, Product Brief og refleksjonsnotater
- forslag til design, ikoner og bilder
- kvalitetssikring og regresjonstester

KI har ikke vært brukt som en autonom utvikler som har tatt endelige produktbeslutninger. Mange forslag er blitt forkastet, endret eller korrigert etter min testing og vurdering. Flere misforståelser har ført til nye krav, blant annet regelen om at nye appversjoner ikke skal bygges før jeg uttrykkelig sier «go/kjør», at eksisterende logoer og bilder ikke skal overskrives, og at godkjente visuelle komponenter ikke skal endres uten at det er avtalt.

Prosessen har derfor i praksis vært:

**planlegg → bygg → test → oppdag feil eller svakheter → korriger krav → bygg videre → dokumenter**

Dette gir et mer korrekt bilde av KI-bruken enn å fremstille prosjektet som en lineær prosess der ChatGPT leverte ferdige løsninger som ble brukt uendret.
