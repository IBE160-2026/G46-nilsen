# KI-integrasjon – Samtalestøtte

**Prosjekt:** Samtalestøtte  
**Dokumenttype:** Teknisk oversikt over KI-integrasjon  
**Status:** Aktiv dokumentasjon  
**Versjon ved dokumentasjon:** 20.10.3  
**Sist gjennomgått:** 07.10.2026

---

# 1. Formål

Dette dokumentet beskriver hvordan KI er integrert i Samtalestøtte i dagens prototype.

Målet er å gi sporbarhet mellom:

- brukerens input
- personvernkontroll
- faggrunnlag
- modellkall
- KI-respons
- kildebruk
- videre dialog
- simulering
- testing
- planlagt lokal/offline drift

Dokumentet skiller mellom:

- funksjonalitet som er implementert
- funksjonalitet som er delvis implementert
- videre arbeid

---

# 2. Rollefordeling mellom frontend, backend og KI

Samtalestøtte er bygget som en webapplikasjon med:

- frontend i HTML/CSS/JavaScript
- Node.js-backend
- ekstern KI-modell via server
- lokal kuratert fagbank
- Supabase for autentisering og historikk
- testskript for sentrale KI- og personvernfunksjoner

KI-nøkler skal ikke ligge i frontend.

Modellkall håndteres via serverlaget.

---

# 3. Overordnet KI-flyt

Forenklet flyt:

```text
Bruker
  ↓
Situasjonstekst
  ↓
Personvern-/anonymiseringskontroll
  ↓
Tema og kontekst
  ↓
Relevant lokalt faggrunnlag
  ↓
Systeminstruks + responsregler
  ↓
KI-modell
  ↓
Strukturert svar
  ↓
Brukergrensesnitt
  ↓
Eventuell videre dialog / simulering / refleksjon
```

Målet er at KI-en ikke bare skal generere tekst, men operere innen definerte faglige og sikkerhetsmessige rammer.

---

# 4. Hva KI-en gjør i dagens prototype

KI brukes til flere deler av løsningen.

## 4.1 Situasjonsforståelse

KI kan analysere brukerens fritekst og forsøke å forstå:

- hva som faktisk er opplyst
- hva som er uklart
- hvilket dilemma lederen står i
- hvilke temaer som er relevante
- hvilke opplysninger som mangler

KI skal ikke fylle inn manglende fakta som om de var kjent.

---

## 4.2 Avklaringsspørsmål

Når informasjonen er utilstrekkelig kan KI stille korte og relevante oppfølgingsspørsmål.

Formålet er å redusere risikoen for at råd gis på feil grunnlag.

KI skal unngå unødvendig utspørring.

---

# 5. Samtaleråd

KI kan generere konkrete råd for hvordan en leder kan forberede og gjennomføre en krevende samtale.

Rådene kan blant annet omfatte:

- forslag til åpning
- hvilke observasjoner som bør tas opp
- forslag til spørsmål
- hvordan lytte og oppsummere
- hvordan være tydelig uten å gå unødvendig i konfrontasjon
- mulige reaksjoner
- hvordan håndtere motstand
- hva som bør unngås
- forslag til avslutning og videre oppfølging

Samtalerådene skal være situasjonstilpassede.

---

# 6. Samtalefaglig grunnlag

KI-en skal ikke bare gi råd ut fra generelle språkmodellmønstre.

Samtalestøtte har derfor en lokal fagbank med blant annet forskning og faggrunnlag knyttet til:

- aktiv lytting
- feedback
- motivasjon
- selvbestemmelsesteori
- leder–medarbeider-relasjon
- relasjonsledelse
- psykologisk trygghet
- coaching og veiledning
- konflikt
- organisatorisk rettferdighet
- motiverende intervju
- intensjonsbasert ledelse

Den kuraterte fagbanken ligger i:

```text
data/SOURCEBANK.json
```

Menneskelesbar dokumentasjon ligger i:

```text
docs/SOURCEBANK.md
```

og temaspecifikt faggrunnlag i:

```text
docs/faggrunnlag/
```

---

# 7. Lokal fagbank

SOURCEBANK er lokalt lagret i prosjektet.

Det betyr at kuraterte fagpunkter kan gjøres tilgjengelige for KI uten at systemet må gjøre et nytt weboppslag for hvert spørsmål.

Fagbanken kan inneholde:

- kilde-ID
- tittel
- forfatter
- år
- DOI eller URL
- tema
- faglige prinsipper
- når kilden er relevant
- begrensninger
- kildeautoritet
- dato for siste kontroll

Dette gir bedre:

- konsistens
- etterprøvbarhet
- kontroll
- mulighet for framtidig lukket drift

---

# 8. SOURCEBANK er ikke fulltekstlager

At en kilde finnes i SOURCEBANK betyr ikke automatisk at hele nettsiden, boken eller forskningsartikkelen er lagret lokalt.

Dagens fagbank består primært av:

- metadata
- kuraterte fagpunkter
- sammendrag
- regler for når kilden er relevant

Dette skillet er viktig både teknisk og opphavsrettslig.

---

# 9. Dynamisk webbruk

Weboppslag kan brukes som supplement når:

- informasjon er tidsfølsom
- regelverk må kontrolleres
- myndighetsinformasjon kan ha blitt endret
- relevant informasjon ikke finnes lokalt
- systemet har tilgang til webfunksjon

Web skal ikke være nødvendig for alle ordinære samtaleråd.

Lokalt kuratert faggrunnlag skal være førstevalg der det er tilstrekkelig.

---

# 10. Faglig transparens

Når faglig grunnlag er relevant skal systemet så langt som praktisk mulig kunne vise:

- at rådet har faglig forankring
- hvilke kilder som er relevante
- lenker til originalkilder
- fagsider
- eventuelle «Les mer»-områder

Det skal skilles mellom:

1. direkte kildeinformasjon
2. faglig forankret praktisk råd
3. KI-modellens egen syntese

KI skal ikke fremstille egen syntese som direkte kildeinnhold.

---

# 11. Systeminstruks

KI-atferden styres gjennom systeminstruksjoner dokumentert i:

```text
docs/ai/AI-SYSTEMPROMPT.md
```

Disse definerer blant annet:

- sikkerhetsregler
- faglig rolle
- krav til usikkerhet
- begrensning av spekulasjon
- bruk av faggrunnlag
- håndtering av vanskelige personalsaker
- forventet samtalestil

---

# 12. Responskontrakt

Strukturen for KI-svar er dokumentert i:

```text
docs/ai/AI-RESPONSE-CONTRACT.md
```

Responskontrakten skal bidra til:

- mer konsistente svar
- tydelig skille mellom råd og fakta
- bedre kildebruk
- mindre hallusinasjon
- enklere testing

---

# 13. Samtalepartner-modell

Samtalestøtte skal ikke fungere som en ren HR-klassifikator.

KI-en er utformet som en faglig samtalepartner som kan:

- forstå dilemma
- stille spørsmål
- gi råd
- utfordre antakelser
- foreslå alternative perspektiver
- støtte refleksjon

Dette er nærmere beskrevet i:

```text
docs/ai/SAMTALEPARTNER-MODELL.md
```

---

# 14. «Utfordre meg»

Brukeren kan velge funksjonen:

**Utfordre meg**

Da får KI-en større rom til å:

- utfordre brukerens antakelser
- foreslå alternative forklaringer
- peke på mulige blindsoner
- spørre om lederens egen rolle
- teste om problemforståelsen er for snever

Funksjonen gir ikke KI tillatelse til å:

- finne på fakta
- diagnostisere medarbeideren
- presentere spekulasjon som sannhet
- ignorere sikkerhetsreglene

---

# 15. Videre dialog

Etter første KI-råd kan brukeren fortsette dialogen.

KI-en kan da bruke relevant kontekst fra den pågående samtalen.

Dette gjør løsningen mer fleksibel enn et enkelt engangssvar.

Samtidig skal systemet være bevisst på:

- personvern
- kontekstgrenser
- manglende fakta
- overtolkning av tidligere tekst

---

# 16. Simulering

Samtalestøtte inneholder også simuleringsfunksjon.

Formålet er å la brukeren øve på en vanskelig samtale.

KI kan spille en medarbeiderrolle og reagere på lederens formuleringer.

Simuleringen skal:

- være situasjonsrelevant
- ikke finne på unødvendig bakgrunn
- ikke diagnostisere
- ikke gjøre medarbeideren til karikatur
- gi realistisk, men kontrollert motstand

---

# 17. Personvern før KI-kall

Personvern er en sentral del av KI-integrasjonen.

Brukeren skal minnes om anonymisering og unngå unødvendige personopplysninger.

Systemet inneholder personvernlogikk for å redusere risikoen for at identifiserbare eller sensitive opplysninger sendes videre ukritisk.

Eksempler kan omfatte:

- anonymiseringspåminnelse
- kjønn nøytralisert der relevant
- kontroll av fritekst
- begrensning av hva som lagres

Personvernfunksjonene er testet separat.

---

# 18. Historikk

Historikk er implementert som egen funksjon.

Lagring håndteres via Supabase.

Historikk skal ikke forstås som fri lagring av alt KI-en mottar.

Personvern og dataminimering er egne designkrav.

---

# 19. Autentisering

Autentisering er koblet til Supabase.

Dette brukes blant annet for:

- innlogging
- tilgang
- brukerhistorikk
- inviterte brukere

KI-endepunkter skal ikke være åpne bare fordi en bruker kjenner URL-en.

---

# 20. Testmodus

Serveren har støtte for kontrollert autentiseringsbypass i testmiljø:

```text
NODE_ENV=test
TEST_AUTH_BYPASS=1
```

Denne bypass-logikken skal bare kunne brukes når begge testbetingelser er oppfylt.

Dette gjør automatiserte tester mulig uten å svekke produksjonsautentiseringen.

---

# 21. Modellvalg og modelltesting

Prosjektet har arbeidet med flere KI-modeller og modellbenchmarking.

Dette brukes til å vurdere blant annet:

- svarkvalitet
- relevans
- sikkerhet
- kostnad
- stabilitet
- struktur

Modellvalg skal ikke hardkodes som et faglig premiss.

Arkitekturen skal så langt som praktisk mulig gjøre det mulig å bytte modell.

---

# 22. Automatisert KI-testing

KI-integrasjonen testes gjennom flere testskript.

Eksempler:

```text
tests/test-ai.js
tests/test-ai-stress.js
tests/test-model-compare.js
tests/test-privacy.js
tests/test-simulation.js
tests/test-simulation-ai.js
```

Testene dekker ulike deler av KI-systemet.

Resultater skal tolkes ut fra hva den enkelte testen faktisk verifiserer.

Ikke alle modelltester kjøres nødvendigvis fullstendig ved hver endring fordi enkelte krever:

- eksterne modellkall
- tid
- kostnad
- aktiv autentisering

---

# 23. Regressionstester

I tillegg finnes tester for blant annet:

- personvern
- serverlogikk
- historikk
- UI-regresjon
- simuleringslogikk
- opprydding i samtalebobler

Formålet er å redusere risikoen for at en ny KI- eller UI-endring ødelegger eksisterende funksjonalitet.

---

# 24. Kritisk bruk av KI under utviklingen

KI har vært brukt aktivt i utviklingsprosessen.

Forslag fra KI er ikke automatisk beholdt.

Prosjektet inneholder eksempler på:

- feil som ble oppdaget etter KI-genererte endringer
- forslag som ble justert
- endringer som ble reversert
- testfeil som førte til ny implementasjon
- iterasjon mellom design, kode og test

Dette dokumenteres mer detaljert i:

```text
docs/ai/AI-LOGG-SAMTALESTOTTE.md
```

og Git-historikken.

---

# 25. Feilhåndtering og usikkerhet

KI skal ikke late som den vet mer enn den faktisk vet.

Ved utilstrekkelig informasjon skal den kunne:

- stille oppfølgingsspørsmål
- uttrykke usikkerhet
- presentere flere mulige forklaringer
- anbefale kontroll mot relevant fagperson eller myndighetskilde

Dette er særlig viktig ved:

- oppsigelse
- varsling
- trakassering
- sykefravær
- rus
- vold og trusler
- sikkerhet
- juridiske problemstillinger

---

# 26. KI er ikke beslutningstaker

Samtalestøtte skal hjelpe lederen med:

- forberedelse
- refleksjon
- samtaleteknikk
- spørsmål
- struktur
- faglig orientering

KI skal ikke:

- fatte personalbeslutninger
- avgjøre skyld
- stille diagnoser
- konkludere juridisk i komplekse enkeltsaker
- erstatte HR, juridisk rådgivning eller sikkerhetsprosedyrer

---

# 27. Nåværende nettavhengighet

Dagens prototype er ikke fullstendig offline.

Selv om SOURCEBANK er lokal, bruker dagens løsning ekstern KI-modell.

Dermed krever full KI-funksjonalitet i dagens prototype tilgang til modellleverandøren.

Dette skal ikke forveksles med at fagbanken er lokal.

---

# 28. Planlagt lukket/offline løsning

For bruk i lukket nett er målbildet en arkitektur der:

```text
Lokale fagkilder
      ↓
SOURCEBANK / dokumentlager
      ↓
Lokal indeksering / RAG
      ↓
Intern eller lokal KI-modell
      ↓
Samtalestøtte
```

Da kan vanlig samtalestøtte fungere uten tilgang til offentlig internett.

---

# 29. Lokal RAG

En lokal RAG-løsning er ikke ferdig implementert i dagens prototype.

En slik løsning vil kreve blant annet:

- lokal dokumentlagring
- dokumentindeksering
- embeddings eller tilsvarende søkerepresentasjon
- retrieval
- versjonskontroll av fagpakker
- tilgangsstyring
- test av hvilke dokumenter som faktisk brukes

Dette er videre arbeid.

---

# 30. Fagpakker for lukket nett

Ved lukket drift kan faggrunnlaget distribueres som versjonerte fagpakker.

Eksempel:

```text
fagpakke-2026-10
```

Pakken kan inneholde:

- SOURCEBANK
- temaspecifikke fagfiler
- godkjente dokumenter
- regelverksutdrag
- metadata
- versjonsinformasjon
- sist-kontrollert-dato

Dette gjør det mulig å oppdatere faggrunnlaget kontrollert uten direkte www-tilgang.

---

# 31. Opphavsrett

En lokal fagbank betyr ikke at alle forskningsartikler kan kopieres inn i fulltekst.

Systemet skal skille mellom:

- åpent tilgjengelig materiale
- myndighetsmateriale
- virksomhetens egne dokumenter
- metadata
- kuraterte sammendrag
- materiale som krever lisens

---

# 32. Forholdet mellom lokal kunnskap og web

Målarkitekturen er:

```text
Lokal fagbank = normal faglig støtte

Web = oppdatering og kontroll av tidsfølsom informasjon
```

ikke:

```text
Hvert spørsmål
   ↓
Google/websøk
   ↓
KI-svar
```

Dette er viktig både for:

- hastighet
- forutsigbarhet
- personvern
- kvalitet
- framtidig lukket drift

---

# 33. Tekniske hemmeligheter

API-nøkler og andre hemmeligheter skal ligge i miljøvariabler.

Eksempel:

```text
OPENAI_API_KEY
```

De skal ikke:

- hardkodes i frontend
- committes til Git
- vises i klientkode
- lagres i dokumentasjonen

`.env` skal ikke versjonskontrolleres.

---

# 34. Lokal oppstart

Grunnleggende lokal oppstart:

```text
npm install
```

Opprett lokal `.env` basert på:

```text
.env.example
```

Deretter:

```text
npm start
```

Applikasjonen kan da åpnes lokalt på serveradressen prosjektet bruker.

Full funksjonalitet krever gyldige miljøvariabler og nødvendige eksterne tjenester.

README er autoritativ for aktuell oppstartsprosedyre.

---

# 35. Sporbarhet

KI-integrasjonen skal kunne spores mot:

```text
server.js
app.js
data/SOURCEBANK.json
docs/SOURCEBANK.md
docs/faggrunnlag/
docs/ai/AI-SYSTEMPROMPT.md
docs/ai/AI-RESPONSE-CONTRACT.md
docs/ai/SAMTALEPARTNER-MODELL.md
docs/ai/AI-TESTPLAN.md
docs/ai/AI-LOGG-SAMTALESTOTTE.md
tests/
```

---

# 36. Implementeringsstatus

## Implementert i prototypen

- ekstern KI-integrasjon
- situasjonsforståelse
- avklaringsspørsmål
- KI-genererte samtaleråd
- videre KI-dialog
- simuleringsfunksjon
- lokal SOURCEBANK
- temaspecifikt faggrunnlag
- faglige/sikkerhetsmessige systemregler
- responskontrakt
- personvernkontroller
- autentisering
- historikk
- modelltesting
- automatiserte tester
- «Utfordre meg»

## Delvis implementert / videreutvikles

- dynamisk kildebruk
- faglig transparens i alle svar
- full automatisk kildekobling
- modellbenchmarking
- webanalyse/logging

## Ikke ferdig implementert

- full lokal RAG
- full offline KI-drift
- lokal språkmodell i produksjonsklar løsning
- automatisk distribuert fagpakke for lukket nett

---

# 37. Oppsummering

KI-integrasjonen i Samtalestøtte har utviklet seg fra enkel situasjonsanalyse til en mer komplett KI-støttet samtaleplattform.

Dagens prototype kombinerer:

- KI-basert situasjonsforståelse
- empirisk faggrunnlag
- samtalestøtte
- refleksjon
- simulering
- personvern
- autentisering
- historikk
- testing

Den lokale fagbanken reduserer behovet for at all faglig informasjon hentes fra web ved hvert spørsmål.

Samtidig er dagens KI-modell fortsatt eksternt driftet.

En framtidig lukket versjon krever derfor lokal eller intern modelltilgang og lokal retrieval/RAG.

Målet er en arkitektur der:

> Samtalestøtte kan være faglig god på selve samtalen også uten offentlig internettilgang.