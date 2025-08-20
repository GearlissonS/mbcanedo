-- Full schema for My Broker app (demo-friendly RLS)
-- Creates required tables, optional tables, and permissive RLS for GitHub Pages (no auth)

begin;

create extension if not exists pgcrypto with schema public;

-- Required tables
create table if not exists public.equipes (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  meta_equipe numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  meta numeric not null default 0,
  realizado numeric not null default 0,
  equipe text,
  created_at timestamptz not null default now()
);

-- Optional tables (enable if you want to persist these features)
create table if not exists public.corretores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  equipe text,
  realizado numeric not null default 0,
  meta_individual numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.brokers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nickname text not null,
  creci text not null,
  team text,
  vgv numeric default 0,
  tempoMedio numeric default 0,
  avatarDataUrl text,
  created_at timestamptz not null default now()
);

create table if not exists public.vendas (
  id uuid primary key default gen_random_uuid(),
  brokerId uuid,
  value numeric not null,
  soldAt timestamptz not null,
  listedAt timestamptz,
  created_at timestamptz not null default now()
);

-- RLS enable
alter table public.equipes enable row level security;
alter table public.agents enable row level security;
alter table public.corretores enable row level security;
alter table public.brokers enable row level security;
alter table public.vendas enable row level security;

-- Demo-friendly policies (anon allowed). If using auth, replace with authenticated-only policies.
do $$
begin
  if not exists (select 1 from pg_policies where polname = 'equipes all') then
    create policy "equipes all" on public.equipes for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'agents all') then
    create policy "agents all" on public.agents for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'corretores all') then
    create policy "corretores all" on public.corretores for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'brokers all') then
    create policy "brokers all" on public.brokers for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'vendas all') then
    create policy "vendas all" on public.vendas for all using (true) with check (true);
  end if;
end $$;

-- Helpful indexes
create index if not exists idx_equipes_nome on public.equipes (nome);
create index if not exists idx_agents_nome on public.agents (nome);
create index if not exists idx_corretores_nome on public.corretores (nome);

commit;
