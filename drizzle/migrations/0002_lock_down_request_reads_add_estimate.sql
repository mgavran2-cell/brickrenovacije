ALTER TABLE public.renovation_requests ADD COLUMN IF NOT EXISTS estimated_range text;
DROP POLICY IF EXISTS "Anyone can read renovation requests" ON public.renovation_requests;
DROP POLICY IF EXISTS "Staff can view all requests" ON public.renovation_requests;
CREATE POLICY "Staff can view all requests" ON public.renovation_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'moderator'::app_role));
DROP POLICY IF EXISTS "Anyone can submit a renovation request" ON public.renovation_requests;
DROP POLICY IF EXISTS "Anyone can submit request" ON public.renovation_requests;
CREATE POLICY "Anyone can submit request" ON public.renovation_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
GRANT INSERT ON public.renovation_requests TO anon, authenticated;
GRANT SELECT ON public.renovation_requests TO authenticated;
DROP POLICY IF EXISTS "Admins can update contractor applications" ON public.contractor_applications;
CREATE POLICY "Staff can update contractor applications" ON public.contractor_applications FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'moderator'::app_role))
WITH CHECK (public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'moderator'::app_role));