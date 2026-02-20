import { FileText, Download, Eye, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockPonude = [
  {
    id: "PON-2026-001",
    title: "Kompletna renovacija kupaonice",
    project: "Renovacija kupaonice",
    date: "10.01.2026",
    amount: "4.500,00 €",
    status: "accepted" as const,
  },
  {
    id: "PON-2026-002",
    title: "Parcijalna renovacija dnevnog boravka",
    project: "Uređenje dnevnog boravka",
    date: "20.02.2026",
    amount: "2.800,00 €",
    status: "pending" as const,
  },
  {
    id: "PON-2026-003",
    title: "Dodatni radovi – kupaonica (ventilacija)",
    project: "Renovacija kupaonice",
    date: "05.02.2026",
    amount: "650,00 €",
    status: "accepted" as const,
  },
];

const statusConfig = {
  accepted: { label: "Prihvaćeno", icon: CheckCircle2, variant: "default" as const, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Čeka odobrenje", icon: Clock, variant: "secondary" as const, className: "bg-amber-100 text-amber-700 border-amber-200" },
  rejected: { label: "Odbijeno", icon: XCircle, variant: "destructive" as const, className: "bg-red-100 text-red-700 border-red-200" },
};

const Ponude = () => {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Ponude</h2>
          <p className="text-sm text-muted-foreground">Pregled svih ponuda za vaše projekte</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockPonude.map((ponuda) => {
          const status = statusConfig[ponuda.status];
          const StatusIcon = status.icon;
          return (
            <div
              key={ponuda.id}
              className="rounded-2xl bg-card border border-border/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground text-sm">{ponuda.title}</p>
                  <Badge variant="outline" className={status.className}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {ponuda.id} · {ponuda.project} · {ponuda.date}
                </p>
              </div>
              <p className="text-sm font-bold text-foreground whitespace-nowrap">{ponuda.amount}</p>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Eye className="w-4 h-4" /> Pregledaj
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="w-4 h-4" /> PDF
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ponude;
