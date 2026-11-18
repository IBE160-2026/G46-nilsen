# Overleveringskontroll før innlevering og eventuell sammenslåing

**Samtalestøtte – IBE160**  
**Kontrollert:** 18.11.2026  
**Arbeidsgren:** `docs/ibe160-helhetlig-revisjon-20261118`  
**Produksjon:** `main`, uendret ved denne kontrollen. **Ingen Render-deploy.**  
**Separat eksperiment:** `pilot-ux-v20.11` med LIVE/tale; ikke til produksjon.

**Siste kontrollpunkt, 18.11.2026:** [Teknisk revisjon](TEKNISK-REVISJON-CSS-APP-SERVER-2026-11-18.md) viser `app.js` **4 632 → 4 274** linjer og `server.js` **2 100 → 1 844**, med **åtte** små, ansvarsskilt klient-/servermoduler og **694 `!important`** (fra 845). [GitHub Actions #44402558539](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44402558539) er **SUCCESS**, med **43 deterministiske testdelsteg** og **99 Chrome-scenarier** (90 standard, 6 @media print, 3 åpne details). Kontrollen beviser ikke fullstendig visuell UX, fysisk mobil/utskrift, ekte Supabase RLS, live KI-råd eller innleveringskrav i Canvas. Historiske målepunkt nedenfor er bevart, men er ikke gjeldende sluttstatus.

## Beslutning i dag

**KLAR FOR FAGLIG GJENNOMGANG / IKKE GODKJENT FOR MERGE ELLER PRODUKSJON.**

Dette er en overlevering av dokumentasjon, konkrete kodeendringer og testbevis. Status «grønn CI» gjelder automatisk kvalitetsport på **revisjonsgrenen**, ikke fullstendig produkt-, sikkerhets- eller innleveringsgodkjenning.

## Dokumentasjon å lese som sensor

| Formål | Gjeldende hovedkilde |
|---|---|
| Hva som skal bygges, krav og akseptanser | `docs/bmad/PRD.md` – 36 krav inkl. FR-15A og NFR-QA-01 |
| Teknisk løsning og avhengigheter | `docs/bmad/ARCHITECTURE-BMAD.md` og `docs/bmad/ARKITEKTUR-OG-AVHENGIGHETSKART.md` |
| Stories/avhengigheter | `docs/bmad/EPICS-AND-STORIES-BMAD.md`, `docs/bmad/IMPLEMENTATION-PLAN-BMAD.md` |
| Testmetode og faktisk bevisdekning | `docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md` og `docs/ai/AI-TESTPLAN.md` |
| Egen læring, forelesninger og svakheter | `docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md` – separat redigeringsutkast |
| Daterte detaljer og dokumentasjonshistorikk | `docs/REFLEKSJONSRAPPORT-UTKAST.md`, `docs/bmad/PRD-STATUS-OG-HISTORIKK.md` |
| Komplett revisjonslogg | `docs/REVISJON-IBE160-2026-11-18.md` og `docs/ai/AI-LOGG-SAMTALESTOTTE.md` |

Alle 36 krav-ID-er er referert i arkitektur, epics/stories og testbevisregister. **36/36 referanser er ikke 36/36 beståtte funksjons-/brukertester.**

## Faktisk automatisk teststatus

- [GitHub Actions run 44345652524](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44345652524), revisjonscommit `eba6eec89970f4e27f2322bfe41255cbd296cc51`, **SUCCESS** med 35 `npm test`-delsteg, `npm ci`, `npm audit --omit=dev --audit-level=high` uten funn og opptelling av 66 golden-caser (40 strenge). Dette er et historisk datert, grønt løp på den angitte commiten.
- **Ingen live KI-kjøring i denne novemberrevisjonen.** Siste dokumenterte særskilte live yrke-/sektor-/tariff-/kildeprøve var 09.11, 40/40 OK på egen fasit; uavhengig faglig kvalitet er ikke bevist.
- **Rød/grønn etterprøvbarhet:** OpenRouter-only status ([rød](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44339406194), [grønn](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44339569597)); oppdatering av fremmed historikk-ID ([rød](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44341093359), [grønn](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44341831405)); falskt navn «Hvordan» ([rød](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44342507107), [grønn](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44343038247)).
- **Reell server, isolerte avhengigheter:** `tests/test-api-boundary-http.cjs` verifiserer uinnloggede kall, Origin og interne assets. `tests/test-auth-history-two-users-http.cjs` bruker lokal fake Auth/PostgREST. `tests/test-ai-provider-errors-http.cjs` bruker lokal fake provider. De beviser serverens HTTP-kontrakter i simulert miljø, **ikke** bruk av ekte produksjonsnøkler eller reell RLS med to kontoer.
- **Supabase:** Metadata og grants fra den tilknyttede databasen er inspisert skrivebeskyttet (10/10 tabeller RLS på, eierskapspolicyer på `conversations`). Dette er ikke samme bevis som en innlogget bruker-til-bruker-test.

## Ny kode- og testendring: CSS-modulering og redusert overstyring

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


## Kodeendringer som krever særskilt gjennomgang

| Fil | Endring | Kontroll / risiko |
|---|---|---|
| `server.js` | `/api/status` bruker felles providerkontroll; ukjent/annet eiers historikk-ID gir nøytral 404 ved oppdatering | Gode målrettede røde/grønne tester; produksjonsatferd krever fortsatt test på korrekt miljø |
| `src/privacy-detector.js` | Vanlige norske spørreord skal ikke gjenkjennes som ukjente navn | Positiv og negativ personverntest; manuell kvalitet ved flerfoldige kontekster gjenstår |
| `tests/` og `package.json` | Flere faktiske HTTP-/mocktester i `npm test`, totalt 35 delsteg | Testene krever ikke prod-secrets; review isolasjon, portbruk og responser |
| `tests/test-repo-structure.cjs` | Tillater én legitim lærerfil i `.docs` | Begrenset allowlist; CI bestått |
| `.github/workflows/quality-gate.yml` | Midlertidig gren-trigger er fjernet; standard `main` og `pull_request` mot `main` støttes | Endelig PR-kjøring må bestå; ingen prod-deploy er utløst |

## Viktige stoppunkter før produksjon eller endelig godkjenning

1. **Autorisering (høy):** Lag separat test-Supabase med to syntetiske Auth-kontoer og kjør reell SELECT/INSERT/UPDATE/DELETE/RLS-matrise. Bruk aldri reelle personalsaker eller andre brukeres data i testen.
2. **Manuell brukerreise (høy):** Kontroller en testinnlogget bruker på desktop og fysisk mobil: beskrivelse → personvern → tema/råd → oppfølging → simulering → historikk/eksport/sletting → utskrift/PWA. Dokumenter nettleser og observerte resultater.
3. **Passordvern (høy før bredere bruk):** Supabase Security Advisor varslet om at leaked-password protection er av. Vurder tiltak og eventuell lisens-/Auth-konsekvens med eksplisitt beslutning; ingen live innstilling er endret.
4. **Dokumenter og innlevering (høy):** Les faktisk rubrikk, ordgrense og formkrav i Canvas; disse er **ikke verifisert**. La studenten kontrollere at refleksjonen uttrykker egne opplevelser og faglige vurderinger. Velg endelig tekst.
5. **Kode- og endringskontroll (høy):** Gjennomgå hele diffen mot `main` og kjør ny full Quality Gate på PR-en. Den midlertidige branch-triggeren er allerede fjernet og erstattet med generell PR-gate. Krev eksplisitt godkjenning før merge.
6. **Ekstern KI og ytelse (videre arbeid):** reell retry/timeout, faktisk modellkvalitet og ekstern fagvurdering gjenstår. Det samme gjør full brukerrepresentativitet; ikke presenter dette som allerede validert.

## Sensorens mest relevante eksempler på læring

- **Læring fra forelesning 12.11:** krav → arkitektur → epics/stories → avhengigheter/sprint → konkrete tester. Den dokumenterte prosessen er iterativ, ikke en oppdiktet perfekt BMAD-sekvens. Diagrammet er et pedagogisk kart, ikke maskinelt dependency-uttrekk.
- **Testene kan ta feil:** Tvetydige ord og kildefasit i golden-tester krevde manuell årsaksanalyse. Resultat er knyttet til konkret dato og modell, ikke evig KI-korrekthet.
- **Personvern trenger både strenghet og brukbarhet:** «Hvordan» skal slippe gjennom; «Knut» skal fortsatt blokkeres når det faktisk er en personidentifikator.
- **Reelle negative feil:** Providerstatus og historikkrespons ga reproduserbare, røde testresultater som styrte små rettelser før ny grønn kjøring.
- **Human in the loop:** Studenten må fortsatt gjennomgå og godkjenne valg. Det er ikke dokumentert at parallelle subagenter implementerte alle stories.

**Overleveringsregel:** Denne filen kan brukes til faglig review og beslutning om neste testarbeid. Den er **ikke** samtykke til produksjonsmerge, databasemigrasjon, deploy eller aktivering av LIVE/tale.
