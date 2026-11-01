# Yrkes- og regelverkslag i Samtalestøtte

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
- hvilke rettslige spørsmål kilden egner seg for
- om kilden er tidskritisk

Juridiske påstander skal ikke bygges på modellhukommelse alene når feltet er tidskritisk.

### 3. occupation-router.js

Ruteren avgjør:
1. om yrke er valgt
2. om yrket er relevant for den konkrete situasjonen
3. om fritekstyrket kan klassifiseres lokalt
4. om uttrykket er tvetydig
5. hvilke sektorkilder som kan være aktuelle

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

## Videre arbeid

1. Utvide kilderegisteret per sektor.
2. Legge til flere negative kontroller.
3. Lage kildeferskhetskontroll.
4. Koble ruteren til serverens kontekstbygging bak feature flagg.
5. Kjør full lokal regressjon før UI kobles på.
6. Først deretter legge inn valgfritt arbeidsområde/yrke i grensesnittet.


## Lokal mini-kildebank og offline-modus

Yrkeslaget er utvidet med en versjonert lokal kunnskapspakke under `knowledge/`.

Strukturen skiller mellom:
- `knowledge/core/` – felles arbeidslivsprinsipper
- `knowledge/sectors/` – små sektorbanker for alle støttede yrkesgrupper
- `knowledge/research/` – forskningsgrunnlag som forklarer hvorfor generelle samtaleprinsipper anbefales
- `knowledge/manifest.json` – versjon, filer og synkroniseringspolicy

Sektorbankene lagrer ikke kopier av hele nettsider. De inneholder korte kuraterte prinsipper og `source_ids` som peker til autoritative kilder eller eksisterende forskningskilder. Dette reduserer duplisering, gjør pakken egnet for offline-bruk og gjør det mulig å kontrollere hvor et råd kommer fra.

### Foreslått synkronisering

Tre kunnskapsnivåer skal kunne eksistere samtidig:

1. **Bundled baseline** – følger appen og virker uten nett.
2. **Last known good** – siste validerte kunnskapspakke som ble lastet ned mens appen var online.
3. **Fresh online lookup** – ferskt autoritativt oppslag når saken krever oppdatert rettslig eller sikkerhetskritisk informasjon.

Når appen er online kan den senere kontrollere et lite versjonsmanifest. En ny kunnskapspakke skal først tas i bruk etter validering. Hvis oppdateringen feiler, beholdes forrige fungerende pakke.

Kilder og prinsipper som er merket `time_sensitive: true` skal ikke brukes til bastante påstander om gjeldende rett dersom fersk kontroll er nødvendig og nettilgang er tilgjengelig.

### Første kunnskapspakke

Første struktur omfatter alle sektorene i gjeldende taksonomi:
- utdanning og oppvekst
- helse og omsorg
- offentlig forvaltning og juss
- forsvar, politi og beredskap
- produksjon og industri
- bygg, anlegg og tekniske fag
- fiskeri, havbruk og sjø
- transport og logistikk
- handel, service, hotell og servering
- kontor, økonomi, finans og IT
- veterinær, dyrehelse og dyr
- offshore, energi og kraft
- landbruk, skogbruk og natur
- luftfart

Ved etablering av pakken ble alle interne `source_ids` kontrollert mot enten `OCCUPATION-LEGAL-SOURCES.json` eller `SOURCEBANK.json`.
