# Samtalestøtte – gjeldende prosjektstatus

**Oppdatert 25.11.2026 etter PR #16 og #17. Kanonisk orientering for nye ChatGPT-samtaler og sensor.**

## Oppdatert teknisk fasit

- **Repo og eksamensgren:** [IBE160-2026/G46-nilsen](https://github.com/IBE160-2026/G46-nilsen), `main`.
- **Siste testede applikasjonscommit før dokumentasjonsrevisjonen:** `61d282dcf041883b3b77bff4df483f67266bbac9` (PR #17). [Quality Gate #45662862335](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45662862335) fullført med `success`.
- **Produksjon:** [g46-nilsen-samtalestotte.onrender.com](https://g46-nilsen-samtalestotte.onrender.com), Render-tjeneste `srv-dbfagf0473hc73ceh060`; deploy `dep-dc3hfi40916s738qaph0` for `61d282dc` bekreftet `live` 25.11.2026 kl. 17:16:42 UTC. Render kan trenge manuell deploy selv med autoDeploy aktivert. Ingen full innlogget browser-akseptanse er dokumentert for denne publiseringen.
- **Siste feilrettinger:** PR #16 hindrer falske personnavn «Begge» og «Ingen», PR #17 krever tydeligere arbeidskontekst for automatisk yrkes-/sektorforslag. Nye regresjonstester følger ordinær testpakke.
- **Arbeidsgrener:** Tidligere opprydding etterlot bare `main` per arkivtidspunktet, men nye arbeidsgrener, blant annet `pilot-ux-v20.11` og denne dokumentasjonsgrenen, kan eksistere senere. Ingen tidligere «én aktiv gren»-påstand skal tolkes som permanent repo-status.
- **Innlevering:** Applikasjonen er en studentprototype. Rapporten [tilpasset skolens mal](REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md) eksisterer, men studentens sluttgodkjenning, Canvas-frist og formkrav er fortsatt uverifisert. Teknisk grønn CI er ikke formell fag-/juridisk kvalitetssikring.
- **Dokumentasjon:** [Revisjonsrapport](DOKUMENTASJONSREVISJON-2026-11-25.md) skiller gjeldende status fra historiske logger. Ikke omskriv datert bevismateriale for å få det til å se nyere ut.

## Historisk prosjektstatus fra tidligere 25.11.-kontroll

> Avsnittene nedenfor er beholdt som historiske registreringer. Der de oppgir `f591ad7` som siste versjon eller «én aktiv gren», er de nå erstattet av fasiten ovenfor.

## Én leveransegren

- **Skolerepo:** https://github.com/IBE160-2026/G46-nilsen
- **Eksamens- og utviklingsgren:** `main`, ikke tidligere PR-grener eller gamle demo-/pilotgrener.
- **Inkludert i main:** PR #12 (helhetlig kvalitet), PR #14 (kilder/Hjelp) og PR #15 (kildeproveniens, sektordekning, test-/dokumentasjonsløft), slått sammen 20.–25.11.2026.
- **PR #13:** foreldet audit-utkast, lukket uten å legge eldre kode tilbake. **PR #15:** slått sammen med `main` 25.11.2026, mergecommit `d9046e320a3abf781ec4a5956e50ddd958fd9ecb`.
- **Arbeidsmodell:** All ny utvikling vurderes mot den faktiske `main`-commiten. Ikke omtale en gammel PR- eller pilotbranch som gjeldende løsning. Bruk `npm ci`, `npm run demo`, `npm test` og `npm run audit:submission` for lokal validering.

## Aktiv applikasjon og historisk pilot

- Samtalestøtte er en studentprototype for forberedelse, simulering og oppfølging av krevende ledersamtaler. Det er **ikke** en formell HR-, juridisk beslutnings- eller journalplattform.
- **LIVE/tale V1 er fortsatt eksperimentell.** Den gamle `pilot-ux-v20.11` inneholder selvstendig kode, men kan ikke løftes direkte inn i dagens `main` uten ny sammenslåing, personvern- og funksjonstesting. Ikke aktiver tale i produksjon bare for å få én gren.
- **Grenopprydding FULLFØRT 25.11.2026:** GitHub bekreftet nøyaktig **én aktiv gren – `main`**. De 24 tidligere grenene er fjernet. Hele historikken er bevart i én verifisert, annotert Git-tag: `archive/branches-before-single-main-2026-11-25` (arkivcommit `2c24160324674958588f938e23c811ac1a5b2668`, med 25 foreldre: daværende main + alle 24 grenespissene). Dette er historisk arkiv, **ikke** aktivert kildekode eller LIVE-funksjon.
- Render-produksjonstjeneste: https://g46-nilsen-samtalestotte.onrender.com/ , satt til `main`. **Verifisert deploy 25.11.2026 kl. 16:02 UTC:** commit `f591ad763990f74daca90b43f350cb672e66857b` har status `live`; bygging og serveroppstart er bekreftet i Render-loggene. Auto-deploy er konfigurert, men tidligere Git-push utløste ikke en registrert deploy; en kontrollert cache-renset deploy ble derfor utløst manuelt. Full innlogget brukertest er ikke utført av denne gjennomgangen.
- **Render-tjenester er fortsatt et separat oppryddingspunkt.** Git-oppryddingen sletter ikke webtjenester. I arbeidsområdet fantes fire tjenester: produksjon `g46-nilsen-samtalestotte` (skal beholdes), testdemo `g46-samtalestotte-visuell-test-20261120`, gammel `g46-nilsen-samtalestotte-v20-11-preview` og eldre `Samtalestotte` knyttet til et annet, personlig Git-repo. De tre sistnevnte er ikke eksamensgrener; de må vurderes for sletting i Render separat. Slett ikke den personlige eldre tjenesten uten å kontrollere om den brukes.

## Testbevis – ikke bland ulike versjoner

- Kode og integrasjon: Quality Gate på PR #15 og endelig publisert `main`-commit `f591ad7` var **3/3 grønn** (GitHub Actions #45648303736). Dette bekrefter testet kode, ikke fullstendig faglig kvalitet på alle modellråd. Etter eventuelle nye dokumentasjonscommitter må Quality Gate kontrolleres på den nye `main`-SHA-en.
- Ekte KI: original fem-case-test 25.11.2026 hadde 5/5 maskinelt uten avvik, men faglig gjennomgang avdekket to ekte feil i C (antatt fellesmøte) og E (antatt beslutningsmyndighet).
- Separate, senere ekte KI-omtester av C/E og B/D: til sammen 4/4 uten rapporterte maskinelle avvik; relevante forbedringer observert. Disse rapportene **erstatter ikke** den gamle responsen.
- Kildegjennomgang: 14 grunnkandidater og ytterligere mulige rettspåstander gjennomgått i separate notater. Fullt kontrollert kildeutdrag, lovperiode, arbeidsgiverområde og signert faglig akseptanse mangler fortsatt. Ikke hev at alle KI-råd er juridisk kvalitetssikret.

Se `docs/FEM-CASES-FAGLIG-VURDERINGSMATRISE-2026-11-25.md`, `docs/KILDEAKSEPTANSE-VERSJONERT-BESLUTNING-2026-11-25.md` og `docs/INNLEVERINGSSTATUS-2026-11-25.md` for detaljer.

## Eksamenssjekkliste (må avgjøres på faktisk main)

1. **Bekreftet:** GitHub hadde bare `main` etter arkivjobben. Ved innlevering: kjør `git branch -a` fra oppdatert lokal klone og sjekk at ingen gamle lokale grener forveksles med `main`. Arkivtagger er ikke utviklingsgrener.
2. Dokumenter **endelig commit-SHA på main**, og kontroller GitHub Actions, og at README-metoden fungerer fra fersk klone.
3. Kontroller hva Canvas faktisk krever (gren, rapportformat, frist og studentnummer) før det markeres som innlevert.
4. Studenten leser og bekrefter at refleksjonsrapporten er korrekt. Ikke lagre studentnummer i offentlig GitHub.
5. Verifiser Render-miljøet separat. Eventuell produksjonsdeploy, sletting av gamle testtjenester og aktivering av eksperimentell tale er **egne beslutninger**.

**Uavklart er ikke det samme som feilet – og grønn CI er ikke det samme som full faglig akseptanse.**
