# Testbevis og kravdekning – kontrollregister 18.11.2026

**Grunnlag:** `main` commit `2ae505adc22a9ea86ef89e5cf045f4ec5f68d0cf`, 12.11.2026.  
**Status:** Utvidet til faktisk CI-kjøring 18.11.2026 på isolert revisjonsgren, inklusive produksjonsserverens uinnloggede HTTP-grense og deterministisk sensordemo. Full innlogget E2E, live KI og fysisk UX er fortsatt ikke utført.  
**Formål:** Skille testfilens eksistens fra testens faktiske beviskraft, slik faglærer etterspør.

## Tillegg 20.11.2026: varig PostgreSQL-budsjett – faktiske transaksjons- og omstartstester

**Implementert på revisjonsgrenen (bare SQL-forslag):** `database/security/benchmark-budget-postgres-proposal.sql` med RLS på fire private tabeller, normal `SECURITY INVOKER`-tilgang, eksplisitt `REVOKE EXECUTE` fra `PUBLIC`/klientroller og `GRANT` kun til `service_role`. Ingen SQL mot Supabase-produksjon, ingen kobling fra faktisk betalt Express-rute.

**Verifikasjon i isolert PostgreSQL 17 (I):** `tests/sql/benchmark-budget-postgres.sql` kontrollerer faktiske funksjonsrettigheter, nektet klient-RPC, reservasjon/oppgjør, idempotens, duplikater, separate brukere, dags- og løpsgrenser og overskytende providerestimat. `tests/sql/benchmark-budget-concurrency.sh` oppretter to uavhengige samtidige databasetilkoblinger og forventer ett `ok:true` og ett `BUDGET_RUN_BUSY`, med nøyaktig 10 cent bokført. GitHub Actions omstarter engangs-PostgreSQL før `tests/sql/benchmark-budget-postgres-restart.sql` krever at uavklart providerforsøk fortsatt er låst, kan gjøres opp som `uncertain` med beholdt reserve og etterlater varige beløp. Femti syntetiske forsøk tester 500-cent dagsgrense og sperre mot ny kjøre-ID. Den faktiske SQL-filen kjøres også to ganger for å kontrollere re-kjørbarhet. Eksisterende RLS-jobb for to brukere og samtalehistorikk kjører uendret.

**Begrensninger:** Fysisk PostgreSQL-oppførsel er verifisert, men ekte Supabase API/Auth/PostgREST, tilkobling fra to faktiske Express-/Render-instanser og leverandørens hardkostgrenser er fortsatt åpne. In-memory-ledgeren brukes fortsatt bare i isolert lokal providertest. **Ingen betalt testmodus er aktivert i produksjon.** Se [teknisk budsjettledger-rapport](BENCHMARK-POSTGRES-LEDGER-2026-11-20.md).

---

## Tillegg 20.11.2026: dynamisk golden-/benchmarkantall – UI- og HTTP-regresjon

**Problem oppdaget:** `index.html` hevdet at fulltest var 26 saker / 52 KI-kall og at «alle» benchmarksaker var 112. Faktiske kilder inneholder 66 golden- og 114 benchmarkcaser, og benchmarkvalget `value="112"` ekskluderte de to siste.

**Endring:** Serverens eksisterende beskyttede `GET /api/admin/pilot-regression/cases` svarer nå også på `?summary=1` med bare `pilotCount`, `fullCount` og `paidRegressionEnabled`. Appen henter tallene, viser korrekt antall caser og `× 2` KI-kall, validerer at benchmark-API-tall samsvarer med faktisk `cases`-liste og bruker symbolsk `value="all"`. Knappene er disabled før metadata/eksplisitt mock-only-tillatelse er kontrollert. Ny PWA-shell-cache `20.11.73`.

**D (funksjon):** `tests/test-benchmark-evaluation.cjs` prøver `resolveCaseCount("all", N)` ved flere bankstørrelser og sikrer at hele en 114-casers bank velges. **I (HTTP):** `tests/test-admin-role-http.cjs` prøver faktisk Express-admin-summary, sammenligner mot JSON-bank og avviser øvrige roller; casetekster sendes ikke. **I (Chrome):** `tests/test-admin-browser.cjs` laster faktisk UI med fiktiv 3-casers benchmarkbank + 1/3 golden-caser, bekrefter 2/6 KI-kall, tre simulerte benchmarkkall ved «alle», korrekt avbryt av fulltest og deaktivert testmodus. `tests/test-ui-regression.cjs` og `tests/test-pilot-regression.cjs` sjekker at gamle tall ikke kommer tilbake.

**Bevisnivå:** Syntetiske data og simulerte providerresultater; ingen ekte betalte kall, ingen faktisk produksjonsdatabase eller Supabase Auth-test. Fortsatt **50 ordinære npm-delsteg** i tillegg til headless Chrome/CSS og isolert PostgreSQL/RLS. Endelig CI-head må være grønn før aksept.

---

## Tillegg 20.11.2026: fail-closed betalte tester og lokal serverbudsjettsperre

**Implementert:** `src/server/benchmark-budget.js` gir et synkront, servereid in-memory budsjettregnskap på USD 0,10 forhåndsreserve per forsøk, fast run-budsjett og maks USD 5 per bruker/dag per Node-prosess. Parallelle kall for samme bruker, gjenbruk av case/modell, ugyldige kjøre-ID-er, budsjettøkning under kjøring og nullstilling via nytt run-ID/klientens `spentSoFar` avvises. Kostnadsestimat over reserveringen trekkes, og provider-/lagringsfeil beholder minst reserveringen. **Dette er ikke delt/varig over flere instanser eller restart og er ikke garanti mot overskytende faktisk leverandørkostnad.**

**Sikker driftsgrense:** `POST /api/admin/benchmark/live` er deaktivert i produksjonsmodus med 503 `BENCHMARK_PAID_DISABLED`, uansett budsjett fra nettleseren. Bare eksplisitt isolert Node-test med fiktiv provider kan starte ruten. Den administrative `pilot-regression`/`production-regression`-flyten er sperret med 503 `PAID_TEST_DISABLED` før providerkall; normale KI-samtaler går som før. Testmerking bruker nå verifisert normalisert `req.user.role` i stedet for å rekalkulere rolle fra feil objekt.

**Tester og bevis:** `tests/test-benchmark-budget.cjs` (D) prøver den ekte servermodulen med grensetilfeller, parallelle kall, brukerisolasjon, budsjettreplay og feiloppgjør. `tests/test-benchmark-live-http.cjs` (I) tester den reelle Express-ruten og OpenAI SDK med `--import tests/support/offline-openai-fetch.mjs` og en fiktiv, lokal HTTP-provider, samt syntetisk lokal Auth/PostgREST. Ingen eksterne nettverkskall eller betalte nøkler. `tests/test-admin-role-http.cjs` tester at benchmark/pilot/fulltest er sperret i produksjonsmodus, og at vanlig bruker ikke får admin-testrettigheter. Headless Chrome bruker bare syntetiske endepunkter. Totalt **50** deterministiske npm-teststeg, i tillegg til Chrome/CSS og PostgreSQL/RLS-jobbene.

**Gjenstår før enhver reell betalingsflyt:** Transaksjonelt, varig DB-regnskap på tvers av instanser; leverandørgrenser som tar høyde for kostnad over forhåndsreserve; robust auth/rollesjekk; E2E med fiktive brukere i separat Supabase; driftsreview. Betalte rutiner er ikke startet mot ekstern KI eller deployet. For detaljer, se [benchmarkrapport](BENCHMARK-KOSTNAD-OG-KVALITET-2026-11-20.md).

---

## Tillegg 20.11.2026: ren benchmarkmodul, syntetiske KI-kjøringer og kostnadsrisiko

**Metode:** Faktisk `src/client/benchmark-evaluation.js` evalueres isolert med deterministiske fiktive inputs i `tests/test-benchmark-evaluation.cjs`. Round-robin-utvalg, fullbankrekkefølge, ordgrense, mekanisk språk, manglende åpning og myke funn dekkes uten nettverk. Den delte navnedetektoren kjøres i ny `tests/test-benchmark-privacy-signal.cjs` mot alle **114** benchmarkcaser; den har bevart positivt treff på et faktisk navn i en syntetisk testtekst.

**Nettleserintegrasjon:** `tests/test-admin-browser.cjs` har nå både kansellert betalt benchmark-/pilot-dialog (ingen betalte POST-kall), kostnadsfri `POST /api/admin/benchmark/mock`, og en fullstendig **syntetisk** positiv benchmark-/pilotgjennomgang som oppdaterer faktisk DOM og HTML-escaper modellresultater. Alle potensielt kostnadsbærende HTTP-endepunkter er fanget opp med `fetch`-mocker *før* applikasjonen laster. Dette beviser klientadferd under simulerte svar, ikke ekte kostnad, modellkvalitet eller providergrense.

**Ekte Express:** `tests/test-admin-role-http.cjs` prøver `POST /api/admin/benchmark/mock` uten API-nøkkel/DB og om dette krever administratorrolle. Negative rolletester omfatter nå **60** avviste adminforespørsler. Ruten skal gi gyldig bank med `ok:true` og null problemer etter retting.

**B113-funn:** Gratis bankkontroll avdekket `B113 utløser personvernsjekk (name)`. Den delte navnedetektoren identifiserte det vanlige adjektivet «nærmeste» i «til nærmeste leder har ...» som et navn. En minimal grammatisk stoppliste-justering i `src/privacy-detector.js` er utført, og testene krever at et reelt personnavn fortsatt oppdages. Dette er et dokumentert feilfunn → retting → ny test, **ikke** svekket blokkering av reelle opplysninger.

**Fortsatt ikke godkjent:** Ekte benchmarkkostnadstak. Dette var det opprinnelige funnet: backend stolte på klientens `spentSoFar` og brukte 0,05 USD reserve. Den nye løsningen ignorerer klientforbruket, har kun lokal servereid reservering og blokkerer alle betalte testmoduser i produksjon. Et garantert, distribuert kostnadstak finnes fortsatt ikke. Tekst i Admin viser også foreldede casetall. Betalte rutiner er **ikke** flyttet, aktivert eller kalt mot leverandør. `main`, produksjon og LIVE-pilot er urørt.

**Detaljer og testmatrise:** [Benchmark, kostnad og kvalitet – 20.11](BENCHMARK-KOSTNAD-OG-KVALITET-2026-11-20.md). 48 deterministiske delsteg pluss Chrome og PostgreSQL/RLS; siste CI-head må være grønn før endelig aksept.

---

## Tillegg 20.11.2026: innholdsredigeringsmodul og egne negative tester

**Endring og avgrensning:** `src/client/admin-content.js` kapsler `renderAdminContentFields`, markering og nullstilling av ulagret tilstand og `saveAdminContent`. `app.js` oppretter modulen via `SamtalestotteAdminContent.create(...)` med injisert DOM, `fetch`, HTML-escaping, feltkatalog, aktive tekstverdier og dynamisk rolle. Redigering er kun tillatt som redaktør eller administrator i klienten. **Express-serveren, ikke denne klientkontrollen, håndhever autorisasjonen.** Innholdskatalog, generelle innholdsoppdateringer og benchmark/AI-forbruk ligger fortsatt i sine etablerte deler.

**Ramme og målegrunnlag:** For dette uttrekket er `app.js` **4 278 → 4 284 fysiske linjer** (+6), men **230 656 → 229 082 tegn** (−1 574). Modulen har ca. 105 linjer. Netto prosjektstørrelse går ikke nødvendigvis ned; det som forbedres er separat, etterprøvbar tilstandshåndtering. Shell-cache og klientversjon for dette trinnet er `20.11.71`.

**Isolert runtime (D):** Ny `tests/test-admin-content-runtime.cjs` verifiserer at ugyldig rolle ikke utløser API-kall, at redigerbare tekstfelt HTML-escapes og første gruppe åpnes, at `input` aktiverer lagreknapp/ulagret indikator, at `PUT /api/admin/content` inneholder riktig JSON med trimmet tekst og cookies, og at vellykket lagring oppdaterer synlig innhold og tilbakestiller dirty. HTTP 403, 503 og nettverksfeil må beholde dirty, vise lesbar feilmelding og tillate vellykket retry. Endring av rolle etter modulstart testes særskilt.

**Chrome-klient (I, simulert Auth/API):** Utvidet `tests/test-admin-browser.cjs` klikker den faktiske `textarea`-/lagre-/bekreftelses-/reload-flyten i headless Chrome som både redaktør og administrator. Kontrollerer at ingen `PUT` sendes før bekreftelse, vellykket oppdatering av forsiden, 403 med fortsatt ulagrede endringer, og avvis/aksept ved forespørsel om å forkaste endringer. Admin-synlighet, KI-bruk og rollehåndtering testes fortsatt.

**Express-server (I, lokal Auth/PostgREST-fake):** Utvidet `tests/test-admin-role-http.cjs` kontrollerer positive redaktør-/administratorlagringer mot *ekte Express-rute* og isolert fiktiv PostgREST-upsert, samt 401/403 for uvedkommende, avvisning av ugyldig payload, serverfiltrering av ukjente feltnavn, avgrensning til 20 000 tegn og 503 ved manglende innholdstabell. Dette er ikke bevis på faktisk databasepersistens eller real Supabase Auth.

**Infrastruktur/andre tester:** `index.html`, serverens public assetliste, sensordemo, `sw.js`, UI-/asset-/PWA-kontroll og syntaks er oppdatert. **46 deterministiske npm-delsteg**, i tillegg til særskilt Chrome-admin, 99 Chrome/CSS-paritetskontroller og engangs PostgreSQL/RLS. Ingen faktisk KI-/benchmark-kostnad under testene.

**Åpent:** Ekte Supabase Auth/PostgREST og RLS i separat miljø, manuell mobil/utskrift, uavhengig faglig kontroll og komplett UX-gjennomgang. PR #12 forblir draft; produksjon, LIVE-pilot og data i faktisk Supabase er uendret.

---

## Tillegg 20.11.2026: refaktorert administrasjonsdata i egen klientmodul

**Nytt avgrenset uttrekk:** `src/client/admin-data.js` inneholder nå de opprinnelige funksjonene `loadAdminUsers`, `loadAdminFeedback`, `loadAdminAiSettings`, `loadAdminAiUsage` og kostnadsformattering. `app.js` injiserer `document`, `fetch`, `escapeHtml` og `getCurrentUser` gjennom modulens `create()`. Admininnhold, benchmark, rollebeskyttet Express-API og innloggingsflyten er fortsatt der de var. Brukerrollen hentes **ved hvert kall**, ikke bare ved modulinitialisering.

**Størrelse:** `app.js` **4 354 → 4 278 linjer** og **237 462 → 230 656 tegn** i dette trinnet. Modulen har eget ansvar, men er fortsatt DOM-/API-koblet; dette er en kontrollert *klientmodul*, ikke en påstand om ren domene- eller forretningslogikk.

**Koblingspunkter kontrollert:** `index.html` laster modulen før `app.js`; `server.js` eksponerer bare den eksplisitte frontendfilen, `scripts/sensor-demo.js` gjør det samme, og `sw.js` inkluderer modulen med egen cache-versjon. `tests/test-public-assets.cjs`, `tests/test-ui-regression.cjs` og `tests/test-pwa.cjs` kontrollerer tilgjengelighet, lastrekkefølge og PWA-dekning.

**Kjøretidsbevis:** `tests/test-admin-client-runtime.cjs` kjører nå **selve den nye modulen** i Node VM med injiserte fiktive DOM-/HTTP-objekter, inkludert veksling bruker → redaktør → admin → bruker *i samme instans* uten at rollen fryses. `tests/test-admin-browser.cjs` åpner den faktiske klienten i headless Chrome med syntetiske roller og API-svar og kontrollerer adminnavigasjon, escaping, PATCH-suksess/403 og filtrering. `tests/test-admin-role-http.cjs` kontrollerer servergrensen separat. De 45 deterministiske npm-teststegene og RLS-/CSS-jobbene består uendret.

**Begrensninger:** Klientmodulering beviser ikke Auth-/RLS-sikkerhet i ekte Supabase, menneskelig vurdering av UI eller at ingen ukjente edge-caser finnes. Administrasjonsfunksjonene er fortsatt DOM-baserte, og øvrig admin-/benchmark-/Auth-kode i `app.js` er fortsatt omfattende. `main`, Render og LIVE-piloten er ikke endret.

**Første komplette CI etter moduluttrekket:** [Quality Gate #44752528974](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44752528974): **SUCCESS**, commit `a3ca6c2557ddfdb3c5e08ddf9f508f6e6c3dffdd`. Siste dokumentasjons-/rolletestcommit må også ha grønn Quality Gate.

---

## Tillegg 20.11.2026: reell før-/ettertest av unødvendige SQL-rettigheter

**Risiko identifisert i Supabase (skrivebeskyttet):** Klientrollene `anon` og `authenticated` har `TRUNCATE`, `TRIGGER`, `REFERENCES` og `MAINTAIN` på `public.conversations`. `TRUNCATE` er ikke kontrollert av RLS, og rollen trenger ikke denne tabellomfattende operasjonen for samtalehistorikk.

**Ny testdekning i `rls-postgres` (egen CI-jobb):** `tests/sql/conversations-privileges-before.sql` beviser i engangs PostgreSQL at overflødige rettigheter faktisk finnes og at `TRUNCATE` lykkes *før* innstramming. Deretter kjøres `database/security/conversations-least-privilege-proposal.sql` **kun i den midlertidige testdatabasen**. `tests/sql/conversations-privileges-after.sql` beviser med både privilegiekontroll og faktiske SQL-forsøk at `TRUNCATE` blir avvist, mens vanlig autentisert CRUD og tjenestekontoens rettigheter beholdes. Forslaget kjøres to ganger for idempotens, etterfulgt av tidligere tobruker-RLS-tester. [Quality Gate #44750390782](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44750390782) **SUCCESS** for opprinnelig implementering; etterfølgende innstramming av forslagets rolleomfang og dokumentasjon har ny CI som må bekreftes særskilt.

**Bevisnivå:** Faktisk PostgreSQL-privilegiekontroll + V20-8 RLS i isolert CI; **ikke** ekte Supabase Auth/PostgREST, ingen produksjonsendring, og **ingen automatisk databaseutrulling**. Kilde, testmatrise, funn og kontrollert fremtidig utrullingsprosedyre: [Sikkerhetstest roller og RLS](SIKKERHETSTEST-ROLLER-RLS-2026-11-20.md).

---

## Tillegg 20.11.2026: PostgreSQL RLS-regresjon med ekte policyer

**Ny automatisk CI-jobb:** `rls-postgres` bruker et engangs `postgres:17`-miljø, minimal lokal testfixture og **repoets faktiske `database/migrations/V20-8-SUPABASE-MIGRATION.sql`**. [Quality Gate #44748685274](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44748685274) – `rls-postgres` **SUCCESS**.

**Verifisert mot PostgreSQL (ikke bare mock):** To syntetiske JWT-sub-identiteter med `SET ROLE authenticated` og `auth.uid()` prøver selvstendig `SELECT`, `INSERT`, `UPDATE`, `DELETE`, kryssbrukerlesing/-skriving, forfalsket `user_id`, anonym tilgang og ni interne tabeller. RLS-oppføringene i V20-8 er faktisk opprettet og brukt under kjøring. Det eksisterende npm-løpet er fortsatt **45 delsteg**; den nye PostgreSQL-jobben kommer **i tillegg** og erstatter ikke den ekte Supabase Auth/PostgREST-akseptansetesten.

**Viktig sensoravgrensning:** Lokal `auth.uid()`-funksjon og tabellskall er laget for test; ingen reell JWT-signaturvalidering, PostgREST, produksjonsdatabase eller ekte brukerkontoer inngår. Det eneste tilknyttede Supabase-prosjektet ble ikke mutert. Dokumentasjon, konkrete kontroller og gjenstående sikkerhetsfunn: [Sikkerhetstest roller og RLS](SIKKERHETSTEST-ROLLER-RLS-2026-11-20.md).

---

## Tillegg 20.11.2026: serverroller og skrivebeskyttet Supabase-sjekk

**Ny verifisert test:** `tests/test-admin-role-http.cjs` er lagt til `npm test`: **45 deterministiske teststeg**. [Quality Gate #44746493058](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44746493058) er **SUCCESS** på server-/test-commit `929056f72a608d4d101fd4b1ccb3d2e23dd900ca`.

**Bevis:** Faktisk Express-server mot en isolert lokal Supabase Auth-simulator, 55 avviste admin-HTTP-operasjoner (anonym/bruker/redaktør/forfalsket rolle/ugyldig rolle), redaktørtilgang til innholdsredigering, admin-brukerliste, avvist endring av egen rolle, avvist ugyldig rolle/ukjent ID, og autorisert rolleoppdatering som skriver `app_metadata`. Den eksisterende retention-oppryddingen ved API-oppstart ble særskilt kontrollert som en **intern bakgrunnsprosess** i fake-backend.

**Skrivebeskyttet faktisk Supabase-kontroll 20.11:** Alle 10 `public`-tabeller har RLS på. `conversations` har eierskapspolicyer for alle fire CRUD-operasjoner, inkludert `WITH CHECK` ved opprettelse/oppdatering. De ni øvrige interne tabellene har ingen direkte RLS-policyer og ingen vanlig CRUD-grant til `anon` eller `authenticated` i den kontrollerte oversikten. **Åpent sikkerhetsfunn:** `TRUNCATE`/`TRIGGER`-privilegier på `conversations` er bredere enn nødvendig og bør vurderes for `REVOKE` etter test, siden RLS ikke kontrollerer `TRUNCATE`. Supabase varsler også om deaktivert leaked-password protection. Det finnes kun ett tilkoblet Supabase-prosjekt og ingen testgren. **Ingen ekte kontoer, data eller rettigheter ble endret.**

**Begrensning:** Ekte Auth-/PostgREST-/RLS-test med to syntetiske kontoer **gjenstår** og må bare utføres i separat database/testmiljø. Dette resultatet kan ikke presenteres som full sikkerhetsgodkjenning.

**Metode, detaljer, testmatrise og åpne risikoer:** [Sikkerhetstest – roller og RLS 20.11](SIKKERHETSTEST-ROLLER-RLS-2026-11-20.md).

---

## Tillegg 20.11.2026: ekte Chrome-regresjon for administrasjonsvisningen

**Implementering:** `tests/test-admin-browser.cjs` (commit `69a184bfda798a2539e78bb7ff26541d919d7e96`), utløst av den ordinære `.github/workflows/quality-gate.yml` (commit `6bc6209c3045525fc1cd935634da964c4b6575a1`). [Quality Gate #44744143602](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44744143602). **Nytt headless Chrome-adminsteg bekreftet bestått**. Status for hele CI-løpet må kontrolleres separat før merge.

**Hvorfor:** VM-testen ovenfor verifiserer utvalgte funksjoner isolert, men ikke ekte HTML, sidevisning, DOM-events eller programstart. En uavhengig Chrome-test reduserer risikoen før videre modularisering av `app.js`.

**Hva som kjøres:** GitHub Actions starter lokal `scripts/sensor-demo.js`, åpner appens eksisterende `index.html` / `app.js` i **faktisk headless Chrome**, og erstatter bare relevante `fetch`-svar med fiktive roller og syntetiske administrator-API-data før appens JavaScript lastes. Browseren klikker den reelle Admin-navigasjonen og rolleknappene gjennom DOM, endrer et felt og utløser `change` for KI-bruksstatistikk. Ingen ekte brukerkontoer, API-nøkler, persondata, Render eller eksterne KI-kall inngår.

**Verifiserte scenarier:**
- **Bruker:** Admin-navigasjon skjules, visningen åpnes ikke og ingen administrator-API-kall startes.
- **Redaktør:** Kan åpne felles admin-/innholdsvisning, men admin-spesifikke bruker-, KI- og feedbackpaneler forblir skjult og ingen admin-API-kall startes.
- **Administrator:** Paneler og brukerdata rendres; egen rolle kan ikke velges for endring; farlig HTML i navn/rapportert svar blir vist som ufarlig tekst; faktisk knappeklikk utfører `PATCH /api/admin/users/:id/role`; både suksess og HTTP 403 gir riktig status og lagreknappen blir aktiv igjen; avkryssing for testtrafikk sender nytt `includeTests=1`-kall.

**Bevisnivå:** **Isolert Chrome-klientintegrasjon med ekte DOM og event-handlere**, ikke innlogget ende-til-ende eller reell serverautorisering. `/api/auth/me` og `/api/admin/*` er mock-et i nettleserens `fetch`, så testen kan **ikke** brukes som bevis for sikker rollerestriksjon i API-et, faktisk Supabase RLS, databasepersistens eller fysiske touch-interaksjoner. Disse må fortsatt testes selvstendig. Chrome-testen kjøres som egen **CI-jobbstepp**, ikke `npm test`, fordi lokal kjøring ellers ville kreve installert Chromium. De tidligere **44 deterministiske npm-testdelsteg** er uendret.

**Neste risiko før mer refaktorering:** autentisert API-kontroll med bruker/redaktør/admin, separat ekte Supabase RLS med fiktive kontoer og negative tilgangstester; deretter uttrekk av adminmodul i små, kontrollerte endringer.

---

## Tillegg 20.11.2026: administrasjonsklientens kjøretidstester

**Verifisert gren:** `docs/ibe160-helhetlig-revisjon-20261118` (draft-PR #12), commit `76e4e6dc65461a57aa3bf558376f45eca62c7358`. [Quality Gate #44741974062](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44741974062): **SUCCESS**, nå **44 deterministiske npm-testdelsteg**, CSS-audit, 99 Chrome-CSS-sammenligninger og produksjonsavhengighetskontroll. `main`, Render og LIVE-pilot ble ikke endret.

**Hvorfor:** Eldre UI-tester kontrollerte i vesentlig grad HTML-strenger/kildekode. Etter lesbarhetsendringen 20.11 trengte de tre administrasjonsfunksjonene konkrete atferdstester før mer modularisering.

**Hva/hvordan:** Før moduluttrekket hentet `tests/test-admin-client-runtime.cjs` den faktiske funksjonsblokken fra `app.js`. Fra og med 20.11 kjører testen direkte `src/client/admin-data.js` som en isolert factory i Node VM med injiserte fiktive administrator-/brukerroller, DOM-stubber og HTTP-responser uten nett. Testen verifiserer:

1. Klientens rollebegrensninger (vanlig bruker og redaktør), ingen admin-fetch, skjulte admin-kort.
2. Henting av brukerliste, HTML-escaping av brukerdata, deaktivert selvredigering av egen rolle, PATCH til riktig URL, credentials og JSON-body; suksess- og 403-feilsti, og at lagreknappen aktiveres igjen.
3. Rapporteringsdata med/uten vedlagt samtale, HTML-escaping, og synlig feilmelding.
4. Modellsvalg med aktiv modell og serverfeil.
5. KI-bruk med/uten testsvar, kostnadsformat, kilder, søk, siste kjøringer, escaping og feilrespons.

**Bevisnivå:** **D (isolert deterministisk runtime)**. Testen kontrollerer ekte administrasjonsfunksjoner, men **ikke** en full nettleser-DOM, Supabase Auth, RLS eller serverautorisering. Rollebegrensning i klienten er *aldri* en sikkerhetsgrense alene. Slike funn må fortsatt kontrolleres med serverens tilgangstester og framtidig innlogget nettleser-/RLS-test. VM-testen er nå uavhengig av plasseringen av funksjonene i `app.js`, men krever eksplisitt modulregistrering og injisert bruker-/DOM-/fetch-kontekst. Sammen med egen Chrome-test gir det en bedre, men fremdeles begrenset, test av klienten.

**Videreført i samme revisjon:** Egen ekte headless Chrome-test av den eksisterende admin-DOM-en med fiktive autentiseringssvar er nå lagt inn og bestått; se tillegget ovenfor. Ekte serverautorisering og Supabase RLS med syntetiske kontoer gjenstår fortsatt.

---

## Ny verifisert kvalitetssikring – 18.11.2026

**Siste komplette CI-kjøring:** [44343038247](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44343038247) på revisjonsgrenen, commit `4d78bcbc02d665c3cfa0ae68289b81370621dfc3`, **SUCCESS**: 35 automatiske deltester, dependency audit med 0 sårbarheter og 66/40 golden-opptelling (ikke en ny live modellkjøring).

- **To fiktive brukere:** `tests/test-auth-history-two-users-http.cjs` kjører selve Express-serveren mot en lokal Auth/PostgREST-simulator. Opprett/les/endre/slett, eksport, uautoriserte operasjoner og databasefeil testes. Den første røde kjøringen `44341093359` fant en misvisende HTTP 500 ved oppdatering av ukjent/andres ID; nå nøytral 404. Grønn kjøring `44341831405`. Se `docs/ai/REGRESJON-HISTORIKK-TO-BRUKERE-2026-11-18.md`. **Ekte Supabase RLS med to reelle kontoer er ikke gjennomført.**
- **Feil fra KI-provider:** `tests/test-ai-provider-errors-http.cjs` med offline fetch-stub tester 503, 429, ugyldig leverandørrespons, nettverksbrudd og personvernblokkering før KI. En rød kjøring `44342507107` avdekket et falskt personnavntreff på `Hvordan`. Det delte navnefilteret og klient-/servertestene er korrigert med spørreord pluss fortsatt positiv navnegjenkjenning. Grønn kjøring `44343038247`. Se `docs/ai/REGRESJON-KI-FEIL-OG-SPORREORD-2026-11-18.md`.
- Ingen produksjonsmerge, ingen Render-deploy, ingen endringer i LIVE-piloten og ingen lesing/endring av reelle brukerrader. `main` er fortsatt produksjonsreferanse. Alle testkonklusjonene gjelder **den isolerte revisjonsgrenen**, ikke en ny `main`-CI.

## 1. Testnivåer – bruk riktig bevis

- **S – statisk/strukturell:** kildekodesøk, schema og tekstassert. Nyttig for regresjoner; dokumenterer ikke full brukerflyt.
- **D – deterministisk kjøring:** stabile regler/datafunksjoner, test med forventet konkret resultat. Noen av disse er isolerte VM-tester, ikke hele HTTP-serveren.
- **I – integrasjon/end-to-end:** kjør faktisk app/API/database med riktig autentisering, to fiktive brukere, mislykkede kall og negative scenarioer.
- **L – live språkmodell:** stokastisk KI-respons; oppgi modell, dato, testsett, vurderingskriterium og eventuelt menneskelig review.
- **M – manuell/fysisk:** faktisk bruk av nettleser/mobil, simulert arbeidsflyt, utskrift eller brukerundersøkelse.

Å markere et krav «IMPLEMENTERT» i PRD er en **statusopplysning**, ikke automatisk «I/E2E bestått». «Mangler» nedenfor betyr at endelig bevis **ikke er dokumentert i denne kontrollen**, ikke nødvendigvis at funksjonen er ødelagt.

## 2. Kontrollpunkter per krav

| Krav | Område | Bevisnivå/status i kontrollen | Aktuelle spor (ikke nødvendigvis tilstrekkelige) | Må fortsatt kontrolleres |
|---|---|---|---|---|
| FR-01 | Demo/klientstruktur | S + E2E ikke verifisert | `app.js`; `scripts/sensor-demo.js` | Anonymisert situasjon, reset og videreføring |
| FR-02 | Tema-/benchmark-kontrakt | D + E2E ikke verifisert | `tests/test-benchmark-taxonomy.cjs`, `src/server/topic-contracts.js` | Valg av 9/48 og avvisning av utdatert tema |
| FR-03 | Råd/schema | S + historisk L | `tests/test-guidance-quality.cjs`, `tests/test-ai-golden.js` | Faktisk muntlig åpning og ugyldig API-respons |
| FR-04 | Oppfølging | S + E2E mangler | `app.js`, `server.js` | Kontekst i samme sak og reset mellom saker |
| FR-05 | Simulator | S/D + historisk L | `tests/test-simulation.js`, `tests/test-simulation-ai.js` | Rolle, kontekst, ubegrunnet diagnose/motiv |
| FR-06 | Personvern | D + API-integrasjon gjenstår | `tests/test-privacy.js`, `tests/test-server-privacy.cjs` | Blokkering på server ved direkte API-anrop |
| FR-07 | Innlogging | Uinnlogget HTTP-grense bestått; innlogget I mangler | `server.js`, `database/` | Inn/utlogging og ugyldig sesjon |
| FR-08 | Invitasjon | Kode; I mangler | `scripts/create-invite.js`, `server.js` | Utløpt/gjenbrukt token |
| FR-09 | Historikk | Uinnlogget HTTP-grense bestått, demo lagre/slett bestått; innlogget I mangler | `tests/test-history-hotfix.cjs`, `database/` | Kryssbruker-ID, RLS, slett/refresh |
| FR-10 | Rapportering | Kode; I mangler | `app.js`, `server.js` | Lagring/brukerbeskjed/tilgang |
| FR-11 | Roller | Uinnlogget admin avvist; rollebytte med reelle konti mangler | `server.js`, `database/` | User/editor/admin over API og RLS |
| FR-12 | Admin | Kode; I mangler | `app.js`, `server.js` | Uautorisert endring, persistens |
| FR-13 | Modellvalg | **TDD-HTTP statuskontrakt bestått**, reell provider I gjenstår | `server.js` | Tillatte provider/modeller og feilhåndtering |
| FR-14 | Benchmark | D / fler-modell L mangler | `tests/test-benchmark-taxonomy.cjs`, `tests/test-model-compare.js` | Reell sammenligningsrapport for minst to modeller |
| FR-15 | Automatisert KI-test | D + historisk L | `tests/test-golden-schema.cjs`, `tests/test-ai-golden.js` | 66 caser, eval-resultat/commit, manuell fasit |
| FR-15A | Negativ kildefasit | D + historisk L | `tests/test-golden-occupation-routing.cjs`, `tests/test-ai-golden.js` | Forbudte kilder regnes som kritiske |
| FR-16 | SOURCEBANK | D + faglig review utestående | `tests/test-sourcebank.cjs`, `tests/test-source-policy.cjs` | Korrekt kilde for konkret påstand |
| FR-17 | Brukertesting | M kvalitativ historisk | `docs/BRUKERTEST-PLAN.md`, `docs/BRUKERTEST-FUNN-OG-BACKLOG.md` | Lite utvalg; ikke representativt |
| FR-18 | Web-/kildeanalyse | D struktur / I mangler | `tests/test-source-retention.cjs`, `server.js` | Faktisk hentegrunnlag, feil og lagringsminimering |
| FR-19 | Neste spørsmål | S + E2E mangler | `tests/test-pilot-regression.cjs`, `app.js` | 2–4 forslag som ikke overtar fritekst |
| FR-20 | Utskrift | Kode/CSS, M mangler | `app.js`, `styles-core.css` | Print-preview hovedråd + videre råd, skjult navigasjon |
| FR-21 | Navigasjon | S/D + M kreves | `tests/test-pilot-ux.cjs`, `styles-responsive.css` | Sidebar preference, tooltips, mobil |
| FR-22 | Yrkes-/sektorkontekst | D + historisk L | `tests/test-occupation-router.cjs`, `tests/test-source-policy.cjs` | Negativ kilde, flagg og faktisk miljø |
| FR-23 | Direkte alternativ tekstinngang | **VIDERE ARBEID** | `docs/bmad/PRD.md` | Ikke godkjent produksjonsfunksjon; skilt fra tale-LIVE |
| AI-01 | Fakta/antakelser | Historisk L + M kreves | `tests/AI-GOLDEN-CASES.json`, `tests/test-ai-golden.js` | Usikkert faktagrunnlag |
| AI-02 | Diagnoser | D/S + historisk L | `tests/test-simulation.js`, `tests/AI-GOLDEN-CASES.json` | Medisinsk/psykologisk påstand uten grunnlag |
| AI-03 | Skyld/motiv | D/S + historisk L | `tests/test-guidance-quality.cjs`, `tests/AI-GOLDEN-CASES.json` | Skyld, motiv og tolkning |
| AI-04 | Juridisk/HR-usikkerhet | D + historisk L/M | `tests/test-source-policy.cjs`, `tests/AI-GOLDEN-CASES.json` | Kildeautoritet, tariff og avgrensning |
| AI-05 | Kontekstisolasjon | Kode; E2E mangler | `app.js`, `server.js` | Reset og flerbrukertilgang |
| AI-06 | Provideruavhengighet | **OpenRouter-only statusverifikasjon bestått**, full provider-I gjenstår | `server.js`, `tests/test-model-compare.js` | Responskontrakt ved providerskifte |
| NFR-01 | Sikkerhet | HTTP-grense og live RLS-metadata verifisert; konto-I mangler | `tests/test-server-privacy.cjs`, `server.js`, `database/` | RLS/IDOR, rate limit, cookies, headere |
| NFR-02 | Personvern | D + I utvides | `tests/test-privacy-surfaces.cjs`, `tests/test-server-privacy.cjs` | Oppfølging, sletting, retensjon |
| NFR-03 | Brukervennlighet | S + historisk M | `tests/test-ui-regression.cjs`, `docs/BRUKERTEST-FUNN-OG-BACKLOG.md` | Fysisk mobil, skjermleser, print |
| NFR-04 | Feilhåndtering | Kode; negativ I mangler | `server.js`, `app.js` | Timeout, JSON-feil, nettutfall, DB feil |
| NFR-05 | Vedlikeholdbarhet | Revisjonsgren CI **bestått**; siste `main`-CI feilet | `tests/test-repo-structure.cjs`, `package.json` | Main-run 43205812288 feilet ved .docs |
| NFR-QA-01 | Quality Gate | Revisjonsgren run `44336281200` **bestått**; `main`-run feilet | `.github/workflows/quality-gate.yml` | Kjør faktisk full pakke inkl audit på endelig commit |

## 3. Verifiserte dokumentfakta

- `tests/AI-GOLDEN-CASES.json` inneholder **66** caser, og `data/BENCHMARK-CASES.json` inneholder **114** (opptalt direkte fra JSON i `main`).
- Golden-bankens ni temaer har henholdsvis **3, 7, 5, 9, 11, 5, 16, 4 og 6 caser** for Alkohol/rus, Fravær, Prestasjon, Lønn, Samarbeid, Oppsigelse, Sikkerhet, Livssituasjoner og Mobbing/trakassering. Summerer til 66.
- `package.json` har **31** delkommandoer i den deterministiske `test-local`-kjeden; det betyr ikke at alle er full E2E-testing.
- `tests/AI-GOLDEN-CASES.json` har eksplisitte `requirement_refs` i case-objektene; forekomst er **ikke det samme** som testresultat eller fullstendig kravdekning.
- Historisk lokal live occupation-golden mot `gpt-5.6-luna` 09.11: **40/40 OK** rapportert i `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`; dette er egen prosjektfasit, ikke ekstern ekspertgodkjenning og ikke fersk test på endelig commit.
- Siste Quality Gate på `main`, run `43205812288` 12.11, **feilet** i `tests/test-repo-structure.cjs` på mappen `.docs`. Etterfølgende `npm audit` og strict golden-oppsummering ble **hoppet over**. Forrige run `43202363894` var grønn, men gjelder en eldre commit.

**Revisjonsgren-CI 18.11.2026:** [GitHub Actions 44336281200](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44336281200), commit `d9234879e848219f7ea0b1fe87bf3bced9572615`, **SUCCESS** – `npm ci`, alle 31 `npm test`-delsteg, produksjonsdependency-audit (**0 sårbarheter**) og oppsummering av 66 golden-caser (40 strenge: 28 sektor, 8 tariff, 4 kildelekkasje). Dette er ikke en ny live KI-test eller E2E-/RLS-godkjenning, og `main` er fortsatt uendret.

**Utvidet revisjonsgren-CI 18.11.2026:** [GitHub Actions 44338528651](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44338528651), commit `206925b5a4d8e222c8811677d045859539f98447`, **SUCCESS** med 32 deltester, `npm audit` (0 sårbarheter), golden-oversikt (66/40), ekte HTTP-avvisningstest for uinnloggede API-kall og utvidet deterministisk demoflyt. Denne kjøringen tester **ikke** to innloggede brukere, RLS i live request-kontekst, faglige live KI-råd, fysisk mobil eller utskrift.

**Read-only Supabase-sikkerhetskontroll 18.11.2026:** Live databasedefinisjoner viser RLS på alle 10 `public`-tabeller, fire eierskapsbaserte `conversations`-policyer, ingen SELECT for `anon`, og direkte `authenticated`-rettigheter kun på `conversations`. Security Advisor viser WARN om deaktivert leaked-password protection og ni INFO om policyfrie serverstyrte tabeller. Se `docs/ai/SUPABASE-SIKKERHET-2026-11-18.md`. Ingen persondata er lest eller databaseendringer utført.

**Ny regressjonskontroll 18.11.2026:** En ny HTTP-test beviste at `/api/status` ga feil status når bare OpenRouter var konfigurert: [rød CI 44339406194](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44339406194). Minimal rettelse i `server.js` ble verifisert med [grønn CI 44339569597](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44339569597), commit `561da3d4aaa5fc425e4ed991fa93c9ea6b6947ef`: **33 deterministiske deltester**, `npm audit` 0 sårbarheter. Se `docs/ai/REGRESJON-OPENROUTER-2026-11-18.md`. Testen bruker dummy-nøkler, ikke ekte KI eller DB; produksjonsgrenen er fortsatt uendret.

## 4. Viktigste åpne kvalitetsrisikoer

1. **Tilgang og RLS:** Kildestruktur/DDL og enkle assert er ikke nok til å bevise at A aldri får Bs historikk. Verifiser med to reelle testkonti mot testdatabase.
2. **Feilhåndtering:** Test med provider-timeout, nettutfall, tomt/ugyldig KI-svar, DB-feil og samtidige oppfølgingskall. Dokumenter at bruker får tydelig melding uten lekkasje.
3. **Kildeautoritet:** Positive og negative forventninger må verifiseres på modell-/kildekontrakt, ikke bare at en hvilken som helst kilde vises.
4. **KI-eval:** Egen golden-bank kan gjenspeile egen forståelse og modellevaluering; kritiske arbeidsretts-/helsepåstander bør vurderes av kompetent fagperson før bruk utenfor studentprototype.
5. **Menneskelig UX:** Mobil/PWA/utskrift og fremdrift fra råd til simulering kan ikke «godkjennes» gjennom tekstsøk alene.
6. **LIVE:** Taletranskripsjon er separat pilot og **ikke** del av denne produksjons-testdekningen.

## 5. Minimum før sluttpåstand om fullstendig bestått

Kjør full kvalitetssperre på den identifiserte **endelige** kodeversjonen, registrer GitHub Actions-run og commit, utfør nødvendige API-/RLS- og manuelle scenarioer, og bekreft at alle krav uten testbevis er merket korrekt som delvis, planlagt eller gjenstående. Oppdater deretter først `README.md` og refleksjonsrapportens endelige konklusjoner.

Se også `docs/bmad/PRD-STATUS-OG-HISTORIKK.md`, `docs/REVISJON-IBE160-2026-11-18.md` og `docs/bmad/EPICS-AND-STORIES-BMAD.md`.
