Samtalestøtte v20.0
=====================

Nyheter:
- Admin/redaktør-roller og mulighet for flere administratorer.
- Redigerbart tekstinnhold lagret i Supabase.
- Felles personvernkontroll på KI-felter, inkludert kjønnsnøytralisering.
- Personvernsjekk av lagret historikk.
- Simulator- og feilrapportforbedringer.

Før admin-innholdsredigering brukes:
1. Åpne Supabase -> SQL Editor.
2. Kjør hele V20-SUPABASE-MIGRATION.sql én gang.
3. Deploy appen som vanlig.

Hovedadministrator:
- Kontaktadressen i server.js fungerer som bootstrap-admin.
- Flere eksisterende brukere kan gis rollen Redaktør eller Admin fra Admin-siden.
- ADMIN_EMAILS kan valgfritt settes som kommaseparert liste i miljøvariablene.

Viktig:
- ZIP-pakken inneholder ikke PNG-filer. Behold eksisterende bilder i Git-mappen.
