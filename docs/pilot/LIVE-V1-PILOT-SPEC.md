# LIVE V1 – pilotspesifikasjon

**Status:** PILOT ONLY  
**Miljø:** Render preview/pilot, aldri produksjon uten eksplisitt godkjenning  
**Dato:** 09.11.2026

## 1. Formål

LIVE V1 skal teste om Samtalestøtte blir enklere og mer naturlig å bruke når lederen kan snakke i stedet for å skrive.

Piloten skal først og fremst validere:
- muntlig input og løpende transkripsjon
- talekommandoer som «send»
- personvern før tekst sendes videre
- muntlige avklaringer om yrke og arbeidsgivertype når dette faktisk kan påvirke rådet
- tydelig mikrofonstatus og automatisk avslåing ved inaktivitet
- opplesning av korte systemmeldinger og et kort sammendrag av rådet

LIVE er ikke en funksjon for å lytte til eller analysere en ekte medarbeidersamtale mellom to personer.

## 2. Hard miljøgrense

LIVE V1 skal bare eksistere i pilotmiljøet.

Krav:
1. Ingen LIVE-kode deployes til produksjonsgrenen `main` i pilotperioden.
2. Render-produksjonstjenesten skal ikke endres.
3. Pilotutvikling skjer på egen gren.
4. Pilot-Render er eneste deploymål.
5. Funksjonen krever `LIVE_VOICE_PILOT_ENABLED=true` i pilotmiljøet.
6. Dersom flagget mangler eller er `false`, skal LIVE-knappen ikke vises og LIVE-endepunkter skal ikke være tilgjengelige.
7. Gamle pilotendringer arkiveres før pilotgrenen peker på LIVE-versjonen.

## 3. Arkitektur

V1 bruker en kjedet arkitektur:

`mikrofon → transkripsjon → personvernsjekk → kontekstavklaring → eksisterende Samtalestøtte-flyt → tekstsvar → kort opplesning`

Piloten skal ikke la en ny voice-agent erstatte Samtalestøttes eksisterende rådgivningslogikk.

### Pilotsteg A

Første pilotsteg bruker:
- eksisterende Render preview-service
- eksisterende deterministiske demo-backend for selve rådet
- OpenAI `gpt-live-transcribe` for transkripsjon når pilotmiljøet har `OPENAI_API_KEY`
- nettleserens SpeechSynthesis for opplesning av systemmeldinger i første pilot

Begrunnelse:
- vi kan teste LIVE-interaksjonen uten å berøre produksjonsdata eller produksjons-KI
- transkripsjon og samtaleflyt kan evalueres separat fra rådgivningskvaliteten
- dagens OpenAI Speech API er varslet avviklet i januar 2027; fast OpenAI-stemme skal derfor vurderes i neste pilotsteg via gjeldende Realtime/Live-løsning, ikke bygges inn som ny teknisk gjeld nå

### Pilotsteg B – senere

Når UX-flyten er godkjent:
- koble LIVE-inndata til den ordinære, testede Samtalestøtte-motoren i et fortsatt isolert pilotmiljø
- evaluere fast OpenAI-stemme, først `marin` og `cedar`
- kjøre egne LIVE-regresjonstester og personverntester
- ingen produksjonsmerge før eksplisitt godkjenning

## 4. Brukerflyt

### Start

Brukeren trykker **LIVE (pilot)**.

Panelet skal tydelig vise:
- at funksjonen er eksperimentell
- at mikrofonen bare brukes mens LIVE er aktiv
- at Samtalestøtte ikke lagrer lydopptak
- at transkribert tekst vises før den sendes videre
- at stemmen som leser opp meldinger er syntetisk

Brukeren trykker **Start mikrofon**.

Mikrofonstatus:
- Mikrofon av
- Kobler til …
- Lytter
- Tale registrert
- Behandler …
- Sender …
- Mikrofon pauset

## 5. Transkripsjon

Målmotor for pilot: `gpt-live-transcribe`.

Krav:
- språk settes til norsk (`no`)
- domenebegreper legges inn som keyword hints, blant annet:
  - arbeidsmiljøloven
  - statsansatteloven
  - habilitet
  - tariffavtale
  - tillitsvalgt
  - verneombud
  - BHT
  - AKAN
  - IA
  - sykefravær
  - oppsigelse
  - helsefagarbeider
  - sykepleier
  - barnehagelærer
- løpende deltranskripsjon skal kunne vises
- endelig transkripsjon brukes til kommando- og tekstbehandling
- ingen lydfil lagres av Samtalestøtte

## 6. Talekommandoer

Kommandoer skal bare trigges når de gjenkjennes som en kort, selvstendig ytring. Ordet «send» inne i en vanlig setning skal ikke sende teksten.

Minimum:
- **send**
- **slett**
- **start på nytt**
- **hopp over**
- **fortsett**
- **stopp mikrofon**
- **ja**
- **nei**

Godkjente send-varianter i V1:
- «send»
- «send nå»
- «send det»

Eksempel som IKKE skal trigge:
- «Jeg ba medarbeideren sende dokumentet.»

## 7. Personvern

Før transkribert tekst sendes til tema-/rådflyt skal den kontrolleres med samme personvernlogikk som vanlig tekstinput.

Ved hardt personvernfunn:
1. teksten sendes ikke
2. LIVE viser funnet visuelt
3. Samtalestøtte sier kort:
   «Jeg fant opplysninger som må anonymiseres før vi kan fortsette. Se teksten på skjermen.»
4. brukeren kan redigere teksten eller starte på nytt

LIVE skal aldri omgå eksisterende personverngateway.

## 8. Yrke – automatisk deteksjon og avklaring

Yrke skal bare avklares når det kan påvirke rådet.

### A. Yrke gjenkjent i teksten

Eksempel:
> «Jeg oppfatter at dette gjelder en sykepleier. Stemmer det?»

Svar:
- «ja» → bekreft yrket
- «nei» → «Si riktig yrke eller yrkesgruppe.»
- nytt yrke → lagre det som kontekst

Formuleringen «jeg oppfatter» brukes i stedet for «jeg har detektert» for å signalisere at systemet kan ha misforstått.

### B. Yrke ikke gjenkjent, men relevant

> «Yrket kan ha betydning for rådet i denne saken. Si yrket eller yrkesgruppen nå, eller si ‘hopp over’.»

### C. Yrke ikke relevant

Ingen spørsmål om yrke.

LIVE skal ikke bli et muntlig spørreskjema.

## 9. Arbeidsgivertype

Arbeidsgivertype avklares bare når den kan påvirke regelverk, tariff eller råd.

Hvis eksplisitt gjenkjent:
> «Jeg oppfatter arbeidsgiver som kommune. Stemmer det?»

Hvis nødvendig, men ukjent:
> «Arbeidsgivertype kan ha betydning her. Si stat, kommune eller fylkeskommune, helseforetak, privat, eller ‘usikker’.»

Viktig:
- arbeidsgivertype skal aldri utledes bare fra yrket
- «sykepleier» betyr ikke automatisk kommune eller helseforetak
- tariffområde skal ikke gjettes

## 10. Inaktivitet og mikrofon

Sikkerhetsmargin:
- etter **45 sekunder uten registrert tale**: visuelt og muntlig varsel
- melding:
  «Jeg har ikke hørt noe på en stund. Mikrofonen slås av om 15 sekunder. Si ‘fortsett’ hvis du vil beholde den på.»
- hvis brukeren sier «fortsett», nullstilles timeren
- etter totalt **60 sekunder uten tale** slås mikrofonen av
- melding:
  «Mikrofonen er nå slått av. Trykk på mikrofonen når du vil fortsette.»

Krav:
- mikrofonen skal aldri slå seg på igjen automatisk
- uferdig transkripsjon beholdes som utkast
- utkast sendes aldri automatisk fordi mikrofonen slås av

## 11. Opplesning

Første pilot bruker nettleserens SpeechSynthesis for korte systemmeldinger.

Krav:
- foretrekk norsk stemme når tilgjengelig
- brukeren kan velge blant tilgjengelige stemmer
- opplesning kan slås av
- mens Samtalestøtte snakker skal talegjenkjenning ikke behandle systemets egen stemme som brukerinput
- hvis brukeren begynner å snakke eller sier «stopp», skal pågående opplesning stoppes

Rådet skal ikke leses opp som en lang rapport.

Eksempel:
> «Jeg har laget et råd. Hovedpoenget er å avklare fakta før du konkluderer. Resten vises på skjermen.»

## 12. Feil og fallback

### Mikrofontillatelse avslått
- forklar kort hva som mangler
- vanlig tekstmodus skal fortsatt fungere

### Transkripsjon utilgjengelig
- LIVE viser at transkripsjonstjenesten ikke er konfigurert/tilgjengelig
- ingen skjult bytting til en annen ekstern transkripsjonsleverandør

### Nettverksbrudd
- behold tekstutkast lokalt i panelet
- ikke vis «sendt» før systemet faktisk har mottatt teksten

### Uforståelig tale
- vis at ytringen ikke ble forstått
- be brukeren prøve igjen
- ikke gjett kritiske fakta som yrke eller arbeidsgivertype

## 13. Pilottelemetri

Ingen lyd skal lagres.

For pilotmåling kan følgende telledata brukes uten samtaleinnhold:
- LIVE startet
- mikrofon startet/stoppet
- antall transkripsjonsfeil
- antall «send»-kommandoer
- antall timeout-varsler
- antall automatiske mikrofonavslag
- om yrke måtte avklares
- om arbeidsgivertype måtte avklares
- om personvernet blokkerte sending

Ingen rå lyd eller full transkripsjon skal lagres som analyse-/telemetridata.

## 14. Akseptansekriterier V1

Piloten er klar for brukertest når:

1. LIVE vises bare når pilotflagget er aktivt.
2. Produksjon er urørt.
3. Mikrofontillatelse håndteres tydelig.
4. Norsk tale kan transkriberes og vises fortløpende.
5. «Send» som egen ytring sender, men «sende» i vanlig setning gjør ikke det.
6. Personvern blokkerer hardt identifiserende opplysninger.
7. Detektert yrke bekreftes muntlig.
8. Manglende yrke etterspørres bare når konteksten tilsier at det kan ha betydning.
9. Arbeidsgivertype gjettes ikke fra yrke.
10. 45/60-sekunders timeout virker.
11. «Fortsett» nullstiller timeout.
12. «Stopp mikrofon» slår av mikrofonen.
13. Uferdig tekst sendes ikke automatisk.
14. Systemmeldinger kan leses opp og kan avbrytes.
15. Ingen lyd lagres.
16. Vanlig Samtalestøtte-flyt fungerer uendret når LIVE ikke brukes.

## 15. Testscenarier

### Normal
«Jeg må snakke med en medarbeider som stadig kommer for sent. Send.»

### Send som vanlig ord
«Jeg ba medarbeideren sende rapporten på fredag.»

Forventning: ikke send.

### Yrke funnet
«Jeg skal følge opp en sykepleier som har gjort flere feil i medisineringen. Send.»

Forventning:
- bekreft sykepleier
- ikke gjett arbeidsgivertype

### Yrke relevant, men ukjent
«En medarbeider bryter en sikkerhetsprosedyre som er viktig i jobben. Send.»

Forventning:
- spør om yrke/yrkesgruppe

### Yrke irrelevant
«To medarbeidere kommuniserer dårlig og avbryter hverandre i møter. Send.»

Forventning:
- ikke spør om yrke bare for å fylle kontekst

### Arbeidsgivertype
«Jeg vurderer oppsigelse av en rådgiver. Send.»

Forventning:
- arbeidsgivertype kan måtte avklares før konkret særregelverk/tariff

### Personvern
«Jeg må snakke med Lars Hansen om fravær. Send.»

Forventning:
- blokkert før sending
- muntlig personvernvarsel

### Timeout
Start mikrofon og vær stille.

Forventning:
- varsel ved 45 sekunder
- av ved 60 sekunder
- ingen automatisk sending

### Fortsett
Etter timeout-varsel: «fortsett».

Forventning:
- timer nullstilles
- mikrofon forblir aktiv

## 16. Beslutningsregel før eventuell produksjon

LIVE skal ikke vurderes for produksjon før:
- pilotbrukere har testet funksjonen
- transkripsjonskvalitet på norsk er målt med representative setninger, dialekt og støy
- personvernflyt er regresjonstestet
- talekommandoer har negative tester mot falske triggere
- eventuell fast KI-stemme er vurdert
- vanlig 40-case KI-golden og øvrig deterministic quality gate fortsatt er grønn etter eventuell senere integrasjon

Produksjonsaktivering krever eksplisitt beslutning. Pilot skal aldri gradvis «gli over» i produksjon.
