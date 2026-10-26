import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import StatusBadge from "@/components/admin/StatusBadge";
import { Breadcrumb, PillTabs, SampleNote } from "@/components/admin/AdminPage";
import { useAdminRequests } from "@/hooks/useAdminData";
import { formatShortDate, formatTime, initialsOf } from "@/lib/adminFormat";
import type { AdminRequest } from "@/lib/adminMock";

const STATUSES = [
  { key: "all", label: "Svi" }, { key: "novi", label: "Novi" }, { key: "u_kontaktu", label: "U kontaktu" },
  { key: "sastanak", label: "Sastanak" }, { key: "odbijeno", label: "Odbijeno" }, { key: "pretvoreno", label: "Pretvoreno" },
];
const TH = "text-left px-5 py-4 text-xs uppercase tracking-wider text-dash-subtle font-medium";

const Upiti = () => {
  const [params] = useSearchParams();
  const { rows, setRows, isMock } = useAdminRequests();
  const [statusFilter, setStatusFilter] = useState(params.get("status") ?? "all");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<AdminRequest | null>(null);
  const [notes, setNotes] = useState("");

  const base = useMemo(() => rows.filter((r) => {
    if (dateFilter !== "all" && Date.now() - new Date(r.created_at).getTime() > Number(dateFilter) * 86400000) return false;
    if (typeFilter !== "all" && !r.property_type.toLowerCase().includes(typeFilter.toLowerCase())) return false;
    if (q && !`${r.name} ${r.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [rows, dateFilter, typeFilter, q]);
  const list = statusFilter === "all" ? base : base.filter((r) => r.status === statusFilter);

  const update = async (r: AdminRequest, patch: Partial<AdminRequest>) => {
    if (!r.mock) {
      const { error } = await supabase.from("renovation_requests").update(patch).eq("id", r.id);
      if (error) return toast.error("Spremanje nije uspjelo.");
    }
    const next = { ...r, ...patch };
    setRows((rs) => rs.map((x) => (x.id === r.id ? next : x)));
    setSelected(next);
    toast.success("Spremljeno.");
  };

  const exportCsv = () => {
    const cols = ["created_at", "name", "email", "phone", "location", "property_type", "sqm", "scope", "status"] as const;
    const csv = [cols.join(","), ...list.map((r) => cols.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "upiti.csv"; a.click();
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Upiti" }]} />
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-5xl font-serif font-normal mb-3">Upiti</h1>
          <p className="text-lg text-dash-muted">Upiti s web forme. Na nove odgovorite unutar 24 sata.</p>
        </div>
        <Button variant="outline" size="lg" onClick={exportCsv}>Izvezi CSV</Button>
      </div>
      {isMock && <SampleNote />}
      <PillTabs tabs={STATUSES.map((s) => ({ ...s, count: s.key === "all" ? base.length : base.filter((r) => r.status === s.key).length }))} value={statusFilter} onChange={setStatusFilter} />
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-48 bg-dash-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Zadnjih 7 dana</SelectItem><SelectItem value="30">Zadnjih 30 dana</SelectItem>
            <SelectItem value="90">Zadnjih 90 dana</SelectItem><SelectItem value="all">Sve</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 bg-dash-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Svi tipovi</SelectItem><SelectItem value="Stan">Stan</SelectItem><SelectItem value="Kuća">Kuća</SelectItem>
            <SelectItem value="Kupaonica">Kupaonica</SelectItem><SelectItem value="Poslovni">Poslovni prostor</SelectItem>
          </SelectContent>
        </Select>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraži ime ili email" className="flex-1 min-w-48 bg-dash-card" />
      </div>

      <div className="bg-dash-card rounded-2xl border border-dash-border overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead><tr className="border-b border-dash-border">
            {["Datum", "Ime", "Kontakt", "Lokacija", "Tip", "Kvadratura", "Status", "Akcije"].map((h) => <th key={h} className={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-dash-subtle">Nema upita za odabrane filtere.</td></tr>}
            {list.map((r) => (
              <tr key={r.id} className="border-b border-dash-soft last:border-0 hover:bg-dash-hover/40 cursor-pointer" onClick={() => { setSelected(r); setNotes(r.admin_notes ?? ""); }}>
                <td className="px-5 py-5"><p className="font-medium">{formatShortDate(r.created_at)}</p><p className="text-xs text-dash-subtle">{formatTime(r.created_at)}</p></td>
                <td className="px-5 py-5 font-serif text-xl">{r.name}</td>
                <td className="px-5 py-5"><p>{r.email}</p><p className="text-sm text-dash-muted">{r.phone}</p></td>
                <td className="px-5 py-5">{r.location}</td>
                <td className="px-5 py-5">{r.property_type}</td>
                <td className="px-5 py-5">{r.sqm ? `${r.sqm} m²` : "—"}</td>
                <td className="px-5 py-5"><StatusBadge status={r.status} /></td>
                <td className="px-5 py-5"><Button variant="ghost" size="sm">Detalji →</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-dash-bg font-dashboard">
          {selected && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-dash-active flex items-center justify-center text-sm font-medium">{initialsOf(selected.name)}</div>
                  <div><SheetTitle className="font-serif font-normal text-2xl">{selected.name}</SheetTitle><StatusBadge status={selected.status} /></div>
                </div>
              </SheetHeader>
              <Block title="Osnovno">
                <a href={`mailto:${selected.email}`} className="block text-primary hover:underline">{selected.email}</a>
                <a href={`tel:${selected.phone}`} className="block text-primary hover:underline">{selected.phone}</a>
              </Block>
              <Block title="Nekretnina"><p>{selected.property_type} · {selected.location}{selected.sqm ? ` · ${selected.sqm} m²` : ""}</p></Block>
              <Block title="Opseg radova"><p>{selected.scope}</p></Block>
              <Block title="Detalji"><p>Stanje: {selected.condition}</p><p>Materijali: {selected.material}</p></Block>
              {selected.message && <Block title="Poruka klijenta"><p className="text-dash-muted leading-relaxed">{selected.message}</p></Block>}
              <Block title="Privatne bilješke">
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="bg-dash-card" />
                <Button size="sm" variant="outline" className="mt-2" onClick={() => update(selected, { admin_notes: notes })}>Spremi bilješku</Button>
              </Block>
              <Block title="Promijeni status">
                <Select value={selected.status} onValueChange={(v) => update(selected, { status: v })}>
                  <SelectTrigger className="bg-dash-card"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.slice(1).map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </Block>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => update(selected, { status: "u_kontaktu" })}>Odgovoreno</Button>
                <Button variant="outline" onClick={() => update(selected, { status: "sastanak" })}>Dogovori sastanak</Button>
                <Button variant="outline" onClick={() => update(selected, { status: "odbijeno" })}>Odbij</Button>
                <Button onClick={() => update(selected, { status: "pretvoreno" })}>Pretvori u projekt</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-xs uppercase tracking-widest text-dash-subtle mb-2">{title}</h3>
    <div className="space-y-1 text-sm">{children}</div>
  </div>
);

export default Upiti;
