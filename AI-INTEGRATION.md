# Ekte KI – første integrasjon

Denne versjonen kobler ekte KI til **situasjonsforståelse og avklaringsspørsmål**. Selve samtalerådene er fortsatt lokal prototype-logikk slik at vi kan kvalitetsteste forståelsen før KI får gi råd.

## Start lokalt

1. Installer Node.js dersom det ikke allerede er installert.
2. Åpne terminal i prosjektmappen.
3. Kjør `npm install`.
4. Kopier `.env.example` til `.env`.
5. Legg OpenAI API-nøkkelen i `OPENAI_API_KEY` i `.env`.
6. Kjør `npm start`.
7. Åpne `http://localhost:3000` i nettleseren.

**Ikke legg API-nøkkelen i `app.js` eller annen frontend-kode.** `.env` skal holdes lokalt og ikke deles.

## Hva KI-en gjør i denne versjonen

- leser brukerens fritekst semantisk
- identifiserer hva som faktisk er opplyst
- beskriver dilemmaet
- kan markere maks to relevante temaer
- genererer 0–3 korte avklaringsspørsmål med klikkbare svaralternativer
- kan ignorere feil valgt tema dersom friteksten tydelig handler om noe annet

## Hva den ikke gjør ennå

- genererer ikke de endelige samtalerådene
- fører ikke den videre fritekstdialogen med KI
- lagrer ikke samtaler eller historikk

Dette er bevisst. Før vi åpner neste ledd skal situasjonsforståelsen testes mot testcasene i `AI-TESTCASES.json`.
