# Voice-design – Samtalestøtte

**Status:** Designbeslutning etter pilotinnspill, ikke implementert  
**Dato:** 29.10.2026  
**Primært bruksområde:** Samtaleøvelse

## 1. Produktavgrensning

Voice skal i første omgang være en måte for **lederen å øve muntlig mot KI-medarbeideren**.

Voice skal ikke markedsføres eller utformes som opptak, medlytt eller analyse av en virkelig medarbeidersamtale. UI-et skal eksplisitt si at mikrofonfunksjonen er for øvelse alene og ikke skal brukes til å ta opp en reell samtale med en medarbeider.

Denne avgrensningen følger produktets formål: forberedelse, trening og refleksjon – ikke overvåking eller dokumentasjon av ansatte.

## 2. Dagens tekniske status

Dagens server sender:

`Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`

Mikrofon er derfor eksplisitt deaktivert i produksjonen.

Når voice faktisk implementeres, kan mikrofonpolicyen begrenses til egen origin, for eksempel `microphone=(self)`. Kamera, geolokasjon og andre unødvendige tillatelser skal fortsatt være deaktivert.

Nettleseren må kjøre i sikker kontekst (HTTPS eller localhost), og brukeren må gi mikrofontillatelse eksplisitt.

## 3. Tre mulige nivåer

### Nivå A – tale ut

KI-svar kan leses høyt med tekst-til-tale.

Fordeler:
- ingen mikrofontillatelse
- mindre personvernrisiko
- kan hjelpe mobilbruk og tilgjengelighet

Dette kan bygges og testes uavhengig av tale inn.

### Nivå B – trykk og snakk til tekst

Anbefalt første voice-MVP.

Flyt:

1. Brukeren trykker aktivt på «Trykk og snakk».
2. Mikrofonstatus vises tydelig.
3. Tale transkriberes.
4. Transkripsjonen vises til brukeren.
5. Personvernkontrollen kjøres på teksten.
6. Brukeren kan rette/generaliserer.
7. Først deretter sendes teksten inn i den eksisterende samtaleøvelsen.

Viktig: Dersom transkripsjonen skjer hos ekstern leverandør, har rå lyd allerede blitt behandlet eksternt før dagens tekstbaserte personvernkontroll. Dette må beskrives tydelig og vurderes personvernmessig.

En mer personvernbevarende framtidsvariant er lokal/intern tale-til-tekst før teksten forlater klient/lukket miljø.

### Nivå C – full sanntidsvoice

En realtime tale-til-tale-øvelse kan bruke WebRTC. Dette gir naturlig turtaking, lav forsinkelse, avbrytelser og KI-stemme.

Krever blant annet:
- serverendepunkt som etablerer autorisert voice-session uten å eksponere API-nøkkel i nettleseren
- WebRTC i klient
- eksplisitt mikrofontillatelse
- start, stopp og mute
- håndtering av avbrudd og forbindelsesfeil
- transkripsjon/captions dersom brukeren skal kunne se eller lagre dialogen
- egen kostnads- og brukslogging uten lydinnhold
- oppdatert personvernerklæring og databehandler-/behandlingsvurdering
- beslutning om hva som eventuelt lagres

## 4. Personvernkrav

Voice skal følge disse minimumskravene:

- mikrofon starter aldri automatisk
- aktiv mikrofon skal alltid være tydelig synlig
- stopp/mute skal være tilgjengelig med ett trykk
- ingen lyd lagres som standard
- teksttranskripsjon skal ikke lagres i midlertidig øvelse
- vanlig tekstøvelse fungerer dersom mikrofontillatelse nektes
- mikrofontillatelse skal bare forespørres når brukeren faktisk velger voice
- UI skal advare mot navn og andre identifiserende opplysninger før voice starter
- UI skal si eksplisitt: «Ikke bruk voice til å ta opp en virkelig medarbeidersamtale»
- eventuell ekstern lydbehandling skal være forklart i personvernteksten
- dersom samtaletekst lagres i historikk, skal eksisterende lagrings-/sletteprinsipper gjelde

## 5. Hvorfor dagens personvernfilter ikke er nok for full realtime

I tekstflyten kan Samtalestøtte stoppe eller advare om personopplysninger før teksten sendes til KI.

I direkte cloud-voice sendes lydstrømmen til tale-/realtime-tjenesten før lokal tekstkontroll har en ferdig transkripsjon. Det betyr at personvernfilteret ikke kan brukes som samme forhåndsgateway.

Mulige framtidige strategier:
- akseptere ekstern lydbehandling med tydelig behandlingsgrunnlag/informasjon og dataminimering
- lokal/intern tale-til-tekst før ekstern KI
- full lokal/intern voice-stack for lukket nett

For prosjektets personvernprofil er lokal/intern behandling det sterkeste langsiktige målbildet.

## 6. UX i samtaleøvelsen

På mobil bør voice være svært enkelt:

- én tydelig knapp: «Start taleøvelse»
- før start: kort personvernmelding
- aktiv tilstand: stor «Mikrofon på»-indikator og «Stopp»
- KI-medarbeiderens tale kan avbrytes
- transkripsjon kan vises som samtalebobler
- etter øvelsen kan samme refleksjon/tilbakemelding som tekstøvelsen brukes

Voice skal ikke legge flere avanserte lydvalg i hovedskjermen. Valg av mikrofon/stemme kan ligge i et sekundært panel ved behov.

## 7. Anbefalt rekkefølge

1. Ferdigstill v20.11 tekst-/mobilforbedringer.
2. Test «tale ut» separat.
3. Lag liten prototype for trykk-og-snakk i samtaleøvelsen.
4. Gjennomfør personvern-/lagringskontroll.
5. Vurder full WebRTC/realtime først etter at MVP-en er testet.
6. Hold lokal/offline voice som eget framtidig arkitekturspor.

## 8. Eksterne tekniske referanser

- MDN: `MediaDevices.getUserMedia()` – mikrofontillatelse og sikker kontekst.
- OpenAI: WebRTC / Realtime voice – browser voice-session over WebRTC med nøkkel/sessionkontroll på server.
- Datatilsynet: veiledning om lydopptak og kontrolltiltak – lydopptak i arbeidslivet krever særskilt vurdering og skal ikke innføres som et tilfeldig tillegg.

