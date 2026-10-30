import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/toast-notifications';
import { uploadProjectPhoto } from '@/lib/photoStorage';
import { validatePhoto } from '@/lib/photos';
import type { ProjectPhase } from '@/lib/projects';

interface Props { open: boolean; onOpenChange: (v: boolean) => void; projectId: string; phases: ProjectPhase[]; startDate: string | null; hero?: boolean; onSaved: () => void }
export default function PhotoUploadDialog({ open, onOpenChange, projectId, phases, startDate, hero = false, onSaved }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ id: string; file: File; progress: number; error: string; done: boolean }[]>([]);
  const [phase, setPhase] = useState('none'); const [title, setTitle] = useState(''); const [busy, setBusy] = useState(false); const [drag, setDrag] = useState(false);
  const add = (list: FileList | null) => {
    if (!list || busy) return;
    const incoming = Array.from(list).slice(0, hero ? 1 : 100);
    const valid = incoming.filter(file => { const e = validatePhoto(file, hero); if (e) toast.error(file.name, e); return !e; });
    const next = valid.map(file => ({ id: crypto.randomUUID(), file, progress: 0, error: '', done: false }));
    setFiles(prev => hero ? next : [...prev, ...next]);
  };
  const upload = async () => {
    if (busy) return; setBusy(true); let count = 0;
    for (const item of files.filter(f => !f.done)) {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, error: '' } : f));
      try { await uploadProjectPhoto(projectId, phase === 'none' ? null : phase, item.file, title, startDate, progress => setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress } : f)), hero); count++; setFiles(prev => prev.map(f => f.id === item.id ? { ...f, done: true } : f)); }
      catch (e) { setFiles(prev => prev.map(f => f.id === item.id ? { ...f, error: e instanceof Error ? e.message : 'Prijenos nije uspio.' } : f)); }
    }
    setBusy(false);
    if (count) { toast.success(hero ? 'Hero slika postavljena' : 'Fotografije dodane', hero ? undefined : `${count} fotografija dodano u ${phases.find(p => p.id === phase)?.name || 'Nepovezane'}`); onSaved(); }
  };
  return <Dialog open={open} onOpenChange={v => { if (!busy) { onOpenChange(v); if (!v) { setFiles([]); setTitle(''); } } }}><DialogContent className="max-h-[90dvh] overflow-y-auto font-dashboard bg-dash-card text-dash-ink"><DialogTitle>{hero ? 'Promijeni hero sliku' : 'Dodaj fotografije'}</DialogTitle><DialogDescription>{hero ? 'Jedna fotografija do 10 MB.' : 'Fotografije do 20 MB po datoteci.'}</DialogDescription>
    {!hero && <><Label>Faza</Label><Select value={phase} onValueChange={setPhase} disabled={busy}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Nepovezane</SelectItem>{phases.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select><Label htmlFor="photo-title">Naslov (opcionalno)</Label><Input id="photo-title" value={title} onChange={e => setTitle(e.target.value)} disabled={busy} /></>}
    <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }} className={`border-2 border-dashed rounded-lg p-8 text-center ${drag ? 'border-primary bg-primary/10' : 'border-dash-border'}`}><Upload className="mx-auto mb-3 text-dash-muted" /><p className="text-sm mb-3">Povucite fotografije ovdje</p><Button variant="outline" disabled={busy} onClick={() => input.current?.click()}>Odaberite fotografije</Button><input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple={!hero} className="hidden" onChange={e => { add(e.target.files); e.target.value = ''; }} /></div>
    {files.map(f => <div key={f.id} className="space-y-2"><div className="flex justify-between gap-2 items-center"><span className="text-sm break-all">{f.file.name}</span>{!busy && !f.done && <Button size="icon" variant="ghost" aria-label={`Ukloni ${f.file.name}`} onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}><X size={16} /></Button>}<span className="text-xs shrink-0">{f.progress}%</span></div><Progress value={f.progress} />{f.error && <p className="text-sm text-destructive" role="alert">{f.error}</p>}</div>)}
    <Button disabled={busy || !files.some(f => !f.done)} onClick={() => void upload()}>{busy ? 'Dodavanje…' : 'Spremi fotografije'}</Button>
  </DialogContent></Dialog>;
}