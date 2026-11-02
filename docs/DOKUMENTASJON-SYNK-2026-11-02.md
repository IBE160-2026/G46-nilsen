# Dokumentasjonssynk – 02.11.2026

Dette dokumentet er en sluttkontroll av faktiske produkt-, test- og dokumentasjonsopplysninger før innlevering. Formålet er å skille **gjeldende status** fra historiske tall og mellomstadier som fortsatt finnes i repoet som utviklingsspor.

## Gjeldende produktstatus

- **9 hovedtemaer**
- **48 gjeldende undertemaer**
- undertemataksonomien ble redusert fra tidligere 56 etter klarspråkgjennomgang, pilotbruk og tilbakemeldinger
- reduksjonen skyldtes vage, overlappende og unødvendig smale kategorier, ikke et mål om færre kategorier i seg selv
- dagens autoritative taksonomi ligger i `src/client-data.js` og `src/server/topic-contracts.js`

## Gjeldende testgrunnlag

- benchmarkbank: **114 saker**, minst to per gjeldende undertema
- golden/pilotbank: **26 caser**
- dokumentert live golden-kjøring 26.10.2026: **21 caser**, 19 maskinelt OK + 2 manuelt akseptert etter gjennomgang
- senere produksjonsflyt med 26 caser: etter retting av falske personverntreff nådde **26/26** fram til KI-svar
- dokumentert senere personvernpakke: **56/56**
- dokumentert simulatorkontroll: **24/24**

Historiske testresultater skal beholdes med dato og omfang. De skal ikke omskrives til dagens større testbank dersom de faktisk ble kjørt på et mindre sett.

## Funksjonsstatus

### Implementert kjerne
- strukturert situasjons- og samtalestøtte
- oppfølgingsdialog
- samtalesimulering
- personverngateway i klient og server
- innlogging og historikk
- roller/admin
- SOURCEBANK og kontrollert kildebruk
- PWA/installasjonslag og mobiltilpasning
- utskrift og videre råd

### Delvis implementert / feature-flagget
- yrkes-/sektorkontekst: backend, datagrunnlag, ruting og tester finnes i `main`, men funksjonen er ikke aktiv som ferdig produksjons-UI

### Videre arbeid / hypoteser
- direkte samtale som alternativ inngang
- tale/transkripsjon og opplesing
- full lokal RAG
- lukket produksjonsvariant med intern modell/database

## Formell versjon versus senere patcharbeid

Formelt produksjonsgrunnlag i dokumentasjonen er **20.11.5**. Det er gjort senere UI-, cache- og PWA-relaterte commits uten at `APP_VERSION` er løftet som en ny fullverifisert release.

Dokumentasjonen skal derfor skille mellom:
- formell appversjon
- senere commits/patcher
- fullverifisert release

Det skal ikke hevdes at en ny komplett `npm test` er kjørt på siste dokumentasjonscommit dersom dette ikke faktisk er gjort.

## Sensorfeedback som styringsgrunnlag

Faglærers tilbakemelding 26.10.2026 brukes som rettesnor for sluttføringen. Særlig viktige punkter er:

1. Vær åpen om at prototypen startet før full BMAD-formalisering.
2. Skill tydelig mellom kjerne, tillegg og videre arbeid.
3. Bruk testbare success criteria.
4. Skill mellom implementert, verifisert og planlagt.
5. Ikke framstill prosjektets golden-fasit som ekstern ekspertvalidering.
6. Vis hvordan høyrisikoområder fikk ekstra testdekning.
7. Dokumenter faktisk KI-styring, feil, regresjoner og menneskelig kontroll.
8. Sørg for sporbarhet mellom behov, krav, implementasjon og test.

## Dokumenter som bevisst skal beholdes historiske

Følgende dokumenttyper kan inneholde eldre tall uten at de er feil, så lenge historisk status er tydelig:

- faglærers opprinnelige tilbakemelding
- tidligere versjonshistorikk
- klarspråk-/taksonomiarbeidsdokumenter
- tidligere testkjøringer med datert omfang
- AI-logg som beskriver utviklingsfaser

Historie skal ikke «vaskes bort» for å ligne dagens produkt.

## Refleksjonsrapport

Nye sluttfasepunkter er samlet i `docs/REFLEKSJONSADDENDUM-2026-11-02.md`.

De viktigste punktene som skal flettes inn før endelig rapport er:
- reduksjonen 56 → 48 som produkt- og UX-læring
- feil miljø/branch etter kontekstoverføring mellom KI-samtaler
- eksplisitt verifisering av Git-gren og Render-service før commit/deploy
- semantisk avgrensning av KI-oppgaver og «skal ikke endres»
- dokumentasjonsdrift som egen kvalitetsrisiko
- forskjellen mellom implementert arkitekturlag og ferdig produksjonsfunksjon
