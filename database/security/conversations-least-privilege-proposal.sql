-- SECURITY REVIEW PROPOSAL ONLY. NOT DEPLOYED / NOT A SUPABASE MIGRATION.
-- Intended for a future reviewed, forward-only migration after isolated testing.
-- Target: public.conversations, based on read-only Supabase ACL audit 20.11.2026.
-- The browser does not need TRUNCATE, TRIGGER, REFERENCES or MAINTAIN.
-- Row ownership is still handled by the existing V20-8 RLS policies.
-- Deliberately preserve SELECT/INSERT/UPDATE/DELETE to authenticated.
-- Deliberately do NOT change service_role, table owner, PUBLIC or any other table.
-- If a broader PUBLIC/inherited grant is discovered, verification fails and rolls back;
-- review that unexpected grant separately rather than revoking privileges for all roles.
begin;

revoke truncate, trigger, references, maintain
  on table public.conversations
  from anon, authenticated;

-- Fail and roll back the whole transaction if excess privileges remain
-- (including privileges inherited via PUBLIC or another role membership).
do $$
declare
  role_name text;
  privilege text;
begin
  foreach role_name in array array['anon','authenticated'] loop
    foreach privilege in array array['TRUNCATE','TRIGGER','REFERENCES','MAINTAIN'] loop
      if has_table_privilege(role_name,'public.conversations',privilege) then
        raise exception 'Excess privilege survived hardening: % on conversations for %',
          privilege,role_name;
      end if;
    end loop;
  end loop;

  -- Service permissions should be preserved exactly for these operations;
  -- fail the transaction if a proposed change would affect their availability.
  foreach privilege in array array['TRUNCATE','TRIGGER','REFERENCES','MAINTAIN'] loop
    if not has_table_privilege('service_role','public.conversations',privilege) then
      raise exception 'Existing service_role privilege unexpectedly unavailable: %',privilege;
    end if;
  end loop;

  foreach privilege in array array['SELECT','INSERT','UPDATE','DELETE'] loop
    if not has_table_privilege('authenticated','public.conversations',privilege) then
      raise exception 'Required authenticated privilege lost: %',privilege;
    end if;
    if has_table_privilege('anon','public.conversations',privilege) then
      raise exception 'Anonymous CRUD privilege present: %',privilege;
    end if;
  end loop;

  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='conversations' and c.relrowsecurity
  ) then
    raise exception 'RLS is not enabled on public.conversations';
  end if;
end $$;
commit;
