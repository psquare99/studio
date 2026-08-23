-- P0-10 lockdown for documents and categories.
--
-- WARNING — ORDERING: apply this ONLY after the Studio code that routes all
-- document/category access through authenticated server-side API routes
-- (app/api/documents, app/api/categories) is deployed. Before that deploy,
-- the Workshop browser talks to Supabase directly with the publishable
-- anon key; revoking those grants first would break authoring entirely.
--
-- Verified state as of 2026-08-23 (empirical probes against the live DB):
--   * anon/authenticated currently hold full DML grants on both tables
--     (SELECT/INSERT/UPDATE/DELETE all succeed with the publishable key).
--   * service_role holds NO grants on either table (SELECT fails with 42501),
--     so explicit GRANTs below are required, not optional.
--   * media_assets already has the target posture (RLS on, zero policies,
--     service-role grants) and is untouched here.

begin;

revoke all privileges on public.documents from anon;
revoke all privileges on public.documents from authenticated;

revoke all privileges on public.categories from anon;
revoke all privileges on public.categories from authenticated;

grant select, insert, update, delete on public.documents to service_role;
grant select, insert, update, delete on public.categories to service_role;

alter table public.documents enable row level security;
alter table public.categories enable row level security;

-- Intentionally no policies, mirroring media_assets: the tables are private.
-- Access flows exclusively through the server-side service-role client
-- (see lib/supabase-server.ts), which bypasses RLS. The publishable anon key
-- must never be able to read or write these tables.

commit;
