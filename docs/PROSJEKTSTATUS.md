# Samtalestøtte – gjeldende prosjektstatus

**Kontrollert 25.11.2026.** Denne filen er kort fasit for GitHub, Render, prosjektavgrensning og ny KI-samtale. Se [README](../README.md) for oppstart og [dokumentasjonsrevisjonen](DOKUMENTASJONSREVISJON-2026-11-25.md) for filregister.

## GitHub og siste verifiserte app

- **Repository:** [IBE160-2026/G46-nilsen](https://github.com/IBE160-2026/G46-nilsen).
- **Hovedgren:** `main`. Dokumentasjonsrevisjonen PR #18 er flettet i commit `f17deb80f914374f935803d11dcffe1a2761fab6`.
- **Siste appkodeendring:** PR #17, commit `61d282dcf041883b3b77bff4df483f67266bbac9`. [Quality Gate #45662862335](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45662862335) bestod. PR #16 rettet falske personnavn «Begge»/«Ingen», PR #17 rettet ufunderte yrkesforslag.
- **Andre innlemmede PR-er:** #12, #14 og #15; #13 ble lukket uten merge. PR #18 ryddet dokumentasjon og bevarte tidligere loggstatus som historiske kilder.
- **Status ved siste grensjekk:** `main` pluss `docs/final-documentation-audit-20261125`, `fix/occupation-suggestion-context-20261125`, `fix/privacy-begge-false-positive-20261125` og `pilot-ux-v20.11`. Tre ferdigflettede arbeidsgrener er oppryddingskandidater. `pilot-ux-v20.11` er eksperimentgren og **skal ikke slettes uten eksplisitt arkivbeslutning**. Ny oppryddingsgren kan komme i tillegg.
- **Git-historikk:** Arkivtaggen `archive/branches-before-single-main-2026-11-25` bevarer tidligere oppryddingshistorikk. Antallet aktive grener kan endres og må verifiseres på nytt før det omtales som nåværende.

## Produksjon, pilot og sikkerhet

- **Produksjon:** [Samtalestøtte](https://g46-nilsen-samtalestotte.onrender.com), Render-tjeneste `srv-dbfagf0473hc73ceh060`, deploy `dep-dc3hfi40916s738qaph0` med appkode `61d282dc` bekreftet `live` 25.11.2026 kl. 17:16:42 UTC.
- **LIVE/tale:** Eksperimentell pilot, ikke del av den innleverte applikasjonens produksjonsfunksjonalitet. Pilotgren og Render-pilottjeneste må holdes atskilt.
- **Kvalitetsgrense:** Grønn CI dokumenterer tekniske kontroller, ikke at alle KI-råd eller juridiske påstander er uavhengig faglig kvalitetssikret. Det finnes dokumenterte, uløste forbehold ved kildeakseptanse og fullskala drift.

## Dokumentasjon og arbeidsregler

- **Hovedrapport etter skolens mal:** [REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO](REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md). Eldre konsentrerte/utvidede utkast er historiske alternativer, ikke nytt skriveoppdrag.
- **Produktkrav:** [PRD](bmad/PRD.md), [arkitektur](bmad/ARCHITECTURE-BMAD.md) og [stories](bmad/EPICS-AND-STORIES-BMAD.md). Historiske tester og beslutninger skal ikke skrives om som om de fant sted på dagens commit.
- **KI og tester:** [KI-logg](ai/AI-LOGG-SAMTALESTOTTE.md), [testplan](ai/AI-TESTPLAN.md), [testbevis](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md).
- **Nåværende oppgave:** Rydde dokumentasjon/Git, fjerne motstridende navigasjon og avklare overflødige grener. **Ikke** foreslå ny funksjonsutvikling eller en ny omfattende testrunde.
- **Innleveringsformalia:** Canvas-frist, format og studentens sluttgodkjenning er uavklart, men er **ikke** dagens oppryddingsoppgave.
- **Historikk:** Tidligere versjon av denne statusfilen er bevart i [arkivet](archive/PROSJEKTSTATUS-HISTORIKK-2026-11-25.md) og i Git-historikken.

