# Changelog

## v18.2.0 – Om, kontakt og bedre samtaleflyt
- Flere tydelige innganger til «Ny samtale»: toppfelt, sidemeny, historikk og samtalevisning.
- «Ikke lagre denne samtalen» er erstattet av en mer diskret «Midlertidig samtale»-bryter.
- Ny side «Om Samtalestøtte» med formål, avgrensning, personvern og versjonsnummer.
- Ny side «Kontakt og tilbakemelding» for tekniske feil, KI-svar, kilder, personvern og forbedringsforslag.
- «Rapporter feil» er tilgjengelig direkte fra samtalevisningen.
- Kontaktadresse konfigureres med `CONTACT_EMAIL` i `.env`.
- Supabase-oppsettet inkluderer nødvendige grants for `authenticated` og `service_role`, mens RLS fortsatt beskytter samtalehistorikken.
- Pakkeversjon satt til 18.2.0 og Supabase-klienten lagt til i dependencies.
