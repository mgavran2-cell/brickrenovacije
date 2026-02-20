import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes, Route } from "react-router-dom";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardPonude from "@/pages/dashboard/Ponude";
import DashboardRacuni from "@/pages/dashboard/Racuni";
import DashboardPoruke from "@/pages/dashboard/Poruke";

const Dashboard = () => {
  const { session } = useAuth();
  const firstName = session?.user?.user_metadata?.full_name?.split(" ")[0]
    ?? session?.user?.email?.split("@")[0]
    ?? "Korisnik";

  return (
    <div className="flex min-h-screen bg-background w-full">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dobrodošli, {firstName} 👋</h1>
            <p className="text-sm text-muted-foreground">Evo pregleda vaših projekata i dokumenata.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Obavijesti</span>
          </Button>
        </header>

        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="ponude" element={<DashboardPonude />} />
          <Route path="racuni" element={<DashboardRacuni />} />
          <Route path="poruke" element={<DashboardPoruke />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
