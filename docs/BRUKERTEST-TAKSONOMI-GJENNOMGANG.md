# Brukertest – ny gjennomgang av hovedtema og undertema

**Dato:** 27.10.2026  
**Status:** Historisk beslutningsgrunnlag – hovedresultatet implementert i v20.10.9  
**Omfang:** Gjennomgangen startet med 9 hovedtemaer og 56 undertemaer; gjeldende løsning har 9 hovedtemaer og 48 undertemaer

> **Viktig status 29.10.2026:** Dette dokumentet bevares som beslutnings- og refleksjonshistorikk. Forslagene lenger ned viser mellomstadier og er ikke lenger autoritative. Gjeldende taksonomi ligger i `src/client-data.js` og `src/server/topic-contracts.js`, og er synkronisert med benchmark/regresjonstester i v20.10.9.

## Hvorfor en ny gjennomgang?

Første klarspråkgjennomgang vurderte hovedsakelig om undertemabeskrivelsene var forståelige. Pilottilbakemeldingene viser at vi bør gå ett steg lenger og kontrollere **selve taksonomien**:

- Bruker vi ordene en leder faktisk vil lete etter?
- Er tittelen direkte nok, eller skjuler vi situasjonen bak forsiktig språk?
- Er to undertemaer så like at valget blir tilfeldig?
- Beskriver kortet en konkret situasjon, eller bare et fagbegrep?
- Er det tydelig hva som skiller nabokortene?

### Ny hovedregel

> **Hvis en leder normalt ville brukt et bestemt ord om problemet, bør vi ikke gjemme ordet bak en penere eller mer abstrakt omskrivning.**

Eksempler: oppsigelse, konflikt, mobbing, seksuell trakassering, fravær, dårlig kvalitet, feil, rus og forsinkelse.

Samtidig skal appen fortsatt:
- ikke diagnostisere
- ikke konkludere om skyld
- ikke gi juridiske avgjørelser
- ikke fremstille oppsigelse eller andre formelle utfall som besluttet før de faktisk er det

---

# Samlet forslag til hovedtemaer

| Nåværende hovedtema | Forslag | Vurdering |
| --- | --- | --- |
| Alkohol og rus | **Alkohol og rus** | Behold |
| Fravær og oppfølging | **Fravær og oppfølging** | Behold |
| Prestasjon og utvikling | **Arbeidsprestasjon og utvikling** | Vurder endring – litt tydeligere hva «prestasjon» gjelder |
| Lønn og utvikling | **Lønn og utvikling** | Behold |
| Samarbeid og kommunikasjon | **Samarbeid og kommunikasjon** | Behold |
| Avslutning av arbeidsforhold | **Oppsigelse og avslutning av arbeidsforhold** | Anbefalt endring |
| Sikkerhet og ansvar | **Sikkerhet og ansvar** | Behold |
| Livssituasjoner | **Livssituasjoner** | Behold |
| Mobbing og trakassering | **Mobbing og trakassering** | Behold |

## Hovedtemaet som bør endres tydeligst

### Oppsigelse og avslutning av arbeidsforhold

**Hvorfor:** «Avslutning av arbeidsforhold» er korrekt, men pilotfeedback viser at formuleringer som «på vei mot en avslutning» oppleves vage. En leder som tenker «jeg må kanskje si opp en ansatt» vil naturlig lete etter ordet **oppsigelse**.

**Forslag til hovedbeskrivelse:**

> Støtte til samtaler når oppsigelse kan bli aktuelt, når det er alvorlige problemer i arbeidsforholdet, eller når medarbeideren selv vurderer å slutte. Verktøyet hjelper med selve samtalen, men avgjør ikke om vilkårene for oppsigelse er oppfylt.

Dette er mer direkte uten å gi en juridisk konklusjon.

---

# 1. Alkohol og rus

## Hovedtema
**Behold: Alkohol og rus**

Tittelen er konkret, gjenkjennelig og samsvarer med hva en leder vil søke etter.

| Nå | Forslag | Handling |
| --- | --- | --- |
| Bekymring knyttet til alkohol | **Bekymring for alkoholbruk** | Omdøp litt mer naturlig |
| Bekymring knyttet til rusmidler | **Bekymring for andre rusmidler** | Omdøp for tydelig skille |
| Påvirkning på jobb | **Påvirket på jobb** | Vurder mer direkte språk |
| Arbeidsevne og fungering | **Arbeidsprestasjon og oppmøte** | Omdøp – «fungering» er abstrakt |
| Sikkerhet og hendelser | **Rus og sikkerhet** | Omdøp – tydelig kobling |
| Oppfølging og tilbakekomst | **Oppfølging etter fravær eller behandling** | Omdøp – sier når kortet brukes |

### Foreslåtte korte beskrivelser
- **Bekymring for alkoholbruk:** Når endringer i atferd, fravær eller arbeid gjør deg bekymret for om alkohol kan være en del av situasjonen.
- **Bekymring for andre rusmidler:** Når observasjoner eller informasjon gjør deg bekymret for mulig bruk av andre rusmidler.
- **Påvirket på jobb:** Når medarbeideren fremstår som mulig påvirket i arbeidstiden og situasjonen må håndteres der og da.
- **Arbeidsprestasjon og oppmøte:** Når arbeid, oppmøte eller samarbeid har endret seg og alkohol eller rus kan være en del av bekymringen.
- **Rus og sikkerhet:** Når alkohol eller rus kan ha hatt betydning for sikkerhet, feil, nestenulykke eller annen hendelse.
- **Oppfølging etter fravær eller behandling:** Når medarbeideren kommer tilbake etter fravær, behandling eller tidligere rusrelatert oppfølging.

**Vurdering:** God struktur. Ingen sammenslåing nødvendig.

---

# 2. Fravær og oppfølging

## Hovedtema
**Behold: Fravær og oppfølging**

Tydelig og søkbart.

| Nå | Forslag | Handling |
| --- | --- | --- |
| Hyppig korttidsfravær og egenmeldinger | **Hyppig korttidsfravær og egenmeldinger** | Behold |
| Langvarig sykefravær | **Langvarig sykefravær** | Behold |
| Oppmøte og punktlighet | **Forsinkelser og ustabilt oppmøte** | Vurder mer hverdagsnært språk |
| Planlagt fravær | **Permisjon og planlagt fravær** | Omdøp for søkbarhet |
| Tilbakekomst til arbeid | **Tilbake etter lengre fravær** | Omdøp litt mer naturlig |
| Tilrettelegging og arbeidsevne | **Tilrettelegging og arbeidsevne** | Behold |

### Foreslåtte korte beskrivelser
- **Hyppig korttidsfravær og egenmeldinger:** Når medarbeideren har flere korte fravær over tid og du skal følge opp mønsteret.
- **Langvarig sykefravær:** Når medarbeideren har vært borte over lengre tid og dere skal snakke om oppfølging og arbeidssituasjon.
- **Forsinkelser og ustabilt oppmøte:** Når medarbeideren gjentatte ganger kommer for sent eller ikke møter som avtalt.
- **Permisjon og planlagt fravær:** Når permisjon eller annet planlagt fravær må avklares.
- **Tilbake etter lengre fravær:** Når medarbeideren skal tilbake og dere må avklare oppstart, forventninger og overgang.
- **Tilrettelegging og arbeidsevne:** Når dere må finne ut om oppgaver, arbeidstid eller andre forhold på jobb kan tilpasses uten å gå inn i diagnose.

**Vurdering:** Sterkt tema. Mest behov for språklig konkretisering.

---

# 3. Prestasjon og utvikling

## Hovedtema
**Vurder: Arbeidsprestasjon og utvikling**

«Prestasjon» alene kan være bredt. «Arbeidsprestasjon» gjør det umiddelbart tydelig at dette gjelder utførelsen av jobben.

| Nå | Forslag | Handling |
| --- | --- | --- |
| Måloppnåelse | **Mål og leveranser** | Omdøp – mer konkret |
| Motivasjon | **Endret engasjement** | Anbefalt endring – unngå å anta motiv |
| Kvalitet i arbeidet | **Kvalitet i arbeidet** | Behold |
| Feil og avvik | **Feil i arbeidet** | Omdøp – skill fra sikkerhetsavvik |
| Kompetanse og mestring | **Kompetanse og opplæringsbehov** | Vurder mer konkret |
| Ansvar og initiativ | **Ansvar, selvstendighet og initiativ** | Omdøp litt tydeligere |

### Foreslåtte korte beskrivelser
- **Mål og leveranser:** Når avtalte mål, frister eller leveranser ikke nås som forventet, eller forventningene må tydeliggjøres.
- **Endret engasjement:** Når du ser en tydelig endring i deltakelse, initiativ eller engasjement og ønsker å forstå hva som ligger bak.
- **Kvalitet i arbeidet:** Når arbeidet ofte har feil, mangler eller lavere kvalitet enn det som er avtalt eller nødvendig.
- **Feil i arbeidet:** Når det har skjedd feil i ordinært arbeid som bør gjennomgås og følges opp. Ved sikkerhetskritiske feil brukes Sikkerhet og ansvar.
- **Kompetanse og opplæringsbehov:** Når medarbeideren kan trenge mer opplæring, erfaring eller støtte for å mestre oppgavene.
- **Ansvar, selvstendighet og initiativ:** Når leder og medarbeider har ulike forventninger til ansvar, selvstendighet eller initiativ i rollen.

**Vurdering:** Her bør vi være særlig konkrete. «Motivasjon» bør etter min vurdering bort som korttittel fordi lederen ikke kan vite motivet bare ved å observere atferd.

---

# 4. Lønn og utvikling

## Hovedtema
**Behold: Lønn og utvikling**

Tydelig og kjent språk.

| Nå | Forslag | Handling |
| --- | --- | --- |
| Lønnsutvikling | **Egen lønnsutvikling** | Omdøp – skiller fra lønnsforskjeller |
| Forventninger til lønn | **Ønske om høyere lønn** | Vurder mer direkte brukerord |
| Lønnsforskjeller | **Lønnsforskjeller** | Behold |
| Nye oppgaver og ansvar | **Mer ansvar og forventning om høyere lønn** | Omdøp – sier hvorfor kortet finnes |
| Utvikling og forfremmelse | **Utvikling og forfremmelse** | Behold |

### Foreslåtte korte beskrivelser
- **Egen lønnsutvikling:** Når medarbeideren ønsker å forstå hvordan egen lønn har utviklet seg over tid.
- **Ønske om høyere lønn:** Når medarbeideren ber om eller forventer lønnsøkning og dere må snakke om muligheter og rammer.
- **Lønnsforskjeller:** Når medarbeideren spør hvorfor andre tjener mer eller opplever lønnsforskjeller som urimelige.
- **Mer ansvar og forventning om høyere lønn:** Når nye oppgaver eller større ansvar kobles til forventning om lønnsøkning.
- **Utvikling og forfremmelse:** Når medarbeideren ønsker nye muligheter, mer ansvar eller forfremmelse.

**Vurdering:** God struktur, men dagens beskrivelser er for generelle.

---

# 5. Samarbeid og kommunikasjon

## Hovedtema
**Behold: Samarbeid og kommunikasjon**

Meget tydelig hovedtema.

| Nå | Forslag | Handling |
| --- | --- | --- |
| Kommunikasjon | **Kommunikasjon og tone** | Omdøp – mer konkret |
| Tillit | **Brutt eller svekket tillit** | Omdøp – «tillit» alene er abstrakt |
| Roller og forventninger | **Uklare roller og forventninger** | Omdøp |
| Uenighet og konflikt | **Uenighet og konflikt** | Behold |
| Samspill i team | **Samarbeidsproblemer i teamet** | Vurder mer direkte språk |
| Grenser og respekt | **Ugrei tone, humor eller personlige grenser** | Omdøp – langt mer konkret |

### Foreslåtte korte beskrivelser
- **Kommunikasjon og tone:** Når misforståelser, tone, uklare beskjeder eller manglende informasjonsdeling skaper problemer.
- **Brutt eller svekket tillit:** Når tidligere hendelser har gjort at leder eller medarbeidere ikke lenger har samme tillit til hverandre.
- **Uklare roller og forventninger:** Når det er uklart hvem som har ansvar for hva, eller partene forventer forskjellige ting.
- **Uenighet og konflikt:** Når en uenighet har blitt fastlåst, gjentakende eller påvirker samarbeidet.
- **Samarbeidsproblemer i teamet:** Når problemet først og fremst gjelder hvordan flere i teamet samarbeider eller fordeler oppgaver.
- **Ugrei tone, humor eller personlige grenser:** Når tone, humor eller oppførsel skaper ubehag, men situasjonen ikke tydelig handler om mobbing eller trakassering.

**Vurdering:** God seksdeling. «Grenser og respekt» er for abstrakt i dagens form.

---

# 6. Oppsigelse og avslutning av arbeidsforhold

## Hovedtema
**Anbefalt: Oppsigelse og avslutning av arbeidsforhold**

Dette er den tydeligste endringen i hele taksonomien.

| Nå | Forslag | Handling |
| --- | --- | --- |
| Avslutning av arbeidsforhold | **Mulig oppsigelse fra arbeidsgiver** | Anbefalt endring |
| Prøvetid | **Problemer i prøvetiden** | Vurder mer situasjonsorientert tittel |
| Endringer i stilling eller behov | **Endret stilling eller bemanningsbehov** | Omdøp |
| Tidligere oppfølging | **Manglende bedring etter tidligere oppfølging** | Anbefalt endring |
| Frivillig avslutning | **Medarbeideren ønsker å slutte** | Anbefalt klarspråk |
| Samtale før videre prosess | **Advarsel og formell oppfølging** | Anbefalt endring |

### Foreslåtte korte beskrivelser
- **Mulig oppsigelse fra arbeidsgiver:** Når arbeidsgiver vurderer om arbeidsforholdet kan fortsette og du må gjennomføre en tydelig samtale før eventuell videre prosess.
- **Problemer i prøvetiden:** Når medarbeideren er i prøvetid og forventninger, utvikling eller forhold som ikke fungerer må tas opp.
- **Endret stilling eller bemanningsbehov:** Når rolle, oppgaver eller virksomhetens bemanningsbehov endres og dette kan få konsekvenser for stillingen.
- **Manglende bedring etter tidligere oppfølging:** Når samme problem er tatt opp tidligere, tiltak er prøvd, men nødvendig bedring ikke har kommet.
- **Medarbeideren ønsker å slutte:** Når medarbeideren selv vurderer å si opp eller ønsker å snakke om en frivillig avslutning.
- **Advarsel og formell oppfølging:** Når det har skjedd noe alvorlig, eller et problem har kommet så langt at du må ta en tydelig samtale før eventuell advarsel eller annen formell oppfølging.

### Viktig språkgrense
Det er riktig å bruke **oppsigelse** som navigasjonsord. Det er ikke det samme som å si at oppsigelse er riktig eller lovlig i saken. KI-en må fortsatt tydelig skille mellom:
- samtalestøtte
- faktabeskrivelse
- virksomhetens egne prosesser
- juridisk vurdering

**Vurdering:** Dagens tema er for indirekte. Dette bør prioriteres i pilotforbedringsrunden.

---

# 7. Sikkerhet og ansvar

## Hovedtema
**Behold: Sikkerhet og ansvar**

| Nå | Forslag | Handling |
| --- | --- | --- |
| Sikkerhetsrutiner | **Brudd på sikkerhetsrutiner** | Vurder mer direkte tittel |
| Avvik og hendelser | **Sikkerhetshendelse eller avvik** | Omdøp – skiller fra vanlige arbeidsfeil |
| Risikovurdering | **Uenighet om risiko eller sikker arbeidsmåte** | Omdøp – konkret |
| Rapportering | **Manglende eller sen rapportering** | Anbefalt endring |
| Informasjonssikkerhet | **Informasjonssikkerhet** | Behold |
| Ansvar og læring etter hendelser | **Oppfølging etter en sikkerhetshendelse** | Omdøp |
| Vold og trusler | **Vold og trusler** | Behold |

### Foreslåtte korte beskrivelser
- **Brudd på sikkerhetsrutiner:** Når en sikkerhetsregel, prosedyre eller instruks ikke er fulgt.
- **Sikkerhetshendelse eller avvik:** Når en hendelse, feil eller nestenulykke med betydning for sikkerheten må gjennomgås.
- **Uenighet om risiko eller sikker arbeidsmåte:** Når leder og medarbeider vurderer risiko eller forsvarlig arbeidsmåte forskjellig.
- **Manglende eller sen rapportering:** Når en hendelse eller et avvik ikke ble meldt som forventet, eller rapporteringsansvaret er uklart.
- **Informasjonssikkerhet:** Når saken gjelder tilgang til, deling av eller håndtering av informasjon som skal beskyttes.
- **Oppfølging etter en sikkerhetshendelse:** Når hendelsen er avklart og samtalen handler om ansvar, læring og hva som må endres.
- **Vold og trusler:** Når en medarbeider har vært utsatt for eller står i fare for vold, trusler eller truende atferd i arbeidet.

**Vurdering:** Dagens tre kort «Avvik og hendelser», «Rapportering» og «Ansvar og læring etter hendelser» må skilles tydeligere.

---

# 8. Livssituasjoner

## Hovedtema
**Behold: Livssituasjoner**

Tittelen fungerer godt som et bredt, nøytralt inngangspunkt.

| Nå | Forslag | Handling |
| --- | --- | --- |
| Samlivs- og familieforhold | **Samlivsbrudd og familieproblemer** | Vurder mer hverdagsnært |
| Sykdom i nær familie | **Sykdom i nær familie** | Behold |
| Sorg og tap | **Sorg og tap** | Behold |
| Psykisk belastning | **Psykiske belastninger medarbeideren selv tar opp** | Tydeliggjør uten diagnose |
| Omsorgsansvar | **Omsorg for barn eller nærstående** | Omdøp – mer konkret |
| Belastning og utmattelse | **Høyt press, søvnproblemer og utmattelse** | Omdøp – konkret |

### Foreslåtte korte beskrivelser
- **Samlivsbrudd og familieproblemer:** Når medarbeideren selv forteller at samlivsbrudd, konflikt hjemme eller andre familieforhold påvirker jobben.
- **Sykdom i nær familie:** Når sykdom eller omsorg for noen nær påvirker fravær, kapasitet eller arbeidssituasjon.
- **Sorg og tap:** Når medarbeideren har opplevd dødsfall eller annet alvorlig tap og trenger en samtale om arbeidssituasjonen.
- **Psykiske belastninger medarbeideren selv tar opp:** Når medarbeideren selv beskriver uro, nedstemthet, stress eller annen psykisk belastning som påvirker arbeidshverdagen.
- **Omsorg for barn eller nærstående:** Når omsorgsansvar påvirker tid, tilgjengelighet eller kapasitet på jobb.
- **Høyt press, søvnproblemer og utmattelse:** Når medarbeideren beskriver langvarig press, tretthet eller søvnproblemer som påvirker arbeidshverdagen.

**Vurdering:** God tematisk dekning. Beskrivelsene bør være mer konkrete, men vi bør fortsatt unngå at lederen diagnostiserer medarbeideren.

---

# 9. Mobbing og trakassering

## Hovedtema
**Behold: Mobbing og trakassering**

Dette er ord brukere faktisk vil lete etter.

| Nå | Forslag | Handling |
| --- | --- | --- |
| Mobbing | **Mobbing** | Behold |
| Utestenging og utfrysing | **Utestenging og utfrysing** | Behold |
| Krenkende eller utilbørlig atferd | **Krenkende eller grenseoverskridende atferd** | Anbefalt endring |
| Seksuell trakassering | **Seksuell trakassering** | Behold |
| Kjønnstrakassering og uønsket seksuell oppmerksomhet | **Kjønnstrakassering** | Anbefalt endring |
| Varsling om mobbing eller trakassering | **Varslingssak om mobbing eller trakassering** | Omdøp |
| Samtale med den som sier ifra | **Første samtale med den som sier ifra** | Omdøp |
| Samtale med den varselet gjelder | **Samtale med den det er varslet om** | Klarspråk |

### Foreslåtte korte beskrivelser
- **Mobbing:** Når en medarbeider over tid opplever gjentatte negative handlinger eller behandling som gjør arbeidssituasjonen vanskelig.
- **Utestenging og utfrysing:** Når en medarbeider opplever å bli holdt utenfor møter, informasjon, oppgaver eller faglige/sosiale fellesskap.
- **Krenkende eller grenseoverskridende atferd:** Når ord eller handlinger oppleves som nedverdigende, skremmende, fiendtlige eller klart over grensen.
- **Seksuell trakassering:** Når en medarbeider forteller om uønsket seksuell oppmerksomhet, berøring, meldinger, forslag eller annen seksuell atferd.
- **Kjønnstrakassering:** Når nedsettende eller krenkende kommentarer eller handlinger er knyttet til kjønn uten at innholdet nødvendigvis er seksuelt.
- **Varslingssak om mobbing eller trakassering:** Når noen tydelig eller formelt har meldt fra om et mulig kritikkverdig forhold som må håndteres etter varslingsrutiner.
- **Første samtale med den som sier ifra:** Når du skal lytte til personen som har meldt fra, få oversikt og forklare hva som skjer videre.
- **Samtale med den det er varslet om:** Når du skal informere om det som er meldt, høre personens perspektiv og unngå å konkludere på forhånd.

### Mulig strukturproblem

De fem første kortene beskriver **hva slags problem det er**. De tre siste beskriver **hvilken del av en varslingsprosess lederen er i**.

Det er derfor verdt å vurdere om UI-et senere bør gruppere undertemaene visuelt:

**Hva gjelder saken?**
- Mobbing
- Utestenging og utfrysing
- Krenkende eller grenseoverskridende atferd
- Seksuell trakassering
- Kjønnstrakassering

**Er dette en varslingssak?**
- Varslingssak om mobbing eller trakassering
- Første samtale med den som sier ifra
- Samtale med den det er varslet om

Det kan løse mer enn bare en tekstendring.

---

# Anbefalte endringer – prioritert

## Prioritet A – tydelig effekt på forståelse
1. Endre **Avslutning av arbeidsforhold** til **Oppsigelse og avslutning av arbeidsforhold**.
2. Endre beskrivelsen slik at ordet **oppsigelse** brukes direkte, med tydelig avgrensning mot juridisk konklusjon.
3. Omdøp **Avslutning av arbeidsforhold**-undertemaet til **Mulig oppsigelse fra arbeidsgiver**.
4. Omdøp **Tidligere oppfølging** til **Manglende bedring etter tidligere oppfølging**.
5. Omdøp **Samtale før videre prosess** til **Advarsel og formell oppfølging**.
6. Omdøp **Motivasjon** til **Endret engasjement**.
7. Skill tydelig mellom ordinær **Feil i arbeidet** og **Sikkerhetshendelse eller avvik**.
8. Skill tydelig mellom **Seksuell trakassering** og **Kjønnstrakassering**.
9. Gjør varslingskortene eksplisitt prosessorienterte.

## Prioritet B – klarspråk og søkbarhet
- «Oppmøte og punktlighet» → «Forsinkelser og ustabilt oppmøte».
- «Planlagt fravær» → «Permisjon og planlagt fravær».
- «Tillit» → «Brutt eller svekket tillit».
- «Grenser og respekt» → mer konkret tittel om tone/humor/personlige grenser.
- «Rapportering» → «Manglende eller sen rapportering».
- «Belastning og utmattelse» → konkretiser press/søvn/utmattelse.
- «Lønnsutvikling» → «Egen lønnsutvikling».

## Prioritet C – vurder etter flere piloter
- Hovedtema «Prestasjon og utvikling» → «Arbeidsprestasjon og utvikling».
- «Påvirkning på jobb» → «Påvirket på jobb».
- «Prøvetid» → «Problemer i prøvetiden».
- Visuell gruppering av problemtype og varslingsprosess under Mobbing og trakassering.

---

# Hva bør ikke gjøres nå?

- Ikke endre produksjonsversjonen mens aktiv pilot pågår bare fordi denne gjennomgangen finnes.
- Ikke slå sammen undertemaer kun for å redusere antallet før vi ser om brukerne faktisk sliter med skillet.
- Ikke fjerne juridisk/faglig presise begreper helt dersom de også er søkeord brukeren trenger; bruk heller klarspråk i beskrivelsen.
- Ikke gjøre KI-en mer bastant bare fordi navigasjonen blir mer direkte.

---

# Foreslått beslutningsregel før implementering

For hver tittel og beskrivelse bør vi kunne svare ja på disse fire spørsmålene:

1. **Ville en leder faktisk brukt eller søkt etter dette ordet?**
2. **Skjønner brukeren umiddelbart når kortet passer?**
3. **Er forskjellen mot nabokortene tydelig?**
4. **Unngår teksten å diagnostisere, avgjøre skyld eller gi en juridisk konklusjon?**

Hvis svaret er nei på ett av de tre første, bør teksten forbedres. Hvis svaret er nei på det fjerde, har vi gått for langt i motsatt retning.
