import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const StatCard = ({ title, value, subtitle, icon: Icon, className }: StatCardProps) => (
  <div className={cn("rounded-2xl bg-card border border-border/50 p-6 space-y-3", className)}>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent-foreground" />
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default StatCard;
