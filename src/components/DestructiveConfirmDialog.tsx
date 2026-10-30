import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DestructiveConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  requireText?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

/**
 * Dijalog za nepovratne radnje (DS-3): korisnik mora upisati
 * requireText (default "OBRIŠI") da bi se gumb za brisanje omogućio.
 */
const DestructiveConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  requireText = "OBRIŠI",
  confirmLabel = "Obriši",
  onConfirm,
}: DestructiveConfirmDialogProps) => {
  const [value, setValue] = useState("");
  const matches = value.trim() === requireText;

  const handleOpenChange = (next: boolean) => {
    if (!next) setValue("");
    onOpenChange(next);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-dash-card border border-dash-border rounded-2xl p-6 shadow-floating data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <DialogPrimitive.Title className="font-serif font-normal text-2xl text-dash-ink">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="font-dashboard text-dash-muted mt-2">
              {description}
            </DialogPrimitive.Description>
          )}
          <div className="mt-5">
            <label className="block font-dashboard text-sm text-dash-muted mb-2">
              Za potvrdu upišite <span className="font-semibold text-dash-ink">{requireText}</span>
            </label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={requireText}
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => handleOpenChange(false)}>
              Odustani
            </Button>
            <Button
              variant="destructive"
              disabled={!matches}
              onClick={() => {
                onConfirm();
                handleOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default DestructiveConfirmDialog;
