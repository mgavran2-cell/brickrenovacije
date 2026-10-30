CREATE TABLE public.project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_id uuid REFERENCES public.project_phases(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planirano' CHECK (status IN ('planirano', 'u_tijeku', 'blokirano', 'zavrseno')),
  progress_percent integer DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  assigned_to_user_id uuid,
  assigned_to_text text,
  start_date date,
  due_date date,
  completed_at timestamp with time zone,
  priority text DEFAULT 'srednji' CHECK (priority IN ('nizak', 'srednji', 'visok')),
  requires_client_presence boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_tasks_project ON public.project_tasks(project_id);
CREATE INDEX idx_tasks_phase ON public.project_tasks(phase_id);
CREATE INDEX idx_tasks_due_date ON public.project_tasks(due_date);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_tasks TO authenticated;
GRANT ALL ON public.project_tasks TO service_role;

ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage all tasks"
ON public.project_tasks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Clients can view tasks of own projects"
ON public.project_tasks FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_tasks.project_id AND p.client_id = auth.uid() AND NOT p.is_draft
  )
);

CREATE TRIGGER tasks_set_updated_at
BEFORE UPDATE ON public.project_tasks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.set_task_completed_at()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'zavrseno' AND OLD.status != 'zavrseno' THEN
    NEW.completed_at = now();
    NEW.progress_percent = 100;
  ELSIF NEW.status != 'zavrseno' AND OLD.status = 'zavrseno' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_set_completed_at
BEFORE UPDATE ON public.project_tasks
FOR EACH ROW EXECUTE FUNCTION public.set_task_completed_at();

CREATE OR REPLACE FUNCTION public.recalc_project_progress(_project_id uuid)
RETURNS void AS $$
DECLARE
  total_tasks integer;
  avg_progress numeric;
BEGIN
  SELECT COUNT(*), COALESCE(AVG(progress_percent), 0)
  INTO total_tasks, avg_progress
  FROM public.project_tasks
  WHERE project_id = _project_id;

  IF total_tasks > 0 THEN
    UPDATE public.projects
    SET progress_percent = ROUND(avg_progress)
    WHERE id = _project_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.task_progress_trigger()
RETURNS trigger AS $$
BEGIN
  PERFORM public.recalc_project_progress(COALESCE(NEW.project_id, OLD.project_id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER tasks_recalc_project_progress
AFTER INSERT OR UPDATE OF progress_percent, status OR DELETE
ON public.project_tasks
FOR EACH ROW EXECUTE FUNCTION public.task_progress_trigger();

CREATE OR REPLACE FUNCTION public.auto_complete_phase()
RETURNS trigger AS $$
DECLARE
  pending_count integer;
BEGIN
  IF NEW.phase_id IS NULL THEN RETURN NEW; END IF;

  SELECT COUNT(*) INTO pending_count
  FROM public.project_tasks
  WHERE phase_id = NEW.phase_id AND status != 'zavrseno';

  IF pending_count = 0 THEN
    UPDATE public.project_phases
    SET status = 'zavrseno', completed_at = now()
    WHERE id = NEW.phase_id AND status != 'zavrseno';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER tasks_auto_complete_phase
AFTER UPDATE OF status ON public.project_tasks
FOR EACH ROW
WHEN (NEW.status = 'zavrseno')
EXECUTE FUNCTION public.auto_complete_phase();