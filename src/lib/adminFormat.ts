export const eur = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("hr-HR", { maximumFractionDigits: 0 }).format(n);

export const initialsOf = (name: string) =>
  name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

export const formatShortDate = (d: string) =>
  new Date(d).toLocaleDateString("hr-HR", { day: "numeric", month: "short" });

export const formatDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" }) : "—";

export const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("hr-HR", { hour: "2-digit", minute: "2-digit" });

export const timeAgo = (d: string) => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return "upravo";
  if (m < 60) return `prije ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `prije ${h} h`;
  const days = Math.floor(h / 24);
  return days === 1 ? "jučer" : `prije ${days} dana`;
};

export const greetingFor = (hour: number) =>
  hour < 12 ? "Dobro jutro" : hour < 18 ? "Dobar dan" : "Dobra večer";
