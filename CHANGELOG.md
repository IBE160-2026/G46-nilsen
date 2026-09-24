# Changelog

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
