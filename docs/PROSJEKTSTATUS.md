# Samtalestøtte – gjeldende prosjektstatus

**Oppdatert 25.11.2026. Dette er prosjektets korte, kanoniske status for arbeid på tvers av ChatGPT-samtaler. Den erstatter ikke detaljerte tester eller sensorens krav.**

## Én leveransegren

- **Skolerepo:** https://github.com/IBE160-2026/G46-nilsen
- **Eksamens- og utviklingsgren:** `main`, ikke tidligere PR-grener eller gamle demo-/pilotgrener.
- **Inkludert i main:** PR #12 (helhetlig kvalitet), PR #14 (kilder/Hjelp) og PR #15 (kildeproveniens, sektordekning, test-/dokumentasjonsløft), slått sammen 20.–25.11.2026.
- **PR #13:** foreldet audit-utkast, lukket uten å legge eldre kode tilbake.
- **Arbeidsmodell:** All ny utvikling vurderes mot den faktiske `main`-commiten. Ikke omtale en gammel PR- eller pilotbranch som gjeldende løsning. Bruk `npm ci`, `npm run demo`, `npm test` og `npm run audit:submission` for lokal validering.

## Aktiv applikasjon og historisk pilot

- Samtalestøtte er en studentprototype for forberedelse, simulering og oppfølging av krevende ledersamtaler. Det er **ikke** en formell HR-, juridisk beslutnings- eller journalplattform.
- **LIVE/tale V1 er fortsatt eksperimentell.** Den gamle `pilot-ux-v20.11` inneholder selvstendig kode, men kan ikke løftes direkte inn i dagens `main` uten ny sammenslåing, personvern- og funksjonstesting. Ikke aktiver tale i produksjon bare for å få én gren.
- Gamle, separate brancher kan arkiveres som **én gjenopprettbar Git-tag** før sletting. Arkivtaggen beholder også de unike LIVE-kommittene i historikken, uten å aktivere den utestede funksjonen i applikasjonen. Det skal fremgå av sluttrapporten hvilket arkivmerke som faktisk er opprettet.
- Render-produksjonstjeneste: https://g46-nilsen-samtalestotte.onrender.com/ , satt til `main`. **Auto-deploy er konfigurert**, men et nytt, vellykket produksjonsdeploy må observeres konkret før man hevder at siste `main` kjører på Render.
- De ekstra Render-demo-/pilot-tjenestene er uavhengige webtjenester, ikke Git-grener. Å rydde Git fjerner dem **ikke**. De må slettes/arkiveres separat i Render når det er forsvarlig.

## Testbevis – ikke bland ulike versjoner

- Kode og integrasjon: Quality Gate på PR #15 før merge var 3/3 grønn. **Kjør/observer også Quality Gate på endelig main.**
- Ekte KI: original fem-case-test 25.11.2026 hadde 5/5 maskinelt uten avvik, men faglig gjennomgang avdekket to ekte feil i C (antatt fellesmøte) og E (antatt beslutningsmyndighet).
- Separate, senere ekte KI-omtester av C/E og B/D: til sammen 4/4 uten rapporterte maskinelle avvik; relevante forbedringer observert. Disse rapportene **erstatter ikke** den gamle responsen.
- Kildegjennomgang: 14 grunnkandidater og ytterligere mulige rettspåstander gjennomgått i separate notater. Fullt kontrollert kildeutdrag, lovperiode, arbeidsgiverområde og signert faglig akseptanse mangler fortsatt. Ikke hev at alle KI-råd er juridisk kvalitetssikret.

Se `docs/FEM-CASES-FAGLIG-VURDERINGSMATRISE-2026-11-25.md`, `docs/KILDEAKSEPTANSE-VERSJONERT-BESLUTNING-2026-11-25.md` og `docs/INNLEVERINGSSTATUS-2026-11-25.md` for detaljer.

## Eksamenssjekkliste (må avgjøres på faktisk main)

1. Sjekk `git branch -a`: studentens GitHub skal ha `main` som eneste aktive branch, etter trygg historikkarkivering. Historiske tagger er ikke utviklingsgrener.
2. Dokumenter **endelig commit-SHA på main**, og kontroller GitHub Actions, og at README-metoden fungerer fra fersk klone.
3. Kontroller hva Canvas faktisk krever (gren, rapportformat, frist og studentnummer) før det markeres som innlevert.
4. Studenten leser og bekrefter at refleksjonsrapporten er korrekt. Ikke lagre studentnummer i offentlig GitHub.
5. Verifiser Render-miljøet separat. Eventuell produksjonsdeploy, sletting av gamle testtjenester og aktivering av eksperimentell tale er **egne beslutninger**.

**Uavklart er ikke det samme som feilet – og grønn CI er ikke det samme som full faglig akseptanse.**
