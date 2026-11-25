# Innleverings- og integrasjonsstatus – 25. november 2026

> **STATUSKORREKSJON ETTER MERGE OG GRENOPPRYDDING (25.11.2026):** PR #15 er nå slått sammen med `main` som `d9046e3`; GitHub har bare **én aktiv branch – `main`**. De 24 gamle grenenes historikk er arkivert under taggen `archive/branches-before-single-main-2026-11-25`. Opplysningene nedenfor om åpen PR #15 er en *historisk beslutningsstatus før mergetidspunktet*. Se [PROSJEKTSTATUS](PROSJEKTSTATUS.md) for gjeldende status. Render-testtjenester er en separat sak.

**HISTORISK ØYEBLIKSBILDE FØR PR #15-MERGE:** Tabellen og handlingspunktene under bevares som beslutningshistorikk og gjelder **ikke** den nåværende `main`-versjonen. Se [PROSJEKTSTATUS](PROSJEKTSTATUS.md) og [dokumentasjonsrevisjon](DOKUMENTASJONSREVISJON-2026-11-25.md). PR #12–#17 er flettet inn; `61d282dc` var live og Quality Gate grønn 25.11.2026. Canvas-formalia og personlig rapportgodkjenning gjenstår fortsatt.

## Historisk GitHub-status før PR #15-merge

| Gren/PR | Status |
|---|---|
| `main` | Inneholder allerede PR #12 og PR #14, som ble merged 20.11.2026. |
| [PR #15](https://github.com/IBE160-2026/G46-nilsen/pull/15) | Åpen **draft**. Endringene ligger på `fix/evidence-sources-20261120`, ikke `main`. |
| Quality Gate på PR #15 før siste README-opprydding | 3/3 jobber bestått ved kontroll. Krev ny grønn kjøring på **endelig merge-commit** før faktisk innlevering. |
| Render | Automatisk deploy fra `main` er **ikke kontrollert**. Anta at merge **kan** utløse produksjonsdeploy inntil dette er avkreftet. |

## Hvilke KI-bevis finnes?

- Opprinnelig ekte KI-test 25.11.2026: fem anonymiserte saker, 5/5 uten maskinelle kontraktbrudd, men ved faglig gjennomlesning dokumenterte M4-avvik i C (antatt fellesmøte) og E (antatt myndighet).
- Separate ekte KI-omtester for C/E og B/D: 2/2 maskinelt uten avvik i hver omtest, og vesentlig bedre konkret kildevalg og samtaleråd. Disse er **ikke** en samlet oppdatert fem-case-godkjenning.
- Målrettet påstandsvis gjennomgang: 14 opprinnelige kandidater og minst åtte supplerende kontrollpunkter er dokumentert i `docs/KILDEKONTROLL-14-PASTANDER-2026-11-25.md` og `docs/FEM-CASES-FAGLIG-VURDERINGSMATRISE-2026-11-25.md`. Ingen skriftlig signert originalkildesjekk av samtlige påstander foreligger.
- Lokal kildekladd med rettede B4/D3-kandidatlenker er lagret kun på studentens PC. Historiske funn og lokale testresultater skal ikke revideres eller påstås inngitt i repoet.

## Historiske vurderinger før PR #15-merge

1. **Kontroller Render auto-deploy mot `main`.** Hvis `main` automatisk publiserer produksjon, kan merge ikke behandles som bare en innleveringshandling. Velg bevisst en plan for pilot/produksjon og eventuelt skru av automatisk produksjonsdeploy **før** merge. Ikke endre Render-konfigurasjon uten brukergodkjenning.
2. **Få en eksplisitt beslutning om å merge PR #15**, med erkjennelse av at den påstandsvis juridiske akseptansen fortsatt er ufullstendig. Draft-status og åpen formell fagkontroll må ikke omtales som `REVIEWED_OK`.
3. **Se over den faktiske endelige PR-diffen.** Kontroller at tekniske testverktøy, dokumentasjon, eventuelle nye KI-prompter og kuraterte kilder er tilsiktede, og at ingen API-nøkler, brukerdata eller lokale `test-results` inngår.
4. **Merge til main bare etter klarsignal**, og kjør samme Quality Gate på den nye `main`-commiten. Kontroller deretter `npm run demo` og `npm run audit:submission` på koden sensor faktisk skal hente.
5. **Innlevering og produksjon er to separate beslutninger.** Canvas-frist, grenkrav og studentens egen refleksjonsrapport må være dokumentert/avklart. Ingen rapport skal automatisk endres fra utkast til innlevert.

## Relevant dokumentasjon

- [Historisk innleveringskontroll 20.11](INNLEVERINGSKONTROLL-2026-11-20.md) – forhistorie, ikke gjeldende beslutning
- [Faglig versjonert kildeakseptanse](KILDEAKSEPTANSE-VERSJONERT-BESLUTNING-2026-11-25.md)
- [Fem-case faglig vurderingsmatrise](FEM-CASES-FAGLIG-VURDERINGSMATRISE-2026-11-25.md)
- [Kildekontroll av 14 kandidater](KILDEKONTROLL-14-PASTANDER-2026-11-25.md)
- [Konsentrert refleksjonsrapport – utkast](REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md)

**Beslutning 25.11.2026:** Teknisk gjør den grønne PR-kontrollen det rimelig å forberede merge. De faktiske stopperne for merge er uavklart Render-effekt, en eksplisitt godkjenningsbeslutning og en siste kontroll av endelig PR-endring. Formell faglig kildeakseptanse gjenstår og må merkes ærlig; den kan ikke løses ved å fylle inn godkjente felt uten kildebevis.
