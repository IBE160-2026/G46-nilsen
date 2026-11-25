# Struktur- og sensorlesbarhetsrevisjon – 25.11.2026

## Omfang

Denne gjennomgangen tar utgangspunkt i `main` ved commit `96b0fe7d0cefeb796406269517ebe1a028600b3e`. Repositoriets rot, filtre, README, `package.json`, `.gitignore`, prosjektstatus og tidligere dokumentasjonsrevisjon ble kontrollert direkte via GitHub. Endringene er begrenset til navigasjon og dokumentasjon. Ingen funksjonskode, database, CSS, testfasiter eller pilotgren endres i denne PR-en.

## Verifiserte observasjoner

- Repoets rot har separate appfiler, modulære CSS-filer, `src/`, `tests/`, `docs/`, `database/`, `data/`, `scripts/` og én GitHub Actions-workflow.
- README inneholder reell oppskrift for lokal sensordemo, men må skannes gjennom mange seksjoner for å finne riktig dokument.
- Dokumentasjonsrevisjonen fra samme dato registrerte 91 Markdown-filer **ved revisjonsstart**. Dette er et historisk opptellingstidspunkt; det er ikke en påstand om nåværende totaltall.
- `.gitignore` dekker blant annet `.env`, avhengigheter, logger og testartefakter. At ignoreringsregler finnes beviser ikke at tidligere commits aldri inneholdt hemmeligheter.
- Ved kontrollen var siste `main`-workflow-kjøring `45708618742` med `completed/success` på `96b0fe7d`; senere commits må vurderes separat.

## Tiltak i denne revisjonen

1. Én kort [dokumentasjonsguide](OVERSIKT.md) som ordner dokumenter etter sensorens spørsmål, fremfor filnavn eller opprettelsesdato.
2. Tydeligere startpunkt øverst i [README](../README.md), med direkte snarveier til kjøring, krav, arkitektur, KI-logg, tester og refleksjon.
3. Eksisterende daterte filer forblir urørt. Flytting eller sletting uten full avhengighetskontroll kan bryte interne lenker, beviskjeder og tester.

## Bevisgrense

Dette er en **struktur- og navigasjonsrevisjon**, ikke en fullstendig sikkerhetsrevisjon, ny kodereview, faglig akseptanse av rettskilder, universell utforming-test eller attestasjon av alle dokumentlenker. Ingen karaktergaranti gis. Videre kodeendringer bør ha egen konkret feilbeskrivelse og test før merge.

## Akseptansekriterier

- Lenker fra README til dokumentasjonsguiden og fra guiden til sentrale dokumenter peker til eksisterende paths på kontrollert grunnlag.
- Endringen påvirker ikke appens kjørbare filer.
- PR-en skal få grønn Quality Gate før merge, og `main` skal ikke forveksles med Render-publisert versjon.
