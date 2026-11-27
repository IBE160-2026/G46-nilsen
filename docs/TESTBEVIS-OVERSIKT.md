# Testbevis – leseguide for sensor

Denne siden viser **hvilken type kontroll som er dokumentert**, hvor bevisene finnes og hva testene **ikke** kan bevise. Det er ikke et nytt testresultat. For siste verifiserte commit og Quality Gate, se [prosjektstatus](PROSJEKTSTATUS.md).

| Testområde | Faktisk metode og dokumentasjon | Hva dette gir bevis for | Hva det ikke beviser |
| --- | --- | --- | --- |
| Kjørbar sensordemo | [README](../README.md), `npm run demo`, separat CI-jobb for ren installasjon/oppstart | Oppstart uten API-nøkler, frontend med fiktive svar | Live modellkvalitet, skyautentisering |
| Brukerreise i nettleser | [Sensor-kjerneflyt](ai/SENSOR-KJERNEFLYT-E2E-2026-11-20.md), `tests/test-sensor-journey-browser.cjs` | Chrome-interaksjon gjennom råd, oppfølging, simulering, historikk og sletting i lokal demo | Produksjonsmiljø eller ekte sluttbrukersituasjoner |
| Mobil og utskrift | [Mobil-/PDF-kontroll](ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md), `tests/test-mobile-print-browser.cjs` | Emulert mobil/touch og maskinell PDF-innholdskontroll | Full skjermleser-/WCAG-akseptanse, fysisk utskrift |
| Innlogging og tilgangskontroll | [Lokal Supabase Auth/E2E](ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md), `tests/test-supabase-local-auth-e2e.cjs` | Faktisk **lokal** Auth/PostgREST/RLS med syntetiske brukere i isolert testmiljø | Tilgangssikkerhet i et særskilt hostet produksjonsprosjekt |
| KI-kontrakter og kildeutvelgelse | [KI-testplan](ai/AI-TESTPLAN.md), [testbevisregister](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md), [fasit/sporbarhet](ai/TEST-FASIT-OG-SPORBARHET.md) | Kontroller av definerte regler, format, ruting og prosjektets egne forventninger | Uavhengig ekspertvurdering av alle råd og rettskilder |
| Personvern og API-grenser | [Testbevisregister](ai/TESTBEVIS-OG-DEKNING-2026-11-18.md), automatiske `tests/`-kontroller | Dekning for spesifikke negative scenarier som er beskrevet i testene | Full sikkerhetssertifisering, penetrasjonstest eller garanti mot alle lekkasjer |
| Kravsporbarhet | [PRD](bmad/PRD.md), [sensormatrise](ai/SENSOR-KJERNEFLYT-E2E-2026-11-20.md), `npm run audit:submission` | Maskinell kontroll av at krav-ID-er og matriser samsvarer | At alle 36 krav er faglig godkjent av uavhengig sensor |

## Viktig skille mellom testtyper

- **Statisk/kontrakttest:** inspiserer kode, skjema, struktur eller forventet format. Gir ikke automatisk bevis for brukeropplevelse.
- **Deterministisk integrasjons-/nettlesertest:** kjører faktisk kode og interaksjoner, men med kontrollerte, fiktive svar eller disponibel lokal infrastruktur.
- **Menneskelig vurdering:** kan bedømme nytte, formulering, kilderelevans og risiko, men er ikke det samme som automatisk testresultat. Tidligere [mobilrefleksjon](ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md) skiller prosjekteiers egen vurdering fra instrumentert testing.
- **Live KI-test:** avhenger av modell, tidspunkt, input og tjenestekonfigurasjon. Et grønt golden-/schema-resultat basert på prosjektets egne fasiter er **ikke** en uavhengig faglig attest.

## Reproduser det sensor kan kontrollere selv

Følg [README](../README.md). Kjør først `npm ci`, så `npm run demo` og åpne `http://localhost:3000`. Avslutt og kjør deretter `npm test` og `npm run audit:submission`. Noen isolerte CI-jobber for Supabase/PostgreSQL krever egne tjenester og dokumentert miljø; disse er ikke det samme som sensorens nøkkelfrie demo.

**Kilde for aktuell status:** [PROSJEKTSTATUS](PROSJEKTSTATUS.md). Daterte testprotokoller dokumenterer historiske kjøringer og bør alltid leses sammen med den commit eller Quality Gate de viser til.
