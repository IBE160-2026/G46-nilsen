-- Second independent psql process, ideally after docker restart.
-- This proves a crashed provider request is not silently released by a Node restart.
\set ON_ERROR_STOP on
SET ROLE service_role;

DO $verify$
DECLARE
  user_c uuid := 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
  run_c uuid := 'cccccccc-1111-4111-8111-111111111111';
  r jsonb;
  saved_ticket uuid;
BEGIN
  r := public.benchmark_budget_reserve(user_c,run_c,'CRASH-02','fake-model',20);
  IF r->>'error' <> 'BUDGET_RUN_BUSY' THEN
    RAISE EXCEPTION 'Pending reservation was forgotten across sessions/restart: %',r;
  END IF;
  SELECT ticket INTO saved_ticket FROM benchmark_private.budget_attempts
    WHERE user_id=user_c AND status='reserved';
  IF saved_ticket IS NULL THEN RAISE EXCEPTION 'No durable pending ticket'; END IF;

  -- An explicit service-side operator reconciliation is required after
  -- reviewing provider logs; unknown cost still burns the full 10c reserve.
  r := public.benchmark_budget_settle(user_c,saved_ticket,NULL,'uncertain');
  IF (r->>'ok')::boolean IS DISTINCT FROM true OR
     r->>'status' <> 'uncertain' OR
     (r->>'charged_cents')::integer <> 10 THEN
    RAISE EXCEPTION 'Crash reconciliation failed: %',r;
  END IF;
  r := public.benchmark_budget_reserve(user_c,run_c,'CRASH-01','fake-model',20);
  IF r->>'error' <> 'BUDGET_DUPLICATE_CASE' THEN
    RAISE EXCEPTION 'Existing case replay after crash was not blocked: %',r;
  END IF;
  r := public.benchmark_budget_reserve(user_c,run_c,'CRASH-02','fake-model',20);
  IF (r->>'ok')::boolean IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'New request should resume after reconciliation: %',r;
  END IF;
  saved_ticket := (r->>'ticket')::uuid;
  r := public.benchmark_budget_settle(user_c,saved_ticket,NULL,'success');
  IF (r->>'run_charged_cents')::integer <> 20 THEN
    RAISE EXCEPTION 'Both attempts not permanently counted: %',r;
  END IF;
  r := public.benchmark_budget_reserve(user_c,run_c,'CRASH-03','fake-model',20);
  IF r->>'error' <> 'BUDGET_LIMIT' THEN RAISE EXCEPTION 'Crash run budget bypass: %',r; END IF;
END
$verify$;

DO $limit$
DECLARE
  u uuid := 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
  run_id uuid := 'dddddddd-1111-4111-8111-111111111111';
  r jsonb;
  i integer;
BEGIN
  FOR i IN 1..50 LOOP
    r := public.benchmark_budget_reserve(u,run_id,'DAILY-'||i,'fake-model',500);
    IF (r->>'ok')::boolean IS DISTINCT FROM true THEN
      RAISE EXCEPTION 'Daily reservation % failed: %',i,r;
    END IF;
    r := public.benchmark_budget_settle(u,(r->>'ticket')::uuid,NULL,'success');
    IF (r->>'ok')::boolean IS DISTINCT FROM true THEN
      RAISE EXCEPTION 'Daily settlement % failed: %',i,r;
    END IF;
  END LOOP;
  r := public.benchmark_budget_reserve(u,run_id,'DAILY-51','fake-model',500);
  IF r->>'error' <> 'BUDGET_LIMIT' THEN RAISE EXCEPTION '500 cent run cap failed: %',r; END IF;
  r := public.benchmark_budget_reserve(
    u,'dddddddd-2222-4222-8222-222222222222'::uuid,'FRESH-RUN','fake-model',500);
  IF r->>'error' <> 'BUDGET_LIMIT' THEN
    RAISE EXCEPTION 'New run ID reset durable daily limit: %',r;
  END IF;
END
$limit$;
RESET ROLE;

DO $verify$
BEGIN
  IF (SELECT charged_cents FROM benchmark_private.budget_days
      WHERE user_id='cccccccc-cccc-4ccc-8ccc-cccccccccccc') <>20 THEN
      RAISE EXCEPTION 'Crash charges did not persist'; END IF;
  IF (SELECT charged_cents FROM benchmark_private.budget_days
      WHERE user_id='dddddddd-dddd-4ddd-8ddd-dddddddddddd') <>500 THEN
      RAISE EXCEPTION 'Daily spending cap not durable'; END IF;
END
$verify$;
\echo 'PostgreSQL budget: new session, pending fail-closed, explicit recovery, no double charge, run and daily caps: PASS'
