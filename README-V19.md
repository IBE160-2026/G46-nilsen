# Samtalestøtte v19.3 – Klarere simulator og bedre produktforklaring

Versjon 19.3 finpusser samtalesimulatoren før brukertesting og gjør Om-siden tydeligere på hvorfor løsningen finnes og hvordan den er utviklet.

## Simulator

- **Hold deg til saken** og **Utfordre meg** videreføres fra v19.2.
- **Overrask meg** er styrket slik at reaksjonen faktisk skal endre hva lederen må forholde seg til, ikke bare gi et vanlig samarbeidsvillig svar.
- **Følelsesmessig berørt** bruker kortere og mindre polerte svar med mer naturlig nøling.
- KI og bruker har nå hver sin avatar hentet fra de to profilene i Samtalestøtte-logoen.
- Samtaleboblene har tydeligere haler og mer uttalt snakkebobleform.

## Logo og visuell identitet

- Simulatorens hovedlogo er en egen hardt beskåret PNG med bare snakkeboblen og de to profilene – ingen bokstaver fra ordmerket.
- Logosymbolet er større på simulatorens startside.
- Simulatorikonet i sidemenyen bruker KI-profilen fra logoen.

## Mørk modus

- Personvernadvarsler er tydelig dus rosa med bedre kontrast.
- Godkjent personvernstatus bruker en lysere petrolflate som skiller seg fra øvrige appflater.

## Om Samtalestøtte

Om-siden forklarer nå:

- hvorfor verktøyet er utviklet
- hvorfor praktisk øvelse i krevende samtaler er viktig
- hvordan KI-støtten og simulatoren skal brukes
- hva verktøyet ikke erstatter
- at Samtalestøtte er utviklet av studenten **CCN** i samarbeid med **ChatGPT fra OpenAI** som del av en prosjektoppgave ved Høgskolen i Molde
- arbeidsdelingen mellom studentens produkt-/fagansvar og ChatGPT som utviklingsstøtte

## Testing

Kjør tekniske kontroller:

```bash
npm run test-simulation
npm run test-simulation:v19.2
npm run test-simulation:v19.3
npm run test-privacy
```

For live-test av simuleringsmodusene, start serveren og kjør:

```bash
npm run test-simulation:v19.2:live
```

Automatiske tester er et filter. Før ekstern brukertesting bør simulatoren fortsatt vurderes manuelt for realisme, språk og treningsverdi.

## v19.4 – simulatorchat og øvelsesrom

v19.4 fokuserer på å gjøre selve øvelsen lettere å forstå og bruke:

- chatten er høyere og kan utvides ytterligere med **Utvid samtalen**
- startinstruksjonen er ikke lenger utformet som en tom snakkeboble
- avatarene viser hele profilen og speilvendes kun i simuleringschatten slik at begge vender inn mot dialogen
- snakkeboblehalene er tydeligere og peker mot riktig avatar
- **Si dette** ligger til venstre sammen med øvrige primærhandlinger
- **Øv på denne samtalen** vises bare når en aktiv samtale faktisk kan brukes som grunnlag
- øv-kortet i vanlig KI-veiledning er gjort tydeligere som et naturlig neste steg

Ny strukturell test:

```powershell
npm run test-simulation:v19.4
```


## v19.5 – opprydding før brukertest

- kompaktere lys/mørk/system-velger
- fjernet duplisert «Ny samtale» i sidemenyen
- «＋ Ny samtale» i toppfeltet vises bare utenfor Hjem
- Historikk følger nå mørk modus konsekvent
- to-nivå personvernkontroll: tydelige identifikatorer blokkeres, indirekte gjenkjennbarhet varsles
- kjønnede pronomen alene blokkeres ikke
- smalere og sentrerte personvern-/infobokser
- eksisterende logo vises på støtte- og informasjonssidene
- ingen bildefiler endret
