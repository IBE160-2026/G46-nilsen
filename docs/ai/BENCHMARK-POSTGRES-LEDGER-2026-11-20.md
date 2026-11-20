# Forslag: varig PostgreSQL-regnskap for betalt benchmark

**Dato:** 20. november 2026  
**Prosjekt:** Samtalestøtte / IBE160  
**Status:** Grønn i disponibel PostgreSQL 17 i CI, **ikke deployet til Supabase** og **ikke integrert i produksjon**. Del av draft [PR #12](https://github.com/IBE160-2026/G46-nilsen/pull/12).

## Oppfølging: Express/Supabase RPC-test og korrigert SQL-radopprettelse

`src/server/benchmark-budget-rpc.js` kaller nå de to regnskapsfunksjonene fra **serverens** `supabaseAdmin.rpc`, men **kun i eksplisitt lokal testmodus**. Den ordinære produksjonsserveren er fortsatt sperret for betalt benchmark. I CI er den faktiske Express-/Supabase JS SDK-HTTP-testen koblet via lokal PostgREST-protokollbro til **den samme disponible PostgreSQL 17** som SQL-regresjonene kjører mot. Dette er ikke ekte Supabase PostgREST/Auth; KI er simulert. Se [egen fullkjede-rapport](BENCHMARK-RPC-INTEGRASJON-2026-11-20.md).

**Kritisk feil funnet i første fullkjede-kjøring:** En `BUDGET_RUN_BUSY`-avvisning opprettet en tom `budget_runs`-rad før funksjonen returnerte. Det er rettet ved å utsette INSERT til alle opptatt-/duplikat-/budsjettkontrollene har bestått. `tests/sql/benchmark-budget-postgres.sql` krever nå at en slik avvisning **ikke etterlater en kjøre-ID-rad**. Det er fortsatt ikke utført SQL på ekte Supabase-prosjekt.

---

## Avgrensning og motivasjon

Forrige trinn demonstrerte at et synkront Node-minneregister kan låse parallelle HTTP-kall i **én** serverprosess og ignorere klientens `spentSoFar`. Det er utilstrekkelig ved serveromstart, flere Render-instanser og uavklarte KI-kall etter krasj. Derfor er det laget et eget, **foreløpig gjennomgåbart SQL-forslag**:

- `database/security/benchmark-budget-postgres-proposal.sql` – **ikke** en automatisk eller gjennomført produksjonsmigrasjon.
- `tests/sql/benchmark-budget-postgres.sql` – konto-/RLS-/tilgangs-, idempotens-, reserve-/oppgjør- og overforbrukstest.
- `tests/sql/benchmark-budget-concurrency.sh` – to **reelle, uavhengige** PostgreSQL-sesjoner i konkurranse.
- `tests/sql/benchmark-budget-postgres-restart.sql` – ny databasesesjon etter faktisk restart, uoppgjort reservasjon, manuell avklaring og dagsgrense.
- `.github/workflows/quality-gate.yml` – bruker den **engangsbaserte PostgreSQL 17-tjenesten i GitHub Actions**. Det er ingen nettverkstilkobling mot produksjonsdatabasen.

## Datamodell

Alle regnskapstabeller ligger i skjemaet `benchmark_private`, som **ikke skal eksponeres i Supabase Data API**.

| Objekt | Formål | Viktige begrensninger |
|---|---|---|
| `budget_owners` | Én rad og felles radlås per bruker | Primærnøkkel `user_id`; serialiserer reserve og oppgjør på tvers av forbindelser |
| `budget_days` | Varig gebyr-/reservasjonssum per bruker per UTC-dag | Primærnøkkel `(user_id,budget_day)`; 500 cent forhåndsgrense |
| `budget_runs` | Varig fast kjørebudsjett | `(user_id,run_id)` er unik; 10–500 cent, samme dag og tak kan ikke endres ved gjenbruk |
| `budget_attempts` | Hver KI-forsøksreservasjon og dens oppgjør | Egen UUID-`ticket`, unik `(user_id,run_id,case_id,model)`, status, opprettet og oppgjort-tidspunkt; ingen samtaletekst lagres |

En reservasjon starter med **10 cent** for det aktuelle forsøket. Alt lagres i én PostgreSQL-transaksjon; ingen providerforespørsel skal sendes før transaksjonen er commit-et. Serverens senere adapter må bruke returverdien `ok:true` og den servergenererte `ticket`, og aldri bruke `spentSoFar` fra nettleseren.

`public.benchmark_budget_reserve(uuid,uuid,text,text,integer)` er et **SECURITY INVOKER**-RPC: En verifisert server gir bruker-ID, kjøre-ID, case, modell og run-budsjett **i hele cent**. PostgreSQL låser brukerraden, kontrollerer duplikater, eventuelt uavklart kall, løps- og dagsgrense og oppretter reservasjonen atomisk. Det returneres enten en servergenerert `ticket` og nye totaler, eller en eksplisitt feilkode: `INVALID_BENCHMARK_BUDGET`, `BUDGET_RUN_MISMATCH`, `BUDGET_DUPLICATE_CASE`, `BUDGET_RUN_BUSY` eller `BUDGET_LIMIT`.

`public.benchmark_budget_settle(uuid,uuid,bigint,text)` oppdaterer reserved status til `success`, `failed` eller `uncertain`. Dersom providerens **beregnede** kostnad er høyere enn 10 cent, belastes differansen fullt; lavere eller ukjent kostnad **refunderes ikke automatisk**. Gjentatt oppgjør er idempotent (allerede registrert oppgjør belastes ikke igjen). En annen brukers ticket gir `UNKNOWN_BENCHMARK_TICKET`.

**Krasjsikker håndtering:** Et forsøk som er `reserved` når serveren/forbindelsen bryter sammen, forblir `reserved` også etter omstart og blokkerer nye forsøk for denne brukeren – inkludert over UTC-døgn. Bare eksplisitt server-/driftsstyrt oppgjør etter undersøkelse av KI-leverandørloggen kan markere det `uncertain` eller `failed`; det blir fortsatt belastet med minst reservasjonen. **Ikke** innfør automatisk TTL-frigjøring som kan føre til dobbelbetaling.

## Tilgangsmodell

- **Ingen `SECURITY DEFINER`-funksjoner.** Funksjonene er `SECURITY INVOKER`, med fast `search_path` og fullt kvalifiserte private tabeller.
- `benchmark_private` har ingen `USAGE` eller tabellgrants til `PUBLIC`, `anon` eller `authenticated`. RLS er aktivert på alle fire tabellene; bare `service_role` har policy og nødvendige SQL-grants.
- PostgreSQL gir normalt `EXECUTE` til `PUBLIC` på nyopprettede funksjoner. Begge RPC-er har derfor eksplisitt `REVOKE ... FROM PUBLIC, anon, authenticated` og `GRANT EXECUTE ... TO service_role` i **samme transaksjon**. Testene prøver både ACL og faktisk nektet kjøring med syntetiske klientroller.
- RPC-ene ligger i `public` kun for et senere **tjenestesidekall** via Supabase PostgREST. Ingen tilgang eller tjenestenøkkel skal inn i frontend. Bruker-ID må komme fra **verifisert serverøkt**, ikke fra klientpayload. `benchmark_private` skal forbli et **ikke-eksponert** skjema.
- Før eventuell anvendelse mot Supabase må direkte databasetilgang, Supabase API-eksponering, rollearv, default-grants og sikkerhetsrådgiver gjennomgås i **separat** testprosjekt.

## Testbevis

Isolert PostgreSQL 17 i GitHub Actions bruker den faktiske SQL-filen, ikke en omskrevet falsk implementasjon. Verifisert:

1. Gjentatt kjøring av SQL-forslaget skader ikke eksisterende tilstander eller tilgangsoppsett.
2. `anon` og `authenticated` får ikke åpnet private tabeller eller kalt RPC; `service_role` har avgrensede rettigheter.
3. Eierbasert serialisering av to separate PostgreSQL-forbindelser gir **én** godkjent reservasjon og **én** `BUDGET_RUN_BUSY`, ikke dobbelt reservering.
4. Riktig bokføring av høyere providerestimat, idempotent oppgjør, avvisning av andres ticket, låst budsjett og duplikatcase.
5. En faktisk Docker/PostgreSQL-omstart lar uavklarte ticket og reservasjonsbeløp bli stående; eksplisitt `uncertain`-oppgjør gjør det mulig å fortsette uten å slette original forsøkslogg.
6. 50 syntetiske forsøk × 10 cent forbruker dagskvoten på 500 cent; nytt kjøre-ID omgår ikke kvoten.
7. De eksisterende RLS-testene for samtalehistorikk og anonym tilgang kjører i samme isolerte jobb uten regressjon.

**Uavklarte forhold:** Disse testene beviser **atomisk DB-regnskap**, ikke at den eksisterende Express-ruten bruker det. Express bruker fortsatt en *minnebasert* budsjettmodul **bare i lokal testmodus**, og betalt benchmark/pilot/fulltest er fortsatt blokkert i produksjon. Det er ikke testet ekte Supabase Auth/PostgREST, kostnadsoppgjør hos leverandør eller flere faktiske Render-instanser.

## Før eventuell produksjonsintegrasjon

1. Utfør separat schema-/security-review og anvend *først* SQL som en sporbar migrasjon i et dedikert Supabase-testmiljø, aldri som en skjult endring i live-prosjektet.
2. Lag et separat, server-only Supabase RPC-adapterlag med streng inputvalidasjon, rollekrav, logging av ticket og test av dataformat/centregning. Ikke send KI-kall hvis reserveringen feiler eller er ukjent.
3. Behold det permanente krasj-/forsøksregisteret; legg til sporbar manuell avklaring, alarmsystem for `reserved` og autentisert administrasjon av avvik.
4. Begrens **faktiske** providerkostnader (modell, pris, maks output-tokens, weboppslag, antall forsøk, timeouts og retries). 10 cent reservasjon er **ikke** et garantert maksimum for en leverandørforespørsel; et høyt estimat kan føre til overforbruk selv om SQL-regnskapet fungerer perfekt.
5. Test service_role-RPC, parallelle Express-instanser, leverandørfeil, krasj og rate-limits mot fiktive data. Fortsett å sperre ekte betalt kjøring til både database- og providerkostsikring er godkjent.

**Endringskontroll:** Dette SQL-forslaget er med vilje under `database/security/`, ikke aktiv migrasjonskatalog, og er ikke anvendt på brukerens Supabase-prosjekt, `main`, Render eller LIVE-piloten.

**Supabase-grunnlag:** [Database functions – invoker og RPC-rettigheter](https://supabase.com/docs/guides/database/functions), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Securing your API](https://supabase.com/docs/guides/api/securing-your-api).
