import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone, MapPin, Calendar } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const Admin = () => {
  const [requests, setRequests] = useState<Tables<"renovation_requests">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("renovation_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRequests(data);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 section-padding">
        <div className="container-narrow">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Administracija
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold">
              Zahtjevi za ponudu
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Pregled svih pristiglih zahtjeva za ponudu renovacije.
            </p>
          </div>
        </div>
      </section>

      {/* Requests Table */}
      <section className="section-padding pb-24">
        <div className="container-narrow">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                Još nema pristiglih zahtjeva.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Ukupno zahtjeva: <span className="font-semibold text-foreground">{requests.length}</span>
              </p>

              {/* Mobile Cards */}
              <div className="grid gap-4 md:hidden">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl bg-card border border-border/50 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground">{req.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {req.property_type}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> {req.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> {req.phone}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> {req.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(req.created_at)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="outline">{req.scope}</Badge>
                      <Badge variant="outline">{req.condition}</Badge>
                      <Badge variant="outline">{req.material}</Badge>
                      {req.sqm && <Badge variant="outline">{req.sqm} m²</Badge>}
                    </div>
                    {req.message && (
                      <p className="text-sm text-muted-foreground border-t border-border pt-3">
                        {req.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block rounded-2xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Datum</TableHead>
                      <TableHead>Ime</TableHead>
                      <TableHead>Kontakt</TableHead>
                      <TableHead>Lokacija</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead>Opseg</TableHead>
                      <TableHead>Stanje</TableHead>
                      <TableHead>Materijal</TableHead>
                      <TableHead>m²</TableHead>
                      <TableHead>Poruka</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(req.created_at)}
                        </TableCell>
                        <TableCell className="font-medium">{req.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-xs">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {req.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {req.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{req.location}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {req.property_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{req.scope}</TableCell>
                        <TableCell>{req.condition}</TableCell>
                        <TableCell>{req.material}</TableCell>
                        <TableCell>{req.sqm ?? "–"}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {req.message || "–"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
