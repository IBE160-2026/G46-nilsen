# Gjennomgang av yrkes- og sektorkilder – 08.11.2026

## Mål

Alle yrkene i `OCCUPATION-SOURCE-MAP.json` er gjennomgått med spørsmålet:

> Finnes det autoritativt særregelverk, profesjonskrav, etiske retningslinjer, autorisasjons-/sertifikatkrav eller sektorbestemmelser som faktisk kan endre råd i en krevende medarbeidersamtale?

Målet er ikke å gi hvert yrke en kunstig egen lov. Mange stillinger reguleres korrekt av arbeidsmiljøloven, virksomhetens rutiner og sektorens HMS-regler. En særkilde legges bare inn når den gir reell ekstra presisjon.

## Kildemodell

Registeret har nå 62 autoritative startkilder.

En kilde kan avgrenses til:
- hele sektoren
- konkrete yrker via `occupations`
- konkrete situasjoner via `useFor`
- kun relevant kontekst via `contextualOnly`

Dette hindrer at et særregelverk for ett yrke brukes på et annet yrke bare fordi de deler sektor.

## Sektorgjennomgang

### Utdanning og oppvekst
Yrker: lærer, barnehagelærer, spesialpedagog, barne- og ungdomsarbeider, SFO/AKS-medarbeider, skoleleder, barnehagestyrer, miljøarbeider, barnehageassistent, lærerassistent, skoleassistent, miljøterapeut, pedagogisk leder.

Autoritative sektorkilder dekker skole/opplæring, barnehage og taushetsplikt. Her er sektorens regelverk ofte mer relevant enn en egen lov for hver stilling. Ingen kunstige profesjonskilder er lagt inn bare for å øke antallet.

### Helse og omsorg
Yrker: ambulansearbeider, apotektekniker, bioingeniør, ergoterapeut, fotterapeut, fysioterapeut, helsefagarbeider, helsesekretær, hjemmehjelp, jordmor, lege, legesekretær, omsorgsarbeider, pleiemedarbeider, psykolog, radiograf, sykepleier, tannlege, tannpleier, vernepleier.

Helsepersonelloven og autorisasjons-/lisensreglene er sentrale. `fotterapeut` ble flyttet hit fra Handel/service. Hjemmehjelp og pleiemedarbeider er ikke automatisk autorisert helsepersonell og skal derfor ikke få autorisasjonskilden bare på stillingstittel.

### Offentlig forvaltning og juss
Yrker: saksbehandler, rådgiver, jurist, advokat, HR-rådgiver, forvaltningsmedarbeider, NAV-medarbeider, kommunal rådgiver, statlig rådgiver, konsulent, førstekonsulent, seniorkonsulent, sekretær, arkivar.

Forvaltningsloven er lagt inn for relevante forvaltningsroller. Statsansatteloven og statens etiske retningslinjer er avgrenset til statlige roller. Advokat har egen profesjonskilde.

### Forsvar, politi og beredskap
Yrker: Forsvaret, politi, kriminalomsorg, brann og redning, vekter, sikkerhetsmedarbeider, beredskapsmedarbeider, soldat, offiser, befal, fengselsbetjent, brannkonstabel.

Dette var den største svakheten i tidligere register og er vesentlig utvidet:
- politi: etiske retningslinjer, politiinstruksen, medarbeiderplattform
- kriminalomsorg/fengselsbetjent: kriminalomsorgens regelverk/retningslinjer
- vekter/sikkerhetsmedarbeider: vaktvirksomhet
- Forsvaret/soldat/offiser/befal: Forsvarets regelverk, forsvarsloven, Forsvarets grunnsyn på ledelse
- brann: DSBs brann-/redningsregelverk
- sikkerhetsklarering: NSM ved relevant kontekst

`beredskapsmedarbeider` er bevisst ikke gitt én generell særkilde fordi tittelen kan finnes i svært ulike virksomheter.

### Produksjon og industri
Yrker: produksjonsmedarbeider, prosessoperatør, industrimekaniker, sveiser, maskinoperatør, fabrikkarbeider, næringsmiddelarbeider, driftsoperatør, montør, pakkerimedarbeider, lageroperatør, CNC-operatør.

For de fleste rollene er generelt HMS-/arbeidsutstyrsregelverk riktig nivå. Næringsmiddelarbeider har mattrygghets-/hygienekilde. Elektrisk særregelverk skal ikke lenger brukes på hele industrisektoren uten yrkesmatch.

### Bygg, anlegg og tekniske fag
Yrker: tømrer, snekker, elektriker, rørlegger, anleggsarbeider, anleggsmaskinfører, mekaniker, ingeniør, driftstekniker, maler, murer, betongarbeider, taktekker, blikkenslager, ventilasjonstekniker, bilmekaniker, automatiker.

Elsikkerhetskilden er nå avgrenset til faktiske elektrofaglige roller. For øvrige roller er arbeidsmiljø/HMS, arbeid i høyden, arbeidsutstyr og virksomhetens sikkerhetsrutiner normalt riktigere enn et oppdiktet yrkesspesifikt lovsett.

### Fiskeri, havbruk og sjø
Yrker: fisker, oppdrettsoperatør, driftsleder oppdrett, fiskehelsepersonell, matros, skipsfører, maskinist, fiskeindustriarbeider, dekksarbeider, havbruksarbeider, oppdrettsmedarbeider, styrmann.

Sektoren har omfattende særregelverk: akvakultur, Sjøfartsdirektoratets regler, internkontroll akvakultur, arbeid/hvile og maritime sertifikater. Fiskehelsepersonell får i tillegg dyrehelsepersonellkilder.

### Transport og logistikk
Yrker: bussjåfør, lastebilsjåfør, varebilsjåfør, lagerarbeider, logistikkmedarbeider, terminalarbeider, togpersonell, flyplassmedarbeider, taxisjåfør, sjåfør, budbilsjåfør, bud, postbud, truckfører, lokfører, konduktør.

Sjåførkilder er snevret inn til de yrkene de gjelder for. Buss/lastebil har yrkessjåførkompetanse; taxi/buss kan ha kjøreseddel; lokfører har førerforskrift/sertifikatkrav. Lager-/terminalroller beholder primært HMS/arbeidsutstyrsregler.

### Handel, service, hotell og servering
Yrker: butikkmedarbeider, butikkleder, selger, kundeservicemedarbeider, kokk, servitør, hotellmedarbeider, resepsjonist, renholder, frisør, hudpleier, massør, barista, baker, konditor, kantinemedarbeider, kassemedarbeider, butikkansatt, renholdsoperatør, vaktmester.

Tidligere hadde sektoren ingen særkilder. Nå er blant annet lagt inn:
- mattrygghet/hygiene for matroller
- serveringsloven for relevante serverings-/hotelroller
- hygieneforskrift for frisør/hudpleie
- godkjenningsordning for renholdsvirksomheter

Vanlige butikk-/kundeservicestillinger har normalt ikke eget profesjonslovverk.

### Kontor, økonomi, finans og IT
Yrker: kontormedarbeider, regnskapsfører, revisor, økonom, HR-medarbeider, prosjektleder, utvikler, IT-drift, cybersikkerhet, supportmedarbeider, sekretær, administrasjonsmedarbeider, lønnskonsulent, bankrådgiver, forsikringsrådgiver, systemutvikler, IT-konsulent, dataanalytiker, markedsfører.

Regnskapsfører og revisor har fått egne autoritative profesjonskilder. Finansregelverk skal ikke lenger automatisk vises til alle IT-/kontorroller. NSM-kilden brukes bare når informasjonssikkerhet/sikkerhetsforhold faktisk er relevant.

### Veterinær, dyrehelse og dyr
Yrker: veterinær, dyrlege, dyrepleier, fiskehelsebiolog, dyreklinikkmedarbeider, dyreholder, hundefrisør, dyrepasser, kennelmedarbeider.

Veterinær/dyrlege/dyrepleier/fiskehelsebiolog har særkilder for dyrehelsepersonell og journalføring. Andre dyreyrker styres i hovedsak av dyrevelferd og virksomhetens ansvar, ikke autorisasjonsregler de ikke omfattes av.

### Offshore, energi og kraft
Yrker: offshorearbeider, prosessoperatør offshore, plattformarbeider, energimontør, kraftverksoperatør, petroleumsingeniør, elektroingeniør, energitekniker, prosessingeniør.

Havindustritilsynets HMS-regelverk gjelder bredt for petroleumsvirksomheten. Elsikkerhet er avgrenset til relevante elektrofaglige yrker.

### Landbruk, skogbruk og natur
Yrker: bonde, gårdbruker, landbruksarbeider, avløser, gartner, skogbruker, skogsarbeider, reindriftsutøver, anleggsgartner, skogsmaskinfører, naturforvalter.

Plantevern-/autorisasjonskilde er lagt inn for relevante roller. Reindriftsutøver har fått reindriftsloven. Dyrevelferd brukes der dyrehold faktisk er del av situasjonen.

### Luftfart
Yrker: pilot, kabinansatt, flyvert, flyvertinne, flytekniker, flymekaniker, flygeleder, bakkeoperatør, bagasjemedarbeider, luftfartsmedarbeider, ground handling-medarbeider, check-in-medarbeider.

Sektoren har Luftfartstilsynets generelle regelverk og arbeidstidsbestemmelser for flygende. Pilot/kabin/flygeleder/flytekniker er i tillegg koblet mot Luftfartstilsynets sertifikat-/utdanningskilde. Ground handling og øvrige bakkeroller skal ikke få flygersertifikatregler bare fordi de jobber i luftfarten.

## Konklusjon

Dekning må måles i **presisjon**, ikke antall lenker per yrke.

Et godt resultat er:
- særkilde der yrket faktisk har særkrav
- sektorkilde der reglene gjelder hele arbeidsområdet
- bare generelle arbeidslivskilder der det ikke finnes et relevant profesjonsregelverk
- ingen regelverkskilde når situasjonen er en ordinær mellommenneskelig samtale uten regelverksrelevans

Det er bedre at et yrke har null kunstige profesjonskilder enn at systemet gir brukeren feil regelverk.


## Supplerende funn i sluttgjennomgangen

Den siste tverrsektorielle kontrollen avdekket fire ytterligere særkilder:

- **truckfører / anleggsmaskinfører / relevant maskinoperatør:** Arbeidstilsynets krav til dokumentert og sertifisert sikkerhetsopplæring for arbeidsutstyr
- **elektriker / automatiker / relevante energi-/elektrofag:** DSBs kvalifikasjonskrav for arbeid på elektriske anlegg og elektrisk utstyr
- **apotektekniker:** apoteklovens krav til apotekets personale og kompetanse
- **sjøfolk:** STCW-opplæringskrav som fra 2026 omfatter forebygging og håndtering av vold, trakassering, seksuell trakassering, mobbing og seksuelle overgrep

Dette løftet registeret til 62 autoritative yrkes-/sektorkilder.
