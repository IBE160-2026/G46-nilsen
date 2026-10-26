# Tilbakemelding på product brief

| | |
|---|---|
| **Gruppe** | G46 – G46-nilsen (individuell, Cecilie C. Nilsen) |
| **Product brief** | [`product-brief.md`](https://github.com/IBE160-2026/G46-nilsen/blob/main/product-brief.md) på main, commit `54f1d76` (2026-10-26). Første versjon i historikken: `2979834` (2026-09-25) |
| **Tilbakemelding fra** | Faglærer i IBE160 (utarbeidet med KI-støtte) |
| **Dato** | 2026-10-26 |
| **Erstatter** | Tilbakemeldingen fra 2026-10-06 («ingen brief funnet») |

Takk for tydelig beskjed om at repoet nå er riktig. Jeg har kontrollert at `IBE160-2026/G46-nilsen` er public, at `product-brief.md` ligger på main, og at README, BMAD-dokumentene, tester og historikk følger med. Git-historikken er bevart (230 commits med opprinnelige datoer), så sensor kan se hele utviklingsløpet. Rotet rundt repoene er dermed ryddet, og det trekker ikke ned.

## Samlet vurdering

- **Godt utgangspunkt med justeringer.** Briefen og det som er bygget på den er solid. Punktene under handler mest om omfang, sporbarhet i tid og noen få rettinger i README.

**Det som er bra:**

1. Briefen har et konkret problem (krevende medarbeidersamtaler), en tydelig primærbruker (leder med personalansvar) og klare grenser for hva KI-en ikke skal gjøre (ingen diagnoser, skyld, bindende juridiske råd eller personalbeslutninger). Det er et eget og gjennomtenkt produkt, ikke en generell chatbot.
2. Kjeden fra brief til PRD, arkitektur, UX, epics/stories og implementeringsplan finnes i repoet, med 59 stories med akseptansekriterier og en README-tabell som kobler krav til testfil. Det er akkurat den sporbare veien kriterium 1 etterspør.
3. Kjørbarhet er godt løst. `npm run demo` starter appen med deterministiske mock-svar uten `.env`, nøkler eller database, og `npm test` gjør ingen eksterne KI-kall. Jeg klonet repoet og kjørte `npm ci` og `npm test`: alle 13 delkontroller besto (dog på Node 23.11, se punkt 3 under).
4. Kvalitetssikring av KI er tenkt riktig: golden/fasit-bank med minst én case per hovedtema, personverntester i både klient og server, simuleringstester og en erkjennelse av at nøkkelordtester ikke alene avgjør faglig kvalitet.
5. Ingen hemmeligheter er sjekket inn (`.env` er ikke sporet; kontrollert med søk etter vanlige nøkkelmønstre).

**De viktigste endringene:**

1. Gjør rede for forholdet mellom brief og kode i tid (se «Sporbarhet» under).
2. Rett README-feil som hindrer en ren oppstart (se «Neste steg»).
3. Avklar hva som er «kjerne» og hva som er tillegg i v1, selv om mye allerede er bygget.

## Vanskelighetsgrad og gjennomførbarhet

### Vurdert vanskelighetsgrad

- **Vanskelig**

**Sammenlignbart med:** 5) KI-støttet sensurering og 3) KI-styrt simulering av prosjektledelse (vanskelig). Samtalesimulatoren, personverngatewayen og faglig innhold om sensitive HR-tema ligger nærmere disse enn 7) Kurs-FAQ-chatbot (middels).

**Begrunnelse:**

| Faktor | Nivå | Kommentar |
|---|---|---|
| Domenelogikk | Høy | 9 hovedtemaer og 56 undertemaer med faglige begrensninger (arbeidsmiljø, rus, mobbing, oppsigelse). Feil eller overmodige råd kan få konsekvenser for reelle personer. |
| Datamodell | Middels | Brukere, roller, historikk, invitasjoner, logg, kilder. Supabase-migreringer V20–V20.6. |
| Brukere, roller og innlogging | Høy | Innlogging, lukket registrering med invitasjon, user/editor/admin og brukereid historikk. |
| KI i appen | Høy | Strukturert veiledning, oppfølgingsdialog, rollebasert simulator, JSON-skjema for svar, flere modeller, modellsammenligning, kostnadslogging. |
| Integrasjoner | Middels–høy | OpenAI/OpenRouter, Supabase, kontrollert web search, Render. |
| Sanntid/samtidighet | Lav | Ingen flerbruker-sanntid. |
| Filhåndtering | Lav | Ingen opplasting. |
| Sikkerhet og personvern | Høy | Personverngateway i klient og server, personopplysninger i fritekst, tilgangsstyring per bruker. |

**Hva vanskelighetsgraden betyr for dere:** Et vanskelig prosjekt gir mulighet for toppkarakter, men også risiko. Her er risikoen lavere enn vanlig fordi løsningen faktisk fungerer. Risikoen ligger i at omfanget er stort for én person, og at kvalitetssikring av faglig innhold er vanskelig (se under).

### Gjennomførbarhet med BMAD og Claude Code

| Spørsmål | Vurdering | Kommentar |
|---|---|---|
| **Tid og omfang** | OK | Løsningen er allerede bygget og stabil. Briefen sier selv at omfanget er stort; det har gått, men det er en kostnad i vedlikehold og dokumentasjon. |
| **BMAD-flyten** | Risiko | Alle artefakter finnes og er grundige, men briefen er konkret om *hva som skal bygges*, mindre om *hva som er minimum*. Se «Scope». |
| **Egnet for Claude Code** | OK | Node/Express, vanilla JS, Supabase og OpenAI er godt dokumentert. (Verktøyvalget i prosjektet har vært ChatGPT/Codex-basert; ikke noe krav om Claude Code er brutt, men sensor vil se etter at KI-styringen er dokumentert uansett verktøy.) |
| **Kontroll på KI-ens arbeid** | Risiko | Faglig riktighet i HR-/arbeidsrettsnære råd er vanskelig å kontrollere uten fagkompetanse. Golden-bank, faggrunnlag og SOURCEBANK avhjelper dette, men fasiten er skrevet av samme prosjekt som KI-en den tester. |
| **Testbarhet** | OK | Deterministiske tester finnes for personvern, simulering, historikk, UI og fasitstruktur. Live-KI-testing er separat og dokumentert. |
| **Kjørbar for sensor** | OK | Demomodus uten nøkler fungerer. Publisert Render-versjon er tilleggsvalg. |
| **Avhengigheter og kostnader** | OK | Betalte API-er brukes bare ved live-KI, og mock-modus dekker sensor. |

**Konklusjon om gjennomførbarhet:**

- **Gjennomførbart som beskrevet.** Prosjektet er allerede levert i det vesentlige. Justeringene handler om avgrensning og dokumentasjon, ikke om at prosjektet er urealistisk.

**Forslag til justering:**

1. Del Scope i «In for v1 (kjerne)» og «Utvidelser/Explicitly out».
2. Oppgi uttrykkelig hva som er *verifisert* og hva som bare er *planlagt* (web search, modellsammenligning, SOURCEBANK/RAG, rollebasert samtalestøtte).

## 1. Gjennomgang av briefens deler

| Del av brief | Status | Kommentar |
|---|---|---|
| Executive Summary | Juster | Klar på hva appen er. Andre avsnitt blander produkt og utviklingsutfordring («Utviklingsutfordringen er å få …»). Første avsnitt bør kunne stå alene. |
| The Problem | OK | Konkret og troverdig. Kunne hatt ett konkret eksempel («Leder må ta en samtale om gjentatt fravær i morgen og har aldri gjort det»). |
| The Solution | OK | Beskriver brukeropplevelse og grenser. Listen er ellers lang. |
| What Makes This Different | Juster | Ærlig i at fortrinnet ikke er egen modell. Bør navngi alternativene (generelle chatboter, HR-maler, kurs) og si hva de gjør bedre enn Samtalestøtte. |
| Project Complexity | OK | Valgfri del som er verdifull her. Viser selvinnsikt om kompleksiteten. |
| Who This Serves | Juster | Primærbruker er bra. Beskriv gjerne situasjonen mer konkret (nyutnevnt leder i liten/mellomstor virksomhet uten HR-støtte?). Sekundære brukere bør tydelig holdes utenfor v1. |
| Success Criteria | Juster | Retningen er riktig og funksjonell, men formuleringene («hovedflyten fungerer og kan evalueres systematisk») er ikke testbare nok. Bruk «brukeren kan …»-form med mål, f.eks. «alle 9 hovedtemaer gir svar som består golden-sjekk», «bruker A får aldri se bruker Bs historikk». Mye av dette finnes allerede i PRD og kan løftes tilbake i briefen. |
| Scope | Endre | Én samlet setning lister ti funksjonsområder som «første versjon». Det er ingen skille mellom kjerne og tillegg, og ingen «Explicitly out» for funksjoner (kun for HR-integrasjon/drift). |
| Vision | OK | Realistisk og ikke oppblåst. Lukket variant med intern modell er tydelig markert som fremtid. |

## 2. Utgangspunkt for del 1 av mappen

| Kriterium i del 1 | Status | Kommentar |
|---|---|---|
| **1. Prosess og KI-styring** (30 %) | Juster | Sterkt dokumentert (PRD, arkitektur, stories, AI-logg, systemprompt, testplan, refleksjonsutkast). Men: (a) briefen ble første gang committet 2026-09-25, to dager etter at prototypen v1–v12 lå i repoet (2026-09-23), og PRD/arkitektur/stories kom 2026-09-26, mens koden var under utvikling. Sensor vil se at planen delvis er skrevet etter koden. (b) AI-loggen sier selv at den er rekonstruert fra historikk og ikke ordrett. Det er ærlig og bra, men svekker sporbarheten. Se «Sporbarhet». |
| **2. Funksjonalitet og omfang** (20 %) | OK | Mer enn nok funksjonalitet, med fungerende kjerneflyt. Risikoen er heller at bredden gjør helheten vanskeligere å vurdere. |
| **3. Kvalitetssikring og testing** (15 %) | OK | Sterkt: 13 deterministiske delkontroller består, golden-bank dekker 9/9 temaer, personvern- og simuleringstester. Svakhet: 56 undertemaer er ikke alle dekket av golden-caser (9 caser), og fasit er skrevet av prosjektet selv. Vær åpen om det. |
| **4. Design og brukeropplevelse** (10 %) | OK | Egen UX-fil, temabilder, lys/mørk/hybrid-visning, brukertest er nevnt. Briefen selv sier lite om skjermbilder; UX-dokumentet dekker det. |
| **5. Kodekvalitet og arkitektur** (10 %) | Juster | God modularisering er begynt (`src/`), men `app.js` er ca. 3 400 linjer og `server.js` ca. 1 600 linjer. README sier selv at auth, database og API-flyt ligger samlet i `server.js`. Vurder å nevne dette som kjent gjeld og planlagt neste steg. |
| **6. README og kjørbarhet** (10 %) | Juster | Meget god sensorsti (demo, test, live valgfritt). Rettinger i «Neste steg». |
| **7. Ryddighet i repoet** (5 %) | OK | Ryddig struktur, `.env.example`, ingen hemmeligheter, repo-strukturtest. Tilbakemeldingsfilen fra 6. oktober ligger i rot, den kan fjernes eller flyttes til `docs/`. |

### Sporbarhet: brief → kode

Dette er det viktigste punktet. Det er ikke noe galt i å skrive briefen tidlig og la den utvikle seg, men sensor ser at:

- Første commit etter opprettelsen er `cad4048` («v1 – første prototype», 2026-09-23). Brief og BMAD-dokumenter kommer 25.–26. september.
- 2026-09-27 er det 40 commits, og 06.–07. og 13.–15. oktober store dokumentasjons- og testrunder.

Det trenger ikke trekke ned dersom du er åpen om det. Skriv et kort avsnitt (i briefen, `IMPLEMENTATION-PLAN-BMAD.md` eller refleksjonsrapporten) som sier ærlig at prototypen kom først, at BMAD ble innført da prosjektet vokste, og hva BMAD faktisk endret (for eksempel: krav ble låst, regresjonstester kom til, og scope ble avgrenset). Nettopp slik refleksjon er det sensor ser etter. Da fremstår det som lærdom, ikke etterrasjonalisering.

## 3. Neste steg for gruppen

1. **Scope-avsnittet i briefen:** del opp i «In for v1 (kjerne)» med 4–5 punkter (situasjonsvalg → veiledning → oppfølging → simulering → refleksjon, personvern, innlogging/historikk) og «Utvidelser/utenfor» for web search, modellsammenligning, kostnadslogging, SOURCEBANK/RAG og eventuell lukket modell. Marker hva som er bygget og testet, og hva som bare er planlagt.
2. **Success Criteria:** skriv om til 5–8 testbare «brukeren kan …»-kriterier, med henvisning til testfilene i README.
3. **README-rettinger:**
   - `git clone … && cd Samtalestotte` stemmer ikke, mappen blir `G46-nilsen`. Rett til `cd G46-nilsen`.
   - README krever Node `>=26.12.1 <27`. Jeg fikk likevel grønne tester på Node 23.11, så kravet kan hindre sensor unødvendig. Hvis kravet er et sikkerhetskrav for Render, si det, og skriv at `npm run demo` og `npm test` også fungerer på nyere LTS-versjoner (verifiser først). Sjekk om `npm install` gir feil med `engines`.
   - Mappestrukturen i README starter med `Samtalestotte/`; bruk `G46-nilsen/`.
4. **Dokumenter tidsrekkefølgen** (prototype først, BMAD deretter) slik beskrevet over, og hold AI-loggen åpen om hva som er rekonstruert.
5. **Faglig kvalitetssikring:** legg til ett avsnitt i `AI-TESTPLAN.md` om hvem som har vurdert fasiten (du selv? fagperson?) og hvilke undertemaer som ikke er dekket av golden-caser. Prøv gjerne 1–2 ekstra caser for de mest risikable temaene (mobbing/trakassering, avslutning av arbeidsforhold).
6. Fjern eller flytt `tilbakemelding-product-brief.md` fra rot når du har lest denne. Oppdater briefen i repoet med en tydelig commit-melding slik at historikken viser revisjonen.

Prosjektet er langt over det briefen krever. Det som gjenstår er hovedsakelig å gjøre briefen like skarp som resten, og å være ærlig om rekkefølgen planlegging og koding faktisk skjedde i.
