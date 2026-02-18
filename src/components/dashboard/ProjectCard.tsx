import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar } from "lucide-react";

interface ProjectCardProps {
  title: string;
  location: string;
  status: "active" | "planned" | "completed";
  progress: number;
  startDate: string;
  type: string;
}

const statusMap = {
  active: { label: "U tijeku", variant: "default" as const },
  planned: { label: "Planirano", variant: "secondary" as const },
  completed: { label: "Završeno", variant: "outline" as const },
};

const ProjectCard = ({ title, location, status, progress, startDate, type }: ProjectCardProps) => {
  const s = statusMap[status];

  return (
    <div className="rounded-2xl bg-card border border-border/50 p-5 space-y-4 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{startDate}</span>
          </div>
        </div>
        <Badge variant={s.variant}>{s.label}</Badge>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{type}</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default ProjectCard;
