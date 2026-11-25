# Samtalestøtte

KI-basert webapplikasjon for å hjelpe ledere med å forberede, øve på og følge opp krevende medarbeidersamtaler. Utviklet i IBE160 Programmering med KI ved Høgskolen i Molde.

## Kjør sensordemo uten nøkler

**Krav:** Git, Node.js 22–26 og npm. Ingen konto, database eller API-nøkkel er nødvendig. Demoen bruker fiktive KI-svar.

```bash
git clone https://github.com/IBE160-2026/G46-nilsen.git
cd G46-nilsen
git switch main
npm ci
npm run demo
```

Åpne **http://localhost:3000**. Prøv denne brukerreisen: velg tema → beskriv situasjonen → få råd → still oppfølgingsspørsmål → prøv samtaleøvelse → åpne historikk → skriv ut. Stopp serveren med `Ctrl+C`.

## Kjør tester

```bash
npm test
npm run audit:submission
```

`audit:submission` kontrollerer teknisk sporbarhet, **ikke** Canvas-godkjenning eller faglig kvalitet på ekte KI-svar. Sensordemoen tester brukergrensesnittet med fiktive svar, ikke en live KI-modell.

## Kjør med eksterne tjenester (valgfritt)

Kopier `.env.example` til `.env`, fyll inn egen gyldig tjenestekonfigurasjon og kjør `npm start`. Denne varianten kan kreve tilgang til eksterne tjenester. Ikke legg nøkler i Git.

## Dokumentasjon

- [Dokumentasjonsguide for sensor](docs/OVERSIKT.md) – hvor du finner krav, arkitektur, prosess og faggrunnlag.
- [Produktkrav (PRD)](docs/bmad/PRD.md) · [Arkitektur](docs/bmad/ARCHITECTURE-BMAD.md)
- [KI-logg](docs/ai/AI-LOGG-SAMTALESTOTTE.md) · [Testplan](docs/ai/AI-TESTPLAN.md) · [Testbevis](docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md)
- [Refleksjonsrapport](docs/REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md) · [Dokumentasjonssjekkliste](docs/DOKUMENTASJON-SJEKKLISTE.md)
- [Lokal Supabase-test](docs/ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md) · [Mobil- og utskriftstest](docs/ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md)
- [Gjeldende prosjektstatus](docs/PROSJEKTSTATUS.md) – versjon, tester, deploy og avgrensninger.

**Avgrensning:** Dette er en studentprototype, ikke et HR-, journal- eller beslutningssystem. KI-råd må vurderes kritisk av brukeren.
