# Kodekvalitet – asynkron administrasjon og historikk

**Dato:** 20.11.2026 · **Repo:** `IBE160-2026/G46-nilsen` · **Gren:** `audit/ibe160-final-quality-2026-11-20` · **PR:** #13 (draft).

## Hvorfor dette ble prioritert

En tidligere gjennomgang av det private utviklingsrepoet avdekket risiko ved sene API-svar. Dette er kontrollert og rettet **i det offisielle innleveringsrepoets egen kode**, ikke blindt kopiert over. Flere administrative funksjoner lastet bruker-, KI-rapport-, survey-, modell- og benchmarkdata uten å verifisere at den samme autoriserte visningen og kontoen fortsatt var aktiv når svaret kom. I tillegg kunne tidligere historikk bli liggende i skjult klient-DOM ved kontobytte.

Serverens `rowToHistory` la historikk-ID inn **før** innhold fra lagret JSON. Et lagret `id`-felt kunne dermed overskrive den faktiske database-ID-en i API-svaret. Det er en dataintegritetsfeil som kan føre til at klienten retter handlinger mot feil samtale-ID; den er ikke dokumentert utnyttet i produksjon.

## Endringer

1. `app.js` har nå `adminViewEpoch` og `isActiveAdminView()`. Bytte av visning eller konto ugyldiggjør tidligere adminforespørsler. `clearAdminPrivateData()` tømmer blant annet brukerliste, rapporterte KI-svar, fritekstsvar fra undersøkelser, KI-statistikk og benchmarkvisningen.
2. `openAdmin()` er gjort lesbar og kontrollert etter asynkron innlasting. Å åpne en allerede aktiv visning tilbakestiller ikke pågående innholdsredigering. Eldre `/api/content`-svar kan ikke overskrive nyere forespørsler eller en vellykket lagring.
3. Brukere, KI-rapporter, spørreundersøkelser, modellvalg, KI-bruk og benchmark har øktkontroll etter API-svar. KI-bruksstatistikk og benchmark bruker i tillegg forespørselssekvens slik at eldre filter-/resultatkall ikke vinner over nyere.
4. `openHistory()` avviser forsinkede svar etter kontobytte/utlogging og lar den nyeste historikkinnlastingen vinne. Historikkliste og tilhørende kontoopplysninger tømmes ved identitetsendring. En avsluttet kontos samtalekontekst nullstilles, mens ren rolleendring på samme konto ikke tømmer samtalen.
5. `server.js` sin `rowToHistory()` prioriterer database-ID og databasens tidsstempler over felt fra lagret JSON. En ugyldig/eldre JSON-verdi gir ikke feil ID.

## Automatisert kontroll

| Test | Hva den simulerer | Hva den **ikke** beviser |
|---|---|---|
| `tests/test-history-row-identity.cjs` | Lagret JSON forsøker å overskrive ID og tidsstempler | Reell database/RLS eller godkjent to-konto-flyt |
| `tests/test-admin-async-session.cjs` | Forsinkede rapporter, brukere og survey etter utlogging eller sidebytte; endret filter i bruksstatistikk; utdatert benchmark | Faktisk nettleser og ekte nettverks-/sessioncookies |
| `tests/test-admin-content-generation.cjs` | Concurrent content loads, gammel visning, nyere respons og gjenåpning av editor | Full redigeringsflyt med faktisk Supabase og to roller |
| `tests/test-history-session-cleanup.cjs` | Utsatt historikksvar etter utlogging, ny konto, overlappende hentinger og ren rolleendring | Ende-til-ende-verifisering av lagring/sletting under faktiske kontoer |

Testene er koblet til `npm test`; GitHub Actions kjører også dependency audit og strict golden-oppsummering. Seneste beståtte kjøring for denne runden føres i PR etter kontroll.

## Uavklarte risikoer og neste avgrensning

- Ingen visuell pilot-/nettlesertest eller integrert flerbrukertest mot Supabase er gjennomført i denne runden. Det må gjøres før merge og innlevering.
- Asynkrone **aktive** benchmark- og pilotregresjonskjøringer kan fortsette mens brukeren bytter visning. Å avvise gamle skjermoppdateringer er ikke det samme som å avbryte allerede sendte serverkall eller pågående betalte kall. Stopp-/kanselleringsatferd må testes separat før produksjonsbruk.
- Redaktørens innhold kan fortsatt endres i serveren selv om klienten forlater visningen før lagringssvaret kommer; test også dette med faktiske sesjoner.
- Store `app.js` og `server.js` er ikke modulære bare fordi noen utvalgte funksjoner ble sikret. En eventuell flytting av kode til flere moduler må ha egen test- og importgjennomgang.

**Status:** Endringer bare på arbeidsgren/PR #13. Hovedgren og produksjon er ikke endret.
