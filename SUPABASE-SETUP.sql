-- Samtalestøtte v18.1 – Supabase-oppsett
-- Kjør hele scriptet én gang i Supabase SQL Editor.

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  user_id uuid references auth.users(id) on delete set null
);

alter table public.invites enable row level security;
-- Ingen policies med vilje: invites håndteres kun av serveren med secret key.

-- Sikre at conversations har kolonnene appen trenger.
alter table public.conversations
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists title text,
  add column if not exists content text,
  add column if not exists updated_at timestamptz default now();

alter table public.conversations enable row level security;

-- Opprett policies bare hvis de ikke allerede finnes.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversations' and policyname='Users can view own conversations') then
    create policy "Users can view own conversations" on public.conversations for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversations' and policyname='Users can insert own conversations') then
    create policy "Users can insert own conversations" on public.conversations for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversations' and policyname='Users can update own conversations') then
    create policy "Users can update own conversations" on public.conversations for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversations' and policyname='Users can delete own conversations') then
    create policy "Users can delete own conversations" on public.conversations for delete using (auth.uid() = user_id);
  end if;
end $$;


-- API-rettigheter. RLS-policyene over begrenser fortsatt hver bruker til egne samtaler.
grant select, insert, update, delete
on table public.conversations
to authenticated;

-- Invitasjoner håndteres kun av serveren med Supabase secret key.
grant select, insert, update, delete
on table public.invites
to service_role;
