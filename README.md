
## Rask tilgang for vurdering

Samtalestøtte er publisert som testversjon på `https://samtalestotte.onrender.com`. Lærere/sensorer kan teste uten lokal installasjon når prosjekteier oppretter en egen engangsinvitasjon. Invitasjoner kan gis som vanlig bruker, redaktør eller admin og kan settes til å utløpe 31.12.2026. Admin-tilgang gir tilgang til blant annet innholdsredigering, modellvalg, kostnadsoversikt, benchmark, kildebruk og brukertestresultater.

### Admin-tilgang for vurdering

Følgende engangsinvitasjoner gir admin-tilgang til den publiserte testversjonen:

- **Admininvitasjon 1:** https://samtalestotte.onrender.com/?invite=1IRDln2gMyjMWMS3grkrKvbK
- **Admininvitasjon 2:** https://samtalestotte.onrender.com/?invite=L5Y9R3CVl4z8Lc4xrjQehC8W

Hver lenke kan bare brukes én gang. Siden dette er aktive admininvitasjoner, bør de erstattes dersom de blir brukt eller dersom tilgangen ikke lenger skal være tilgjengelig.

## Testmiljø og oppstartstid

Testversjonen kjører på Render sin gratis hostingløsning. Hvis tjenesten ikke har vært brukt på en stund, kan serveren gå i dvale. Første innlasting kan derfor ta litt ekstra tid mens tjenesten starter opp igjen. Vent litt dersom siden ikke åpner umiddelbart. Dette er en begrensning i testmiljøet.

# Samtalestøtte

Samtalestøtte er en webbasert prototype for ledere som skal forberede og øve på krevende samtaler med medarbeidere. Prosjektet er utviklet som en del av en prosjektoppgave ved Høgskolen i Molde.

Ideen bygger på erfaring fra lederarbeid, der vanskelige samtaler ofte må håndteres i praksis uten at man nødvendigvis har fått særlig mye trening i selve gjennomføringen. Målet er derfor ikke å la KI ta beslutninger for lederen, men å gi støtte til forberedelse, formuleringer, refleksjon og øvelse.

> **Status:** Betaversjon – under utvikling og testing.

## Testtilgang

Samtalestøtte er satt opp som en **lukket betaversjon**. For vurdering er to engangslenker med admin-tilgang lagt inn øverst i README. Andre testbrukere kan få egne engangsinvitasjoner opprettet fra Admin eller med:

```bash
npm run invite
```

Hver invitasjon kan bare brukes én gang.

### Forslag til testing

For å få et inntrykk av de viktigste delene av løsningen anbefales det å:

1. Opprette konto med en privat engangsinvitasjon og logge inn.
2. Starte **Ny samtale**, velge et tema og beskrive en tenkt situasjon. Ikke bruk virkelige navn eller andre identifiserende personopplysninger.
3. Følge KI-veiledningen og prøve videre dialog i samme samtale.
4. Åpne **Samtalesimulering** og gjennomføre en kort øvelse.
5. Se på **Historikk** og kontroller at en lagret samtale kan åpnes igjen.
6. Test personvernkontrollen med fiktive identifikatorer. Løsningen skal reagere før teksten sendes til KI.

> Render bruker en gratis testtjeneste. Dersom appen ikke har vært brukt på en stund, kan første åpning ta litt ekstra tid mens tjenesten starter.

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

Prototypen er bygget rundt ni hovedtemaer:

1. Alkohol og rus
2. Fravær og oppfølging
3. Prestasjon og utvikling
4. Lønn og utvikling
5. Samarbeid og kommunikasjon
6. Avslutning av arbeidsforhold
7. Sikkerhet og ansvar
8. Livssituasjoner
9. Mobbing og trakassering

Brukeren kan også beskrive situasjonen med egne ord dersom den ikke passer naturlig inn i et bestemt undertema.


## Admin og redigerbart innhold

Fra v20.0 støtter Samtalestøtte tre roller: bruker, redaktør og admin. Redaktør kan endre utvalgte grensesnitttekster fra adminvisningen, mens admin i tillegg kan tildele og fjerne roller. Rettighetene håndheves på serveren. Redigerte tekster lagres i Supabase-tabellen `content_overrides`. Kjør `database/migrations/V20-SUPABASE-MIGRATION.sql` én gang før funksjonen tas i bruk.

## Samtalesimulering

I samtalesimuleringen kan brukeren øve på selve dialogen. KI-en spiller medarbeideren ut fra situasjonen og valgt reaksjonsstil.

Det finnes ulike måter å gjøre øvelsen mer eller mindre krevende på. Hensikten er å gi praktisk trening, ikke å lage en fasit på hvordan et menneske vil reagere.

Etter øvelsen kan brukeren reflektere over hva som fungerte, hva som kunne vært gjort annerledes og hva som bør være neste steg.

## Personvern

Personvern er en sentral del av prosjektet fordi brukeren kan komme til å beskrive sensitive forhold fra arbeidsplassen.

Tekst som skrives inn kontrolleres både i nettleseren og på serveren før den sendes til KI. Kontrollen ser blant annet etter tydelige identifikatorer som:

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

## Sikkerhet i v20.4

v20.4 inneholder blant annet server-side personverngateway, rate limiting, same-origin-kontroll, sikkerhetsheadere, begrenset offentlig filtilgang, anonymisert KI-/kildelogging, automatisk retensjon og kontoeksport. Se `SIKKERHET-OG-PERSONVERN-v20.4.md` og kjør `database/migrations/V20-4-SUPABASE-MIGRATION.sql` før versjonen tas i bruk.

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
- `FAGGRUNNLAG-MOBBING-TRAKASSERING.md`

## Teknologi

Prosjektet bruker:

- HTML, CSS og JavaScript i klienten
- Node.js og Express på serversiden
- OpenAI API og OpenRouter som alternative KI-providere
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

APP_VERSION=20.10.3
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

### BMAD-dokumentasjon

| Fil | Innhold |
|---|---|
| `product-brief.md` | Behov, mål, kompleksitet, avgrensning og videre retning |
| `PRD.md` | Produktkrav og funksjonelle/ikke-funksjonelle krav |
| `UX-DESIGN-BMAD.md` | UX-prinsipper, arbeidsflyt og brukergrensesnitt |
| `ARCHITECTURE-BMAD.md` | Teknisk arkitektur, sikkerhet, KI-lag og drift |
| `EPICS-AND-STORIES-BMAD.md` | Epics og user stories |
| `IMPLEMENTATION-PLAN-BMAD.md` | Iterativ plan for bygging, testing og videre forbedring |

### KI, testing og faggrunnlag

| Fil | Innhold |
|---|---|
| `AI-SYSTEMPROMPT.md` | Regler og føringer for KI-en |
| `AI-RESPONSE-CONTRACT.md` | Forventet struktur på KI-svar |
| `AI-TESTPLAN.md` | Plan og kriterier for KI-testing |
| `SOURCEBANK.md` / `SOURCEBANK.json` | Kurert fag- og kildebank på tvers av temaene |
| `FAGGRUNNLAG-ALKOHOL-RUS.md` | Alkohol og rus |
| `FAGGRUNNLAG-FRAVAER.md` | Fravær, arbeidsevne og tilrettelegging |
| `FAGGRUNNLAG-PRESTASJON-UTVIKLING.md` | Prestasjon og utvikling |
| `FAGGRUNNLAG-LONN-UTVIKLING.md` | Lønn og utvikling |
| `FAGGRUNNLAG-SAMARBEID-KOMMUNIKASJON.md` | Samarbeid og kommunikasjon |
| `FAGGRUNNLAG-AVSLUTNING-ARBEIDSFORHOLD.md` | Avslutning av arbeidsforhold |
| `FAGGRUNNLAG-SIKKERHET-ANSVAR.md` | Sikkerhet, vold og trusler |
| `FAGGRUNNLAG-LIVSSITUASJONER.md` | Livssituasjoner og arbeidsrelatert tilrettelegging |
| `FAGGRUNNLAG-MOBBING-TRAKASSERING.md` | Mobbing, trakassering og varsling |

`SOURCEBANK.md` og `SOURCEBANK.json` er den felles kuraterte kildebanken som binder faggrunnlaget på tvers av alle hovedtemaene.

### Kode og drift

| Fil | Innhold |
|---|---|
| `server.js` | Server, API-ruter, personverngateway og KI-integrasjon |
| `app.js` | Hovedlogikk i brukergrensesnittet |
| `index.html` | Struktur og hovedvisninger |
| `styles.css` | Visuell utforming og temaer |
| `database/SUPABASE-SETUP.sql` | Grunnoppsett for Supabase |
| `CHANGELOG.md` | Utviklingshistorikk |

## Tema og brukergrensesnitt

Appen har lys, mørk, systemstyrt og hybrid visning. Hybrid er standard for nye brukere og kombinerer mørk sidemeny med lyst hovedinnhold.

Valgt tema lagres lokalt i nettleseren.

## Kontakt

Prosjektet er utviklet av Cecilie C. Nilsen som del av en prosjektoppgave ved Høgskolen i Molde.

Kontakt: **cecilie.c.nilsen@himolde.no**

## Videre arbeid

Før eventuell ordinær publisering skal løsningen blant annet gjennom mer brukertesting. Det skal også vurderes hvilken KI-modell som gir best balanse mellom kvalitet, sikkerhet, responstid og kostnad.

Dette er fortsatt en prototype, og funksjoner og utforming kan derfor endres etter testing.


