import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumb, PillTabs } from "@/components/admin/AdminPage";
import { initialsOf } from "@/lib/adminFormat";

type Client = { id: string; name: string; email: string; location: string; active_project: string | null; hasDone: boolean; hasAny: boolean };

const Klijenti = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const [profs, roles, projs] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email"),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("projects").select("user_id, title, status, location"),
      ]);
      const staff = new Set((roles.data ?? []).filter((r) => r.role !== "user").map((r) => r.user_id));
      setClients((profs.data ?? []).filter((p) => !staff.has(p.id)).map((p) => {
        const mine = (projs.data ?? []).filter((x) => x.user_id === p.id);
        const act = mine.find((x) => !["zavrseno", "completed"].includes(x.status));
        return {
          id: p.id, name: p.full_name || p.email || "Klijent", email: p.email ?? "—", location: mine[0]?.location ?? "—",
          active_project: act?.title ?? null, hasDone: mine.some((x) => ["zavrseno", "completed"].includes(x.status)), hasAny: mine.length > 0,
        };
      }));
      setLoading(false);
    })();
  }, []);

  const match = (c: Client, k: string) => k === "all" || (k === "active" && !!c.active_project) || (k === "done" && c.hasDone) || (k === "potential" && !c.hasAny);
  const base = clients.filter((c) => !q || `${c.name} ${c.email} ${c.location}`.toLowerCase().includes(q.toLowerCase()));
  const list = base.filter((c) => match(c, tab));
  const tabs = [{ key: "all", label: "Svi" }, { key: "active", label: "Aktivni" }, { key: "done", label: "Završeni" }, { key: "potential", label: "Potencijalni" }]
    .map((t) => ({ ...t, count: base.filter((c) => match(c, t.key)).length }));

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Klijenti" }]} />
      <h1 className="text-5xl font-serif font-normal mb-3">Klijenti</h1>
      <p className="text-lg text-dash-muted mb-8">Svi klijenti s aktivnim ili završenim projektima.</p>
      <PillTabs tabs={tabs} value={tab} onChange={setTab} />
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraži po imenu, emailu ili lokaciji" className="mb-6 bg-dash-card" />
      {!loading && list.length === 0 ? (
        <p className="text-dash-subtle py-10 text-center border border-dashed border-dash-line rounded-2xl">Još nema registriranih klijenata. Pretvorite upit u projekt da kreirate prvog klijenta.</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((c) => (
            <div key={c.id} className="bg-dash-card rounded-2xl p-6 border border-dash-border hover:border-dash-faint">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-dash-active flex items-center justify-center text-sm font-medium">{initialsOf(c.name)}</div>
                <div className="min-w-0"><h3 className="text-xl font-serif font-normal truncate">{c.name}</h3><p className="text-sm text-dash-subtle">{c.location}</p></div>
              </div>
              <p className="text-sm">Email: <span className="text-dash-muted break-all">{c.email}</span></p>
              <div className="mt-4 pt-4 border-t border-dash-soft">
                <p className="text-xs text-dash-subtle uppercase tracking-widest mb-2">Aktivni projekt</p>
                <p>{c.active_project || "Nema aktivnog projekta"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Klijenti;
