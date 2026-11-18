# CSS-revisjon – Samtalestøtte

**Dato:** 18. november 2026  
**Gren:** `docs/ibe160-helhetlig-revisjon-20261118` (utkast-PR #12); **ikke** `main` eller LIVE-pilot  
**Formål:** Dokumentere størrelsen på CSS, mange `!important`, gjentatte regler og en trygg oppryddingsstrategi – med reproduserbare målinger, ikke bare kosmetisk minifisering.

## Status etter større kaskade- og modulopprydding – 18. november 2026

**Gjennomført på separat revisjonsgren, ikke produksjon:**

1. Fjernet to 100 % identiske KI-logo-blokker: **−25 linjer, −13 `!important`**.
2. Fjernet **75 fullt overstyrte CSS-blokker**: **−443 linjer, −52 `!important`**. Blokkene var for de samme selektorene, egenskapene og identiske at-regelkontekstene helt overstyrt av senere gyldige deklarasjoner.
3. Fjernet **265 overstyrte enkeltdeklarasjoner** inne i blokker som ellers måtte beholdes: **−266 linjer, −69 `!important`**. Enkeltdeklarasjoner ble bare fjernet der alle selektorene i originalblokken hadde en senere deklarasjon for samme egenskap og identisk scope med minst like sterk prioritet. Senere verdier med `var()`, `env()` og enkelte potensielt inkompatible funksjoner ble holdt utenfor.
4. Delte den 6 011 linjer lange `styles-core.css` i **fire moduler i opprinnelig rekkefølge**, rundt 1 500 linjer hver: `styles-core-foundation.css`, `styles-core-dialogue.css`, `styles-core-simulation.css` og `styles-core-utilities.css`. `styles-core.css` er nå kun en liten importfil. Serverens public asset-liste, demomodus, service-workerens offline-cache, repo-test og UI-testenes CSS-innlesing er oppdatert.
5. Laget **`tests/test-css-module-order.cjs`**, som sjekker den nøyaktige importrekkefølgen og sammenligner sammenkjedede modulbytes med den opprinnelige `styles-core.css` ved Git blob-SHA **`28de97a17d2d5f8dad1265c51b5ec123b49fcadd`**. Det er et konkret bevis på at *moduldelingen i seg selv* ikke har endret én byte i kjerne-CSS-reglene. Testene totalt er nå **36 delsteg**.

### Målt status

| Kontroll | Før stor revisjon | Etter større revisjon |
|---|---:|---:|
| `!important` i fysisk CSS-kode | **845** | **711** (−134, ca. 16 %) |
| Samlet fysisk linjetall inkludert importfiler | **9 870** | **ca. 9 146** (−724, ca. 7 %) |
| Største CSS-fil | **6 402 linjer** | **1 709 linjer** (responsiv) |
| Kjerne-CSS i én fil | **6 402 linjer** | **4 filer på ca. 1 500 linjer, pluss importer** |
| Samme selector/egenskap/scope gjentatt | **587 grupper** | **108 grupper** |
| Nye `!important` etter eldre `!important` for identisk selector/egenskap/scope | **149 fysiske deklarasjoner** | **19 fysiske deklarasjoner** |

**Målepresisering:** `npm run audit:css` summerer **9 125 linjer i de seks CSS-innholdsfilene** (fire kjernedeler + responsive + overrides). Til totalsummen rundt 9 146 kommer også de to små importfilene `styles-core.css` og `styles.css`. Kildene har avsluttende linjeskift, så forskjeller på et fåtall linjer ved splitting er ren opptellingsmetode. `!important`-tellingen påvirkes ikke av dette.

### Verifisering og stoppkriterium

- Ryddecommits `545d19ce` og `3676885e` verifiserte uendret **sist vinnende deklarasjon** for over 5 300 eksakte kombinasjoner av selector/egenskap/at-rule-scope før/etter. Det er statisk kontroll, **ikke** et komplett bevis på kaskaden mellom ulike selektorer, inline style, shorthand eller nettleserstøtte.
- Etter moduldeling feilet en tidlig CI fordi noen tester fortsatt leste den gamle CSS-listen. Testinnlesingen og import-audit ble deretter oppdatert. [Grønn Quality Gate på moduloppdelingen](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44356425430), commit `8b084af4`: **36 testdelsteg**, CSS-modul-SHA-test, audit og 0 funn i dependency-scan på valgt nivå. Dette er grunnlaget før denne dokumentasjonsoppdateringen.
- **Fremdeles åpent:** visuell før-/etter-kontroll på ekte desktop/mobil i lys/mørk/hybrid, minimert og utvidet sidepanel, kildebankens kategori-/yrkes-/kildepiler, samtalesimulator og utskrift. En grønn CI og en byteidentisk moduldeling **erstatter ikke** dette. Vi fjerner ikke ytterligere hundrevis av `!important` bare for å nå et vilkårlig tall.

## 1. Hva sa faglærer, og hva viser dagens kode?

I [Product Brief-tilbakemeldingen 26.10](feedback/tilbakemelding-product-brief.md) punkt «Kodekvalitet og arkitektur» kommenterte faglærer at `app.js` var ca. **3 400 linjer** og `server.js` ca. **1 600 linjer** på vurderingstidspunktet, og anbefalte dokumentasjon av teknisk gjeld og videre modularisering. Tilbakemeldingen oppga **ikke et konkret CSS-tall**. CSS-analysen nedenfor er en ny, separat teknisk undersøkelse utløst av prosjektlederens ønske.

`index.html` laster bare `styles.css`. CSS hadde først tre underfiler (`styles-core.css`, `styles-responsive.css`, `styles-overrides.css`). Etter oppryddingen er kjernefilen igjen delt i fire ordnede kjernemoduler. **Oppdelingen alene** fjerner ikke kaskadekonflikter; det gjør den separate, kontrollerte fjerningen av overstyrte regler og deklarasjoner.

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
