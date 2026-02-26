import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Loader2,
  LogOut,
  Plus,
  FolderKanban,
  FileText,
  Receipt,
  MessageSquare,
  Users,
  Trash2,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

const Admin = () => {
  const { session, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [requests, setRequests] = useState<Tables<"renovation_requests">[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [ponude, setPonude] = useState<any[]>([]);
  const [racuni, setRacuni] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [ponudaDialogOpen, setPonudaDialogOpen] = useState(false);
  const [racunDialogOpen, setRacunDialogOpen] = useState(false);
  const [convoDialogOpen, setConvoDialogOpen] = useState(false);

  const fetchAll = async () => {
    const [reqRes, profRes, projRes, ponRes, racRes, conRes] = await Promise.all([
      supabase.from("renovation_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*, profiles(email, full_name)").order("created_at", { ascending: false }),
      supabase.from("ponude").select("*, profiles(email, full_name), projects(title)").order("created_at", { ascending: false }),
      supabase.from("racuni").select("*, profiles(email, full_name), projects(title)").order("created_at", { ascending: false }),
      supabase.from("conversations").select("*, profiles(email, full_name)").order("created_at", { ascending: false }),
    ]);
    setRequests(reqRes.data ?? []);
    setProfiles(profRes.data ?? []);
    setProjects(projRes.data ?? []);
    setPonude(ponRes.data ?? []);
    setRacuni(racRes.data ?? []);
    setConversations(conRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const formatDate = (d: string) => {
    try { return format(new Date(d), "dd.MM.yyyy"); } catch { return d; }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Nemate pristup</h1>
          <p className="text-muted-foreground">Ova stranica je dostupna samo administratorima.</p>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Odjava
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" /> Odjava
        </Button>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="requests" className="gap-1.5"><Mail className="w-4 h-4" /> Zahtjevi</TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5"><Users className="w-4 h-4" /> Korisnici</TabsTrigger>
            <TabsTrigger value="projects" className="gap-1.5"><FolderKanban className="w-4 h-4" /> Projekti</TabsTrigger>
            <TabsTrigger value="ponude" className="gap-1.5"><FileText className="w-4 h-4" /> Ponude</TabsTrigger>
            <TabsTrigger value="racuni" className="gap-1.5"><Receipt className="w-4 h-4" /> Računi</TabsTrigger>
            <TabsTrigger value="conversations" className="gap-1.5"><MessageSquare className="w-4 h-4" /> Razgovori</TabsTrigger>
          </TabsList>

          {/* REQUESTS TAB */}
          <TabsContent value="requests">
            <RequestsTab requests={requests} formatDate={formatDate} />
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Registrirani korisnici ({profiles.length})</h2>
              <div className="rounded-2xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Ime</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registriran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{formatDate(p.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Projekti ({projects.length})</h2>
                <CreateProjectDialog
                  open={projectDialogOpen}
                  onOpenChange={setProjectDialogOpen}
                  profiles={profiles}
                  onCreated={fetchAll}
                />
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Naslov</TableHead>
                      <TableHead>Klijent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Napredak</TableHead>
                      <TableHead>Lokacija</TableHead>
                      <TableHead>Početak</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell className="text-sm">{p.profiles?.full_name || p.profiles?.email || "—"}</TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                        <TableCell>{p.progress}%</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.location || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.start_date ? formatDate(p.start_date) : "—"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={async () => {
                            await supabase.from("projects").delete().eq("id", p.id);
                            toast.success("Projekt obrisan");
                            fetchAll();
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* PONUDE TAB */}
          <TabsContent value="ponude">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Ponude ({ponude.length})</h2>
                <CreatePonudaDialog
                  open={ponudaDialogOpen}
                  onOpenChange={setPonudaDialogOpen}
                  profiles={profiles}
                  projects={projects}
                  onCreated={fetchAll}
                />
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Šifra</TableHead>
                      <TableHead>Naslov</TableHead>
                      <TableHead>Klijent</TableHead>
                      <TableHead>Projekt</TableHead>
                      <TableHead>Iznos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ponude.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-sm">{p.code}</TableCell>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell className="text-sm">{p.profiles?.full_name || p.profiles?.email || "—"}</TableCell>
                        <TableCell className="text-sm">{p.projects?.title || "—"}</TableCell>
                        <TableCell className="font-bold">{Number(p.amount).toLocaleString("hr-HR")} €</TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(p.date)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={async () => {
                            await supabase.from("ponude").delete().eq("id", p.id);
                            toast.success("Ponuda obrisana");
                            fetchAll();
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* RACUNI TAB */}
          <TabsContent value="racuni">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Računi ({racuni.length})</h2>
                <CreateRacunDialog
                  open={racunDialogOpen}
                  onOpenChange={setRacunDialogOpen}
                  profiles={profiles}
                  projects={projects}
                  onCreated={fetchAll}
                />
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Šifra</TableHead>
                      <TableHead>Naslov</TableHead>
                      <TableHead>Klijent</TableHead>
                      <TableHead>Projekt</TableHead>
                      <TableHead>Iznos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {racuni.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-sm">{r.code}</TableCell>
                        <TableCell className="font-medium">{r.title}</TableCell>
                        <TableCell className="text-sm">{r.profiles?.full_name || r.profiles?.email || "—"}</TableCell>
                        <TableCell className="text-sm">{r.projects?.title || "—"}</TableCell>
                        <TableCell className="font-bold">{Number(r.amount).toLocaleString("hr-HR")} €</TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(r.date)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={async () => {
                            await supabase.from("racuni").delete().eq("id", r.id);
                            toast.success("Račun obrisan");
                            fetchAll();
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* CONVERSATIONS TAB */}
          <TabsContent value="conversations">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Razgovori ({conversations.length})</h2>
                <CreateConvoDialog
                  open={convoDialogOpen}
                  onOpenChange={setConvoDialogOpen}
                  profiles={profiles}
                  onCreated={fetchAll}
                />
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Naziv</TableHead>
                      <TableHead>Klijent</TableHead>
                      <TableHead>Kreirano</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversations.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-sm">{c.profiles?.full_name || c.profiles?.email || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(c.created_at)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={async () => {
                            await supabase.from("conversations").delete().eq("id", c.id);
                            toast.success("Razgovor obrisan");
                            fetchAll();
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Status badge helper
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "U tijeku", className: "bg-blue-100 text-blue-700 border-blue-200" },
    planned: { label: "Planirano", className: "bg-gray-100 text-gray-700 border-gray-200" },
    completed: { label: "Završeno", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    accepted: { label: "Prihvaćeno", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    pending: { label: "Na čekanju", className: "bg-amber-100 text-amber-700 border-amber-200" },
    rejected: { label: "Odbijeno", className: "bg-red-100 text-red-700 border-red-200" },
    paid: { label: "Plaćeno", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    overdue: { label: "Dospjelo", className: "bg-red-100 text-red-700 border-red-200" },
  };
  const s = map[status] ?? { label: status, className: "" };
  return <Badge variant="outline" className={s.className}>{s.label}</Badge>;
};

// Requests tab (original admin content)
const RequestsTab = ({ requests, formatDate }: { requests: Tables<"renovation_requests">[]; formatDate: (d: string) => string }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold">Zahtjevi za ponudu ({requests.length})</h2>
    {requests.length === 0 ? (
      <p className="text-muted-foreground py-8 text-center">Još nema pristiglih zahtjeva.</p>
    ) : (
      <div className="rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Datum</TableHead>
              <TableHead>Ime</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Lokacija</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Opseg</TableHead>
              <TableHead>m²</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="text-xs text-muted-foreground">{formatDate(req.created_at)}</TableCell>
                <TableCell className="font-medium">{req.name}</TableCell>
                <TableCell className="text-sm">{req.email}</TableCell>
                <TableCell className="text-sm">{req.phone}</TableCell>
                <TableCell className="text-sm">{req.location}</TableCell>
                <TableCell><Badge variant="secondary">{req.property_type}</Badge></TableCell>
                <TableCell className="text-sm">{req.scope}</TableCell>
                <TableCell className="text-sm">{req.sqm ?? "–"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </div>
);

// Create Project Dialog
const CreateProjectDialog = ({ open, onOpenChange, profiles, onCreated }: any) => {
  const [form, setForm] = useState({ user_id: "", title: "", location: "", status: "planned", progress: 0, start_date: "", type: "" });

  const handleSubmit = async () => {
    if (!form.user_id || !form.title) { toast.error("Odaberite klijenta i unesite naslov"); return; }
    const { error } = await supabase.from("projects").insert({
      user_id: form.user_id,
      title: form.title,
      location: form.location || null,
      status: form.status,
      progress: form.progress,
      start_date: form.start_date || null,
      type: form.type || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Projekt kreiran!");
    setForm({ user_id: "", title: "", location: "", status: "planned", progress: 0, start_date: "", type: "" });
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Novi projekt</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novi projekt</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Klijent</Label>
            <Select value={form.user_id} onValueChange={(v) => setForm(f => ({ ...f, user_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Odaberi klijenta" /></SelectTrigger>
              <SelectContent>
                {profiles.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Naslov</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Lokacija</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
            <div><Label>Tip</Label><Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="Kupaonica · Kompletna" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planirano</SelectItem>
                  <SelectItem value="active">U tijeku</SelectItem>
                  <SelectItem value="completed">Završeno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Napredak (%)</Label><Input type="number" min={0} max={100} value={form.progress} onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))} /></div>
            <div><Label>Datum početka</Label><Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Kreiraj projekt</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Create Ponuda Dialog
const CreatePonudaDialog = ({ open, onOpenChange, profiles, projects, onCreated }: any) => {
  const [form, setForm] = useState({ user_id: "", project_id: "", code: "", title: "", amount: 0, status: "pending" });

  const handleSubmit = async () => {
    if (!form.user_id || !form.title || !form.code) { toast.error("Popunite obavezna polja"); return; }
    const { error } = await supabase.from("ponude").insert({
      user_id: form.user_id,
      project_id: form.project_id || null,
      code: form.code,
      title: form.title,
      amount: form.amount,
      status: form.status,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Ponuda kreirana!");
    setForm({ user_id: "", project_id: "", code: "", title: "", amount: 0, status: "pending" });
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Nova ponuda</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova ponuda</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Klijent</Label>
            <Select value={form.user_id} onValueChange={(v) => setForm(f => ({ ...f, user_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Odaberi klijenta" /></SelectTrigger>
              <SelectContent>
                {profiles.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Projekt (opcionalno)</Label>
            <Select value={form.project_id} onValueChange={(v) => setForm(f => ({ ...f, project_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Odaberi projekt" /></SelectTrigger>
              <SelectContent>
                {projects.filter((p: any) => p.user_id === form.user_id).map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Šifra</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="PON-2026-001" /></div>
            <div><Label>Iznos (€)</Label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} /></div>
          </div>
          <div><Label>Naslov</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Na čekanju</SelectItem>
                <SelectItem value="accepted">Prihvaćeno</SelectItem>
                <SelectItem value="rejected">Odbijeno</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full">Kreiraj ponudu</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Create Racun Dialog
const CreateRacunDialog = ({ open, onOpenChange, profiles, projects, onCreated }: any) => {
  const [form, setForm] = useState({ user_id: "", project_id: "", code: "", title: "", amount: 0, status: "pending" });

  const handleSubmit = async () => {
    if (!form.user_id || !form.title || !form.code) { toast.error("Popunite obavezna polja"); return; }
    const { error } = await supabase.from("racuni").insert({
      user_id: form.user_id,
      project_id: form.project_id || null,
      code: form.code,
      title: form.title,
      amount: form.amount,
      status: form.status,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Račun kreiran!");
    setForm({ user_id: "", project_id: "", code: "", title: "", amount: 0, status: "pending" });
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Novi račun</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novi račun</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Klijent</Label>
            <Select value={form.user_id} onValueChange={(v) => setForm(f => ({ ...f, user_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Odaberi klijenta" /></SelectTrigger>
              <SelectContent>
                {profiles.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Projekt (opcionalno)</Label>
            <Select value={form.project_id} onValueChange={(v) => setForm(f => ({ ...f, project_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Odaberi projekt" /></SelectTrigger>
              <SelectContent>
                {projects.filter((p: any) => p.user_id === form.user_id).map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Šifra</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="RAČ-2026-001" /></div>
            <div><Label>Iznos (€)</Label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} /></div>
          </div>
          <div><Label>Naslov</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Čeka uplatu</SelectItem>
                <SelectItem value="paid">Plaćeno</SelectItem>
                <SelectItem value="overdue">Dospjelo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full">Kreiraj račun</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Create Conversation Dialog
const CreateConvoDialog = ({ open, onOpenChange, profiles, onCreated }: any) => {
  const [form, setForm] = useState({ user_id: "", name: "" });

  const handleSubmit = async () => {
    if (!form.user_id || !form.name) { toast.error("Popunite sva polja"); return; }
    const { error } = await supabase.from("conversations").insert({
      user_id: form.user_id,
      name: form.name,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Razgovor kreiran!");
    setForm({ user_id: "", name: "" });
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Novi razgovor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novi razgovor</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Klijent</Label>
            <Select value={form.user_id} onValueChange={(v) => setForm(f => ({ ...f, user_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Odaberi klijenta" /></SelectTrigger>
              <SelectContent>
                {profiles.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Naziv razgovora</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ivan – Voditelj projekta" /></div>
          <Button onClick={handleSubmit} className="w-full">Kreiraj razgovor</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Admin;
