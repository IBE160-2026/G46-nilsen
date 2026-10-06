-- Samtalestøtte v20.0 – admin/redigerbart innhold
-- Kjør hele scriptet én gang i Supabase SQL Editor før du bruker innholdsredigering.

create table if not exists public.content_overrides (
  content_key text primary key,
  content_value text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.content_overrides enable row level security;

-- Tabellen leses og skrives av Samtalestøtte-serveren med service_role.
-- Ingen direkte klientpolicyer er opprettet med vilje.
grant select, insert, update, delete
on table public.content_overrides
to service_role;
