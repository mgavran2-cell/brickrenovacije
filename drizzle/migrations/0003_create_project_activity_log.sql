CREATE TABLE public.project_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  actor_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

GRANT SELECT, INSERT ON public.project_activity_log TO authenticated;
GRANT ALL ON public.project_activity_log TO service_role;

ALTER TABLE public.project_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all activity"
ON public.project_activity_log FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Staff can insert activity"
ON public.project_activity_log FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'moderator'::app_role));