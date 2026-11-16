CREATE TABLE public.project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  document_number text NOT NULL,
  title text NOT NULL,
  document_type text NOT NULL DEFAULT 'ponuda' CHECK (document_type IN ('ponuda','aneks','suglasnost','ugovor','racun','ostalo')),
  description text,
  total_amount numeric(10,2) CHECK (total_amount IS NULL OR total_amount >= 0),
  currency text DEFAULT 'EUR',
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_size_bytes integer,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','poslano','pregledano','potpisano','odbijeno','otkazano')),
  valid_until date,
  due_date date,
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  signed_by_user_id uuid,
  signed_by_name text,
  signed_ip text,
  signature_data text,
  client_comment text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_documents_project ON public.project_documents(project_id);
CREATE INDEX idx_documents_status ON public.project_documents(status);
CREATE UNIQUE INDEX idx_documents_number ON public.project_documents(document_number);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_documents TO authenticated;
GRANT ALL ON public.project_documents TO service_role;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage documents" ON public.project_documents FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));

CREATE POLICY "Clients view sent own documents" ON public.project_documents FOR SELECT TO authenticated
USING (status <> 'draft' AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_documents.project_id AND p.client_id = auth.uid() AND NOT p.is_draft));

CREATE TRIGGER documents_set_updated_at BEFORE UPDATE ON public.project_documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.validate_project_document()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.storage_path NOT LIKE (NEW.project_id::text || '/%') THEN RAISE EXCEPTION 'Invalid document path'; END IF;
  IF NEW.file_size_bytes IS NOT NULL AND (NEW.file_size_bytes <= 0 OR NEW.file_size_bytes > 10485760) THEN RAISE EXCEPTION 'Invalid file size'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER validate_project_document BEFORE INSERT OR UPDATE ON public.project_documents FOR EACH ROW EXECUTE FUNCTION public.validate_project_document();

CREATE OR REPLACE FUNCTION public.generate_document_number()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE year_prefix text; next_num integer;
BEGIN
  IF NOT (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator')) THEN RAISE EXCEPTION 'Staff access required' USING ERRCODE='42501'; END IF;
  year_prefix := to_char(now(),'YYYY');
  SELECT COALESCE(MAX(CAST(SPLIT_PART(document_number,'-',2) AS integer)),0) + 1 INTO next_num
  FROM public.project_documents WHERE document_number ~ ('^' || year_prefix || '-[0-9]+$');
  RETURN year_prefix || '-' || LPAD(next_num::text,3,'0');
END; $$;

CREATE OR REPLACE FUNCTION public.mark_document_viewed(_document_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE d public.project_documents;
BEGIN
  SELECT doc.* INTO d FROM public.project_documents doc JOIN public.projects p ON p.id = doc.project_id
  WHERE doc.id = _document_id AND p.client_id = auth.uid() AND NOT p.is_draft FOR UPDATE OF doc;
  IF NOT FOUND OR d.status <> 'poslano' THEN RETURN; END IF;
  UPDATE public.project_documents SET status='pregledano', viewed_at=now() WHERE id=d.id;
  INSERT INTO public.project_activity_log(project_id,actor_id,action,entity_type,entity_id,metadata)
  VALUES(d.project_id,auth.uid(),'document_viewed','document',d.id,jsonb_build_object('number',d.document_number,'title',d.title));
END; $$;

CREATE OR REPLACE FUNCTION public.respond_to_document(_document_id uuid, _response text, _signer_name text, _comment text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE d public.project_documents; ip text;
BEGIN
  SELECT doc.* INTO d FROM public.project_documents doc JOIN public.projects p ON p.id = doc.project_id
  WHERE doc.id = _document_id AND p.client_id = auth.uid() AND NOT p.is_draft FOR UPDATE OF doc;
  IF NOT FOUND THEN RAISE EXCEPTION 'Document not found' USING ERRCODE='42501'; END IF;
  IF d.status NOT IN ('poslano','pregledano') THEN RAISE EXCEPTION 'Document is not awaiting a response'; END IF;
  BEGIN ip := split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1); EXCEPTION WHEN others THEN ip := NULL; END;
  IF _response = 'potpisano' THEN
    IF length(trim(COALESCE(_signer_name,''))) < 3 THEN RAISE EXCEPTION 'Signer name required'; END IF;
    UPDATE public.project_documents SET status='potpisano', signed_at=now(), signed_by_user_id=auth.uid(), signed_by_name=trim(_signer_name), signed_ip=NULLIF(trim(ip),''), client_comment=NULLIF(trim(COALESCE(_comment,'')),''), viewed_at=COALESCE(viewed_at,now()) WHERE id=d.id;
    INSERT INTO public.project_activity_log(project_id,actor_id,action,entity_type,entity_id,metadata)
    VALUES(d.project_id,auth.uid(),'document_signed','document',d.id,jsonb_build_object('number',d.document_number,'title',d.title,'name',trim(_signer_name)));
  ELSIF _response = 'odbijeno' THEN
    IF length(trim(COALESCE(_comment,''))) < 10 THEN RAISE EXCEPTION 'Comment required'; END IF;
    UPDATE public.project_documents SET status='odbijeno', client_comment=trim(_comment), viewed_at=COALESCE(viewed_at,now()) WHERE id=d.id;
    INSERT INTO public.project_activity_log(project_id,actor_id,action,entity_type,entity_id,metadata)
    VALUES(d.project_id,auth.uid(),'document_revision_requested','document',d.id,jsonb_build_object('number',d.document_number,'title',d.title));
  ELSE RAISE EXCEPTION 'Invalid response'; END IF;
END; $$;

REVOKE EXECUTE ON FUNCTION public.generate_document_number() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_document_viewed(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.respond_to_document(uuid,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_document_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_document_viewed(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_to_document(uuid,text,text,text) TO authenticated;

CREATE POLICY "Staff upload project documents" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='project-documents' AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator')));
CREATE POLICY "Staff delete project documents" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id='project-documents' AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator')));
CREATE POLICY "Staff and owning clients read project documents" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='project-documents' AND (
  public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator')
  OR EXISTS (SELECT 1 FROM public.project_documents d JOIN public.projects p ON p.id=d.project_id
    WHERE d.storage_path = storage.objects.name AND d.status <> 'draft' AND p.client_id = auth.uid() AND NOT p.is_draft)
));