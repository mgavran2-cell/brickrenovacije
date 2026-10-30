import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FolderOpen, FileText, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/admin/AdminPage";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/EmptyState";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import ConfirmDialog from "@/components/ConfirmDialog";
import DestructiveConfirmDialog from "@/components/DestructiveConfirmDialog";
import { ProjectImage, PhaseList } from "@/components/ProjectVisuals";
import { toast } from "@/components/ui/toast-notifications";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { projectPlace } from "@/lib/projects";
import { eur, formatDate } from "@/lib/adminFormat";

const ProjektDetalji = () => {
  const { id } = useParams(); const navigate = useNavigate();
  const { session } = useAuth(); const { project: p, phases, loading, error } = useProject(id);
  const [edit, setEdit] = useState(false); const [remove, setRemove] = useState(false); const [deleting, setDeleting] = useState(false); const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => { const uid = session?.user.id; if (uid) supabase.rpc("has_role", { _user_id: uid, _role: "admin" }).then(r => setIsAdmin(r.data === true)); }, [session?.user.id]);
  const deleteProject = async () => {
    if (!p || deleting) return; setDeleting(true);
    const { data, error } = await supabase.from("projects").delete().eq("id", p.id).select("id");
    setDeleting(false);
    if (error || !data?.length) { toast.error("Projekt nije obrisan", "Pokušajte ponovno."); return; }
    toast.success("Projekt obrisan"); navigate("/admin/projekti");
  };
  if (loading) return <PageSkeleton />;
  if (!p || error) return <div className="p-6 md:p-10"><EmptyState icon={FolderOpen} title={error ? "Učitavanje nije uspjelo" : "Projekt ne postoji"} description={error || "Projekt nije pronađen."} actionLabel="Natrag na projekte" onAction={() => navigate("/admin/projekti")} /></div>;
  return <div className="p-6 md:p-10 max-w-7xl">
    <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Projekti", to: "/admin/projekti" }, { label: p.title }]} />
    <div className="flex flex-wrap justify-between gap-4 mb-6"><div><StatusBadge status={p.is_draft ? "draft" : p.status} /><h1 className="text-4xl md:text-5xl font-serif font-normal mt-3 break-words">{p.title}</h1><p className="mt-2 text-dash-muted">{projectPlace(p)}</p></div><div className="flex flex-wrap gap-2 self-start"><Button variant="outline" onClick={() => setEdit(true)}><Pencil size={16} className="mr-2" />Uredi</Button>{isAdmin && <Button variant="destructive" disabled={deleting} onClick={() => setRemove(true)}><Trash2 size={16} className="mr-2" />Obriši projekt</Button>}</div></div>
    {p.is_draft && p.source_request_id && <Button className="mb-6" asChild><Link to={`/admin/upiti/${p.source_request_id}/kreiraj-projekt`}>Nastavi draft</Link></Button>}
    <div className="grid lg:grid-cols-3 gap-8 mb-10"><div className="lg:col-span-2"><ProjectImage url={p.hero_image_url} title={p.title} /><p className="text-sm text-dash-subtle mt-3">{p.progress_percent ?? 0}% dovršeno</p></div><div className="space-y-8"><section><h2 className="text-2xl font-serif mb-3">Klijent</h2><p className="font-serif text-xl mb-2">{p.client_name}</p>{p.client_email && <a className="text-primary block break-all" href={`mailto:${p.client_email}`}>{p.client_email}</a>}{p.client_phone && <a className="text-primary block" href={`tel:${p.client_phone}`}>{p.client_phone}</a>}</section><section><h2 className="text-2xl font-serif mb-3">Financije</h2><dl className="grid grid-cols-2 gap-3 text-sm"><dt>Ugovoreno</dt><dd>{eur(p.total_price)} €</dd><dt>Plaćeno</dt><dd>{eur(p.paid_amount)} €</dd><dt>Preostalo</dt><dd>{p.total_price == null ? "—" : eur(p.total_price - (p.paid_amount ?? 0))} €</dd></dl></section></div></div>
    <Tabs defaultValue="pregled"><TabsList className="flex-wrap h-auto bg-dash-card">{["Pregled", "Faze", "Troškovnik", "Ponude", "Dokumenti", "Poruke", "Fotografije"].map(t => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList>
      <TabsContent value="Pregled" className="mt-8"><h2 className="text-2xl font-serif mb-5">Osnovno</h2><dl className="grid sm:grid-cols-2 gap-4 mb-8">{[["Adresa", p.address], ["Tip", p.property_type], ["Površina", p.area_sqm == null ? "—" : `${p.area_sqm} m²`], ["Početak", formatDate(p.start_date)], ["Predaja", formatDate(p.end_date)]].map(([l, v]) => <div key={l}><dt className="text-sm text-dash-subtle">{l}</dt><dd className="break-words">{v || "—"}</dd></div>)}</dl><h2 className="text-2xl font-serif mb-4">Faze projekta</h2><PhaseList phases={phases} /></TabsContent>
      <TabsContent value="Faze" className="mt-8"><PhaseList phases={phases} /></TabsContent>
      {["Troškovnik", "Ponude", "Dokumenti", "Poruke", "Fotografije"].map(t => <TabsContent key={t} value={t} className="mt-8"><EmptyState icon={FileText} title={t} description="Dolazi u sljedećem krugu." /></TabsContent>)}
    </Tabs>
    <ConfirmDialog open={edit} onOpenChange={setEdit} title="Uređivanje projekta" description="Značajke uređivanja detalja projekta dolaze uskoro." confirmLabel="U redu" onConfirm={() => setEdit(false)} />
    <DestructiveConfirmDialog open={remove} onOpenChange={setRemove} title="Trajno obrisati projekt?" description={`Brišu se ${phases.length} faza i povijest projekta ${p.address || p.title}. Dokumenti, poruke i fotografije još nisu dio ovog projekta. Ova radnja se ne može poništiti.`} requireText="OBRIŠI" confirmLabel="Obriši projekt" onConfirm={() => void deleteProject()} />
  </div>;
};
export default ProjektDetalji;
