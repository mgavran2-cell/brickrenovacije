import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAdminRequests, useAdminProjects } from "@/hooks/useAdminData";
import { eur, greetingFor, initialsOf, timeAgo } from "@/lib/adminFormat";

type Msg = { id: string; sender_name: string; text: string; created_at: string };

const AdminHome = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [ponude, setPonude] = useState<{ title: string; amount: number }[]>([]);
  const [revenue, setRevenue] = useState<{ now: number; prev: number }>({ now: 0, prev: 0 });
  const [messages, setMessages] = useState<Msg[]>([]);
  const [noRealProjects, setNoRealProjects] = useState(false);

  useEffect(() => {
    supabase.from("projects").select("id", { count: "exact", head: true }).then(({ count }) => setNoRealProjects(count === 0));
  }, []);
  const { rows: requests } = useAdminRequests();
  const { rows: projects } = useAdminProjects();

  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    (async () => {
      const now = new Date();
      const m0 = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const m1 = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const [prof, pon, rac, msg] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle(),
        supabase.from("ponude").select("title, amount, status").in("status", ["waiting", "pending", "na_cekanju", "poslano"]).order("created_at", { ascending: false }),
        supabase.from("racuni").select("amount, date, status").gte("date", m1),
        supabase.from("poruke").select("id, sender_name, text, created_at").neq("sender_id", uid).order("created_at", { ascending: false }).limit(3),
      ]);
      setFirstName((prof.data?.full_name || session.user.email || "").split(/[\s@]/)[0]);
      setPonude(pon.data ?? []);
      const r = rac.data ?? [];
      setRevenue({ now: r.filter((x) => x.date >= m0.slice(0, 10)).reduce((s, x) => s + Number(x.amount), 0), prev: r.filter((x) => x.date < m0.slice(0, 10)).reduce((s, x) => s + Number(x.amount), 0) });
      setMessages(msg.data ?? []);
    })();
  }, [session?.user?.id]);

  const now = new Date();
  const formattedDate = now.toLocaleDateString("hr-HR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const novi = requests.filter((r) => r.status === "novi");
  const active = projects.filter((p) => ["izvodenje", "active"].includes(p.status));
  const withEnd = projects.filter((p) => p.end_date && p.status !== "zavrseno").map((p) => ({ p, d: Math.ceil((new Date(p.end_date!).getTime() - Date.now()) / 86400000) })).filter((x) => x.d >= 0).sort((a, b) => a.d - b.d);
  const critical = withEnd[0];
  const pct = revenue.prev ? Math.round(((revenue.now - revenue.prev) / revenue.prev) * 100) : null;

  const cards = [
    { label: "Novi upiti", value: String(novi.length), actionText: "Odgovorite danas", url: "/admin/upiti?status=novi", detail: novi.slice(0, 3).map((r) => r.name).join(", ") || "Nema novih upita" },
    { label: "Ponude čekaju", value: String(ponude.length), actionText: "Potpisi", url: "/admin/ponude", detail: ponude.slice(0, 2).map((p) => `${p.title} ${eur(p.amount)} €`).join(" · ") || "Nema podataka" },
    { label: "Dani do predaje", value: critical ? String(critical.d) : "—", actionText: "Projekt", url: critical ? `/admin/projekti/${critical.p.id}` : "/admin/projekti", detail: critical ? `${critical.p.title} · ${critical.p.client_name}` : "Nema podataka" },
    { label: "Prihod ovaj mjesec", value: `${eur(revenue.now)} €`, actionText: "Analitika", url: "/admin/analitika", detail: pct == null ? "Nema podataka za prošli mjesec" : `${pct > 0 ? "+" : ""}${pct}% vs prošli mjesec` },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <p className="text-sm text-dash-subtle mb-2 first-letter:uppercase">{formattedDate}</p>
      <h1 className="text-4xl md:text-5xl font-serif font-normal mb-4">{greetingFor(now.getHours())}{firstName && `, ${firstName}`} <span>☕</span></h1>
      <p className="text-lg text-dash-muted max-w-3xl mb-6">
        Danas imate {novi.length} novih upita, {ponude.length} ponude čekaju potpis i 0 sastanka.
      </p>
      <div className="flex flex-wrap gap-3 mb-10">
        <Button variant="outline" size="lg" onClick={() => navigate("/admin/upiti")}>Otvori upite</Button>
        <Button size="lg" onClick={() => navigate("/admin/ponude")}>Nova ponuda</Button>
      </div>

      {noRealProjects && (
        <div className="bg-dash-active border border-dash-border rounded-xl px-5 py-4 mb-10 flex items-start gap-3">
          <Info className="w-5 h-5 text-dash-subtle shrink-0 mt-0.5" />
          <div className="text-sm text-dash-muted">
            <strong className="font-medium">Prikaz s probnim podacima.</strong> Projekti i podaci "danas na gradilištima" su primjeri za demo. Čim kreirate prvi pravi projekt, zamijenit će se stvarnim podacima.
          </div>
        </div>
      )}

      <h2 className="text-3xl font-serif font-normal mb-6">Hitne akcije</h2>
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-dash-card rounded-2xl p-7 border border-dash-border">
            <div className="flex justify-between items-start mb-4 gap-3">
              <p className="text-sm text-dash-subtle">{c.label}</p>
              <Link to={c.url} className="text-sm text-primary font-serif hover:underline whitespace-nowrap">{c.actionText} →</Link>
            </div>
            <p className="text-5xl font-serif font-normal mb-3">{c.value}</p>
            <p className="text-sm text-dash-muted">{c.detail}</p>
          </div>
        ))}
      </div>

      <section className="bg-dash-card rounded-2xl p-6 md:p-8 border border-dash-border mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-normal">Danas na gradilištima</h2>
          <Link to="/admin/projekti" className="text-sm text-primary font-serif hover:underline">Svi projekti</Link>
        </div>
        {active.length === 0 ? <p className="text-dash-subtle">Danas nema aktivnih projekata na gradilištu.</p> : active.map((p) => (
          <div key={p.id} className="py-5 border-b border-dash-soft last:border-0">
            <div className="flex justify-between mb-2 gap-3">
              <h3 className="text-xl font-serif font-normal">{p.client_name} · {p.location}</h3>
              <span className="text-sm text-dash-subtle whitespace-nowrap">{p.work_hours}</span>
            </div>
            <p className="text-sm text-dash-muted mb-3">{p.title}, {p.address}</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="font-medium">{p.current_task}</p>
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                {p.teams.map((t) => <span key={t.name} className="bg-dash-active rounded-full px-3 py-1 text-xs">{t.name} · {t.workers} radnika</span>)}
              </div>
              <span className="text-sm text-dash-subtle">{p.progress}% dovršeno</span>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-dash-card rounded-2xl p-6 md:p-8 border border-dash-border mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-normal">Zadnji upiti</h2>
          <Link to="/admin/upiti" className="text-sm text-primary font-serif hover:underline">Svi upiti</Link>
        </div>
        {requests.slice(0, 5).map((r) => (
          <div key={r.id} className="py-5 border-b border-dash-soft last:border-0 grid md:grid-cols-[1fr_auto_auto] gap-4 md:gap-6 items-start">
            <div>
              <div className="flex items-center gap-3 mb-1"><h3 className="text-xl font-serif font-normal">{r.name}</h3><StatusBadge status={r.status} /></div>
              <p className="text-sm text-dash-muted mb-3">{r.location} · {r.property_type}{r.sqm ? ` · ${r.sqm} m²` : ""}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild><a href={`tel:${r.phone}`}>Nazovi</a></Button>
                <Button size="sm" asChild><a href={`mailto:${r.email}`}>Pošalji email</a></Button>
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-dash-subtle mb-1">Procjena</p>
              <p className="font-medium">{r.estimated_range || "—"}</p>
            </div>
            <p className="text-sm text-dash-subtle">{timeAgo(r.created_at)}</p>
          </div>
        ))}
      </section>

      <section className="bg-dash-card rounded-2xl p-6 md:p-8 border border-dash-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-normal">Poruke klijenata</h2>
          <span className="text-sm text-dash-subtle">{messages.length} neriješene</span>
        </div>
        {messages.length === 0 ? <p className="text-dash-subtle">Nema novih poruka.</p> : messages.map((m) => (
          <div key={m.id} className="flex gap-4 py-5 border-b border-dash-soft last:border-0">
            <div className="w-10 h-10 rounded-full bg-dash-active flex items-center justify-center text-xs font-medium text-dash-muted shrink-0">{initialsOf(m.sender_name)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">{m.sender_name}</p>
                <p className="text-xs text-dash-subtle">{timeAgo(m.created_at)}</p>
              </div>
              <p className="text-sm text-dash-muted leading-relaxed mt-2">{m.text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminHome;
