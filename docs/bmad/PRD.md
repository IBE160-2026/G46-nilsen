# Product Requirements Document – Samtalestøtte

> **Statuskontroll 25.11.2026:** Produktkravene er fortsatt 36 identifiserte krav, ikke automatisk 36 fullt aksepterte funksjoner. PR #16/#17 er smale feilrettinger; ingen nye normative PRD-krav er vedtatt. Gjeldende kode/Render: `61d282dc`, [Quality Gate](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45662862335) = grønn, Render = `live` før denne dokumentasjonsrevisjonen. Se [prosjektstatus](../PROSJEKTSTATUS.md) og [revisjonsrapport](../DOKUMENTASJONSREVISJON-2026-11-25.md).


**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Product Requirements Document  
**Rammeverk:** BMAD  
**Status:** Kravoversikt revidert 18.11.2026; leveransestatus oppdatert 25.11.2026. Tidligere status/testbevis er bevart som historiske.  
**Historisk versjon ved opprinnelig dokumentrevisjon:** `main` v20.11.5 (kontrollgrunnlag `2ae505adc22a9ea86ef89e5cf045f4ec5f68d0cf`, 12.11.2026). **Gjeldende publiserte versjon 25.11.2026:** `main` commit `f591ad763990f74daca90b43f350cb672e66857b` (package-versjon `20.11.6`), bekreftet live på Render. LIVE/tale kun arkivert eksperimentell pilot, ikke aktiv produksjonsfunksjon.  
**Leveransestatus oppdatert 25.11.2026:** PRD har 36 unike krav-ID-er med matchende sensormatrise. PR #12, #14 og #15 er slått sammen med `main`; eldre omtale av disse som åpne utkast er **historisk status**, ikke dagens reposituasjon. Siste Quality Gate på `main` for commit `f591ad7` var 3/3 bestått. Hva Canvas krever for formell levering og refleksjonsrapportens endelige godkjenning er fortsatt uavklart. Se [gjeldende prosjektstatus](../PROSJEKTSTATUS.md) og [historisk innleveringskontroll](../INNLEVERINGSKONTROLL-2026-11-20.md).
**Språk:** Norsk

---

# 1. Formål

Samtalestøtte er en KI-basert webapplikasjon for ledere som skal forberede og øve på krevende samtaler med medarbeidere.

Løsningen skal gi praktisk støtte til:

- å strukturere situasjonen
- forberede samtalen
- finne relevante spørsmål og formuleringer
- vurdere mulige reaksjoner
- øve gjennom samtalesimulering
- reflektere over videre oppfølging

KI skal støtte lederens vurderinger, ikke overta beslutningsansvaret.

Produktet skal derfor kombinere praktisk KI-støtte med tydelige grenser for:

- personvern
- sikkerhet
- faglig usikkerhet
- juridiske og HR-relaterte vurderinger
- menneskelig ansvar

---

# 2. Produktproblem

Krevende medarbeidersamtaler er en vanlig del av lederrollen, men mange ledere får begrenset praktisk trening før situasjonene oppstår.

Eksisterende generelle KI-verktøy kan gi hjelp, men mangler ofte:

- struktur for lederens arbeidsflyt
- relevant faglig kontekst
- personvernbeskyttelse før KI-kall
- simulering av selve samtalen
- tydelige begrensninger mot diagnoser, skyld og bastante konklusjoner
- systematisk kvalitetssikring

Samtalestøtte skal derfor være et domenespesifikt støtteverktøy fremfor en generell chatbot.

---

# 3. Produktmål

Produktet skal:

1. gjøre det enklere å forberede krevende medarbeidersamtaler
2. gi konkret og situasjonstilpasset KI-støtte
3. redusere risikoen for deling av identifiserende informasjon
4. tilby praktisk samtaletrening
5. støtte flere relevante samtaletemaer
6. gi innloggede brukere tilgang til egen historikk
7. støtte kvalitetssikring av KI gjennom testing og modellvurdering
8. kunne videreutvikles uten å være låst til én enkelt KI-provider
9. strukturere kunnskap og arkitektur slik at en framtidig lukket/offline variant kan bruke lokal fagbank, lokal RAG og intern KI

---

## 3.1 Målbar suksess og motmål (knyttet til krav)

Disse målene konkretiserer produktmålene uten å påstå at alle ende-til-ende-kontroller er utført. Kvalitetsresultater gjelder **identifisert kodeversjon, testsett og miljø**, ikke generelt enhver senere modellrespons.

| ID | Mål / observerbart kriterium | Primærkobling | Test-/bevisnivå |
|---|---|---|---|
| SM-01 | Ni hovedtemaer og 48 gjeldende undertemaer finnes i gjeldende taksonomi; minst to golden-caser per hovedtema | FR-02, FR-15 | Maskinell schema-/data-kontroll; kontekstkretsen krever også runtime-test |
| SM-02 | En anonymisert situasjon kan brukes i hovedveiledning og følges opp uten å miste relevant kontekst; ny samtale arver ikke den gamle | FR-01, FR-03, FR-04, AI-05 | Ende-til-ende-brukerreise UJ-01; må bekreftes på endelig commit |
| SM-03 | Definerte PII-typer stoppes i serverkontroll selv om klientkontrollen omgås | FR-06, NFR-02 | Deterministiske negativtester og faktisk endepunktskontroll |
| SM-04 | En bruker skal ikke kunne lese eller slette en annen brukers historikk | FR-07, FR-09, FR-11, NFR-01 | Server/RLS-integrasjonstest på testdatabase; ikke bevist kun med tekstsøk |
| SM-05 | Høyrisiko-caser i definert golden-bank skal ikke ha kritiske avvik etter prosjektets eksplisitte fasit | FR-15A, AI-01–04, FR-16 | Datert live-evaluering + manuell vurdering; egen fasit er ikke ekspertgodkjenning |
| SM-06 | Hovedflyten skal kunne prøves uten API-nøkler via deterministisk demomodus | NFR-05, FR-03 | `npm run demo`, kontroll av brukerreise i lokal demo |
| C-01 (motmål) | Ikke fremstå sikrere ved å fjerne usikkerhetsmarkører, gjette tariff eller gi bastante juridiske konklusjoner | AI-04, FR-22 | Negativ fasit og kritisk menneskelig review |
| C-02 (motmål) | Flere kildehenvisninger teller ikke som bedre svar dersom kilde er irrelevant eller virkeområdet er feil | FR-15A, FR-16 | Forbudte/forventede `source_id`-kontroller |

For faktisk brukeropplevelse kan vi måle hvor mange som fullfører UJ-01 uten hjelp, men **terskel og utvalg må fastsettes før en ny test**, ikke baklengs fra observerte pilotfunn. Fire dokumenterte surveys kan ikke gi generaliserbare prosenter.

## 3.2 Avgrensning av leveransen (MVP / utvidelser / videre arbeid)

**V1-kjerne:** Situasjonsbeskrivelse og tema, strukturert KI-råd, oppfølgingsdialog, samtaleøvelse/refleksjon, personverngateway, innlogging og bruker-eid historikk samt fungerende brukerflate på desktop/mobil. Disse delene er utviklet i prototypen; faktisk godkjenningsstatus følger testregisteret.

**Tillegg i prototypen med varierende modenhet:** Roller og admin, SOURCEBANK og yrkes-/sektorkontekst, kilde-/webfunksjoner, modellvalg, benchmark, kostnadsinformasjon, PWA og utskrift. Et implementert tillegg er ikke automatisk ende-til-ende-verifisert i produksjonsmiljø.

**Utenfor ferdig produksjonsleveranse:** Full intern/offline KI med lokal RAG, native mobilapp, full ekstern ekspertvalidering, representativ fullskala brukertesting og LIVE/tale. **LIVE er kun i isolert pilotgren/-Render og skal ikke telle som ferdig FR-23.**

Denne inndelingen bygger på `product-brief.md` og prosjektets faktiske utvikling. Sekundære roller (redaktør/admin) er tekniske tilleggsfunksjoner, ikke et løfte om separate komplette HR- eller lederutviklerprodukter.

# 4. Ikke-mål

Samtalestøtte skal ikke:

- være et HR-system
- være et personalsystem eller journalsystem
- lagre formelle personalsaker
- ta beslutninger om medarbeidere
- automatisere oppsigelser eller andre personalvedtak
- stille medisinske eller psykologiske diagnoser
- fastslå motiv, skyld eller sannhet i konflikter
- erstatte HR, jurist, bedriftshelsetjeneste eller lederens eget skjønn
- trene egen språkmodell på brukerdata
- bruke brukerens samtaler som skjult treningsgrunnlag
- være ferdig produksjonsløsning for klassifiserte eller lukkede nettverk

---

# 5. Primærbruker

Primærbrukeren er en leder som står foran en krevende samtale med en medarbeider.

Typiske behov:

- forstå hva som er kjernen i situasjonen
- finne mål for samtalen
- formulere en god åpning
- stille relevante spørsmål
- forberede seg på reaksjoner
- øve på samtalen
- reflektere før eller etter samtalen

Sekundære brukergrupper kan være:

- HR
- lederutviklere
- redaktører
- systemadministratorer

---

# 6. Hovedtemaer

Leveransen støtter ni hovedtemaer:

1. Alkohol og rus
2. Fravær og oppfølging
3. Prestasjon og utvikling
4. Lønn og utvikling
5. Samarbeid og kommunikasjon
6. Oppsigelse og avslutning av arbeidsforhold
7. Sikkerhet og ansvar
8. Livssituasjoner
9. Mobbing og trakassering

Hvert tema kan ha undertemaer som brukes som kontekst for KI-en.

Den gjeldende V1-taksonomien består av **48 undertemaer**. Tidligere versjoner hadde 56. Reduksjonen kom etter klarspråkgjennomgang, pilotbruk og tilbakemeldinger som viste at enkelte kategorier var for vage, overlappende eller unødvendig smale. De ble slått sammen, omformulert eller fjernet. Dette er en produktforbedring, ikke bare et scope-kutt: målet er at brukeren lettere skal kjenne igjen egen situasjon samtidig som KI-en får tilstrekkelig kontekst.

Brukeren skal ikke være låst til en rigid menystruktur dersom situasjonen beskrives bedre med egne ord.

---

# 7. Kravstatus

Denne PRD-en skiller mellom:

- **IMPLEMENTERT** – finnes i dagens prototype
- **DELVIS** – deler finnes, men området er ikke fullt ferdigstilt
- **VIDERE ARBEID** – planlagt eller ønsket videreutvikling

Dette er gjort for å skille tydelig mellom faktisk leveranse og framtidig ambisjon.

---

## 7.1 Brukerreiser (testgrunnlag, ikke påstander om utført test)

**UJ-01 – Leder forbereder fraværssamtale:** En fiktiv leder velger fraværstema, beskriver en anonym situasjon, får forslag til muntlig åpning og spørsmål, spør videre og starter samtaleøvelse. Ved innlogging kan egen historikk åpnes; ved ny samtale er gammel kontekst borte. Kontrollpunkter: FR-01–07, FR-09, AI-01, AI-05 og NFR-03.

**UJ-02 – Yrke og riktig kilde:** En fiktiv leder beskriver en situasjon der profesjon og arbeidsgivertype kan ha betydning. Med relevant yrkesvalg får løsningen riktig avgrenset regelverk; med irrelevant yrke skal unødvendig profesjonsjuss og ubegrunnet tariff fjernes. Kontrollpunkter: FR-16, FR-22, FR-15A, AI-04 og NFR-02. Denne reisen forutsetter at det aktuelle driftsflagget er aktivert i testmiljøet.

**UJ-03 – Historikk og tilgang:** To separate fiktive brukere logger inn. Bruker A kan se/slette egen samtale, men ikke lese eller endre B sin historikk via direkte API-/databaseforespørsel. Kontrollpunkter: FR-07–11 og NFR-01/02. Krever faktisk rolle-/RLS-integrasjonstest.

Pilotreise for tale er særskilt beskrevet i [LIVE-pilotspesifikasjonen (kun egen pilotgren)](https://github.com/IBE160-2026/G46-nilsen/blob/9fe7aac7e4515f8a195e6a00833c8c7305a66785/docs/pilot/LIVE-V1-PILOT-SPEC.md) på pilotgrenen. Den er ikke del av UJ-01–03 eller produksjonsgodkjenningen.

## 7.2 Felles begreper

| Begrep | Betydning i dette prosjektet |
|---|---|
| Samtalestøtte | Hele produktet, ikke én bestemt svarboks |
| Situasjon | Anonymisert beskrivelse av arbeidsrelatert utfordring |
| Hovedveiledning | Første strukturerte KI-råd knyttet til situasjon og tema |
| Oppfølgingsdialog | Flere spørsmål/svar i samme sak, med avgrenset kontekst |
| Samtaleøvelse / simulator | Fiktiv KI-medarbeider brukt til trening, ikke observasjon av faktisk medarbeidersamtale |
| Personverngateway | Klient- og serverkontroll før eksternt KI-kall |
| SOURCEBANK | Kuratert kildebank med avgrensninger for kildebruk; ikke det samme som lokal RAG |
| Golden/fasitcase | Definert testscenario med maskinelle og/eller faglige kriterier, ikke uavhengig ekspertfasit |
| Pilot | Isolert eksperiment under utvikling; ikke en produksjonsgodkjent funksjon |

## 7.3 Krav, historikk og verifikasjon

Krav-ID-er i §§ 8–10 er den gjeldende **normative kravoversikten** (23 FR + FR-15A + 6 AI + 5 NFR + NFR-QA-01 = **36 identifiserte krav**). Daterte tillegg senere i dokumentet forteller hvordan kravene oppstod; det er ikke egne konkurrerende spesifikasjoner. Statusordene viser hva prosjektet **tidligere har dokumentert**, ikke at dagens bygg automatisk er testet på nytt. `docs/bmad/KRAVSPORING-KONTROLL-2026-11-18.md` og `docs/REVISJON-IBE160-2026-11-18.md` er revisjonsunderlag med eksplisitte åpne punkter.

# 8. Funksjonelle krav

## FR-01 – Situasjonsbeskrivelse

**Status:** IMPLEMENTERT

Brukeren skal kunne beskrive en krevende situasjon i fritekst.

Systemet skal kunne bruke teksten som kontekst for videre KI-støtte.

Brukeren skal ikke måtte fylle ut et omfattende HR-skjema før KI-en kan hjelpe.

### Akseptansekriterier

- bruker kan skrive situasjonen i hovedfeltet
- teksten kan analyseres av KI
- relevant kontekst videreføres i samtalen
- ny samtale starter uten gammel samtalekontekst

### Spor i repoet

- `app.js`
- `server.js`

### Presisert akseptanse for revisjon

En anonymisert situasjon kan legges inn; starten av nytt løp gjenbruker ikke forrige situasjon; relevante verdier føres videre innenfor riktig samtale.



---

## FR-02 – Tema og undertema

**Status:** IMPLEMENTERT

Systemet skal støtte de ni definerte hovedtemaene og tilhørende undertemaer.

KI kan foreslå relevant tema ut fra brukerens tekst.

Brukeren skal kunne korrigere eller velge tema selv.

### Spor

- `app.js`
- `index.html`
- `docs/faggrunnlag/`

### Presisert akseptanse for revisjon

Alle 9 temaer og 48 gjeldende undertemaer kan velges; valgt tema er konsistent mellom klient, backend og kildevalg; ukjent tema gir kontrollert håndtering.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-03 – KI-basert hovedveiledning

**Status:** IMPLEMENTERT

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

### Spor

- `server.js`
- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`

### Presisert akseptanse for revisjon

Anonymisert eksempel gir strukturert, forståelig hovedråd med praktisk samtaleåpning; ugyldig modellrespons håndteres, ikke stilletiende presenteres som gyldig.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-04 – Oppfølgingsdialog

**Status:** IMPLEMENTERT

Brukeren skal kunne fortsette dialogen med KI etter første veiledning.

### Krav

- relevant kontekst beholdes
- unødvendig repetisjon begrenses
- KI kan gi konkrete formuleringseksempler
- nye brukerinnspill skal passere personvernkontroll

### Spor

- `app.js`
- `server.js`

### Presisert akseptanse for revisjon

Bruker kan spørre videre og få svar som bruker relevant gjeldende kontekst; ny samtale eller annen bruker får ikke med tidligere kontekst.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-05 – Samtaleøvelse (samtalesimulering)

**Status:** IMPLEMENTERT

Systemet skal tilby en egen simulator der KI spiller medarbeider.

Simulatoren skal:

- bruke situasjonen som kontekst
- reagere på lederens formuleringer
- opprettholde dialog over flere meldinger
- kunne uttrykke ulike realistiske reaksjoner
- unngå oppdiktede diagnoser og personopplysninger
- la brukeren avslutte øvelsen
- støtte refleksjon etterpå

### Testbevis

- `tests/test-simulation.js`
- siste kontroll: **24/24 kontroller bestått**

### Presisert akseptanse for revisjon

Øvelsen lar leder trene mot en separat medarbeiderrolle; KI skal ikke dikte opp personopplysninger som fakta; tilbakestilling starter ny øvelse.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-06 – Personverngateway

**Status:** IMPLEMENTERT

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

### Testbevis

- `tests/test-privacy.js`
- historisk kontroll: **33/33**; senere dokumentert personvernspakke: **56/56**

### Presisert akseptanse for revisjon

Utvalgte navn, e-post, telefon og identifiserende data i både hovedfelt og oppfølging avvises/varsles før ekstern KI-kall; serverkontroll fungerer selv om klienten omgås.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-07 – Autentisering

**Status:** IMPLEMENTERT

Systemet skal ha brukerkontoer og lukket registrering.

### Krav

- bruker kan logge inn
- bruker kan logge ut
- registrering krever gyldig invitasjon
- sesjon kan beholdes mellom sideoppdateringer
- innlogget bruker skal ikke kunne lese andre brukeres historikk

### Spor

- `server.js`
- Supabase-oppsett
- `database/`

### Presisert akseptanse for revisjon

Uautorisert bruker får ikke innlogget funksjon/data; autorisert innlogging etablerer riktig sesjon; utlogging/utløp opphever tilgangen.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-08 – Engangsinvitasjoner

**Status:** IMPLEMENTERT

Nye kontoer opprettes gjennom engangsinvitasjoner.

Invitasjoner kan brukes til kontrollert tilgang til beta- og vurderingsmiljø.

### Spor

- `scripts/create-invite.js`
- adminfunksjoner
- serverlogikk

### Presisert akseptanse for revisjon

Gyldig invitasjon kan brukes i tiltenkt flyt; ugyldig/utløpt/gjenbrukt invitasjon avvises; hemmelig token skal ikke lekke i respons/logg.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-09 – Historikk

**Status:** IMPLEMENTERT

Innlogget bruker skal kunne:

- se tidligere samtaler
- åpne en tidligere samtale
- lese eller fortsette relevante samtaler
- slette egen historikk

Historikk skal være knyttet til riktig bruker.

### Testbevis

- `tests/test-history-hotfix.cjs`

### Presisert akseptanse for revisjon

Bruker kan åpne og slette egne samtaler; slettet samtale vises ikke igjen etter oppdatering; forsøk på å hente en annens samtale avvises også på server-/RLS-nivå.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-10 – Rapportering av KI-svar

**Status:** IMPLEMENTERT

Brukeren skal kunne rapportere et KI-svar som oppleves problematisk.

Rapporteringen kan inneholde:

- type problem
- kommentar
- teknisk referanse
- modell
- tidspunkt

Samtaleinnhold skal ikke inkluderes automatisk.

### Presisert akseptanse for revisjon

Rapportering oppretter forventet post og knytter hendelsen korrekt; personvernhensyn er ivaretatt; bruker får tydelig tilbakemelding om utfallet.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-11 – Roller

**Status:** IMPLEMENTERT

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

### Presisert akseptanse for revisjon

Bruker, redaktør og admin har nøyaktig tillatte rettigheter; serveren avviser handlinger over rollen uavhengig av skjult UI.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-12 – Admin

**Status:** IMPLEMENTERT

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

### Presisert akseptanse for revisjon

Innholds- og brukeradministrasjon følger rollegrensene; endringer persistenteres korrekt; ugyldig endring avvises.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-13 – Modellvalg

**Status:** IMPLEMENTERT I PROTOTYPEFORM

Systemet skal ikke være permanent låst til én KI-modell.

Admin skal kunne velge mellom støttede modeller.

Arkitekturen skal støtte flere providere.

### Støttede prinsipper

- OpenAI
- OpenRouter
- modellkonfigurasjon via server

### Spor

- `server.js`
- adminlogikk
- `data/BENCHMARK-CASES.json`

### Presisert akseptanse for revisjon

Modellvalg godtar bare støttede modeller/providers; nøkler blir på serversiden; manglende provider gir forståelig feil, ikke skjult fall-back til uventet modell.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-14 – Modellbenchmark

**Status:** IMPLEMENTERT I PROTOTYPE/TESTFORM

Prosjektet skal kunne sammenligne KI-modeller på et felles testgrunnlag.

Aktuelle vurderingsområder:

- kvalitet
- situasjonsforståelse
- relevans
- responstid
- tokenbruk
- kostnad

Systemet inneholder også støtte for blind modell-sammenligning.

Selve benchmarkverktøyet og testgrunnlaget er implementert i prototype/testform. En full fler-modell-benchmark er ikke dokumentert som gjennomført og skal derfor ikke fremstilles som et ferdig evalueringsresultat.

### Spor

- `tests/test-model-compare.js`
- benchmarklogikk i app/server
- `data/BENCHMARK-CASES.json`

### Presisert akseptanse for revisjon

Samme anonymiserte testgrunnlag kan brukes på minst to konfigurerte modeller ved faktisk tilgjengelig konfigurasjon; kostnad/latens og resultat holdes atskilt fra faglig fasit. Bare prototype hvis ikke full kjøreport finnes.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-15 – Automatisert KI-testing

**Status:** IMPLEMENTERT

Prosjektet skal ha automatiserte testoppsett for KI-svar.

Dette omfatter:

- kort KI-test
- full KI-test
- stresstest
- problemcaser
- simulator-live-test
- modell-sammenligning

### Spor

- `tests/test-ai.js`
- `tests/test-ai-stress.js`
- `tests/test-simulation-ai.js`
- `tests/test-model-compare.js`
- `tests/test-ai-golden.js`
- `tests/test-golden-schema.cjs`
- `tests/test-golden-utils.js`
- `tests/AI-GOLDEN-CASES.json`
- `tests/cases/`

Automatisert vurdering skal brukes som støtte og ikke erstatte manuell vurdering av KI-kvalitet.

Golden/fasittesten knytter representative KI-caser til eksplisitte kravreferanser, maskinelle kontrollpunkter og en menneskelig vurderingsfasit med `MÅ`, `BØR` og kritiske feil. Fasitbankens struktur og 9/9 temadekning kan verifiseres uten API-nøkkel.

### Presisert akseptanse for revisjon

Golden-bankens schema og temadekning valideres deterministisk; `npm test` krever ikke nøkkel; live-evaluering kjøres separat med bevart rapport, dato, modell og kodeversjon.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-15A – Kildepresisjon og negativ fasit

**Status: IMPLEMENTERT 08.11.2026**

Automatisert testing skal ikke bare kontrollere at et KI-svar har faglig grunnlag. For yrke, tariff og rettslige/formelle saker skal testgrunnlaget kunne uttrykke:

- obligatorisk source_id
- minst én av flere akseptable source_ids
- eksplisitt forbudte source_ids
- at ingen kuratert kilde normalt er nødvendig
- forventet yrkesrelevans
- forventet behov for arbeidsgivertype

**Akseptansekriterier**
1. Alle 14 sektorer har minst én positiv og én negativ yrkesrelevans-case.
2. Positiv yrkescase kan ikke eksistere uten eksplisitt forventet kildefasit.
3. Negativ yrkescase må ha negativ kildefasit.
4. Kildelekkasjecase må ha minst én eksplisitt forbudt source_id.
5. Forbudt source_id vurderes som kritisk avvik i golden-runneren.
6. Privat/ukjent arbeidsgiver skal ikke få tariffområde gjettet.
7. Generelt sykefravær skal ikke bli profesjonsjuss bare på grunn av yrkestittel.

### Presisert akseptanse for revisjon

I 14 sektorer finnes én positiv og én negativ kilde-/yrkesrelevanscase. Forbudt source_id gir kritisk avvik; tariffområde skal ikke gjettes.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-16 – Faggrunnlag

**Etterprøvbar kildebruk:** Brukeren skal ved faglig relevante påstander kunne se relevant faggrunnlag/kilder og åpne kildene. Modellen skal skille faktisk kildeinformasjon fra egen syntese og ikke dikte opp en kilde ved manglende dekning. Bindende rettslige påstander må bygge på gjeldende lov/forskrift der relevant; forskning, Akan og IA skal ikke fremstilles som lovhjemler. Myndighetsoversikter er søkeinnganger og ikke automatisk direkte rettskilder.

**Status:** IMPLEMENTERT

Produktet skal ha dokumentert faglig grunnlag.

Kunnskapsstrategien skal følge prinsippet **riktig kildetype til riktig type råd**:

- norske lover, forskrifter og myndighetskilder prioriteres ved plikter, rettigheter og formelle prosesser
- fagfellevurdert forskning, evidensgjennomganger og anerkjent faglig veiledning prioriteres foran tilfeldige nettartikler ved samtaleteknikk, feedback, motivasjon, konflikt og ledelse
- nettsøk brukes som supplement når den kuraterte fagbanken ikke dekker behovet, ikke som erstatning for kildekritikk
- kilden skal faktisk støtte den konkrete påstanden eller anbefalingen som gis
- faggrunnlaget skal organiseres slik at det senere kan inngå i lokal kunnskapsbank/RAG ved lukket eller offline drift

Dette finnes som:

- felles SOURCEBANK
- temaspecifikke faggrunnlag
- KI-regler for faglig usikkerhet

### Spor

- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/faggrunnlag/`

### Presisert akseptanse for revisjon

Råd viser kun verifiserbar/kuraterbar kilde der kilde kreves; relevans og virkeområde er dokumentert; ugyldig/forbudt profesjons- eller tariffkilde avvises i definert negativ case.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-17 – Brukertesting

**Status:** PILOT GJENNOMFØRT / VIDERE EVALUERING

Produktet skal kunne brukertestes systematisk.

Brukertesting skal undersøke blant annet:

- om hovedflyten forstås
- om navigasjonen er tydelig
- om KI-svar oppleves relevante
- om simulatoren oppleves realistisk
- om personverninformasjonen forstås

Pilot-/brukertesting er gjennomført med et begrenset kvalitativt utvalg. Funnene brukes som produktinnsikt, men skal ikke fremstilles som statistisk representativ brukerforskning eller ekstern faglig validering.

Resultater fra brukertesting har allerede ført til konkrete revisjoner av krav, UX og taksonomi, blant annet reduksjonen fra 56 til 48 undertemaer, tydeligere språk, mobil/PWA-arbeid, utskrift og videre oppfølgingsflyt.

### Presisert akseptanse for revisjon

Gjennomført brukertest har anonymiserte observasjoner med antall testpersoner, metode, funn, beslutning og avgrensning; planlagt test er ikke ført som gjennomført.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-18 – Web- og kildeanalyse

**Status:** DELVIS / PROTOTYPE

Systemet har funksjoner og arkitektur knyttet til kilde- og webbruk.

Målet er å kunne analysere hvilke kilder som brukes uten å bygge brukerprofiler eller lagre unødvendig samtaleinnhold.

Videre utvikling av dette området er mulig.

### Presisert akseptanse for revisjon

Kontrollert web-/kildeanalyse skiller faktisk hentet kilde fra intern modellkunnskap; utilgjengelige kilder fører ikke til fabrikkert rettskilde; delvis status beholdes der det ikke er testet.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## FR-19 – Videre oppfølgingsflyt
Status: IMPLEMENTERT I MAIN / KREVER PRODUKSJONSVERIFISERING

Etter et oppfølgingsspørsmål skal brukeren ikke måtte finne neste spørsmål helt alene. Systemet skal kunne foreslå 2–4 korte, situasjonsnære neste spørsmål basert på siste spørsmål og svar. Forslagene skal ikke erstatte fritekst.


### Presisert akseptanse for revisjon

Ved oppfølging foreslås normalt 2–4 korte relevante spørsmål der funksjonen er aktiv; fritekst kan fortsatt brukes; relevans og mobilvisning kontrolleres manuelt.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.

## FR-20 – Utskrift av samtalestøtte
Status: IMPLEMENTERT I MAIN / KREVER PRODUKSJONSVERIFISERING

Brukeren skal kunne skrive ut en enkel samtalemal som inneholder situasjonsbeskrivelse, tema/undertema når tilgjengelig, genererte hovedråd og eventuelle videre spørsmål/svar fra oppfølgingsdialogen. Sammenfoldet innhold skal presenteres lesbart i utskriftsversjonen. Navigasjon, personvernvarsler, rapporteringsknapper, samtaleøvelse og øvrige UI-elementer skal ikke inngå.


### Presisert akseptanse for revisjon

Utskrift inneholder situasjon, relevante hovedråd og oppfølgingsråd, også når skjermseksjon er sammenfoldet; knapper/nav/personvernvarsel skal ikke skrives ut; sjekk fysisk print preview.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.

## FR-21 – Rolig standardnavigasjon
Status: IMPLEMENTERT I MAIN / KREVER PRODUKSJONSVERIFISERING

På desktop skal sidebaren være minimert som standard for nye brukere. Brukerens eksplisitte valg om å åpne/lukke menyen skal lagres lokalt. Minimert modus skal ha forståelige tooltips.


### Presisert akseptanse for revisjon

Sidebar er minimert som standard for ny bruker på desktop; manuelt valg bevares lokalt; verktøytips kan nås og er forståelige; mobilflyt kontrolleres separat.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.

## FR-22 – Yrke/bransje som valgfri kontekst

**Avgrensning av virkeområde:** Profesjonsregelverk skal avgrenses til relevant yrke, ikke bare sektor. Myndighetsveiledning, tariffavtaler og juridiske bindende kilder har ulik status. Arbeidsgivertype og avtaleområde skal ikke gjettes. En generell arbeidslivssak uten yrkesrelevans skal ikke utløse unødvendig særregelverk.
Status: IMPLEMENTERT I PRODUKSJONSKODEN / DRIFTSSTYRT MED FEATURE FLAGG

Yrke eller bransje kan brukes som valgfri kontekst når dette faktisk påvirker praktiske råd, risiko, regelverk eller avtaleverk. Produksjonskoden har felt, lokal ruting, serverkontekst, kildebank og regresjonstester. `OCCUPATION_CONTEXT_ENABLED` beholdes som driftskontroll.

Krav:
- yrkesvalg skal være valgfritt
- yrket skal ignoreres når det ikke endrer rådet
- særkilder kan avgrenses til konkrete yrker, ikke bare sektor
- et profesjonsregelverk skal ikke lekke til andre yrker i samme sektor
- systemet skal ikke anta tariffområde bare ut fra yrkestittel
- tidskritiske rettslige påstander skal kontrolleres mot gjeldende autoritativ kilde
- ordinære mellommenneskelige samtaler skal ikke overjuridifiseres

Det autoritative yrkes-/sektorregisteret ble 08.11.2026 utvidet fra 31 til 86 startkilder etter gjennomgang av alle yrkene i sektorlisten.



### Presisert akseptanse for revisjon

Yrke er valgfritt; irrelevante yrker gir ikke profesjonsjuss; tvetydig yrke avklares; tariffområde gjettes ikke; negativ kildefasit fanger kildelekkasje. Bekreft feature flagg og faktisk miljø.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.

## FR-23 – Direkte samtale som alternativ inngang
Status: VIDERE ARBEID / HYPOTESE – IKKE FERDIG FUNKSJON

Prosjektet kan teste en mer direkte samtaleinngang der brukeren beskriver en krevende arbeidssituasjon og starter KI-dialog uten først å gå gjennom hele den strukturerte tema-/undertemaflyten.

Dette skal ikke beskrives som en unik funksjon eller som implementert før faktisk kode og bruker-/regresjonstest foreligger.

En eventuell prototype skal vurderes mot:
- om brukeren kommer raskere til relevant støtte
- om svarene blir for generelle uten strukturert temakontekst
- om personvern og rollegrenser ivaretas like godt
- om arbeidslivskontekst og kildebruk beholdes
- om direkte samtale bør være alternativ inngang eller supplement til eksisterende flyt

### Presisert akseptanse for revisjon

Direkte samtaleinngang uten obligatorisk temameny er en hypotese og skal ikke telles som implementert i main. Eventuell slik inngang må prøves mot relevans og personvern. LIVE/tale er et separat piloteksperiment som heller ikke er produksjonssatt.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

# 9. KI-krav

## AI-01 – Fakta og antakelser

**Status:** IMPLEMENTERT SOM KI-REGEL

KI skal skille mellom:

- informasjon brukeren faktisk har oppgitt
- mulige tolkninger
- antakelser
- informasjon som mangler

### Presisert akseptanse for revisjon

Modellen skiller eksplisitt observasjoner fra antakelser ved usikre saker; test mot caser med mangelfullt faktagrunnlag.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## AI-02 – Ingen oppdiktede diagnoser

**Status:** IMPLEMENTERT OG TESTET

KI skal ikke dikte opp medisinske eller psykologiske diagnoser.

Dette gjelder også simulatoren.

### Presisert akseptanse for revisjon

Caser om helseplager/rus får ikke medisinsk diagnose eller fastslått avhengighet.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## AI-03 – Ingen oppdiktet skyld eller motiv

**Status:** IMPLEMENTERT SOM KI-REGEL

KI skal ikke fastslå:

- skyld
- motiv
- personlighet
- sannheten i en konflikt

uten tilstrekkelig grunnlag.

### Presisert akseptanse for revisjon

Mobbing/konflikt-caser får ikke automatiske påstander om skyld, hensikt eller motiv.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## AI-04 – HR og juridiske spørsmål

KI skal ikke utlede et bestemt tariffområde eller rettslig svar når arbeidsgivertype, virkeområde eller faktagrunnlag mangler. Den skal presisere usikkerhet og bruke relevant autoritativt kildegrunnlag fremfor generiske rettslige påstander.

**Status:** IMPLEMENTERT SOM KI-REGEL

KI skal være tydelig på usikkerhet og anbefale relevant faglig bistand når situasjonen krever det.

### Presisert akseptanse for revisjon

Komplekse juridiske/HR-saker har nøktern usikkerhet og anbefaler relevant faglig bistand, uten bastante rettslige konklusjoner uten grunnlag.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## AI-05 – Kontekst

**Status:** IMPLEMENTERT

KI skal beholde nødvendig samtalekontekst, men ny samtale skal ikke arve uvedkommende tidligere kontekst.

### Presisert akseptanse for revisjon

Oppfølgingsdialog tar med relevant kontekst og holder brukere/samtaler isolert; kontroller også lang samtale og reset.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## AI-06 – Modelluavhengighet

**Status:** IMPLEMENTERT I PROTOTYPEFORM

KI-laget skal støtte at modell/provider kan endres uten at hele applikasjonen bygges om.

### Presisert akseptanse for revisjon

Prototypens modell/providergrensesnitt kan bytte konfigurerbar provider uten at personvern-/responskontrakt faller bort; dokumenter begrensningene.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

# 10. Ikke-funksjonelle krav

## NFR-01 – Sikkerhet

**Status:** IMPLEMENTERT PÅ PROTOTYPENIVÅ

Systemet skal blant annet bruke:

- server-side tilgangskontroll
- databasepolicy/RLS
- sikre sessions/cookies
- rate limiting
- same-origin-kontroll
- sikkerhetsheadere
- begrenset offentlig filtilgang
- server-side personverngateway
- API-nøkler utenfor frontend

### Dokumentasjon

`docs/SIKKERHET-OG-PERSONVERN-v20.4.md`

### Presisert akseptanse for revisjon

Sjekk header/cookie/sesjon/rolle/rate limit/sekretthåndtering med faktiske serverforespørsler og relevante databaserettigheter; statiske tekstsøk er ikke nok.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## NFR-02 – Personvern

**Status:** IMPLEMENTERT

Produktet skal følge prinsipper om:

- dataminimering
- formålsbegrensning
- minst mulig unødvendig logging
- bruker-eid historikk
- frivillig deling av samtaleinnhold
- separasjon mellom brukerdata og teknisk analyse

### Presisert akseptanse for revisjon

Personvernkontroll blokkerer definerte PII-kategorier før ekstern sending på server; lagring, sletting og retensjon dokumenteres for faktisk database.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## NFR-03 – Brukervennlighet

**Status:** IMPLEMENTERT MED VIDERE FORBEDRINGSMULIGHET

Løsningen skal ha:

- tydelig navigasjon
- konsekvente komponenter
- forståelige tilbakemeldinger
- lys/mørk/hybrid visning
- responsiv utforming
- minst mulig unødvendig teknisk språk

UX er iterativt forbedret gjennom prosjektet.

### Presisert akseptanse for revisjon

Minst to representative brukerreiser kan fullføres på relevant desktop/mobil uten blokkerende UI-feil; faktisk testutvalg og resultat rapporteres, ikke antas.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## NFR-04 – Feilhåndtering

**Status:** IMPLEMENTERT

Tekniske feil skal så langt som mulig håndteres uten at brukerflyten kollapser.

Sluttbruker skal ikke eksponeres for unødvendig tekniske debugdetaljer.

### Presisert akseptanse for revisjon

Simuler API-timeout, avbrutt nett og uventet svar; brukeren får håndterbar feilmelding, pågående state ryddes og sensitivt råmateriale lekker ikke i feil.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## NFR-05 – Vedlikeholdbarhet

**Modulær frontend og regresjon:** CSS-strukturen skal beholde `styles.css` som inngangspunkt, med `styles-core.css`, `styles-responsive.css` og `styles-overrides.css` i forutsigbar cascade-rekkefølge. Endringer i CSS/komponenter skal kontrolleres mot relevante UI-regresjoner.

**Status:** IMPLEMENTERT SOM ARKITEKTURMÅL

Kode, dokumentasjon, tester og ressurser skal holdes logisk adskilt.

Repoet er organisert i:

- `assets/`
- `data/`
- `database/`
- `docs/`
- `tests/`

### Presisert akseptanse for revisjon

Full `npm test` og avhengighetskontroll er grønne på endelig commit, kodeendringer har avgrenset konsekvens og dokumentert regressjonskontroll. Ikke oppfylt som siste-verifisert CI på main 12.11.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

## NFR-QA-01 – Automatisert quality gate

**Status: IMPLEMENTERT**

Push til `main` skal automatisk kjøre:
- `npm ci`
- full deterministic `npm test`
- `npm audit --omit=dev --audit-level=high`
- strict golden coverage summary

High dependency audit skal være grønn før runden kan omtales som fullført.

Siste dokumenterte grønne quality gate etter live-funn og kildeprioriteringsretting:
- GitHub Actions **42646984725**
- commit `a8756d36c492be39e70611c0946c026234beb965`

Etterpå ble dokumentasjonen for 40/40-sluttresultatet slått inn på `main`, og ny full quality gate **42665279811** var også **SUCCESS**.

### Presisert akseptanse for revisjon

Kvalitetsporten på main må kjøre npm ci, npm test, produksjonsavhengighet-audit og strict golden-oppsummering. Manglende eller hoppet-over steg kan ikke markeres som bestått.

**Verifikasjon:** Kriteriet må prøves mot faktisk implementasjon. Eksisterende «IMPLEMENTERT»-status er historisk dokumentasjon, ikke bevis på at dagens commit er testet.


---

# 11. Testing og dokumenterte bevis

PRD beskriver **hva** løsningen skal gjøre, ikke en løpende liste over hvor mange tester som har vært grønne. Daterte testresultater og opprinnelige T-01–T-08 er bevart i `docs/bmad/PRD-STATUS-OG-HISTORIKK.md`. Kvalitets- og testmetoden er beskrevet i `docs/ai/AI-TESTPLAN.md`; de 36 kravene kontrolleres i `docs/bmad/KRAVSPORING-KONTROLL-2026-11-18.md`. En historisk grønn test er ikke en automatisk godkjenning av gjeldende `main`.

# 12. Akseptansekriterier for levert prototype

Leveransen anses som funksjonelt komplett som prosjektprototype når følgende er oppfylt:

1. appen kan startes og brukes
2. innlogging fungerer
3. lukket registrering fungerer
4. ni hovedtemaer er tilgjengelige
5. situasjonsbeskrivelse kan analyseres
6. KI gir strukturert samtalestøtte
7. oppfølgingsdialog fungerer
8. personverngateway beskytter sentrale KI-flyter
9. samtalesimulering fungerer
10. historikk er tilgjengelig for innlogget bruker
11. rollemodell finnes
12. adminfunksjoner finnes
13. KI-modell kan konfigureres
14. automatiserte tester finnes
15. sentrale personvern- og simulator-tester består
16. dokumentasjon gjør løsning og prosess etterprøvbar
17. gjeldende taksonomi består av 9 hovedtemaer og 48 undertemaer
18. mobil/PWA-flyten fungerer som installasjonslag på støttede nettlesere uten å være avhengig av en native app

---

# 13. Leveransestatus og evidens

**Kjerneproduktet er utviklet som prototype**; enkelte funksjoner er merket delvis, prototype eller videre arbeid. Endelig vurdering må kobles til testet commit og faktisk miljø. `main`-CI 12.11.2026 var **ikke grønn**; se datert status og feilårsak i `docs/bmad/PRD-STATUS-OG-HISTORIKK.md` samt `docs/REVISJON-IBE160-2026-11-18.md`. **LIVE/tale er kun pilot under testing, ikke produksjonssatt.**

# 14. Kjente avgrensninger

Leveransen er en prototype og har derfor bevisste avgrensninger.

Blant annet:

- full produksjonsherding er ikke gjennomført
- fullskala/representativ brukertesting gjenstår; gjennomført pilot er kvalitativ og begrenset
- lukket/offline løsning er ikke implementert
- modellbenchmark er et test- og prototypeområde
- enkelte admin- og analysefunksjoner kan videreutvikles
- KI-kvalitet kan aldri garanteres fullt ut gjennom automatiserte regler

Disse områdene skal ikke fremstilles som ferdige krav i dagens leveranse.

---

# 15. Risikoer

## R-01 – KI kan gi svake eller feilaktige svar

Tiltak:

- systemprompt
- responskontrakt
- faggrunnlag
- testcaser
- menneskelig ansvar
- rapporteringsfunksjon

---

## R-02 – Personopplysninger kan bli skrevet inn

Tiltak:

- klientkontroll
- serverkontroll
- anonymisering
- tydelig informasjon
- dataminimering

---

## R-03 – KI-testing kan gi falske resultater

Tiltak:

- manuell vurdering
- kontekstbevisste tester
- regresjonstesting av selve testlogikken

---

## R-04 – Eksterne tjenester kan endre seg

Tiltak:

- provider-abstraksjon
- konfigurerbart modellvalg
- kuratert og flyttbar SOURCEBANK
- dokumentert framtidig lokal RAG/intern KI-arkitektur
- bruk av nettsøk som supplement fremfor eneste kunnskapsgrunnlag

---

## R-05 – Prosjektomfang kan bli for stort

Tiltak:

- tydelig avgrensning
- skille mellom levert og framtidig funksjonalitet
- modulær utvikling
- prioritering
- dokumentert endringskontroll

---

# 16. Videre arbeid

Følgende er eksplisitt videre arbeid og ikke nødvendige ferdigkrav for dagens leveranse:

- større ordinær brukertest
- ytterligere tilgjengelighetstesting
- videre benchmarking av KI-modeller
- videre kildeanalyse
- lokal RAG/kunnskapsbank
- intern KI-modell
- intern database/autentisering
- full lukket nettverksvariant
- tale/voice i samtaleøvelse, trinnvis fra opplesing og trykk-og-snakk til eventuell realtime/WebRTC etter særskilt personvernvurdering
- videre mobil/PWA-verifisering og eventuelle framtidige native-løsninger dersom et reelt behov oppstår
- videre sikkerhetsherding før eventuell ordinær produksjonsbruk

---

# 17. Sporbarhet mot øvrig dokumentasjon

Denne PRD-en skal leses sammen med:

## Produkt og utvikling

- `product-brief.md`
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md`
- `docs/bmad/ARCHITECTURE-BMAD.md`
- `docs/bmad/UX-DESIGN-BMAD.md`
- `docs/bmad/EPICS-AND-STORIES-BMAD.md`

## KI

- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`
- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`
- `docs/ai/AI-TESTPLAN.md`

## Sikkerhet og faglig grunnlag

- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md`
- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/faggrunnlag/`

## Testing

- `tests/`
- `tests/cases/`

## Historikk

- `CHANGELOG.md`
- Git commit-historikken

---

# 18. Endringskontroll

Når et nytt krav vurderes, skal følgende spørsmål stilles:

1. Hvilket problem løser det?
2. Er det nødvendig for levert prototype?
3. Påvirker det personvern?
4. Påvirker det sikkerhet?
5. Påvirker det KI-atferd?
6. Krever det nye tester?
7. Påvirker det eksisterende brukerflyt?
8. Krever det endring i PRD, arkitektur eller UX?
9. Er det implementert, delvis implementert eller videre arbeid?

Dette skal redusere risikoen for at nye KI-genererte forslag automatisk blir lagt inn i produktet uten vurdering.

---


# 19. Oppsummering

Samtalestøtte er levert som en omfattende KI-basert prototype for lederstøtte ved krevende medarbeidersamtaler.

Kjerneleveransen består av:

- strukturert samtalestøtte
- ni hovedtemaer
- oppfølgingsdialog
- personverngateway
- samtaleøvelse
- autentisering
- historikk
- roller og admin
- faglig kildegrunnlag
- automatiserte tester
- KI-testing og modellvurdering

Produktet er utviklet iterativt.

PRD-en beskriver derfor både hva som faktisk er levert og hvilke områder som er eksplisitt videre arbeid.

Dette skillet er viktig for at krav, kode, tester og dokumentasjon skal kunne sammenlignes direkte uten at framtidige ambisjoner framstår som ferdig funksjonalitet.


# Historikk og senere tilleggsbehov

Faglig transparens, mobil/PWA, opprinnelige pilotkrav 30.10, modulær CSS, kildeautoritet, FR-15A og NFR-QA-01 er bevart ordrett i `docs/bmad/PRD-STATUS-OG-HISTORIKK.md`. Gjeldende FR-15A og FR-19–FR-23 står nå sammen med øvrige funksjonelle krav i § 8; NFR-QA-01 står med de øvrige ikke-funksjonelle kravene i § 10. Historisk beskrivelse skal ikke overstyre de gjeldende kravene.
