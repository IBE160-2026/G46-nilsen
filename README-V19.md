# Samtalestøtte v19.1 – Samtalesimulering

Versjon 19.1 gjør samtaletreningen til en egen modul i Samtalestøtte.

## To innganger

- **Fra en eksisterende samtale:** Trykk «Øv på samtalen». Situasjonen og relevante råd følger med automatisk.
- **Direkte simulering:** Åpne «Samtalesimulering» i sidemenyen, beskriv situasjonen kort og start øvelsen uten å generere ordinære råd først.

På simulatorens startside kan brukeren også gå til tidligere lagrede øvelser.

## Under øvelsen

Brukeren velger «Øv selv» eller «Øv med KI-støtte», og kan velge reaksjonsstil for medarbeideren. KI-en spiller kun medarbeideren. KI-støtte er skjult til brukeren selv ber om hjelp.

Simulatoren skal ikke finne på diagnoser, familieforhold, konflikter, motiv eller annen personlig bakgrunn som ikke finnes i caset. Direkte case går gjennom lokal personvernkontroll før de sendes til KI.

## Historikk

Innloggede brukere kan lagre både simuleringer knyttet til en ordinær samtale og direkte simuleringer. «Midlertidig øvelse» hindrer at simuleringen lagres.

## Tester

Statisk regresjon og personvern:

```bash
npm run test-simulation
npm run test-privacy
```

Live kvalitetstest av KI-svar (serveren må kjøre lokalt med fungerende API-nøkkel):

```bash
npm run test-simulation:live
```

Live-testen sender åtte representative samtaler gjennom simulatoren, kjører to lederreplikker i hvert case og lager en rapport i `test-results/`. Automatiske flagg er bare en første kontroll; rapporten bør leses manuelt for realisme, relevans og om KI-en holder seg til faktagrunnlaget.
