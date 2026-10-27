# Brukertest – klarspråkgjennomgang av undertemaer

**Status:** Arbeidsdokument, ikke implementert i pilotversjonen  
**Dato:** 27.10.2026  
**Omfang:** Alle 56 undertemaer i `src/client-data.js`

## Bakgrunn

Pilotbrukere har meldt at enkelte undertemabeskrivelser er vanskelige å forstå eller skille fra hverandre. Formålet med denne gjennomgangen er derfor ikke bare å «språkvaske» tekstene, men å kontrollere om hvert kort faktisk hjelper en vanlig leder å velge riktig inngang.

Gjennomgangen bruker tre spørsmål:

1. Forstår en vanlig leder hva dette valget gjelder?
2. Skiller valget seg tydelig fra nabokortene?
3. Hjelper beskrivelsen brukeren å avgjøre «er dette min situasjon»?

### Foreslått språkregel

Undertemabeskrivelsen bør som hovedregel:

- starte med eller kunne leses som **«Velg dette når …»**
- beskrive en konkret situasjon eller observerbart behov, ikke bare definere fagbegrepet
- unngå juridisk eller teknisk språk når enklere ord fungerer
- ikke anta diagnose, motiv, skyld eller konklusjon
- tydeliggjøre forskjellen mot nærmeste overlappende undertema
- være kort nok til å skannes på mobil

Dette dokumentet foreslår tekst og enkelte titler. Ingen av forslagene er lagt inn i appen ennå.

---

# 1. Alkohol og rus

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Bekymring knyttet til alkohol | **Gul – overlapper med generell fungering** | Velg dette når du har lagt merke til endringer i atferd, fravær eller arbeid som gjør deg bekymret for om alkohol kan være en del av situasjonen. |
| Bekymring knyttet til rusmidler | **Gul – overlapper med alkohol** | Velg dette når observasjoner eller informasjon gjør deg bekymret for mulig bruk av andre rusmidler, uten at du vet sikkert hva som ligger bak. |
| Påvirkning på jobb | **Grønn** | Velg dette når medarbeideren fremstår som mulig påvirket i arbeidstiden og du må håndtere situasjonen her og nå. |
| Arbeidsevne og fungering | **Gul – litt abstrakt** | Velg dette når arbeid, oppmøte eller samarbeid har endret seg og du trenger å snakke om hvordan medarbeideren fungerer på jobb. |
| Sikkerhet og hendelser | **Grønn, men må skilles fra generell sikkerhet** | Velg dette når alkohol eller rus kan ha hatt betydning for en sikkerhetssituasjon, feil, nestenulykke eller annen hendelse. |
| Oppfølging og tilbakekomst | **Grønn** | Velg dette når medarbeideren kommer tilbake etter fravær, behandling eller tidligere oppfølging og dere skal avklare veien videre på jobb. |

**Merknad:** De to første kortene er bevisst forsiktige. Lederen skal kunne velge dem på bakgrunn av bekymring uten at appen fremstiller rusbruk som fastslått.

---

# 2. Fravær og oppfølging

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Hyppig korttidsfravær og egenmeldinger | **Grønn** | Velg dette når medarbeideren har flere korte fravær eller egenmeldinger over tid og du ønsker en ryddig oppfølgingssamtale. |
| Langvarig sykefravær | **Grønn** | Velg dette når medarbeideren har vært sykmeldt eller borte over lengre tid og dere skal snakke om oppfølging og arbeidssituasjon. |
| Oppmøte og punktlighet | **Grønn** | Velg dette ved gjentatte forsinkelser, ustabilt oppmøte eller andre problemer med å møte til avtalt tid. |
| Planlagt fravær | **Gul – nåværende tekst er vag** | Velg dette når permisjon, avtalt fravær eller andre planlagte fravær må avklares slik at både medarbeider og arbeidsplass vet hva som gjelder. |
| Tilbakekomst til arbeid | **Grønn** | Velg dette når medarbeideren skal tilbake etter lengre fravær og dere må avklare oppstart, forventninger eller behov i overgangsperioden. |
| Tilrettelegging og arbeidsevne | **Grønn, men kan kortes** | Velg dette når dere må finne ut om oppgaver, arbeidstid eller andre forhold på jobb kan tilpasses – uten å gå inn i diagnose. |

---

# 3. Prestasjon og utvikling

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Måloppnåelse | **Gul – for generell i dag** | Velg dette når avtalte mål, leveranser eller resultater ikke nås som forventet, eller når forventningene trenger å bli tydeligere. |
| Motivasjon | **Rød – tittel kan invitere til å anta motiv** | **Vurder ny tittel: «Endret engasjement».** Velg dette når du ser en tydelig endring i deltakelse, initiativ eller engasjement og ønsker å forstå hva som ligger bak. |
| Kvalitet i arbeidet | **Grønn** | Velg dette når arbeidet ofte har feil, mangler eller lavere kvalitet enn det som er avtalt eller nødvendig. |
| Feil og avvik | **Gul – overlapper med Sikkerhet** | Velg dette når det har skjedd feil eller avvik i det ordinære arbeidet som bør gjennomgås og følges opp. Ved sikkerhetskritiske hendelser: velg heller **Sikkerhet og ansvar**. |
| Kompetanse og mestring | **Grønn** | Velg dette når medarbeideren kan trenge mer opplæring, erfaring eller støtte for å mestre oppgavene eller rollen. |
| Ansvar og initiativ | **Grønn, kan bli mer konkret** | Velg dette når medarbeider og leder ser ulikt på hvor mye selvstendighet, ansvar eller initiativ rollen krever. |

**Merknad:** Pilottilbakemelding om «passive og vage råd» er særlig relevant i dette temaet. Her bør KI-en være konkret på forventninger, eksempler, observasjoner og neste steg uten å fastslå motiv.

---

# 4. Lønn og utvikling

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Lønnsutvikling | **Rød – dagens tekst gjentar bare tittelen** | Velg dette når medarbeideren ønsker å forstå egen lønnsutvikling over tid, eller hvorfor lønnen har utviklet seg som den har. |
| Forventninger til lønn | **Grønn** | Velg dette når medarbeideren forventer lønnsøkning og dere må snakke om hva som er mulig, hvilke kriterier som gjelder og hva lederen faktisk kan påvirke. |
| Lønnsforskjeller | **Grønn** | Velg dette når medarbeideren spør hvorfor andre tjener mer, eller opplever lønnsforskjeller som urimelige. |
| Nye oppgaver og ansvar | **Grønn** | Velg dette når medarbeideren har fått eller skal få nye oppgaver eller større ansvar og knytter dette til forventning om høyere lønn. |
| Utvikling og forfremmelse | **Grønn** | Velg dette når medarbeideren ønsker nye muligheter, mer ansvar eller forfremmelse og dere skal avklare mulige veier videre. |

---

# 5. Samarbeid og kommunikasjon

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Kommunikasjon | **Grønn** | Velg dette når misforståelser, tone, uklare beskjeder eller manglende informasjonsdeling skaper problemer i arbeidshverdagen. |
| Tillit | **Gul – abstrakt** | Velg dette når tidligere hendelser har gjort at medarbeidere eller leder ikke lenger har samme tillit til hverandre som før. |
| Roller og forventninger | **Grønn** | Velg dette når det er uklart hvem som har ansvar for hva, eller når partene har ulike forventninger til roller og oppgaver. |
| Uenighet og konflikt | **Grønn** | Velg dette når en uenighet har blitt fastlåst, gjentakende eller påvirker samarbeidet på jobb. |
| Samspill i team | **Gul – bredt kort** | Velg dette når problemet først og fremst gjelder hvordan flere i teamet samarbeider, fordeler oppgaver eller påvirker arbeidsmiljøet. |
| Grenser og respekt | **Gul – overlapper med trakassering** | Velg dette når tone, humor, oppførsel eller personlige grenser skaper ubehag, men situasjonen ikke tydelig handler om mobbing eller trakassering. |

**Merknad:** «Grenser og respekt» må peke tydelig videre til **Mobbing og trakassering** når saken er alvorlig, gjentakende eller handler om krenkende/grenseoverskridende atferd.

---

# 6. Avslutning av arbeidsforhold

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Avslutning av arbeidsforhold | **Rød – tittel er lik hovedtema og overlapper frivillig avslutning** | **Vurder ny tittel: «Mulig avslutning fra arbeidsgiver».** Velg dette når arbeidsgiver vurderer om arbeidsforholdet kan fortsette og det er behov for en tydelig samtale før eventuell videre prosess. |
| Prøvetid | **Grønn** | Velg dette når medarbeideren er i prøvetid og dere må snakke om forventninger, utvikling eller forhold som ikke fungerer som avtalt. |
| Endringer i stilling eller behov | **Gul – litt diffus** | **Vurder ny tittel: «Endret rolle eller bemanningsbehov».** Velg dette når oppgaver, rolle eller virksomhetens behov endres og det kan få konsekvenser for medarbeiderens stilling. |
| Tidligere oppfølging | **Rød – beskriver historikk, ikke situasjonen** | **Vurder ny tittel: «Manglende bedring etter oppfølging».** Velg dette når samme problem er tatt opp tidligere, tiltak er prøvd, og dere nå må vurdere hva som skal skje videre. |
| Frivillig avslutning | **Grønn** | Velg dette når medarbeideren selv ønsker å slutte, vurderer å si opp eller ønsker å diskutere en frivillig avslutning. |
| Samtale før videre prosess | **Rød – svært vag** | **Vurder ny tittel: «Advarsel og formell oppfølging».** Velg dette når et alvorlig forhold må tas opp og dokumenteres før saken eventuelt går videre til formell behandling eller relevant fagstøtte. |

**Merknad:** Dette temaet trenger særlig tydelig språk fordi feil valg kan få brukeren til å tro at appen gir juridiske konklusjoner. Kortene skal beskrive samtalesituasjonen, ikke antyde at oppsigelse allerede er besluttet.

---

# 7. Sikkerhet og ansvar

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Sikkerhetsrutiner | **Grønn** | Velg dette når en medarbeider ikke har fulgt, eller er uenig i, en sikkerhetsregel, prosedyre eller instruks som gjelder arbeidet. |
| Avvik og hendelser | **Gul – overlapper med læring etter hendelser** | Velg dette når en sikkerhetsrelatert hendelse, feil eller nestenulykke må gjennomgås for å få oversikt over hva som skjedde. |
| Risikovurdering | **Grønn** | Velg dette når leder og medarbeider vurderer risiko eller forsvarlig arbeidsmåte forskjellig, og dere må avklare hva som er trygt. |
| Rapportering | **Rød – for generelt** | **Vurder ny tittel: «Manglende eller sen rapportering».** Velg dette når en hendelse, feil eller et avvik ikke ble meldt som forventet, eller når rapporteringsansvaret er uklart. |
| Informasjonssikkerhet | **Grønn** | Velg dette når saken gjelder tilgang til, deling av eller håndtering av informasjon som skal beskyttes. |
| Ansvar og læring etter hendelser | **Gul – overlapper med Avvik og hendelser** | Velg dette etter at hendelsesforløpet er avklart, når samtalen handler om læring, ansvar, forbedringer og hvordan lignende hendelser kan forebygges. |
| Vold og trusler | **Grønn** | Velg dette når en medarbeider har vært utsatt for, eller står i fare for, vold, trusler eller truende atferd i forbindelse med arbeidet. |

**Tydelig skille som bør vises i tekstene:**

- **Avvik og hendelser:** Hva skjedde?
- **Ansvar og læring etter hendelser:** Hva lærer vi, og hva endrer vi?
- **Rapportering:** Hvorfor ble det ikke meldt / hvordan skal det meldes?

---

# 8. Livssituasjoner

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Samlivs- og familieforhold | **Grønn** | Velg dette når medarbeideren selv forteller at samlivsbrudd, konflikt hjemme eller andre familieforhold påvirker arbeidshverdagen. |
| Sykdom i nær familie | **Grønn** | Velg dette når medarbeideren står i sykdom eller omsorg for noen nær og dette påvirker arbeid, fravær eller kapasitet. |
| Sorg og tap | **Grønn** | Velg dette når medarbeideren har opplevd dødsfall eller annet alvorlig tap og trenger en samtale om hvordan arbeidssituasjonen kan håndteres. |
| Psykisk belastning | **Gul – må ikke invitere til diagnose** | Velg dette når medarbeideren selv forteller om uro, nedstemthet, stress eller annen psykisk belastning som påvirker arbeidshverdagen. |
| Omsorgsansvar | **Grønn** | Velg dette når ansvar for barn, foreldre eller andre nærstående påvirker tid, tilgjengelighet eller kapasitet på jobb. |
| Belastning og utmattelse | **Gul – overlapper med psykisk belastning** | Velg dette når medarbeideren beskriver søvnproblemer, høyt press, tretthet eller langvarig belastning som gjør arbeidshverdagen vanskeligere. |

**Tydelig skille:** «Psykisk belastning» brukes når medarbeideren selv beskriver psykiske plager/belastning. «Belastning og utmattelse» brukes når problemet først og fremst beskrives som press, søvn, tretthet eller kapasitet uten at psykisk helse trenger å være tema.

---

# 9. Mobbing og trakassering

| Undertema | Vurdering | Forslag til brukerbeskrivelse |
| --- | --- | --- |
| Mobbing | **Rød – dagens formulering er vanskelig å forstå** | Velg dette når en medarbeider over tid opplever gjentatte negative handlinger, utestenging eller annen behandling som gjør arbeidssituasjonen vanskelig. |
| Utestenging og utfrysing | **Grønn** | Velg dette når en medarbeider opplever å bli holdt utenfor møter, informasjon, oppgaver eller sosiale/faglige fellesskap på arbeidsplassen. |
| Krenkende eller utilbørlig atferd | **Rød – «utilbørlig» er fag-/jusspråk** | **Vurder ny tittel: «Krenkende eller grenseoverskridende atferd».** Velg dette når ord eller handlinger oppleves som nedverdigende, skremmende, fiendtlige eller klart over grensen. |
| Seksuell trakassering | **Rød – overlapper sterkt med neste kort** | Velg dette når en medarbeider forteller om uønsket seksuell oppmerksomhet, berøring, meldinger, forslag eller annen seksuell atferd. |
| Kjønnstrakassering og uønsket seksuell oppmerksomhet | **Rød – tittelen blander to begreper og overlapper seksuell trakassering** | **Vurder ny tittel: «Kjønnstrakassering».** Velg dette når nedsettende eller krenkende kommentarer eller handlinger er knyttet til kjønn, uten at innholdet nødvendigvis er seksuelt. |
| Varsling om mobbing eller trakassering | **Gul – prosesskort, må skilles fra type hendelse** | **Vurder ny tittel: «Varslingssak om mobbing eller trakassering».** Velg dette når noen formelt eller tydelig sier fra om et mulig kritikkverdig forhold som må håndteres etter virksomhetens varslingsrutiner. |
| Samtale med den som sier ifra | **Rød – uklart skille mot varsling** | **Vurder ny tittel: «Første samtale med den som sier ifra».** Velg dette når du som leder skal lytte til personen som har meldt fra, få oversikt og forklare hva som skjer videre. |
| Samtale med den varselet gjelder | **Grønn, men bør konkretiseres** | Velg dette når du skal snakke med personen det er varslet om, presentere det som er relevant, høre vedkommendes perspektiv og unngå å konkludere på forhånd. |

**Tydelig skille som bør være synlig for brukeren:**

- **Mobbing / seksuell trakassering / kjønnstrakassering:** Hva slags situasjon gjelder det?
- **Varslingssak:** Saken er meldt som et mulig kritikkverdig forhold og må håndteres som prosess.
- **Første samtale med den som sier ifra:** Hvilken samtale skal lederen gjennomføre nå?
- **Samtale med den varselet gjelder:** Hvilken samtale skal lederen gjennomføre med den andre parten?

---

# Samlet vurdering

## Mest presserende klarspråkfunn

Følgende undertemaer bør prioriteres i en senere pilotforbedringsrunde:

1. **Mobbing** – dagens formulering «vanskelig i stand til å forsvare seg» er tung og lite naturlig.
2. **Seksuell trakassering / Kjønnstrakassering** – dagens tekster overlapper så mye at valget kan bli tilfeldig.
3. **Varsling / Samtale med den som sier ifra** – prosess og samtaletype blandes.
4. **Avslutning av arbeidsforhold / Frivillig avslutning** – hovedkortet er for bredt og skiller ikke hvem som initierer avslutningen.
5. **Samtale før videre prosess** – for abstrakt til å hjelpe med valg.
6. **Tidligere oppfølging** – beskriver bare at noe har skjedd før, ikke hvorfor dette valget passer nå.
7. **Motivasjon** – kan få lederen til å tolke årsak/motiv fremfor å beskrive observerbar endring.
8. **Rapportering** – for bredt og overlapper avvik/hendelser.
9. **Lønnsutvikling** – eksisterende tekst forklarer ikke mer enn tittelen.
10. **Feil og avvik** – må skilles tydelig fra sikkerhetsavvik.

## Overordnet UX-konklusjon

Pilotfunnene viser at undertemakortene ikke bare er innhold; de er en del av navigasjonen. En faglig korrekt beskrivelse kan derfor fortsatt være dårlig UX dersom den ikke hjelper brukeren å velge.

Neste versjon bør måle hvert kort mot denne setningen:

> **«Når jeg leser tittelen og én kort beskrivelse, skjønner jeg umiddelbart om dette er riktig inngang for situasjonen min.»**

---

# Relasjon til øvrige pilotfunn

Denne klarspråkgjennomgangen bør ses sammen med øvrige pilotfunn:

- flere brukere har valgt mobil selv om v1 opprinnelig ble utformet for desktop
- mobilvisningen gir for liten plass til hovedinnholdet
- enkelte KI-svar oppleves som passive, vage eller robotaktige
- begreper som «simulering», «samtaleøvelse», «identifikatorer» og «identifiserende opplysninger» brukes ikke alltid konsekvent
- en rå intern kilde-/citation-markør er observert i brukergrensesnittet
- reset mellom saker og status etter brukertestinnsending er bekreftede tekniske funn og er håndtert separat

Det anbefales å samle endringer i én kontrollert pilotforbedringsrunde etter at flere brukere har svart, fremfor å endre produksjonsversjonen for hvert enkelt funn.
