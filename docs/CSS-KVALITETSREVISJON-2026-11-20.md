# CSS – målrettet opprydding og verifikasjon 20.11.2026

**Repo:** `IBE160-2026/G46-nilsen` · **gren:** `audit/ibe160-final-quality-2026-11-20` · **PR:** #13 (draft). Ingen endring i `main` eller produksjon.

## Problem og metode

Etter gjennomgang av innleveringsrepoet fant vi **845** `!important` i de aktive stilfilene. Core/responsive/overrides var allerede delt, men mange historiske CSS-overstyringer ble fortsatt liggende. Vi fjernet bare tidligere `!important`-deklarasjoner når en **senere deklarasjon i samme fil** har **nøyaktig samme selektortekst, egenskap og mediekontekst**. Den gjeldende siste deklarasjonen er beholdt, og `@import`-rekkefølgen er urørt.

Dette ble gjennomført i to avgrensede omganger:

1. **Identiske verdier:** 53 tidligere deklarasjoner som ble gjentatt senere med identisk verdi.
2. **Forskjellige verdier:** 55 tidligere deklarasjoner som ble overstyrt senere med en ny verdi, men med eksakt samme selektor, egenskap og mediekontekst. Den senere verdien er beholdt.

En regel med annen selektor, annen mediekontekst eller usikker kaskade er ikke endret. En slik kontroll er mer konservativ enn å fjerne `!important` vilkårlig; eventuelle fallback-egenskaper for svært gamle nettlesere må likevel vurderes i praktisk verifisering.

## Målbar effekt

| Stilfil | Opprinnelig | Etter første runde | Etter andre runde | Totalt fjernet |
|---|---:|---:|---:|---:|
| `styles-core.css` | 83 | 82 | 80 | 3 |
| `styles-responsive.css` | 326 | 318 | 279 | 47 |
| `styles-overrides.css` | 436 | 392 | 378 | 58 |
| **Totalt** | **845** | **792** | **737** | **108 (12,8 %)** |

**Regelblokker:** 7 tomme blokker ble fjernet i første omgang og ytterligere 24 i andre, totalt 31. Disse inkluderte allerede tomme mobilmedieregler og regler som ble tomme etter oppryddingen.

## Automatiserte kontroller

- `tests/test-css-duplicate-important.cjs` oppdager tidligere overstyrte `!important` med samme **selektor + egenskap + mediekontekst**, også der verdiene er forskjellige; kontrollerer baseline **737** og avviser tomme regelblokker.
- Testen sikrer også at importrekkefølgen i `styles.css` forblir **core → responsive → overrides**.
- `npm test` og dependency audit bestod på PR-grenens commit `b8ea9108865f` i GitHub Actions **run 44735621973**. Den samlede testen inneholder også kontroll av eksterne kildelenker og historikk-ID-er.
- Grønne tester er evidens for avgrensede regler og programmatisk syntaks/struktur, **ikke** et visuelt skjermbevis.

## Gjenstående risiko og videre arbeid

- **737** `!important` gjenstår. Noen kan være bevisste for PWA, mørk/hybrid modus, simulator og mobil. Videre reduksjon krever sterkere visuell regresjonstesting og vurdering av spesifisitet og responsive bruddpunkter.
- Verifiser i faktisk nettleser, minst PC og mobil, både lys, mørk og hybrid. Sjekk spesielt simulering, sidepanel, kildebibliotek og sammenfoldede råd.
- UI-syntakstester bekrefter ikke at innholdet vises korrekt ved alle skjermbredder. Ingen skjerm-/pilottest er gjennomført i denne runden.
- `app.js` og `server.js` er store; målrettede refaktoreringer med tester bør prioriteres fremfor en full omskriving før sensur. Endringer i det separate private repoet kan ikke regnes som levert her.

**Status:** Dokumentert og maskinelt testet i utkast-PR #13, uten merge eller produksjonsdeploy.
