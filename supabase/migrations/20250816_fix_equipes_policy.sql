-- Ensure permissive policy for public.equipes exists (demo mode)
begin;
alter table public.equipes enable row level security;
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='equipes' and polname in ('equipes select','equipes insert','equipes update','equipes delete','Equipes')) then
    execute 'DROP POLICY IF EXISTS "equipes select" ON public.equipes';
    execute 'DROP POLICY IF EXISTS "equipes insert" ON public.equipes';
    execute 'DROP POLICY IF EXISTS "equipes update" ON public.equipes';
    execute 'DROP POLICY IF EXISTS "equipes delete" ON public.equipes';
    execute 'DROP POLICY IF EXISTS "Equipes" ON public.equipes';
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='equipes' and polname='equipes all') then
    execute 'create policy "equipes all" on public.equipes for all using (true) with check (true)';
  end if;
end $$;
commit;
