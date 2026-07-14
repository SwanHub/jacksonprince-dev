-- Run in the Supabase SQL editor to set up storage + table for the
-- background-remover widget's user uploads.

create table if not exists public.jdp_ugc_uploads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prompt text not null,
  original_url text not null,
  result_url text not null
);

-- Only the server (service-role key) reads/writes this table; RLS with no
-- policies blocks anon/authenticated access.
alter table public.jdp_ugc_uploads enable row level security;

insert into storage.buckets (id, name, public)
values ('jdp-ugc-uploads', 'jdp-ugc-uploads', true)
on conflict (id) do nothing;
