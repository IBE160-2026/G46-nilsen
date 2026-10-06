-- Samtalestøtte v20.5 – brukertest og rollebaserte invitasjoner

alter table public.invites
  add column if not exists role text not null default 'user',
  add column if not exists expires_at timestamptz;

alter table public.invites drop constraint if exists invites_role_check;
alter table public.invites add constraint invites_role_check check (role in ('user','editor','admin'));

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  usability smallint not null check (usability between 1 and 5),
  navigation smallint not null check (navigation between 1 and 5),
  ai_relevance smallint not null check (ai_relevance between 1 and 5),
  practical_usefulness smallint not null check (practical_usefulness between 1 and 5),
  simulation smallint check (simulation between 1 and 5),
  privacy smallint not null check (privacy between 1 and 5),
  would_use smallint not null check (would_use between 1 and 5),
  improvement_text text not null default '',
  most_useful_text text not null default ''
);

alter table public.survey_responses enable row level security;
revoke all on table public.survey_responses from anon, authenticated;
grant select, insert, update, delete on table public.survey_responses to service_role;
