# Samtalestøtte v19.2 – To simuleringsmoduser og UX-opprydding

Versjon 19.2 bygger videre på den separate samtalesimulatoren fra v19.1.

## Nytt i simulatoren

- **Hold deg til saken**: faktabasert simulering. Medarbeideren kan improvisere følelser, reaksjoner, spørsmål og motstand, men skal ikke etablere nye verifiserbare fakta som ikke finnes i saken.
- **Utfordre meg**: friere treningsmodus. Medarbeideren kan introdusere plausible og relevante overraskelser som bare gjelder inne i rollespillet.
- Reaksjonsstilen **Følelsesmessig berørt** er justert slik at nøling og følelsesmessig belastning blir tydeligere uten karikatur.
- **Overrask meg** er gjort mindre forutsigbar.
- Valgt simuleringsmodus lagres sammen med øvelsen, men simulerte fakta blandes ikke inn i den virkelige saken eller KI-rådene.

## UI/UX

- Samtalesimulatoren bruker den faktiske Samtalestøtte-logoen uten ordmerket i hovedflaten.
- Simulatorikonet i sidemenyen bruker KI-profilen fra logoen.
- «Ny samtale» bruker snakkebobleikon.
- Om og Kontakt er flyttet til en separat seksjon nederst i sidemenyen.
- Personvern- og statusbokser er harmonisert i størrelse, padding og hjørneradius.
- Mørk modus har roligere petrolfarget OK-status og dempet støvrosa/beige varsling.
- Statuslinjen i simulatoren har bedre avstand mellom reaksjonsstil og «Avslutt øvelse».
- Samtaleboblene er gjort litt større og luftigere.

## Testing

Kjør tekniske kontroller:

```bash
npm run test-simulation
npm run test-simulation:v19.2
npm run test-privacy
```

Når serveren kjører, kan live-testen for begge simuleringsmodusene kjøres med:

```bash
npm run test-simulation:v19.2:live
```

Live-testen har egne caser for faktabasert og fri simulering. Automatisk kontroll er et filter; manuell vurdering av realisme og faktatrohet er fortsatt nødvendig.
