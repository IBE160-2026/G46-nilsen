-- Samtalestøtte v20.6 – engangs brukertest, av/på-bryter og personvernbekreftelse

create table if not exists public.survey_participation (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_at timestamptz not null default now()
);
alter table public.survey_participation enable row level security;
revoke all on table public.survey_participation from anon, authenticated;
grant select, insert, update, delete on table public.survey_participation to service_role;

create table if not exists public.privacy_acknowledgements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  acknowledged_at timestamptz not null default now()
);
alter table public.privacy_acknowledgements enable row level security;
revoke all on table public.privacy_acknowledgements from anon, authenticated;
grant select, insert, update, delete on table public.privacy_acknowledgements to service_role;

insert into public.app_settings(key,value) values ('survey_enabled','{"enabled":true}'::jsonb)
on conflict (key) do nothing;
