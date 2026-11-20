#!/usr/bin/env bash
# Run only in CI on its disposable PostgreSQL service container.
set -euo pipefail
container="$1"
if [[ -z "$container" ]]; then echo "Missing disposable postgres container id"; exit 2; fi
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

(
  docker exec -i "$container" psql -X -v ON_ERROR_STOP=1 -U postgres -d test_rls <<'SQL'
SET ROLE service_role;
BEGIN;
SELECT public.benchmark_budget_reserve(
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  'eeeeeeee-1111-4111-8111-111111111111',
  'RACE-A','fake-model',30)::text AS reservation;
SELECT pg_sleep(2);
COMMIT;
SQL
) > "$tmp/first" 2>&1 &
first=$!

# Second invocation uses a separate physical PostgreSQL connection/process.
# The owner-row lock serializes calls across app instances.
sleep 0.3
docker exec -i "$container" psql -X -v ON_ERROR_STOP=1 -U postgres -d test_rls > "$tmp/second" 2>&1 <<'SQL'
SET ROLE service_role;
SELECT public.benchmark_budget_reserve(
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  'eeeeeeee-2222-4222-8222-222222222222',
  'RACE-B','fake-model',30)::text AS reservation;
SQL
wait "$first"

if ! grep -Eq '"ok": true' "$tmp/first"; then
  echo "First PostgreSQL backend did not successfully reserve"; cat "$tmp/first"; exit 1
fi
if ! grep -Eq '"error": "BUDGET_RUN_BUSY"' "$tmp/second"; then
  echo "Second PostgreSQL backend did not observe durable in-flight lock"; cat "$tmp/second"; exit 1
fi
docker exec -i "$container" psql -X -v ON_ERROR_STOP=1 -U postgres -d test_rls <<'SQL'
DO $check$
BEGIN
  IF (SELECT count(*) FROM benchmark_private.budget_attempts
      WHERE user_id='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee') <> 1 THEN
    RAISE EXCEPTION 'Two concurrent sessions both reserved budget';
  END IF;
  IF (SELECT charged_cents FROM benchmark_private.budget_days
      WHERE user_id='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee') <> 10 THEN
    RAISE EXCEPTION 'Atomic charge double-counted or lost';
  END IF;
END
$check$;
SQL
echo "Two independent PostgreSQL sessions: one reserve, one BUSY, exactly 10c charged: PASS"
