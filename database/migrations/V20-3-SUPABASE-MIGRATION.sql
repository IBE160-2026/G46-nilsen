-- Samtalestøtte v20.3: automatisk testbank og modellbenchmark
-- Kjør etter V20-2-SUPABASE-MIGRATION.sql.

alter table public.ai_usage_log
  add column if not exists web_search_call_count integer not null default 0,
  add column if not exists is_test boolean not null default false,
  add column if not exists benchmark_run_id text,
  add column if not exists benchmark_case_id text;

create index if not exists ai_usage_log_is_test_created_idx
  on public.ai_usage_log (is_test, created_at desc);

create index if not exists ai_usage_log_benchmark_run_idx
  on public.ai_usage_log (benchmark_run_id)
  where benchmark_run_id is not null;

create table if not exists public.benchmark_results (
  id uuid primary key default gen_random_uuid(),
  run_id text not null,
  case_id text not null,
  topic_id text not null,
  topic text not null,
  subtopic text not null,
  variant text not null,
  model text not null,
  response_text text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  estimated_cost_usd numeric(12,6) not null default 0,
  web_search_count integer not null default 0,
  web_search_queries jsonb not null default '[]'::jsonb,
  source_domains jsonb not null default '[]'::jsonb,
  latency_ms integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists benchmark_results_run_idx
  on public.benchmark_results (run_id, created_at);
create index if not exists benchmark_results_case_idx
  on public.benchmark_results (case_id, created_at desc);
create index if not exists benchmark_results_model_idx
  on public.benchmark_results (model, created_at desc);

alter table public.benchmark_results enable row level security;

-- Tabellen leses/skrive kun fra serveren med service-role. Ingen direkte klienttilgang.
revoke all on table public.benchmark_results from anon, authenticated;
