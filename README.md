# Samtalestøtte

Samtalestøtte er en webbasert prototype for ledere som skal forberede og øve på krevende samtaler med medarbeidere. Løsningen er utviklet som del av IBE160 Programmering med KI ved Høgskolen i Molde.

Målet er ikke at KI skal ta beslutninger for lederen, men å støtte forberedelse, formuleringer, refleksjon og praktisk øvelse.

## Rask tilgang for vurdering

### Anbefalt sensorløp

**1. Test full funksjonalitet i nettleseren**

Publisert testversjon:

`https://samtalestotte.onrender.com`

Den publiserte testversjonen anbefales ved vurdering av selve produktet. Den er allerede konfigurert med prosjektets KI-modell, Supabase og servermiljø, og krever derfor ikke lokal installasjon eller sensorens egen API-nøkkel.

Tilgang til den lukkede testversjonen gis separat sammen med innleveringen.

Render kan gå i dvale ved inaktivitet, så første oppstart kan ta litt ekstra tid.

**2. Kontroller kode og deterministiske tester lokalt**

Sensor kan klone repoet, installere avhengigheter og kjøre:

```bash
npm install
npm test
```

`npm test` krever ikke OpenAI-/OpenRouter-nøkkel og gjør ingen eksterne KI-kall. Det er derfor ikke nødvendig å opprette en fungerende `.env` bare for å kontrollere den lokale regresjonspakken.

**3. Ekte KI-kall lokalt er valgfritt**

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

## Temaer

Prototypen har ni hovedtemaer:

1. Alkohol og rus
2. Fravær og oppfølging
3. Prestasjon og utvikling
4. Lønn og utvikling
5. Samarbeid og kommunikasjon
6. Avslutning av arbeidsforhold
7. Sikkerhet og ansvar
8. Livssituasjoner
9. Mobbing og trakassering

## Kjør prosjektet lokalt

### Forutsetninger

Prosjektet er utviklet og testet med:

- Node.js 26.7.0
- npm 11.19.0
- Git

### Klon repoet

```bash
git clone https://github.com/IBE160-2026/Samtalestotte.git
cd Samtalestotte
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
APP_VERSION=20.10.3
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

`npm test` er alias for `npm run test-local` og kjører de sentrale deterministiske regresjonstestene sekvensielt.

Testene kan også kjøres enkeltvis:

```bash
npm run test-privacy
npm run test-simulation
npm run test-server-privacy
npm run test-ui-regression
npm run test-history-hotfix
npm run test-bubble-cleanup
npm run test-clipboard
npm run test-golden-schema
npm run test-golden-utils
```

Ved siste dokumenterte kontroll besto blant annet:

- personverntester: 33/33
- simuleringstester: 24/24
- historikk-regresjonstest
- snakkeboble-regresjonstest
- golden matcher-regresjonstest

Personverntestsettet inkluderer regresjonscaser for tvetydige navn/vanlige ord som `Dag` og `dag`. Hele den lokale testpakken ble verifisert etter utvidelsen. Golden/fasit-schema ble samtidig verifisert med **9/9 hovedtemaer dekket**.

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

Prosjektet har en egen golden/fasit-bank i `tests/AI-GOLDEN-CASES.json`. Den inneholder minst én representativ case per hovedtema og beskriver:

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

Denne testen kombinerer automatisk kontroll med en eksplisitt menneskelig vurderingsfasit, fordi faglig kvalitet og nyanser ikke bør avgjøres av nøkkelord alene.

Siste verifiserte automatiske golden-kjøring mot GPT-5.6 Luna: **9/9 OK**, 0 bør sjekkes, 0 kritiske avvik og 0 tekniske feil. Kjøringen er gjort etter kalibrering av temadekning, kildepresisjon og kritiske helords-/frasetriggere.

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

Sikkerhet og personvern:

- `docs/SIKKERHET-OG-PERSONVERN-v20.4.md`

Faggrunnlag:

- `docs/faggrunnlag/`
- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`

Utviklingshistorikken kan også følges i Git-historikken og `CHANGELOG.md`.

## Mappestruktur

```text
Samtalestotte/
├── assets/
├── data/
├── database/
├── docs/
│   ├── ai/
│   ├── bmad/
│   └── faggrunnlag/
├── scripts/
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

Hovedkoden ligger i rotmappen, mens dokumentasjon, tester, bilder og databasefiler er skilt ut i egne mapper.

## Kontakt

Prosjektet er utviklet av Cecilie C. Nilsen som del av IBE160 Programmering med KI ved Høgskolen i Molde.

Kontakt: **cecilie.c.nilsen@himolde.no**