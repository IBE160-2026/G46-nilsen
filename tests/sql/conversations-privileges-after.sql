-- Prove the proposed REVOKE actually takes effect, including via executed SQL.
-- Ordinary CRUD remains allowed for authenticated users and subject to V20-8 RLS.
\set ON_ERROR_STOP on

do $$
declare role_name text; privilege text;
begin
  foreach role_name in array array['anon','authenticated'] loop
    foreach privilege in array array['TRUNCATE','TRIGGER','REFERENCES','MAINTAIN'] loop
      if has_table_privilege(role_name,'public.conversations',privilege) then
        raise exception 'Excess privilege remains: % for %',privilege,role_name;
      end if;
    end loop;
  end loop;
  foreach privilege in array array['TRUNCATE','TRIGGER','REFERENCES','MAINTAIN'] loop
    if not has_table_privilege('service_role','public.conversations',privilege) then
      raise exception 'Unintended change to service_role privilege %',privilege;
    end if;
  end loop;
  foreach privilege in array array['SELECT','INSERT','UPDATE','DELETE'] loop
    if not has_table_privilege('authenticated','public.conversations',privilege) then
      raise exception 'Required authenticated CRUD grant missing: %',privilege;
    end if;
    if has_table_privilege('anon','public.conversations',privilege) then
      raise exception 'Unexpected anonymous CRUD grant: %',privilege;
    end if;
  end loop;
end $$;

-- Checking ACL bits is not enough: actually invoke SQL as the restricted roles.
set role anon;
do $$
begin
  begin
    execute 'truncate table public.conversations';
  exception when insufficient_privilege then
    return;
  end;
  raise exception 'Anon was able to TRUNCATE after hardening';
end $$;
reset role;

set role authenticated;
do $$
begin
  begin
    execute 'truncate table public.conversations';
  exception when insufficient_privilege then
    return;
  end;
  raise exception 'Authenticated role was able to TRUNCATE after hardening';
end $$;
reset role;

\echo 'Hardening confirmed: actual TRUNCATE denied to anon/authenticated, four excess privileges removed, CRUD/service preserved'
