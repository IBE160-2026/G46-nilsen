# Dokumentasjonsguide – Samtalestøtte

> **Start her dersom du er sensor, utvikler eller vil kontrollere prosjektets påstander.** Denne siden er en navigasjonsguide, ikke et nytt statusdokument. Den gjeldende tekniske statusen står i [PROSJEKTSTATUS](PROSJEKTSTATUS.md). Daterte revisjoner er historiske bevis, ikke nødvendigvis nåsituasjonen.

## 1. Sensor: vurder prosjektet i anbefalt rekkefølge

| Behov | Dokument / handling | Hva du finner |
| --- | --- | --- |
| Forstå produktet og kjøre uten nøkler | [README](../README.md#kjør-sensordemo-uten-nøkler) | Kort oppskrift for deterministisk sensordemo med fiktive svar |
| Se gjeldende status | [Prosjektstatus](PROSJEKTSTATUS.md) | Kode, gren, CI, publisering og avgrensninger |
| Problem og produktidé | [Product brief](../product-brief.md) | Målgruppe, verdi og prioriteringer |
| Krav og akseptansekriterier | [PRD](bmad/PRD.md) | Funksjonelle og ikke-funksjonelle krav |
| Se teknisk oppbygning | [Arkitektur](bmad/ARCHITECTURE-BMAD.md) | Moduler, dataflyt, komponenter og valg |
| Se plan og utviklingsprosess | [Epics og stories](bmad/EPICS-AND-STORIES-BMAD.md) og [implementeringsplan](bmad/IMPLEMENTATION-PLAN-BMAD.md) | Krav til oppgaver og gjennomføring |
| Kontrollere KI-bruk | [KI-logg](ai/AI-LOGG-SAMTALESTOTTE.md) | KI-bidrag, feil, læring og menneskelig kontroll |
| Kontrollere testmetode og testbevis | [KI-testplan](ai/AI-TESTPLAN.md), [testbevis](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md) | Testtyper, resultatgrunnlag og begrensninger |
| Vurdere kilder | [Kildebank](SOURCEBANK.md), [kildedekning](KILDEDEKNING-OG-SPORBARHET-2026-11-20.md) | Kildehierarki og sporbarhet, ikke ekstern juridisk godkjenning |
| Lese studentens refleksjon | [Solo-refleksjonsrapport](REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md) | Hovedutkast etter skolens mal |
| Kontrollere innleveringen | [Dokumentasjonssjekkliste](DOKUMENTASJON-SJEKKLISTE.md) | Utestående formaliteter og endelig SHA-kontroll |

For å skille hoveddokumenter fra tidligere utkast og daterte revisjoner, se [dokumentkartet](DOKUMENTKART.md).

## 2. Hvor ligger hva?

- **Kjørbar app:** `index.html`, `app.js`, `server.js`, `src/client/` og `src/server/`.
- **Stiler:** `styles.css` med tilhørende modulære `styles-core*.css`-filer, `styles-responsive.css` og `styles-overrides.css`. Flere inngangsfiler er tilsiktet; ikke slå dem sammen bare for færre filer.
- **Kildegrunnlag og testdata:** `data/`. Innholdet må ikke tolkes som uavhengig kvalitetssikret.
- **Databaseskjema og forslag:** `database/`. Skille mellom faktisk benyttede migrasjoner og forslag.
- **Automatiserte tester:** `tests/`, med kommandoer i `package.json`.
- **Drift og verktøy:** `scripts/`, `.github/workflows/`, `manifest.webmanifest`, `sw.js`.
- **Produkt- og prosessdokumentasjon:** `docs/bmad/`, `docs/ai/`, `docs/faggrunnlag/` og øvrige `docs/`-dokumenter.
- **Historiske notater:** `docs/archive/`, daterte revisjoner og `CHANGELOG.md`. Disse kan ha statuser som ikke lenger gjelder.
- **Eksperimenter:** `pilot-ux-v20.11` er en separat gren; tale/live skal ikke presenteres som ferdig produksjonsfunksjon.

## 3. Kildehierarki – hvilken versjon er fasit?

1. Sjekk **faktisk GitHub-commit og CI** for koden som vurderes.
2. Sjekk [PROSJEKTSTATUS](PROSJEKTSTATUS.md), og merk kontrolltidspunktet.
3. Les [README](../README.md) og hoveddokumentene for funksjon og bruk.
4. Bruk daterte rapporter som **historiske bevis** – aldri som automatisk bekreftelse på nyeste produksjonsversjon.

En grønn CI bekrefter bare kontrollene som faktisk er kjørt. En lokal sensor-demo med fiktive svar er ikke en live modelltest. GitHub-commit og Render-deploy må kontrolleres hver for seg.

## 4. Endelig kvalitetskontroll før levering

1. Bekreft hvilken `main`-commit som faktisk leveres.
2. Kjør `npm ci`, `npm test` og `npm run audit:submission` fra samme commit; kontroller også tilhørende GitHub Actions-run.
3. Prøv `npm run demo` som sensor uten nøkler.
4. Kontroller at rapportens personlige refleksjoner og formelle Canvas-krav er godkjent av studenten.
5. Oppdater bare *gjeldende* statusfiler med ny SHA, resultat og eventuelle forbehold – ikke skriv om eldre revisjoner.
