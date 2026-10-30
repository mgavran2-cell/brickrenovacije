import { supabase } from '@/integrations/supabase/client';
import { photoPath, projectWeek, validatePhoto } from './photos';

export async function uploadProjectPhoto(projectId: string, phaseId: string | null, file: File, title: string, startDate: string | null, onProgress: (n: number) => void, hero = false) {
  const invalid = validatePhoto(file, hero); if (invalid) throw new Error(invalid);
  const { data: { session } } = await supabase.auth.getSession(); if (!session) throw new Error('Prijavite se ponovno.');
  const path = photoPath(projectId, phaseId, file.name, hero);
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/project-photos/${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
    xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.timeout = 180000;
    xhr.upload.onprogress = e => { if (e.lengthComputable) onProgress(Math.min(90, Math.round(e.loaded / e.total * 90))); };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Fotografiju nije moguće pohraniti.'));
    xhr.onerror = xhr.ontimeout = () => reject(new Error('Prijenos nije uspio. Pokušajte ponovno.'));
    xhr.send(file);
  });
  const takenAt = new Date().toISOString();
  const { data, error } = await supabase.from('project_photos').insert({ project_id: projectId, phase_id: hero ? null : phaseId, storage_path: path, file_name: file.name, file_size_bytes: file.size, mime_type: file.type, title: hero ? 'HERO' : title.trim() || null, taken_at: takenAt, week_number: projectWeek(takenAt, startDate), uploaded_by: session.user.id, photo_type: hero ? 'hero' : 'gallery' }).select('id').single();
  if (error) { await supabase.storage.from('project-photos').remove([path]); throw new Error('Podaci fotografije nisu spremljeni.'); }
  if (hero) {
    const result = await supabase.from('projects').update({ hero_image_url: path }).eq('id', projectId).select('id');
    if (result.error || !result.data?.length) throw new Error('Fotografija je dodana, ali naslovna slika nije postavljena.');
  }
  onProgress(100); return data;
}