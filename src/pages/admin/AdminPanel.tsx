import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminPlaceholder } from "@/components/admin/AdminPage";
import AdminHome from "./AdminHome";
import Upiti from "./Upiti";
import KreirajProjekt from "./KreirajProjekt";
import ProjektiAdmin from "./ProjektiAdmin";
import ProjektDetalji from "./ProjektDetalji";
import Klijenti from "./Klijenti";
import IzvodaciAdmin from "./IzvodaciAdmin";

const AdminPanel = () => (
  <AdminLayout>
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="upiti" element={<Upiti />} />
      <Route path="upiti/:requestId/kreiraj-projekt" element={<KreirajProjekt />} />
      <Route path="projekti" element={<ProjektiAdmin />} />
      <Route path="projekti/:id" element={<ProjektDetalji />} />
      <Route path="klijenti" element={<Klijenti />} />
      <Route path="izvodaci" element={<IzvodaciAdmin />} />
      <Route path="ponude" element={<AdminPlaceholder title="Ponude" />} />
      <Route path="racuni" element={<AdminPlaceholder title="Računi" />} />
      <Route path="poruke" element={<AdminPlaceholder title="Poruke" />} />
      <Route path="analitika" element={<AdminPlaceholder title="Analitika" />} />
      <Route path="postavke" element={<AdminPlaceholder title="Postavke" />} />
    </Routes>
  </AdminLayout>
);

export default AdminPanel;
