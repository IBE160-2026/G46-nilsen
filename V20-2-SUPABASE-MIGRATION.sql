-- Samtalestøtte v20.2 – modellvalg, KI-kostnad, kildebruk og valgfritt samtalevedlegg

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.app_settings enable row level security;
grant select, insert, update, delete on table public.app_settings to service_role;

create table if not exists public.ai_usage_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  function_name text not null default 'unknown',
  model text not null,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  total_tokens bigint not null default 0,
  estimated_cost_usd numeric(12,6) not null default 0,
  web_search_used boolean not null default false,
  web_search_queries jsonb not null default '[]'::jsonb,
  source_domains jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.ai_usage_log enable row level security;
grant select, insert, update, delete on table public.ai_usage_log to service_role;
create index if not exists ai_usage_log_created_at_idx on public.ai_usage_log(created_at desc);
create index if not exists ai_usage_log_function_idx on public.ai_usage_log(function_name);

alter table public.ai_response_feedback add column if not exists include_conversation boolean not null default false;
alter table public.ai_response_feedback add column if not exists conversation_snapshot jsonb;
