-- Behavioral RLS regression under actual PostgreSQL, running the repository's V20-8 policies.
-- Uses SQL session role and synthetic JWT 'sub' values. NOT live Supabase Auth/PostgREST.
\set ON_ERROR_STOP on
DO $$
DECLARE policy_count integer; rls_count integer;
BEGIN
 select count(*) into policy_count from pg_policies
 where schemaname='public' and tablename='conversations'
   and roles='{authenticated}'::name[];
 if policy_count<>4 then raise exception 'Expected 4 authenticated conversation policies, got %',policy_count; end if;
 select count(*) into rls_count from pg_class c join pg_namespace n on c.relnamespace=n.oid
 where n.nspname='public' and c.relkind='r' and c.relrowsecurity;
 if rls_count<>10 then raise exception 'Expected RLS on 10 test tables, got %',rls_count; end if;
 if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversations' and cmd='UPDATE' and with_check is not null) then
   raise exception 'UPDATE must explicitly have WITH CHECK';
 end if;
 if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversations' and cmd='INSERT' and with_check is not null) then
   raise exception 'INSERT must explicitly have WITH CHECK';
 end if;
END $$;

-- All four CRUD operations execute as the authenticated role, never table owner.
set role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
insert into public.conversations(id,user_id,title) values
 (101,'11111111-1111-4111-8111-111111111111','A private');
DO $$
DECLARE n int;
BEGIN
 select count(*) into n from public.conversations;
 if n<>1 then raise exception 'A should read its own inserted row'; end if;
 begin
   insert into public.conversations(id,user_id,title) values
     (103,'22222222-2222-4222-8222-222222222222','A forges B owner');
   raise exception 'A was allowed to insert a B-owned row';
 exception when insufficient_privilege then null;
 end;
END $$;

-- B inserts its own row and cannot see or change A's row.
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',false);
insert into public.conversations(id,user_id,title) values
 (202,'22222222-2222-4222-8222-222222222222','B private');
DO $$
DECLARE n int;
BEGIN
 select count(*) into n from public.conversations;
 if n<>1 then raise exception 'B should see exactly 1 row, got %',n; end if;
 select count(*) into n from public.conversations where id=101;
 if n<>0 then raise exception 'B could read A row'; end if;
 update public.conversations set title='B stole A' where id=101;
 get diagnostics n=row_count;
 if n<>0 then raise exception 'B modified A row: %',n; end if;
 delete from public.conversations where id=101;
 get diagnostics n=row_count;
 if n<>0 then raise exception 'B deleted A row: %',n; end if;
 begin
   update public.conversations set user_id='11111111-1111-4111-8111-111111111111' where id=202;
   raise exception 'B transferred its row to A';
 exception when insufficient_privilege then null;
 end;
END $$;

-- A cannot read, edit, or delete B's row, but can update its own.
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
DO $$
DECLARE n int;
BEGIN
 select count(*) into n from public.conversations;
 if n<>1 then raise exception 'A should see exactly 1 row, got %',n; end if;
 select count(*) into n from public.conversations where id=202;
 if n<>0 then raise exception 'A could read B row'; end if;
 update public.conversations set title='A stole B' where id=202;
 get diagnostics n=row_count;
 if n<>0 then raise exception 'A modified B row: %',n; end if;
 delete from public.conversations where id=202;
 get diagnostics n=row_count;
 if n<>0 then raise exception 'A deleted B row: %',n; end if;
 update public.conversations set title='A edited own' where id=101;
 get diagnostics n=row_count;
 if n<>1 then raise exception 'A could not edit its own row'; end if;
END $$;

-- None of the nine internal tables has a direct authenticated CRUD privilege.
DO $$
DECLARE table_name text;
BEGIN
 foreach table_name in array array[
   'ai_response_feedback','ai_usage_log','app_settings','benchmark_results',
   'content_overrides','invites','privacy_acknowledgements',
   'survey_participation','survey_responses'
 ] loop
   begin
     execute format('select count(*) from public.%I',table_name);
     raise exception 'Authenticated read granted to private table %',table_name;
   exception when insufficient_privilege then null;
   end;
 end loop;
END $$;

-- Anonymous user is denied even if a UUID claim is provided.
reset role;
set role anon;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
DO $$
BEGIN
 begin
   perform count(*) from public.conversations;
   raise exception 'Anon unexpectedly read conversations';
 exception when insufficient_privilege then null;
 end;
 begin
   insert into public.conversations(id,user_id,title) values
    (303,'11111111-1111-4111-8111-111111111111','Anon forged claim');
   raise exception 'Anon unexpectedly inserted conversation';
 exception when insufficient_privilege then null;
 end;
END $$;

-- Verify unaltered ownership from table owner view, then test own DELETEs.
reset role;
DO $$
DECLARE n int;
BEGIN
 select count(*) into n from public.conversations where
   (id=101 and user_id='11111111-1111-4111-8111-111111111111' and title='A edited own') or
   (id=202 and user_id='22222222-2222-4222-8222-222222222222' and title='B private');
 if n<>2 or (select count(*) from public.conversations)<>2 then
   raise exception 'Ownership or data integrity broken after cross-user attempts';
 end if;
END $$;
set role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
delete from public.conversations where id=101;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',false);
delete from public.conversations where id=202;
reset role;
DO $$ BEGIN
 if exists(select 1 from public.conversations) then
   raise exception 'Owners could not delete their respective rows';
 end if;
END $$;
\echo 'PostgreSQL RLS: actual V20-8 policies, two synthetic identities, own CRUD, cross-user access, ownership forgery, anon, private tables: PASS'
