# Rolleautorisering og RLS – sikkerhetstest 20.11.2026

**Prosjekt:** Samtalestøtte / IBE160  
**Gren:** `docs/ibe160-helhetlig-revisjon-20261118` (draft-PR #12)  
**Produksjon:** Ingen merge, deploy, opprettelse av Auth-kontoer, SQL-mutasjoner eller bruk av ekte persondata.

## Formål og metode

Kontroller at serveren – ikke bare klientens skjulte admin-knapper – håndhever tilgangsroller før privilegerte handlinger. Skille mellom (1) ekte Express-kjøring med lokal, syntetisk Supabase Auth-fake, (2) skrivebeskyttet undersøkelse av faktisk Supabase-metadata, og (3) **fortsatt manglende reell RLS-test med to ekte syntetiske Auth-sesjoner**.

## 1. Kjørt serverintegrasjon: `tests/test-admin-role-http.cjs`

Testen starter den faktiske `server.js` i `NODE_ENV=production` med **kun lokal** Supabase-fake og ugyldige/dummy-nøkler. `TEST_AUTH_BYPASS=0` og `ADMIN_EMAILS` er blankt. Lokale, fiktive `/auth/v1/user`-svar representerer ordinær bruker, redaktør, admin, forfalsket admin-rolle i `user_metadata` og ugyldig rolle i `app_metadata`.

| Kontroll | Forventet serveratferd |
|---|---|
| Anonym mot 11 beskyttede admin-API-operasjoner | HTTP 401 `AUTH_REQUIRED` |
| Bruker mot samme admin-API-operasjoner | HTTP 403 `ADMIN_REQUIRED` |
| Redaktør mot samme admin-API-operasjoner | HTTP 403 `ADMIN_REQUIRED` |
| Bruker som setter `user_metadata.role=admin` | HTTP 403, rolle fortsatt `user` |
| Ugyldig `app_metadata.role=superadmin` | HTTP 403, rolle faller til `user` |
| Redaktør med ugyldig payload til innholdsredigering | HTTP 400 `INVALID_CONTENT` etter korrekt redaktør-autorisasjon |
| Uautorisert innholdsredigering | HTTP 401/403 |
| Administrator: `/api/auth/diagnostic`, brukeroversikt | HTTP 200 |
| Administrator forsøker å endre egen rolle | HTTP 400 `SELF_ROLE_CHANGE` |
| Administrator sender ugyldig rolle | HTTP 400 `INVALID_ROLE` |
| Administrator endrer ukjent bruker-ID | HTTP 404 `USER_NOT_FOUND` |
| Administrator endrer annen fiktiv bruker til redaktør | HTTP 200, `app_metadata.role` endres, øvrig metadata beholdes |

Dette gir **55 uautoriserte administratorforespørsler** (5 aktørklasser × 11 operasjoner), i tillegg til positive/negative rolleendringstester og innholdsredigering. Status og API-responser sjekkes på den ekte Express-serveren. Den lokale Auth-faken er **ikke** en faktisk Supabase Auth-tjeneste; den simulerer identitet og admin-operasjoner.

**Spesialtilfelle funnet under testen:** Serverens eksisterende `cleanupExpiredData()` utfører en planlagt, tjenestekontoautorisert retention-opprydding (`DELETE`/`PATCH` på logg-/feedback-/survey-tabeller) ved første API-forespørsel etter 12-timersgrensen. Disse **seks** lokale mock-kallene må ikke forveksles med et uautorisert admin-endepunkt. Testen verifiserer i stedet at de avviste forespørslene ikke når `auth.admin`, og at ingen databasehandlinger utenfor den kjente retention-matrisen utføres. Ingen ekte database ble kontaktet.

## 2. Supabase-prosjektet: skrivebeskyttet kontroll

**Kontrollert 20.11.2026:** Den tilknyttede Supabase-kontoen viser ett aktivt prosjekt kalt Samtalestotte, **ingen utviklingsgrener**. Derfor ble det ikke opprettet testkontoer eller satt inn testdata i dette prosjektet.

Skrivebeskyttede SQL-kontroller av `pg_class`, `pg_policies` og `information_schema.role_table_grants` viste:

- **10/10** `public`-tabeller har RLS aktivert.
- `public.conversations` har fire eierskapspolicyer for `SELECT`, `INSERT`, `UPDATE` og `DELETE` som bruker `auth.uid() = user_id`. `UPDATE` har både `USING` og `WITH CHECK`; `INSERT` har `WITH CHECK`.
- De øvrige ni tabellene har RLS aktivert uten policyer. Synlige `SELECT/INSERT/UPDATE/DELETE`-grant-er i kontrollen var begrenset til `service_role`; ingen slike grant-er til `anon` eller `authenticated` ble vist for disse ni tabellene. Dette stemmer med serverstyrte interne tabeller, men gir **ikke** bevis for riktig serverrollebruk i alle ruter.
- `conversations` hadde **TRUNCATE/ TRIGGER-grant-er** til både `anon` og `authenticated`. `TRUNCATE` reguleres ikke av RLS. PostgREST eksponerer normalt ikke `TRUNCATE` som vanlig rad-API; dette er derfor et **minsteprivilegium-funn for gjennomgang**, ikke en demonstrert ekstern utnyttelse. Bør vurderes for eksplisitt `REVOKE TRUNCATE, TRIGGER` etter separat test og avhengighetsgjennomgang – **ingen grant ble endret**.
- Supabase Security Advisor gir varsel `auth_leaked_password_protection`: lekket-passord-beskyttelse er av. Vurder aktivering og eventuelle lisens-/innloggingskonsekvenser før bredere distribusjon. [Supabase-veiledning](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
- Ni `rls_enabled_no_policy`-informasjonstreff gjelder tabeller som i gjeldende kontroll ikke hadde vanlig `anon`/`authenticated`-CRUD-tilgang; treffene er ikke alene dokumentasjon på dataeksponering. [Supabase Advisor](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

## 3. Reell RLS-akseptansetest som gjenstår

**Blokker:** Ikke kjør på det eneste tilknyttede Supabase-prosjektet. Et separat testprosjekt/-gren må etableres og kontrolleres før noen syntetiske kontoer opprettes, særlig fordi det finnes ekte brukerdata i den eksisterende løsningen.

I isolert Supabase-testmiljø bør to autentiserte, fiktive kontoer A og B opprette hver sin samtale. Verifiser direkte gjennom PostgREST med **hver kontos vanlige tilgangstoken** (ikke `service_role`) at:

1. A og B kan `SELECT`, `UPDATE` og `DELETE` egne rader.
2. A ikke kan lese, endre eller slette Bs rad, og motsatt.
3. `INSERT` og `UPDATE` som forsøker å sette `user_id` til den andre kontoen, blir avvist.
4. Anonym bruker ikke har tilgang til samtalene.
5. Forespørsler mot de ni interne tabellene avvises som `anon` og `authenticated`.
6. Virkelige serverruter i dette testmiljøet respekterer rolle og eierskap også etter tokenutløp/rolleendring.

Dokumenter statuskoder, databaseeffekt, testdato og opprydding av **kun syntetiske** rader. Testen er **ikke gjennomført** per dette notatet.

## 4. Begrensning og beslutning

- **Bestått på lokal fake:** Backendrollegrenser og positive/negative administrator-HTTP-caser, dersom tilhørende Quality Gate er grønn.
- **Verifisert skrivebeskyttet:** RLS-policymetadata og grant-oversikt i eksisterende Supabase.
- **Ikke dokumentert:** Ekte tobruker-RLS, reell Supabase Auth mot server, fullt rollebytte med ekte sesjonsfornyelse, fysisk brukerreise.
- **Beslutning:** Fortsett på revisjonsgrenen, men ingen prod-merge, databaseendring eller påstand om komplett sikkerhet uten eget testmiljø og faglig/teknisk akseptanse.

Relatert: `tests/test-admin-client-runtime.cjs`, `tests/test-admin-browser.cjs`, `tests/test-auth-history-two-users-http.cjs`, `docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md`.
