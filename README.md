# Samtalestøtte

Samtalestøtte er en webbasert prototype for ledere som skal forberede og øve på krevende samtaler med medarbeidere. Prosjektet er utviklet som en del av en prosjektoppgave ved Høgskolen i Molde.

Ideen bygger på erfaring fra lederarbeid, der vanskelige samtaler ofte må håndteres i praksis uten at man nødvendigvis har fått særlig mye trening i selve gjennomføringen. Målet er derfor ikke å la KI ta beslutninger for lederen, men å gi støtte til forberedelse, formuleringer, refleksjon og øvelse.

> **Status:** Betaversjon – under utvikling og testing.

## Hva kan løsningen gjøre?

Brukeren kan beskrive en situasjon og få KI-basert støtte til å forberede samtalen. Løsningen kan blant annet:

- hjelpe med å strukturere situasjonen
- stille avklaringsspørsmål når det er nødvendig
- foreslå en mulig åpning på samtalen
- foreslå relevante spørsmål
- forberede lederen på mulige reaksjoner
- gi forslag til hvordan reaksjoner kan møtes
- markere forhold som kan kreve HR-, juridisk eller annen faglig vurdering
- fortsette dialogen med KI om samme situasjon
- simulere en samtale med en medarbeider
- gi rom for refleksjon etter en øvelse
- lagre historikk for innloggede brukere

Samtalestøtte er ikke et HR-system, journalsystem eller beslutningsverktøy. Rådene er veiledende og erstatter ikke lederens eget skjønn eller nødvendig faglig bistand.

## Temaer

Prototypen er bygget rundt åtte hovedtemaer:

1. Alkohol og rus
2. Fravær og oppfølging
3. Prestasjon og utvikling
4. Lønn og utvikling
5. Samarbeid og kommunikasjon
6. Avslutning av arbeidsforhold
7. Sikkerhet og ansvar
8. Livssituasjoner

Brukeren kan også beskrive situasjonen med egne ord dersom den ikke passer naturlig inn i et bestemt undertema.

## Samtalesimulering

I samtalesimuleringen kan brukeren øve på selve dialogen. KI-en spiller medarbeideren ut fra situasjonen og valgt reaksjonsstil.

Det finnes ulike måter å gjøre øvelsen mer eller mindre krevende på. Hensikten er å gi praktisk trening, ikke å lage en fasit på hvordan et menneske vil reagere.

Etter øvelsen kan brukeren reflektere over hva som fungerte, hva som kunne vært gjort annerledes og hva som bør være neste steg.

## Personvern

Personvern er en sentral del av prosjektet fordi brukeren kan komme til å beskrive sensitive forhold fra arbeidsplassen.

Tekst som skrives inn kontrolleres lokalt før den sendes til KI. Kontrollen ser blant annet etter tydelige identifikatorer som:

- navn
- e-postadresser
- telefonnummer
- fødselsopplysninger
- person- eller ansatt-ID
- adresser

Ved tydelige funn stoppes sendingen slik at brukeren kan endre teksten først. Prinsippet er:

**Anonymiser identitet, ikke nødvendig kontekst.**

Personvernkontrollen reduserer risiko, men kan ikke garantere at all identifiserende informasjon oppdages. Reelle navn eller andre unødvendige personopplysninger skal derfor ikke brukes under testing.

Løsningen bruker nødvendig lokal lagring og sesjonsinformasjon til blant annet innlogging, tema og brukerinnstillinger. Det er ikke lagt inn markedsførings- eller sporingscookies.

## KI og faglig sikkerhet

KI-en skal blant annet:

- skille mellom oppgitte fakta og antakelser
- unngå å dikte opp opplysninger som ikke finnes i saken
- ikke fastslå diagnose, motiv, skyld eller personlighet uten grunnlag
- være forsiktig i sensitive HR- og juridiske spørsmål
- vise når en situasjon bør vurderes videre av HR, jurist eller annen relevant fagperson

Prosjektet inneholder en fagbank og egne regler for hvordan KI-en skal svare. Se blant annet:

- `AI-SYSTEMPROMPT.md`
- `AI-RESPONSE-CONTRACT.md`
- `SOURCEBANK.md`
- `FAGGRUNNLAG-FRAVAER.md`

## Teknologi

Prosjektet bruker:

- HTML, CSS og JavaScript i klienten
- Node.js og Express på serversiden
- OpenAI API for KI-funksjonene
- Supabase for konto og historikk
- Git og GitHub for versjonskontroll

Prosjektet bruker eksisterende språkmodeller via API. Det trenes ikke en egen modell.

## Kjør prosjektet lokalt

### 1. Forutsetninger

Installer [Node.js](https://nodejs.org/) på maskinen.

### 2. Hent prosjektet

Hvis prosjektet ligger på GitHub:

```bash
git clone <adresse-til-repositoriet>
cd <prosjektmappe>
```

Har du allerede prosjektmappen lokalt, åpner du bare terminalen i den mappen.

### 3. Installer avhengigheter

```bash
npm install
```

### 4. Opprett `.env`

Kopier `.env.example` til en ny fil som heter `.env`.

Eksempel:

```env
OPENAI_API_KEY=din_openai_nokkel
OPENAI_MODEL=gpt-5.6-luna
PORT=3000
APP_BASE_URL=http://localhost:3000

SUPABASE_URL=https://ditt-prosjekt.supabase.co
SUPABASE_PUBLISHABLE_KEY=din_publishable_key
SUPABASE_SECRET_KEY=din_secret_key

APP_VERSION=19.9.0
```

`.env` skal ikke legges i GitHub. Den er derfor tatt med i `.gitignore`.

### 5. Start appen

```bash
npm start
```

Åpne deretter:

```text
http://localhost:3000
```

For utvikling med automatisk omstart av serveren:

```bash
npm run dev
```

Appen bør kjøres via Node-serveren og ikke ved å åpne `index.html` direkte.

## Testing

Prosjektet har flere automatiserte tester.

### Personvern

```bash
npm run test-privacy
```

### KI-tester

Kort test:

```bash
npm run test-ai
```

Full test:

```bash
npm run test-ai:full
```

Stresstest:

```bash
npm run test-ai:stress
```

Full stresstest:

```bash
npm run test-ai:stress:full
```

Bare tidligere problemcaser:

```bash
npm run test-ai:stress:problems
```

### Samtalesimulering

```bash
npm run test-simulation
npm run test-simulation:v19.2
npm run test-simulation:v19.3
npm run test-simulation:v19.4
```

Live-tester gjør faktiske KI-kall og krever at serveren og API-oppsettet fungerer:

```bash
npm run test-simulation:live
npm run test-simulation:v19.2:live
```

Automatiske tester brukes som støtte. KI-svar må fortsatt vurderes manuelt for språk, realisme, relevans og faglig kvalitet.

## Viktige filer

| Fil | Innhold |
|---|---|
| `product-brief.md` | Kort beskrivelse av behov, mål, plan og avgrensning |
| `README.md` | Denne filen |
| `CHANGELOG.md` | Utviklingshistorikk og endringer mellom versjoner |
| `AI-SYSTEMPROMPT.md` | Regler og føringer for KI-en |
| `AI-RESPONSE-CONTRACT.md` | Forventet struktur på KI-svar |
| `AI-TESTPLAN.md` | Plan og kriterier for KI-testing |
| `SOURCEBANK.md` / `SOURCEBANK.json` | Kurert fag- og kildebank |
| `FAGGRUNNLAG-FRAVAER.md` | Faglig grunnlag for temaet fravær |
| `server.js` | Server, API-ruter og KI-integrasjon |
| `app.js` | Hovedlogikk i brukergrensesnittet |
| `styles.css` | Visuell utforming |
| `SUPABASE-SETUP.sql` | Oppsett for Supabase |

## Tema og brukergrensesnitt

Appen har lys, mørk, systemstyrt og hybrid visning. Hybrid er standard for nye brukere og kombinerer mørk sidemeny med lyst hovedinnhold.

Valgt tema lagres lokalt i nettleseren.

## Kontakt

Prosjektet er utviklet av Cecilie C. Nilsen som del av en prosjektoppgave ved Høgskolen i Molde.

Kontakt: **cecilie.c.nilsen@himolde.no**

## Videre arbeid

Før eventuell ordinær publisering skal løsningen blant annet gjennom mer brukertesting. Det skal også vurderes hvilken KI-modell som gir best balanse mellom kvalitet, sikkerhet, responstid og kostnad.

Dette er fortsatt en prototype, og funksjoner og utforming kan derfor endres etter testing.
