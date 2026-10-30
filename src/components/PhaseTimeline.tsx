import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { phaseProgress } from "@/lib/projects";
import type { ProjectPhase, ProjectTask } from "@/lib/projects";

/**
 * Vertikalni timeline faza za klijentski pregled:
 * završeno = puni krug s kvačicom, u tijeku = terakota krug s postotkom, planirano = prazan krug.
 */
const PhaseTimeline = ({ phases, tasks }: { phases: ProjectPhase[]; tasks: ProjectTask[] }) => (
  <ol className="relative border-l-2 border-dash-border-soft ml-3 space-y-8">
    {phases.map(phase => {
      const done = phase.status === "zavrseno";
      const current = phase.status === "u_tijeku";
      const progress = phaseProgress(tasks, phase.id);
      return (
        <li key={phase.id} className="relative pl-8">
          <span className={cn(
            "absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center",
            done && "bg-dash-ink text-dash-card",
            current && "border-2 border-primary bg-dash-card",
            !done && !current && "border-2 border-dash-border bg-dash-card",
          )}>
            {done && <Check size={14} />}
            {current && <span className="w-2 h-2 rounded-full bg-primary" />}
          </span>
          <p className="font-serif text-xl break-words">{phase.phase_order}. {phase.name}</p>
          <p className="text-sm text-dash-subtle font-dashboard mt-1">
            {current ? `U tijeku · ${progress}%` : done ? "Završeno" : "Planirano"}
            {phase.end_date && ` · do ${new Date(phase.end_date).toLocaleDateString("hr-HR")}`}
          </p>
        </li>
      );
    })}
  </ol>
);

export default PhaseTimeline;
