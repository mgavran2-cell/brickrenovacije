import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FolderOpen, FileText, Pencil, Trash2, ChevronDown, MoreHorizontal, Plus, Hammer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/admin/AdminPage";
import StatusBadge, { statusLabel } from "@/components/admin/StatusBadge";
import EmptyState from "@/components/EmptyState";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import ConfirmDialog from "@/components/ConfirmDialog";
import DestructiveConfirmDialog from "@/components/DestructiveConfirmDialog";
import TaskSheet from "@/components/admin/TaskSheet";
import { ProjectImage } from "@/components/ProjectVisuals";
import { toast } from "@/components/ui/toast-notifications";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { activeTasks, formatActivity, phaseProgress, phaseTasks, projectPlace, taskAssignee } from "@/lib/projects";
import type { ProjectPhase, ProjectTask } from "@/lib/projects";
import { eur, formatDate, timeAgo } from "@/lib/adminFormat";
import { cn } from "@/lib/utils";
import PhotoGallery from "@/components/PhotoGallery";
import PhotoUploadDialog from "@/components/PhotoUploadDialog";

const ProjektDetalji = () => {
  const { id } = useParams(); const navigate = useNavigate();
  const { session } = useAuth();
  const { project: p, phases, tasks, activities, loading, error, reload } = useProject(id);
  const [edit, setEdit] = useState(false); const [remove, setRemove] = useState(false); const [deleting, setDeleting] = useState(false); const [isAdmin, setIsAdmin] = useState(false);
  const [taskSheet, setTaskSheet] = useState<{ open: boolean; task: ProjectTask | null; phaseId: string | null }>({ open: false, task: null, phaseId: null });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingPhase, setAddingPhase] = useState(false); const [newPhaseName, setNewPhaseName] = useState(""); const [savingPhase, setSavingPhase] = useState(false);
  const [heroUpload, setHeroUpload] = useState(false);
  const [team, setTeam] = useState<{ id: string; full_name: string }[]>([]);

  useEffect(() => { const uid = session?.user.id; if (uid) supabase.rpc("has_role", { _user_id: uid, _role: "admin" }).then(r => setIsAdmin(r.data === true)); }, [session?.user.id]);
  useEffect(() => { supabase.rpc("project_managers").then(({ data }) => setTeam(data ?? [])); }, []);

  const deleteProject = async () => {
    if (!p || deleting || !isAdmin) return; setDeleting(true);
    const photos = await supabase.from("project_photos").select("storage_path").eq("project_id", p.id);
    if (photos.error) { setDeleting(false); toast.error("Projekt nije obrisan", "Fotografije nije moguće provjeriti."); return; }
    if (photos.data.length) {
      const removal = await supabase.storage.from("project-photos").remove(photos.data.map(photo => photo.storage_path));
      if (removal.error) { setDeleting(false); toast.error("Projekt nije obrisan", "Fotografije nisu uklonjene."); return; }
    }
    const { data, error } = await supabase.from("projects").delete().eq("id", p.id).select("id");
    setDeleting(false);
    if (error || !data?.length) { toast.error("Projekt nije obrisan", "Pokušajte ponovno."); return; }
    toast.success("Projekt obrisan"); navigate("/admin/projekti");
  };

  const setPhaseStatus = async (phase: ProjectPhase, status: string) => {
    const { error } = await supabase.from("project_phases").update({ status, ...(status === "zavrseno" ? { completed_at: new Date().toISOString() } : {}) }).eq("id", phase.id);
    if (error) { toast.error("Status nije promijenjen", "Pokušajte ponovno."); return; }
    if (p) await supabase.from("project_activity_log").insert({ project_id: p.id, actor_id: session?.user.id ?? null, action: status === "zavrseno" ? "phase_completed" : "phase_started", entity_type: "phase", entity_id: phase.id, metadata: { name: phase.name } });
    toast.success("Faza ažurirana", `${phase.name} → ${statusLabel(status)}`);
    void reload();
  };

  const addPhase = async () => {
    if (!p || !newPhaseName.trim() || savingPhase) return;
    setSavingPhase(true);
    const order = Math.max(0, ...phases.map(ph => ph.phase_order)) + 1;
    const { error } = await supabase.from("project_phases").insert({ project_id: p.id, name: newPhaseName.trim(), phase_order: order });
    setSavingPhase(false);
    if (error) { toast.error("Faza nije dodana", "Pokušajte ponovno."); return; }
    toast.success("Faza dodana", newPhaseName.trim());
    setNewPhaseName(""); setAddingPhase(false);
    void reload();
  };

  const toggleExpanded = (phaseId: string) => setExpanded(prev => { const next = new Set(prev); if (next.has(phaseId)) next.delete(phaseId); else next.add(phaseId); return next; });

  if (loading) return <PageSkeleton />;
  if (!p || error) return <div className="p-6 md:p-10"><EmptyState icon={FolderOpen} title={error ? "Učitavanje nije uspjelo" : "Projekt ne postoji"} description={error || "Projekt nije pronađen."} actionLabel="Natrag na projekte" onAction={() => navigate("/admin/projekti")} /></div>;

  const active = activeTasks(tasks);

  return <div className="p-6 md:p-10 max-w-7xl">
    <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Projekti", to: "/admin/projekti" }, { label: p.title }]} />
    <div className="flex flex-wrap justify-between gap-4 mb-6"><div><StatusBadge status={p.is_draft ? "draft" : p.status} /><h1 className="text-4xl md:text-5xl font-serif font-normal mt-3 break-words">{p.title}</h1><p className="mt-2 text-dash-muted">{projectPlace(p)}</p></div><div className="flex flex-wrap gap-2 self-start"><Button variant="outline" onClick={() => setEdit(true)}><Pencil size={16} className="mr-2" />Uredi</Button>{isAdmin && <Button variant="destructive" disabled={deleting} onClick={() => setRemove(true)}><Trash2 size={16} className="mr-2" />Obriši projekt</Button>}</div></div>
    {p.is_draft && p.source_request_id && <Button className="mb-6" asChild><Link to={`/admin/upiti/${p.source_request_id}/kreiraj-projekt`}>Nastavi draft</Link></Button>}
    <div className="grid lg:grid-cols-3 gap-8 mb-10"><div className="lg:col-span-2"><ProjectImage url={p.hero_image_url} title={p.title} />{(!p.hero_image_url || isAdmin) && <Button variant="outline" className="mt-3" onClick={() => setHeroUpload(true)}><Pencil size={16} className="mr-2" />Promijeni hero sliku</Button>}<p className="text-sm text-dash-subtle mt-3">{p.progress_percent ?? 0}% dovršeno</p></div><div className="space-y-8"><section><h2 className="text-2xl font-serif mb-3">Klijent</h2><p className="font-serif text-xl mb-2">{p.client_name}</p>{p.client_email && <a className="text-primary block break-all" href={`mailto:${p.client_email}`}>{p.client_email}</a>}{p.client_phone && <a className="text-primary block" href={`tel:${p.client_phone}`}>{p.client_phone}</a>}</section><section><h2 className="text-2xl font-serif mb-3">Financije</h2><dl className="grid grid-cols-2 gap-3 text-sm"><dt>Ugovoreno</dt><dd>{eur(p.total_price)} €</dd><dt>Plaćeno</dt><dd>{eur(p.paid_amount)} €</dd><dt>Preostalo</dt><dd>{p.total_price == null ? "—" : eur(p.total_price - (p.paid_amount ?? 0))} €</dd></dl></section></div></div>
    <Tabs defaultValue="Pregled"><TabsList className="flex-wrap h-auto bg-dash-card">{["Pregled", "Faze", "Troškovnik", "Ponude", "Dokumenti", "Poruke", "Fotografije"].map(t => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList>
      <TabsContent value="Pregled" className="mt-8">
        <h2 className="text-2xl font-serif mb-5">Osnovno</h2>
        <dl className="grid sm:grid-cols-2 gap-4 mb-8">{[["Adresa", p.address], ["Tip", p.property_type], ["Površina", p.area_sqm == null ? "—" : `${p.area_sqm} m²`], ["Početak", formatDate(p.start_date)], ["Predaja", formatDate(p.end_date)]].map(([l, v]) => <div key={l}><dt className="text-sm text-dash-subtle">{l}</dt><dd className="break-words">{v || "—"}</dd></div>)}</dl>
        <div className="bg-dash-card rounded-2xl border border-dash-border p-6">
          <div className="flex justify-between items-center mb-3"><h3 className="text-2xl font-serif font-normal">Napredak projekta</h3><span className="text-2xl font-serif text-primary">{p.progress_percent ?? 0}%</span></div>
          <div className="w-full h-2 bg-dash-border-soft rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.progress_percent ?? 0}%` }} /></div>
        </div>
        <div className="bg-dash-card rounded-2xl border border-dash-border p-6 mt-8">
          <h3 className="text-2xl font-serif font-normal mb-4">Trenutno u izvođenju</h3>
          {active.length === 0 ? (
            <EmptyState icon={Hammer} title="Trenutno nema aktivnih zadataka" description="Dodajte zadatke po fazama da pratite napredak projekta." actionLabel="Dodaj zadatak" onAction={() => setTaskSheet({ open: true, task: null, phaseId: null })} />
          ) : (
            <div className="space-y-5">
              {active.map(task => (
                <button key={task.id} type="button" onClick={() => setTaskSheet({ open: true, task, phaseId: task.phase_id })} className="w-full text-left py-4 border-b border-dash-border-soft last:border-0">
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <div className="min-w-0">
                      <p className="font-medium font-dashboard break-words">{task.name}</p>
                      <p className="text-sm text-dash-subtle font-dashboard mt-1">{taskAssignee(task, team)}{task.due_date && ` · rok ${formatDate(task.due_date)}`}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0"><span className="text-sm font-medium font-dashboard">{task.progress_percent}%</span><StatusBadge status={task.status} variant="dot" /></div>
                  </div>
                  <div className="w-full h-1.5 bg-dash-border-soft rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${task.progress_percent ?? 0}%` }} /></div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="bg-dash-card rounded-2xl border border-dash-border p-6 mt-8">
          <h3 className="text-2xl font-serif font-normal mb-4">Aktivnost</h3>
          {activities.length === 0 ? <p className="text-sm text-dash-muted font-dashboard">Nema zabilježenih aktivnosti.</p> : (
            <div className="relative pl-6 border-l-2 border-dash-border-soft space-y-5">
              {activities.map(a => (
                <div key={a.id} className="relative">
                  <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-primary mt-1.5" />
                  <p className="font-medium font-dashboard">{formatActivity(a)}</p>
                  <p className="text-sm text-dash-subtle font-dashboard mt-1">{a.created_at ? timeAgo(a.created_at) : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="Faze" className="mt-8">
        {phases.length === 0 && <EmptyState icon={FolderOpen} title="Faze još nisu dodane" description="Dodajte prvu fazu projekta." />}
        <div className="space-y-5">
          {phases.map(phase => {
            const list = phaseTasks(tasks, phase.id);
            const progress = phaseProgress(tasks, phase.id);
            const isOpen = expanded.has(phase.id);
            return (
              <div key={phase.id} className="bg-dash-card rounded-2xl border border-dash-border p-6">
                <div className="flex flex-wrap justify-between gap-3 items-start">
                  <div className="min-w-0">
                    <p className="font-serif text-xl break-words">{phase.phase_order}. {phase.name}</p>
                    <p className="text-sm text-dash-subtle font-dashboard mt-1">{formatDate(phase.start_date)} – {formatDate(phase.end_date)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={phase.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Akcije faze"><MoreHorizontal size={18} /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => void setPhaseStatus(phase, "u_tijeku")}>Označi kao U tijeku</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void setPhaseStatus(phase, "zavrseno")}>Označi kao Završeno</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" aria-label="Prikaži zadatke" onClick={() => toggleExpanded(phase.id)}><ChevronDown size={18} className={cn("transition-transform", isOpen && "rotate-180")} /></Button>
                  </div>
                </div>
                {list.length > 0 && <div className="w-full h-1.5 bg-dash-border-soft rounded-full overflow-hidden mt-4"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} /></div>}
                {isOpen && (
                  <div className="mt-4 divide-y divide-dash-border-soft">
                    {list.length === 0 && <p className="text-sm text-dash-muted font-dashboard py-3">Nema zadataka u ovoj fazi.</p>}
                    {list.map(task => (
                      <button key={task.id} type="button" onClick={() => setTaskSheet({ open: true, task, phaseId: phase.id })} className="w-full text-left py-3 flex flex-wrap justify-between gap-3 items-center">
                        <div className="min-w-0"><p className="font-medium font-dashboard break-words">{task.name}</p><p className="text-sm text-dash-subtle font-dashboard mt-0.5">{taskAssignee(task, team)}{task.due_date && ` · rok ${formatDate(task.due_date)}`}</p></div>
                        <div className="flex items-center gap-3 shrink-0"><span className="text-sm font-medium font-dashboard">{task.progress_percent}%</span><StatusBadge status={task.status} variant="dot" /></div>
                      </button>
                    ))}
                  </div>
                )}
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setTaskSheet({ open: true, task: null, phaseId: phase.id })}><Plus size={14} className="mr-1" />Dodaj zadatak</Button>
              </div>
            );
          })}
        </div>
        {addingPhase ? (
          <div className="flex gap-3 mt-6">
            <Input autoFocus placeholder="Naziv nove faze" value={newPhaseName} onChange={e => setNewPhaseName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void addPhase(); }} />
            <Button disabled={savingPhase} onClick={() => void addPhase()}>Dodaj</Button>
            <Button variant="outline" onClick={() => { setAddingPhase(false); setNewPhaseName(""); }}>Odustani</Button>
          </div>
        ) : (
          <Button variant="outline" className="mt-6" onClick={() => setAddingPhase(true)}><Plus size={16} className="mr-2" />Dodaj fazu</Button>
        )}
      </TabsContent>
      <TabsContent value="Fotografije" className="mt-8"><PhotoGallery projectId={p.id} phases={phases} canUpload canDelete={isAdmin} canShare={isAdmin} canDownloadZip /></TabsContent>
      {["Troškovnik", "Ponude", "Dokumenti", "Poruke"].map(t => <TabsContent key={t} value={t} className="mt-8"><EmptyState icon={FileText} title={t} description="Dolazi u sljedećem krugu." /></TabsContent>)}
    </Tabs>
    <PhotoUploadDialog open={heroUpload} onOpenChange={setHeroUpload} projectId={p.id} phases={phases} startDate={p.start_date} hero onSaved={() => void reload()} />
    <TaskSheet open={taskSheet.open} onOpenChange={open => setTaskSheet(s => ({ ...s, open }))} project={p} phases={phases} task={taskSheet.task} defaultPhaseId={taskSheet.phaseId} onSaved={() => void reload()} />
    <ConfirmDialog open={edit} onOpenChange={setEdit} title="Uređivanje projekta" description="Značajke uređivanja detalja projekta dolaze uskoro." confirmLabel="U redu" onConfirm={() => setEdit(false)} />
    <DestructiveConfirmDialog open={remove} onOpenChange={setRemove} title="Trajno obrisati projekt?" description={`Brišu se ${phases.length} faza, ${tasks.length} zadataka i povijest projekta ${p.address || p.title}. Brišu se i zapisi fotografija te javni linkovi; dokumenti i poruke još nisu dio projekta. Ova radnja se ne može poništiti.`} requireText="OBRIŠI" confirmLabel="Obriši projekt" onConfirm={() => void deleteProject()} />
  </div>;
};
export default ProjektDetalji;
