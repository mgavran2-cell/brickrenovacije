import { Link } from "react-router-dom";

const DashboardPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6 md:p-10 bg-dash-bg min-h-screen">
    <h1 className="text-5xl font-serif font-normal mb-8">{title}</h1>
    <div className="bg-dash-card border border-dashed border-dash-line rounded-2xl p-10 text-center">
      <p className="text-dash-subtle font-dashboard">
        Ovaj ekran dolazi u sljedećem krugu. Za sada koristite{" "}
        <Link to="/dashboard" className="text-primary hover:underline">Pregled</Link> ili{" "}
        <Link to="/dashboard/moj-projekt" className="text-primary hover:underline">Moj projekt</Link>.
      </p>
    </div>
  </div>
);

export default DashboardPlaceholder;
