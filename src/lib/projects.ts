import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type ProjectPhase = Tables<"project_phases">;
export type ProjectTask = Tables<"project_tasks">;
export type ProjectActivity = Tables<"project_activity_log">;
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
export const TASK_STATUSES = ["planirano", "u_tijeku", "blokirano", "zavrseno"] as const;
export const phaseTasks = (tasks: ProjectTask[], phaseId: string) => tasks.filter(t => t.phase_id === phaseId);
export const phaseProgress = (tasks: ProjectTask[], phaseId: string) => {
  const list = phaseTasks(tasks, phaseId);
  if (!list.length) return 0;
  return Math.round(list.reduce((sum, t) => sum + (t.progress_percent ?? 0), 0) / list.length);
};
export const activeTasks = (tasks: ProjectTask[]) =>
  tasks.filter(t => t.status === "u_tijeku" || t.status === "blokirano")
    .sort((a, b) => (a.status === b.status ? (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999") : a.status === "u_tijeku" ? -1 : 1))
    .slice(0, 5);
export const taskAssignee = (t: ProjectTask, team: { id: string; full_name: string }[] = []) =>
  t.assigned_to_text || team.find(m => m.id === t.assigned_to_user_id)?.full_name || "Tim Brick";

const HR_DAYS = ["NED", "PON", "UTO", "SRI", "ČET", "PET", "SUB"];
export interface DayPlan { dayShort: string; date: number; iso: string; tasks: ProjectTask[] }
export const next7Days = (tasks: ProjectTask[], today = new Date()): DayPlan[] =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { dayShort: HR_DAYS[d.getDay()], date: d.getDate(), iso, tasks: tasks.filter(t => t.due_date === iso && t.status !== "zavrseno") };
  });

export const formatActivity = (a: ProjectActivity) => {
  const m = (a.metadata ?? {}) as Record<string, string>;
  switch (a.action) {
    case "task_created": return `Zadatak „${m.name}” dodan${m.phase ? ` u fazu ${m.phase}` : ""}`;
    case "task_status_changed": return `Zadatak „${m.name}”: ${m.from} → ${m.to}`;
    case "task_completed": return `Zadatak „${m.name}” završen`;
    case "task_deleted": return `Zadatak „${m.name}” obrisan`;
    case "phase_started": return `Faza ${m.name} je u tijeku`;
    case "phase_completed": return `Faza ${m.name} završena`;
    case "project_status_changed": return `Status projekta: ${m.from} → ${m.to}`;
    default: return a.action;
  }
};
