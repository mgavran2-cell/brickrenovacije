import { useEffect, useState } from "react";
import { FileText, Download, Eye, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const statusConfig = {
  accepted: { label: "Prihvaćeno", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Čeka odobrenje", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
  rejected: { label: "Odbijeno", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
};

const Ponude = () => {
  const { session } = useAuth();
  const [ponude, setPonude] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    supabase
      .from("ponude")
      .select("*, projects(title)")
      .eq("user_id", session.user.id)
      .order("date", { ascending: false })
      .then(({ data }) => {
        setPonude(data ?? []);
        setLoading(false);
      });
  }, [session?.user?.id]);

  const formatAmount = (n: number) =>
    new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(n);

  const formatDate = (d: string) => {
    try { return format(new Date(d), "dd.MM.yyyy"); } catch { return d; }
  };

  if (loading) return <div className="px-6 lg:px-8 py-8"><p className="text-muted-foreground">Učitavanje...</p></div>;

  return (
    <div className="px-6 lg:px-8 py-8 max-w-6xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Ponude</h2>
        <p className="text-sm text-muted-foreground">Pregled svih ponuda za vaše projekte</p>
      </div>

      {ponude.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
          <p className="text-muted-foreground">Nemate još ponuda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ponude.map((ponuda) => {
            const status = statusConfig[ponuda.status as keyof typeof statusConfig] ?? statusConfig.pending;
            const StatusIcon = status.icon;
            const projectName = ponuda.projects?.title ?? "—";
            return (
              <div key={ponuda.id} className="rounded-2xl bg-card border border-border/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
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
                    {ponuda.code} · {projectName} · {formatDate(ponuda.date)}
                  </p>
                </div>
                <p className="text-sm font-bold text-foreground whitespace-nowrap">{formatAmount(ponuda.amount)}</p>
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
      )}
    </div>
  );
};

export default Ponude;
