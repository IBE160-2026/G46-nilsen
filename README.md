# Samtalestøtte – prototype v2

Videreutviklet fra prototype v1 med endringene som ble avtalt for v2.

## Endringer i v2
- valgt Samtalestøtte-logo integrert
- renere og luftigere forside med mindre hjelpetekst
- større temakort, høyere kontrast og tydelig ikon per hovedtema
- flyten hovedtema → undertema → forberedelse beholdt
- situasjonssiden forenklet til ett stort hovedfelt + ett valgfritt felt «Hva ønsker du hjelp til?»
- tydelig personvernveiledning med anonymiseringseksempler: «medarbeideren» og «hen»
- enkel lokal prototypekontroll for mulig e-post, telefonnummer, kjønnede pronomen og mulig personnavn
- prototypelogikk for å stille noen oppfølgingsspørsmål dersom situasjonsbeskrivelsen mangler sentral kontekst
- strukturert eksempel på fremtidig KI-svar: åpning, struktur, spørsmål, mulige reaksjoner, oppmerksomhetspunkter og oppfølging
- venstremeny beholdt
- lyst, mørkt og systemtema beholdt

## Viktig
Personvernkontrollen er bare en prototype og kan både overse opplysninger og gi falske treff. Den er ment å vise hvordan funksjonen kan fungere i en senere KI-versjon.

Åpne `index.html` i nettleseren for å teste prototypen.

## KI-kvalitetstesting

Prosjektet inneholder nå også:
- `AI-TESTCASES.json` – realistiske testscenarier for temaidentifikasjon og sikker adferd.
- `AI-TESTPLAN.md` – kriterier for hvordan KI-responser skal vurderes.
- `AI-RESPONSE-CONTRACT.md` – strukturert responsformat for fremtidig KI-integrasjon.

Disse skal brukes som regresjonstester når systemprompt, modell eller faglogikk endres.

