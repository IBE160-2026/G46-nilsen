# Yrkes- og regelverkslag i Samtalestøtte

## Implementasjonsstatus per 08.11.2026

Yrkes-/regelverkslaget er implementert i `main` som data-, ruting-, server-, UI- og testarkitektur. Det finnes lokal yrkesruting, kildekart, yrkesavgrensede særkilder og egne regresjonstester. Serveren beholder feature flagget `OCCUPATION_CONTEXT_ENABLED` som driftskontroll, men produksjonskoden har nå det valgfri yrkesfeltet og hele kjeden fra brukerinput til kildekontekst.

08.11.2026 ble kildemodellen utvidet slik at én kilde kan avgrenses til konkrete yrker via `occupations`. Dette hindrer at regler for eksempelvis politi, revisor eller elektriker lekker til andre yrker i samme brede sektor.

## Formål

Dette laget skal gjøre Samtalestøtte i stand til å tilpasse råd til arbeidsområde, yrke og relevant regelverk uten å gjøre yrkesvalg obligatorisk eller overstyre den menneskelige samtalen.

Hovedregelen er:

> Yrke brukes bare når det faktisk endrer risiko, rettslig ramme eller praktisk anbefaling.

Et samlivsbrudd, sorg eller en ordinær samarbeidskonflikt skal derfor normalt håndteres likt uavhengig av om brukeren har valgt lærer, sykepleier, pilot eller oppdrettsoperatør.

## Arkitektur

### 1. OCCUPATION-SOURCE-MAP.json

Inneholder lokal taksonomi for:
- arbeidsområder
- vanlige yrker
- aliases og friteksttreff
- primærmyndigheter
- typiske regelverksområder
- risikotriggere

Dette laget brukes uten KI-kall.

### 2. OCCUPATION-LEGAL-SOURCES.json

Inneholder godkjente autoritative startkilder:
- myndighet
- offisiell URL
- hvilke sektorer kilden gjelder
- valgfri avgrensning til konkrete yrker (`occupations`)
- hvilke rettslige spørsmål kilden egner seg for
- om kilden er tidskritisk

Juridiske påstander skal ikke bygges på modellhukommelse alene når feltet er tidskritisk.

### 3. occupation-router.js

Ruteren avgjør:
1. om yrke er valgt
2. om yrket er relevant for den konkrete situasjonen
3. om fritekstyrket kan klassifiseres lokalt
4. om uttrykket er tvetydig
5. hvilke sektor- og profesjonskilder som kan være aktuelle

Ruteren skal unngå unødvendige KI-kall. Hvis brukeren skriver «bibliotekar» i en samtale om samlivsbrudd, skal systemet ikke bruke et KI-kall bare for å klassifisere yrket.

Hvis brukeren skriver «lakseoppdrett» i en sikkerhetskritisk situasjon, skal lokal aliasmatching rute direkte til havbruk/akvakultur.

Tvetydige uttrykk skal aldri få et vilkårlig lokalt treff. Eksempel: «verksted» kan peke mot både industri og tekniske fag. Slike tilfeller markeres som tvetydige og kan avklares med kontekst eller ett klassifiseringskall.

## Kildehierarki

1. Ansvarlig myndighets egen side eller veileder
2. Lovdata – gjeldende lov eller forskrift
3. Offentlig rundskriv eller tolkningsuttalelse
4. Faglig kilde
5. Sekundærkilde bare når primærkilder ikke dekker behovet

## Når yrke normalt skal ignoreres

- samlivsbrudd
- sorg og tap
- omsorgsbelastning
- ordinær kollegakonflikt
- kommunikasjon og tone
- ordinære prestasjons- og forventningssamtaler uten sektorbestemt risiko

Yrket kan likevel bli relevant hvis situasjonen samtidig beskriver konkret sikkerhetsrisiko, arbeidstidsregler, taushetsplikt, autorisasjon, meldeplikt eller annet spesialregelverk.

## Når yrke normalt skal brukes

Eksempler:
- påvirket pilot før operativ tjeneste
- påvirket bussjåfør før kjøring
- sykepleier med pasientsikkerhetsrisiko
- elektriker som omgår elsikkerhetsrutiner
- skipsfører med spørsmål om vakt/hvile
- oppdrettsoperatør med båt/maskin og sikkerhetsrisiko
- veterinær med mulig pliktbrudd i journalføring
- lærer i sak som konkret gjelder elevsikkerhet

## Web- og KI-policy

### Ingen KI-kall
Bruk lokal taksonomi når:
- yrket finnes i listen
- fritekst matcher et kjent alias
- yrket er irrelevant for saken

### Ett klassifiseringskall
Kan brukes når:
- fritekstyrket er relevant
- lokal matching ikke finner en sikker sektor
- eller treffet er tvetydig og situasjonen gir nok kontekst til klassifisering

Klassifiseringen caches i samtalekonteksten.

### Ferskt kildeoppslag
Skal vurderes når:
- brukeren spør direkte hva loven sier
- saken gjelder sikkerhetskritisk arbeid
- arbeidstid/hviletid er sektorregulert
- autorisasjon eller profesjonsansvar er relevant
- taushetsplikt/meldeplikt er sentralt
- mulig oppsigelse, reaksjon eller annet formelt tiltak krever rettslig presisjon
- den lagrede kilden er markert tidskritisk

## Evalueringsstrategi

OCCUPATION-BENCHMARK-CASES.json inneholder både positive og negative kontroller.

Positive kontroller tester at riktig sektor og myndighet tas i bruk.

Negative kontroller tester at systemet ikke «overjuridifiserer» en vanlig samtale bare fordi et yrke er valgt.

Feil som skal regnes som alvorlige:
- irrelevant sektorloven trekkes inn
- myndighet eller regelverk hallusineres
- systemet klassifiserer fritekstyrke med KI selv om yrket er irrelevant
- tvetydige aliases får et vilkårlig treff
- modellen presenterer veiledning som bindende lov
- modellen gir bastante juridiske konklusjoner uten fersk autoritativ kilde

## Status etter kildegjennomgang 08.11.2026

Det autoritative arbeidsgiver-/yrkes-/sektorregisteret er utvidet fra 31 til 86 kilder. Alle yrkene i kildekartet er gjennomgått. Prinsippet er at et yrke bare skal få egen profesjonskilde når det faktisk finnes særregler, sertifikatkrav, autorisasjon, etiske retningslinjer eller tilsvarende som kan endre rådet. Vanlige stillingstitler skal ikke få kunstige «egne lover» dersom generelt arbeidsmiljø-/HMS- eller sektorregelverk er riktig nivå.

Detaljert gjennomgang: `docs/OCCUPATION-SOURCE-AUDIT-2026-11-08.md`.

## Videre arbeid

1. Ferskhetskontroll for tidskritiske rettskilder.
2. Flere negative kontroller når nye profesjonskilder legges inn.
3. Manuell/ekspertfaglig kvalitetssikring av de mest risikofylte sektorene.
4. Utvide dekning bare der gjennomgangen finner reelle profesjonskrav.
5. Fortsette å teste at ordinære mellommenneskelige samtaler ikke overjuridifiseres.


### Verifikasjonsregel 08.11.2026

Yrkesarkitekturen har nå et eksplisitt negativt kvalitetskrav: det er ikke nok at riktig profesjonskilde kan velges. Ruteren må også dokumentert klare å **la være** å aktivere yrkeskontekst når yrket ikke endrer saken.

Dette verifiseres med 28 sektor-golden-caser:
- 14 relevante
- 14 irrelevante
- forventede og forbudte yrkeskilder

`authority_index` krever situasjonstreff, og negert kontekst skal ikke aktivere en profesjonskilde.

Se `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`.
