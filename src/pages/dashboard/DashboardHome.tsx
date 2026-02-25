import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import ActivityItem from "@/components/dashboard/ActivityItem";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  FolderKanban,
  FileText,
  Receipt,
  Clock,
  HardHat,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const iconMap: Record<string, any> = {
  HardHat, FileText, CheckCircle2, Receipt, Activity, Clock, FolderKanban,
};

const DashboardHome = () => {
  const { session } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [ponudeCount, setPonudeCount] = useState(0);
  const [pendingPonude, setPendingPonude] = useState(0);
  const [racuniCount, setRacuniCount] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    const uid = session.user.id;

    const fetchAll = async () => {
      const [projRes, ponRes, racRes, actRes] = await Promise.all([
        supabase.from("projects").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
        supabase.from("ponude").select("id, status").eq("user_id", uid),
        supabase.from("racuni").select("id").eq("user_id", uid),
        supabase.from("activity_log").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(5),
      ]);

      setProjects(projRes.data ?? []);
      const ponude = ponRes.data ?? [];
      setPonudeCount(ponude.length);
      setPendingPonude(ponude.filter(p => p.status === "pending").length);
      setRacuniCount((racRes.data ?? []).length);
      setActivities(actRes.data ?? []);
      setLoading(false);
    };

    fetchAll();
  }, [session?.user?.id]);

  const activeCount = projects.filter(p => p.status === "active").length;

  const formatDate = (d: string) => {
    try { return format(new Date(d), "dd.MM.yyyy"); } catch { return d; }
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Prije ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Prije ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `Prije ${days} dana`;
  };

  if (loading) {
    return (
      <div className="px-6 lg:px-8 py-8 space-y-8 max-w-6xl">
        <p className="text-muted-foreground">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-8 space-y-8 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Aktivni projekti" value={activeCount} subtitle={`${projects.length} ukupno`} icon={FolderKanban} />
        <StatCard title="Ponude" value={ponudeCount} subtitle={pendingPonude > 0 ? `${pendingPonude} čeka odobrenje` : "Sve riješeno"} icon={FileText} />
        <StatCard title="Računi" value={racuniCount} subtitle="Ukupno izdanih" icon={Receipt} />
        <StatCard title="Projekti" value={projects.length} subtitle={`${activeCount} u tijeku`} icon={Clock} />
      </div>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Vaši projekti</h2>
        </div>
        {projects.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
            <p className="text-muted-foreground">Nemate još projekata.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((p) => (
              <ProjectCard
                key={p.id}
                title={p.title}
                location={p.location ?? ""}
                status={p.status}
                progress={p.progress}
                startDate={p.start_date ? formatDate(p.start_date) : "—"}
                type={p.type ?? ""}
              />
            ))}
          </div>
        )}
      </section>

      {/* Activity */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Nedavna aktivnost</h2>
        {activities.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
            <p className="text-muted-foreground">Nema nedavnih aktivnosti.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border/50 px-5 divide-y divide-border/50">
            {activities.map((a) => (
              <ActivityItem
                key={a.id}
                icon={iconMap[a.icon_name] ?? Activity}
                title={a.title}
                description={a.description ?? ""}
                time={timeAgo(a.created_at)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardHome;
