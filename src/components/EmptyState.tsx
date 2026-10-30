import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

/**
 * Jedinstveno prazno stanje (DS-4) za stranice bez podataka:
 * nema projekata, nema poruka, nema upita...
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) => (
  <div className="border-2 border-dashed border-dash-border rounded-2xl p-10 text-center">
    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-dash-active flex items-center justify-center">
      <Icon className="w-6 h-6 text-dash-subtle" />
    </div>
    <h3 className="text-2xl font-serif font-normal mb-3">{title}</h3>
    <p className="text-dash-muted font-dashboard max-w-md mx-auto mb-6">{description}</p>
    {(actionLabel || secondaryActionLabel) && (
      <div className="flex gap-3 justify-center">
        {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
        {secondaryActionLabel && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    )}
  </div>
);

export default EmptyState;
