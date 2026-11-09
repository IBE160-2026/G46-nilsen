-- V20.11.5 – RLS- og indeksoptimalisering etter Supabase advisor
--
-- 1) Unngå rad-for-rad evaluering av auth.uid() ved å bruke SELECT-wrapper.
-- 2) Begrens policies eksplisitt til authenticated.
-- 3) Legg støtteindekser på foreign-key-kolonner som Supabase advisor flagget.

drop policy if exists "Users can view own conversations" on public.conversations;
drop policy if exists "Users can insert own conversations" on public.conversations;
drop policy if exists "Users can update own conversations" on public.conversations;
drop policy if exists "Users can delete own conversations" on public.conversations;

create policy "Users can view own conversations"
on public.conversations for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own conversations"
on public.conversations for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own conversations"
on public.conversations for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own conversations"
on public.conversations for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists ai_response_feedback_user_id_idx on public.ai_response_feedback(user_id);
create index if not exists ai_usage_log_user_id_idx on public.ai_usage_log(user_id);
create index if not exists app_settings_updated_by_idx on public.app_settings(updated_by);
create index if not exists benchmark_results_created_by_idx on public.benchmark_results(created_by);
create index if not exists content_overrides_updated_by_idx on public.content_overrides(updated_by);
create index if not exists invites_user_id_idx on public.invites(user_id);
