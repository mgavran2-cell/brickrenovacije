import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
const bodySchema = z.object({ token: z.string().regex(/^[a-f0-9]{32}$/), photoId: z.string().uuid().optional() });
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  try {
    const parsed = bodySchema.safeParse(await req.json()); if (!parsed.success) return json({ error: 'Link nije valjan ili je istekao.' }, 400);
    const db = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data: link, error } = await db.from('project_share_links').select('project_id,expires_at').eq('token', parsed.data.token).maybeSingle();
    if (error || !link || (link.expires_at && new Date(link.expires_at).getTime() <= Date.now())) return json({ error: 'Link nije valjan ili je istekao.' }, 404);
    const { data: project } = await db.from('projects').select('id,title,start_date,is_draft').eq('id', link.project_id).maybeSingle();
    if (!project || project.is_draft) return json({ error: 'Link nije valjan ili je istekao.' }, 404);
    if (parsed.data.photoId) {
      const { data: photo } = await db.from('project_photos').select('storage_path,file_name').eq('project_id', project.id).eq('id', parsed.data.photoId).maybeSingle();
      if (!photo) return json({ error: 'Fotografija nije pronađena.' }, 404);
      const { data, error: downloadError } = await db.storage.from('project-photos').download(photo.storage_path);
      if (downloadError || !data) return json({ error: 'Preuzimanje nije uspjelo.' }, 500);
      return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-store' } });
    }
    const [{ data: photos, error: pe }, { data: phases }] = await Promise.all([db.from('project_photos').select('id,project_id,phase_id,file_name,title,description,taken_at,created_at,week_number,storage_path,photo_type').eq('project_id', project.id).eq('photo_type','gallery').order('taken_at', { ascending: false }), db.from('project_phases').select('id,name,phase_order').eq('project_id',project.id).order('phase_order')]);
    if (pe) throw pe;
    const items = await Promise.all((photos ?? []).map(async photo => { const { data } = await db.storage.from('project-photos').createSignedUrl(photo.storage_path, 300); const { storage_path, ...safe } = photo; return { ...safe, url: data?.signedUrl }; }));
    return json({ project: { id: project.id, title: project.title, start_date: project.start_date }, phases: phases ?? [], photos: items });
  } catch { return json({ error: 'Galeriju nije moguće učitati.' }, 500); }
});