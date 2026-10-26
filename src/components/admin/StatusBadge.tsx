import { cn } from "@/lib/utils";

const MAP: Record<string, { label: string; cls: string }> = {
  novi: { label: "Novi", cls: "bg-primary/15 text-primary" },
  novo: { label: "Nova prijava", cls: "bg-primary/15 text-primary" },
  procjena: { label: "Procjena", cls: "bg-primary/15 text-primary" },
  u_kontaktu: { label: "U kontaktu", cls: "bg-blue-100 text-blue-800" },
  u_razmatranju: { label: "U razmatranju", cls: "bg-blue-100 text-blue-800" },
  ugovor: { label: "Ugovor", cls: "bg-blue-100 text-blue-800" },
  sastanak: { label: "Sastanak", cls: "bg-amber-100 text-amber-800" },
  priprema: { label: "Priprema", cls: "bg-amber-100 text-amber-800" },
  prihvaceno: { label: "Prihvaćeno", cls: "bg-amber-100 text-amber-800" },
  izvodenje: { label: "Izvođenje", cls: "bg-primary text-primary-foreground" },
  active: { label: "Izvođenje", cls: "bg-primary text-primary-foreground" },
  predaja: { label: "Predaja", cls: "bg-green-100 text-green-800" },
  pretvoreno: { label: "Pretvoreno", cls: "bg-green-100 text-green-800" },
  odbijeno: { label: "Odbijeno", cls: "bg-dash-active text-dash-muted" },
  zavrseno: { label: "Završeno", cls: "bg-dash-active text-dash-muted" },
  completed: { label: "Završeno", cls: "bg-dash-active text-dash-muted" },
};

export const statusLabel = (s: string) => MAP[s]?.label ?? s;

const StatusBadge = ({ status }: { status: string }) => {
  const m = MAP[status] ?? { label: status, cls: "bg-dash-active text-dash-muted" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-dashboard whitespace-nowrap", m.cls)}>
      {m.label}
    </span>
  );
};

export default StatusBadge;
