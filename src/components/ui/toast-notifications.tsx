import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle, Info, X, type LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "warning" | "error" | "info";

const VARIANTS: Record<ToastVariant, { Icon: LucideIcon; iconCls: string }> = {
  success: { Icon: CheckCircle2, iconCls: "text-green-600" },
  warning: { Icon: AlertTriangle, iconCls: "text-amber-500" },
  error: { Icon: XCircle, iconCls: "text-destructive" },
  info: { Icon: Info, iconCls: "text-blue-600" },
};

interface ToastCardProps {
  id: string | number;
  variant: ToastVariant;
  title: string;
  description?: string;
}

const ToastCard = ({ id, variant, title, description }: ToastCardProps) => {
  const { Icon, iconCls } = VARIANTS[variant];
  return (
    <div className="flex items-start gap-3 w-full max-w-sm bg-dash-card border border-dash-border rounded-xl p-4 shadow-elevated">
      <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", iconCls)} />
      <div className="flex-1 min-w-0">
        <p className="font-dashboard font-semibold text-sm text-dash-ink">{title}</p>
        {description && (
          <p className="font-dashboard text-sm text-dash-muted mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => sonnerToast.dismiss(id)}
        className="shrink-0 text-dash-faint hover:text-dash-muted transition-colors"
        aria-label="Zatvori obavijest"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const show = (variant: ToastVariant, title: string, description?: string) =>
  sonnerToast.custom((id) => <ToastCard id={id} variant={variant} title={title} description={description} />, {
    duration: 3000,
  });

/**
 * Dizajn-sustav toast notifikacije (DS-3 Overlay).
 *
 * Primjeri:
 *   toast.success("Ponuda je poslana", "Ivana Kovač dobila je email s linkom za potpis.");
 *   toast.warning("Rok za potpis ističe sutra", "Aneks 1 još nije potpisan.");
 *   toast.error("Slanje nije uspjelo", "Provjerite vezu i pokušajte ponovno.");
 *   toast.info("Nova verzija troškovnika", "Marko je dodao 2 stavke u Dodatke.");
 */
export const toast = {
  success: (title: string, description?: string) => show("success", title, description),
  warning: (title: string, description?: string) => show("warning", title, description),
  error: (title: string, description?: string) => show("error", title, description),
  info: (title: string, description?: string) => show("info", title, description),
};

/**
 * Konfigurirani sonner Toaster: desktop bottom-right, mobile bottom-center.
 * Mountan jednom u App.tsx.
 */
export const ToastToaster = () => {
  const isMobile = useIsMobile();
  return (
    <SonnerToaster
      position={isMobile ? "bottom-center" : "bottom-right"}
      gap={8}
      visibleToasts={4}
    />
  );
};
