import { Link } from "react-router-dom";

export const Breadcrumb = ({ items }: { items: { label: string; to?: string }[] }) => (
  <nav className="text-sm text-dash-subtle mb-4 font-dashboard">
    {items.map((it, i) => (
      <span key={i}>
        {i > 0 && " / "}
        {it.to ? <Link to={it.to} className="hover:text-foreground">{it.label}</Link> : <span>{it.label}</span>}
      </span>
    ))}
  </nav>
);

export const PillTabs = ({ tabs, value, onChange }: { tabs: { key: string; label: string; count?: number }[]; value: string; onChange: (k: string) => void }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {tabs.map((s) => (
      <button
        key={s.key}
        onClick={() => onChange(s.key)}
        className={
          "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium font-dashboard transition-all " +
          (value === s.key ? "bg-foreground text-background" : "bg-dash-card border border-dash-border hover:border-dash-faint")
        }
      >
        {s.label} {s.count != null && <span className="opacity-70">{s.count}</span>}
      </button>
    ))}
  </div>
);

export const SampleNote = () => (
  <p className="text-xs text-dash-subtle font-dashboard mb-4">Prikazani su primjer podaci dok u bazi nema stvarnih zapisa.</p>
);

export const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6 md:p-10 max-w-6xl">
    <Breadcrumb items={[{ label: "Pregled", to: "/admin" }, { label: title }]} />
    <h1 className="text-5xl font-serif font-normal mb-8">{title}</h1>
    <div className="bg-dash-card border border-dashed border-dash-line rounded-2xl p-10 text-center">
      <p className="text-dash-subtle font-dashboard">
        Ovaj modul dolazi u sljedećem krugu razvoja. Za sad koristite Pregled, Upiti, Projekti, Klijenti ili Izvođači.
      </p>
      <Link to="/admin" className="inline-block mt-4 text-primary hover:underline font-dashboard">Pregled →</Link>
    </div>
  </div>
);
