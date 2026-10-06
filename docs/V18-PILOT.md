# v18.0 – konto og historikk

## Implementert
- Lukket registrering med engangsinvitasjonslenker.
- Brukernavn, e-post og passord.
- Passordhashing med scrypt; passord lagres ikke i klartekst.
- HttpOnly/SameSite-sessioncookie.
- Profilområdet viser «Logg på» uten konto og initialer + brukernavn ved innlogging.
- Historikk for innloggede brukere.
- «Ikke lagre denne samtalen» for midlertidige samtaler.
- Slett enkeltsamtale, all historikk eller konto.
- Varsel før ny samtale når aktiv samtale ikke er lagret.
- Utkast til bruksvilkår og personvernerklæring.
- Personvernkontroll for konkrete arbeidssteder/enheter med kontekstbevarende anonymisering.
- Bedre strukturering av oppfølgingssvar i «Fortsett samtalen».

## Bevisst ikke produksjonsklart
- Lokal JSON-lagring skal erstattes av produksjonsdatabase før ekstern pilot.
- Ingen e-postverifisering eller glemt-passord-flyt ennå.
- Ingen adminside for invitasjoner; invitasjoner genereres med `npm run invite -- <antall>`.
- Juridiske dokumenter er utkast og må kvalitetssikres før lansering.
