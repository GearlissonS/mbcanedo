-- Fix RLS policies for tables missing them

-- Update RLS policies for agents table (currently has no policies)
CREATE POLICY "Enable read access for all users" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.agents FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.agents FOR DELETE USING (true);

-- Update RLS policies for vendas table (currently only has SELECT)
CREATE POLICY "Enable insert for authenticated users" ON public.vendas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.vendas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.vendas FOR DELETE USING (true);

-- Update RLS policies for corretores table (currently only has SELECT)
CREATE POLICY "Enable insert for authenticated users" ON public.corretores FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.corretores FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.corretores FOR DELETE USING (true);

-- Update RLS policies for brokers table (currently missing UPDATE and DELETE)
CREATE POLICY "Enable update for authenticated users" ON public.brokers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.brokers FOR DELETE USING (true);