# Kritisk sensorsimulering – IBE160 del 1 (25.11.2026)

> **Uavhengig gjennomgang av foreliggende repo-spor, utført med ChatGPT – IKKE en vurdering fra Claude eller den faktiske sensoren.** Denne simuleringen følger den innlimte *«Sensorveiledning – Del 1, IBE160 Programmering med KI – Applikasjon og prosess (70 %)»*. Karakterforslaget er foreløpig, ikke en attestert karakter. Del 2/refleksjonsrapport (30 %) vurderes ikke med denne rubrikken.

## Kontrollgrunnlag og begrensninger

- Repositorium: `IBE160-2026/G46-nilsen`, `main`; undersøkt README, PRD/stories, KI-logg, tester, tekniske revisjoner, prosjektstatus, refleksjonsutkast, root-filstruktur, pull requests og GitHub Actions.
- **Siste grønne fullkjøring før refleksjonsendring:** commit `49bce9d2`, [Quality Gate #45704272505](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45704272505) = completed/success. Den nyeste refleksjonscommiten `19b5e2fa` hadde [Quality Gate #45704768369](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45704768369) med feil i **oppstart av lokal Supabase**: Docker-hostport 54322 var allerede i bruk. De deterministiske testene og PostgreSQL-jobben bestod. Den mislykkede jobben ble derfor startet på nytt **på samme commit**. Bekreft utfallet før sign-off.
- Ingen ren `git clone` / `npm ci` / `npm run demo` ble kjørt av denne gjennomgangen på en uavhengig maskin. Det finnes en automatisert faktisk Chrome-brukerreise med sensordemo, men den erstatter ikke sensorens egen installasjon.
- Ingen ny, uavhengig visuell UX-inspeksjon, faktisk skjermlesertest, live KI-kvalitetsvurdering, full hemmelighetsskanning av *hele historikken* eller uttømmende juridisk kilderevisjon er gjennomført i denne sensorsimuleringen.
- Render-prod ble sist verifisert som `61d282dc`, mens GitHub har nyere commits. Sensor må bruke **innlevert Git-commit ved fristen**, ikke anta at Render viser samme versjon.

## Foreløpig, streng kriterievurdering

| Kriterium i sensorveiledningen | Vekt | Foreløpig nivå | Bevis og begrunnelse | Konkret risiko før A |
|---|---:|---|---|---|
| **1. Prosess og KI-styring** | 30 % | **B** | Reell Git- og PR-historikk over tid, 20 PR-er (bl.a. #8, #9, #12, #16–20), BMAD-planlegging, KI-logg med etterprøvbare endringer. Prosjektet erkjenner selv at BMAD ble formalisert etter at prototypen startet, og at KI-loggen er rekonstruert – ikke en komplett ordrett promptlogg. | Kan sensor lett følge 3–5 utvalgte **faktiske** beslutningsløp fra behov/prompt til commit, negativ test og løsning, uten å lete gjennom mange tusen linjer? |
| **2. Funksjonalitet og omfang** | 20 % | **A (betinget)** | Reell frontend, Express, Supabase, roller, historikk, tema, KI-veiledning, oppfølging, simulering, kilde- og personvernflyt. En sammenhengende Chrome-test går gjennom brukerreisen med lokale deterministiske data. | Virkelig konfigurert ekstern KI og faktisk hosted innlogging er ikke testet i denne runden; full A forutsetter at sensor får en fungerende kjerneflyt fra README. |
| **3. Kvalitetssikring og testing** | 15 % | **A (betinget)** | Mange nivåer: enhets-/kontrakttester, faktisk HTTP/SDK med lokale leverandørsimulatorer, lokal Auth/PostgREST/RLS, reell PostgreSQL, Chrome-/touch-/PDF-test, negative personvern- og feilloggsaker. Historiske live-goldenresultater er dokumentert med avgrensninger. | Endelig innleverings-SHA må ha full grønn CI; automatiske maskinelle `OK` er ikke faglig godkjenning av KI-svar. |
| **4. Design og brukeropplevelse** | 10 % | **B (usikkert)** | Dokumentert UX-/designarbeid, fysisk mobilbruk rapportert av prosjekteier, Chrome emulering med touch og utskrifts-PDF, tydelig appflyt. | Ikke inspisert manuelt på denne runden; full tastatur-/skjermleser-/kontrastvurdering ikke dokumentert som en samlet standardisert akseptansetest. |
| **5. Kodekvalitet og arkitektur** | 10 % | **C/B (usikkert)** | Navngitte moduler i `src/client` og `src/server`, omfattende integrasjonstester og dokumentert opprydding av død kode, kildekandidater og logging. | `app.js` er fortsatt over 4500 linjer og `server.js` om lag 2000, mye CSS-spesifisitet/overstyring. Linjetall er ikke i seg selv karaktergrunnlag; lesbarhet og ansvarfordeling må stikkprøves. |
| **6. README og kjørbarhet** | 10 % | **B (betinget)** | Presis installasjonsoppskrift `git clone`, `git switch main`, `npm ci`, `npm run demo`; demo krever ikke nøkler, tydelig merket som syntetisk; `.env.example` for live drift. | Sensorveiledningen krever faktisk ren installasjon. Dette er ennå ikke utført separat i denne gjennomgangen. |
| **7. Ryddighet i repo** | 5 % | **B** | `.gitignore` dekker miljøfiler, avhengigheter, testartefakter. Siste treoversikt fant bare `.env.example`, ingen sporede `.env`-filer eller `node_modules`. Logisk `docs/`, `tests/`, `src/`, `assets/`. | Mange historiske Markdown-filer og CSS-filer kan gjøre navigasjon krevende; ingen full hemmelighetsskanning av hele Git-historikken. Ingen ordinære GitHub Issues ble funnet; eksisterende PR-/commitspor er likevel en reell arbeidsflyt. |

**Ikke oppgi en tallfestet A som konklusjon.** Hvis man for illustrasjon setter B, A, A, B, C, B, B, blir vektsummen `0,30×4 + 0,20×5 + 0,15×5 + 0,10×4 + 0,10×3 + 0,10×4 + 0,05×4 = 4,25`: veiledende **B** for del 1. Dette er et konservativt *scenario*, ikke en karakterfastsettelse; sensorens egne produkt- og kodeobservasjoner kan endre resultatet i begge retninger. Sensorveiledningens A-grense er 4,5, og sensor kan begrunnet avvike fra mekanisk skår.

## Anbefalt siste kontroll, i prioritert rekkefølge

1. **Verifiser siste SHA uten miljøfeil:** Sjekk den omkjørte lokale Supabase-jobben på `19b5e2fa`. Dersom portkollisjonen gjentar seg, utred CI-miljø/portbinding separat fremfor å endre virksomhetslogikken. Ikke frys en feilende commit som «grønn».
2. **Kjør en ekte «sensor fra null»-installasjon:** På ren Windows-/Linux-maskin, følg **kun** README; `git clone`, `git switch main`, `npm ci`, `npm run demo`, gjennomfør grunnleggende brukerreise; deretter `npm test` og `npm run audit:submission`. Noter eksakt maskin/Node-versjon, SHA og faktiske resultater. Ingen slike nye manuelle resultater er påstått her.
3. **Lag en kort leserute for prosessbevisene:** Peker fra 3–5 representative konkrete PR-er/commits til før-/etterfeil, beslutning, test og dokumentasjon. Bruk eksisterende etterprøvbare kilder – aldri fabrikerte ordrette prompts. Prioriter prosesskriteriet på 30 %.
4. **Foreta en avgrenset menneskelig kode-/UX-stikkprøve** av storfilene, CSS-kaskaden, tastaturbruk, tilgjengelighet og kritiske API-kontrakter. Dokumenter kun det som faktisk er undersøkt. Ikke start bred refaktorering bare for å redusere antall linjer rett før innlevering.
5. **Avklar innleveringsformalia og lås den endelige SHA:** Canvas-frist, filformat, vedlegg, refleksjon etter skolens mal, din personlige gjennomlesning og om en eventuell separat fremvisning må gjelde den **samme** versjonen som GitHub.

## Om Claude

Dette notatet er ment som en **kritisk forberedelse** til en annen models vurdering. Det er ikke en «Claude-sensorrapport», og ingen ekstern Claude-gjennomgang er hevdet gjennomført. Claude bør få faktisk repo, eksakt innleverings-SHA, den originale sensorveiledningen og beskjed om å vurdere selvstendig – inkludert risiko for etterrasjonalisert BMAD/AI-logg og forveksling av syntetiske tester med ekte KI-kvalitet.
