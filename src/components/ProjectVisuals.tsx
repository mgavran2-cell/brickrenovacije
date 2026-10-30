import { ImageIcon, FolderOpen } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectPhase } from "@/lib/projects";

export const ProjectImage = ({ url, title }: { url: string | null; title: string }) => {
  const [resolved,setResolved] = useState<string | null>(null);
  useEffect(() => { let live=true; setResolved(null); if(!url) return; if(url.startsWith("https://") || url.startsWith("/")) { setResolved(url); return; } const load=() => supabase.storage.from("project-photos").createSignedUrl(url,3600).then(({data}) => { if(live) setResolved(data?.signedUrl ?? null); }); void load(); const timer=setInterval(() => void load(),3000000); return () => {live=false;clearInterval(timer);}; },[url]);
  return (
  <div className="aspect-[2/1] bg-dash-soft relative overflow-hidden rounded-lg">
    {resolved ? <img src={resolved} alt={title} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-dash-border"><ImageIcon size={32} className="text-dash-faint" /><p className="mt-2 text-sm text-dash-subtle">Fotografija projekta</p></div>}
  </div>
); };
export const PhaseList = ({ phases }: { phases: ProjectPhase[] }) => phases.length ? (
  <ol className="divide-y divide-dash-border">
    {phases.map(p => <li key={p.id} className="py-4 flex flex-wrap gap-3 items-center justify-between"><p className="font-serif text-xl">{p.phase_order}. {p.name}</p><div className="flex items-center gap-3"><span className="text-sm text-dash-subtle">{p.end_date ? new Date(p.end_date).toLocaleDateString("hr-HR") : "—"}</span><StatusBadge status={p.status} /></div></li>)}
  </ol>
) : <EmptyState icon={FolderOpen} title="Faze još nisu dodane" description="Faze će biti prikazane nakon pripreme projekta." />;