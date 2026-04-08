
CREATE TABLE public.partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  oib TEXT,
  city TEXT NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a partner application"
ON public.partner_applications
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view partner applications"
ON public.partner_applications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete partner applications"
ON public.partner_applications
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
