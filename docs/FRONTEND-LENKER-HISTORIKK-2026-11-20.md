# Frontend – lenkesikkerhet og historikk-ID-er (20.11.2026)

**Omfang:** Avgrenset gjennomgang av kilde-URL-er og ID-er i `app.js` i offisielt innleveringsrepo `G46-nilsen`. Endringene ligger bare i PR #13 og er ikke deployet.

## Funn

1. `escapeHtml(source.url)` hindrer at anførselstegn bryter HTML-attributter, men validerer **ikke** URL-protokollen. En feilaktig eller kompromittert kilde-/loggoppføring med `javascript:` eller `data:` burde derfor ikke bli en klikkbar lenke. Gitt eksisterende CSP er ikke et praktisk angrep dokumentert; dette er ekstra forsvar mot utrygge data.
2. `renderHistory` satte `item.id` direkte inn i tre HTML-attributter. Forventet ID fra databasen er normalt UUID, men selve klientfunksjonen skal ikke stole på dette. Sletteruten brukte dessuten uenkodet ID i URL-banen.

## Konkrete endringer

- `safeExternalUrl` godtar bare absolutte `http:`/`https:`-URL-er med hostname og uten innbygde brukernavn/passord. Ugyldig eller ikke-godkjent protokoll gir ingen klikkbar lenke.
- `renderSafeSourceLink` viser kildetittelen som ufarlig tekst når URL-en avvises. Den brukes i hjelp- og kildebiblioteket, sektorsammendraget og administratorens kildebruksliste. Hovedveiledningens evidenslenker valideres på samme måte.
- `renderHistory` bruker `escapeHtml` på ID-er i `data-history-id`, `data-open-history` og `data-delete-history`.
- Sletting bruker `encodeURIComponent` på den utvalgte ID-en og sender eksplisitt sesjonsinformasjon.

## Testbevis

`tests/test-safe-source-urls-history.cjs` tester flere utrygge protokoller (`javascript:`, `data:`, `file:`, `ftp:`), relativ URL, legitime `http(s)`-lenker og HTML-escaping av kildenavn. Den bruker også en tilsiktet problematisk historikk-ID med anførselstegn, HTML-tag og reserverte URL-tegn og kontrollerer HTML-utskrift, slettesti og sesjonsalternativ.

Testen inngår i `npm test` og bestod sammen med full deterministisk pakke og dependency audit i GitHub Actions **run 44735621973**.

## Begrensninger

- Dette er **ikke** en komplett XSS-/pentest eller en test av faktiske nettleserklikk. Det er ikke påvist at tidligere kilde-data kunne utnyttes i produksjon.
- `.innerHTML` brukes fortsatt mange steder i `app.js`. At enkelte sinker er sikret betyr ikke at alle dynamiske HTML-uttrykk er revidert.
- Sikkerhet ved innlogging, RLS og databaseadgang må valideres med autentiserte testkontoer i pilot.
- Ingen endringer i `main`, ingen automatiske deployer og ingen kopiering fra privat utviklingsrepo uten egen vurdering.
