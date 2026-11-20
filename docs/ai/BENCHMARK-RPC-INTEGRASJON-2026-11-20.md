# Benchmark: server-only RPC-adapter med ekte PostgreSQL i isolert test

**Dato:** 20. november 2026  
**PR:** [Draft PR #12](https://github.com/IBE160-2026/G46-nilsen/pull/12) – bare revisjonsgren  
**Status:** Automatisk testet på lokal HTTP-simulator og disponibel PostgreSQL 17. **Ingen endringer i live Supabase, Render, main eller LIVE-pilot. Ingen betalte KI-kall.**

## Hva er faktisk koblet sammen?

I dette trinnet er `src/server/benchmark-budget-rpc.js` implementert som en **server-only Supabase RPC-adapter**. Den kaller de tidligere isolert testede PostgreSQL-funksjonene `benchmark_budget_reserve` og `benchmark_budget_settle` med `supabaseAdmin.rpc(...)`. Den har injisert RPC-grensesnitt og testes både uten nettverk og gjennom den faktiske SDK-en. **Frontend har ingen tjenestenøkkel eller direkte RPC-tilgang.**

`server.js` velger denne adapteren **bare** når samtlige testvilkår er oppfylt: `NODE_ENV=test`, `TEST_BENCHMARK_LIVE=1`, `TEST_BENCHMARK_LEDGER=rpc`, en eksplisitt test-provider-port **og lokal loopback-Supabase-adresse**. Ved slike tester tvinges både OpenAI- og OpenRouter-klienten til lokalt fake-provider-endepunkt. Manglende vilkår gir ingen aktivering av betalt benchmark; produksjon returnerer fortsatt `BENCHMARK_PAID_DISABLED`. Normal app-trafikk påvirkes ikke.

**Rekkefølge ved godkjent fiktivt testkall:**

1. `requireAdmin` bekrefter innlogget administrator, og serveren velger en validert test-case/modell.
2. Adapteren verifiserer UUID-er, budsjettdesimaler og faste feltgrenser, omregner til **hele cent** og sender `benchmark_budget_reserve` via serverens service-klient. Klientrapportert `spentSoFar` brukes aldri.
3. Først etter positiv, servergenerert `ticket` og bekreftet transaksjon kalles den lokale KI-simulatoren. Enhver uklar / feilet reserve-RPC gir **503 uten KI-kall**.
4. Resultatet lagres i lokal simulert PostgREST. Selve KI-kallet kan koste penger ved en fremtidig produksjonssetting selv om resultatlagring feiler, så oppgjør kreves uansett.
5. Serveren kaller `benchmark_budget_settle` med samme verifiserte bruker-ID og `ticket`. Providerestimat over reserven belastes; ukjent kostnad forblir minst 10 cent. Ved feil fra provider benyttes `failed`, ved vellykket provider men mislykket resultatlagring `uncertain`, ved full suksess `success`.
6. **Først etter bekreftet oppgjør returneres en eventuell 200-suksess**. Hvis oppgjøret ikke kan bekreftes, returnerer serveren `503 BENCHMARK_SETTLEMENT_UNCONFIRMED`, og den uavklarte databasereservasjonen blokkerer videre testtrafikk til eksplisitt avklaring.

Den tidligere minnebaserte budsjettprototypen brukes fortsatt i ordinær isolert HTTP-testmodus for å bevare tidligere regresjonstest; **ingen** av ledgerne aktiverer ekte betalt benchmark i produksjon.

## Isolert testbevis

| Test | Reell komponent | Simulert/ikke inkludert |
|---|---|---|
| `tests/test-benchmark-budget-rpc.cjs` | Den faktiske adapteren, UUID-/centregler, svarvalidering og feilgrenser | Selve RPC-resultatene er injiserte objekter |
| `tests/test-benchmark-rpc-http.cjs` i ordinær npm-test | Faktisk Express, Supabase JS RPC-serialisering, OpenAI SDK og HTTP-flyt | Lokal HTTP-fake erstatter Supabase/PostgREST og KI-provider; JS-registrering av reservasjoner |
| `tests/test-benchmark-rpc-http.cjs` i engangs-PostgreSQL-jobb | **Faktisk Express, Supabase JS RPC, lokal PostgREST-formatbro og ekte PostgreSQL 17 / SQL-funksjoner** med fiktive data | HTTP-serveren foran PostgreSQL er en simulert PostgREST-bro, **ikke** en virkelig Supabase PostgREST-instans; KI-provider og Auth er fiktive |
| `tests/sql/benchmark-budget-postgres.sql` | Faktisk RPC-SQL med privatrettigheter, låser, idempotens og oppgjør | Ingen ekte Supabase-brukere |
| `tests/sql/benchmark-budget-concurrency.sh` og `tests/sql/benchmark-budget-postgres-restart.sql` | Uavhengige sesjoner, omstart og persistent uavklart ticket | Ikke flere faktiske Render-instanser |

CI bruker `BENCHMARK_PG_CONTAINER` med GitHub Actions sin disponible PostgreSQL-tjeneste. Den lokale RPC-broen overfører kun fiktive testparametere som base64-kodet JSON til `docker exec psql` med `SET ROLE service_role`; ingen ekte Supabase-data, legitimasjoner, produksjonsdatabase eller eksternt nettverk brukes. Dette beviser at den faktiske SQL-funksjonens respons er kompatibel med serverens RPC-adapter, **ikke** at autentisering, PostgREST-eksponering eller rettigheter i det virkelige Supabase-prosjektet er verifisert.

### Feil funnet under faktisk fullkjede-test

Den første gjennomkjøringen avdekket at SQL-reserveringen opprettet en ny `budget_runs`-rad **før** den returnerte `BUDGET_RUN_BUSY`. Fordi en `RETURN` i en PL/pgSQL-funksjon ikke automatisk ruller tilbake tidligere SQL i samme transaksjon, ble en avvist kjøre-ID låst til et budsjett selv om ingen ticket/provider-kall fantes. Dette ga senere `BUDGET_RUN_MISMATCH` istedenfor forventet `BUDGET_RUN_BUSY`.

**Rettelse:** `database/security/benchmark-budget-postgres-proposal.sql` leser først en eksisterende run-rad, men **oppretter en ny run først etter at alle busy-/duplikat-/budsjettkontroller har bestått**. `tests/sql/benchmark-budget-postgres.sql` krever nå at en avvist forespørsel mot en ny kjøre-ID **ikke oppretter en spøkelseskjøring**. Dette SQL-forslaget er fortsatt ikke deployet.

## Sikkerhetsgrenser og gjeld

- **Fortsett sperring av betalte tester i produksjon.** Et transaksjonelt regnskap garanterer ikke at en fremtidig leverandørforespørsel koster mindre enn forhåndsreservasjonen på USD 0,10.
- En ekte Supabase/PostgREST-akseptansetest i separat prosjekt må kontrollere `service_role`-rettigheter, eksponering av `public`-RPC, private skjema, `anon`/`authenticated`-nekt, utløpte sesjoner og auth-medlemskap.
- Drift trenger varsel og sikkert manuelt oppgjør av vedvarende `reserved`-tickets; ukjent providerkostnad må ikke automatisk refunderes. For mange hengende tickets må ha en operativ prosedyre.
- En senere fullstendig produksjonsmodell trenger kostnadsestimater som tar høyde for weboppslag, output-tokens, modellvalg, retries, flere tjenesteinstanser, leverandørpriser og fakturakontroll.
- Privatliv/oppbevaring må gjennomgås for regnskapstabellene som inneholder bruker-ID, case-ID, modell og tidsstempler (men ikke prompt eller samtaletekst). En plan for dataminimering og retensjon må fastsettes før lagring av ekte brukerdetaljer.
- Feil i `benchmark_results` kan gi at AI-kostnaden er bokført, mens selve resultatet mangler. Dette er tilsiktet konservativt, og krever synlig administrativ avvikshåndtering før betalt kjøring.

## Beslutning

**Klar for videre isolert revisjon, ikke produksjon.** Begge atskilte nivåer – privat SQL-transaksjon og Supabase JS RPC/Express-protokoll – er nå koblet sammen i engangs-CI med lokal PostgREST-protokollbro, og testsuiten viser eksakt hva som er simulert. Den siste kvalitetsporten på aktuell PR-commit skal brukes som endelig bevis. Neste prioritet er ekte PostgREST/Supabase i isolert testprosjekt og dokumentert reell providerkostgrense. Ingen SQL har blitt anvendt på brukerens Supabase.

**Referanser:** [Supabase Database Functions](https://supabase.com/docs/guides/database/functions), [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [PostgREST RPC](https://postgrest.org/en/stable/references/api/functions.html).
