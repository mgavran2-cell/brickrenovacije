CREATE TABLE public.contractor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  profession text NOT NULL,
  experience text NOT NULL,
  legal_form text NOT NULL,
  location text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  about text,
  status text NOT NULL DEFAULT 'novo'
);
GRANT INSERT ON public.contractor_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contractor_applications TO authenticated;
GRANT ALL ON public.contractor_applications TO service_role;
ALTER TABLE public.contractor_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contractor application" ON public.contractor_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins and moderators can view contractor applications" ON public.contractor_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "Admins can update contractor applications" ON public.contractor_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete contractor applications" ON public.contractor_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));