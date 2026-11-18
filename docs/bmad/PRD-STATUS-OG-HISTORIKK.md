# PRD – historiske tester, status og tillegg

**Arbeidsgrunnlag:** `main` v20.11.5 ved commit `2ae505adc22a9ea86ef89e5cf045f4ec5f68d0cf` (12.11.2026).  
**Arkivert/konsolidert:** 18.11.2026, uten sletting av de opprinnelige opplysningene.  
**Status:** Dette er et **historisk evidens- og endringsvedlegg** til `docs/bmad/PRD.md`. Gjeldende krav er samlet i PRD §§ 8–10. Tall og «BESTÅTT»-merknader nedenfor gjelder daterte tidligere kjøringer og må ikke forveksles med fersk godkjenning.

## Kontrollert hovedstatus før dette vedlegget ble opprettet

- Siste `main`-commit 12.11.2026: `2ae505adc22a9ea86ef89e5cf045f4ec5f68d0cf`.
- Siste GitHub Actions-kjøring `43205812288` 12.11: **FAILURE** på `tests/test-repo-structure.cjs`, etter at faglærers `.docs/planning-artifacts/architecture/technology.md` ble lagt til. Påfølgende dependency-audit ble **ikke kjørt**.
- Tidligere main-kjøring `43202363894` på eldre commit var **SUCCESS**; historiske 40/40 live occupation-golden mot `gpt-5.6-luna` datert 09.11. Disse opplysningene har andre tidsstempler og kan ikke brukes som en friskmelding av dagens HEAD.
- `docs/bmad/KRAVSPORING-KONTROLL-2026-11-18.md` viser hvilke krav og akseptanser som fortsatt må ende-til-ende-verifiseres.
- **LIVE/transkripsjon:** kun separat pilot under testing, ikke del av produksjonskravene som ferdig funksjon.

## A. Opprinnelig test- og kvalitetssikringsoversikt fra PRD

# 11. Testing og kvalitetssikring

## T-01 – Personvern

**Status:** BESTÅTT

Kommando:

```bash
npm run test-privacy
```

Siste dokumenterte kontroll:

**73/73 bestått**

---

## T-02 – Samtalesimulering

**Status:** BESTÅTT

Kommando:

```bash
npm run test-simulation
```

Siste kontroll:

**24/24 bestått**

---

## T-03 – Server-personvern

**Status:** IMPLEMENTERT

```bash
npm run test-server-privacy
```

---

## T-04 – UI-regresjon

**Status:** IMPLEMENTERT

```bash
npm run test-ui-regression
```

---

## T-05 – Historikk

**Status:** BESTÅTT VED SISTE KONTROLL

```bash
npm run test-history-hotfix
```

---

## T-06 – Samtaleboble-regresjon

**Status:** BESTÅTT VED SISTE KONTROLL

```bash
npm run test-bubble-cleanup
```

En tidligere versjon av testen feilet fordi den kontrollerte en foreldet CSS-kommentar fremfor faktisk funksjonalitet.

Testen ble korrigert fremfor å endre fungerende produksjonskode.

---

## T-07 – KI-tester

**Status:** IMPLEMENTERT

```bash
npm run test-ai
npm run test-ai:full
npm run test-ai:stress
npm run test-ai:stress:full
npm run test-ai:stress:problems
npm run test-ai:golden
npm run test-ai:occupation-golden
npm run test-golden-schema
```

KI-testene gjør faktiske modellkall og krever API-konfigurasjon.

Golden/fasitbanken inneholder nå **66 caser**. De 26 tidligere generelle/pilotcasene er supplert med 40 strenge yrke/sektor/tariff/kilde-caser: 28 sektorcaser, 8 arbeidsgiver-/tariffcaser og 4 kildelekkasjecaser.

Den dokumenterte live-kjøringen 26.10.2026 omfattet **21 caser** mot GPT-5.6 Luna og ga **19 maskinelt OK + 2 manuelt akseptert etter kontroll**, 0 kritiske avvik og 0 tekniske feil.

Etter senere utvidelse til 26 caser ble hele produksjonsflyten kjørt. Første kjøring avdekket tre falske personverntreff før KI-kall; etter retting nådde **26/26** fram til KI-svar. Historiske 9/9- og 21-case-resultater beholdes som tidligere teststeg, men skal ikke beskrives som dagens testbank.

Etter utvidelsen til 66 golden/fasitcaser ble de **40 strenge yrke/sektor/tariff/kilde-casene** kjørt separat live mot **gpt-5.6-luna** 09.11.2026. Første fullrunde ga **37 OK / 3 BØR SJEKKES / 0 kritiske / 0 tekniske**. De tre avvikene ble analysert hver for seg og viste henholdsvis en for rigid tema-fasit, en for grov testheuristikk og en reell svakhet i kildeprioriteringen for statsansatteloven. Etter retting og regresjonstesting ga sluttkjøringen **40/40 OK, 0 BØR SJEKKES, 0 kritiske avvik og 0 tekniske feil**.

Dette resultatet dokumenterer samsvar med prosjektets definerte fasit og kilde-/sikkerhetsregler i disse 40 casene. Det er ikke en garanti for at en stokastisk språkmodell alltid vil gi korrekt eller optimalt svar i alle framtidige saker.

---

## T-08 – Modell-sammenligning

**Status:** IMPLEMENTERT

```bash
npm run test-model-compare
```

Testen støtter blind sammenligning av KI-modeller.

---

## B. Opprinnelig leveransestatus fra PRD

# 13. Status ved levering

| Område | Status | Bevis |
|---|---|---|
| Webapplikasjon | Implementert | `app.js`, `index.html`, `server.js` |
| KI-veiledning | Implementert | server + systemprompt |
| 9 hovedtemaer | Implementert | app + faggrunnlag |
| Personverngateway | Implementert/testet | 73/73 i siste dokumenterte personvernpakke |
| Samtaleøvelse | Implementert/testet | 24/24 tester |
| Autentisering | Implementert | Supabase/server |
| Historikk | Implementert | Supabase/regresjonstest |
| Roller | Implementert | app/server |
| Admin | Implementert | app/server |
| Modellvalg | Implementert i prototypeform | admin/server |
| Benchmark | Prototype/testform | 114 saker synkronisert med 48 undertemaer |
| KI-testing | Implementert / utvidet | 66 golden/fasitcaser, 28/28 deterministic sektor-golden og dokumentert live occupation-golden 40/40 mot gpt-5.6-luna 09.11.2026 |
| Faggrunnlag | Implementert | `docs/faggrunnlag/` |
| SOURCEBANK | Implementert | `docs/`, `data/` |
| Brukertesting | Pilot gjennomført / videre evaluering | brukertestplan, backlog og dokumenterte produktendringer |
| Web/kildeanalyse | Delvis/prototype | server/admin |
| Lukket/offline løsning | Videre arbeid, men arkitektur er tilrettelagt | provider-abstraksjon, SOURCEBANK, lokal RAG-/intern KI-målarkitektur |

---

## C. Daterte tillegg fra PRD – bevart i sin helhet

# Tillegg – faglig transparens og brukerinnsyn

## Produktkrav: Etterprøvbart faggrunnlag

**Status:** IMPLEMENTERT / DELVIS VIDEREUTVIKLING

Samtalestøtte skal ikke være en svart boks der brukeren må stole blindt på KI-genererte råd.

Når faglig grunnlag er relevant for et råd, skal løsningen så langt som mulig gjøre det mulig for brukeren å:

- se at rådet har faglig forankring
- se relevante kilder eller faggrunnlag
- åpne relevante fagtekster eller fagsider
- følge lenker til autoritative eksterne kilder når slike brukes
- undersøke grunnlaget selv før viktige beslutninger tas

Dette er særlig viktig ved spørsmål om:

- lovverk og formelle personalprosesser
- sykefravær og tilrettelegging
- varsling
- mobbing og trakassering
- vold og trusler
- HMS og sikkerhet

## Krav til KI og kildebruk

Systemet skal skille mellom:

1. konkret informasjon fra en kilde
2. faglig forankret veiledning
3. KI-modellens egen sammenstilling eller formulering

KI skal ikke fremstille modellens egen syntese som et direkte utsagn fra en kilde.

Kilder skal bare presenteres som støtte når de faktisk er relevante for påstanden eller rådet.

Systemet skal ikke konstruere eller finne på kilder dersom konkret kildegrunnlag ikke er tilgjengelig.

## Brukeropplevelse

Faggrunnlag skal være tilgjengelig uten å gjøre hovedveiledningen unødvendig tung.

Aktuelle løsninger kan være:

- kildehenvisninger i eller under KI-svaret
- «Les mer»
- sammenleggbare kildeområder
- relevante fagsider
- lenker til myndighetskilder eller annet faggrunnlag

Brukeren skal kunne velge hvor mye faglig detalj som ønskes.

## Sporbarhet

Kravet støttes av:

- `docs/faggrunnlag/`
- `docs/SOURCEBANK.md`
- `data/SOURCEBANK.json`
- `docs/ai/AI-SYSTEMPROMPT.md`
- `docs/ai/AI-RESPONSE-CONTRACT.md`
- `docs/ai/SAMTALEPARTNER-MODELL.md`
- `docs/bmad/UX-DESIGN-BMAD.md`

Prinsippet er at KI-støtte skal være **etterprøvbar**, ikke bare overbevisende formulert.

# Produksjonstillegg – v20.11.0 mobil/PWA

Pilotbruk viste at mobil er en faktisk brukerflate i prosjektet. Leveransen i v20.11.0 omfatter derfor:

- responsiv mobilvisning for hovedflytene
- egen mobilnavigasjon og mobiltilpasset toppfelt
- bedre breddeutnyttelse i Samtaleøvelse
- tydelig og klikkbar merkevare/illustrasjon
- PWA-manifest, appikoner og service worker
- installasjonsveiledning og standalone-visning i støttede nettlesere
- komplette kildehenvisninger i Hjelp

PWA er et installasjonslag rundt webapplikasjonen, ikke en separat native Android/iOS-applikasjon. Browserstøtte kan variere. Kjernefunksjonen skal fortsatt fungere som vanlig webapp dersom installasjon ikke tilbys.

Fysisk mobiltest på Samsung/Chrome brukes som supplement til testene for pilot-UX og PWA, fordi statiske tester ikke kan dokumentere all faktisk nettleser- og installasjonsatferd.


# Historisk bakgrunn – pilotkrav 30.10.2026

FR-19–FR-23 ble identifisert etter pilotbruk, og er nå samlet i hoveddelen § 8 slik at de er del av den gjeldende kravoversikten. Dette historiske avsnittet forklarer opprinnelsen uten å opprette konkurrerende krav.

# Historiske tillegg – vedlikeholdbarhet og kildepresisjon 08.11.2026

FR-15A og NFR-QA-01 er nå samlet med henholdsvis FR-kravene i § 8 og NFR-kravene i § 10. Nedenstående tilleggsbeskrivelser bevares som datert endringshistorikk og er også styrende gjennom NFR-05 (modularisering) og FR-16/FR-22 (kildeavgrensning).

## NFR – modulær frontend-styling
Den tidligere ca. 9 389 linjer lange CSS-filen er delt i `styles-core.css`, `styles-responsive.css` og `styles-overrides.css`, med `styles.css` som stabilt inngangspunkt. Delingen skal bevare cascade-rekkefølgen og redusere regresjonsrisiko.

## Kildekrav – profesjonsavgrensning
Yrkes-/sektorkilder skal kunne avgrenses på både sektor og konkret yrke. Antall kilder er ikke et kvalitetsmål i seg selv; feil eller for brede kilder er verre enn ingen særkilde.


## Tillegg 08.11.2026 – krav til kildeautoritet

**Status: IMPLEMENTERT I MAIN / PRODUKSJONSDEPLOY MÅ VERIFISERES**

Samtalestøtte skal ikke behandle alle kilder som likeverdige.

Produktkrav:
- bindende rettslige påstander skal forankres i gjeldende lov/forskrift når tilgjengelig
- tariff-/hovedavtale skal bare brukes konkret når riktig avtaleområde er avklart
- myndighetsveiledning skal ikke fremstilles som selvstendig lovhjemmel
- Akan og IA skal ikke fremstilles som lov
- forskning og faglige rammeverk skal ikke brukes til å fastslå juridiske plikter
- brede myndighetsoversikter skal kunne brukes som retrieval-start, men ikke som direkte hjemmel
- arbeidsgivertype skal aldri defaultes eller gjettes
- tariffkontekst skal kunne være relevant uten valgt yrke
- yrkes-/sektorkilder skal kunne registreres og vises som kuraterte `source_ids`
- samme URL skal ikke ligge flere ganger i bankene for å skape kunstig kildevolum

Regresjonsvern: `tests/test-source-policy.cjs`.


## Testbevis og begrensning

Den automatiske quality-gaten dokumenterer deterministic kode-, data-, routing-, kilde-, personvern- og regresjonskvalitet. Den skal ikke brukes som bevis for at en ekstern stokastisk språkmodell alltid gir optimalt formulert svar.

De 40 strenge yrkes-golden-casene er nå faktisk kjørt live mot `gpt-5.6-luna` 09.11.2026 og ga **40/40 OK, 0 BØR SJEKKES, 0 kritiske avvik og 0 tekniske feil** i sluttkjøringen. Resultatet skal omtales som et dokumentert regressjonsresultat for disse casene, ikke som en generell faglig eller juridisk garanti.

Full verifikasjonsrapport:
`docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`.

## Hvordan vedlegget brukes

Ved uenighet mellom datert historikk og ny nåstatus skal presis kodedato, testkjøring og produksjonsstatus brukes. Selve normative kravformuleringen skal endres i `PRD.md`; ny vurdering/testlogg legges i testplan og `REVISJON-IBE160-2026-11-18.md` uten å viske ut eldre opplysninger.
