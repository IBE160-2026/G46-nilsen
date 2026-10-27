# Brukertest – funn og forbedringsbacklog

**Oppdatert:** 27.10.2026  
**Status:** Levende arbeidsdokument under pilot  
**Prinsipp:** Ikke endre produksjonsversjonen fortløpende for hvert enkelt innspill. Samle mønstre, rett bekreftede feil kontrollert, og planlegg en samlet pilotforbedringsrunde.

## Statusforklaring

- **Rapportert:** bruker har meldt funnet, men det er ikke nødvendigvis teknisk bekreftet.
- **Bekreftet:** årsak eller atferd er verifisert i kode/test.
- **Rettet i kode:** endringen ligger på `main`, men kan være ikke deployet.
- **Kandidat:** forslag til forbedring som bør vurderes samlet etter mer pilotdata.
- **Gjengangende brukerfunn:** flere uavhengige brukere peker på samme forhold.

---

## 1. Mobil og responsiv bruk

### Funn
- **Gjengangende brukerfunn:** Minst fem pilotbrukere valgte spontant å teste løsningen på mobil.
- Flere beskrev mobilopplevelsen som trang eller klønete før de fikk beskjed om at pilotversjonen opprinnelig var laget for PC/desktop.
- Pilotbilder viser at sidefelt og toppområde tar mye plass på små skjermer, slik at selve svarinnholdet får liten visningsflate.

### Tolkning
Dette er ikke et avvik fra opprinnelig v1-scope, siden løsningen ble utformet for desktop. Pilotbrukernes faktiske atferd viser likevel et gap mellom **forutsatt brukskontekst** og **reell brukskontekst**.

### Kandidater til forbedring
- Sidefelt skal kunne skjules helt på mobil, med tydelig kontroll for å åpne det igjen.
- Toppområde bør komprimeres og eventuelt skjules/trekkes sammen ved scrolling.
- Hovedinnholdet bør få nesten hele skjermbredden.
- Store informasjons-/personvernkort bør bli mer kompakte på små skjermer.
- Kort, padding og typografi bør skaleres ned på mobil.
- Lange KI-svar bør få bedre leseflate.

**Status:** Kandidat til høy prioritet i samlet pilotforbedringsrunde.

---

## 2. KI-svar: tyngde, konkretisering og naturlig språk

### Funn
- **Rapportert:** En pilotbruker opplever at enkelte svar/tips er passive og vage og «treffer litt i utkanten av skiva».
- **Rapportert:** En annen pilotbruker opplever enkelte formuleringer som robotaktige, blant annet formuleringer i retning av «det var ikke meningen å stemple deg».

### Tolkning
Sikkerhets- og forsiktighetsreglene kan ha trukket enkelte svar for langt mot generelle og forsiktige formuleringer. Målet bør være **konkret og handlingsrettet uten å være skråsikker, diagnostiserende eller juridisk bastant**.

### Kandidater til forbedring
- Foretrekk konkrete lederhandlinger: «Start med …», «Spør deretter …», «Si for eksempel …», «Unngå …».
- Bruk «kan», «vurder» og «eventuelt» når usikkerhet faktisk er relevant, ikke som standard i alle råd.
- Eksempelformuleringer skal høres ut som noe en leder naturlig kan si høyt.
- Lag egne språk-/kvalitetscaser for konkrete vs. passive råd i golden testbank.

**Status:** Gjengangende kvalitetsfunn; høy prioritet for analyse etter pilot.

---

## 3. Begreper og terminologi

### Funn
- **Rapportert:** Brukere opplever inkonsekvens mellom «simulering», «samtale», «råd», «øvelse» og lignende begreper.
- **Rapportert:** «Identifikatorer» oppleves som teknisk språk sammenlignet med mer forståelige formuleringer som «opplysninger som kan identifisere en person».

### Kandidater
- Vurder **«samtaleøvelse»** som gjennomgående brukerbegrep, mens teknisk kode fortsatt kan bruke `simulation`.
- Gjennomfør klarspråkvask av personverntekster.
- Lag en liten begrepsfasit for hele UI-et og bruk den konsekvent.

**Status:** Kandidat, middels prioritet.

---

## 4. Undertemaer og navigasjonsforståelse

### Funn
- **Gjengangende brukerfunn:** Enkelte beskrivelser av undertemaer hjelper ikke godt nok med å forstå hvilket valg som passer.
- Flere tekster er faglig riktige, men for abstrakte, overlappende eller skrevet som definisjoner.
- Undertemakortene fungerer i praksis som navigasjon og må derfor hjelpe brukeren å velge, ikke bare forklare begrepet.

### Arbeid utført
- Første klarspråkgjennomgang av alle 56 undertemaer:
  - `docs/BRUKERTEST-KLARSPRAK-UNDERTEMA.md`
- Ny, strengere gjennomgang av selve taksonomien – 9 hovedtemaer og 56 undertemaer:
  - `docs/BRUKERTEST-TAKSONOMI-GJENNOMGANG.md`
- Den nye gjennomgangen vurderer ikke bare tekst, men også om titler bør omdøpes, om skiller er uklare, og om strukturen samsvarer med ordene en leder faktisk vil lete etter.
- Hovedregler:
  > Beskrivelsen skal hjelpe brukeren å vite «velg dette når …», ikke bare definere fagbegrepet.
  
  > Hvis en leder normalt ville brukt et bestemt ord om problemet, bør vi ikke gjemme ordet bak en penere eller mer abstrakt omskrivning.

### Mest utsatte skiller
- Mobbing vs. utestenging/utfrysing.
- Seksuell trakassering vs. kjønnstrakassering.
- Varslingssak vs. første samtale med den som sier ifra.
- Avslutning fra arbeidsgiver vs. frivillig avslutning.
- Ordinære feil/avvik vs. sikkerhetsavvik.
- Avvik/hendelse vs. ansvar/læring vs. rapportering.
- Psykisk belastning vs. belastning/utmattelse.

**Status:** Analyse ferdig, ikke implementert.

---

## 5. Rå kilde-/citation-markør vises i UI

### Funn
- **Rapportert/visuelt observert:** Intern kilde-/citation-tekst i format som `cite...AT_PERSONALSAKER...CIPD_PERFORMANCE_FEEDBACK...` har vært synlig i et KI-svar.

### Tolkning
Dette fremstår som intern formattering som lekker ut i brukergrensesnittet og bør ikke vises til sluttbruker.

### Neste steg
- Spor om markøren kommer fra modelloutput, kildeformattering eller renderer.
- Legg inn regresjonstest når årsaken er identifisert.

**Status:** Bekreftet visuelt som brukerproblem; teknisk årsak ikke ferdig analysert.

---

## 6. Gammel situasjon følger med til nytt tema

### Funn
- **Rapportert:** Tidligere situasjon ble stående når bruker startet ny samtale/valgte nytt tema.
- **Bekreftet:** `pendingSituationText` ble ikke tømt i reset-logikken.

### Rettelse
- `pendingSituationText` tømmes ved ny samtale.
- Detaljfeltet tømmes.
- Regresjonstest lagt til.

**Status:** Rettet i kode på `main`.

---

## 7. Brukertest: «allerede sendt inn» etter innsending

### Funn
- **Rapportert:** Bruker opplevde melding om at brukertesten allerede var sendt inn og var usikker på om svaret var lagret.
- **Bekreftet:** Etter vellykket POST ble survey-visningen automatisk åpnet på nytt, status-endepunktet returnerte fullført, og UI viste derfor «Du har allerede sendt inn brukertesten».
- **Ikke bekreftet:** Ingen kode er funnet som automatisk sender inn bare ved å navigere ut og tilbake.

### Rettelser
- Stabil «sendt inn»-tilstand etter vellykket innsending.
- Ingen automatisk reopen etter 250 ms.
- Dobbel-submit guard og deaktivert sendeknapp under innsending.
- Duplicate-respons behandles som fullført tilstand.
- Duplicert `openSurvey`-listener fjernet.
- Regresjonstester lagt til.

**Status:** Rettet i kode på `main`.

---

## 8. Personvern – falske positive navn

### Funn og rettelser

#### «dem» tolket som navn
Eksempel:
> «Hvordan kan vi stille større krav til dem som er ny?»

- **Bekreftet:** Ikke SSB-navnelisten. Kontekstuell navnedetektor tolket grammatisk pronomen som mulig personnavn.
- Vanlige pronomen/funksjonsord er lagt inn som sikre ikke-navn.

#### «vårt» tolket som navn
Eksempel:
> «Dette ligger innenfor vårt ansvarsområde.»

- **Bekreftet:** Samme type grammatisk falsk positiv.
- Eiendomsord som `vårt`, `våre`, `mitt`, `mine`, `ditt`, `dine`, `sitt`, `sine`, `deres` er lagt inn som sikre ikke-navn.
- `Vår` beholdes som mulig faktisk fornavn og håndteres kontekstuelt.

#### Tidligere falske positive
- `dag` i vanlig betydning.
- ord som `Fraværet` og andre setningsstartord.
- familiecase som tidligere ga uventet navnetreff.

**Status:** Rettet i kode og dekket med regresjonstester.

---

## 9. Personvern – «jobbet i 20 år» tolkes som alder

### Funn
Eksempel:
> «Medarbeideren har jobbet her i 20 år.»

- **Bekreftet:** Klient og server brukte en for bred regel der nesten ethvert `tall + år` ble tolket som alder.

### Rettelse
Alder krever nå tydelig alderskontekst, f.eks.:
- «er 20 år gammel»
- «fyller 20 år»
- «20-åring»
- «alderen er 20»

Varighet/ansiennitet som:
- «jobbet her i 20 år»
- «20 års erfaring»

skal ikke flagges som alder.

**Status:** Rettet i kode og dekket klient-/server-side med regresjonstester.

---

## 10. Personvern-UX: bruker bør kunne avvise et usikkert funn

### Forslag
I dag får brukeren i praksis bare mulighet til å rette personvernfunn. Ved heuristiske/falske positive bør bruker kunne markere:

> **«Dette er ikke en personopplysning»**

eller tilsvarende klarspråk.

### Foreslått sikkerhetsmodell
Ikke én generell «ignorer personvern»-knapp.

**Usikre/heuristiske funn** kan vurderes av bruker:
- mulig navn
- mulig alder
- arbeidssted
- familie-/livssituasjonsdetaljer
- andre kontekstuelle funn

**Tydelige direkte identifikatorer** bør fortsatt kreve retting:
- e-postadresse
- telefonnummer
- fødselsnummer/personnummer
- konkrete identifikasjonsnumre
- tilsvarende direkte identifikatorer

### Teknisk krav
En avvisning må håndteres på en måte som fortsatt respekteres av server-side personverngateway; det holder ikke å skjule varselet i klienten.

### Mulig læringssignal
Det kan vurderes å telle anonymiserte falsk-positiv-typer/ord uten å lagre hele samtaleteksten, slik at detektoren kan forbedres systematisk.

**Status:** Kandidat til senere design/implementasjon. Ikke implementert under aktiv pilot.

---

## 11. Pilotprinsipp og deploy

- Produksjonsversjonen bør ikke endres unødvendig mens det er sannsynlig at pilotbrukere er aktive.
- Bekreftede feil kan rettes på `main` og testes først.
- Deploy gjøres kontrollert når det er rolig, med full testpakke grønn.
- UX-/språkforbedringer samles fremfor å deployes én og én.

---

## 12. Refleksjonspunkter til rapporten

Pilotarbeidet gir allerede flere konkrete læringspunkter:

1. **Automatiske tester finner ikke alt.** Teknisk grønn testpakke avdekket ikke mobilbruk, vag språkføring, begrepsforvirring eller uklare undertemakort.
2. **Tester kan være utilstrekkelige.** Falske positive som `dag`, `dem`, `vårt` og `20 år` viser at testsett må utvides med realistisk språk fra faktiske brukere.
3. **Faktisk brukeradferd kan avvike fra planlagt scope.** Desktop var valgt målplattform, men minst fem brukere valgte mobil først.
4. **Personvernkontroll må balansere sikkerhet og brukbarhet.** En streng detektor er nyttig, men feilvarsler kan svekke tillit dersom bruker ikke får en trygg måte å korrigere systemets vurdering på.
5. **Faglig korrekt tekst er ikke nødvendigvis god UX.** Undertemabeskrivelser må hjelpe med valg, ikke bare være definisjoner.
6. **Forsiktighet i KI-svar kan bli for passiv.** Sikkerhetsrammer må kombineres med konkrete, anvendelige lederhandlinger.
7. **Pilotfunn bør skilles fra antakelser.** Rapporterte forhold, teknisk bekreftede feil og forbedringsforslag dokumenteres separat.

---

## Åpen backlog før samlet pilotforbedringsrunde

- [ ] Mobil/responsiv layout – designbeslutning og implementeringsplan.
- [ ] KI-språk – mindre passivt, mer konkret og naturlig.
- [ ] Begrepsfasit – særlig samtaleøvelse/simulering og personvernord.
- [ ] Hovedtema/undertema: ta stilling til forslagene i taksonomigjennomgangen, særlig «Oppsigelse og avslutning av arbeidsforhold», «Endret engasjement» og tydeligere skiller mellom overlappende kort.
- [ ] Spore og rette rå citation-markør i UI.
- [ ] Designe trygg «ikke en personopplysning»-flyt for heuristiske funn.
- [ ] Vurdere anonymisert logging/telling av falske positive uten samtaletekst.
- [ ] Samle resterende pilottilbakemeldinger før prioritering.
- [ ] Oppdatere refleksjonsrapporten med endelige pilotmønstre når datagrunnlaget er større.
