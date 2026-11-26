# Samtalestøtte – prosjektstatus

**Statusoppdatering 27.11.2026.** Denne siden viser kontrollgrunnlag og uavklarte punkter, ikke en løpende liste over tidligere commits. Se [README](../README.md) for oppstart og [dokumentasjonsguiden](OVERSIKT.md) for øvrige dokumenter.

## Kode og test

- **GitHub:** [IBE160-2026/G46-nilsen](https://github.com/IBE160-2026/G46-nilsen), innleveringsgren `main`.
- **Sist verifiserte PR før denne statusoppdateringen:** [PR #25](https://github.com/IBE160-2026/G46-nilsen/pull/25) ble kontrollert med [Quality Gate #45723304687](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45723304687) = `completed/success`, og flettet til `main` i commit `dcde8a5619d25d53c92ff702503f2a42fc784f83`. **Dette er ikke en bekreftelse på at CI for etterfølgende commits er grønn.**
- **Kjørbarhet for sensor:** `npm ci`, `npm run demo`, `npm test` og `npm run audit:submission` er dokumentert i [README](../README.md). Sensordemoen har fiktive svar og krever ikke tilgangsnøkler.
- **Omfang:** Studentprototype med KI-støtte til forberedelse, samtaleøvelse og oppfølging. Testresultater og avgrensninger er beskrevet i [testbevis](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md). Bestått CI er ikke en uavhengig faglig validering av live KI-råd.

## Publisering og pilot

- **Siste særskilt dokumenterte Render-deploy i tidligere prosjektstatus:** `61d282dc`, bekreftet live 25.11.2026. **Ingen nyere produksjonsdeploy er verifisert i denne statusoppdateringen.** Se [tidligere detaljer](archive/PROSJEKTSTATUS-UTVIDET-2026-11-25.md).
- **LIVE/tale:** Eksperimentell funksjonalitet, separat fra innlevert produksjonsapp. Ikke presenter pilot som ferdig produksjonsfunksjon.
- GitHub-`main` og den faktisk publiserte Render-versjonen må kontrolleres separat før eventuelle produksjonspåstander.

## Gjenstående sluttkontroll

- [ ] Bekreft formelle Canvas-krav og leveringsformat.
- [ ] Studenten leser og godkjenner egen [refleksjonsrapport](REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md).
- [ ] Velg endelig `main`-SHA; kjør `npm ci`, `npm test`, `npm run audit:submission` og bekreft grønn Quality Gate **på den valgte versjonen**.
- [ ] Prøv sensordemoen fra ren installasjon. Kontroller eventuell Render-deploy separat.

Se [aktiv innleveringssjekkliste](DOKUMENTASJON-SJEKKLISTE.md) for detaljer.

## Dokumentasjon og historikk

- [PRD](bmad/PRD.md) · [Arkitektur](bmad/ARCHITECTURE-BMAD.md) · [KI-logg](ai/AI-LOGG-SAMTALESTOTTE.md) · [Testplan](ai/AI-TESTPLAN.md).
- [Dokumentasjonsrevisjon](DOKUMENTASJONSREVISJON-2026-11-25.md) viser hvilke dokumenter som er gjeldende eller historiske.
- [Tidligere utvidet prosjektstatus](archive/PROSJEKTSTATUS-UTVIDET-2026-11-25.md) bevarer versjonsnotater, tidligere PR-er, deploy-identifikatorer, grenspesifikk historikk og detaljerte revisjonsfunn.

**Viktig:** Historiske kontrollpunkter gjelder den versjonen de ble tatt på. Oppdater status først etter faktisk kontroll; ikke endre eldre bevis i ettertid.
