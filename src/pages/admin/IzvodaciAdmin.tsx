import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import StatusBadge from "@/components/admin/StatusBadge";
import { Breadcrumb, PillTabs, SampleNote } from "@/components/admin/AdminPage";
import { Block } from "./Upiti";
import { useAdminContractors } from "@/hooks/useAdminData";
import { formatShortDate, initialsOf } from "@/lib/adminFormat";
import type { AdminContractor } from "@/lib/adminMock";

const STATUSES = [
  { key: "all", label: "Sve" }, { key: "novo", label: "Nova prijava" }, { key: "u_razmatranju", label: "U razmatranju" },
  { key: "prihvaceno", label: "Prihvaćeno" }, { key: "odbijeno", label: "Odbijeno" },
];
const TH = "text-left px-5 py-4 text-xs uppercase tracking-wider text-dash-subtle font-medium";

const IzvodaciAdmin = () => {
  const { rows, setRows, isMock } = useAdminContractors();
  const [status, setStatus] = useState("all");
  const [prof, setProf] = useState("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<AdminContractor | null>(null);
  const [notes, setNotes] = useState("");

  const professions = [...new Set(rows.map((r) => r.profession))].sort();
  const base = useMemo(() => rows.filter((r) =>
    (prof === "all" || r.profession === prof) && (!q || `${r.name} ${r.location}`.toLowerCase().includes(q.toLowerCase()))
  ), [rows, prof, q]);
  const list = status === "all" ? base : base.filter((r) => r.status === status);

  const update = async (r: AdminContractor, patch: Partial<AdminContractor>) => {
    if (!r.mock) {
      const { error } = await supabase.from("contractor_applications").update(patch).eq("id", r.id);
      if (error) return toast.error("Spremanje nije uspjelo.");
    }
    const next = { ...r, ...patch };
    setRows((rs) => rs.map((x) => (x.id === r.id ? next : x)));
    setSel(next);
    toast.success("Spremljeno.");
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Izvođači" }]} />
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-5xl font-serif font-normal mb-3">Izvođači</h1>
          <p className="text-lg text-dash-muted">{rows.filter((r) => r.status === "prihvaceno").length} kooperanata u mreži · {rows.filter((r) => r.status === "novo").length} novih prijava</p>
        </div>
        <Button variant="outline" size="lg" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/izvodaci`); toast.success("Link kopiran."); }}>Kopiraj link za prijavu</Button>
      </div>
      {isMock && <SampleNote />}
      <PillTabs tabs={STATUSES.map((s) => ({ ...s, count: s.key === "all" ? base.length : base.filter((r) => r.status === s.key).length }))} value={status} onChange={setStatus} />
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={prof} onValueChange={setProf}>
          <SelectTrigger className="w-56 bg-dash-card"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Sva zanimanja</SelectItem>{professions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraži ime ili lokaciju" className="flex-1 min-w-48 bg-dash-card" />
      </div>
      <div className="bg-dash-card rounded-2xl border border-dash-border overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead><tr className="border-b border-dash-border">
            {["Datum", "Ime", "Zanimanje", "Iskustvo", "Pravni oblik", "Lokacija", "Kontakt", "Status", "Akcije"].map((h) => <th key={h} className={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-dash-subtle">Nema prijava za odabrane filtere.</td></tr>}
            {list.map((r) => (
              <tr key={r.id} className="border-b border-dash-soft last:border-0 hover:bg-dash-hover/40 cursor-pointer" onClick={() => { setSel(r); setNotes(r.admin_notes ?? ""); }}>
                <td className="px-5 py-5 font-medium">{formatShortDate(r.created_at)}</td>
                <td className="px-5 py-5 font-serif text-xl">{r.name}</td>
                <td className="px-5 py-5">{r.profession}</td>
                <td className="px-5 py-5">{r.experience}</td>
                <td className="px-5 py-5">{r.legal_form}</td>
                <td className="px-5 py-5">{r.location}</td>
                <td className="px-5 py-5"><p>{r.email}</p><p className="text-sm text-dash-muted">{r.phone}</p></td>
                <td className="px-5 py-5"><StatusBadge status={r.status} /></td>
                <td className="px-5 py-5"><Button variant="ghost" size="sm">Detalji →</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-dash-bg font-dashboard">
          {sel && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-dash-active flex items-center justify-center text-sm font-medium">{initialsOf(sel.name)}</div>
                  <div><SheetTitle className="font-serif font-normal text-2xl">{sel.name}</SheetTitle><p className="text-sm text-dash-muted">{sel.profession}</p></div>
                </div>
              </SheetHeader>
              <Block title="Osobni">
                <a href={`mailto:${sel.email}`} className="block text-primary hover:underline">{sel.email}</a>
                <a href={`tel:${sel.phone}`} className="block text-primary hover:underline">{sel.phone}</a>
              </Block>
              <Block title="Profesionalni"><p>{sel.profession} · {sel.experience}</p><p>{sel.legal_form} · {sel.location}</p></Block>
              {sel.about && <Block title="O sebi"><p className="text-dash-muted leading-relaxed">{sel.about}</p></Block>}
              <Block title="Privatne bilješke">
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="bg-dash-card" />
                <Button size="sm" variant="outline" className="mt-2" onClick={() => update(sel, { admin_notes: notes })}>Spremi bilješku</Button>
              </Block>
              <Block title="Promijeni status">
                <Select value={sel.status} onValueChange={(v) => update(sel, { status: v })}>
                  <SelectTrigger className="bg-dash-card"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.slice(1).map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </Block>
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => update(sel, { status: "prihvaceno" })}>Prihvati</Button>
                <Button variant="outline" onClick={() => update(sel, { status: "odbijeno" })}>Odbij</Button>
                <Button variant="outline" onClick={() => update(sel, { status: "u_razmatranju" })}>Sastanak</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default IzvodaciAdmin;
