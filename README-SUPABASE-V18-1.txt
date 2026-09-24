SAMTALESTØTTE v18.1 – BYTTE TIL SUPABASE

Filer i denne pakken:
- server.js                -> erstatter eksisterende server.js
- create-invite.js         -> erstatter eksisterende create-invite.js
- SUPABASE-SETUP.sql       -> kjøres én gang i Supabase SQL Editor

FØR OPPSTART
1. I .env skal disse finnes:
   SUPABASE_URL=https://...supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...

   Secret key skal KUN ligge i .env på serveren. Den skal aldri inn i app.js, index.html eller GitHub.

2. Kjør SUPABASE-SETUP.sql i Supabase SQL Editor.

3. Erstatt server.js og create-invite.js med filene fra pakken.

4. Start på nytt:
   npm start

5. Lag én testinvitasjon:
   npm run invite -- 1

6. Åpne invitasjonslenken i nettleseren og opprett en testkonto.

Merk:
- Brukere lagres nå i Supabase Auth.
- Samtalehistorikk lagres i conversations-tabellen.
- Invitasjoner lagres i invites-tabellen.
- RLS sørger for at en innlogget bruker bare kan lese/skrive sin egen historikk.
- Den gamle data/users.json og data/history.json brukes ikke lenger.
