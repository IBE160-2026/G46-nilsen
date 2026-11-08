# Kodestruktur og opprydding – 08.11.2026

## Status

Repoet ble gjennomgått med fokus på filstørrelse, ansvar og regresjonsrisiko.

### Største aktive hovedfiler før opprydding

| Fil | Omtrentlig størrelse | Vurdering |
|---|---:|---|
| `app.js` | 261 KB | For stor; kandidat for videre moduldeling |
| `styles.css` | 195 KB / 9 389 linjer | For stor; ryddet 08.11 |
| `server.js` | 116 KB | Stor; kandidat for videre moduldeling |
| `CHANGELOG.md` | 91 KB | Stor, men dokumentasjon; kan arkiveres per release |

## Gjennomført: CSS

`styles.css` er splittet uten å omorganisere regelrekkefølgen:

1. `styles-core.css`
2. `styles-responsive.css`
3. `styles-overrides.css`

`styles.css` er nå kun inngangspunktet som importerer disse i samme cascade-rekkefølge.

Dette er bevisst et konservativt grep. Doble og eldre overrides er ikke aggressivt slettet i samme runde, fordi det ville økt risikoen for visuelle regresjoner.

## Anbefalt neste opprydding

### app.js
Bør senere deles etter ansvar, eksempelvis:
- navigasjon/UI-state
- samtalestøtte/guidance
- samtaleøvelse
- historikk
- kildevisning
- admin
- auth
- PWA/UI-hjelpere

### server.js
Bør senere deles i Express-routere/tjenester:
- auth/account
- history
- occupation/source library
- AI analyse/guidance
- simulation
- admin/benchmark
- feedback/survey

### Dokumentasjon
Historiske versjonsdokumenter og et stort `CHANGELOG.md` er ikke runtime-problemer, men kan etter innlevering organiseres i `docs/archive/` dersom sensor ikke trenger dem på toppnivå.

## Regel for videre opprydding

Ingen stor refaktorering rett før innlevering uten:
1. eksplisitt ansvar som skal flyttes
2. uendret ekstern kontrakt
3. syntakstest
4. relevant regresjonstest
5. full `npm test` etterpå
