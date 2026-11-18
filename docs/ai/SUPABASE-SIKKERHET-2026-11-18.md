# Supabase – kontroll av faktisk tilgang og RLS (18.11.2026)

**Prosjekt:** Samtalestøtte, Supabase (primær databasetjeneste).  
**Kilde:** To **skrivebeskyttede metadataforespørsler** via Supabase (pg_catalog, pg_policies, has_table_privilege), samt prosjektets Security Advisor. **Ingen person- eller samtalerader ble lest, ingen SQL-migrasjon kjørt og ingen databaseinnstilling endret.**  
**Tilknyttet krav:** FR-07, FR-09, FR-11, FR-12, NFR-01, NFR-02, NFR-QA-01.

## Faktiske metadatafunn

- Samtlige **10** tabeller i `public` har `relrowsecurity = true` (RLS aktivert).
- `public.conversations` har **fire** aktive RLS-policyer rettet mot `authenticated` (SELECT, INSERT, UPDATE og DELETE).
- Hver policy for lesing, endring og sletting bruker `(select auth.uid()) = user_id`. INSERT og UPDATE bruker eksplisitt `WITH CHECK` på samme eierskapskriterium.
- Rollen `anon` mangler SELECT på alle de ti tabellene.
- Rollen `authenticated` har SELECT/INSERT/UPDATE/DELETE på **conversations**, og **ingen** av disse tabellrettighetene på de øvrige ni tabellene.
- De ni øvrige tabellene har RLS, men ingen policies; Security Advisor viser `rls_enabled_no_policy` med nivå **INFO** (9 tilfeller). I denne serverstyrte arkitekturen er dette forenlig med hensikten om at sensitive administrative tabeller bare skal håndteres via hemmelig servernøkkel. At Supabase har en INFO-lint betyr ikke alene en sikkerhetssårbarhet. De faktiske grants styrker dette bildet.

| Tabell(er) | RLS | Direkte `authenticated`-tabellrettigheter | Funn |
|---|---|---|---|
| `conversations` | PÅ | SELECT/INSERT/UPDATE/DELETE | Fire eierskapsbegrensede policies; korrekt syntaks i live database |
| `ai_response_feedback`, `ai_usage_log`, `app_settings`, `benchmark_results`, `content_overrides`, `invites`, `privacy_acknowledgements`, `survey_participation`, `survey_responses` | PÅ | Ingen | Server-/service_role-tilgang; ingen åpne direkte brukerpolicyer |

## Varsel fra Supabase Security Advisor

**`auth_leaked_password_protection` – WARN:** Supabases kontroll mot kjente kompromitterte passord er **deaktivert**. Dette er et reelt forbedringspunkt før bredere bruk. Se [Supabase: Password Security og leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Ingen endring er gjort i Auth-innstillingene.

**`rls_enabled_no_policy` – INFO:** [Supabase Database Linter – 0008](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). Med de observerte tabellgrantene og serverarkitekturen vurderes dette som tilsiktet; endringer skal **ikke** gjøres ukritisk bare for å fjerne en informasjonsmelding.

## Hva kontrollen kan – og ikke kan – dokumentere

**Kan dokumentere:** faktisk RLS-aktivering, synlige policyd definisjoner, Postgres-tabellrettigheter for `anon` og `authenticated`, og aktuelle advisor-varsler i den tilknyttede databasen per kontrolltidspunktet.

**Kan ikke dokumentere:** at alle auth-sesjoner er korrekt revokert, at konkrete brukere er isolert gjennom hele HTTP-flyten, at serveren aldri bruker service_role på feil sted, at invitasjons-/adminflyten fungerer under konkurranse, eller at RLS-policyene fungerer riktig med to innloggede testbrukere. Slike scenarioer krever egne sikre integrasjonstester med fiktive konti i **separat testmiljø**.

**Serverkode gjennomgått:** `server.js` `resolveSession` validerer access-token via Supabase Auth, setter `req.supabase` til klient med brukerens token; historikk-endepunktene bruker denne klienten, ikke `supabaseAdmin`. Auth-/adminendepunkter har tilgangsvakter. Dette er kodeanalyse, ikke bevist oppførsel for to reelle konti.

## Sikker implementasjonsregel

Secret/service_role-nøkkel skal aldri eksponeres i nettleser eller sendes til klient. Ved testing med faktiske brukeridentiteter skal det brukes egne fiktive konti og et isolert prosjekt, **ikke tilfeldige uttrekk fra brukerdatabasen**. Ikke endre Auth-konfigurasjon i produksjon uten egen sikkerhetsvurdering og eksplisitt beslutning.

## Kobling til øvrige tester

- [HTTP-grensetest](../../tests/test-api-boundary-http.cjs) starter den faktiske Express-serveren med **kunstige, lokale** Supabase-verdier. Den sjekker 22 uinnloggede API-kall, 3 ugyldige Origin og 5 private filer. Den bruker **ikke** ekte Supabase eller persondata.
- [Testbevisregisteret](TESTBEVIS-OG-DEKNING-2026-11-18.md) beholder autentisert E2E med to brukere som åpent punkt.
- [Helhetlig revisjon](../REVISJON-IBE160-2026-11-18.md) samler CI-, dokumentasjons- og sikkerhetsstatus.
