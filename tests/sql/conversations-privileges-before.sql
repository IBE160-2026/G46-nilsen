-- Verify the *insecure* baseline before the least-privilege proposal is applied.
-- Synthetic privileges replicate the read-only ACL found on the linked Supabase project.
-- All operations below run exclusively on a disposable PostgreSQL CI container.
\set ON_ERROR_STOP on

do $$
declare role_name text; privilege text;
begin
  foreach role_name in array array['anon','authenticated','service_role'] loop
    foreach privilege in array array['TRUNCATE','TRIGGER','REFERENCES','MAINTAIN'] loop
      if not has_table_privilege(role_name,'public.conversations',privilege) then
        raise exception 'Baseline did not grant % to %; test would not prove a fix',privilege,role_name;
      end if;
    end loop;
  end loop;
  if has_table_privilege('anon','public.conversations','SELECT') then
    raise exception 'Baseline anon unexpectedly has SELECT';
  end if;
end $$;

-- A real TRUNCATE succeeds before hardening despite RLS. Only a disposable,
-- empty test table is touched; this transaction rolls it back.
begin;
set role anon;
truncate table public.conversations;
rollback;

begin;
set role authenticated;
truncate table public.conversations;
rollback;

\echo 'Baseline: RLS enabled yet anon/authenticated can really TRUNCATE the disposable table: confirmed'
