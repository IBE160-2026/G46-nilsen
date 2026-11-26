# Dokumentasjonssjekkliste – Samtalestøtte

**Kun gjeldende sluttkontroll.** For oppstart, se [README](../README.md); for siste dokumenterte prosjektstatus, se [PROSJEKTSTATUS](PROSJEKTSTATUS.md). Den tidligere, detaljerte sjekklisten er bevart [uendret i arkivet](archive/DOKUMENTASJON-SJEKKLISTE-HISTORIKK-2026-11-25.md).

## Før innlevering

- [ ] **Bekreft Canvas-kravene:** frist, rapportformat, ordgrense, vedlegg, eventuelle erklæringer om KI-bruk og hvilken GitHub-lenke/gren som skal leveres.
- [ ] **Les og godkjenn refleksjonsrapporten personlig:** [hovedutkast etter skolens mal](REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md). Kontroller at egne erfaringer er korrekt fremstilt. Ikke legg studentnummer i offentlig GitHub.
- [ ] **Frys innleveringsversjonen:** noter nøyaktig 40-tegns commit-SHA på `main` og unngå nye endringer etter sluttkontrollen.
- [ ] **Kontroller samme SHA:** `npm ci`, `npm test`, `npm run audit:submission` og grønn GitHub Quality Gate på versjonen som leveres.
- [ ] **Kjør sensoroppskriften:** `npm run demo` uten nøkler og kontroller at den åpnes på `http://localhost:3000`.
- [ ] **Kontroller siste beskrivelse av deploy:** lokal GitHub-kode og publisert Render-versjon kan være forskjellige. Ikke påstå at siste commit er publisert uten egen kontroll.
- [ ] **Fullfør kun når dokumentert:** oppdater [prosjektstatus](PROSJEKTSTATUS.md) med siste verifiserte innleverings-SHA, kontrollresultater og eventuelle forbehold.

## Allerede dokumentert – ikke nye arbeidsoppgaver

Prosjektet har [krav og akseptansekriterier](bmad/PRD.md), [KI-testplan](ai/AI-TESTPLAN.md), [testbevis](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md), [KI-logg](ai/AI-LOGG-SAMTALESTOTTE.md) og [dokumentasjonsrevisjon](DOKUMENTASJONSREVISJON-2026-11-25.md). Se [dokumentasjonsguiden](OVERSIKT.md) for resten. Daterte testresultater er ikke automatisk bevis for senere commits.

**Avgrensning:** Automatisk bestått test er ikke faglig godkjenning av KI-råd, bekreftelse på produksjonsdeploy eller attestasjon av Canvas-innlevering. Historiske avkryssinger og tekniske arbeidsnotater er bevart i [arkivet](archive/DOKUMENTASJON-SJEKKLISTE-HISTORIKK-2026-11-25.md).
