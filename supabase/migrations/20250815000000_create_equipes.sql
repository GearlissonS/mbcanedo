-- Migration: Create equipes table
-- Safe for Supabase (uses gen_random_uuid from pgcrypto)

begin;

create extension if not exists pgcrypto with schema public;

create table if not exists public.equipes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

commit;
