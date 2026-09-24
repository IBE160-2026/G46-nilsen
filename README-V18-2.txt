Samtalestøtte v18.2.0

Viktig før bruk:
1. Behold din eksisterende .env. Ikke kopier .env.example over den.
2. Legg til CONTACT_EMAIL=epostadressen_som_testere_skal_bruke i .env.
3. Kjør SUPABASE-SETUP.sql én gang i Supabase SQL Editor. Scriptet er idempotent og kan kjøres selv om tabellene allerede finnes.
4. Kjør npm install, deretter npm start.
5. Test innlogging, lagring, «Midlertidig samtale», «Ny samtale», Om og Kontakt.

Secret key skal aldri ligge i GitHub eller i frontend. .env skal fortsatt være ignorert av Git.
