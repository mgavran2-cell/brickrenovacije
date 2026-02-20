import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import ActivityItem from "@/components/dashboard/ActivityItem";
import { useAuth } from "@/hooks/useAuth";
import {
  FolderKanban,
  FileText,
  Receipt,
  HardHat,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockProjects = [
  {
    title: "Renovacija kupaonice",
    location: "Zagreb, Trešnjevka",
    status: "active" as const,
    progress: 65,
    startDate: "15.01.2026",
    type: "Kupaonica · Kompletna renovacija",
  },
  {
    title: "Uređenje dnevnog boravka",
    location: "Zagreb, Maksimir",
    status: "planned" as const,
    progress: 10,
    startDate: "01.03.2026",
    type: "Dnevni boravak · Parcijalna renovacija",
  },
  {
    title: "Obnova kuhinje",
    location: "Split, Firule",
    status: "completed" as const,
    progress: 100,
    startDate: "10.11.2025",
    type: "Kuhinja · Kompletna renovacija",
  },
];

const mockActivity = [
  { icon: HardHat, title: "Radovi u tijeku", description: "Postavljanje keramičkih pločica u kupaonici", time: "Danas" },
  { icon: FileText, title: "Nova ponuda", description: "Ponuda za uređenje dnevnog boravka je spremna", time: "Jučer" },
  { icon: CheckCircle2, title: "Faza završena", description: "Demontaža stare opreme – kupaonica", time: "Prije 3 dana" },
  { icon: Receipt, title: "Račun izdan", description: "Avansni račun #2026-003 za kupaonicu", time: "Prije 5 dana" },
];

const DashboardHome = () => {
  const { session } = useAuth();
  const firstName = session?.user?.user_metadata?.full_name?.split(" ")[0] 
    ?? session?.user?.email?.split("@")[0] 
    ?? "Korisnik";

  return (
    <div className="px-6 lg:px-8 py-8 space-y-8 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Aktivni projekti" value={1} subtitle="1 u tijeku" icon={FolderKanban} />
        <StatCard title="Ponude" value={3} subtitle="1 čeka odobrenje" icon={FileText} />
        <StatCard title="Računi" value={5} subtitle="Sve plaćeno" icon={Receipt} />
        <StatCard title="Sljedeći korak" value="Pločice" subtitle="Očekivano do petka" icon={Clock} />
      </div>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Vaši projekti</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Prikaži sve →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProjects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </section>

      {/* Activity */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Nedavna aktivnost</h2>
        <div className="rounded-2xl bg-card border border-border/50 px-5 divide-y divide-border/50">
          {mockActivity.map((a, i) => (
            <ActivityItem key={i} {...a} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
