# Samtalestøtte v20.4 – sikkerhet og personvern

Dette dokumentet beskriver sikkerhets- og personverntiltakene som er implementert i Samtalestøtte v20.4, hva de beskytter mot, hvilke data som lagres, og hvilke organisatoriske tiltak som fortsatt må avklares før løsningen brukes som ordinær tjeneste i en virksomhet.

## 1. Grunnprinsipper

Samtalestøtte følger disse tekniske prinsippene:

- **Dataminimering:** bare opplysninger som er nødvendige for funksjonen skal lagres.
- **Privacy by design:** personvernsjekk skjer før fritekst sendes til ekstern KI.
- **Forsvar i dybden:** personvern kontrolleres både i nettleseren og på serveren.
- **Minste privilegium:** vanlige brukere, redaktører og administratorer har ulike rettigheter.
- **Ingen direkte klienttilgang til administrative tabeller:** administrative data håndteres server-side med Supabase service role.
- **Bruker-eid historikk:** samtaler kan bare leses, endres og slettes av brukeren som eier dem, gjennom Supabase RLS.
- **Kildemonitorering uten brukerprofilering:** tekniske KI- og weboppslagslogger skal ikke kobles til bruker-ID.

## 2. Personverngateway før KI

### Klientkontroll

Nettleseren kontrollerer fritekst før innsending og varsler/blokkerer blant annet:

- navn
- e-postadresse
- telefonnummer
- fødselsdato/fødselsår
- person-/ansattnummer
- gateadresse
- kjønnet språk som kan erstattes med nøytrale formuleringer
- konkrete aldre
- detaljerte familieopplysninger
- svært spesifikke arbeidssteder/enheter
- kombinasjoner som kan gjøre en person indirekte identifiserbar

### Serverkontroll

v20.4 utvider serverens personverngateway slik at den bruker tilsvarende regler som frontend for de viktigste direkte identifikatorene. Dette er viktig fordi en bruker kan omgå nettlesergrensesnittet og sende en API-forespørsel direkte.

Serveren blokkerer harde funn før data kan sendes til OpenAI. Mykere funn, som indirekte identifisering gjennom svært detaljerte familie- eller arbeidsopplysninger, behandles som generaliseringsvarsler i brukergrensesnittet.

**Viktig begrensning:** en regelbasert personvernsjekk kan redusere risiko, men kan aldri garantere full anonymitet. Appen omtaler derfor ikke lenger alle tekster som sikkert «anonymiserte».

## 3. Samtalehistorikk og Supabase RLS

`conversations` er beskyttet med Row Level Security. Policyene begrenser SELECT, INSERT, UPDATE og DELETE til rader der `auth.uid() = user_id`.

Dette betyr at en vanlig bruker ikke kan hente en annen brukers samtalehistorikk gjennom Supabase-klienten.

Administrativ kilde-/kostnadsstatistikk skal ikke inneholde samtaletekst.

## 4. KI-brukslogg og weboppslag

v20.4 lagrer tekniske data som er nyttige for kvalitet, kostnad og utvikling av offline SOURCEBANK:

- funksjonstype
- modell
- tema/undertema når det er tilgjengelig
- input- og outputtokens
- estimert kostnad
- om web search ble brukt
- antall web search-kall
- søkestrenger
- domener
- konkrete kildesider med URL, tittel og domene når OpenAI-responsen inneholder disse opplysningene
- tidspunkt
- benchmark-/testmarkering

### Ikke lagret i KI-/kildeloggen

- brukerens navn
- e-post
- samtaletekst
- bruker-ID

v20.4 nullstiller eksisterende `user_id` i `ai_usage_log`, stopper applikasjonen fra å lagre nye bruker-ID-er der, og migreringen oppretter i tillegg en database-trigger som tvinger `user_id` til `NULL` ved fremtidige INSERT/UPDATE. Dette er et ekstra forsvar dersom senere kode ved en feil forsøker å lagre bruker-ID igjen.

## 5. Feedback og samtalevedlegg

«Rapporter svar» lagrer normalt bare feedbacktekst og teknisk kontekst.

Samtale kan bare legges ved når brukeren aktivt velger dette. Vedlegget er av som standard og gjennomgår personvernsjekk før lagring.

Ved kontosletting slettes brukerens feedback eksplisitt. Dette er viktig fordi feedback kan inneholde et frivillig samtalevedlegg.

## 6. Lagringsbegrensning

v20.4 har automatisk opprydding på serveren:

| Datatype | Retensjon |
|---|---:|
| Detaljert KI-/kildebrukslogg | 90 dager |
| Frivillig samtalevedlegg i feedback | 90 dager |
| Øvrig feedback | 365 dager |
| Benchmarkresultater | 365 dager |
| Samtalehistorikk | til brukeren sletter den eller kontoen |

Oppryddingen kjøres periodisk når appserveren er aktiv. Den er ment som teknisk sikkerhetsnett; retensjonsreglene må også beskrives i virksomhetens personverndokumentasjon dersom løsningen settes i ordinær drift.

## 7. Sletting og dataportabilitet

Brukeren kan:

- slette enkeltsamtaler
- slette all samtalehistorikk
- slette konto og historikk
- laste ned egne lagrede data som JSON

Eksporten inneholder kontoopplysninger, brukerens egne lagrede samtaler og egne feedback-rader. Den inneholder ikke anonym teknisk KI-statistikk fordi denne ikke lenger kobles til brukerprofilen.

Ved sletting av konto:

1. samtalehistorikk slettes
2. feedback knyttet til brukeren slettes
3. eventuell gammel kobling fra KI-brukslogg til bruker-ID nullstilles
4. Supabase Auth-brukeren slettes
5. innloggingscookies fjernes

## 8. Innlogging og sesjon

Samtalestøtte bruker Supabase Auth.

Sesjonstoken lagres i cookies med:

- `HttpOnly`
- `SameSite=Lax`
- `Secure` i produksjon
- `Path=/`

Innloggingsendepunktet returnerer ikke lenger interne debug-steg som kan røpe hvor en innlogging feilet. Passordreset gir generisk svar slik at endepunktet ikke avslører om en e-postadresse finnes.

## 9. Rate limiting

v20.4 legger inn server-side begrensning av forespørsler for å redusere risikoen for brute force, misbruk og kostnadsangrep:

- generell API-rate limit
- strengere login-limit
- egen registreringslimit
- egen passordreset-limit
- egen KI-limit
- egen benchmark-limit

Rate limit er per IP og lagres i prosessminne. Det er tilstrekkelig for dagens enkle Render-instans, men bør erstattes med delt rate-limit-lager dersom løsningen senere kjører på flere serverinstanser.

## 10. CSRF/same-origin

Alle muterende API-kall (`POST`, `PUT`, `PATCH`, `DELETE`) kontrolleres mot `Origin` når nettleseren sender denne headeren. Forespørsler fra et annet nettsted avvises.

Dette kommer i tillegg til `SameSite=Lax` på autentiseringscookies.

## 11. HTTP-sikkerhetsheadere

v20.4 setter blant annet:

- Content-Security-Policy
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer
- X-Frame-Options: DENY
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Resource-Policy: same-origin
- Permissions-Policy med kamera, mikrofon, geolokasjon, betaling og USB deaktivert
- HSTS i produksjon

Express sin `X-Powered-By` er deaktivert.

## 12. Offentlig filtilgang

Tidligere ble hele prosjektmappen servert via `express.static(__dirname)`. Det kunne gjøre testfiler, SQL-migreringer, dokumentasjon og annen intern kode tilgjengelig dersom filnavnet var kjent.

v20.4 bruker en eksplisitt allowlist og serverer bare:

- `index.html`
- `app.js`
- `styles.css`
- godkjente logo-/profil-/temabilder
- favicon/SVG som brukes i grensesnittet

`.env`, SQL-filer, testfiler, README-er, SOURCEBANK-filer og serverkode serveres ikke som statiske filer.

## 13. Administrative rettigheter

Roller:

- `user`
- `editor`
- `admin`

Admin/endepunkter kontrolleres på serveren. Det er ikke nok å skjule en knapp i UI-et.

Direkte klienttilgang til administrative Supabase-tabeller er tilbakekalt for `anon` og `authenticated`; serveren bruker `service_role`.

## 14. Feilmeldinger og logger

v20.4 reduserer teknisk informasjon som sendes til klienten:

- interne OpenAI-feilmeldinger sendes ikke tilbake som `apiMessage`
- auth-debug-steg fjernes fra loginresponsen
- diagnostikk-endepunktet er adminbeskyttet
- serverlogger skal ikke inneholde samtaletekst

## 15. Eksterne tjenester

Arkitekturen bruker per v20.4:

- **Render** – kjører Node/Express-serveren
- **Supabase** – autentisering og database
- **OpenAI API** – KI-funksjoner og eventuelt web search

Ingen API-nøkler skal ligge i `app.js` eller annen nettleserkode. Hemmeligheter skal kun settes som servermiljøvariabler.

## 16. Tiltak som ikke kan løses bare i kildekoden

Følgende må avklares før ordinær virksomhetsbruk med reelle personalsaker:

- hvem som er behandlingsansvarlig
- dokumentert behandlingsgrunnlag
- databehandleravtaler med leverandørene som brukes
- vurdering av dataregion og eventuelle tredjelandsoverføringer
- DPIA/personvernkonsekvensvurdering dersom risikovurderingen tilsier det
- protokoll over behandlingsaktiviteter
- intern avviks-/bruddprosedyre
- tilgangsstyring og rutiner for administratorer
- MFA for administrator-/driftskontoer der leverandørene tilbyr dette
- rutine for periodisk gjennomgang av RLS, API-nøkler, avhengigheter og tilganger
- sikkerhetskopi- og gjenopprettingsrutine etter virksomhetens behov

Disse punktene kan ikke «kodes bort» i Samtalestøtte alene.

## 17. Hva v20.4 ikke lover

Ingen webapplikasjon kan garanteres å være uten sårbarheter. v20.4 reduserer de konkrete svakhetene som ble identifisert i gjennomgangen, men sikkerhet må vedlikeholdes gjennom oppdateringer, testing, tilgangskontroll, leverandøroppfølging og ny vurdering når funksjonaliteten endres.

## 18. Kontroll før deploy

1. Kjør `database/migrations/V20-4-SUPABASE-MIGRATION.sql` i Supabase.
2. Kontroller at `APP_BASE_URL` på Render er satt til den faktiske HTTPS-adressen.
3. Kontroller at `NODE_ENV=production` i produksjon.
4. Kontroller at `SUPABASE_SECRET_KEY` og `OPENAI_API_KEY` bare finnes som Render-secrets/miljøvariabler.
5. Kjør `node test-v20-4-security.cjs`.
6. Kjør `node test-privacy.js`.
7. Test login, passordreset, historikk, kontoeksport og kontosletting med en testbruker.
8. Kontroller i nettleserens Network-panel at API-responser har sikkerhetsheaderne.

