# Samtalestøtte v19.0 – Samtalesimulering

Versjon 19 bygger videre på v18.3 og legger til samtaletrening etter at brukeren har fått ordinær samtalestøtte.

## Slik fungerer det
1. Beskriv saken og få samtalestøtte som før.
2. Trykk **Øv på samtalen**.
3. Velg **Øv selv** eller **Øv med KI-støtte**.
4. Velg ønsket reaksjonsstil for medarbeideren.
5. Brukeren skriver det hen faktisk ville sagt som leder. KI-en svarer kun som medarbeideren.
6. Avslutt øvelsen for å få konkret refleksjon og et alternativt forslag til formulering.
7. Velg **Prøv samme samtale på nytt** for en ny runde.

## Personvern og sikkerhet
Simulatoren bruker samme anonymiserte case som den ordinære veiledningen. Systeminstruksjonen sier eksplisitt at simulatoren ikke skal finne på diagnose, familieforhold, traumer, konflikter, rusbruk, motiv eller andre personlige opplysninger som ikke finnes i saken.

Hvis brukeren er innlogget, kan simuleringen lagres i samme historikkpost som saken. «Midlertidig samtale» gjelder også for simuleringen.

## Database
Ingen ny SQL eller ny tabell kreves i v19. Simuleringsdata lagres inne i `content`-feltet i den eksisterende `conversations`-tabellen.

## Test
Kjør:

```bash
npm run test-simulation
npm run test-privacy
```

KI-endepunktene krever fortsatt `OPENAI_API_KEY`.
