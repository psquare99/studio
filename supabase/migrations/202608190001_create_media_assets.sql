create table if not exists public.media_assets (
  id uuid primary key,
  storage_key text not null unique,
  public_url text not null,
  filename text not null,
  mime_type text not null,
  size bigint not null check (size > 0),
  alt text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists media_assets_created_at_idx
  on public.media_assets (created_at desc);

alter table public.media_assets enable row level security;

-- Intentionally no policies: the table is private. Studio writes media
-- metadata exclusively through the server-side service-role client
-- (see lib/supabase-server.ts), which bypasses RLS. The publishable
-- anon key must never be able to read or write this table.
