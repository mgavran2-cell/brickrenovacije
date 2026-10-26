import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PHASES = ["Procjena", "Ugovor", "Priprema", "Izvođenje", "Predaja"];

const DOCUMENTS = [
  { title: "Ugovor o izvođenju radova", meta: "PDF · 4 str. · poslano 20. listopada", status: "pending" },
  { title: "Troškovnik — revizija 2", meta: "PDF · 2 str. · poslano 22. listopada", status: "review" },
  { title: "Ponuda br. 2026-014", meta: "PDF · 3 str. · potpisano 2. listopada", status: "signed" },
];

const formatDate = (d: Date) => {
  const s = new Intl.DateTimeFormat("hr-HR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const timeAgo = (d: string) => {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 60) return `prije ${Math.max(mins, 1)} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `prije ${hrs} h`;
  return `prije ${Math.floor(hrs / 24)} d`;
};

const initialsOf = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const statusLabel: Record<string, string> = {
  pending: "Čeka procjenu",
  active: "U izvođenju",
  completed: "Završeno",
};

const DashboardHome = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [project, setProject] = useState<any | null>(null);
  const [latestActivity, setLatestActivity] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    (async () => {
      const [prof, proj, act, msg] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle(),
        supabase.from("projects").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(1),
        supabase.from("activity_log").select("title, description").eq("user_id", uid).order("created_at", { ascending: false }).limit(1),
        supabase.from("poruke").select("*").or(`receiver_id.eq.${uid},sender_id.eq.${uid}`).order("created_at", { ascending: false }).limit(3),
      ]);
      setFullName(prof.data?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "");
      setProject(proj.data?.[0] ?? null);
      const a = act.data?.[0];
      setLatestActivity(a ? a.description || a.title : null);
      setMessages(msg.data ?? []);
    })();
  }, [session?.user?.id]);

  const firstName = fullName.split(" ")[0];
  const progress = project?.progress ?? 0;
  const currentPhase = !project ? -1 : project.status === "completed" ? 5 : project.status === "active" ? 3 : 0;

  const stats = project
    ? [
        { label: "Status projekta", value: statusLabel[project.status] ?? project.status, sub: project.title },
        { label: "Sljedeća faza", value: PHASES[Math.min(currentPhase + 1, 4)], sub: currentPhase < 5 ? "Nakon trenutne faze" : "Projekt predan" },
        { label: "Dovršenost", value: `${progress}%`, sub: project.type ?? "Renovacija" },
        { label: "Početak radova", value: project.start_date ? new Date(project.start_date).toLocaleDateString("hr-HR", { day: "numeric", month: "short" }) : "—", sub: project.location ?? "Lokacija nije unesena" },
      ]
    : [
        { label: "Status projekta", value: "Čeka procjenu", sub: "Javit ćemo se u roku 48h" },
        { label: "Sljedeća faza", value: "—", sub: "Nakon procjene" },
        { label: "Ukupna cijena", value: "—", sub: "Nakon ponude" },
        { label: "Dani do predaje", value: "—", sub: "Nakon ugovora" },
      ];

  const pendingDocs = DOCUMENTS.filter((d) => d.status !== "signed").length;

  return (
    <div className="max-w-5xl p-6 md:p-10 bg-dash-bg">
      {/* Hero */}
      <div className="mb-10">
        <p className="text-sm text-dash-subtle mb-2 font-dashboard">{formatDate(new Date())}</p>
        <h1 className="text-4xl md:text-5xl font-serif font-normal mb-4">
          Dobar dan{firstName ? `, ${firstName}` : ""} <span className="inline-block">👋</span>
        </h1>
        <p className="text-lg text-dash-muted max-w-2xl mb-6 font-dashboard">
          {latestActivity ?? "Vaš projekt je u tijeku. Pogledajte detalje."}
        </p>
        <Button size="lg" onClick={() => navigate("/dashboard/moj-projekt")}>Pogledaj projekt</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-dash-card rounded-2xl p-7 border border-dash-border">
            <p className="text-sm text-dash-subtle mb-3 font-dashboard">{s.label}</p>
            <p className="text-4xl font-serif font-normal mb-2">{s.value}</p>
            <p className="text-sm text-dash-muted font-dashboard">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Phases */}
      <div className="bg-dash-card rounded-2xl p-8 border border-dash-border mb-10">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-serif font-normal">Faze projekta</h2>
          {project && <span className="text-sm text-dash-subtle font-dashboard">Faza {Math.min(currentPhase + 1, 5)} od 5</span>}
        </div>
        <div className="flex items-start overflow-x-auto">
          {PHASES.map((name, i) => {
            const done = i < currentPhase;
            const current = i === currentPhase;
            return (
              <div key={name} className="flex-1 min-w-[96px]">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      done && "bg-dash-ink text-primary-foreground",
                      current && "bg-dash-card border-2 border-primary",
                      !done && !current && "bg-dash-card border border-dash-line"
                    )}
                  >
                    {done && <Check className="w-4 h-4" />}
                    {current && <span className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                  {i < PHASES.length - 1 && <div className={cn("h-px flex-1 mx-2", done ? "bg-dash-ink" : "bg-dash-line")} />}
                </div>
                <p className="text-base font-serif mt-3">{name}</p>
                {current && <p className="text-sm text-primary font-dashboard mt-0.5">U tijeku · {progress}%</p>}
              </div>
            );
          })}
        </div>
        {!project && (
          <p className="text-sm text-dash-subtle font-dashboard mt-6">Faze će se otključati nakon potvrde projekta.</p>
        )}
      </div>

      {/* Messages */}
      <div className="bg-dash-card rounded-2xl p-8 border border-dash-border mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-normal">Poruke voditelja</h2>
          <Link to="/dashboard/poruke" className="text-sm text-primary font-serif hover:underline">Sve poruke</Link>
        </div>
        {messages.length === 0 ? (
          <p className="text-sm text-dash-subtle font-dashboard">Nema poruka za sada. Javit će vam se voditelj projekta.</p>
        ) : (
          <div className="space-y-5">
            {messages.map((m) => (
              <div key={m.id} className="flex gap-4 pb-5 border-b border-dash-soft last:border-0">
                <div className="w-10 h-10 rounded-full bg-dash-ink text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                  {initialsOf(m.sender_name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground font-dashboard">{m.sender_name}</p>
                    <p className="text-xs text-dash-subtle font-dashboard">{timeAgo(m.created_at)}</p>
                  </div>
                  <p className="text-sm text-dash-muted font-dashboard leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents (sample until documents table exists) */}
      <div className="bg-dash-card rounded-2xl p-8 border border-dash-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-normal">Dokumenti za potpis</h2>
          <span className="text-sm text-dash-subtle font-dashboard">{pendingDocs} čeka</span>
        </div>
        <div className="space-y-4">
          {DOCUMENTS.map((d) => (
            <div key={d.title} className="flex items-center gap-4 py-3 border-b border-dash-soft last:border-0">
              <div className="w-12 h-14 rounded border border-dash-line flex items-center justify-center text-xs text-dash-subtle font-medium font-dashboard">PDF</div>
              <div className="flex-1">
                <p className="font-medium font-dashboard">{d.title}</p>
                <p className="text-sm text-dash-subtle font-dashboard">{d.meta}</p>
              </div>
              {d.status === "pending" && <Button size="sm">Potpiši</Button>}
              {d.status === "review" && <Button size="sm">Potvrdi</Button>}
              {d.status === "signed" && <span className="text-sm text-dash-subtle font-dashboard">✓ Potpisano</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
