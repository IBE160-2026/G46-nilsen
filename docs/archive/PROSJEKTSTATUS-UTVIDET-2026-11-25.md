# Samtalestøtte – gjeldende prosjektstatus

**Kontrollert 25.11.2026.** Denne filen er kort fasit for GitHub, Render, prosjektavgrensning og ny KI-samtale. Se [README](../README.md) for oppstart og [dokumentasjonsrevisjonen](DOKUMENTASJONSREVISJON-2026-11-25.md) for filregister.

## GitHub og siste verifiserte app

- **Repository:** [IBE160-2026/G46-nilsen](https://github.com/IBE160-2026/G46-nilsen).
- **Hovedgren:** `main`. PR #18 (dokumentasjonsrevisjon), #19 (README-arkivering og kontrollretting) og #20 (Git-grenopprydding) er flettet. Den midlertidige oppryddings-workflowen ble deretter fjernet på `main` i commit `7b924c4c150d8ddbdcd39430f22781c2ddb0c035`.
- **Siste verifiserte publiserte appkode:** PR #17, commit `61d282dcf041883b3b77bff4df483f67266bbac9`. [Quality Gate #45662862335](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45662862335) bestod. PR #16 rettet falske personnavn «Begge»/«Ingen», PR #17 rettet ufunderte yrkesforslag.
- **Nyere kode på `main`, ikke verifisert som Render-publisert:** 25.11 ble HTML-escaping i de lokale temaforslagene rettet i `app.js` (commit `01e58962`) og kontrollert av en UI-regresjonstest (`54e4e130`). Den lokale sensordemoens versjon hentes nå fra `package.json` (`17753da8`) og kontrolleres i test (`7ce92fc4`). Disse oppføringene er historiske delsteg; for dagens verifiserte SHA og CI, se neste punkt. GitHub-oppdatering er ikke en Render-deploy.
- **Siste verifiserte `main` (kode + dokumentasjon, 25.11):** commit `9487d1121944977c59c1ac1c9930792ff0f25908`, [Quality Gate #45703259640](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45703259640) = **completed/success**, alle tre jobber. Etter tidligere dokumentasjonsrevisjon er følgende endret og regresjonstestet: navigasjonsmarkering for skjermleser; personvernsperrer i sju KI-ruter; tydelig maskinell versus menneskelig golden-vurdering; begrenset fjerning av ubrukte klientfunksjoner og variabler; felles kildekandidatpipeline i server; strengere KI-/Supabase-/admin-/benchmark-feillogging og avvisning av rå leverandørfeil. [Teknisk revisjon](TEKNISK-REVISJON-CSS-APP-SERVER-2026-11-18.md) har konkrete commits, metoder, avgrensninger og negative tester. Dette er **teknisk CI-bevis**, ikke ekstern faglig godkjenning eller attestasjon av live KI-kvalitet.
- **Publiseringsskille:** Den sist dokumenterte og verifiserte Render-deployen i denne statusfilen er fremdeles `61d282dc` (se nedenfor). At en nyere commit er grønn på GitHub betyr **ikke** at den er verifisert publisert på Render. Ingen ny Render-sjekk er gjort ved denne statusoppdateringen.
- **Andre innlemmede PR-er:** #12, #14, #15, #18, #19 og #20; #13 ble lukket uten merge. Historiske notater er bevart i `docs/archive/` og Git-historikken.
- **Git-grenopprydding fullført 25.11.2026:** Verifisert kun to grener: `main` og `pilot-ux-v20.11`. PR #16–#20 er flettet og de fem overflødige arbeidsgrenene er slettet etter verifisert arkivering av hver PR-head. Ingen åpne PR-er ved denne kontrollen. `pilot-ux-v20.11` er eksperimentgren og er **beholdt**.
- **Git-historikk:** Arkivtaggen `archive/branches-before-single-main-2026-11-25` bevarer tidligere opprydding. Fem nye, verifiserte arkivtagger `archive/merged-pr-{16,17,18,19,20}-head-20261125` bevarer de fem slettede grenespissene. Engangs-workflowen er fjernet etter vellykket kjøring. Antall grener må kontrolleres igjen ved ny utvikling.

## Produksjon, pilot og sikkerhet

- **Produksjon:** [Samtalestøtte](https://g46-nilsen-samtalestotte.onrender.com), Render-tjeneste `srv-dbfagf0473hc73ceh060`, deploy `dep-dc3hfi40916s738qaph0` med appkode `61d282dc` bekreftet `live` 25.11.2026 kl. 17:16:42 UTC.
- **LIVE/tale:** Eksperimentell pilot, ikke del av den innleverte applikasjonens produksjonsfunksjonalitet. Pilotgren og Render-pilottjeneste må holdes atskilt.
- **Kvalitetsgrense:** Grønn CI dokumenterer tekniske kontroller og samsvar med prosjektets testgrunnlag, ikke en ekstern faglig godkjenning av KI-råd. Slik godkjenning er ikke et leveransekrav i dette studentprosjektet. Eventuell ordinær drift og faglig kildeakseptanse må vurderes separat, ikke som et utestående innleveringspunkt.

## Dokumentasjon og arbeidsregler

- **Hovedrapport etter skolens mal:** [REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO](REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md). Eldre konsentrerte/utvidede utkast er historiske alternativer, ikke nytt skriveoppdrag.
- **Produktkrav:** [PRD](bmad/PRD.md), [arkitektur](bmad/ARCHITECTURE-BMAD.md) og [stories](bmad/EPICS-AND-STORIES-BMAD.md). Historiske tester og beslutninger skal ikke skrives om som om de fant sted på dagens commit.
- **KI og tester:** [KI-logg](ai/AI-LOGG-SAMTALESTOTTE.md), [testplan](ai/AI-TESTPLAN.md), [testbevis](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md).
- **Nåværende oppgave:** Målrettet A-kriterierevisjon etter den faktiske sensorveiledningen for IBE160 del 1, med vekt på kjørbarhet, prosesspor, kodekvalitet og UX. Bare dokumenterte, avgrensede feilrettinger med regresjonsbevis; unngå ny funksjonsutvikling og ubegrunnet storrefaktorering.
- **Innleveringsformalia:** Canvas-frist, format og studentens sluttgodkjenning er uavklart, men er **ikke** dagens oppryddingsoppgave.
- **Historikk:** Tidligere versjon av denne statusfilen er bevart i [arkivet](archive/PROSJEKTSTATUS-HISTORIKK-2026-11-25.md) og i Git-historikken.

