
-- Create renovation_requests table
CREATE TABLE public.renovation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  property_type TEXT NOT NULL,
  location TEXT NOT NULL,
  sqm INTEGER,
  scope TEXT NOT NULL,
  condition TEXT NOT NULL,
  material TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT DEFAULT ''
);

-- Enable RLS
ALTER TABLE public.renovation_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit a renovation request"
ON public.renovation_requests
FOR INSERT
WITH CHECK (true);

-- Allow reading for admin purposes (restrict later if needed)
CREATE POLICY "Anyone can read renovation requests"
ON public.renovation_requests
FOR SELECT
USING (true);
