-- Samtalestøtte v20.4 – sikkerhet, dataminimering og kildeovervåking
-- Kjør etter V20-3-SUPABASE-MIGRATION.sql.
-- Scriptet sletter ikke samtalehistorikk.


-- 0. To gamle betainvitasjoner var tidligere skrevet direkte i README og skal derfor regnes som eksponerte.
-- Marker eventuelle ubrukte forekomster som brukt/ugyldige.
update public.invites
set used_at = coalesce(used_at, now())
where used_at is null
  and code_hash in (
    '84222d149f8c0e88c0e0f5784e4a18e00f9755c7e0e15c46967e96bc69abbd9d',
    'fb5c6087eb34bba0df5f1274eb4bb6444b96175843acdb93af9a46b1f43d4a82'
  );

-- 1. Utvid anonym KI-/kildelogging med tema og konkrete kildesider.
alter table public.ai_usage_log
  add column if not exists topic_id text,
  add column if not exists subtopic text,
  add column if not exists source_pages jsonb not null default '[]'::jsonb;

-- Fjern gammel kobling mellom tekniske logger og brukerkontoer.
update public.ai_usage_log set user_id = null where user_id is not null;

-- Forsvar i dybden: selv om fremtidig kode skulle forsøke å lagre user_id i KI-loggen,
-- nullstilles feltet i databasen før INSERT/UPDATE.
create or replace function public.anonymize_ai_usage_user_id()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.user_id := null;
  return new;
end;
$$;

drop trigger if exists trg_anonymize_ai_usage_user_id on public.ai_usage_log;
create trigger trg_anonymize_ai_usage_user_id
before insert or update of user_id on public.ai_usage_log
for each row execute function public.anonymize_ai_usage_user_id();

create index if not exists ai_usage_log_topic_created_idx
  on public.ai_usage_log (topic_id, created_at desc)
  where topic_id is not null;

-- 2. Benchmark lagrer de konkrete kildesidene for modell-/SOURCEBANK-analyse.
alter table public.benchmark_results
  add column if not exists source_pages jsonb not null default '[]'::jsonb;

-- 3. Stram inn direkte klienttilgang. Serveren bruker service_role.
alter table public.ai_usage_log enable row level security;
alter table public.ai_response_feedback enable row level security;
alter table public.app_settings enable row level security;
alter table public.content_overrides enable row level security;
alter table public.benchmark_results enable row level security;
alter table public.invites enable row level security;

revoke all on table public.ai_usage_log from anon, authenticated;
revoke all on table public.ai_response_feedback from anon, authenticated;
revoke all on table public.app_settings from anon, authenticated;
revoke all on table public.content_overrides from anon, authenticated;
revoke all on table public.benchmark_results from anon, authenticated;
revoke all on table public.invites from anon, authenticated;

grant select, insert, update, delete on table public.ai_usage_log to service_role;
grant select, insert, update, delete on table public.ai_response_feedback to service_role;
grant select, insert, update, delete on table public.app_settings to service_role;
grant select, insert, update, delete on table public.content_overrides to service_role;
grant select, insert, update, delete on table public.benchmark_results to service_role;
grant select, insert, update, delete on table public.invites to service_role;

-- 4. Samtaler forblir bruker-eide via RLS; legg til indeks for tryggere/mer effektiv brukerfiltrering.
create index if not exists conversations_user_updated_idx
  on public.conversations (user_id, updated_at desc);

-- 5. Be PostgREST laste skjemaet på nytt med én gang.
notify pgrst, 'reload schema';
