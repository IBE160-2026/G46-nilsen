# Dokumentasjonssynk – 08.11.2026

## Formål

Dette dokumentet synkroniserer dokumentasjonen med endringene som faktisk ble gjort i `main` 08.11.2026. Det skal brukes sammen med commit-historikken, ikke som erstatning for den.

## 1. Yrkes- og sektorkontekst i produksjonskoden

Yrkes-/sektorlaget ble flyttet fra delvis backend-arkitektur til en faktisk sluttbrukerflyt i produksjonskoden:

- valgfritt arbeidsområde/yrke kan fylles inn
- yrke brukes bare når arbeidskontekst, risiko eller særregelverk faktisk er relevant
- lokal ruting brukes før KI-klassifisering
- negative formuleringer som «ikke sikkerhet», «ingen HMS-problem» og tilsvarende skal ikke aktivere yrkeskilder
- generelle arbeidslivskilder skilles fra særkilder
- kilder kan nå avgrenses til konkrete yrker, ikke bare hele sektorer

Sentrale filer:
- `data/OCCUPATION-SOURCE-MAP.json`
- `data/OCCUPATION-LEGAL-SOURCES.json`
- `src/server/occupation-router.js`
- `src/server/occupation-context.js`
- `tests/test-occupation-router.cjs`
- `tests/test-occupation-data.cjs`
- `tests/test-occupation-context.cjs`

## 2. Yrkeskildene ble gjort mer presise

Det autoritative yrkes-/sektorregisteret ble utvidet fra 31 til 62 kilder.

Ny modell:
- `sectors` angir relevant arbeidsområde
- valgfri `occupations` avgrenser kilden til konkrete yrker
- `useFor` angir hvilke situasjoner kilden kan være relevant for
- `contextualOnly` hindrer at en kilde trekkes inn bare fordi yrket er valgt
- tidskritiske rettskilder skal fortsatt kontrolleres mot gjeldende originalkilde

Eksempler på nye eller tydeligere profesjonskilder:
- politiets etiske retningslinjer
- politiinstruksen
- medarbeiderplattformen i politiet
- kriminalomsorgens regelverk/retningslinjer
- vaktvirksomhet
- Forsvarets regelverk, forsvarsloven og Forsvarets grunnsyn på ledelse
- forvaltningsloven, statsansatteloven og etiske retningslinjer for statstjenesten
- autorisasjon/lisens for helsepersonell
- regnskapsfører- og revisorregelverk
- kjøre-/kompetansekrav for yrkessjåfører
- lokførerregler
- maritime sertifikater og kvalifikasjoner
- serverings-, hygiene- og renholdsregelverk
- reindriftsloven
- luftfartssertifikater og utdanningskrav
- offshore/HMS-regelverk

Taksonomien ble også korrigert: `fotterapeut` er flyttet fra Handel/service til Helse og omsorg fordi yrket hører til autorisert helsepersonell.

## 3. Kildevisning og faglig transparens

Hjelp-siden ble endret fra en blanding av statisk og dynamisk kildevisning til én dynamisk kildebank.

Fire hovedkategorier:
1. Lovverk og myndigheter
2. Forskning og evidens
3. Faglig rammeverk
4. Yrkes- og sektorkilder

Prinsipper:
- kilder sorteres alfabetisk etter navn
- yrkes-/sektorkilder ligger i egen hovedkategori
- en klikkbar kilde viser hva den brukes til
- yrkesavgrensede kilder viser hvilke yrker de særlig gjelder for
- generelle arbeidslivskilder skal ikke dupliseres under hvert yrke

En eldre statisk kildeliste ble fjernet fra `index.html`.

## 4. Kildehenvisninger i råd

Produksjonskoden ble også strammet inn slik at:
- fagtekst og kildegrunnlag skal samsvare
- korte klikkbare kildehenvisninger kan vises sammen med råd
- kildepresisjon inngår i negative/adversarial tester
- generiske ord som «oppfølging» skal ikke trekke inn irrelevante særkilder

## 5. CSS-opprydding

Sensorinnspill om en svært lang CSS-fil ble fulgt opp.

Før:
- `styles.css`: ca. 195 KB / 9 389 linjer

Etter:
- `styles.css`: lite inngangspunkt med imports
- `styles-core.css`: grunnlayout, komponenter og hovedstiler
- `styles-responsive.css`: responsiv/mobil/PWA-relatert styling
- `styles-overrides.css`: senere versjonsvise justeringer/overrides

Reglene ble splittet i samme rekkefølge som før for å bevare CSS-cascade og redusere regresjonsrisiko. PWA-cachen inkluderer de nye CSS-filene.

## 6. Distribusjonsfunn

En viktig feilretting 08.11 var ikke i applikasjonslogikken, men i deployflyten:

- GitHub `main` hadde nyere commits
- Render-produksjonen sto fortsatt på en eldre commit
- dette gjorde at flere kildebankendringer ikke var synlige
- produksjonsdeploy ble derfor kontrollert mot faktisk commit og manuelt trigget fra riktig `main`

Læring: «pushet til main» er ikke det samme som «verifisert live». Distribusjonsstatus må kontrolleres eksplisitt ved tvil.

## 7. Tester

Yrkesrutingen har fått nye regresjoner som kontrollerer at profesjonskilder ikke lekker mellom yrker i samme sektor, blant annet:
- politi får politiets etiske retningslinjer
- brannkonstabel får ikke politiets etiske retningslinjer bare fordi begge ligger i samme sektor
- regnskapsfører får regnskapsførerregelverk
- utvikler får ikke regnskapsførerregelverk

## 8. Videre teknisk opprydding

CSS er nå modulært splittet. De neste åpenbare vedlikeholdskandidatene er:
- `app.js` (stor klientfil med flere ansvarsområder)
- `server.js` (stor serverfil med mange endepunkter)
- historiske dokumenter/changelog som kan arkiveres per release uten å miste sporbarhet

Disse bør deles kontrollert etter ansvar og med regresjonstester, ikke gjennom en stor engangsrefaktorering.
