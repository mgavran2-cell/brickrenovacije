CREATE TABLE public.project_photos(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,phase_id uuid REFERENCES public.project_phases(id) ON DELETE SET NULL,storage_path text UNIQUE NOT NULL,file_name text NOT NULL,file_size_bytes integer,mime_type text,title text,description text,week_number integer,taken_at timestamptz DEFAULT now(),uploaded_by uuid,created_at timestamptz DEFAULT now(),photo_type text NOT NULL DEFAULT 'gallery');
GRANT SELECT,INSERT,UPDATE,DELETE ON public.project_photos TO authenticated;
GRANT ALL ON public.project_photos TO service_role;
ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_photos_project ON public.project_photos(project_id);
CREATE INDEX idx_photos_phase ON public.project_photos(phase_id);
CREATE INDEX idx_photos_week ON public.project_photos(project_id,week_number);
CREATE POLICY "Staff reads photos" ON public.project_photos FOR SELECT TO authenticated USING(public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "Staff inserts photos" ON public.project_photos FOR INSERT TO authenticated WITH CHECK((public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator')) AND uploaded_by=auth.uid());
CREATE POLICY "Admins update photos" ON public.project_photos FOR UPDATE TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete photos" ON public.project_photos FOR DELETE TO authenticated USING(public.has_role(auth.uid(),'admin'));
CREATE POLICY "Clients read assigned final photos" ON public.project_photos FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.projects p WHERE p.id=project_photos.project_id AND p.client_id=auth.uid() AND NOT p.is_draft));
CREATE TABLE public.project_share_links(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16),'hex'),expires_at timestamptz,created_by uuid,created_at timestamptz DEFAULT now());
GRANT SELECT,INSERT,UPDATE,DELETE ON public.project_share_links TO authenticated;
GRANT ALL ON public.project_share_links TO service_role;
ALTER TABLE public.project_share_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage share links" ON public.project_share_links FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin') AND created_by=auth.uid());
CREATE POLICY "Staff uploads project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='project-photos' AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator')) AND EXISTS(SELECT 1 FROM public.projects p WHERE p.id::text=(storage.foldername(name))[1]) AND lower(storage.extension(name)) IN ('jpg','jpeg','png','webp','gif','avif','heic','heif'));
CREATE POLICY "Scoped project image reads" ON storage.objects FOR SELECT TO authenticated USING(bucket_id='project-photos' AND ((public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator')) OR EXISTS(SELECT 1 FROM public.project_photos ph JOIN public.projects p ON p.id=ph.project_id WHERE ph.storage_path=name AND p.client_id=auth.uid() AND NOT p.is_draft)));
CREATE POLICY "Admin deletes or staff cleans orphan upload" ON storage.objects FOR DELETE TO authenticated USING(bucket_id='project-photos' AND (public.has_role(auth.uid(),'admin') OR (public.has_role(auth.uid(),'moderator') AND owner_id=auth.uid()::text AND NOT EXISTS(SELECT 1 FROM public.project_photos ph WHERE ph.storage_path=name))));
CREATE OR REPLACE FUNCTION public.validate_project_photo() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
IF NEW.storage_path NOT LIKE (NEW.project_id::text || '/%') THEN RAISE EXCEPTION 'Invalid project path'; END IF;
IF NEW.phase_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.project_phases WHERE id=NEW.phase_id AND project_id=NEW.project_id) THEN RAISE EXCEPTION 'Invalid phase'; END IF;
IF NEW.mime_type IS NULL OR NEW.mime_type NOT LIKE 'image/%' OR NEW.file_size_bytes IS NULL OR NEW.file_size_bytes > (CASE WHEN NEW.photo_type='hero' THEN 10485760 ELSE 20971520 END) OR NEW.file_size_bytes <= 0 THEN RAISE EXCEPTION 'Invalid image'; END IF;
RETURN NEW; END; $$;
CREATE TRIGGER validate_project_photo BEFORE INSERT OR UPDATE ON public.project_photos FOR EACH ROW EXECUTE FUNCTION public.validate_project_photo();
CREATE OR REPLACE FUNCTION public.log_project_photo_action() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
IF TG_OP='INSERT' THEN
INSERT INTO public.project_activity_log(project_id,actor_id,action,entity_type,entity_id,metadata) VALUES(NEW.project_id,auth.uid(),CASE WHEN NEW.photo_type='hero' THEN 'hero_image_set' ELSE 'photos_uploaded' END,'photo',NEW.id,jsonb_build_object('count',1,'name',COALESCE(NEW.title,NEW.file_name),'phase',COALESCE((SELECT name FROM public.project_phases WHERE id=NEW.phase_id),'Nepovezane')));
RETURN NEW;
ELSE
UPDATE public.projects SET hero_image_url=NULL WHERE id=OLD.project_id AND hero_image_url=OLD.storage_path;
INSERT INTO public.project_activity_log(project_id,actor_id,action,entity_type,entity_id,metadata) SELECT OLD.project_id,auth.uid(),'photo_deleted','photo',OLD.id,jsonb_build_object('name',COALESCE(OLD.title,OLD.file_name)) WHERE EXISTS(SELECT 1 FROM public.projects WHERE id=OLD.project_id);
RETURN OLD;
END IF; END; $$;
CREATE TRIGGER log_photo_action AFTER INSERT OR DELETE ON public.project_photos FOR EACH ROW EXECUTE FUNCTION public.log_project_photo_action();
CREATE OR REPLACE FUNCTION public.log_project_share_action() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN INSERT INTO public.project_activity_log(project_id,actor_id,action) VALUES(NEW.project_id,auth.uid(),'share_link_created'); RETURN NEW; END; $$;
CREATE TRIGGER log_share_action AFTER INSERT ON public.project_share_links FOR EACH ROW EXECUTE FUNCTION public.log_project_share_action();
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_photos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;