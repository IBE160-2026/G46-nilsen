# Samtalestøtte – sikkerhet og personvern

**Opprinnelig etablert:** v20.4  
**Videreført og oppdatert gjennom:** v20.10.3 / 26.10.2026

Filnavnet beholdes av hensyn til sporbarhet i Git-historikken. Dokumentet beskriver nå både sikkerhets- og personverntiltakene som ble etablert i v20.4 og senere relevante tillegg, blant annet brukertesting og retensjon. Det beskriver hva tiltakene beskytter mot, hvilke data som lagres, og hvilke organisatoriske avklaringer som fortsatt kreves før løsningen eventuelt brukes som ordinær virksomhetstjeneste.

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

## 6. Brukertestdata

Brukertestsvar lagres i `survey_responses` uten navn, e-post eller `user_id`. Tabellen inneholder bare skårer, frivillige fritekstsvar, teknisk rad-ID og tidspunkt.

For å hindre dobbeltinnsending brukes `survey_participation`, som lagrer `user_id` og tidspunkt for gjennomført test. Denne tabellen inneholder ikke selve svarene og har ingen fremmednøkkel til en bestemt svarrad.

Konsekvensen av dette designet er:

- administrator kan se aggregerte og enkeltstående testsvar uten å se hvilken konto som ga svaret
- kontoeksport kan ikke hente et bestemt brukertestsvar som «brukerens», fordi koblingen ikke finnes
- ved kontosletting fjernes deltakelsesmarkeringen gjennom referansen til Auth-brukeren, mens det allerede innsendte svaret blir stående som frakoblet prosjektdata
- et enkelt svar kan derfor heller ikke slettes på forespørsel ved å slå opp kontoen; det finnes ingen sikker kobling som identifiserer hvilken svarrad som tilhørte brukeren

Dette er valgt for å redusere profilering og kobling mellom konto og evaluering, men innebærer samtidig en avveining mot individuell dataportabilitet/sletting av selve testsvaret. Både svar og deltakelsesmarkering omfattes av automatisk retensjon på 365 dager.

## 7. Lagringsbegrensning

v20.4 har automatisk opprydding på serveren:

| Datatype | Retensjon |
|---|---:|
| Detaljert KI-/kildebrukslogg | 90 dager |
| Frivillig samtalevedlegg i feedback | 90 dager |
| Øvrig feedback | 365 dager |
| Benchmarkresultater | 365 dager |
| Samtalehistorikk | til brukeren sletter den eller kontoen |
| Brukertestsvar og deltakelsesmarkering | 365 dager |

Oppryddingen kjøres periodisk når appserveren er aktiv. Den er ment som teknisk sikkerhetsnett; retensjonsreglene må også beskrives i virksomhetens personverndokumentasjon dersom løsningen settes i ordinær drift.

## 8. Sletting og dataportabilitet

Brukeren kan:

- slette enkeltsamtaler
- slette all samtalehistorikk
- slette konto og historikk
- laste ned egne lagrede data som JSON

Eksporten inneholder kontoopplysninger, brukerens egne lagrede samtaler og egne feedback-rader. Den inneholder ikke anonym teknisk KI-statistikk fordi denne ikke lenger kobles til brukerprofilen. Brukertestsvar inngår heller ikke i kontoeksporten fordi `survey_responses` ikke lagrer bruker-ID og derfor ikke kan knyttes sikkert til en bestemt konto.

Ved sletting av konto:

1. samtalehistorikk slettes
2. feedback knyttet til brukeren slettes
3. eventuell gammel kobling fra KI-brukslogg til bruker-ID nullstilles
4. Supabase Auth-brukeren slettes
5. innloggingscookies fjernes

## 9. Innlogging og sesjon

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
5. Kjør `npm run test-server-privacy` for server-side personvern/sikkerhetsregresjon.
6. Kjør `npm run test-privacy` for klient-/personverngatewayen.
7. Kjør gjerne hele den deterministiske regresjonspakken med `npm test`.
8. Test login, passordreset, historikk, kontoeksport og kontosletting med en testbruker.
9. Kontroller i nettleserens Network-panel at API-responser har sikkerhetsheaderne.



## 17. Render-varsel og Node.js-sikkerhetsoppdatering – oktober 2026

Render varslet om eMudhra-sertifikatkompromittering og flere Node.js-sårbarheter som er relevante for tjenester som bruker Node.js og gjør HTTPS-kall til eksterne tjenester.

Samtalestøtte bruker Node.js og kommuniserer over HTTPS med blant annet Supabase og KI-provider. Runtime-kravet ble derfor oppdatert i `package.json` til:

`>=26.12.1 <27`

Begrunnelsen for intervallet er:

- Node 26.12.1 er den første sikkerhetspatchede Node 26-versjonen Render anbefaler for dette varselet.
- eldre Node 26-versjoner avvises
- senere patch-/minor-versjoner i Node 26 kan brukes automatisk
- Node 27 tillates ikke uten en egen kompatibilitetsvurdering

Det ble bevisst valgt et avgrenset versjonsintervall fremfor å fryse applikasjonen til nøyaktig 26.12.1. Dette reduserer risikoen for at senere sikkerhetspatcher i samme hovedversjon krever en ny kodeendring.

Etter endringen skal Render-tjenesten bygges og deployes på nytt slik at både Node-runtime og systemets sertifikatlager oppdateres.


## 18. Skille mellom lokal Node-kompatibilitet og produksjonsruntime – 26.10.2026

Etter faglærers gjennomgang ble Node-kravet justert for å unngå at sensoren unødvendig blokkeres av et produksjonsspesifikt sikkerhetskrav.

`package.json` angir nå:

`>=22 <27`

Dette er et kompatibilitetsområde for lokal kjøring og testing. Faglærer har verifisert at `npm ci` og `npm test` består på Node 23.11.

Produksjon på Render skal fortsatt bruke `NODE_VERSION=26.12.1`. Render prioriterer denne miljøvariabelen foran `engines.node` i `package.json`. Dermed kan prosjektet være mindre restriktivt for sensor lokalt uten å senke Node-versjonen i produksjon.

Node 26.12.1 ble beholdt som produksjonsversjon fordi den er en sikkerhetsrelease fra 21.10.2026. Den bredere `engines`-verdien skal derfor ikke tolkes som en anbefaling om å bruke eldre eller utgåtte Node-versjoner i produksjon.


## Tillegg 29.10.2026 – PWA og lokal app-shell-cache i v20.11.0

Versjon 20.11.0 kan installeres som PWA i støttede nettlesere. Dette endrer ikke behandlingsgrunnlag, autentisering eller server-side personverngateway, men innfører en service worker som kan lagre eksplisitte frontendressurser lokalt på enheten.

Sikkerhetsprinsipper for PWA-laget:

- service worker cacher bare eksplisitt app-shell og statiske ressurser
- API-kall skal ikke caches
- ikke-GET-forespørsler skal ikke caches
- autentiserte samtaledata skal ikke legges i PWA-cachen
- vanlige serverregler for autorisasjon og personvern gjelder også fra installert PWA
- installasjon er valgfri; webappen skal fungere uten installasjon
- brukeren bør følge virksomhetens regler for bruk av private eller administrerte enheter

PWA-installasjon gjør løsningen mer app-lignende, men skal ikke beskrives som en lukket/offline variant. Ekstern KI, Supabase og øvrige serveravhengigheter er fortsatt nettbaserte i produksjonsarkitekturen.
