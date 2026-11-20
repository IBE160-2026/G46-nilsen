# Reell lokal Supabase Auth/PostgREST-akseptanse – historikk og tilgang

**Dato:** 20. november 2026  
**Status:** Verifisert **kun på isolert revisjonsgren** / draft PR #12  
**Gjennomført test:** [GitHub Quality Gate #44788004299](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44788004299) – tre separate CI-jobber bestått på commit `102b3d4160e6d4162c51d1d9c30e9b6c89598327`.

## Problem vi ønsket å løse

De tidligere testene verifiserte Express mot en **håndskrevet fake Auth/PostgREST** og verifiserte V20-8 RLS-politikkene direkte i **ekte, men separat PostgreSQL** med simulerte JWT-claims. Dette var solide delbevis, men viste ikke at *faktiske* tokens utstedt av Supabase Auth ble sendt videre av Express og forstått av *faktiske* PostgREST-policyer.

Dette trinnet kjører **den ekte lokale Supabase-utviklingsstacken** (GoTrue Auth, PostgREST, PostgreSQL og API-gateway) via en fastlåst CLI v2.122.1 i **en ny, disponibel GitHub Actions-instans**. En separat testjobb krever verken Supabase-pålogging, tilgangsnøkler til skyprosjekt, Render, live KI, eksterne e-postforsendelser eller ekte brukerdata.

## Testartefakter og isolasjon

- `.github/workflows/quality-gate.yml`: egen obligatorisk `supabase-auth-local`-jobb, `supabase/setup-cli@v3` fastlåst til CLI **2.122.1** og kun lokal `supabase init`/`supabase start`. Overflødige tjenester startes ikke. Testmiljøet fjernes med `supabase stop --no-backup`, også etter feil.
- `tests/sql/local-supabase-auth-fixture.sql`: oppretter lokale, minimaliserte testtabeller – inklusive `public.conversations` med ekte FK mot `auth.users` – uten å opprette, erstatte eller simulere `auth.uid()`, JWT-roller eller Supabase-systemtabeller.
- **Faktisk og uendret** `database/migrations/V20-8-SUPABASE-MIGRATION.sql` anvendes i lokal PostgreSQL. Den definerer eksplisitte eierbaserte RLS-policyer for SELECT/INSERT/UPDATE/DELETE. PostgREST får skjemacachen oppdatert med `NOTIFY pgrst, 'reload schema';`.
- `tests/test-supabase-local-auth-e2e.cjs`: avviser kjøring med mindre `SUPABASE_AUTH_LOCAL_CI=1` **og Supabase-API-adressen er HTTP på `127.0.0.1`**. DB-forberedelsen i CI avviser også URL-er uten loopback. Ingen lenking til et Supabase-skyprosjekt eller produksjonsnøkler.
- Lokal service-role nøkkel og anon-nøkkel hentes kun fra **den disponibel** `supabase status -o env` og skjules i CI-loggen. Fiktive brukere opprettes med GoTrue Admin API og fjernes etter testen. Alle testcontainere slettes.

## Testen som faktisk er bestått

**Tre fiktive, men virkelig registrerte lokale GoTrue-brukere:** Alice, Bob og en administrator.

| Testhandling | Reell tjeneste | Verifisert utfall |
|---|---|---|
| Opprette tre bekreftede testkontoer | Lokal GoTrue Admin API | Tre forskjellige faktiske bruker-ID-er |
| Logge inn via `POST /api/auth/login` | Faktisk Express + lokal GoTrue `signInWithPassword` | HTTP 200, riktig identitet, `HttpOnly`/`SameSite=Lax`-sesjonskapsler |
| Sjekke `/api/auth/me` | GoTrue `getUser(accessToken)` | Riktig bruker for hver separat session |
| Forsøke privilegieeskalering via `user_metadata.role=admin` | Faktisk JWT/rollemodell | Forblir `user`; admin-endepunkt gir 403 |
| Bruker med **`app_metadata.role=admin`** | GoTrue + Express | Samme admin-endepunkt gir 200 |
| Lagre A og B samtaler | Express + Supabase JS + PostgREST + PostgreSQL RLS | Begge får hver sin historikkrad |
| Lese historikk, bytte bruker | PostgREST + eierpolicyer | Hver ser bare sin egen rad |
| B forsøker å slette/oppdatere A via Express | Faktisk RLS gjennom PostgREST | Begge avvises nøytralt som 404 |
| Direkte PostgREST som B med ekte access-token | Faktisk JWT og RLS | SELECT/DELETE på As rad returnerer null rader |
| B forsøker å overta egen rad / legge inn rad eid av A | Faktisk RLS `WITH CHECK` | PostgreSQL/PostgREST avviser begge |
| Anonym lesing direkte gjennom PostgREST | Faktisk `anon`/RLS/GRANT | Nektet |
| Manglende eller falsk access+refresh | Express og GoTrue | HTTP 401 |
| Gyldig refresh-token med ugyldig access-token | Faktisk GoTrue tokenfornyelse i Express | Ny verifisert sesjon, historikk fortsatt lesbar |
| Kontoeksport via Express | PostgREST (for historikk) | Eksport inneholder bare eierens samtale |
| A sletter egen samtale | Faktisk RLS | A blir tom; Bs historikk beholdes |

CI-bevis: `Real LOCAL Supabase acceptance: GoTrue password login + refresh, role metadata, PostgREST RLS, Express own CRUD, cross-user 404, direct forgery rejection, anonymous denial, export and deletion: PASS`. Testen bekrefter `hosted project calls = 0`.

**Praktisk feil i første testutkast:** Express representerer historikk-ID som tekst (`"1"`) mens PostgREST/Supabase JS kan returnere bigint-ID som tall (`1`). Første CI-kjøring ble korrekt rød på en streng datatypeassert i testen. Kontrollen er rettet til lik numerisk ID uten å svekke kryssbruker-eierskapskontrollene. Den eksisterende admin-Chrome-testen fikk også en eksplisitt ventebetingelse for asynkron rollegating, etter at en tidligere kjøring traff et timingløp. Begge er grønne i den påfølgende samlede CI-kjøringen.

## Nøyaktig bevisnivå / hva som fortsatt ikke er godkjent

**Dette er ekte lokal Supabase Auth og ekte lokal PostgREST**, ikke en simulert gateway. Det er likevel **ikke** en verifikasjon av skyprosjektets konfigurasjon, produksjonsbrukere eller databasepolicyer som faktisk er installert der.

Åpent før eventuell produksjonsgodkjenning:

- Test mot et *separat hosted staging-prosjekt*, eller dokumentert driftskontroll som beviser at produksjonsmigrasjoner, ACL/grants, PostgREST schema exposure og Auth-innstillinger samsvarer med det reviderte grunnlaget. **Ikke** test med faktiske ansattopplysninger.
- Endringskontroll av invitasjon/registrering, utløpt/brukt invitasjonskode, passordreset, logout/session-revocation, misbruk av refresh-token og oppdatering av `app_metadata` på tvers av eksisterende sesjoner.
- Flere fiktive brukere med editor-rolle i faktisk Auth og bruker-/admin-UI; denne CI-kontrollen verifiserer spesielt `user` og `admin`, ikke full `editor`-arbeidsflyt mot GoTrue.
- Tilgjengelighet, reell mobil-/print-preview og menneskelig faglig KI-vurdering (uavhengig av denne sikkerhetsintegrasjonen).
- Retensjon og lovlig/sikker oppbevaring av virkelig persondata, gjenoppretting etter feil, tids-/kostnadskontroll hos KI-leverandøren.
- Denne test-fixturen er en **minimal struktur for å verifisere V20-8**, ikke en komplett gjenoppretting eller migrasjon av hele applikasjonens databasemodell. Intern tabelltilgang må kontrolleres i utplassert miljø.

## Beslutning

**Lokal ende-til-ende Supabase Auth/PostgREST/RLS er bestått.** Tidligere «ekte Auth/PostgREST gjenstår»-status kan nå presiseres til **«ekte hosted konfigurasjon og utvidet Auth-misbrukstest gjenstår»**. Kjernen i FR-07, FR-09, FR-11, AI-05 og NFR-01 har dermed et sterkere integrasjonsbevis enn tidligere, men ingen av dem er universelt ferdigtestet.

Koden er kun endret på revisjonsgrenen. **Ingen merge til `main`, ingen deploy, ingen live Supabase-endring og ingen betalte providerkall er utført.**

**Offisielle referanser:** [Supabase lokal utvikling](https://supabase.com/docs/guides/local-development), [Testing auth flows](https://supabase.com/docs/guides/auth/testing-auth-flows) og [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
