-- PROPOSAL ONLY; NOT APPLIED TO LIVE SUPABASE.
-- Private atomic benchmark accounting, PostgreSQL 17 / Supabase compatible.
-- RPC functions use SECURITY INVOKER, not SECURITY DEFINER, and are callable
-- exclusively by the backend service_role. Never expose benchmark_private.
-- Running this script in CI uses an EPHEMERAL PostgreSQL instance only.
BEGIN;

CREATE SCHEMA IF NOT EXISTS benchmark_private;
REVOKE ALL ON SCHEMA benchmark_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA benchmark_private TO service_role;

CREATE TABLE IF NOT EXISTS benchmark_private.budget_owners (
  user_id uuid PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS benchmark_private.budget_days (
  user_id uuid NOT NULL REFERENCES benchmark_private.budget_owners(user_id),
  budget_day date NOT NULL,
  charged_cents bigint NOT NULL DEFAULT 0 CHECK (charged_cents >= 0),
  PRIMARY KEY(user_id,budget_day)
);

CREATE TABLE IF NOT EXISTS benchmark_private.budget_runs (
  user_id uuid NOT NULL REFERENCES benchmark_private.budget_owners(user_id),
  run_id uuid NOT NULL,
  budget_day date NOT NULL,
  limit_cents integer NOT NULL CHECK (limit_cents BETWEEN 10 AND 500),
  charged_cents bigint NOT NULL DEFAULT 0 CHECK (charged_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY(user_id,run_id),
  FOREIGN KEY(user_id,budget_day)
    REFERENCES benchmark_private.budget_days(user_id,budget_day)
);

CREATE TABLE IF NOT EXISTS benchmark_private.budget_attempts (
  ticket uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  run_id uuid NOT NULL,
  budget_day date NOT NULL,
  case_id text NOT NULL CHECK (char_length(case_id) BETWEEN 1 AND 80),
  model text NOT NULL CHECK (char_length(model) BETWEEN 1 AND 120),
  status text NOT NULL DEFAULT 'reserved'
    CHECK (status IN ('reserved','success','failed','uncertain')),
  reserved_cents integer NOT NULL DEFAULT 10 CHECK (reserved_cents = 10),
  charged_cents bigint NOT NULL DEFAULT 10 CHECK (charged_cents >= 10),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  settled_at timestamptz,
  UNIQUE (user_id,run_id,case_id,model),
  FOREIGN KEY(user_id,run_id)
    REFERENCES benchmark_private.budget_runs(user_id,run_id)
);

CREATE INDEX IF NOT EXISTS budget_attempts_pending_owner_idx
  ON benchmark_private.budget_attempts(user_id)
  WHERE status = 'reserved';
CREATE INDEX IF NOT EXISTS budget_attempts_run_idx
  ON benchmark_private.budget_attempts(user_id,run_id);

-- Defense in depth. No policy grants for anon or authenticated.
ALTER TABLE benchmark_private.budget_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_private.budget_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_private.budget_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_private.budget_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS benchmark_backend_only ON benchmark_private.budget_owners;
DROP POLICY IF EXISTS benchmark_backend_only ON benchmark_private.budget_days;
DROP POLICY IF EXISTS benchmark_backend_only ON benchmark_private.budget_runs;
DROP POLICY IF EXISTS benchmark_backend_only ON benchmark_private.budget_attempts;
CREATE POLICY benchmark_backend_only ON benchmark_private.budget_owners
  TO service_role USING (true) WITH CHECK (true);
CREATE POLICY benchmark_backend_only ON benchmark_private.budget_days
  TO service_role USING (true) WITH CHECK (true);
CREATE POLICY benchmark_backend_only ON benchmark_private.budget_runs
  TO service_role USING (true) WITH CHECK (true);
CREATE POLICY benchmark_backend_only ON benchmark_private.budget_attempts
  TO service_role USING (true) WITH CHECK (true);

REVOKE ALL ON ALL TABLES IN SCHEMA benchmark_private FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE ON
  benchmark_private.budget_owners,benchmark_private.budget_days,
  benchmark_private.budget_runs,benchmark_private.budget_attempts TO service_role;

CREATE OR REPLACE FUNCTION public.benchmark_budget_reserve(
  p_user_id uuid, p_run_id uuid, p_case_id text,
  p_model text, p_budget_cents integer
) RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY INVOKER
SET search_path = pg_catalog
AS $function$
DECLARE
  v_day date := (statement_timestamp() AT TIME ZONE 'UTC')::date;
  v_existing_day date;
  v_existing_limit integer;
  v_run_total bigint;
  v_day_total bigint;
  v_ticket uuid;
BEGIN
  IF p_user_id IS NULL OR p_run_id IS NULL OR
     p_case_id IS NULL OR char_length(p_case_id) NOT BETWEEN 1 AND 80 OR
     p_model IS NULL OR char_length(p_model) NOT BETWEEN 1 AND 120 OR
     p_budget_cents IS NULL OR p_budget_cents NOT BETWEEN 10 AND 500 THEN
    RETURN jsonb_build_object('ok',false,'error','INVALID_BENCHMARK_BUDGET');
  END IF;

  -- Owner row lock serializes all reserve/settle operations for this user,
  -- across concurrent requests, runs AND PostgREST/Render instances.
  INSERT INTO benchmark_private.budget_owners(user_id)
    VALUES(p_user_id) ON CONFLICT DO NOTHING;
  PERFORM 1 FROM benchmark_private.budget_owners
    WHERE user_id=p_user_id FOR UPDATE;
  INSERT INTO benchmark_private.budget_days(user_id,budget_day)
    VALUES(p_user_id,v_day) ON CONFLICT DO NOTHING;
  INSERT INTO benchmark_private.budget_runs(user_id,run_id,budget_day,limit_cents)
    VALUES(p_user_id,p_run_id,v_day,p_budget_cents) ON CONFLICT DO NOTHING;

  SELECT budget_day,limit_cents,charged_cents
    INTO v_existing_day,v_existing_limit,v_run_total
    FROM benchmark_private.budget_runs
    WHERE user_id=p_user_id AND run_id=p_run_id FOR UPDATE;
  IF v_existing_day <> v_day OR v_existing_limit <> p_budget_cents THEN
    RETURN jsonb_build_object('ok',false,'error','BUDGET_RUN_MISMATCH');
  END IF;

  IF EXISTS (
    SELECT 1 FROM benchmark_private.budget_attempts
    WHERE user_id=p_user_id AND run_id=p_run_id
      AND case_id=p_case_id AND model=p_model
  ) THEN
    RETURN jsonb_build_object('ok',false,'error','BUDGET_DUPLICATE_CASE');
  END IF;
  -- Unsettled calls remain locked after crashes, including across UTC days.
  -- They require explicit service-side reconciliation, NEVER auto-refund/expiry.
  IF EXISTS (
    SELECT 1 FROM benchmark_private.budget_attempts
    WHERE user_id=p_user_id AND status='reserved'
  ) THEN
    RETURN jsonb_build_object('ok',false,'error','BUDGET_RUN_BUSY');
  END IF;

  SELECT charged_cents INTO v_day_total
    FROM benchmark_private.budget_days
    WHERE user_id=p_user_id AND budget_day=v_day FOR UPDATE;
  IF v_run_total + 10 > p_budget_cents OR v_day_total + 10 > 500 THEN
    RETURN jsonb_build_object('ok',false,'error','BUDGET_LIMIT');
  END IF;

  INSERT INTO benchmark_private.budget_attempts(
    user_id,run_id,budget_day,case_id,model
  ) VALUES(p_user_id,p_run_id,v_day,p_case_id,p_model)
  RETURNING ticket INTO v_ticket;
  UPDATE benchmark_private.budget_runs SET charged_cents=charged_cents+10
    WHERE user_id=p_user_id AND run_id=p_run_id;
  UPDATE benchmark_private.budget_days SET charged_cents=charged_cents+10
    WHERE user_id=p_user_id AND budget_day=v_day;
  RETURN jsonb_build_object(
    'ok',true,'ticket',v_ticket,'reserved_cents',10,
    'run_charged_cents',v_run_total+10,'day_charged_cents',v_day_total+10
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.benchmark_budget_settle(
  p_user_id uuid,p_ticket uuid,p_actual_cents bigint DEFAULT NULL,
  p_outcome text DEFAULT 'success'
) RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY INVOKER
SET search_path = pg_catalog
AS $function$
DECLARE
  v_attempt benchmark_private.budget_attempts%ROWTYPE;
  v_charge bigint;
  v_extra bigint;
  v_run_total bigint;
  v_day_total bigint;
  v_limit integer;
BEGIN
  IF p_user_id IS NULL OR p_ticket IS NULL OR
     p_outcome NOT IN ('success','failed','uncertain') OR p_outcome IS NULL OR
     (p_actual_cents IS NOT NULL AND p_actual_cents < 0) THEN
    RETURN jsonb_build_object('ok',false,'error','INVALID_BENCHMARK_SETTLEMENT');
  END IF;
  -- First find the owner without locking; then use SAME lock order as reserve.
  IF NOT EXISTS (
    SELECT 1 FROM benchmark_private.budget_attempts
    WHERE user_id=p_user_id AND ticket=p_ticket
  ) THEN
    RETURN jsonb_build_object('ok',false,'error','UNKNOWN_BENCHMARK_TICKET');
  END IF;
  PERFORM 1 FROM benchmark_private.budget_owners
    WHERE user_id=p_user_id FOR UPDATE;
  SELECT * INTO v_attempt FROM benchmark_private.budget_attempts
    WHERE user_id=p_user_id AND ticket=p_ticket FOR UPDATE;
  IF v_attempt.status <> 'reserved' THEN
    RETURN jsonb_build_object(
      'ok',true,'already_settled',true,'status',v_attempt.status,
      'charged_cents',v_attempt.charged_cents
    );
  END IF;

  -- Fail-closed: even a failed/unknown provider call consumes at least 10c.
  -- Extra estimated usage may OVERSHOOT reserve; it never silently refunds.
  v_charge := GREATEST(10,COALESCE(p_actual_cents,10));
  v_extra := v_charge - 10;
  UPDATE benchmark_private.budget_attempts
    SET status=p_outcome,charged_cents=v_charge,settled_at=clock_timestamp()
    WHERE ticket=p_ticket;
  UPDATE benchmark_private.budget_runs
    SET charged_cents=charged_cents+v_extra
    WHERE user_id=p_user_id AND run_id=v_attempt.run_id
    RETURNING charged_cents,limit_cents INTO v_run_total,v_limit;
  UPDATE benchmark_private.budget_days
    SET charged_cents=charged_cents+v_extra
    WHERE user_id=p_user_id AND budget_day=v_attempt.budget_day
    RETURNING charged_cents INTO v_day_total;
  RETURN jsonb_build_object(
    'ok',true,'already_settled',false,'status',p_outcome,
    'charged_cents',v_charge,'run_charged_cents',v_run_total,
    'day_charged_cents',v_day_total,
    'over_budget',v_run_total>v_limit OR v_day_total>500
  );
END;
$function$;

-- Function exposure is opt-in. Postgres grants EXECUTE to PUBLIC by default;
-- always explicitly REVOKE that inherited grant plus direct role grants.
REVOKE ALL ON FUNCTION public.benchmark_budget_reserve(uuid,uuid,text,text,integer)
  FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.benchmark_budget_settle(uuid,uuid,bigint,text)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.benchmark_budget_reserve(uuid,uuid,text,text,integer)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.benchmark_budget_settle(uuid,uuid,bigint,text)
  TO service_role;
COMMIT;
