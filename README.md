# Samtalestøtte – prototype v11

Denne versjonen markerer overgangen fra lokal nøkkelordlogikk til ekte KI.

## Ekte KI i denne versjonen

KI brukes foreløpig bare til:
- å forstå brukerens fritekst semantisk
- å skille fakta fra antakelser
- å formulere selve dilemmaet
- å identifisere maks to relevante temaer
- å stille 0–3 nødvendige avklaringsspørsmål
- å lage korte klikkbare svaralternativer

Selve samtalerådene er fortsatt lokal prototype-logikk. Dette er bevisst: situasjonsforståelsen skal kvalitetstestes før KI får generere råd.

## Start appen med KI

1. Installer Node.js.
2. Åpne terminal i denne mappen.
3. Kjør `npm install`.
4. Kopier `.env.example` til `.env`.
5. Sett inn API-nøkkelen din i `OPENAI_API_KEY`.
6. Kjør `npm start`.
7. Åpne `http://localhost:3000`.

Appen må kjøres via serveren for at KI-integrasjonen skal virke. Åpner du bare `index.html` direkte, faller den tilbake til lokal prototypelogikk.

## Sikkerhet

API-nøkkelen ligger kun på serversiden og skal aldri legges inn i `app.js`, HTML eller annen kode som sendes til nettleseren. `.env` er lagt i `.gitignore`.

## Kvalitet og faggrunnlag

- `AI-SYSTEMPROMPT.md` – sikkerhets- og samtaleprinsipper
- `FAGGRUNNLAG-FRAVAER.md` – faglig grunnlag for Fravær og oppfølging
- `AI-TESTCASES.json` – realistiske testscenarier
- `AI-TESTPLAN.md` – kriterier for god og dårlig modelladferd
- `AI-RESPONSE-CONTRACT.md` – responskontrakt
- `AI-INTEGRATION.md` – tekniske detaljer for første KI-kobling

## Viktig

Personvernkontrollen i nettleseren er fortsatt en prototype og kan både overse opplysninger og gi falske treff. Ikke bruk reelle navn eller andre unødvendige identifiserende personopplysninger under testing.


## Feildiagnostikk
Hvis appen viser «Ekte KI er ikke tilgjengelig», viser v15 også HTTP-status, eventuell API-feilkode, modellnavn og et kort hint. Dette gjør det mulig å skille mellom ugyldig nøkkel (401), manglende tilgang (403), feil modell (404) og betalings-/bruksgrense (429).

## v16
Selve samtalestøtten og oppfølgingssamtalen bruker nå ekte KI, ikke bare situasjonsforståelsen. Rådene skal være situasjonsspesifikke, inkludere plausible reaksjoner og flagge relevante HR-/regelverkskontroller ved sensitive saker.


## Fagbank
Prosjektet inneholder nå `SOURCEBANK.json` og `SOURCEBANK.md`. Fagbanken er kurert og utvidbar og brukes selektivt av KI-en. Kritiske eller juridisk sensitive råd kan knyttes til kjente kilde-ID-er; modellen kan ikke oppgi vilkårlige kilder i strukturert veiledning.
