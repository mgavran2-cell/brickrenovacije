import { useNavigate } from "react-router-dom";
import { FolderOpen, Clock, CalendarDays, ImageIcon } from "lucide-react";
import { useProject } from "@/hooks/useProject";
import EmptyState from "@/components/EmptyState";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import StatusBadge from "@/components/admin/StatusBadge";
import { ProjectImage, PhaseList } from "@/components/ProjectVisuals";
import { next7Days, projectPlace, taskAssignee } from "@/lib/projects";
import { formatDate } from "@/lib/adminFormat";

const MojProjekt = () => {
  const navigate = useNavigate(); const { project: p, phases, tasks, loading, error } = useProject(undefined, true);
  if (loading) return <PageSkeleton />;
  if (!p || error) return <div className="p-6 md:p-10"><EmptyState icon={FolderOpen} title={error ? "Učitavanje nije uspjelo" : "Projekt dolazi uskoro"} description={error || "Nakon što prihvatite našu ponudu, ovdje ćete pratiti sve detalje projekta — faze, napredak, fotografije i dokumente."} actionLabel="Pogledaj pregled" onAction={() => navigate("/dashboard")} /></div>;
  const active = tasks.filter(t => t.status === "u_tijeku" || t.status === "blokirano").sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"));
  const week = next7Days(tasks);
  return <div className="max-w-5xl p-6 md:p-10 bg-dash-bg"><p className="text-sm text-dash-subtle mb-3">Moj projekt</p><h1 className="text-4xl md:text-5xl font-serif mb-8 break-words">{p.title}</h1>
    <div className="relative mb-8"><ProjectImage url={p.hero_image_url} title={p.title} /><div className="absolute top-5 left-5"><StatusBadge status={p.status} /></div></div>
    <dl className="grid sm:grid-cols-3 gap-6 mb-10">{[["Adresa",projectPlace(p)],["Tip",p.property_type || "—"],["Površina",p.area_sqm == null ? "—" : `${p.area_sqm} m²`]].map(([l,v]) => <div key={l}><dt className="text-sm text-dash-subtle mb-2">{l}</dt><dd className="text-xl font-serif break-words">{v}</dd></div>)}</dl>
    <section className="mb-10"><div className="flex flex-wrap justify-between gap-3 items-center mb-4"><h2 className="text-3xl font-serif">Dovršenost</h2><span className="text-4xl text-primary font-serif">{p.progress_percent ?? 0}%</span></div><div className="w-full h-2 bg-dash-border-soft rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.progress_percent ?? 0}%` }} /></div><div className="flex flex-wrap gap-3 justify-between text-sm text-dash-subtle mt-5"><span>Početak radova · {formatDate(p.start_date)}</span><span>Predaja · {formatDate(p.end_date)}</span></div></section>
    <section className="mb-10"><h2 className="text-2xl font-serif mb-5">Faze projekta</h2><PhaseList phases={phases} /></section>
    <section className="mb-10"><h2 className="text-2xl font-serif mb-5">Trenutno u izvođenju</h2>
      {active.length === 0 ? <EmptyState icon={Clock} title="Čekamo početak radova" description="Čim projekt uđe u fazu izvođenja, ovdje će se pojaviti stvarni zadaci." /> : (
        <div className="bg-dash-card rounded-2xl border border-dash-border p-6 space-y-5">
          {active.map(task => (
            <div key={task.id} className="py-4 border-b border-dash-border-soft last:border-0">
              <div className="flex justify-between items-start mb-2 gap-3">
                <div className="min-w-0">
                  <p className="font-medium font-dashboard break-words">{task.name}</p>
                  <p className="text-sm text-dash-subtle font-dashboard mt-1">{taskAssignee(task)}{task.due_date && ` · rok ${formatDate(task.due_date)}`}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0"><span className="text-sm font-medium font-dashboard">{task.progress_percent}%</span><StatusBadge status={task.status} variant="dot" /></div>
              </div>
              <div className="w-full h-1.5 bg-dash-border-soft rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${task.progress_percent ?? 0}%` }} /></div>
            </div>
          ))}
        </div>
      )}
    </section>
    <section className="mb-10"><h2 className="text-2xl font-serif mb-5">Sljedećih 7 dana</h2>
      <div className="bg-dash-card rounded-2xl border border-dash-border p-6">
        {week.map(day => (
          <div key={day.iso} className="flex gap-6 py-5 border-b border-dash-border-soft last:border-0">
            <div className="w-14 flex-shrink-0 text-center">
              <p className="text-xs uppercase text-dash-subtle font-dashboard tracking-wider">{day.dayShort}</p>
              <p className="text-3xl font-serif font-normal mt-1">{day.date}</p>
            </div>
            <div className="flex-1 min-w-0">
              {day.tasks.length === 0 ? <p className="font-medium font-dashboard text-dash-muted">Bez radova</p> : day.tasks.map(task => (
                <div key={task.id} className="mb-2">
                  <p className="font-medium font-dashboard break-words">{task.name}</p>
                  <p className="text-sm text-dash-subtle font-dashboard mt-1">{taskAssignee(task)}{task.requires_client_presence && " · potreban pristup stanu"}</p>
                </div>
              ))}
            </div>
            {day.tasks.some(t => t.requires_client_presence) && (
              <div className="bg-primary/10 rounded-full px-4 py-1.5 text-xs text-primary font-medium font-dashboard self-start whitespace-nowrap">Vaša prisutnost</div>
            )}
          </div>
        ))}
      </div>
    </section>
    <section className="mb-10"><h2 className="text-2xl font-serif mb-5">Napredak s gradilišta</h2><EmptyState icon={ImageIcon} title="Fotografije dolaze uskoro" description="Dolazi u sljedećem krugu." /></section>
  </div>;
};
export default MojProjekt;
