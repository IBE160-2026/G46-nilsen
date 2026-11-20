# CSS – målrettet opprydding og verifikasjon 20.11.2026

**Repo:** `IBE160-2026/G46-nilsen` · **arbeidsgren:** `audit/ibe160-final-quality-2026-11-20` · **PR:** #13 (draft).

## Hvorfor dette ble gjort

Etter ny gjennomgang av riktig innleveringsrepo viste de tre aktive CSS-filene samlet **845 `!important`-deklarasjoner**. Filene er allerede strukturelt delt i `styles-core.css`, `styles-responsive.css` og `styles-overrides.css`, men oppdelingen alene hadde ikke fjernet gamle overstyringer. Denne runden retter bare *beviselig identiske* tidligere deklarasjoner – den er ikke en full CSS-refaktorering.

## Endring og målbar effekt

| Stilfil | Før | Etter | Fjernet |
|---|---:|---:|---:|
| `styles-core.css` | 83 | 82 | 1 |
| `styles-responsive.css` | 326 | 318 | 8 |
| `styles-overrides.css` | 436 | 392 | 44 |
| **Sum** | **845** | **792** | **53 (6,3 %)** |

En deklarasjon ble vurdert som overflødig bare dersom en **senere deklarasjon i samme fil** hadde *eksakt samme selektortekst, samme CSS-egenskap, identisk `!important`-verdi og identisk innramming av `@media`/andre at-regler*. Den eldre deklarasjonen kunne derfor ikke avgjøre sluttresultatet for denne egenskapen ved CSS-kaskadeberegning. Senere regel ble alltid beholdt, og importrekkefølgen ble ikke endret.

Eksempler: eldre simulatormerke-regler for transparent bakgrunn/ramme, gjentatte mobilmål i `.simulation-hub-hero` og dublerte ikon-/pilstiler i fullstendig kildebibliotek. **Syv** hele regelblokker ble tomme og ble fjernet.

## Regresjonskontroll

- `tests/test-css-duplicate-important.cjs` inspiserer de tre CSS-filene, oppdager samme signatur innen samme mediekontekst, kontrollerer at ingen slike eksakte duplikater er igjen og varsler om samlet antall `!important` øker uten bevisst baselineendring.
- Den sikrer også `@import`-rekkefølgen: core → responsive → overrides.
- Ny test er koblet til `npm test`/GitHub Actions. Quality Gate kjøring **44730967652** på commit `c7fd6e4f1cdf` bestod med full deterministisk testpakke og dependency audit.

## Begrensninger og videre arbeid

- Dette er en **kaskadebasert kodekontroll**, ikke et bevis for pikselidentisk visning i alle nettlesere. Det er **ikke** gjennomført praktisk skjermtest av mobil/desktop i denne runden.
- Fortsatt gjenstår **792** `!important`. Det er teknisk gjeld, men enkelte regler kan være bevisst nødvendige. Videre reduksjon krever analyse av spesifisitet, breakpoints, tema og visuell pilotregresjon.
- `app.js` har 4 632 linjer, `server.js` har 2 094 linjer. I `app.js` finnes over 100 `.innerHTML`-tildelinger; dette er **ikke i seg selv bevis for XSS**, men en viktig risikogruppe å gjennomgå selektivt for usanitert bruker-/servertekst.
- Videre moduluttrekk skal bare skje der ansvaret kan avgrenses og funksjonaliteten kan kontrolleres i eksisterende tester og i pilot. Ikke flytt kode fra det private repoet over uten sammenligning av faktisk implementasjon.

**Status:** CSS-rydding i egen PR, ikke `main` og ingen produksjonsdeploy.
