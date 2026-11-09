-- V20.11.5 – begrens kjøring av RLS event-trigger-funksjon
--
-- Supabase security advisor flagget public.rls_auto_enable() fordi en SECURITY DEFINER-
-- funksjon uten eksplisitte EXECUTE-rettigheter arver EXECUTE til PUBLIC.
--
-- Funksjonen brukes som event-trigger av databasen og skal ikke kunne kalles direkte
-- av anon eller authenticated gjennom Data API/RPC.

revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
