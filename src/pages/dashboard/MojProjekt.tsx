import { useNavigate } from "react-router-dom";
import { FolderOpen, Hammer, CalendarDays, ImageIcon } from "lucide-react";
import { useProject } from "@/hooks/useProject";
import EmptyState from "@/components/EmptyState";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import StatusBadge from "@/components/admin/StatusBadge";
import { ProjectImage, PhaseList } from "@/components/ProjectVisuals";
import { projectPlace } from "@/lib/projects";
import { formatDate } from "@/lib/adminFormat";

const MojProjekt = () => {
  const navigate = useNavigate(); const { project: p, phases, loading, error } = useProject(undefined,true);
  if (loading) return <PageSkeleton />;
  if (!p || error) return <div className="p-6 md:p-10"><EmptyState icon={FolderOpen} title={error ? "Učitavanje nije uspjelo" : "Projekt dolazi uskoro"} description={error || "Nakon što prihvatite našu ponudu, ovdje ćete pratiti sve detalje projekta — faze, napredak, fotografije i dokumente."} actionLabel="Pogledaj pregled" onAction={() => navigate("/dashboard")} /></div>;
  return <div className="max-w-5xl p-6 md:p-10 bg-dash-bg"><p className="text-sm text-dash-subtle mb-3">Moj projekt</p><h1 className="text-4xl md:text-5xl font-serif mb-8 break-words">{p.title}</h1>
    <div className="relative mb-8"><ProjectImage url={p.hero_image_url} title={p.title} /><div className="absolute top-5 left-5"><StatusBadge status={p.status} /></div></div>
    <dl className="grid sm:grid-cols-3 gap-6 mb-10">{[["Adresa",projectPlace(p)],["Tip",p.property_type || "—"],["Površina",p.area_sqm == null ? "—" : `${p.area_sqm} m²`]].map(([l,v]) => <div key={l}><dt className="text-sm text-dash-subtle mb-2">{l}</dt><dd className="text-xl font-serif break-words">{v}</dd></div>)}</dl>
    <section className="mb-10"><div className="flex flex-wrap justify-between gap-3 items-center mb-4"><h2 className="text-3xl font-serif">Dovršenost</h2><span className="text-4xl text-primary font-serif">{p.progress_percent ?? 0}%</span></div><progress className="w-full h-2 accent-primary" max={100} value={p.progress_percent ?? 0} /><div className="flex flex-wrap gap-3 justify-between text-sm text-dash-subtle mt-5"><span>Početak radova · {formatDate(p.start_date)}</span><span>Predaja · {formatDate(p.end_date)}</span></div></section>
    <section className="mb-10"><h2 className="text-2xl font-serif mb-5">Faze projekta</h2><PhaseList phases={phases} /></section>
    {[["Trenutno u izvođenju","Zadaci dolaze uskoro",Hammer],["Sljedećih 7 dana","Raspored dolazi uskoro",CalendarDays],["Napredak s gradilišta","Fotografije dolaze uskoro",ImageIcon]].map(([title,text,icon]) => <section key={String(title)} className="mb-10"><h2 className="text-2xl font-serif mb-5">{String(title)}</h2><EmptyState icon={icon as typeof Hammer} title={String(text)} description="Dolazi u sljedećem krugu." /></section>)}
  </div>;
};
export default MojProjekt;
