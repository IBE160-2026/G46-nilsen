# Product Requirements Document (PRD) – Samtalestøtte

**Emne:** IBE160 Programmering med KI  
**Gjeldende kravrevisjon:** 20.11.2026  
**Rolle:** Stabilt kravgrunnlag for v1, avgrensede utvidelser og framtidig arbeid.  
**Historikk:** [Tidligere PRD av 12.11.2026](historikk/PRD-2026-11-12.md) er bevart uendret.

> Akseptansekriteriene beskriver hva som skal kunne bevises, ikke hva som automatisk er bestått. Faktisk implementering, teststatus og begrensninger føres i [PRD-STATUS-OG-TESTBEVIS.md](PRD-STATUS-OG-TESTBEVIS.md). Dette skiller lærerens etterspurte krav fra leveransestatus.

## 1. Produktproblem, målgruppe og avgrensning

Ledere kan trenge praktisk trening før krevende medarbeidersamtaler. Generelle chatboter gir ikke nødvendigvis en sammenhengende lederrettet arbeidsflyt, realistisk samtaleøvelse eller kontroll av identifiserende informasjon før et KI-kall. Samtalestøtte er et **domenespesifikt støtteverktøy**, ikke en generell chatbot, et personalsystem eller et beslutningssystem.

**Primærbruker:** Leder med personalansvar, spesielt ved lite HR-støtte eller begrenset ledererfaring. Roller som redaktør og administrator er tekniske driftsroller, ikke egne primærbrukere i v1.

**Ikke-mål:** Føre formelle personalsaker, automatisere oppsigelse, diagnostisere, fastslå skyld/motiv, erstatte HR/jurist/bedriftshelsetjeneste, bruke brukerinnhold til skjult modelltrening eller påstå sikker drift på klassifiserte/lukkede nettverk.

## 2. Scope

| Nivå | Innhold | Aksept |
|---|---|---|
| **V1-kjerne** | Situasjon, tema, hovedveiledning, oppfølging, samtaleøvelse, personvern, innlogging og egen historikk | Brukerreisene UJ-01 og UJ-02 kan gjennomføres |
| **Nødvendig kvalitet** | Kildeautoritet, faggrunnlag, serverkontroll, golden/personverntester, reproducerbar demo | Kritiske krav og negative caser kan verifiseres |
| **Utvidelser/prototype** | Rapportering, admin/redaktør, modellvalg, benchmark, utskrift, yrke/tariff, PWA, webanalyse | Må ikke fremstilles som mer testet enn dokumentert |
| **Utenfor levert v1** | Direkte åpen KI-inngang, live tale som ordinær flyt, lokal RAG/intern KI, fullskala representativ forskning | Egen pilot/kravbeslutning før eventuell leveranse |

Ni hovedtemaer og 48 undertemaer er gjeldende. Tidligere 56 undertemaer er historikk, ikke et alternativt samtidig krav. De ni er: Alkohol og rus; Fravær og oppfølging; Prestasjon og utvikling; Lønn og utvikling; Samarbeid og kommunikasjon; Oppsigelse og avslutning av arbeidsforhold; Sikkerhet og ansvar; Livssituasjoner; Mobbing og trakassering.

## 3. Målbare mål og motmål

| ID | Kriterium | Verifikasjon |
|---|---|---|
| SM-01 | Minst **2 golden-caser per hovedtema** i alle 9 temaer | Golden-schema og manuell gjennomgang av case-relevans |
| SM-02 | Bruker A skal aldri få lese, endre eller slette bruker Bs historikk | RLS, server og test med **to faktiske kontoer** |
| SM-03 | **Minst 4/5 i en ny pilot** kan gjennomføre situasjon → råd → øvelse uten hjelp | Observerte oppgavegjennomføringer; **mål, ikke rapportert oppnådd** |
| SM-04 | Demo og deterministic testpakke kjører uten eksterne API-nøkler | Ren installasjon, npm run demo, npm test |
| SM-C1 | Økt nyttescore må ikke bety flere bastante juridiske påstander eller forbudte kilder | Negative KI-/kilde-caser og manuell fagkritikk |
| SM-C2 | Raskere flyt må ikke omgå personverngateway i oppfølging eller øvelse | Klient- og serverregresjoner |

## 4. Brukerreiser

**UJ-01 – forberedelse:** En leder skal snakke om gjentatt korttidsfravær. Hen beskriver situasjonen uten identifiserende detaljer, velger eller korrigerer et KI-forslått tema, får mål/åpning/spørsmål og stiller et oppfølgingsspørsmål. Relevant kontekst beholdes; nytt emne starter rent. Dekkes av FR-01–04, FR-06, AI-01/04/05.

**UJ-02 – øving:** En leder tar med gjeldende situasjon til samtaleøvelse, møter minst to simulerte medarbeiderreaksjoner, avslutter og reflekterer. Hen kan gjenåpne egne lagrede samtaler, eventuelt skrive ut. Verken simulering eller svar tillegger noen oppdiktet diagnose eller skyld. Dekkes av FR-05, FR-07/09, AI-02/03 og valgfritt FR-20.

## 5. Felles ordliste

| Begrep | Definisjon |
|---|---|
| Situasjon | Brukerens beskrivelse av en arbeidssituasjon |
| Tema/undertema | Kuratert samtalekontekst som brukeren kan velge eller korrigere |
| Hovedveiledning | Strukturert første KI-svar med mål, åpning, spørsmål og videre råd |
| Oppfølgingsdialog | Videre KI-spørsmål i samme relevante kontekst |
| Samtaleøvelse | Dialog med simulert medarbeider |
| Personverngateway | Kontroll i klient og server før relevant ekstern KI-forsendelse |
| Faggrunnlag/SOURCEBANK | Kuraterte lov-, myndighets-, forsknings- og fagkilder |
| Kildeautoritet | Regel for hva som er en egnet kilde til en bestemt påstand |
| Rolle | Serverhåndhevet user, editor eller admin |
| Golden-case | Scenario med maskinelle kontroller og menneskelig fasit |
| Benchmark | Prototypemiljø for sammenligning av modeller på felles tester |
| Demo/live KI | Mocket deterministisk flyt uten nøkler kontra reelt modellkall |

## 6. Funksjonelle krav

Status for hver FR er skilt ut i vedlegget. Listen omfatter hele v1 og eksplisitt videre arbeid – ingen nye FR-patcher er lagt etter siste kapittel.

## FR-01 – Situasjonsbeskrivelse

**Omfang:** Kjerne eller nødvendig kvalitet.

Brukeren skal kunne beskrive en krevende situasjon i fritekst.

Systemet skal kunne bruke teksten som kontekst for videre KI-støtte.

Brukeren skal ikke måtte fylle ut et omfattende HR-skjema før KI-en kan hjelpe.

### Akseptansekriterier

1. Situasjonsbeskrivelsen kan skrives og endres uten omfattende HR-skjema.
2. Den blir brukt som grunnlag for hovedveiledning etter personvernkontroll.
3. Ny samtale sender ikke gammel situasjon videre til KI.

## FR-02 – Tema og undertema

**Omfang:** Kjerne eller nødvendig kvalitet.

Systemet skal støtte de ni definerte hovedtemaene og tilhørende undertemaer.

KI kan foreslå relevant tema ut fra brukerens tekst.

Brukeren skal kunne korrigere eller velge tema selv.

### Akseptansekriterier

1. Ni hovedtemaer og 48 gjeldende undertemaer kan velges.
2. KI-forslag kan korrigeres av brukeren uten tap av situasjonstekst.
3. Temabytte skal ikke ta med kontekst fra avsluttet samtale.

## FR-03 – KI-basert hovedveiledning

**Omfang:** Kjerne eller nødvendig kvalitet.

KI-veiledningen skal kunne gi støtte til:

- mål for samtalen
- struktur
- mulig åpning
- relevante spørsmål
- mulige reaksjoner
- hvordan reaksjoner kan møtes
- videre oppfølging

Svarene skal være praktiske og menneskelig formulert.

KI skal være tilbakeholden med bastante HR-, juridiske og psykologiske konklusjoner.

### Akseptansekriterier

1. Hovedrådet har identifiserbare mål, åpning, relevante spørsmål og oppfølging.
2. Åpningen kan sies av en leder, ikke bare leses som instruksjon.
3. Uavklart juss/HR gis ikke som sikker konklusjon (AI-04/AI-07).

## FR-04 – Oppfølgingsdialog

**Omfang:** Kjerne eller nødvendig kvalitet.

Brukeren skal kunne fortsette dialogen med KI etter første veiledning.

**Nærmere krav**

- relevant kontekst beholdes
- unødvendig repetisjon begrenses
- KI kan gi konkrete formuleringseksempler
- nye brukerinnspill skal passere personvernkontroll

### Akseptansekriterier

1. Oppfølgingsspørsmål kan stilles uten å gjenta hele situasjonen.
2. Gjeldende tema og relevant kontekst beholdes, uvedkommende historikk ekskluderes.
3. Nye innspill kontrolleres for personvern før ekstern KI.

## FR-05 – Samtaleøvelse (samtalesimulering)

**Omfang:** Kjerne eller nødvendig kvalitet.

Systemet skal tilby en egen simulator der KI spiller medarbeider.

Simulatoren skal:

- bruke situasjonen som kontekst
- reagere på lederens formuleringer
- opprettholde dialog over flere meldinger
- kunne uttrykke ulike realistiske reaksjoner
- unngå oppdiktede diagnoser og personopplysninger
- la brukeren avslutte øvelsen
- støtte refleksjon etterpå

### Akseptansekriterier

1. Brukeren kan sende flere replikker til simulert medarbeider og avslutte øvelsen.
2. Reaksjonene følger scenario og brukerens replikker, med refleksjon etterpå.
3. Ingen oppdiktede diagnoser, familieforhold, skyld eller motiv vises som fakta.

## FR-06 – Personverngateway

**Omfang:** Kjerne eller nødvendig kvalitet.

Alle sentrale tekstfelt som kan føre til KI-kall skal passere personvernkontroll.

Kontrollen skal finnes både:

1. i klienten for rask tilbakemelding
2. på serveren som siste sikkerhetsbarriere

### Kontrollen skal blant annet kunne reagere på

- navn
- e-postadresse
- telefonnummer
- identifikatorer
- fødselsopplysninger
- direkte familieopplysninger
- konkret arbeidssted eller unik rolle der dette kan øke identifiserbarheten
- kjønnede formuleringer der nøytralisering er relevant

### Prinsipp

**Anonymiser identitet, ikke nødvendig kontekst.**

Systemet skal ikke love full anonymitet.

### Akseptansekriterier

1. Klient og server kontrollerer representative navn, telefon, e-post, arbeidssted og familieopplysninger.
2. Eksempel med navn og telefonnummer gir kontroll; data skal ikke ukritisk sendes uendret til ekstern KI.
3. Serverkontroll gjelder også ved omgått klient.
4. «Jobbet i 20 år» alene skal ikke feilaktig regnes som alder. Full anonymitet loves ikke.

## FR-07 – Autentisering

**Omfang:** Kjerne eller nødvendig kvalitet.

Systemet skal ha brukerkontoer og lukket registrering.

**Nærmere krav**

- bruker kan logge inn
- bruker kan logge ut
- registrering krever gyldig invitasjon
- sesjon kan beholdes mellom sideoppdateringer
- innlogget bruker skal ikke kunne lese andre brukeres historikk

### Akseptansekriterier

1. Gyldig bruker kan logge inn/ut og får kontrollert feilmelding ved ugyldig sesjon.
2. Beskyttede serverruter avviser uautentiserte brukere.
3. Bruker A får ikke lese, endre eller slette Bs historikk; kontrolleres med to reelle testkontoer.

## FR-08 – Engangsinvitasjoner

**Omfang:** Kjerne eller nødvendig kvalitet.

Nye kontoer opprettes gjennom engangsinvitasjoner.

Invitasjoner kan brukes til kontrollert tilgang til beta- og vurderingsmiljø.

### Akseptansekriterier

1. Registrering uten gyldig invitasjon avvises.
2. Brukt eller utløpt engangsinvitasjon kan ikke gjenbrukes.
3. Invitasjonsadministrasjon krever administratorrolle på serveren.

## FR-09 – Historikk

**Omfang:** Kjerne eller nødvendig kvalitet.

Innlogget bruker skal kunne:

- se tidligere samtaler
- åpne en tidligere samtale
- lese eller fortsette relevante samtaler
- slette egen historikk

Historikk skal være knyttet til riktig bruker.

### Akseptansekriterier

1. Brukeren kan lagre, åpne og slette egen samtale.
2. Slettet samtale er borte også etter ny innlogging.
3. En annen brukers samtale-ID avvises og midlertidig øvelse lagres ikke som normal historikk.

## FR-10 – Rapportering av KI-svar

**Omfang:** Utvidelse / pilot / drift.

Brukeren skal kunne rapportere et KI-svar som oppleves problematisk.

Rapporteringen kan inneholde:

- type problem
- kommentar
- teknisk referanse
- modell
- tidspunkt

Samtaleinnhold skal ikke inkluderes automatisk.

---

### Akseptansekriterier

1. Brukeren kan rapportere kategori og kommentar om KI-svar.
2. Samtaleinnhold inkluderes bare etter eksplisitt valg.
3. Rapporterte utdrag er bare tilgjengelige for administrator.

## FR-11 – Roller

**Omfang:** Utvidelse / pilot / drift.

Systemet støtter tre roller:

- `user`
- `editor`
- `admin`

### User

Kan bruke ordinære brukerfunksjoner.

### Editor

Kan i tillegg redigere godkjent innhold.

### Admin

Kan i tillegg administrere sentrale systemfunksjoner.

Kritiske rettigheter skal valideres server-side.

---

### Akseptansekriterier

1. User/editor/admin får forskjellige serverhåndhevede rettigheter.
2. User kan ikke redigere administrasjonsinnhold, editor kan bare redigere tillatt innhold.
3. Bruker kan ikke gi seg selv høyere rolle ved klientmanipulasjon.

## FR-12 – Admin

**Omfang:** Utvidelse / pilot / drift.

Adminområdet skal gi tilgang til relevante drifts- og kvalitetsfunksjoner.

Dette omfatter blant annet:

- roller
- innholdsredigering
- modellvalg
- benchmark
- kostnadsinformasjon
- rapporterte KI-svar
- kilde-/systeminformasjon

Store adminområder skal kunne minimeres for å redusere visuell belastning.

---

### Akseptansekriterier

1. Relevante drifts- og kvalitetspaneler kan benyttes av administrator.
2. Direkte HTTP-kall fra vanlig bruker til adminrutene gir avslag.
3. Ved skifte av konto vises ikke tidligere administrators private rapportinnhold.

## FR-13 – Modellvalg

**Omfang:** Utvidelse / pilot / drift.

Systemet skal ikke være permanent låst til én KI-modell.

Admin skal kunne velge mellom støttede modeller.

Arkitekturen skal støtte flere providere.

### Støttede prinsipper

- OpenAI
- OpenRouter
- modellkonfigurasjon via server

### Akseptansekriterier

1. Admin kan se og velge mellom støttede modeller i prototypeoppsettet.
2. Ukjent modell-ID skal ikke omgå tillatt serverkonfigurasjon.
3. Nøkler skal ikke eksponeres i klienten; live-providerbytte krever egen test.

## FR-14 – Modellbenchmark

**Omfang:** Utvidelse / pilot / drift.

Prosjektet skal kunne sammenligne KI-modeller på et felles testgrunnlag.

Aktuelle vurderingsområder:

- kvalitet
- situasjonsforståelse
- relevans
- responstid
- tokenbruk
- kostnad

Et eventuelt oppsett for blind modell-sammenligning må presentere resultater uten å avsløre valgt modell før vurdering, og må skille simulert fra reell evaluering.

### Akseptansekriterier

1. Testbank kan brukes på sammenlignbare modellkjøringer.
2. Mockresultater er tydelig skilt fra faktiske live-kjøringer.
3. Ingen full, reell modellbenchmark hevdes uten dokumenterte modellkall og resultater.

## FR-15 – Automatisert KI-testing

**Omfang:** Kjerne eller nødvendig kvalitet.

Prosjektet skal ha automatiserte testoppsett for KI-svar.

Dette omfatter:

- kort KI-test
- full KI-test
- stresstest
- problemcaser
- simulator-live-test
- modell-sammenligning

Testbanken kombinerer maskinelle kriterier og en menneskelig vurderingsfasit med MÅ, BØR og kritiske avvik.

### Akseptansekriterier

1. Deterministiske tester kan kjøres uten eksterne KI-kall.
2. Minst to representative golden-caser per hovedtema dekker alle ni temaer.
3. Live modelltest er separat og rapporteres med modell, dato, avvik og begrensning.

## FR-15A – Kildepresisjon og negativ fasit

**Omfang:** Kjerne eller nødvendig kvalitet.

Automatisert testing skal ikke bare kontrollere at et KI-svar har faglig grunnlag. For yrke, tariff og rettslige/formelle saker skal testgrunnlaget kunne uttrykke:

- obligatorisk source_id
- minst én av flere akseptable source_ids
- eksplisitt forbudte source_ids
- at ingen kuratert kilde normalt er nødvendig
- forventet yrkesrelevans
- forventet behov for arbeidsgivertype

### Akseptansekriterier

1. Alle 14 sektorer har minst en positiv og en negativ yrkescase.
2. Positiv case krever forventet kilde; negativ case må ha eksplisitt negativ fasit.
3. Forbudt source_id gir kritisk avvik, og ukjent arbeidsgivertype skal ikke utløse gjettet tariff.
4. Generelt sykefravær blir ikke profesjonsjuss bare på grunn av yrkestittel.

## FR-16 – Faggrunnlag

**Omfang:** Kjerne eller nødvendig kvalitet.

Produktet skal ha dokumentert faglig grunnlag.

Kunnskapsstrategien skal følge prinsippet **riktig kildetype til riktig type råd**:

- norske lover, forskrifter og myndighetskilder prioriteres ved plikter, rettigheter og formelle prosesser
- fagfellevurdert forskning, evidensgjennomganger og anerkjent faglig veiledning prioriteres foran tilfeldige nettartikler ved samtaleteknikk, feedback, motivasjon, konflikt og ledelse
- nettsøk brukes som supplement når den kuraterte fagbanken ikke dekker behovet, ikke som erstatning for kildekritikk
- kilden skal faktisk støtte den konkrete påstanden eller anbefalingen som gis
- faggrunnlaget skal organiseres slik at det senere kan inngå i lokal kunnskapsbank/RAG ved lukket eller offline drift

Faggrunnlaget skal organiseres i felles SOURCEBANK, temaorienterte faggrunnlag og eksplisitte KI-regler for faglig usikkerhet.

Faggrunnlag skal være tilgjengelig i brukerflaten uten å overlesse hovedsvaret.

### Akseptansekriterier

1. Fagbanken skiller lov/myndighet, forskning, faglige rammeverk og yrkes-/tariffkilder.
2. Rettslige plikter må støttes av gjeldende autoritativ kilde når dette finnes.
3. Kilder skal kunne åpnes og kontrolleres uten å overfylle hovedsvaret.
4. Ingen oppdiktede kildehenvisninger presenteres som fakta.

## FR-17 – Brukertesting

**Omfang:** Utvidelse / pilot / drift.

Produktet skal kunne brukertestes systematisk.

Brukertesting skal undersøke blant annet:

- om hovedflyten forstås
- om navigasjonen er tydelig
- om KI-svar oppleves relevante
- om simulatoren oppleves realistisk
- om personverninformasjonen forstås

Brukerfunn skal føres med dato, situasjon, vurdert alvorlighet og sporbar beslutning. Et lite kvalitativt utvalg skal ikke behandles som statistisk representativ forskning.

---

### Akseptansekriterier

1. Det finnes oppgaver, dokumentert kvalitativ pilot og en sporbar funnlogg.
2. Funn skilles som rapportert, bekreftet, rettet eller kandidat.
3. Liten pilot omtales ikke som representativ; minst én funn-til-test-kjede synliggjøres.

## FR-18 – Web- og kildeanalyse

**Omfang:** Utvidelse / pilot / drift.

Ved web- eller kildeoppslag skal systemet bare registrere nødvendige kilde- og tekniske bruksdata. Løsningen skal ikke bygge brukerprofiler eller lagre samtaletekst i kildeanalysen. Området regnes som en prototype inntil det har bestått separat ende-til-ende-verifisering.

### Akseptansekriterier

1. Kilde-/webanalyse unngår unødvendig logging av samtaletekst.
2. Kilden kan ikke rapporteres som faktisk brukt dersom den ikke var relevant/tilgjengelig.
3. Dette området beskrives som prototype/delvis der end-to-end-verifisering mangler.

## FR-19 – Videre oppfølgingsflyt

**Omfang:** Kjerne eller nødvendig kvalitet.

Etter et oppfølgingsspørsmål skal brukeren ikke måtte finne neste spørsmål helt alene. Systemet skal kunne foreslå 2–4 korte, situasjonsnære neste spørsmål basert på siste spørsmål og svar. Forslagene skal ikke erstatte fritekst.

### Akseptansekriterier

1. Etter oppfølging kan 2–4 situasjonsnære forslag til neste spørsmål vises.
2. Forslagene erstatter aldri fri formulering.
3. Forslag fra gammel samtale følger ikke med inn i ny samtale.

## FR-20 – Utskrift av samtalestøtte

**Omfang:** Utvidelse / pilot / drift.

Brukeren skal kunne skrive ut en enkel samtalemal som inneholder situasjonsbeskrivelse, tema/undertema når tilgjengelig, genererte hovedråd og eventuelle videre spørsmål/svar fra oppfølgingsdialogen. Sammenfoldet innhold skal presenteres lesbart i utskriftsversjonen. Navigasjon, personvernvarsler, rapporteringsknapper, samtaleøvelse og øvrige UI-elementer skal ikke inngå.

### Akseptansekriterier

1. Utskrift kan omfatte situasjon, tema, hovedråd og videre spørsmål/svar.
2. Sammenfoldet innhold som tilhører samtalemalen er lesbart på utskriften.
3. Navigasjon, rapporteringsknapper, simulator og personvernvarsler skrives ikke ut.

## FR-21 – Rolig standardnavigasjon

**Omfang:** Kjerne eller nødvendig kvalitet.

På desktop skal sidebaren være minimert som standard for nye brukere. Brukerens eksplisitte valg om å åpne/lukke menyen skal lagres lokalt. Minimert modus skal ha forståelige tooltips.

### Akseptansekriterier

1. Sidebar er minimert som standard på desktop og husker brukerens eksplisitte valg.
2. Minimert meny har forståelige etiketter/tooltips.
3. Mobilnavigasjon lar brukeren nå hele hovedflyten uten blokkert innhold.

## FR-22 – Yrke/bransje som valgfri kontekst

**Omfang:** Utvidelse / pilot / drift.

Yrke eller bransje kan brukes som valgfri kontekst når dette faktisk påvirker praktiske råd, risiko, regelverk eller avtaleverk. Yrke og bransje skal kunne være valgfri kontekst. OCCUPATION_CONTEXT_ENABLED skal kunne deaktivere utvidelsen uten å stoppe grunnflyten.

Krav:
- yrkesvalg skal være valgfritt
- yrket skal ignoreres når det ikke endrer rådet
- særkilder kan avgrenses til konkrete yrker, ikke bare sektor
- et profesjonsregelverk skal ikke lekke til andre yrker i samme sektor
- systemet skal ikke anta tariffområde bare ut fra yrkestittel
- tidskritiske rettslige påstander skal kontrolleres mot gjeldende autoritativ kilde
- ordinære mellommenneskelige samtaler skal ikke overjuridifiseres

### Akseptansekriterier

1. Yrkesvalg er valgfritt og kan deaktiveres via OCCUPATION_CONTEXT_ENABLED uten at kjerneflyten stanser.
2. Yrkes-/sektorkilder velges bare når yrket er relevant for situasjonen.
3. Kilder for én profesjon skal ikke lekke til andre yrker i samme sektor.
4. Arbeidsgivertype og tariffområde gjettes ikke fra bare yrkestittel.

## FR-23 – Direkte samtale som alternativ inngang

**Omfang:** Hypotese (ikke levert).

Prosjektet kan teste en mer direkte samtaleinngang der brukeren beskriver en krevende arbeidssituasjon og starter KI-dialog uten først å gå gjennom hele den strukturerte tema-/undertemaflyten.

Dette skal ikke beskrives som en unik funksjon eller som implementert før faktisk kode og bruker-/regresjonstest foreligger.

En eventuell prototype skal vurderes mot:
- om brukeren kommer raskere til relevant støtte
- om svarene blir for generelle uten strukturert temakontekst
- om personvern og rollegrenser ivaretas like godt
- om arbeidslivskontekst og kildebruk beholdes
- om direkte samtale bør være alternativ inngang eller supplement til eksisterende flyt

### Akseptansekriterier

1. Dette er en hypotese og skal ikke merkes levert i v1.
2. En eventuell pilot må måle om direkte inngang gir bedre flyt uten lavere personvern-/kildekvalitet.
3. Personverngateway og kontekst må være testet separat før funksjonen kan merkes implementert.

## 7. KI- og kildekrav

**AI-01 – Faktagrunnlag:** Skill brukeropplysninger fra tolkning og manglende fakta. *Aksept:* Et ubekreftet varsel omtales ikke som bevist skyld.

**AI-02 – Ingen diagnose:** Verken veiledning eller simulator skal dikte opp medisinske/psykologiske diagnoser. *Aksept:* Scenario uten diagnose gir ikke diagnosetilskrivning.

**AI-03 – Ingen oppdiktet motiv:** Modellen skal ikke fastslå skyld, motiv eller personlighet uten grunnlag. *Aksept:* Uavklarte konflikter møtes med undersøkende, ikke konkluderende spørsmål.

**AI-04 – Usikkerhet og bistand:** Ved rettslige og HR-relaterte spørsmål skal usikkerhet angis, med henvisning til HR/jurist når nødvendig. *Aksept:* Mulig oppsigelse gir ikke ubetinget lovlighetskonklusjon.

**AI-05 – Relevant kontekst:** Gjeldende samtale beholdes; tidligere avsluttet samtale utelates. *Aksept:* Ny samtale arver ikke irrelevant historikk.

**AI-06 – Provideruavhengighet:** Prototypen skal kunne konfigurere støttede modeller uten klientnøkler. *Aksept:* Ugyldig provider/modell kan ikke omgå serverregler.

**AI-07 – Kildeautoritet:** Rettslige plikter skal bygge på lov/forskrift; tariff krever avtaleavklaring. Myndighetsveiledning, IA/Akan og forskning skal ikke fremstilles som lov. Arbeidsgivertype gjettes aldri. *Aksept:* Negative kildecaser avviser feil profesjons-/tariffkilde.

**AI-08 – Faglig etterprøvbarhet:** Brukeren kan se relevante kilder uten at hovedrådet overlesses. Svar skal skille dokumenterte kildefakta fra KI-ens syntese. *Aksept:* Ingen oppdiktet kilde eller falskt direkte sitat.

## 8. Ikke-funksjonelle krav

**NFR-01 – Sikkerhet:** Server håndhever rolle og autentisering, database bruker RLS, sesjoner/cookies håndteres sikkert og API-nøkler holdes utenfor klienten. Rate-limit-konfigurasjon i gjeldende kode: login 12/15 minutter, registrering 8/time, reset 6/15 minutter, KI 80/10 minutter per rate-limit-nøkkel. *Aksept:* Overskridelse gir HTTP 429 og Retry-After; dette er ikke en påstand om distribuert rate limiting.

**NFR-02 – Personvern:** Minst mulig persondata i historikk og tekniske logger, frivillig vedlegg av samtaletekst ved rapportering. *Aksept:* Normal bruksstatistikk skal ikke inneholde full samtale.

**NFR-03 – Brukbarhet:** Samtaleflyt tilgjengelig i PC-/mobilnettleser, med lys, mørk og hybrid modus. *Aksept:* UJ-01 og UJ-02 kan gjennomføres på definerte skjermbredder uten blokkerte knapper. Full WCAG-revisjon er ikke en levert garanti.

**NFR-04 – Feilhåndtering:** API- og tjenestefeil gir forståelig brukerbeskjed uten stacktrace eller hemmeligheter. *Aksept:* Simulert 401/429/500 håndteres kontrollert.

**NFR-05 – Vedlikeholdbarhet:** Kode, ressurser, tester og dokumentasjon har tydelige ansvarsområder. *Aksept:* Kritiske endringer skal ledsages av en relevant regresjonstest og sporbar beslutning; lange hovedfiler og CSS-overstyringer er fortsatt teknisk gjeld.

**NFR-06 – Frontend-kaskade:** Stylesheet-rekkefølgen er core, responsive, overrides via styles.css. *Aksept:* Større refaktorering verifiseres visuelt i pilot på mobil og desktop; oppdeling alene er ikke full kvalitetssikring.

**NFR-07 – CI:** Endringer som skal merges, kontrolleres med npm ci, npm test, npm audit --omit=dev --audit-level=high og oppsummering av golden-bank. *Aksept:* Hele gate grønn på siste commit; grønne deterministiske tester er ikke uavhengig faglig godkjenning.

**NFR-08 – Demo og kostnad:** npm run demo og npm test kjører uten ekstern modellnøkkel og database. Live modellbruk og kostnads-/benchmarktall er tilleggsfunksjoner. *Aksept:* Demo starter fra ren installasjon, og feil/budsjettstopp gir forståelig beskjed.

## 9. Antakelser og risiko

- **A-01:** Ekstern KI er stokastisk; selv 40/40 interne live-caser er ingen juridisk/faglig garanti.
- **A-02:** Personverngateway kan gi falske positive og negative funn.
- **A-03:** Lov, tariff, provider og eksterne tjenester kan endre seg.
- **A-04:** Én student og bredt scope tilsier prioritering av kjerne framfor nye pilotfunksjoner.
- **A-05:** Yrkeslaget er valgfritt og kan feature-flagg-styres uten å stanse kjernen.
- **R-01:** Plausibelt feil KI-råd møtes med negative golden-caser og manuell kildekritikk.
- **R-02:** Identifiserbare opplysninger møtes med klient- og server-personvernkontroll.
- **R-03:** Intern fasit kan ha testblindsoner; dokumenter begrensninger og inviter ekstern vurdering.
- **R-04:** Eksterne tjenester kan feile eller bli dyrere; demo, budsjett og feilhåndtering må kunne testes.
- **R-05:** KI-genererte endringer kan gi regresjoner; små PR-er, test og praktisk UI-kontroll prioriteres.

## 10. Sporbarhet og endringskontroll

- **Gjeldende krav:** Dette dokumentet.
- **Leveransestatus og testbevis:** [PRD-STATUS-OG-TESTBEVIS.md](PRD-STATUS-OG-TESTBEVIS.md).
- **Historisk PRD og opprinnelige tillegg:** [historikk/PRD-2026-11-12.md](historikk/PRD-2026-11-12.md).
- **UX/arkitektur/stories:** UX-DESIGN-BMAD.md, ARCHITECTURE-BMAD.md, EPICS-AND-STORIES-BMAD.md og IMPLEMENTATION-PLAN-BMAD.md i samme mappe.
- **Prosess:** AI-LOGG-SAMTALESTOTTE.md, AI-TESTPLAN.md og AI-VERIFICATION-ROUND-2026-11-08.md i docs/ai.

**Prosesspresisering:** En fungerende prototype eksisterte før hele BMAD-dokumentasjonen. Denne PRD-en ble konsolidert i ettertid etter brukerfunn, lærerrespons og kodegjennomgang. Den skal ikke leses som en plan som fantes før all implementasjon.

**Endringsregel:** Hver ny funksjon skal ha ID, scope, minst ett testbart akseptansekriterium og en egen statuslinje i vedlegget. Historiske testtall og daterte «patcher» føres ikke lenger etter kravkapitlet.
