# CSS-revisjon – Samtalestøtte

**Dato:** 18. november 2026  
**Gren:** `docs/ibe160-helhetlig-revisjon-20261118` (utkast-PR #12); **ikke** `main` eller LIVE-pilot  
**Formål:** Dokumentere størrelsen på CSS, mange `!important`, gjentatte regler og en trygg oppryddingsstrategi – med reproduserbare målinger, ikke bare kosmetisk minifisering.

## 1. Hva sa faglærer, og hva viser dagens kode?

I [Product Brief-tilbakemeldingen 26.10](feedback/tilbakemelding-product-brief.md) punkt «Kodekvalitet og arkitektur» kommenterte faglærer at `app.js` var ca. **3 400 linjer** og `server.js` ca. **1 600 linjer** på vurderingstidspunktet, og anbefalte dokumentasjon av teknisk gjeld og videre modularisering. Tilbakemeldingen oppga **ikke et konkret CSS-tall**. CSS-analysen nedenfor er en ny, separat teknisk undersøkelse utløst av prosjektlederens ønske.

`index.html` laster bare `styles.css`, som importerer `styles-core.css`, deretter `styles-responsive.css`, til slutt `styles-overrides.css`. Filene er **allerede delt fysisk**, men den samlede kaskaden inneholder mange historiske endringer og gjentakelser. Et navneskifte eller en oppdeling av filer alene reduserer ikke antall motstridende regler.

### Baseline før første rydding

| Fil | Linjer | `!important` |
|---|---:|---:|
| `styles-core.css` | 6 402 | 83 |
| `styles-responsive.css` | 1 871 | 326 |
| `styles-overrides.css` | 1 583 | 436 |
| `styles.css` (kun import) | 14 | 0 |
| **Sum** | **9 870** | **845** |

Dette er faktisk opptelling av repository-filene, ikke det gamle anslaget om en enkelt fil på 6 000 linjer. Opptellingen inkluderer tomme linjer, kommentarer og avsluttende newline; den skal brukes konsekvent når vi sammenligner før/etter.

### Målt etter første kontrollerte rydding

| Mål | Før | Etter | Forskjell |
|---|---:|---:|---:|
| CSS-linjer inkludert importfil | 9 870 | **9 845** | **−25** |
| `!important` (fysiske deklarasjoner) | 845 | **832** | **−13** |
| `styles-overrides.css` linjer | 1 583 | **1 558** | **−25** |
| Identiske blokkgrupper | 11 | **9** | **−2** |
| Gjentatte selektor/egenskap/samme at-regel-grupper | 587 | **540** | **−47** |
| Ekstra deklarasjoner etter utvidelse av selektorlister | 696 | **649** | **−47** |
| `!important` etter tidligere `!important` for samme selektor/egenskap/scope – *fysiske forekomster* | 149 | **136** | **−13** |

**Målemetode:** `npm run audit:css` kjører `scripts/audit-css.cjs`, som leser de tre faktiske stilarkene og kontrollerer importrekkefølgen. Den parser CSS-blokker, utvider kommaseparerte selektorlister og grupperer deklarasjoner etter **normalisert selektor + egenskap + identisk @media/@supports-kontekst**. Fordi én deklarasjon kan gjelde flere selektorer, er tallene **649 ekstra deklarasjoner** ikke det samme som 649 fysiske kodeforekomster eller 649 linjer som sikkert kan slettes. **136** er derimot deduplisert til fysiske kildeposisjoner for `!important` som kommer etter en tidligere `!important` for samme eksakte match. Disse er sterkere kaskadekandidater, men heller ikke automatisk trygge slettinger.

**Statisk analyse er ikke visuell/kjørt CSS.** Selektorspesifisitet mellom *ulike* selektorer, `@layer`, media som overlapper uten å være tekstlig identiske, CSS-variabler, shorthand, `:has()`, DOM-tilstand og JavaScript-genererte klasser kan endre hvilket uttrykk nettleseren faktisk viser. Derfor er de målte kandidatene ikke et formelt bevis på død kode.

## 2. Konkrete kaskadekonflikter vi må rydde videre i

### A. Mobilvisning av samtalesimulatoren – høy prioritet, høy risiko

I `styles-responsive.css` har samme `@media (max-width:640px)`-kontekst **fire** definisjoner av `.simulation-hub-hero { grid-template-columns }`:

- Omtrent linje **252:** `1fr !important`.
- Omtrent linje **597:** `minmax(0,1fr) 108px !important`.
- Omtrent linje **1042:** `minmax(0,1fr) 72px !important`.
- Omtrent linje **1257:** `minmax(0,1fr) 88px !important`.

Dette er en reell serie med senere prioritet for **samme selektor og samme media**. Å slette tre første kan likevel ikke besluttes før vi kontrollerer alle beslektede dimensjoner, ikonets plassering, tekstflyt og andre mer spesifikke regler. Simulatoren har vært visuelt følsom på mobil, og `styles-overrides.css` kommer i tillegg etter dette arket.

### B. Kildebankens piler og punktliste – høy prioritet, høy risiko

`styles-overrides.css` setter den samme selektoren `#help-view #complete-source-library .source-bank-top-category>summary::before` flere ganger med `content: none` og `content: "›"`. En tilsvarende sekvens finnes for `.compact-source-row>summary::before` med `none`, `"•"` og `none`/ `"•"`. Senere koder innfører egne, eksplisitte chevrons.

Det er dermed sannsynlig at flere *historiske forsøk på samme UX-løsning* er bevart samtidig. Før rydding må vi bekrefte hvilken pil som faktisk skal være synlig på kategori-, yrkes- og kildenivå. **Her må vi ikke fjerne tilsynelatende overstyringer uten å sjekke både åpnet og lukket tilstand.**

### C. Hybridtemaets logo – moderat/høy prioritet

I `styles-core.css` defineres `filter` på `html[data-theme="hybrid"] .sidebar .brand-logo` **seks ganger** (blant annet rundt linje 4331, 4441, 4516, 4659, 5574 og 5710). Verdiene går mellom `none`, `brightness(...)` og `drop-shadow(...)`, til slutt også med `!important`.

Dette bør konsolideres mot den faktisk ønskede logoen i lys, mørk og hybrid modus. Ikke fjern gamle temavarianter på grunnlag av statisk selektorsøk alene.

### D. Løpende småtillegg i kjerne og responsive – moderat prioritet

Eksempler er `.privacy-banner` med tre forskjellige `padding`/ `border-radius`-verdier i `styles-core.css`, samt `.simulation-temporary-option` som gjentar mange av de samme deklarasjonene mot slutten av filen. Dette er mulige lavrisikokandidater for å samle en tydelig sluttilstand, men må fremdeles kontrolleres sammen med overordnede komponentregler og CSS-tester som i dag søker etter bestemte tekststrenger.

### E. `!important` i responsive/overrides dominerer

De to siste filene står etter første rydding for **749 av 832** `!important`, omtrent **90 %**. Tilstedeværelsen er ikke alene et bevis på feil – noen regler kan være nødvendige i komponenter, tema eller tilgjengelighet – men mønsteret passer med «ny overstyring for hvert senere designønske» fremfor én autoritativ regel per tilstand.

## 3. Faktisk kodeendring i denne runden

To **helt identiske blokker** for `#simulation-view .simulation-logo-crop` og bildeflervalg lå rett før en identisk merket seksjon, `v20.11.5 CLEAN SIMULATION MARK`, i `styles-overrides.css`. Den **første kopien** ble fjernet, og den senere, dokumenterte kopien ble beholdt. Samme selektorer, deklarasjoner, `!important`-status og kontekst var identiske. Resultat: **−25 linjer, −13 `!important`**, og ellers ingen tilsiktet stilendring.

**Bekreftet:** [GitHub Actions Quality Gate – PR-run 44350121403](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44350121403) med **SUCCESS** på oppryddingscommiten. Kjøringen omfattet 35 eksisterende testdelsteg, CSS-audit og `npm audit`. Dette er **ikke** en skjermbilde-/visuell regresjonstest. Det er spesielt viktig fordi flere eksisterende CSS-tester er *tekstbaserte*, ikke piksel-/DOM-baserte.

## 4. Plan for trygg videre opprydding

1. **Frys visuelt sammenligningsgrunnlag i pilot/testmiljø, ikke produksjon:** Kontroller 360/390, 640, 768, 1024 og 1440 px, samt lys/mørk/hybrid, minimert/utvidet sidemeny, kildebank med alle pilnivåer, oppfølging, simulator, mobilmenyer og utskrift. Lag før-bilder eller dokumenter computed styles for de komponentene som skal endres.
2. **Rydd én komponentgruppe per commit:** Start med helt identiske blokker/verdier og enkel komponentstyling. Test deretter `styles-responsive.css` for mobil-simulator og `styles-overrides.css` for kildebankens piler separat. Unngå samtidig omskriving av hele filen.
3. **Flytt den endelige regelen til riktig komponentområde:** Når hele forholdet mellom kjerne, tema og breakpoint er kartlagt, behold én autoritativ styling per faktisk tilstand. Fjern historiske overstyringer kun etter kontroll. Vurder mindre selektorspesifisitet fremfor nye `!important`, men ikke fjern slike flagg mekanisk.
4. **Kjør tester og oppdater måling for hvert steg:** `npm run audit:css` + `npm test` + PR Quality Gate. Dokumenter linjer, `!important`, gjentakelser og hvilke visuelle tilfeller som ble manuelt sammenlignet.
5. **Sjekk død CSS i nettleseren:** Bruk Chrome DevTools **Coverage** i representative arbeidsflyter, og kryssjekk `index.html` og JavaScript som setter klasser dynamisk. Manglende teksttreff alene er **ikke** nok til å slette en selektor. `:has()`, tema, åpne/lukkede detaljer, utskrift og PWA må inngå.
6. **Revider struktur etter stabilisering:** Vurder tematiserte CSS-moduler (layout, sidebar/topbar, råd, simulator, kildebank, admin, print, mobil) når vi vet hvilken kode som faktisk er aktiv. En større flytting kan ellers forandre rekkefølgen i kaskaden selv om hver enkelt regel er lik.

### Stoppkriterier

Ikke slå sammen et større CSS-forslag med `main` før mobil/desktop/tema/print er manuelt kontrollert og dokumentert. En grønn deterministisk CI er nødvendig, men ikke tilstrekkelig for UI-kvalitet. Ikke berør LIVE-piloten eller produksjons-Render i denne revisjonen.

## 5. Sporbarhet til forelesning og refleksjon

Denne gjennomgangen viser hvorfor forelesningens vektlegging av arkitektur, avhengigheter, avgrensede stories og **human in the loop** er relevant: Selv om CSS-filene allerede er delt, er avhengighetene mellom regler betydelige. Tidligere raske AI-endringer har etterlatt flere gyldige, men ofte overflødige stildefinisjoner. Den læringen er mer relevant for refleksjonsrapporten enn et ubegrunnet prosentmål for antall linjer.

**Merknad:** Alle mål er hentet fra GitHub-filer på revisjonsgrenen. Ingen browser-coverage, visuell baseline eller menneskelig vurdering av alle komponenter er gjort i denne runden. Dokumentet er en prioritert analyse og første begrensede kodeopprydding, ikke en erklæring om at CSS-en er ferdig refaktorert.
