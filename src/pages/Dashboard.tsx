import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Routes, Route } from "react-router-dom";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import MojProjekt from "@/pages/dashboard/MojProjekt";
import DashboardPonude from "@/pages/dashboard/Ponude";
import DashboardRacuni from "@/pages/dashboard/Racuni";
import DashboardPoruke from "@/pages/dashboard/Poruke";
import DashboardPostavke from "@/pages/dashboard/Postavke";

const Dashboard = () => (
  <div className="flex min-h-screen bg-dash-bg w-full font-dashboard">
    <DashboardSidebar />
    <main className="flex-1 overflow-y-auto">
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="moj-projekt" element={<MojProjekt />} />
        <Route path="ponude" element={<DashboardPonude />} />
        <Route path="racuni" element={<DashboardRacuni />} />
        <Route path="poruke" element={<DashboardPoruke />} />
        <Route path="postavke" element={<DashboardPostavke />} />
      </Routes>
    </main>
  </div>
);

export default Dashboard;
