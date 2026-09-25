# Product brief – Samtalestøtte

## Bakgrunn og behov

Samtalestøtte er utviklet som et digitalt støtteverktøy for ledere som skal forberede og gjennomføre krevende samtaler med medarbeidere. Ideen bygger på egne erfaringer fra tidligere lederroller, hvor vanskelige samtaler var en naturlig del av hverdagen, men hvor det ofte var lite praktisk trening i hvordan slike samtaler faktisk skulle gjennomføres.

Lederutdanning gir mye teori om kommunikasjon, relasjoner og ledelse, men den praktiske treningen på vanskelige samtaler er ofte begrenset. Det kan gjøre at ledere møter slike situasjoner med lite trening i hvordan de bør åpne samtalen, hvilke spørsmål som kan være nyttige, hvordan de kan håndtere ulike reaksjoner, og hvordan samtalen bør følges opp.

Samtalestøtte skal ikke ta beslutninger for lederen. Målet er å gi støtte til forberedelse, gjennomføring og refleksjon, slik at lederen står bedre rustet til å håndtere krevende situasjoner på en trygg og ryddig måte.

## Målgruppe og formål

Primær målgruppe er ledere med personalansvar. Løsningen kan også være relevant for andre som har oppfølgings- eller veiledningsansvar i arbeidslivet.

Formålet er å gjøre det enklere å:
- strukturere en vanskelig samtale før den gjennomføres
- formulere en god åpning
- finne relevante spørsmål
- forberede seg på ulike reaksjoner fra medarbeideren
- reflektere over samtalen i etterkant
- få støtte uten at løsningen fremstår som et komplett HR-system

Første versjon skal være en fungerende prototype som viser at konseptet kan brukes i praksis. Den skal ikke erstatte HR, juridisk bistand eller lederens eget skjønn.

## Planlagt funksjonalitet

Løsningen er webbasert og organiseres rundt vanlige temaer ledere kan møte, blant annet fravær, prestasjon og utvikling, samarbeid og kommunikasjon, lønn, alkohol og rus, sikkerhet, avslutning av arbeidsforhold og livssituasjoner.

Brukeren skal kunne beskrive situasjonen med få tekstfelt. KI-en skal deretter hjelpe med å forstå situasjonen, stille nødvendige avklaringsspørsmål og gi forslag til videre samtalestøtte.

Det er planlagt støtte til:
- forberedelse før samtalen
- forslag til åpning og spørsmål
- mulige reaksjoner fra medarbeideren
- forslag til hvordan reaksjoner kan møtes
- refleksjon etter samtalen
- samtalesimulering hvor brukeren kan øve på en krevende dialog
- historikk slik at brukeren kan gå tilbake til tidligere arbeid

Brukergrensesnittet skal være enkelt og oversiktlig. Målet er at en leder skal kunne bruke løsningen uten opplæring.

## Personvern, etikk og sikkerhet

Personvern er en viktig del av prosjektet fordi brukerne kan komme til å beskrive sensitive forhold på arbeidsplassen. Brukeren skal derfor oppfordres til å unngå navn og andre direkte identifiserende opplysninger.

Løsningen skal i tillegg ha lokal kontroll av teksten før den sendes til KI. Dersom det oppdages navn, e-postadresse, telefonnummer, fødselsdata, adresse eller andre tydelige identifikatorer, skal brukeren varsles og få mulighet til å endre teksten før den sendes videre.

Prinsippet er å anonymisere identitet uten å fjerne nødvendig kontekst.

KI-en skal ikke finne på fakta, diagnoser, motiv eller skyld. Ved sensitive HR- eller juridiske problemstillinger skal løsningen være forsiktig og heller anbefale videre vurdering enn å gi bastante konklusjoner.

Løsningen bruker nødvendig lokal lagring og sesjonsinformasjon for funksjoner som innlogging, tema og brukerinnstillinger. Det planlegges ikke markedsførings- eller sporingscookies i første versjon.

## Valg og testing av KI

Det er ikke planlagt å trene en egen språkmodell. Prosjektet skal bruke eksisterende KI-modeller gjennom API.

Flere modeller skal prøves ut før endelig valg. De skal vurderes ut fra:
- kvalitet og relevans på svarene
- hvor godt modellen følger instruksjoner
- hvordan den håndterer sensitive og vanskelige situasjoner
- hvor stabil den er over flere tester
- responstid
- kostnad per bruk

Målet er ikke å velge den mest avanserte modellen uansett pris, men den modellen som gir best balanse mellom kvalitet, sikkerhet og kostnad.

## Testing og evaluering

Løsningen skal testes kontinuerlig under utviklingen. Det gjelder både tekniske funksjoner, personvernkontroll og kvaliteten på KI-svarene.

Det planlegges egne testcaser for ulike typer krevende samtaler, og personvernfunksjonen skal testes systematisk for å kontrollere at identifiserende informasjon blir fanget opp før KI-kall.

Før eventuell deploy planlegges brukertesting. Målet er å undersøke om løsningen er enkel å forstå, om rådene oppleves som relevante, og om brukerne finner flyten naturlig.

Tilbakemeldinger fra brukertestingen skal brukes til å forbedre språk, funksjoner og brukeropplevelse før løsningen eventuelt tas videre.

## Avgrensning og suksesskriterier

Første versjon skal ikke være et komplett HR-system, journalsystem eller beslutningsverktøy. Den skal være et praktisk støtteverktøy for vanskelige samtaler.

Prosjektet regnes som vellykket dersom prototypen:
- fungerer stabilt i de viktigste brukerflytene
- er enkel å forstå uten opplæring
- gir konkret og relevant samtalestøtte
- håndterer personvern før tekst sendes til KI
- gir nyttige resultater i brukertesting
- kan videreutvikles etter erfaringer fra testing og faktisk bruk
