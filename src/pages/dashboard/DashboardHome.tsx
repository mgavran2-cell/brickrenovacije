import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { PhaseList } from "@/components/ProjectVisuals";
import { statusLabel } from "@/components/admin/StatusBadge";
import { daysUntil, phaseName } from "@/lib/projects";
import { eur, timeAgo } from "@/lib/adminFormat";

const DashboardHome = () => {
  const { session } = useAuth(); const navigate = useNavigate();
  const { project, phases, loading, error } = useProject(undefined, true);
  const [name, setName] = useState(""); const [messages, setMessages] = useState<Tables<"poruke">[]>([]);
  useEffect(() => {
    const uid = session?.user.id; if (!uid) return;
    let live = true;
    Promise.all([supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle(), supabase.from("poruke").select("*").eq("receiver_id",uid).order("created_at", { ascending:false }).limit(3)]).then(([p,m]) => { if(live) { setName(p.data?.full_name || session.user.email?.split("@")[0] || ""); setMessages(m.data ?? []); } });
    return () => { live = false; };
  }, [session?.user.id]);
  if (loading) return <PageSkeleton />;
  const next = phases.find(p => p.status === "planirano"); const days = daysUntil(project?.end_date ?? null);
  const stats = [
    ["Status projekta", project ? statusLabel(project.status) : "Čeka procjenu", project?.title || "Nakon procjene"],
    ["Sljedeća faza", next?.name || "—", next?.end_date ? new Date(next.end_date).toLocaleDateString("hr-HR") : "Nakon trenutne faze"],
    ["Ukupna cijena", project?.total_price == null ? "—" : `${eur(project.total_price)} €`, "Prema ponudi"],
    ["Dani do predaje", days == null ? "—" : String(days), project?.end_date ? new Date(project.end_date).toLocaleDateString("hr-HR") : "Nakon ugovora"],
  ];
  return <div className="max-w-5xl p-6 md:p-10 bg-dash-bg">
    <p className="text-sm text-dash-subtle mb-2">{new Date().toLocaleDateString("hr-HR", { weekday:"long", day:"numeric",month:"long",year:"numeric" })}</p>
    <h1 className="text-4xl md:text-5xl font-serif mb-4">Dobar dan{name ? `, ${name.split(" ")[0]}` : ""} 👋</h1>
    <p className="text-lg text-dash-muted mb-6">{error || (project ? `Vaš projekt ${project.title} je u fazi ${phaseName(project, phases)}. ${project.progress_percent ?? 0}% dovršeno.` : "Vaš projekt čeka procjenu.")}</p>
    <Button size="lg" className="mb-10" onClick={() => navigate("/dashboard/moj-projekt")}>Pogledaj projekt</Button>
    <div className="grid sm:grid-cols-2 gap-5 mb-10">{stats.map(([label,value,sub]) => <div key={label} className="bg-dash-card rounded-2xl border border-dash-border p-7 min-w-0"><p className="text-sm text-dash-subtle mb-3">{label}</p><p className="text-3xl font-serif break-words mb-2">{value}</p><p className="text-sm text-dash-muted">{sub}</p></div>)}</div>
    <section className="mb-10"><h2 className="text-2xl font-serif mb-5">Faze projekta</h2>{project ? <PhaseList phases={phases} /> : <p className="text-dash-subtle">Faze će se otključati nakon potvrde projekta.</p>}</section>
    <section className="mb-10"><div className="flex justify-between gap-3 mb-5"><h2 className="text-2xl font-serif">Poruke voditelja</h2><Link className="text-primary" to="/dashboard/poruke">Sve poruke</Link></div>{messages.length ? messages.map(m => <div key={m.id} className="py-4 border-b border-dash-border"><p className="font-medium">{m.sender_name}</p><p className="text-dash-muted mt-2">{m.text}</p><p className="text-xs text-dash-subtle mt-2">{timeAgo(m.created_at)}</p></div>) : <EmptyState icon={MessageSquare} title="Nema poruka" description="Javit će Vam se voditelj projekta." />}</section>
    <section><h2 className="text-2xl font-serif mb-5">Dokumenti za potpis</h2><EmptyState icon={FileText} title="Dokumenti" description="Dokumenti dolaze u sljedećem krugu." /></section>
  </div>;
};
export default DashboardHome;
