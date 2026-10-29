# Samtalestøtte

Samtalestøtte er en webbasert prototype for ledere som skal forberede og øve på krevende samtaler med medarbeidere. Løsningen er utviklet som del av IBE160 Programmering med KI ved Høgskolen i Molde.

Målet er ikke at KI skal ta beslutninger for lederen, men å støtte forberedelse, formuleringer, refleksjon og praktisk øvelse.

Det som skiller Samtalestøtte fra en vanlig KI-chat er at brukeren ikke selv må bygge hele prompten, sikkerhetsrammen og arbeidsflyten. Produktet kombinerer ni hovedtemaer og 48 undertemaer med strukturert forberedelse, oppfølging i samme kontekst, dynamisk samtalesimulering, personvernkontroll i klient og server, kuratert faggrunnlag og systematisk KI-testing.

Kildebruken er også styrt. SOURCEBANK v6 har 62 kuraterte kilder med blant annet norske myndighetskilder, regelverk, organisasjons- og ledelsespsykologi, relasjonsledelse og samtaleteknikk. Banken brukes som førstevalg, mens kontrollert nettsøk fungerer som supplement når kildebanken ikke er tilstrekkelig. Kildetype skal passe til påstanden: lov- og regelverksspørsmål bør forankres i autoritative kilder, mens råd om samtaleteknikk bør bygge på relevant forskning og fagkunnskap. Samtalestøtte er dermed utviklet som et domenespesifikt arbeidsverktøy for krevende medarbeidersamtaler, ikke som et generelt chatgrensesnitt.

## Rask tilgang for vurdering

### Anbefalt sensorløp

**1. Test full funksjonalitet i nettleseren**

Publisert testversjon:

`https://g46-nilsen-samtalestotte.onrender.com`

Den publiserte testversjonen anbefales ved vurdering av selve produktet. Den er allerede konfigurert med prosjektets KI-modell, Supabase og servermiljø, og krever derfor ikke lokal installasjon eller sensorens egen API-nøkkel.

Tilgang til den lukkede testversjonen gis separat sammen med innleveringen.

Render kan gå i dvale ved inaktivitet, så første oppstart kan ta litt ekstra tid.

**2. Kjør appen lokalt uten nøkler eller ekstern infrastruktur**

Etter `npm install` kan sensor starte en separat lokal demomodus:

```bash
npm run demo
```

Åpne deretter:

```text
http://127.0.0.1:3000
```

Demomodus bruker samme frontend som produktet, men erstatter Supabase og ekte KI-kall med deterministiske mock-svar og midlertidig minnehistorikk. Den krever ingen `.env`, ingen API-nøkkel, ingen betalt konto og ingen ekstern database. Den er laget for kjørbarhet og vurdering – **ikke** for å dokumentere kvaliteten på den ekte KI-en.

**3. Kontroller deterministiske tester lokalt**

```bash
npm test
```

`npm test` krever ikke OpenAI-/OpenRouter-nøkkel og gjør ingen eksterne KI-kall. Testpakken inkluderer også en regresjonstest som starter den lokale sensordemoen og kontrollerer kjerneendepunktene.

**4. Ekte KI-kall lokalt er valgfritt**

Bare dersom sensor ønsker å kjøre de faktiske live KI-testene lokalt, for eksempel `npm run test-ai:golden`, kreves egen gyldig API-konfigurasjon. De siste verifiserte golden-resultatene er dokumentert i repoet.

## Kjernefunksjoner

Samtalestøtte kan blant annet:

- hjelpe brukeren å strukturere en krevende samtale
- foreslå åpning, spørsmål og videre formuleringer
- forberede brukeren på mulige reaksjoner
- fortsette KI-dialog om samme situasjon
- simulere en samtale med en medarbeider
- støtte refleksjon etter øvelsen
- lagre historikk for innloggede brukere
- kontrollere tekst for identifiserende opplysninger før KI-kall

Løsningen er ikke et HR-system, journalsystem eller beslutningsverktøy.

## Veiledning – ikke faglig fasit

Samtalestøtte skal brukes som **støtte til forberedelse, refleksjon og trening**, ikke som en autoritativ fasit på hvordan en krevende samtale skal håndteres.

Gode medarbeidersamtaler berører flere fagområder. Formelle spørsmål kan kreve arbeidsrettslig, HR- eller HMS-kompetanse, mens selve samtaleføringen også bygger på kunnskap fra blant annet organisasjonspsykologi, aktiv lytting, feedback, veiledning, motiverende intervju og evidensbaserte intervjuprinsipper. Ingen enkelt faggruppe behandles som universell fasit.

Prosjektets golden/fasit-bank er utarbeidet av studenten/prosjekteieren med KI-støtte fra ChatGPT/OpenAI og bygger på prosjektets krav, kuraterte kilder og sikkerhetsregler. Den er **ikke uavhengig ekspertvalidert**. KI-svar kan derfor være ufullstendige, unøyaktige eller lite egnet i den konkrete situasjonen.

Brukeren må alltid gjøre en selvstendig vurdering og bruke relevant fagkompetanse, virksomhetens rutiner og gjeldende regelverk når saken krever det. Samtalestøtte skal ikke stille diagnoser, fastslå skyld eller motiv, gi bindende juridiske råd eller ta personalbeslutninger.

## Temaer

Prototypen har ni hovedtemaer:

1. Alkohol og rus
2. Fravær og oppfølging
3. Prestasjon og utvikling
4. Lønn og utvikling
5. Samarbeid og kommunikasjon
6. Oppsigelse og avslutning av arbeidsforhold
7. Sikkerhet og ansvar
8. Livssituasjoner
9. Mobbing og trakassering

## Kjør prosjektet lokalt

### Forutsetninger

Prosjektet er utviklet og testet med:

- Node.js 22–26 for lokal kjøring og testing (Node 24 LTS anbefales)
- npm 11.x (følger med støttet Node.js-versjon)
- Git

### Node-versjon for Render

`package.json` angir `>=22 <27` som kompatibilitetsområde for lokal kjøring og vurdering. Faglærer har verifisert at `npm ci` og `npm test` består på Node 23.11. Produksjon på Render skal fortsatt bruke den sikkerhetspatchede Node-versjonen `26.12.1` via miljøvariabelen `NODE_VERSION`, slik at lokal kompatibilitet og produksjonssikkerhet holdes adskilt.

### Klon repoet

```bash
git clone https://github.com/IBE160-2026/G46-nilsen.git
cd G46-nilsen
```

### Installer avhengigheter

```bash
npm install
```

### Opprett `.env`

Kopier `.env.example` til en ny fil som heter `.env`.

Eksempel:

```env
OPENAI_API_KEY=
OPENROUTER_API_KEY=
OPENAI_MODEL=gpt-5.6-luna

PORT=3000
NODE_ENV=development
APP_BASE_URL=http://localhost:3000

SUPABASE_URL=https://ditt-prosjekt.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...

ADMIN_EMAILS=din-admin-epost@example.com
APP_VERSION=20.10.10
```

Ekte API-nøkler og andre hemmeligheter skal ikke legges i GitHub.

### Start appen

```bash
npm start
```

Åpne:

```text
http://localhost:3000
```

For utvikling:

```bash
npm run dev
```

Appen skal kjøres via Node-serveren, ikke ved å åpne `index.html` direkte.

## Database

Grunnoppsett for Supabase ligger i:

`database/SUPABASE-SETUP.sql`

Migreringer ligger i:

`database/migrations/`

## Testing

### Lokale tester

Disse er deterministiske og gjør ikke eksterne KI-kall. De kan kjøres uten OpenAI- eller OpenRouter-nøkkel.

Kjør hele den lokale testpakken med én kommando:

```bash
npm test
```

`npm test` er alias for `npm run test-local` og kjører de sentrale deterministiske regresjonstestene sekvensielt. `tests/test-sensor-demo.cjs` kontrollerer at `scripts/sensor-demo.js` kan starte uten hemmeligheter og levere mock-svar for kjerneflyten.

Testene kan også kjøres enkeltvis:

```bash
npm run test-syntax
npm run test-privacy
npm run test-simulation
npm run test-server-privacy
npm run test-ui-regression
npm run test-history-hotfix
npm run test-bubble-cleanup
npm run test-clipboard
npm run test-golden-schema
npm run test-golden-utils
npm run test-benchmark-taxonomy
npm run test-sourcebank
npm run test-sensor-demo
npm run test-public-assets
npm run test-repo-structure
```

Ved siste dokumenterte kontroll besto blant annet:

- personverntester: 33/33
- simuleringstester: 24/24
- historikk-regresjonstest
- snakkeboble-regresjonstest
- golden matcher-regresjonstest
- syntakskontroll av hovedkode
- lokal sensor-demo-regresjon: bestått
- produksjonsserverens offentlige frontend-assets: bestått
- repo-struktur/kjørbarhet: bestått
- package-lock-konsistens: bestått

Personverntestsettet inkluderer regresjonscaser for tvetydige navn/vanlige ord som `Dag` og `dag`. **26.10.2026 ble hele `npm test`-pakken kjørt etter utvidelsen av golden-banken og besto uten feil.** Kjøringen inkluderte syntaks, 34 personverntester, 24/24 simulatorkontroller, server-personvern, UI-regresjon/UU, historikk, samtaleboble, clipboard, golden-schema, golden-matcher, sensor-demo, offentlige assets, repo-struktur, package-lock og Node-kompatibilitet. Golden/fasit-schema verifiserte **21 caser, 9/9 hovedtemaer, minst to caser per tema, ekstra risikodekning og dokumentert provenance**. Etterpå ble det gjort mindre endringer i flerfaglig runtime-tekst, brukertest-retensjon og tilhørende regresjonstester. Disse ble deretter kontrollert med ny lokal kjøring, og den siste gjenstående repo-strukturtesten ble korrigert for lærerens nye `CLAUDE.md`/`.claude`-verktøy og verifisert grønn. Dette beskriver den komplette lokale verifiseringen per 26.10.2026. Senere endringer i produksjonsflyt, personvern og taksonomi er dokumentert separat med målrettede regresjonskontroller; den historiske fullkjøringen skal ikke fremstilles som om den ble kjørt på dagens v20.10.10.

### Sporbarhet fra krav til test

Sentrale krav i `docs/bmad/PRD.md` har direkte testspor:

| Krav | Testbevis |
|---|---|
| FR-05 Samtalesimulering | `tests/test-simulation.js` |
| FR-06 Personverngateway – klient | `tests/test-privacy.js` |
| FR-06 Personverngateway – server | `tests/test-server-privacy.cjs` |
| FR-09 Historikk | `tests/test-history-hotfix.cjs` |
| UI-regresjon | `tests/test-ui-regression.cjs` |
| Simulator-UI/regresjon | `tests/test-bubble-cleanup.cjs` |
| Clipboard/kopieringsfunksjoner | `tests/test-clipboard.cjs` |
| FR-03 / FR-15 / AI-01–04 – Golden/fasitbasert KI-kvalitet | `tests/AI-GOLDEN-CASES.json`, `tests/test-ai-golden.js` |
| Fasitbankens struktur og 9/9 temadekning | `tests/test-golden-schema.cjs` |

Dette gjør det mulig å følge sentrale krav fra PRD til konkret testbevis uten eksterne KI-kall.

### Fasitbasert KI-testing

Prosjektet har en egen golden/fasit-bank i `tests/AI-GOLDEN-CASES.json`. Den inneholder nå **26 caser**, dekker alle ni hovedtemaer med minst to caser per tema og har ekstra dekning for de særlig risikoutsatte temaene mobbing/trakassering og oppsigelse/avslutning av arbeidsforhold. Banken beskriver:

- forventet hovedtema
- maskinelle kontrollpunkter
- hva svaret **må** inneholde
- hva svaret **bør** inneholde
- hvilke feil som regnes som kritiske
- hvilke PRD/KI-krav casen tester

Selve fasitstrukturen kan kontrolleres uten API-nøkkel:

```bash
npm run test-golden-schema
```

Ekte KI-svar kan deretter testes mot samme fasit med:

```bash
npm run test-ai:golden
```

Denne testen kombinerer automatisk kontroll med en eksplisitt manuell vurderingsfasit, fordi faglig kvalitet og nyanser ikke bør avgjøres av nøkkelord alene. Fasiten er utarbeidet av studenten/prosjekteieren med KI-støtte fra ChatGPT/OpenAI. Den er basert på prosjektets krav, kilder og sikkerhetsregler, men er **ikke uavhengig validert av relevante eksterne fagpersoner**. Hvilken kompetanse som er relevant varierer med saken og kan blant annet være organisasjonspsykologi/samtalemetodikk, HR/arbeidsliv, arbeidsrett eller HMS.

Ny live golden-kjøring 26.10.2026 mot **GPT-5.6 Luna** omfattet alle **21 casene**. Maskinelt resultat var **19 OK, 2 BØR SJEKKES, 0 kritiske avvik og 0 tekniske feil**. De to flaggede casene (`G-AVSL-03` og `G-SAMARB-02`) ble manuelt gjennomgått mot MÅ-/BØR-fasiten. Begge traff de faglige hovedkravene; flagget skyldtes at responsen ikke satte `Avklaring` til ja selv om rådet ellers inneholdt relevante kontrollpunkter og en forsvarlig videre prosess. Resultatet dokumenteres derfor som 19 maskinelt OK + 2 manuelt akseptert etter kontroll, ikke som 21/21 maskinelt OK.

### Nyeste produksjonsflyt-kontroll

28.10.2026 ble goldenbanken utvidet med fem faktiske pilotcaser til **26 caser** og kjørt gjennom samme analyse- og veiledningsflyt som vanlige brukere. Første fullkjøring registrerte 26/26 saker, men tre ble stoppet før KI-kall av personvernfilteret på grunn av falske navnetreff. Feilen ble sporet til deterministisk navnedeteksjon, rettet i underliggende regelverk og låst med egne regresjonstester. Ved ny fullkjøring kom **26/26 helt gjennom til KI-svar**. 25 åpninger besto den automatiske kvalitetskontrollen; én åpning var 67 ord mot en satt grense på 65, men ble manuelt vurdert som innholdsmessig god.

Dette er dokumentert som produksjonsflyt-regresjon, ikke som ekstern faglig validering. Kjøringen viser også modellens ikke-determinisme: samme pilotcase kan få ulik ordlyd mellom kjøringer, mens de ønskede kvalitetskravene fortsatt kan være stabile.

Benchmarkbanken er i versjon 20.10.9 synkronisert med de **48 gjeldende undertemaene** og inneholder 114 faste saker. `npm run test-benchmark-taxonomy` kontrollerer at alle benchmarkcaser peker på gyldige tema/undertema-par og at hvert undertema har minst to saker.

### KI- og live-tester

Disse krever gyldig API-konfigurasjon og gjør faktiske modellkall:

```bash
npm run test-ai
npm run test-ai:full
npm run test-ai:golden
npm run test-ai:stress
npm run test-ai:stress:full
npm run test-ai:stress:problems
npm run test-simulation:live
npm run test-model-compare
```

KI-testene kan bruke mer tid og medføre API-kostnader.

## Prosess og dokumentasjon

Planlegging og utvikling er dokumentert gjennom BMAD:

- `product-brief.md`
- `docs/bmad/PRD.md`
- `docs/bmad/ARCHITECTURE-BMAD.md`
- `docs/bmad/UX-DESIGN-BMAD.md`
- `docs/bmad/EPICS-AND-STORIES-BMAD.md`
- `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md`

KI-bruk og kvalitetssikring er dokumentert i:

- `docs/ai/AI-LOGG-SAMTALESTOTTE.md`
- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`
- `docs/ai/AI-TESTPLAN.md`
- `docs/VERSJONSHISTORIKK-v20.10.md` – kobler v20.10.4–v20.10.10 til commitspor og forklarer fler-commit versjonsløft

Sikkerhet og personvern:

- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md`

Brukertesting:

- `docs/BRUKERTEST-PLAN.md` – felles pilotopplegg, personvern, tolkning og metodiske begrensninger

Faggrunnlag:

- `docs/faggrunnlag/`
- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/faggrunnlag/FAGGRUNNLAG-SAMTALETEKNIKK-RELASJONSLEDELSE.md` – lokalt tverrgående grunnlag for relasjonsledelse, samtaleteknikk og framtidig offline/RAG

Utviklingshistorikken kan også følges i Git-historikken og `CHANGELOG.md`.

## Mappestruktur

```text
G46-nilsen/
├── assets/
├── data/
├── database/
├── docs/
│   ├── ai/
│   ├── bmad/
│   └── faggrunnlag/
├── scripts/
├── src/
│   ├── client-data.js
│   └── server/
│       ├── topic-contracts.js
│       └── ai-schemas.js
├── tests/
│   └── cases/
├── app.js
├── index.html
├── server.js
├── styles.css
├── package.json
├── product-brief.md
├── CHANGELOG.md
├── .env.example
└── README.md
```

Hovedkoden ligger i rotmappen, mens dokumentasjon, tester, bilder og databasefiler er skilt ut i egne mapper. Klientens tema-/ikondata ligger separat i `src/client-data.js`, slik at `app.js` i større grad inneholder faktisk bruker- og tilstandslogikk. Tilsvarende ligger serverens tema-/KI-kontrakter i `src/server/`, mens autentisering, database- og API-flyt fortsatt ligger samlet i `server.js`.

Repoet inneholder også lærer-/kursverktøy for Claude-basert sesjonslogging (`CLAUDE.md` og `.claude/`). Disse er lagt inn av faglærer og er derfor eksplisitt tillatt av repo-strukturtesten. Verktøyet kan senere opprette `.logs/` med sesjonslogger; dette regnes også som et forventet rotområde, ikke som løs prosjektstøy.

## Kjent teknisk gjeld

Prototypen fungerer og er dekket av regresjonstester, men hovedfilene er fortsatt store: `app.js` er omtrent 3 400 linjer og `server.js` omtrent 1 600 linjer. En kontrollert sluttmodularisering flyttet statiske klientdata og serverens tema-/KI-kontrakter til `src/`, men autentisering, databaseflyt, API-ruter og mye klienttilstand ligger fortsatt samlet i hovedfilene.

Et naturlig neste steg ved videre produksjonsmodning er å dele disse ansvarene i mindre moduler med tydeligere grenser. En større refaktorering er bevisst ikke gjort rett før innlevering, fordi den ville økt regresjonsrisikoen i en fungerende prototype uten å endre kjerneverdien i produktet. Denne begrensningen er også dokumentert i arkitekturen og refleksjonsrapporten.

## Kontakt

Prosjektet er utviklet av Cecilie C. Nilsen som del av IBE160 Programmering med KI ved Høgskolen i Molde.

Kontakt: **cecilie.c.nilsen@himolde.no**