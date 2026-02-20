import { Receipt, Download, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockRacuni = [
  {
    id: "RAČ-2026-001",
    title: "Avansni račun – kupaonica",
    project: "Renovacija kupaonice",
    date: "18.01.2026",
    amount: "1.500,00 €",
    status: "paid" as const,
  },
  {
    id: "RAČ-2026-002",
    title: "Materijal – keramičke pločice",
    project: "Renovacija kupaonice",
    date: "25.01.2026",
    amount: "980,00 €",
    status: "paid" as const,
  },
  {
    id: "RAČ-2026-003",
    title: "Radovi – faza 1 (demontaža)",
    project: "Renovacija kupaonice",
    date: "01.02.2026",
    amount: "1.200,00 €",
    status: "paid" as const,
  },
  {
    id: "RAČ-2026-004",
    title: "Radovi – faza 2 (instalacije)",
    project: "Renovacija kupaonice",
    date: "15.02.2026",
    amount: "1.350,00 €",
    status: "pending" as const,
  },
  {
    id: "RAČ-2026-005",
    title: "Avansni račun – dnevni boravak",
    project: "Uređenje dnevnog boravka",
    date: "22.02.2026",
    amount: "900,00 €",
    status: "overdue" as const,
  },
];

const statusConfig = {
  paid: { label: "Plaćeno", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Čeka uplatu", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
  overdue: { label: "Dospjelo", icon: AlertCircle, className: "bg-red-100 text-red-700 border-red-200" },
};

const Racuni = () => {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-6xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Računi</h2>
        <p className="text-sm text-muted-foreground">Pregled svih izdanih računa</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-xs font-medium text-emerald-600">Plaćeno</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">3.680,00 €</p>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs font-medium text-amber-600">Čeka uplatu</p>
          <p className="text-xl font-bold text-amber-700 mt-1">1.350,00 €</p>
        </div>
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
          <p className="text-xs font-medium text-red-600">Dospjelo</p>
          <p className="text-xl font-bold text-red-700 mt-1">900,00 €</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {mockRacuni.map((racun) => {
          const status = statusConfig[racun.status];
          const StatusIcon = status.icon;
          return (
            <div
              key={racun.id}
              className="rounded-2xl bg-card border border-border/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground text-sm">{racun.title}</p>
                  <Badge variant="outline" className={status.className}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {racun.id} · {racun.project} · {racun.date}
                </p>
              </div>
              <p className="text-sm font-bold text-foreground whitespace-nowrap">{racun.amount}</p>
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

export default Racuni;
