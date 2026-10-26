import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/admin/AdminPage";
import StatusBadge from "@/components/admin/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAdminProjects } from "@/hooks/useAdminData";
import { eur, formatDate, timeAgo } from "@/lib/adminFormat";

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-dash-card rounded-2xl p-6 border border-dash-border">
    <h3 className="text-xs uppercase tracking-widest text-dash-subtle mb-4">{title}</h3>
    {children}
  </div>
);
const Empty = ({ text }: { text: string }) => <p className="text-dash-subtle py-8 text-center border border-dashed border-dash-line rounded-2xl">{text}</p>;

const PHASES = ["Procjena", "Ugovor", "Priprema", "Izvođenje", "Predaja"];
const COSTS: { cat: string; items: [string, string, number][] }[] = [
  { cat: "Materijali", items: [["Keramika 60x60, kupaonica", "24 m²", 38], ["Laminat hrast, AC5", "52 m²", 29], ["Sanitarije (WC, umivaonik, tuš)", "1 kpl", 2150]] },
  { cat: "Rad", items: [["Rušenje i odvoz šute", "1 pauš.", 2400], ["Elektroinstalacije", "68 m²", 45], ["Polaganje keramike", "38 m²", 32]] },
  { cat: "Dodaci", items: [["Koordinacija i nadzor", "1 pauš.", 1800]] },
];

const ProjektDetalji = () => {
  const { id } = useParams();
  const { rows, loading } = useAdminProjects();
  const p = rows.find((r) => r.id === id);
  const [msgs, setMsgs] = useState<{ id: string; sender_name: string; text: string; created_at: string }[]>([]);
  const [ponude, setPonude] = useState<{ id: string; code: string; title: string; amount: number; status: string }[]>([]);

  useEffect(() => {
    if (!id || id.startsWith("mock")) return;
    supabase.from("ponude").select("id, code, title, amount, status").eq("project_id", id).then(({ data }) => setPonude(data ?? []));
    supabase.from("poruke").select("id, sender_name, text, created_at").eq("conversation_id", id).order("created_at").then(({ data }) => setMsgs(data ?? []));
  }, [id]);

  if (loading) return <div className="p-10 text-dash-subtle">Učitavanje…</div>;
  if (!p) return <div className="p-10"><Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Projekti", to: "/admin/projekti" }]} /><Empty text="Projekt nije pronađen." /></div>;

  const full = p.id === "mock-1";
  const phaseIdx = Math.max(0, PHASES.indexOf(p.current_phase));
  const subtotal = COSTS.flatMap((c) => c.items).reduce((s, [, q, u]) => s + (parseFloat(q) || 1) * u, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: "Projekti", to: "/admin/projekti" }, { label: p.title }]} />
      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <div className="aspect-[16/9] rounded-2xl border-2 border-dashed border-dash-border bg-dash-soft flex flex-col items-center justify-center mb-6">
            <ImageIcon className="text-dash-faint" size={40} /><p className="text-sm text-dash-subtle mt-2">Fotografija projekta</p>
          </div>
          <div className="flex items-center gap-3 mb-2"><StatusBadge status={p.status} /><span className="text-sm text-dash-subtle">{p.progress}% dovršeno</span></div>
          <h1 className="text-4xl md:text-5xl font-serif font-normal">{p.title}</h1>
          <p className="text-lg text-dash-muted mt-2">{p.address}, {p.location}</p>
        </div>
        <div className="space-y-6">
          <Card title="Klijent">
            <p className="font-serif text-2xl mb-1">{p.client_name}</p>
            <p className="text-sm text-dash-muted mb-4">{p.location}</p>
            {p.client_email && <a href={`mailto:${p.client_email}`} className="text-sm text-primary hover:underline block">{p.client_email}</a>}
            {p.client_phone && <a href={`tel:${p.client_phone}`} className="text-sm text-primary hover:underline block">{p.client_phone}</a>}
          </Card>
          <Card title="Financije">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-dash-muted">Ugovoreno</span><span className="font-serif text-lg">{eur(p.total_price)} €</span></div>
              <div className="flex justify-between"><span className="text-sm text-dash-muted">Plaćeno</span><span className="font-serif text-lg text-primary">{eur(p.paid)} €</span></div>
              <div className="flex justify-between pt-3 border-t border-dash-soft"><span className="text-sm text-dash-muted">Preostalo</span><span className="font-serif text-lg">{p.total_price != null ? eur(p.total_price - (p.paid ?? 0)) : "—"} €</span></div>
            </div>
          </Card>
          <Card title="Tim na projektu">
            {p.teams.length === 0 ? <p className="text-sm text-dash-subtle">Tim još nije dodijeljen.</p> : p.teams.map((t) => (
              <div key={t.name} className="flex justify-between py-2 border-b border-dash-soft last:border-0"><span>{t.name}</span><span className="text-sm text-dash-muted">{t.role}</span></div>
            ))}
          </Card>
        </div>
      </div>

      <Tabs defaultValue="pregled">
        <TabsList className="bg-dash-card border border-dash-border flex-wrap h-auto">
          {["Pregled", "Faze", "Troškovnik", "Ponude", "Dokumenti", "Poruke", "Fotografije"].map((t) => <TabsTrigger key={t} value={t.toLowerCase()}>{t}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="pregled" className="mt-6 grid md:grid-cols-2 gap-6">
          <Card title="Osnovno">
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-dash-muted">Adresa</dt><dd>{p.address}</dd>
              <dt className="text-dash-muted">Tip</dt><dd>{p.type}</dd>
              <dt className="text-dash-muted">Kvadratura</dt><dd>{p.sqm ? `${p.sqm} m²` : "—"}</dd>
              <dt className="text-dash-muted">Započeto</dt><dd>{formatDate(p.start_date)}</dd>
              <dt className="text-dash-muted">Predaja</dt><dd>{formatDate(p.end_date)}</dd>
            </dl>
          </Card>
          <Card title="Trenutno u izvođenju">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><p className="font-medium">{p.current_task}</p></div>
          </Card>
          <div className="md:col-span-2"><Card title="Faze">
            <div className="grid grid-cols-5 gap-2">
              {PHASES.map((ph, i) => (
                <div key={ph}>
                  <div className={`h-1.5 rounded-full mb-2 ${i <= phaseIdx ? "bg-primary" : "bg-dash-soft"}`} />
                  <p className={`text-sm ${i === phaseIdx ? "font-medium" : "text-dash-muted"}`}>{ph}</p>
                </div>
              ))}
            </div>
          </Card></div>
        </TabsContent>

        <TabsContent value="faze" className="mt-6 space-y-3">
          {PHASES.map((ph, i) => (
            <div key={ph} className="bg-dash-card rounded-2xl p-5 border border-dash-border flex justify-between items-center">
              <p className="font-serif text-xl">{i + 1}. {ph}</p>
              <span className="text-sm text-dash-muted">{i < phaseIdx ? "Završeno" : i === phaseIdx ? "U tijeku" : "Čeka"}</span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="troškovnik" className="mt-6">
          {!full ? <Empty text="Troškovnik još nije unesen." /> : (
            <div className="bg-dash-card rounded-2xl border border-dash-border overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead><tr className="border-b border-dash-border">{["Opis", "Količina", "Jedinična cijena", "Ukupno"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-dash-subtle font-medium">{h}</th>)}</tr></thead>
                <tbody>
                  {COSTS.map((c) => {
                    const sum = c.items.reduce((s, [, q, u]) => s + (parseFloat(q) || 1) * u, 0);
                    return [
                      <tr key={c.cat}><td colSpan={4} className="px-5 pt-5 pb-2 font-serif text-lg">{c.cat}</td></tr>,
                      ...c.items.map(([d, q, u]) => <tr key={d} className="border-b border-dash-soft"><td className="px-5 py-3">{d}</td><td className="px-5 py-3">{q}</td><td className="px-5 py-3">{eur(u)} €</td><td className="px-5 py-3">{eur((parseFloat(q) || 1) * u)} €</td></tr>),
                      <tr key={c.cat + "s"}><td colSpan={3} className="px-5 py-3 text-right text-dash-muted">Ukupno {c.cat.toLowerCase()}</td><td className="px-5 py-3 font-medium">{eur(sum)} €</td></tr>,
                    ];
                  })}
                  <tr className="border-t border-dash-border"><td colSpan={3} className="px-5 py-2 text-right text-dash-muted">Ukupno bez PDV-a</td><td className="px-5 py-2">{eur(subtotal)} €</td></tr>
                  <tr><td colSpan={3} className="px-5 py-2 text-right text-dash-muted">PDV 25%</td><td className="px-5 py-2">{eur(subtotal * 0.25)} €</td></tr>
                  <tr><td colSpan={3} className="px-5 py-4 text-right font-medium">Ukupno s PDV-om</td><td className="px-5 py-4 font-serif text-xl">{eur(subtotal * 1.25)} €</td></tr>
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ponude" className="mt-6">
          {ponude.length === 0 ? <Empty text="Nema ponuda za ovaj projekt." /> : ponude.map((o) => (
            <div key={o.id} className="bg-dash-card rounded-2xl p-5 border border-dash-border flex justify-between mb-3"><span>{o.code} · {o.title}</span><span className="font-serif">{eur(o.amount)} € · {o.status}</span></div>
          ))}
        </TabsContent>
        <TabsContent value="dokumenti" className="mt-6"><Empty text="Dokumenti još nisu dodani." /></TabsContent>
        <TabsContent value="poruke" className="mt-6">
          {msgs.length === 0 ? <Empty text="Nema poruka s klijentom." /> : msgs.map((m) => (
            <div key={m.id} className="bg-dash-card rounded-2xl p-5 border border-dash-border mb-3">
              <div className="flex justify-between mb-1"><p className="font-medium">{m.sender_name}</p><p className="text-xs text-dash-subtle">{timeAgo(m.created_at)}</p></div>
              <p className="text-sm text-dash-muted">{m.text}</p>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="fotografije" className="mt-6"><Empty text="Fotografije s gradilišta još nisu dodane." /></TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjektDetalji;
