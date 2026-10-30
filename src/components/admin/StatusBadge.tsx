import { cn } from "@/lib/utils";

type BadgeVariant = "soft" | "solid" | "dot";

interface StatusStyle {
  label: string;
  soft: string;
  solid: string;
  dotText: string;
  dotColor: string;
}

const style = (
  label: string,
  soft: string,
  solid: string,
  dotText: string,
  dotColor: string,
): StatusStyle => ({ label, soft, solid, dotText, dotColor });

const PRIMARY = style(
  "Novi",
  "bg-primary/15 text-primary",
  "bg-primary text-primary-foreground",
  "text-primary",
  "bg-primary",
);
const BLUE = (label: string, soft: string) =>
  style(label, soft, "bg-blue-600 text-white", "text-blue-800", "bg-blue-500");
const AMBER = (label: string, soft: string) =>
  style(label, soft, "bg-amber-500 text-white", "text-amber-800", "bg-amber-500");
const RED = (label: string) =>
  style(label, "bg-destructive/10 text-destructive", "bg-destructive text-destructive-foreground", "text-destructive", "bg-destructive");
const NEUTRAL = (label: string) =>
  style(label, "bg-dash-soft text-dash-ink", "bg-dash-ink text-dash-card", "text-dash-muted", "bg-dash-muted");
const GREEN = (label: string) =>
  style(label, "bg-green-100 text-green-800", "bg-green-600 text-white", "text-green-800", "bg-green-500");

// Sve varijante iz dizajn sustava (DS-5 Podaci) + postojeći statusi u sustavu.
const MAP: Record<string, StatusStyle> = {
  planirano: NEUTRAL("Planirano"),
  u_tijeku: { ...PRIMARY, label: "U tijeku" },
  blokirano: RED("Blokirano"),
  draft: NEUTRAL("Draft"),
  // DS-5 varijante
  procjena: BLUE("Procjena", "bg-blue-50 text-blue-800"),
  ugovor: BLUE("Ugovor", "bg-blue-100 text-blue-800"),
  priprema: AMBER("Priprema", "bg-amber-50 text-amber-800"),
  izvodenje: { ...PRIMARY, label: "Izvođenje" },
  predaja: AMBER("Predaja", "bg-amber-100 text-amber-900"),
  zavrseno: NEUTRAL("Završeno"),
  novi: PRIMARY,
  odbijeno: RED("Odbijeno"),
  ceka_potpis: AMBER("Čeka potpis", "bg-amber-50 text-amber-800"),
  kasnjenje: RED("Kašnjenje"),
  // Postojeći statusi (admin, izvođači, upiti)
  novo: { ...PRIMARY, label: "Nova prijava" },
  u_kontaktu: BLUE("U kontaktu", "bg-blue-100 text-blue-800"),
  u_razmatranju: BLUE("U razmatranju", "bg-blue-100 text-blue-800"),
  sastanak: AMBER("Sastanak", "bg-amber-100 text-amber-800"),
  prihvaceno: AMBER("Prihvaćeno", "bg-amber-100 text-amber-800"),
  active: { ...PRIMARY, label: "Izvođenje" },
  pretvoreno: GREEN("Pretvoreno"),
  completed: NEUTRAL("Završeno"),
};

const FALLBACK = NEUTRAL("");

export const statusLabel = (s: string) => MAP[s]?.label ?? s;

interface StatusBadgeProps {
  status: string;
  /** soft (default) = tintirana pozadina, solid = inverzna shema, dot = točka + tekst */
  variant?: BadgeVariant;
}

const StatusBadge = ({ status, variant = "soft" }: StatusBadgeProps) => {
  const m = MAP[status] ?? { ...FALLBACK, label: status };

  if (variant === "dot") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium font-dashboard whitespace-nowrap", m.dotText)}>
        <span className={cn("w-2 h-2 rounded-full", m.dotColor)} />
        {m.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-dashboard whitespace-nowrap",
        variant === "solid" ? m.solid : m.soft,
      )}
    >
      {m.label}
    </span>
  );
};

export default StatusBadge;
