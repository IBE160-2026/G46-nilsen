-- Samtalestøtte v20.1 – rapportering av KI-svar
create table if not exists public.ai_response_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  category text not null,
  comment text not null,
  surface text not null default 'general',
  conversation_id text,
  topic_id text,
  subtopic text,
  created_at timestamptz not null default now()
);
alter table public.ai_response_feedback enable row level security;
grant select, insert, update, delete on table public.ai_response_feedback to service_role;
