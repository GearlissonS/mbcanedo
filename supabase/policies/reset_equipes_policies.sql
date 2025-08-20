-- Remove common conflicting policies so we can reapply the correct one
DROP POLICY IF EXISTS "equipes select" ON public.equipes;
DROP POLICY IF EXISTS "equipes insert" ON public.equipes;
DROP POLICY IF EXISTS "equipes update" ON public.equipes;
DROP POLICY IF EXISTS "equipes delete" ON public.equipes;
DROP POLICY IF EXISTS "equipes all" ON public.equipes;
DROP POLICY IF EXISTS "Equipes" ON public.equipes; -- policy created via Studio UI
