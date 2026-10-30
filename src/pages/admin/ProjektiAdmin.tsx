import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/admin/StatusBadge";
import { Breadcrumb, PillTabs } from "@/components/admin/AdminPage";
import { useAdminProjects } from "@/hooks/useAdminData";
import EmptyState from "@/components/EmptyState";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import { ProjectImage } from "@/components/ProjectVisuals";
import { projectPlace } from "@/lib/projects";
import { eur, formatDate } from "@/lib/adminFormat";

const STATUSES = [
  { key: "all", label: "Svi" }, { key: "procjena", label: "Procjena" }, { key: "ugovor", label: "Ugovor" }, { key: "priprema", label: "Priprema" },
  { key: "izvodenje", label: "Izvođenje" }, { key: "predaja", label: "Predaja" }, { key: "zavrseno", label: "Završeno" },
];
const norm = (s: string) => (s === "active" ? "izvodenje" : s === "completed" ? "zavrseno" : s);

const ProjektiAdmin = () => {
  const navigate = useNavigate();
  const { rows, loading, error } = useAdminProjects();
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("all");
  const [q, setQ] = useState("");

  const types = [...new Set(rows.map((r) => r.property_type).filter((t) => t && t !== "—"))];
  const years = [...new Set(rows.map((r) => (r.start_date ?? r.end_date ?? "").slice(0, 4)).filter(Boolean))].sort().reverse();
  const base = useMemo(() => rows.filter((r) =>
    (type === "all" || r.property_type === type) &&
    (year === "all" || (r.start_date ?? r.end_date ?? "").startsWith(year)) &&
    (!q || `${r.client_name} ${projectPlace(r)}`.toLowerCase().includes(q.toLowerCase()))
  ), [rows, type, year, q]);
  const list = status === "all" ? base : base.filter((r) => norm(r.status) === status);
  const activeCount = rows.filter((r) => !["zavrseno", "completed", "odbijeno"].includes(r.status)).length;
  const total = rows.reduce((s, r) => s + (r.total_price ?? 0), 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Projekti" }]} />
      <h1 className="text-5xl font-serif font-normal mb-3">Projekti</h1>
      <p className="text-lg text-dash-muted mb-8">{activeCount} aktivnih projekata · {eur(total)} € ugovorene vrijednosti</p>
      {error && <EmptyState icon={FolderOpen} title="Učitavanje nije uspjelo" description={error} />}
      <PillTabs tabs={STATUSES.map((s) => ({ ...s, count: s.key === "all" ? base.length : base.filter((r) => norm(r.status) === s.key).length }))} value={status} onChange={setStatus} />
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-48 bg-dash-card"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Svi tipovi</SelectItem>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-40 bg-dash-card"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Sve godine</SelectItem>{years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraži po klijentu ili kvartu" className="flex-1 min-w-48 bg-dash-card" />
      </div>
      {loading ? <div className="grid lg:grid-cols-2 gap-6">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div> : !error && list.length === 0 ? <EmptyState icon={FolderOpen} title={rows.length ? "Nema rezultata" : "Još nemate projekata"} description={rows.length ? "Promijenite odabrane filtere." : "Prvi projekt nastaje kad ga kreirate iz upita."} actionLabel="Pogledaj upite" onAction={() => navigate("/admin/upiti")} /> : null}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {list.map((p) => (
          <div key={p.id} onClick={() => navigate(`/admin/projekti/${p.id}`)} className="bg-dash-card rounded-2xl border border-dash-border overflow-hidden hover:border-dash-faint transition-all cursor-pointer">
            <div className="relative"><ProjectImage url={p.hero_image_url} title={p.title} /><div className="absolute top-5 left-5"><StatusBadge status={p.is_draft ? "draft" : p.status} /></div></div>
            <div className="p-6">
              <h3 className="text-2xl font-serif font-normal mb-1">{p.title}</h3>
              <p className="text-sm text-dash-muted mb-5">{p.client_name} · {projectPlace(p)}</p>
              <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-dash-subtle">Dovršenost</span>
                  <span className="text-sm font-medium">{p.progress_percent}% · {p.total_phases} faza</span>
                </div>
                <div className="w-full h-1.5 bg-dash-soft rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${p.progress_percent}%` }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-5 pt-4 border-t border-dash-soft">
                <div><p className="text-xs text-dash-subtle uppercase tracking-wider mb-1">Ugovoreno</p><p className="font-serif text-xl">{eur(p.total_price)} €</p></div>
                <div><p className="text-xs text-dash-subtle uppercase tracking-wider mb-1">Predaja</p><p className="font-serif text-xl">{formatDate(p.end_date)}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjektiAdmin;
