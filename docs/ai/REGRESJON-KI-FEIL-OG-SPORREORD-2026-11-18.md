# Lokal KI-feilsimulering og personvernregresjon – 18.11.2026

**Gren:** `docs/ibe160-helhetlig-revisjon-20261118`; **ikke** produksjon eller LIVE-pilot.  
**Krav:** FR-03, FR-04, FR-05, FR-06, AI-01–AI-06, NFR-01 og NFR-QA-01.  
**Testfiler:** `tests/test-ai-provider-errors-http.cjs`, `tests/support/offline-openai-fetch.mjs`, `tests/test-privacy.js`, `tests/test-server-privacy.cjs`.

## Testoppsett

Et eget Node.js-testprogram starter `server.js` og en lokal HTTP-server som **simulerer** OpenAI-responser. Ved oppstart av testserveren overstyrer en test-spesifikk `--import`-modul `fetch` for å rute OpenAI-URL-er til `127.0.0.1`. All annen ekstern fetch blokkeres i denne testprosessen. Kun dummy API-nøkkel, lokal Supabase-URL og `NODE_ENV=test` med `TEST_AUTH_BYPASS=1` brukes. Bypass er allerede implementert i appen, men er begrenset til eksplisitt testmiljø.

Dette gjør at vi prøver **selve API-endepunktene og OpenAI SDKs feilsti**, uten reelle AI-kall, persondata eller risiko for leverandørkostnader.

## Verifiserte negative scenarier

| Test | Endepunkt | Forventet offentlig respons | Resultat |
|---|---|---|---|
| Provider 503 | Temaforslag | `503 AI_TOPIC_CLASSIFICATION_FAILED` | Bestått |
| Provider 503 | Situasjonsanalyse | `503 AI_ANALYSIS_FAILED` | Bestått |
| Provider 429 | KI-veiledning | `429 AI_GUIDANCE_FAILED` | Bestått |
| Provider 503 | Videre samtale | `503 AI_CONTINUATION_FAILED` | Bestått |
| Provider 503 | Simulator | `503 SIMULATION_FAILED` | Bestått |
| Ugyldig JSON-innhold fra provider | Analyse | `500 AI_ANALYSIS_FAILED` | Bestått |
| Nettverksbrudd mot provider | Analyse | `500 AI_ANALYSIS_FAILED` | Bestått |
| Reelt navn i situasjon | Analyse | `400 PRIVACY_REVIEW_REQUIRED`, **ingen** providerforespørsel | Bestått |

For alle providerfeil er det i tillegg kontrollert at simulert intern feilmelding **ikke** eksponeres i API-responsen. Dette er teknisk feilhåndtering, **ikke** kvalitetstest av gode KI-råd. Langvarig heng/90-sekunders timeout, købelastning og faktisk internettutfall er ikke dekket.

## Rød test av uventet personvernfeil

Ved første gjennomføring av providerfeiltesten med et normalt oppfølgingsspørsmål, `Hvordan spør jeg?`, svarte appen `400 PRIVACY_REVIEW_REQUIRED` med navnefunn `Hvordan`. Dette skjedde fordi den delte navnedetektorens `subjectUnknown`-heuristikk oppfattet startordet etterfulgt av handlingsverbet `spør` som et personnavn.

**Rød kjøring:** [GitHub Actions 44342507107](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44342507107), commit `9c024c14c045ecff5527fb1023e606cd00a52619`: forventet providerfeil 503, men fikk 400 med `name=Hvordan`. Testen avdekket dermed en **brukerrettet feilblokkering**, ikke en sikkerhetslekkasje.

## Rettelse og verifikasjon

Den delte detektoren i `src/privacy-detector.js` har nå en eksplisitt liste over norske spørreord (`hvordan`, `hvorfor`, `hvor`, `når`, `hvorvidt`) i `GRAMMAR_NON_NAMES`. Dette hindrer at slike vanlige funksjonsord tolkes som ukjente personnavn. Vi la samtidig inn positive og negative regresjoner i både klient- og serverpersonverntesten:

- **Negative navnefunn:** `Hvordan spør jeg?`, `Hvordan mener du at jeg bør åpne samtalen?`, `Hvorfor kommer medarbeideren for sent?`, `Når begynner oppfølgingen?`.
- **Positive navnefunn beholdt:** `Knut spør hvordan vi bør følge opp.` skal fortsatt identifisere `Knut`. Originale navn, e-post, telefon og andre harde personvernblokker gjennomgås fortsatt av eksisterende tester.

**Grønn kjøring:** [GitHub Actions 44343038247](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44343038247), commit `4d78bcbc02d665c3cfa0ae68289b81370621dfc3`: alle **35** deterministiske deltester, `npm audit` og golden-opptelling ble gjennomført med **SUCCESS**, og audit fant **0 sårbarheter**.

## Kritisk refleksjon

En navnedetektor som forsøker å fange opp sjeldne navn kan samtidig blokkere uskyldig norsk. For Samtalestøtte er dette ekstra relevant fordi brukerne stiller mange spørsmål med `hvordan` og `hvorfor`. En for streng personverngateway kan redusere nytte og skape unødvendig frustrasjon, mens en for svak gateway kan sende identifiserende opplysninger til en ekstern tjeneste. Begge deler må testes. Rettelsen er bevisst liten, men ingen lokal regex gir en fullstendig garanti for at alle reelle personopplysninger fanges eller alle falske positiver unngås.

Som i forelesningens **human-in-the-loop**-prinsipp bør automatiske resultater kontrolleres både for **falske negative** og **falske positive**. Den røde testen dokumenterer at arbeidet faktisk førte til et uforutsett feilfunn, og den grønne verifiserer en avgrenset rettelse. Endringene er foreløpig **bare på revisjonsgrenen**. Verken `main`, Render-produksjon eller LIVE-piloten er endret.
