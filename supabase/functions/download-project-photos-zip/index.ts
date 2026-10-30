import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import JSZip from 'npm:jszip@3.10.1';
import { z } from 'npm:zod@3';
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const json = (data: unknown, status: number) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  try {
    const token = req.headers.get('Authorization')?.replace(/^Bearer /i,''); if (!token) return json({ error: 'Prijava je potrebna.' }, 401);
    const db = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data: { user }, error: ue } = await db.auth.getUser(token); if (ue || !user) return json({ error: 'Prijava je potrebna.' }, 401);
    const { data: roles } = await db.from('user_roles').select('role').eq('user_id',user.id);
    if (!roles?.some(r => r.role === 'admin' || r.role === 'moderator')) return json({ error: 'Nije dopušteno.' },403);
    const body = z.object({ projectId: z.string().uuid() }).safeParse(await req.json()); if (!body.success) return json({ error: 'Neispravan projekt.' },400);
    const [{ data: project }, { data: photos, error: pe }] = await Promise.all([db.from('projects').select('title').eq('id',body.data.projectId).maybeSingle(), db.from('project_photos').select('id,storage_path,file_name,file_size_bytes').eq('project_id',body.data.projectId).eq('photo_type','gallery')]);
    if (!project || pe) return json({ error: 'Projekt nije pronađen.' },404);
    if (!photos?.length) return json({ error: 'Nema fotografija.' },400);
    if (photos.reduce((s,p) => s+(p.file_size_bytes ?? 0),0) > 100*1024*1024) return json({ error: 'Galerija prelazi 100 MB. Preuzmite fotografije pojedinačno.' },413);
    const zip = new JSZip(); let total = 0;
    for (const photo of photos) {
      const { data, error } = await db.storage.from('project-photos').download(photo.storage_path); if (error || !data) throw new Error('Download failed');
      total += data.size; if(total > 100*1024*1024) return json({ error: 'Galerija prelazi 100 MB.' },413);
      zip.file(`${photo.id.slice(0,8)}-${photo.file_name.replace(/[^a-zA-Z0-9._-]/g,'_')}`, await data.arrayBuffer());
    }
    const bytes = await zip.generateAsync({ type:'uint8array', compression:'STORE' });
    const name = `${project.title.replace(/[^a-zA-Z0-9_-]/g,'_')}-fotografije-${new Date().toISOString().slice(0,10)}.zip`;
    return new Response(bytes, { headers: { ...corsHeaders, 'Content-Type':'application/octet-stream', 'Content-Disposition':`attachment; filename="${name}"`, 'Access-Control-Expose-Headers':'Content-Disposition' } });
  } catch { return json({ error: 'ZIP nije moguće pripremiti.' },500); }
});