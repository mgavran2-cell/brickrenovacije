import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type ProjectPhase = Tables<"project_phases">;
export const DEFAULT_PHASES = ["Procjena", "Ugovor", "Priprema", "Izvođenje", "Predaja"];
export const phaseName = (project: Project, phases: ProjectPhase[]) => phases.find(p => p.status === "u_tijeku")?.name ?? phases.find(p => p.phase_order === project.current_phase)?.name ?? "—";
export const daysUntil = (date: string | null, today = new Date()) => {
  if (!date) return null;
  const current = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((new Date(`${date}T00:00:00Z`).getTime() - current) / 86400000);
};
export const projectPlace = (p: Project) => [p.address, p.neighborhood, p.city].filter(Boolean).join(" · ") || "—";
export const validateProject = (title: string, manager: string, start: string, end: string, price: string, phases: { name: string }[]) => {
  if (!title.trim()) return "Unesite naziv projekta.";
  if (!manager) return "Odaberite voditelja projekta.";
  if (start && end && end < start) return "Predaja ne može biti prije početka.";
  if (price && (!Number.isFinite(Number(price)) || Number(price) < 0)) return "Cijena mora biti pozitivan broj ili nula.";
  if (!phases.length || phases.some(p => !p.name.trim())) return "Unesite barem jednu fazu i naziv svake faze.";
  return null;
};