# Kildekvalitetsrevisjon – 08.11.2026

## Formål

Denne revisjonen vurderer om kildegrunnlaget i Samtalestøtte faktisk er egnet til å støtte en leder i krevende medarbeidersamtaler. Målet er ikke flest mulig lenker, men riktig kilde til riktig påstand.

Revisjonen omfatter:
- `data/SOURCEBANK.json`
- `data/OCCUPATION-LEGAL-SOURCES.json`
- `data/AGREEMENT-SOURCE-MAP.json`
- kildevalg i `server.js`
- yrkes-/tariffkontekst
- systemprompt og responskontrakt
- kildevisningen på Hjelp-siden
- relevante regresjonstester

## Konklusjon

Kildegrunnlaget er etter revisjonen egnet som et **kuratert start- og beslutningsstøttelag**, men ikke som en automatisk juridisk fasit.

Det viktigste kvalitetsgrepet er at kildene nå behandles etter funksjon og autoritet:

1. gjeldende lov/forskrift
2. gjeldende tariff-/hovedavtale når avtaledekning er avklart
3. myndighets-/offisiell arbeidsgiverveiledning
4. spesialisert arbeidslivsveiledning
5. forskning/evidens
6. faglige rammeverk

En kilde kan være god uten å være rettslig bindende. Systemet skal derfor aldri gjøre kildekvalitet om til én flat rangering.

---

## 1. Overordnet arbeidsgivergrunnlag

Dette laget skal være tilgjengelig selv om brukeren ikke har valgt yrke.

### Arbeidsmiljøloven

**Kvalitet:** primær rettskilde.

Registeret inneholder:
- full arbeidsmiljølov som overordnet startpunkt
- konkrete AML-bestemmelser i SOURCEBANK for blant annet varsling, psykososialt arbeidsmiljø, tilrettelegging og oppsigelse
- AML kapittel 9 som egen kilde for kontrolltiltak i virksomheten

AML skal ikke brukes bare fordi en samtale virker «formell». Det må være en faktisk kobling til lovens tema.

### Internkontrollforskriften

**Kvalitet:** bindende forskrift når den gjelder.

Brukes ved:
- systematisk HMS
- risikovurdering
- avvik
- opplæring
- ansvarsfordeling
- rutiner og forebygging

### Arbeidstilsynet

**Kvalitet:** primær myndighetsveiledning om arbeidsmiljøregelverket, men selve veiledningssiden er ikke en lov.

Kuraterte områder omfatter blant annet:
- arbeidsgivers HMS-plikter
- personalsaker
- psykososialt arbeidsmiljø
- mobbing/trakassering
- seksuell trakassering
- vold og trusler
- tilrettelegging
- varsling
- kontroll og overvåking
- risikovurdering
- oppsigelse
- lønn/allmenngjort minstelønn

Brede sider som «Arbeidstilsynets regelverk» er merket `authority_index`. De er gode oppslagsinnganger, men skal ikke alene brukes som dokumentasjon på en presis plikt.

### NAV

**Kvalitet:** autoritativ arbeidsgiverveiledning for sykefraværsoppfølging og NAV-prosesser.

Sentrale kilder:
- «Slik følger du opp sykmeldte»
- «Samtalestøtte for arbeidsgiver»
- arbeidsgiverveiledning om psykiske helseutfordringer

NAV brukes til praktisk sykefraværsoppfølging, frister og dialog med NAV. Konkrete rettslige påstander skal fortsatt forankres i relevant lov/forskrift når det er nødvendig.

### Personvern / Datatilsynet

**Kvalitet:** autoritativ personvernveiledning.

Brukes ved:
- behandling av ansattopplysninger
- kontrolltiltak
- e-post/elektronisk utstyr
- kamera/GPS
- arbeidslivspersonvern

Ved kontrolltiltak kombineres denne veiledningen med AML kapittel 9. Dette er viktig fordi personvernregler og arbeidsmiljølovens kontrolltiltaksregler kan gjelde samtidig.

### Likestillings- og diskrimineringsregelverket

**Kvalitet:** primær rettskilde via Lovdata.

SOURCEBANK inneholder konkrete bestemmelser om:
- trakassering
- aktivitetsplikt
- diskrimineringsforbud i arbeidsforhold
- likelønn

### Varsling

Varsling støttes av:
- AML kapittel 2 A
- Arbeidstilsynets veiledning om ansvar, rettigheter og roller
- egen myndighetskilde for virksomhetens interne varslingsrutiner

Dette gir både bindende regelverk og praktisk myndighetsveiledning.

### IA-avtalen 2025–2028

**Kvalitet:** nasjonalt treparts-/arbeidslivsrammeverk.

IA-avtalen skal **ikke** fremstilles som lov. Den brukes som rammeverk for forebygging, sykefravær, inkluderende arbeidsliv og partssamarbeid.

### Akan

**Kvalitet:** spesialisert arbeidslivsveiledning om rus, spill og arbeidsliv.

Akan skal ikke fremstilles som lov eller myndighetskrav.

Generiske triggere som «oppfølging» og «arbeidsliv» er fjernet fra yrkesregisterets Akan-kilder for å hindre at Akan trekkes inn i vanlige personalsaker uten rus-/spillkontekst.

---

## 2. Tariff og hovedavtaler

Tariff skal behandles separat fra lov.

### Staten

Statlig arbeidsgiverkontekst består av to forskjellige lag:

**Lov/arbeidsgiverstyring**
- statsansatteloven – primær rettskilde når arbeidsforholdet omfattes av loven
- etiske retningslinjer for statstjenesten – offisiell arbeidsgiver-/etikkreferanse, ikke lov

Begge filtreres på `employerType=state`, ikke på yrkestittel.

**Tariff/partssamarbeid**
- Hovedtariffavtalene i staten 2026–2028
- Hovedavtalen i staten, forlenget ut 2026
- Statens personalhåndbok

Statens personalhåndbok er et offisielt oppslagsverk for statlig arbeidsgiverpolitikk. Den er ikke en selvstendig lovhjemmel og brukes derfor som `official_employer_reference`.

### KS-området

Kuraterte kilder:
- KS Hovedtariffavtalen 01.05.2026–30.04.2028
- KS Hovedavtalen 01.01.2026–31.12.2029

Disse skal bare brukes når kommunal/fylkeskommunal avtaledekning faktisk er relevant og tilstrekkelig avklart.

### Helseforetak / Spekter

Kuraterte kilder:
- forhandlingssystem for helseforetakene 2026–2029
- Spekters oversikt over overenskomstområder

Spekter har ikke én universell hovedavtale/overenskomst som kan brukes for alle. Relevant hovedorganisasjon og overenskomstområde må avklares når konkrete rettigheter eller plikter skal omtales.

### Privat sektor

Systemet **antar ikke** én privat tariffavtale.

Årsak:
- mange private virksomheter er ikke tariffbundet
- avtale kan avhenge av virksomhet, arbeidsgiverorganisasjon, fagområde og arbeidstakerorganisasjon

Ved behov skal systemet spørre/avklare før konkret tariffkilde brukes.

---

## 3. Yrkes- og sektorkilder

Yrkeslaget brukes bare når yrket faktisk endrer:
- risiko
- profesjonsplikt
- autorisasjon/sertifikat
- taushets-/meldeplikt
- sikkerhetskrav
- formelle kompetansekrav
- særregulert arbeidstid/hvile
- relevant tjeneste-/etikkregelverk

Kilder kan avgrenses på:
- sektor
- konkret yrke
- situasjon / `useFor`
- `contextualOnly`

Dette hindrer eksempelvis at:
- politiets regler brukes for brannkonstabel
- regnskapsførerregler brukes for utvikler
- flygersertifikatregler brukes for bagasjemedarbeider
- helsepersonellregler brukes for ikke-autorisert omsorgsstilling

### Myndighetsindekser

Enkelte brede, offisielle sider er beholdt fordi de er gode innganger til ferskt regelverk, for eksempel:
- Finanstilsynets regelverk
- Sjøfartsdirektoratets regelverk
- Luftfartstilsynets lover og regler
- Havindustritilsynets regelverksoversikter
- Udirs regelverksoversikter

Disse er merket `authority_index`.

Regel:
> En authority_index er en oppslagsinngang, ikke dokumentasjon på en konkret rettslig påstand.

---

## 4. Forskning og evidens

SOURCEBANK har et eget forskningslag med blant annet:
- meta-analyser om konflikt, coaching og lytting
- psykologisk trygghet
- motivasjon / Self-Determination Theory
- feedback
- organisatorisk rettferdighet
- LMX/leder–medarbeider-relasjoner
- jobbkrav–ressurser

**Styrke:** empirisk grunnlag for hvordan samtaler, feedback, motivasjon og arbeidsmiljø kan forstås.

**Begrensning:** forskningen skal ikke brukes til å fastslå juridiske plikter eller som bevis for virksomhetens lokale regler.

Internasjonal forskning skal brukes med kontekstbevissthet; funn fra andre land eller domener er ikke automatisk direkte overførbare til norsk arbeidsrett eller en konkret personalsak.

---

## 5. Faglige rammeverk og formidling

Beholdte rammeverk omfatter blant annet:
- motiverende intervju fra Helsedirektoratet
- WHO mental health at work
- ILO om alkohol/rus i arbeidslivet
- relasjonsledelse
- forskningsformidling fra BI
- STAMI
- Akan

Disse har ulik evidensstyrke.

### Viktig om Helsedirektoratets MI-side

Den er en god faglig metodekilde, men er nå eksplisitt klassifisert som `professional_framework`, ikke som rettslig myndighetskilde.

### BI-artikler

BI-artiklene brukes som forskningsformidling, ikke som primær forskning eller rettskilde. Der det finnes direkte fagfellevurdert forskning i SOURCEBANK skal denne veie tyngre.

### WHO/ILO

Sterke internasjonale rammeverk, men ikke norsk lov. De kan støtte faglige prinsipper, ikke konkrete norske arbeidsgiverplikter.

---

## 6. Kilder som ble fjernet eller nedgradert

### Fjernet fra generell SOURCEBANK

**Forsvarets emneside «Veiledning som praktisk fundament for ledelse»**
- for smal
- emne-/kursside
- svak som generelt faglig kvalitetsanker

**College of Policing – Investigative interviewing**
- autoritativ i britisk politifaglig sammenheng
- for indirekte og kontekstuelt fjern fra norske medarbeidersamtaler
- ikke nødvendig når bedre samtale-/lytteforskning allerede finnes

**Weger et al. 2010 – aktiv lytting i peer-intervjuer**
- fagfellevurdert, men liten og indirekte studie
- fjernet fordi en nyere 2024-meta-analyse om lytting og arbeidsutfall gir betydelig sterkere grunnlag

**Burke et al. 2003 – klinisk MI-meta-analyse**
- god forskning i sin kliniske/endringsorienterte kontekst
- fjernet fra hovedbanken fordi ordinær lederdialog ikke skal behandles som terapi
- Helsedirektoratets MI-metode beholdes som forsiktig faglig rammeverk

### Avgrenset

**Forsvarets grunnsyn på ledelse**
- beholdt
- men bare relevant for Forsvaret-relaterte yrker/sektor

**FFI MOST**
- beholdt som forskning om Forsvaret
- ikke generell norsk arbeidslivsforskning

**DFØ / Statens arbeidsgiverportal**
- beholdt
- men avgrenset til `employerType=state`

---

## 7. Duplikatkontroll

Før revisjonen forekom samme URL flere steder under ulike ID-er.

Ryddet:
- NAV sykefraværsoppfølging
- DFØ personalsak/gjennomføring av møte
- Forsvarets grunnsyn på ledelse
- Arbeidstilsynets vold/trusler-side
- tre separate minstelønnsposter som pekte til samme side

Minstelønn er nå én kilde med relevant sektor-/yrkesavgrensning.

Etter revisjonen skal kildebankene ha **ingen eksakte URL-duplikater**.

---

## 8. KI-regler etter revisjonen

### Kilde-ID-er

`source_ids` kan nå referere til:
- generell SOURCEBANK
- yrkes-/sektorkilder
- kuraterte tariff-/hovedavtalekilder

Tidligere kunne yrkeskilder ligge i KI-prompten uten at de kunne registreres som kuratert `source_id`. Dette er rettet.

### Filtrering før KI

Før en kuratert kilde sendes til KI kan den filtreres på:
- arbeidsgivertype
- sektor
- yrke
- tema/situasjon

Dette reduserer risikoen for at modellen må velge mellom mange irrelevante kilder.

### Kildehierarki

Systemprompt, serverinstruks og responskontrakt sier nå eksplisitt:
- lov/forskrift først ved rettslige påstander
- tariff bare ved avklart avtaleområde
- myndighetsveiledning er veiledning, ikke lov
- Akan/IA er ikke lov
- forskning/rammeverk er ikke rettsgrunnlag
- oppslagsindekser er ikke direkte hjemmel
- organisasjonsnavn skal bare attribueres når den konkrete kilden støtter påstanden

### Nettsøk

Fagbanken er et kvalitetsanker, ikke en lukket liste.

Ved tidskritiske eller utilstrekkelig dekkede spørsmål kan nettsøk brukes, med prioritet:
1. gjeldende lov/forskrift
2. ansvarlig myndighet
3. ansvarlig tariffpart
4. anerkjent fagmiljø
5. fagfellevurdert forskning

---

## 9. Overordnet kildearkitektur

```text
Situasjon
   |
   +-- Vanlig samtalefaglig spørsmål
   |      -> forskning / faglig rammeverk
   |
   +-- Generelt arbeidsgiver-/arbeidsrettslig spørsmål
   |      -> AML / forskrift
   |      -> Arbeidstilsynet / NAV / Datatilsynet
   |      -> relevant spesialisert veiledning
   |
   +-- Lønn / arbeidstid / medbestemmelse / tariff
   |      -> avklar arbeidsgivertype / avtaleområde
   |      -> HTA / Hovedavtale / Spekter / annen bekreftet avtale
   |
   +-- Yrkes-/sektorsærregel
          -> avklar sektor/yrke
          -> profesjons-/myndighetskilde
          -> konkret lov/forskrift/veiledning
```

---

## 10. Gjenværende begrensninger

1. Samtalestøtte er ikke juridisk rådgivning.
2. Lokal virksomhetspraksis, personalreglement og lokale særavtaler er ikke kjent med mindre brukeren oppgir dem.
3. Tariffdekning kan ikke fastslås ut fra yrke alene.
4. Tidskritiske regler må kontrolleres mot fersk originalkilde.
5. En myndighetsoversikt kan være en god retrieval-start, men ikke nødvendigvis støtte en presis juridisk formulering.
6. Forskning kan være faglig sterk, men ikke nødvendigvis direkte generaliserbar til alle arbeidsplasser.
7. Kildebanken må vedlikeholdes når avtaleperioder utløper eller regelverk endres.

---

## 11. Regresjonsvern

Ny test:
- `tests/test-source-policy.cjs`

Testen kontrollerer blant annet:
- ingen eksakte URL-duplikater
- tilstedeværelse av sentrale overordnede arbeidsgiverkilder
- IA/Akan klassifiseres ikke som lov
- brede myndighetssider er merket som oppslagsinngang
- DFØ er avgrenset til staten
- gjeldende stat/KS/Spekter-kilder finnes
- svake/fjernet kilder ikke kommer tilbake
- systemprompt/server inneholder kildehierarki

Testen inngår i `npm run test-local`.

---

## 12. Revisjonsstatus

Etter kvalitetsryddingen består kildegrunnlaget av tre forskjellige lag:

- 58 generelle fag-, forsknings-, lov- og myndighetskilder
- 86 overordnede arbeidsgiver-/yrkes-/sektorkilder
- 7 konkrete kuraterte tariff-/hovedavtale-/arbeidsgiverreferanser

Tallene skal **ikke** brukes som kvalitetsmål. Viktigere er at:
- duplikater er fjernet
- kildefunksjon er eksplisitt
- svake kilder er fjernet eller nedgradert
- kildevalget filtreres før KI
- rettslig autoritet er skilt fra faglig evidens
- avtaledekning må avklares
- kildene kan spores i KI-svaret.


## Tillegg – personopplysningsloven/GDPR

Personopplysningsloven er lagt inn som overordnet primær rettskilde for behandling av ansattopplysninger. Den brukes sammen med Datatilsynets arbeidslivsveiledning og, ved kontrolltiltak, AML kapittel 9.

Dette skiller:
- **rettsgrunnlag:** personopplysningsloven/GDPR
- **arbeidsrettslig kontrolltiltaksregel:** AML kapittel 9
- **praktisk personvernveiledning:** Datatilsynet
