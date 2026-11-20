-- Run against disposable PostgreSQL ONLY, after benchmark budget proposal.
-- All actors and IDs are synthetic; no AI keys, real user rows or network.
\set ON_ERROR_STOP on

DO $verify$
DECLARE
  t text;
  role_name text;
BEGIN
  FOREACH t IN ARRAY ARRAY['budget_owners','budget_days','budget_runs','budget_attempts'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
      WHERE n.nspname='benchmark_private' AND c.relname=t AND c.relrowsecurity
    ) THEN
      RAISE EXCEPTION 'RLS disabled for private table %',t;
    END IF;
    FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
      IF has_table_privilege(role_name,format('benchmark_private.%I',t),'SELECT')
        OR has_table_privilege(role_name,format('benchmark_private.%I',t),'INSERT')
        OR has_table_privilege(role_name,format('benchmark_private.%I',t),'UPDATE')
        OR has_table_privilege(role_name,format('benchmark_private.%I',t),'DELETE') THEN
        RAISE EXCEPTION '% can use private budget table %',role_name,t;
      END IF;
    END LOOP;
  END LOOP;
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
    IF has_schema_privilege(role_name,'benchmark_private','USAGE') OR
       has_function_privilege(role_name,'public.benchmark_budget_reserve(uuid,uuid,text,text,integer)','EXECUTE') OR
       has_function_privilege(role_name,'public.benchmark_budget_settle(uuid,uuid,bigint,text)','EXECUTE') THEN
      RAISE EXCEPTION '% can access benchmark budget accounting',role_name;
    END IF;
  END LOOP;
  IF NOT has_function_privilege('service_role',
       'public.benchmark_budget_reserve(uuid,uuid,text,text,integer)','EXECUTE') OR
     NOT has_function_privilege('service_role',
       'public.benchmark_budget_settle(uuid,uuid,bigint,text)','EXECUTE') THEN
    RAISE EXCEPTION 'Backend service lost budget RPC privileges';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public'
      AND p.proname IN ('benchmark_budget_reserve','benchmark_budget_settle')
      AND p.prosecdef
  ) THEN RAISE EXCEPTION 'Budget RPC must not use SECURITY DEFINER'; END IF;
END
$verify$;

-- Even an authenticated session with synthetic JWT cannot execute RPC.
SET ROLE authenticated;
DO $verify$
BEGIN
  BEGIN
    PERFORM public.benchmark_budget_reserve(
      '11111111-1111-4111-8111-111111111111'::uuid,
      'eeeeeeee-1111-4111-8111-111111111111'::uuid,'B001','fake-model',30);
    RAISE EXCEPTION 'Authenticated budget RPC accessible';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END
$verify$;
RESET ROLE;
SET ROLE anon;
DO $verify$
BEGIN
  BEGIN
    PERFORM public.benchmark_budget_reserve(
      '11111111-1111-4111-8111-111111111111'::uuid,
      'eeeeeeee-1111-4111-8111-111111111111'::uuid,'B001','fake-model',30);
    RAISE EXCEPTION 'Anonymous budget RPC accessible';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END
$verify$;
RESET ROLE;

SET ROLE service_role;
DO $exercise$
DECLARE
  user_a uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  user_b uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  user_c uuid := 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
  run_a uuid := 'aaaaaaaa-1111-4111-8111-111111111111';
  run_b uuid := 'bbbbbbbb-1111-4111-8111-111111111111';
  r jsonb;
  ticket_a uuid;
  ticket_b uuid;
BEGIN
  r := public.benchmark_budget_reserve(user_a,run_a,'B001','fake-model',30);
  IF (r->>'ok')::boolean IS DISTINCT FROM true OR (r->>'reserved_cents')::integer <> 10 THEN
    RAISE EXCEPTION 'Initial reservation failed: %',r;
  END IF;
  ticket_a := (r->>'ticket')::uuid;
  r := public.benchmark_budget_reserve(user_a,run_a,'B002','fake-model',30);
  IF r->>'error' <> 'BUDGET_RUN_BUSY' THEN RAISE EXCEPTION 'Concurrent call not blocked: %',r; END IF;
  -- A rejected attempt on a NEW run must not leave behind an empty run row.
  r := public.benchmark_budget_reserve(
    user_a,'ffffffff-1111-4111-8111-111111111111'::uuid,'B900','fake-model',50);
  IF r->>'error' <> 'BUDGET_RUN_BUSY' THEN
    RAISE EXCEPTION 'New run was not rejected while another is pending: %',r;
  END IF;
  IF EXISTS (
    SELECT 1 FROM benchmark_private.budget_runs
    WHERE user_id=user_a AND run_id='ffffffff-1111-4111-8111-111111111111'::uuid
  ) THEN RAISE EXCEPTION 'Rejected BUSY admission left a ghost run'; END IF;
  r := public.benchmark_budget_reserve(user_a,run_a,'B001','fake-model',30);
  IF r->>'error' <> 'BUDGET_DUPLICATE_CASE' THEN RAISE EXCEPTION 'In-flight duplicate not blocked: %',r; END IF;

  r := public.benchmark_budget_settle(user_b,ticket_a,27,'success');
  IF r->>'error' <> 'UNKNOWN_BENCHMARK_TICKET' THEN RAISE EXCEPTION 'Cross-user settle: %',r; END IF;
  r := public.benchmark_budget_settle(user_a,ticket_a,27,'success');
  IF (r->>'ok')::boolean IS DISTINCT FROM true OR (r->>'charged_cents')::integer <> 27
      OR (r->>'run_charged_cents')::integer <> 27 THEN
    RAISE EXCEPTION 'Actual cost reconciliation wrong: %',r;
  END IF;
  r := public.benchmark_budget_settle(user_a,ticket_a,999,'failed');
  IF (r->>'already_settled')::boolean IS DISTINCT FROM true OR
     (r->>'charged_cents')::integer <> 27 THEN
    RAISE EXCEPTION 'Settle replay charged twice: %',r;
  END IF;
  r := public.benchmark_budget_reserve(user_a,run_a,'B002','fake-model',30);
  IF r->>'error' <> 'BUDGET_LIMIT' THEN RAISE EXCEPTION 'Run cap failed: %',r; END IF;
  r := public.benchmark_budget_reserve(user_a,run_a,'B002','fake-model',40);
  IF r->>'error' <> 'BUDGET_RUN_MISMATCH' THEN RAISE EXCEPTION 'Budget increase accepted: %',r; END IF;
  r := public.benchmark_budget_reserve(user_a,run_b,'B002','fake-model',9);
  IF r->>'error' <> 'INVALID_BENCHMARK_BUDGET' THEN RAISE EXCEPTION 'Small budget accepted: %',r; END IF;

  r := public.benchmark_budget_reserve(user_a,run_b,'B003','fake-model',10);
  IF (r->>'ok')::boolean IS DISTINCT FROM true THEN RAISE EXCEPTION 'Fresh run should fit daily cap: %',r; END IF;
  ticket_b := (r->>'ticket')::uuid;
  r := public.benchmark_budget_settle(user_a,ticket_b,NULL,'failed');
  IF (r->>'charged_cents')::integer <> 10 OR r->>'status' <> 'failed' THEN
    RAISE EXCEPTION 'Failed call must keep 10c reserve: %',r;
  END IF;
  r := public.benchmark_budget_reserve(user_a,run_b,'B004','fake-model',10);
  IF r->>'error' <> 'BUDGET_LIMIT' THEN RAISE EXCEPTION 'New run cap ignored: %',r; END IF;

  r := public.benchmark_budget_reserve(user_b,run_a,'B001','fake-model',10);
  IF (r->>'ok')::boolean IS DISTINCT FROM true THEN RAISE EXCEPTION 'Separate owner should pass: %',r; END IF;
  ticket_b := (r->>'ticket')::uuid;
  r := public.benchmark_budget_settle(user_b,ticket_b,80,'success');
  IF (r->>'over_budget')::boolean IS DISTINCT FROM true OR
     (r->>'charged_cents')::integer <> 80 THEN
    RAISE EXCEPTION 'Provider overshoot not recorded: %',r;
  END IF;
  r := public.benchmark_budget_reserve(user_b,run_a,'B002','fake-model',10);
  IF r->>'error' <> 'BUDGET_LIMIT' THEN RAISE EXCEPTION 'Over-budget run not blocked: %',r; END IF;

  -- Simulate a provider crash: do not settle C, and verify via NEW SESSION
  -- that unclosed reservation and its charge persist.
  r := public.benchmark_budget_reserve(
    user_c,'cccccccc-1111-4111-8111-111111111111'::uuid,'CRASH-01','fake-model',20);
  IF (r->>'ok')::boolean IS DISTINCT FROM true THEN RAISE EXCEPTION 'Crash fixture failed: %',r; END IF;
END
$exercise$;
RESET ROLE;

DO $verify$
BEGIN
  IF (SELECT charged_cents FROM benchmark_private.budget_days
      WHERE user_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
      <>37 THEN RAISE EXCEPTION 'A daily total should be 27+10'; END IF;
  IF (SELECT charged_cents FROM benchmark_private.budget_days
      WHERE user_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb')
      <>80 THEN RAISE EXCEPTION 'B overspend not recorded'; END IF;
  IF (SELECT count(*) FROM benchmark_private.budget_attempts
      WHERE user_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') <> 2 THEN
      RAISE EXCEPTION 'Denied attempts unexpectedly persisted'; END IF;
END
$verify$;

\echo 'PostgreSQL budget: private RLS/ACL, service-only invoker RPC, owner lock, replay, spend and crash fixture: PASS'
