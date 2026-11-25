# Dokumentasjonssjekkliste – Samtalestøtte

**Formål:** holde dokumentasjonen synkron med faktisk kode og faktisk verifisert funksjonalitet frem mot innlevering.

## Gjeldende sluttkontroll, 25.11.2026

- [x] Tidligere PR #12–#17 er flettet til `main`. Personvernfeil («Begge»/«Ingen») og yrkesforslag er rettet.
- [x] Siste app-commit før dokumentasjonsrevisjonen: `61d282dc`, [Quality Gate #45662862335](https://github.com/IBE160-2026/G46-nilsen/actions/runs/45662862335) = `success`; Render deploy = `live` 25.11.2026 kl. 17:16 UTC.
- [x] Skolens rapportmal er utfylt i [solorapporten](REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md). Ikke erstatt med det konsentrerte utkastet.
- [x] [Dokumentasjonsrevisjonen](DOKUMENTASJONSREVISJON-2026-11-25.md) kartlegger aktuelle og historiske kilder.
- [ ] Bekreft faktisk Canvas-frist, filformat, ord-/vedleggskrav og eventuelt KI-erklæringskrav.
- [ ] Studenten leser, retter egne vurderinger og godkjenner den endelige refleksjonsrapporten. Studentnummer skal ikke inn i offentlig repo.
- [ ] Frys en endelig innleverings-SHA og kontroller `npm run audit:submission` og Quality Gate på den versjonen; ingen ny bred funksjonstesting er planlagt.
- [ ] Dersom appen skal brukes utover studentprototypen: gjennomfør uavhengig faglig kildekontroll og produksjonssikkerhetsvurdering.

> Resten av sjekklisten er et **datert arbeidsnotat fra 20.11**, ikke dagens beslutningsfasit. Gamle uavkryssede merge-oppgaver skal ikke åpnes på nytt.

## Oppdatert beslutningspunkt 20.11.2026

- [x] 36 unike normative PRD-krav og 36 unike sensormatriserader er kontrollert med automatisk, offline `npm run audit:submission`.
- [x] Faktisk **lokal** GoTrue/PostgREST/RLS med to syntetiske brukere og én admin er bestått; hosted produksjon ikke validert.
- [x] Reell Chrome-brukerreise, emulert mobile:true/touch (320/390/768 px), samt faktisk 2-siders PDF-rendering med lesbar rådgivning og «Videre råd» er bestått.
- [x] Refleksjonsutkast er oppdatert til ca. 3 160 ord (ukjent Canvas-ordgrense), med mer presist skille mellom tidligere mocks, reelle lokale integrasjoner og egne læringspunkter.
- [x] [Quality Gate #44795391699](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44795391699) besto **tre CI-jobber** på revisjonsgren 20.11. Senere commits krever sin egen sluttkontroll.
- [ ] **Må avklares:** Eksakt Canvas-oppgave/Del 2-rubrikk, frist, ordgrense, rapportformat og forventet GitHub-branch/lenke.
- [ ] **Må avklares:** Studenten har lest og godkjent eget refleksjonsutkast; eventuelt studentnummer legges **bare** i privat innleveringsfil/Canvas.
- [ ] **Må avklares:** Velg eksplisitt revisjonsgren/commit eller godkjent merge til `main`, og test på akkurat den leverte versjonen.
- [ ] Fysisk mobil, menneskelig print-/tilgjengelighetskontroll og eventuelle hosted Auth-krav er åpne; fremstill ikke studentprototypen som produksjonsgodkjent.

**Fasit for gjeldende leveransestatus:** [Innleveringskontroll – 20. november](INNLEVERINGSKONTROLL-2026-11-20.md). Daterte avkryssinger lenger ned viser **historiske milepæler**, ikke gjeldende restanser.


## Pågående revisjon 18.11.2026

Hele prosjektet kontrolleres på separat dokumentasjonsgren med `main` som kontrollgrunnlag. Se `docs/REVISJON-IBE160-2026-11-18.md` for avvik, faglærertilbakemelding 12.11 og presis status på siste CI (feilet 12.11 etter tillegg av `.docs`), samt `docs/bmad/KRAVSPORING-KONTROLL-2026-11-18.md`. Eksisterende avkryssinger viser **historisk** dokumenterte arbeidstrinn og er ikke en ny friskmelding av hovedgrenen. LIVE/tale er fortsatt kun pilot, ikke produksjon.

## Revisjonsstatus 18.11.2026 – hele Samtalestøtte (separat dokumentasjonsgren)

- [x] Ny modulering av Hjelp-kildebiblioteket og kildeutvelgelsen på server, pluss lokal oppfølgingsspørsmålslogikk på klient. Nye isolerte tester og oppdaterte kildepolicytester, uten tilsiktet endring i rangeringen.
- [ ] Manuell verifikasjon på fysisk mobil, faktisk utskrift, innlogget admin og kildebank på tvers av yrker og temaer gjenstår.

- [x] Kartlagt 36 gjeldende krav-ID-er (23 FR, FR-15A, 6 AI, 5 NFR, NFR-QA-01)
- [x] Fulgte opp faglærers PRD-tilbakemelding med samlet kravstruktur, observerbare akseptanser, scope, mål/motmål, brukerreiser og glossar
- [x] Flyttet tidligere teststatuser og daterte tillegg til `docs/bmad/PRD-STATUS-OG-HISTORIKK.md`, uten tap av historikk
- [x] Etablert 36/36 *referansekoblinger* i Architecture, Epics/Stories og testbevisregisteret – **ikke** 36/36 fullførte tester
- [x] Opprettet arkitektur-/avhengighetsdiagram og tydeliggjort begrensning i modularitet
- [x] Oppdatert implementeringsplan, KI-logg, testplan, refleksjonsutkast og README på egen dokumentasjonsgren
- [x] Identifisert siste main-CI 12.11 som feilet på `.docs`; smal dokumentasjonsgrenrettelse er skrevet
- [x] Kontrollert statisk 36 unike PRD-overskrifter, plassering av FR-15A/FR-19–23/NFR-QA-01 og 36/36 ID-referanser, samt 31 eksisterende testskript og eksplisitt allowlist for lærerens eneste `.docs`-fil
- [x] Full `npm ci`, 32 `npm test`-delsteg og dependency-audit bestått på revisjonsgren 18.11 (run `44338528651`, 0 sikkerhetsfunn i npm audit)
- [x] Faktisk uinnlogget HTTP-smoke i `server.js` og deterministisk endepunkt-test i sensor-demo
- [x] Supabase metadata/security-advisor kontrollert read-only (10/10 RLS, 4 eierskapspolicyer, tabellrettigheter)
- [ ] Endelig CI etter eventuelle flere endringer, samt autentisert E2E/RLS og manuell UX før påstand om full produkttest
- [ ] Kontroller konkrete API/RLS-/feilscenarier og print-preview/fysisk mobil; statiske tester er ikke tilstrekkelig bevis
- [ ] Gjør en menneskelig sluttgjennomgang av nye akseptansekriterier og dokumentkonsistens
- [ ] Sluttrediger refleksjonsrapport mot ord-/innleveringskrav i Canvas
- [ ] Eventuell produksjonsmerge: **ikke utført**, og LIVE/tale skal fortsatt ikke inn i produksjon uten eget vedtak

- [x] Reprodusert og rettet faktisk providerstatus-feil for OpenRouter-only (rød CI `44339406194`, grønn CI `44339569597`), alle 33 tester bestått på fix-commit

Dette er en datert revisjonsmilepæl, ikke en sluttrapport eller godkjenningsattest. Se `docs/REVISJON-IBE160-2026-11-18.md` og `docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md`.

## Tillegg: ny verifisert kvalitetssikring – 18.11.2026

**Siste komplette CI-kjøring:** [44343038247](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44343038247) på revisjonsgrenen, commit `4d78bcbc02d665c3cfa0ae68289b81370621dfc3`, **SUCCESS**: 35 automatiske deltester, dependency audit med 0 sårbarheter og 66/40 golden-opptelling (ikke en ny live modellkjøring).

- **To fiktive brukere:** `tests/test-auth-history-two-users-http.cjs` kjører selve Express-serveren mot en lokal Auth/PostgREST-simulator. Opprett/les/endre/slett, eksport, uautoriserte operasjoner og databasefeil testes. Den første røde kjøringen `44341093359` fant en misvisende HTTP 500 ved oppdatering av ukjent/andres ID; nå nøytral 404. Grønn kjøring `44341831405`. Se `docs/ai/REGRESJON-HISTORIKK-TO-BRUKERE-2026-11-18.md`. **Ekte Supabase RLS med to reelle kontoer er ikke gjennomført.**
- **Feil fra KI-provider:** `tests/test-ai-provider-errors-http.cjs` med offline fetch-stub tester 503, 429, ugyldig leverandørrespons, nettverksbrudd og personvernblokkering før KI. En rød kjøring `44342507107` avdekket et falskt personnavntreff på `Hvordan`. Det delte navnefilteret og klient-/servertestene er korrigert med spørreord pluss fortsatt positiv navnegjenkjenning. Grønn kjøring `44343038247`. Se `docs/ai/REGRESJON-KI-FEIL-OG-SPORREORD-2026-11-18.md`.
- Ingen produksjonsmerge, ingen Render-deploy, ingen endringer i LIVE-piloten og ingen lesing/endring av reelle brukerrader. `main` er fortsatt produksjonsreferanse. Alle testkonklusjonene gjelder **den isolerte revisjonsgrenen**, ikke en ny `main`-CI.

- [x] Refleksjon: laget konsentrert arbeidsutkast på 2 646 ord i `docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md`, med sammenhengende hovedtekst og konkret refleksjon opp mot novemberforelesningene. Originalens 9 535 ord og daterte tillegg er bevart.
- [ ] Avklar konkret ordgrense og innleveringskrav i Canvas før valg av endelig refleksjonsrapport, og gjennomfør faglig/redaksjonell sluttkontroll.

- [x] CSS-grunnmåling og reproduserbar `npm run audit:css`: 9 870 linjer/845 `!important` før, 9 845/832 etter første rydding; 136 senere fysisk `!important` for samme selector/egenskap/at-scope identifisert.
- [x] To eksakt dupliserte KI-logo-regelblokker fjernet fra `styles-overrides.css` (−25 linjer, −13 `!important`). PR Quality Gate `44350121403` bestått.
- [ ] Før større CSS-refaktorering: faktisk visuell før-/etter-sjekk i mobil/desktop/tre temaer, minimert sidemeny, kildebankpiler, simulering, utskrift; se `docs/CSS-REVISJON-2026-11-18.md`.

- [x] Utvidet CSS-revisjon: 75 fullt overstyrte blokker, 265 enkeltdeklarasjoner og til sammen 134 `!important` fjernet; modulert 6 000-linjers core i fire ordnede filer.
- [x] Oppdatert server, PWA og tester for nye CSS-ressurser. Modul-SHA-verifikasjon og 36-testers Quality Gate bestått, run `44356425430`.
- [ ] Visuell CSS-regresjon på desktop/mobil/tema/kildebank/simulator/print gjenstår fortsatt.

- [x] CSS: 845 → 694 `!important`, 14 funksjonsnavngitte ordnede delmoduler, 90 Chrome-paritetskontroller bestått mot tidligere fungerende commit.
- [x] app.js/server.js: fem separat testbare ansvar trukket ut til `src/client/` og `src/server/`, app.js 4 632 → 4 329 linjer og server.js 2 100 → 2 001.
- [x] 43 deterministiske deltester, 99 Chrome-scenarier inkl. print-media og åpne kildebank-details, npm audit grønt i [GitHub Actions #44402558539](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44402558539).
- [ ] Manuell kvalitetskontroll på faktisk mobil/utskrift, reell tobruker-RLS og faglig menneskelig review av sammenslåing gjenstår.

## Arbeidsregel

Ved større endringer skal minst disse fire spørsmålene vurderes:

- Har funksjonen endret hva produktet **kan gjøre**?
- Har endringen gitt ny **læring/refleksjon** som bør dokumenteres?
- Har endringen påvirket **teststatus, personvern, kilder eller avgrensninger**?
- Må **AI-loggen** oppdateres fordi KI ble brukt til analyse, kode, testing, feilsøking eller produktvalg?

Planlagte funksjoner skal aldri beskrives som ferdige før de er implementert og verifisert.

## Status 01.11.2026

### Oppdatert

- [x] README: konkret sammenligning med norske beslektede tilbud
- [x] README: kurs/trening versus løpende støtte i behovsøyeblikket
- [x] README: direkte samtale omtalt som planlagt utprøving, ikke ferdig funksjon
- [x] AI-logg: mobil/PWA-arbeid
- [x] AI-logg: pilotfunn og KI-styrt regresjon
- [x] AI-logg: UI-regresjon og gjenbruk av historisk kode 01.11
- [x] AI-logg: produktdifferensiering og norsk sammenligning 01.11
- [x] Refleksjonsnotater: gjenbruk før redesign / context drift
- [x] Refleksjonsnotater: dokumentasjon som kvalitetskontroll
- [x] Refleksjonsnotater: utskrift som skjult DOM-avhengighet
- [x] Versjonshistorikk: arbeidsrunde 01.11
- [x] PWA/installasjon dokumentert som webapp, ikke Play Store/App Store-app
- [x] Yrkes-/regelverksarkitektur har eget dokument og er tydelig merket som videre arbeid/feature-flagget lag

### Må gjennomgås og synkroniseres

- [x] README: kjernefunksjonslisten nevner utskrift og videre råd
- [x] README: 20.11.5 kontrollert mot package/server/.env; pågående arbeidsrunde etter release er tydelig merket
- [x] README: historiske testtall ryddet og skilt tydelig fra dagens utvidede testpakke
- [x] product-brief.md: utskrift lagt inn som faktisk funksjon
- [x] product-brief.md: støtte i behovsøyeblikket og videre KI-dialog tydeliggjort
- [x] product-brief.md: direkte samtale tydelig merket som hypotese/videre arbeid
- [x] product-brief.md: produktdifferensiering nyansert mot norske sammenlignbare tilbud
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: integrere 01.11-læring fra refleksjonsnotatene i hovedteksten
- [x] REFLEKSJONSRAPPORT-UTKAST.md: konkret sammenligning med norske tilbud lagt inn
- [x] REFLEKSJONSRAPPORT-UTKAST.md: tydelig skille mellom kurs/trening og løpende støttefunksjon
- [x] REFLEKSJONSRAPPORT-UTKAST.md: direkte samtale omtalt som testbar hypotese
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: kontrollere ordantall og fjerne overlapp/gjentakelser før levering
- [x] BRUKERTEST-FUNN-OG-BACKLOG.md: nye funn om informasjonsmengde, sammenfolding og utskrift lagt inn
- [ ] BRUKERTEST-FUNN-OG-BACKLOG.md: skille tydelig mellom implementert, under arbeid og forkastet
- [x] PRD: utskrift/videre råd/PWA kontrollert; direkte samtale lagt inn som hypotese/videre arbeid
- [x] UX-dokumentasjon: progressivt rådshierarki og standardtilstand dokumentert
- [x] AI-INTEGRATION.md: videre dialog, yrkeslag/feature flagg og direkte samtale-hypotese synkronisert
- [x] AI-RESPONSE-CONTRACT.md: menneskelig åpningsstil og reaksjonsstruktur dokumentert
- [x] AI-TESTPLAN.md: nye verifiseringsbehov for rådshierarki, utskrift, videre råd og direkte samtale lagt inn
- [x] SOURCEBANK: maskinlesbar bank kontrollert til 62 kilder, samsvarer med SOURCEBANK v6-dokumentasjonen
- [x] CHANGELOG.md: arbeidsrunden 01.11 dokumentert eksplisitt som ikke-fullverifisert release
- [ ] VERSJONSHISTORIKK-v20.11.md: oppdatere når arbeidsrunden eventuelt får eget releasenummer

### Funksjoner som må omtales forsiktig

- [ ] Yrkes-/sektortilpasning: ikke kall den aktiv i produksjon før feature flagg/UI/runtime er verifisert
- [ ] Tariff-/avtalelogikk: ikke fremstilles som automatisk juridisk fasit
- [ ] Direkte samtale: planlagt utprøving, ikke ferdig funksjon
- [ ] Voice: videre arbeid, ikke del av nåværende produkt
- [ ] Full teststatus: ikke skriv at dagens kode har bestått full suite uten en faktisk ny fullkjøring
- [ ] «Unik»: unngå absolutte produktpåstander som ikke kan dokumenteres

## Dokumenter som skal være kilder til slutt-rapporten

1. `docs/REFLEKSJONSRAPPORT-UTKAST.md` – hovedrapport
2. `docs/REFLECTION-NOTES-v20.md` – råmateriale/læringspunkter
3. `docs/ai/AI-LOGG-SAMTALESTOTTE.md` – sporbar KI-bruk
4. `docs/BRUKERTEST-FUNN-OG-BACKLOG.md` – faktisk brukerinnsikt
5. `docs/VERSJONSHISTORIKK-v20.11.md` + `CHANGELOG.md` – kode-/releasebevis
6. `docs/ai/AI-TESTPLAN.md` + testfiler – testbevis
7. `docs/SOURCEBANK.md` + maskinlesbar kildebank – faglig kildegrunnlag
8. `docs/OCCUPATION-KNOWLEDGE-ARCHITECTURE.md` – yrkes-/regelverkslag og avgrensninger

## Før innlevering

- [ ] Kjør ny full lokal testpakke på endelig commit dersom mulig
- [ ] Dokumenter eksakt commit/release som ble testet
- [ ] Kontroller produksjonslenken
- [ ] Kontroller mobil/PWA på fysisk enhet
- [ ] Kontroller utskrift med hovedråd + videre råd
- [ ] Kontroller historikk og personvernflyt
- [ ] Oppdater README med endelig produksjonsversjon
- [ ] Oppdater AI-logg med siste utviklingsrunde
- [ ] Oppdater refleksjonsrapport med endelige brukertestfunn
- [ ] Fjern påstander om planlagte funksjoner som ikke ble levert
- [ ] Kontroller at rapporten skiller klart mellom egne vurderinger, KI-forslag, brukerfunn og dokumenterte fakta


## Synk 08.11.2026

- [x] README beskriver valgfri yrkes-/sektorkontekst og ny CSS-struktur.
- [x] Product Brief synkronisert med yrkeskilder og produksjonsstatus.
- [x] PRD FR-22 oppdatert fra delvis/fremtidig til implementert produksjonskode.
- [x] Arkitekturdokument oppdatert med profesjonsavgrensning og CSS-moduler.
- [x] UX-dokument beskriver fire hovedkategorier i kildebanken.
- [x] SOURCEBANK dokumenterer skillet mellom generell fagbank og yrkes-/sektorkilder.
- [x] KI-logg og testplan dokumenterer negative profesjonskontroller.
- [x] Refleksjonsnotater og refleksjonsrapport oppdatert.
- [x] Egen full yrkeskilde-audit opprettet.
- [x] Egen kodeoppryddingsrapport opprettet.
- [x] Egen dokumentasjonssynk for 08.11 opprettet.


### Quality gate / eval-sjekk 08.11.2026

- [x] Golden-bank oppdatert til 66 caser
- [x] 40 strenge yrke/sektor/tariff/kilde-caser dokumentert
- [x] Alle 14 sektorer har positiv + negativ yrkesrelevans
- [x] 28 sektor-golden kjøres deterministisk mot yrkesruteren
- [x] expected/expected-any/forbidden/no-source oracles dokumentert
- [x] Testfilene syntakssjekkes før resten av suite
- [x] GitHub Actions quality gate opprettet
- [x] Dependency audit med HIGH som gate
- [x] body-parser/qs sikkerhetsfunn rettet og re-testet
- [x] Testgjeld etter CSS-modularisering ryddet
- [x] Tvetydig yrke «sekretær» ryddet
- [x] Foreldreløse kildereferanser ryddet
- [x] authority_index lekkasje korrigert
- [x] minstelønnskilde avgrenset mot faktisk virkeområde
- [x] README synkronisert
- [x] Product Brief synkronisert
- [x] PRD synkronisert
- [x] Architecture synkronisert
- [x] AI-TESTPLAN synkronisert
- [x] TEST-FASIT-OG-SPORBARHET synkronisert
- [x] AI-LOGG synkronisert
- [x] refleksjonsnotat og refleksjonsrapport synkronisert
- [x] kilde-/yrkesaudits synkronisert
- [x] hovedrapport opprettet: `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`
- [x] Historisk live-verifikasjon av 40 strict occupation-golden dokumentert 09.11.2026 mot `gpt-5.6-luna`: 40/40 OK i `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`. Dette er **ikke** en ny testkjøring eller garanti for dagens kode/andre modeller.
