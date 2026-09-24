# Changelog

## v19.0.0 – Samtalesimulering

- Ny «Øv på samtalen»-modul etter den vanlige samtalestøtten.
- Brukeren spiller leder, mens KI-en spiller kun medarbeideren.
- To treningsmoduser: «Øv selv» og «Øv med KI-støtte».
- KI-støtte gis bare når brukeren ber om den, med korte valg for formulering, spørsmål, tydelighet og hva som bør unngås.
- Seks reaksjonsstiler: åpen/samarbeidsvillig, usikker/tilbaketrukket, defensiv/uenig, følelsesmessig berørt, frustrert/kritisk og «Overrask meg».
- Samtalen vises i profesjonelle snakkebobler inspirert av Samtalestøtte-logoen.
- Øvelsen kan avsluttes når som helst og gir konkret tilbakemelding uten poengsum eller karakter.
- Tilbakemeldingen er delt i: hva som fungerte, hva som kunne vært tydeligere, alternativ formulering og viktigste læringspunkt.
- «Prøv samme samtale på nytt» lar brukeren øve igjen med samme case.
- Simulatoren får eksplisitte regler mot å finne på diagnoser, familieforhold, konflikter, motiv eller annen bakgrunn som ikke finnes i saken.
- Simulering og tilbakemelding lagres sammen med samtalen i eksisterende historikk når brukeren er innlogget og samtalen ikke er midlertidig. Ingen ny databasetabell er nødvendig.
- Ny regresjonstest `npm run test-simulation` kontrollerer at simulatorens UI, API-ruter og sikkerhetsgrenser finnes i bygget.

## v18.3.0 – UX, Om-side og sterkere personvernkontroll

- Profilmenyen lukkes ved klikk utenfor og med Esc. Innloggingsdialogen kan også lukkes ved klikk på bakgrunnen.
- «Om Samtalestøtte» og «Kontakt og tilbakemelding» vises nå i hovedfeltet i stedet for nederst på siden.
- Om-siden beskriver at Samtalestøtte er utviklet av Cecilie C. Nilsen i forbindelse med en prosjektoppgave ved Høgskolen i Molde.
- Produktstatus er endret fra pilot til beta i brukergrensesnittet.
- Personvernerklæring, bruksvilkår og kontakt er tilgjengelige direkte fra Om-siden.
- Den doble «Ny samtale»-knappen i sidemenyen er fjernet. «Forbered samtale» er erstattet av «Ny samtale».
- «Ny samtale» er også tilgjengelig nederst i samtalevisningen for å unngå unødvendig scrolling.
- Navnedeteksjonen er utvidet og er case-insensitiv. Blant annet fanges «trude», «Trude» og flere vanlige norske navn.
- Lokal kontekstdeteksjon er styrket for navn skrevet med små bokstaver uten at teksten sendes til ekstern KI før personvernkontrollen.
- Personverntestene er utvidet til 26 tester.

## v18.2.0 – Om, kontakt og bedre samtaleflyt
- Flere tydelige innganger til «Ny samtale»: toppfelt, sidemeny, historikk og samtalevisning.
- «Ikke lagre denne samtalen» er erstattet av en mer diskret «Midlertidig samtale»-bryter.
- Ny side «Om Samtalestøtte» med formål, avgrensning, personvern og versjonsnummer.
- Ny side «Kontakt og tilbakemelding» for tekniske feil, KI-svar, kilder, personvern og forbedringsforslag.
- «Rapporter feil» er tilgjengelig direkte fra samtalevisningen.
- Kontaktadresse konfigureres med `CONTACT_EMAIL` i `.env`.
- Supabase-oppsettet inkluderer nødvendige grants for `authenticated` og `service_role`, mens RLS fortsatt beskytter samtalehistorikken.
- Pakkeversjon satt til 18.2.0 og Supabase-klienten lagt til i dependencies.
