-- Permissive policy for public.equipes (demo: works on GitHub Pages without auth)
create policy "equipes all" on public.equipes
for all
using (true)
with check (true);
