# Innleveringskontroll – Samtalestøtte, IBE160

**Revisjon:** 20. november 2026  
**Skolerepo:** `IBE160-2026/G46-nilsen`  
**Kandidat til vurdering:** `docs/ibe160-helhetlig-revisjon-20261118` (draft [PR #12](https://github.com/IBE160-2026/G46-nilsen/pull/12))  
**Gjeldende publiserte hovedgren:** `main` (`2ae505adc22a9ea86ef89e5cf045f4ec5f68d0cf`, kontrollert mot PR-base 20.11)  
**Siste fullstendige CI på revisjonsgrenen før denne leveransekontrollen:** [#44795391699](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44795391699) – **SUCCESS i alle 3 jobber**, på commit `c188f5104acd42c048db307edd8bc03881dfcd25`. Ny full CI må vurderes på selve *endelige* innleveringscommiten.

## Beslutning

**IKKE MERK SOM INNLEVERT / IKKE MERGE TIL `main` / IKKE DEPLOY.** Teknisk revisjon og utvidede tester er fullført på en separat gren, men dette er ikke den samme koden som ligger på `main`. PR-en er fortsatt **draft**, og hadde **125 endrede filer** sammenlignet med `main` ved statuskontrollen. En grønn CI på PR-grenen kan ikke føres som en grønn `main`-CI.

**Teknisk anbefalt vurderingskandidat er den isolerte PR-grenen**, fordi den inneholder dokumentert opprydding, feilrettinger og beståtte integrasjonstester. Dette er en *kandidat*, ikke et valg om hva Canvas godtar eller en godkjent leveranse. Dersom Canvas krever `main` som innleveringsgren, må PR-diffen gjennomgås og eventuelt sammenslås **etter uttrykkelig godkjenning**, og ny test kjøres på den faktiske `main`-commiten. Ikke anta at en PR-lenke alene oppfyller oppgaven.

**Viktig skille:** Render-produksjon er ikke oppdatert. En vurderer som åpner produksjonslenken får derfor ikke nødvendigvis samme funksjoner/testgrunnlag som dokumentasjonen fra PR-grenen.

## 1. Kjent sensorgrunnlag og hva som faktisk er verifisert

Tilgjengelig utdelt **Sensorveiledning – Del 1** gjelder *applikasjon og prosess* (**70 %** av totalen). Den oppgir disse **veiledende** kriterievektene innen del 1:

| Kriterium | Veiledende vekt i del 1 | Status/etterprøvbart bevis |
|---|---:|---|
| Prosess og KI-styring | 30 % | Produktbrief, PRD, arkitektur, epics/stories, AI-logg, versionshistorikk og konkrete test → feil → rettelse-eksempler. Sesjonslogg er delvis etterkonstruert; les datoer kritisk |
| Funksjonalitet og omfang | 20 % | Ekte Chrome-brukerreise med tema, råd, oppfølging, simulering, historikk og sletting **mot lokal demo**, ikke live KI |
| Kvalitetssikring | 15 % | 52 npm-teststeg, 66 golden-caser/40 strenge, admin-Chrome, 99 CSS-paritetscaser, lokal ekte Supabase Auth/PostgREST/RLS og PostgreSQL-/RPC-test |
| Design og brukeropplevelse | 10 % | Chrome `mobile:true`/touch ved 320/390/768 px; faktisk 2-siders PDF med kontrollert tekst. **Fysisk telefon, print-dialog og skjermleser ikke gjennomført** |
| Kodekvalitet/arkitektur | 10 % | Moduluttrekk, dokumentert importorden, kontrollert CSS-reduksjon. **Store hovedfiler og 694 `!important` gjenstår** |
| README/kjørbarhet | 10 % | `npm ci`, `npm run demo`, `npm test` og forklarte konfigurasjoner. Sensor må kunne kjøre uten ekte nøkler |
| Repo/ryddighet | 5 % | Strukturtester, `.env.example`, ingen kjente versjonerte produksjonsnøkler. **Mange historiske dokumenter/125-fil-PR** må ha tydelig sensorsti |

**Totalvurderingen omtales som 70 % applikasjon/prosess og 30 % refleksjonsrapport.** Den fullstendige **sensorveiledningen for del 2, eksakte innleveringsformkrav, Canvas-frist, ordgrense og filformat er ikke verifisert**. Disse skal **ikke** gjettes eller omtales som bekreftet. Forelesningsnotater omtaler enkelte frister som foreløpige anslag, ikke Canvas-bekreftelser.

## 2. Kode-/testbevis som faktisk kan refereres

| Område | Dokument/test | Avgrensning |
|---|---|---|
| Gjeldende krav | [PRD – 36 unike krav](bmad/PRD.md) og [krav-til-test-matrise](ai/SENSOR-KJERNEFLYT-E2E-2026-11-20.md) | 36/36 krav-ID-er dekket av **referanser** er **ikke** 36/36 manuelt aksepterte krav |
| Brukerens fulle kjerneflyt | `tests/test-sensor-journey-browser.cjs` | Reell Chrome/DOM, men fiktive svar fra lokal demo |
| Mobil og utskrift | `tests/test-mobile-print-browser.cjs` og [måle-/refleksjonsrapport](ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md) | Mobil-emulering + faktisk PDF; ingen fysisk Android eller papirutskrift |
| Roller og egen historikk | `tests/test-supabase-local-auth-e2e.cjs`, [bevisrapport](ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md) | **Ekte lokal** Supabase GoTrue/PostgREST/RLS; hosted konfigurasjon ikke godkjent |
| KI/fagkilder | [KI-testplan](ai/AI-TESTPLAN.md) og [testbevis](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md) | Siste særskilte live KI-runde 09.11 på egen fasit, **ikke** uavhengig juridisk/faglig kvalitetssikring |
| Teknisk gjeld | [CSS-/kodegjennomgang](TEKNISK-REVISJON-CSS-APP-SERVER-2026-11-18.md) | Ikke full refaktorering eller driftssikkerhetsgodkjenning |
| Refleksjon | [konsentrert refleksjonsutkast](REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md) | Ca. 3 160 ord i Markdown inkl. metadata/overskrifter; **arbeidsutkast** og Canvas-ordkrav uavklart |
| Faktisk testet commit | [Quality Gate #44795391699](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44795391699) | Gjelder spesifikk PR-commit, **ikke automatisk `main`** eller senere commits |

## 3. Leveranseblokkere og beslutninger som må dokumenteres

| Prioritet | Kontroll | Status / nødvendig handling |
|---|---|---|
| **STOPP** | Faktisk Canvas-oppgave og sensorveiledning del 2 | **Uavklart.** Verifiser frist, forventet gren/innleveringslenke, PDF/DOCX, vedlegg, ordgrense, eventuell KI-erklæring |
| **STOPP** | Endelig kildekodeversjon | **Uavklart.** Velg eksplisitt: kun PR-gren dersom godkjent i Canvas, eller godkjent merge til `main` med ny grønn test og ingen utilsiktet deploy |
| **STOPP** | Studentens eierskap til refleksjonen | **Uavklart.** Studenten må lese, bekrefte egne erfaringer, fjerne ubegrunnede påstander og godkjenne sluttversjonen |
| **STOPP** | Studentnummer og privat innleveringsmetadata | **Plassholder** i utkastet. Fyll inn **kun i privat innleveringsfil/Canvas**, ikke i offentlig skolerepo eller Git-logg |
| **Faglig vurdering** | Manuell mobil/print/skjermleser | **Ikke gjennomført fysisk.** Automatisert Chromium + PDF er bestått, men erstatter ikke nødvendig manuell test hvis den kreves |
| **Drift, ikke automatisk skoleblokkering** | Hosted Supabase Auth, passordvern, betalingsbenchmark, leverandør-kvalitet | Fortsatt avgrenset fra studentprototypen og skal beskrives som **videre arbeid**, ikke produksjonsferdig |
| **Før avlevering** | Endelig CI på innleveringscommit | Kjør hele Quality Gate på nøyaktig commit/branch som skal vurderes, og dokumenter faktisk status og hash |

Ikke bruk «ferdig levert», «produksjonsgodkjent», «personvern garantert» eller «alle 36 krav bestått» uten egne bevis. Det er mer etterrettelig å beskrive studentprototypen som en sammenhengende, demonstrerbar og godt testet løsning **med spesifiserte begrensninger**.

## 4. Rask, reproduserbar sensorsjekk

Fra *den valgte kildekoden* i skole-repoet:

```bash
npm ci
npm run audit:submission
npm run demo
# Åpne den lokale adressen sensordemoen oppgir.
# I en annen terminal:
npm test
```

`npm run audit:submission` er **offline** og kontrollerer at alle 36 PRD-ID-ene samsvarer med den dokumenterte sensormatrisen, at nøkkeldokumenter og testfiler finnes og at README viser riktig dokumentasjon. Kommandoen er **ikke** en attest på at Canvas-kravene er oppfylt.

Etter at Canvas-regler, kandidatgren, valgte commit og studentens refleksjon faktisk er godkjent kan `npm run audit:submission -- --strict` brukes som **lokal, eksplisitt** sluttkontroll. Den krever `SUBMISSION_CANVAS_CONFIRMED=1`, `SUBMISSION_REFLECTION_APPROVED=1`, `SUBMISSION_TARGET_COMMIT` lik `git rev-parse HEAD` og `SUBMISSION_BRANCH_APPROVED` lik faktisk branch. Dette er **manuelle erklæringer, ikke en Canvas-API-verifikasjon**. Den utfører aldri merge, upload eller deployment.

## 5. Konkret overlevering og neste steg

1. Behold **draft PR #12** umerget og testet inntil det er bekreftet hva lærer/Canvas faktisk vil motta.
2. Avklar den **formelle** innleveringsinstruksen og Del 2-rubrikk. Ikke hev at 30 % rapportdelen er formelt vurdert uten den.
3. La studenten kontrollere at refleksjonen stemmer med reelle egne erfaringer og lever en eventuell student-ID **utenfor offentlig Git**.
4. Fastslå endelig leveransegren og en **bestemt SHA**; kjør full test på samme SHA.
5. Dersom det er nødvendig å flytte endringer til `main`, gjennomgå **hele** PR-diffen, oppnå uttrykkelig godkjenning, og test igjen etter merge. Dette dokumentet er **ikke** en slik godkjenning.

**Utført i denne gjennomgangen:** kun revisjonsgren, kode-/dokumentkontroll og isolerte tester. `main`, Render, live Supabase, betalte KI-kall og separat LIVE/tale-pilot er urørt.
