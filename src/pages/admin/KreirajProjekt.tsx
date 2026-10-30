import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderOpen, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast-notifications";
import StatusBadge from "@/components/admin/StatusBadge";
import { Breadcrumb } from "@/components/admin/AdminPage";
import EmptyState from "@/components/EmptyState";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { formatDate } from "@/lib/adminFormat";
import { DEFAULT_PHASES, validateProject } from "@/lib/projects";

const Field = ({ label, children }: { label: string; children: ReactNode }) => <label className="block space-y-2 text-sm text-dash-muted"><span>{label}</span>{children}</label>;
const KreirajProjekt = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<Tables<"renovation_requests"> | null>(null);
  const [managers, setManagers] = useState<{ id: string; full_name: string }[]>([]);
  const [title, setTitle] = useState(""); const [status, setStatus] = useState("procjena");
  const [start, setStart] = useState(""); const [end, setEnd] = useState("");
  const [manager, setManager] = useState(""); const [price, setPrice] = useState(""); const [notes, setNotes] = useState("");
  const [phases, setPhases] = useState(DEFAULT_PHASES.map((name, i) => ({ key: String(i), name, end_date: "" })));
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  useEffect(() => {
    if (!requestId) { setLoading(false); return; }
    let live = true;
    (async () => {
      try {
        const [r, m, existing] = await Promise.all([
          supabase.from("renovation_requests").select("*").eq("id", requestId).maybeSingle(),
          supabase.rpc("project_managers"),
          supabase.from("projects").select("*").eq("source_request_id", requestId).maybeSingle(),
        ]);
        if (r.error || m.error || existing.error) throw r.error || m.error || existing.error;
        if (!live) return;
        setRequest(r.data); setManagers(m.data ?? []);
        setManager(m.data?.[0]?.id ?? ""); setTitle(r.data ? `Renovacija nekretnine · ${r.data.name}` : "");
        if (existing.data) {
          if (!existing.data.is_draft) { navigate(`/admin/projekti/${existing.data.id}`, { replace: true }); return; }
          const p = existing.data;
          const [ph, n] = await Promise.all([supabase.from("project_phases").select("*").eq("project_id", p.id).order("phase_order"), supabase.from("project_internal_notes").select("internal_notes").eq("project_id", p.id).maybeSingle()]);
          if (ph.error || n.error) throw ph.error || n.error;
          if (!live) return;
          setTitle(p.title); setStatus(p.status); setStart(p.start_date ?? ""); setEnd(p.end_date ?? ""); setPrice(p.total_price == null ? "" : String(p.total_price)); setManager(p.project_manager_id ?? ""); setNotes(n.data?.internal_notes ?? "");
          setPhases((ph.data ?? []).map(x => ({ key: x.id, name: x.name, end_date: x.end_date ?? "" })));
        }
      } catch { if (live) setError("Upit ili voditelje nije moguće učitati."); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, [requestId, navigate]);
  const save = async (draft: boolean) => {
    if (!request || saving) return;
    const validation = validateProject(title, manager, start, end, price, phases);
    if (validation) { toast.error("Provjerite unos", validation); return; }
    setSaving(true);
    try {
      const { data: id, error } = await supabase.rpc("create_project_from_request", {
        request_id: request.id, save_draft: draft,
        details: { title, status, start_date: start || null, end_date: end || null, project_manager_id: manager, total_price: price === "" ? null : Number(price), internal_notes: notes },
        phases: phases.map(p => ({ name: p.name, end_date: p.end_date || null })),
      });
      if (error || !id) throw error ?? new Error("Projekt nije kreiran");
      if (draft) toast.success("Draft spremljen", "Projekt još nije vidljiv klijentu niti je poslana obavijest.");
      else {
        let sent = false;
        if (request.email) {
          try { const response = await supabase.functions.invoke("send-project-created-email", { body: { projectId: id } }); sent = !response.error && response.data?.emailSent === true; } catch { sent = false; }
        }
        if (sent) toast.success("Projekt kreiran", "Klijent je obaviješten e-mailom.");
        else toast.warning("Projekt kreiran", "E-mail nije poslan. Projekt je sigurno spremljen.");
      }
      navigate(`/admin/projekti/${id}`);
    } catch { toast.error("Spremanje nije uspjelo", "Provjerite unos i pokušajte ponovno. Upit nije promijenjen."); }
    finally { setSaving(false); }
  };
  if (loading) return <PageSkeleton />;
  if (error || !request) return <div className="p-6 md:p-10"><EmptyState icon={FolderOpen} title={error || "Upit ne postoji"} description="Vratite se na popis upita." actionLabel="Pogledaj upite" onAction={() => navigate("/admin/upiti")} /></div>;
  const values = [["Telefon", request.phone], ["Email", request.email], ["Adresa", request.property_address], ["Kvart", request.location], ["Tip", request.property_type], ["Kvadratura", request.sqm == null ? "—" : `${request.sqm} m²`], ["Opseg", request.scope], ["Procjena", request.estimated_range], ["Poruka", request.message]];
  return <div className="p-6 md:p-10 max-w-7xl">
    <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Upiti", to: "/admin/upiti" }, { label: request.name }, { label: "Kreiraj projekt" }]} />
    <h1 className="text-4xl md:text-5xl font-serif font-normal mb-8">Kreiraj projekt iz upita</h1>
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <aside className="bg-dash-card rounded-2xl border border-dash-border p-6 lg:sticky lg:top-6 min-w-0">
        <div className="flex flex-wrap gap-2 justify-between mb-4"><p className="text-xs uppercase text-dash-subtle">Iz upita · samo za čitanje</p><StatusBadge status={request.status} /></div>
        <h2 className="text-2xl font-serif mb-1">{request.name}</h2><p className="text-sm text-dash-subtle mb-5">Upit br. {request.id.slice(0, 8)} · {formatDate(request.created_at)}</p>
        <dl className="divide-y divide-dash-border">{values.map(([label, value]) => <div key={label} className="py-3"><dt className="text-xs text-dash-subtle mb-1">{label}</dt><dd className="text-sm break-words whitespace-pre-wrap">{value || "—"}</dd></div>)}</dl>
      </aside>
      <form className="lg:col-span-2 min-w-0" onSubmit={e => { e.preventDefault(); void save(false); }}>
        <fieldset disabled={saving} className="space-y-6">
          <section className="space-y-6 border-b border-dash-border pb-8">
            <h2 className="text-2xl font-serif">Detalji projekta</h2>
            <Field label="Naziv projekta *"><Input required value={title} onChange={e => setTitle(e.target.value)} /></Field>
            <Field label="Status *"><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[["procjena", "Procjena"], ["ugovor", "Ugovor"], ["priprema", "Priprema"]].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></Field>
            <div className="grid sm:grid-cols-2 gap-4"><Field label="Planski početak"><Input type="date" value={start} onChange={e => setStart(e.target.value)} /></Field><Field label="Planska predaja"><Input type="date" min={start || undefined} value={end} onChange={e => setEnd(e.target.value)} /></Field></div>
            <Field label="Voditelj projekta *"><Select value={manager} onValueChange={setManager}><SelectTrigger><SelectValue placeholder="Odaberite voditelja" /></SelectTrigger><SelectContent>{managers.map(m => <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Inicijalna cijena (EUR)"><Input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} /></Field>
            <Field label="Interne napomene"><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} /></Field>
          </section>
          <section><h2 className="text-2xl font-serif mb-5">Faze projekta</h2><div className="divide-y divide-dash-border">{phases.map((p, i) => <div key={p.key} className="grid grid-cols-[24px_1fr_36px] sm:grid-cols-[24px_1fr_150px_36px] gap-3 py-3 items-center"><span className="text-dash-subtle">{i + 1}</span><Input required aria-label={`Naziv faze ${i + 1}`} value={p.name} onChange={e => setPhases(ps => ps.map(x => x.key === p.key ? { ...x, name: e.target.value } : x))} /><Input className="col-start-2 sm:col-start-auto row-start-2 sm:row-start-auto" aria-label={`Rok faze ${i + 1}`} type="date" value={p.end_date} onChange={e => setPhases(ps => ps.map(x => x.key === p.key ? { ...x, end_date: e.target.value } : x))} /><Button type="button" variant="ghost" size="icon" title="Ukloni fazu" aria-label={`Ukloni fazu ${i + 1}`} disabled={phases.length === 1} onClick={() => setPhases(ps => ps.filter(x => x.key !== p.key))}><X size={16} /></Button></div>)}</div><Button type="button" variant="outline" className="mt-4" onClick={() => setPhases(ps => [...ps, { key: crypto.randomUUID(), name: "", end_date: "" }])}><Plus size={16} className="mr-2" />Dodaj fazu</Button></section>
          <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="ghost" onClick={() => navigate("/admin/upiti")}>Odustani</Button><Button type="button" variant="outline" onClick={() => void save(true)}>Spremi kao draft</Button><Button type="submit">{saving ? "Spremanje…" : "Kreiraj i obavijesti klijenta"}</Button></div>
        </fieldset>
      </form>
    </div>
  </div>;
};
export default KreirajProjekt;