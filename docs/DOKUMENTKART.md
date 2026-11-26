# Dokumentkart – hva er gjeldende, og hva er historikk?

Dette er et orienteringskart for Samtalestøttes dokumentasjon, ikke en alternativ prosjektstatus. [README](../README.md) er sensorens korte oppstartsguide. [PROSJEKTSTATUS](PROSJEKTSTATUS.md) angir sist dokumentert status, og [innleveringssjekklisten](DOKUMENTASJON-SJEKKLISTE.md) viser formelle sluttpunkter.

## Hoveddokumenter – bruk disse først

| Formål | Dokument |
| --- | --- |
| Produktidé | [Product brief](../product-brief.md) |
| Krav og akseptansekriterier | [PRD](bmad/PRD.md) |
| Arkitektur | [Arkitektur](bmad/ARCHITECTURE-BMAD.md) |
| Prosess og prioriteringer | [Epics og stories](bmad/EPICS-AND-STORIES-BMAD.md), [implementeringsplan](bmad/IMPLEMENTATION-PLAN-BMAD.md) |
| KI-bruk | [KI-logg](ai/AI-LOGG-SAMTALESTOTTE.md) |
| Testmetode og evidens | [KI-testplan](ai/AI-TESTPLAN.md), [testbevis](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md) |
| Faggrunnlag | [Kildebank](SOURCEBANK.md), [kildedekning](KILDEDEKNING-OG-SPORBARHET-2026-11-20.md) |
| Studentens refleksjon | [Hovedutkast etter skolens mal](REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md) |

## Dokumenter med ulike roller – ikke likestill dem

**Gjeldende inngang:** `README.md`, `docs/OVERSIKT.md`, `docs/PROSJEKTSTATUS.md` og `docs/DOKUMENTASJON-SJEKKLISTE.md`. Disse skal være korte og peke videre.

**Fag- og kravgrunnlag:** `docs/bmad/`, `docs/ai/` (testplan, kontrakter og KI-logg), `docs/faggrunnlag/` og `docs/SOURCEBANK.md`. De beholder detaljer som trengs for vurdering og reproduksjon.

**Historiske revisjoner, testprotokoller og milepæler:** Daterte dokumenter som `docs/REVISJON-IBE160-2026-11-18.md`, `docs/INNLEVERINGSKONTROLL-2026-11-20.md`, `docs/CSS-REVISJON-2026-11-18.md`, `docs/BRUKERTEST-*.md` og de daterte `docs/ai/`-rapportene. Disse kan beskrive tidligere feil, åpne PR-er og mellomliggende resultater. Les dem med deres opprinnelige dato.

**Tidligere refleksjonsutkast:** `docs/REFLEKSJONSRAPPORT-UTKAST.md`, `docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md`, `docs/REFLECTION-NOTES-v20.md` og `docs/REFLEKSJONSADDENDUM-2026-11-02.md` er prosessdokumentasjon, **ikke** konkurrerende innleveringsrapporter.

**Arkiv:** `docs/archive/` inneholder bevarte eldre versjoner av README, sjekkliste og prosjektstatus. [Dokumentasjonsrevisjonen 25.11](DOKUMENTASJONSREVISJON-2026-11-25.md) er et mer detaljert fil-for-fil-register for daværende status.

## Hvorfor dokumentene ikke er flyttet eller slettet i denne runden

En kontroll av GitHub-treet 27.11 fant 91 Markdown-filer under `docs/` og **ingen par med helt identisk Git-blob-SHA**. Dette utelukker ikke tematisk overlapp. Mange eldre dokumenter er direkte referert fra andre rapporter, testskript eller beslutningslogger. Flytting uten en fullstendig analyse av slike referanser kan svekke sporbarheten, selv om roten ser renere ut.

Derfor beholdes de eksisterende dokumentstiene foreløpig, mens denne oversikten gjør skillet mellom hoveddokumenter og historiske bevis eksplisitt. Senere fysisk arkivering må omfatte lenkeoppdatering, kontroll av kode-/testreferanser og grønn Quality Gate. **Ingenting skal slettes bare fordi det er gammelt.**
