ALTER TABLE public.renovation_requests ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'novi';
ALTER TABLE public.renovation_requests ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.contractor_applications ADD COLUMN IF NOT EXISTS admin_notes text;
GRANT UPDATE ON public.renovation_requests TO authenticated;
DROP POLICY IF EXISTS "Staff can update renovation requests" ON public.renovation_requests;
CREATE POLICY "Staff can update renovation requests" ON public.renovation_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));