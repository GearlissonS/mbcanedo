-- Enable RLS and basic policies for public.equipes
begin;

create extension if not exists pgcrypto with schema public;

create table if not exists public.equipes (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

alter table public.equipes enable row level security;

-- Minimal policies: open select, require authenticated for insert/delete
create policy if not exists "equipes select" on public.equipes
  for select using (true);

create policy if not exists "equipes insert" on public.equipes
  for insert with check (auth.role() = 'authenticated');

create policy if not exists "equipes delete" on public.equipes
  for delete using (auth.role() = 'authenticated');

commit;
