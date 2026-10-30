import type { Tables } from '@/integrations/supabase/types';
export type ProjectPhoto = Tables<'project_photos'> & { url?: string };
export const photoPermissions = (role: string) => ({ canUpload: role === 'admin' || role === 'moderator', canDelete: role === 'admin', canShare: role === 'admin', canDownloadZip: role === 'admin' || role === 'moderator' });
export function validatePhoto(file: Pick<File, 'size' | 'type'>, hero = false) {
  if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) return 'Odaberite JPG, PNG, WebP, GIF ili AVIF fotografiju.';
  if (!file.size || file.size > (hero ? 10 : 20) * 1024 * 1024) return `Fotografija mora biti manja od ${hero ? 10 : 20} MB.`;
  return null;
}
const monday = (d: Date) => { const day = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); return day - ((d.getUTCDay() + 6) % 7) * 86400000; };
export const projectWeek = (taken: string, start: string | null) => start ? Math.max(1, Math.floor((monday(new Date(taken)) - monday(new Date(start))) / 604800000) + 1) : 1;
export const shareExpiry = (expires: boolean, now = new Date()) => expires ? new Date(now.getTime() + 30 * 86400000).toISOString() : null;
export const photoPath = (projectId: string, phaseId: string | null, fileName: string, hero = false) => `${projectId}/${hero ? 'hero' : phaseId || 'nepovezano'}/${crypto.randomUUID()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
export async function saveBlob(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 60000); }