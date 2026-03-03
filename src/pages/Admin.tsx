import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
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
  Send,
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

  // Edit dialog states
  const [editProject, setEditProject] = useState<any | null>(null);
  const [editPonuda, setEditPonuda] = useState<any | null>(null);
  const [editRacun, setEditRacun] = useState<any | null>(null);

  const fetchAll = async () => {
    const [reqRes, profRes, projRes, ponRes, racRes, conRes] = await Promise.all([
      supabase.from("renovation_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("ponude").select("*").order("created_at", { ascending: false }),
      supabase.from("racuni").select("*").order("created_at", { ascending: false }),
      supabase.from("conversations").select("*").order("created_at", { ascending: false }),
    ]);
    setRequests(reqRes.data ?? []);
    setProfiles(profRes.data ?? []);
    setProjects(projRes.data ?? []);
    setPonude(ponRes.data ?? []);
    setRacuni(racRes.data ?? []);
    setConversations(conRes.data ?? []);
    setLoading(false);
  };

  // Helper to lookup profile name by user_id
  const getProfileName = (userId: string) => {
    const p = profiles.find((pr) => pr.id === userId);
    return p?.full_name || p?.email || "—";
  };

  const getProjectTitle = (projectId: string | null) => {
    if (!projectId) return "—";
    const p = projects.find((pr: any) => pr.id === projectId);
    return p?.title || "—";
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
    else if (!adminLoading) setLoading(false);
  }, [isAdmin, adminLoading]);

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
                        <TableCell className="text-sm">{getProfileName(p.user_id)}</TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                        <TableCell>{p.progress}%</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.location || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.start_date ? formatDate(p.start_date) : "—"}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditProject(p)}><Edit className="w-4 h-4" /></Button>
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
                        <TableCell className="text-sm">{getProfileName(p.user_id)}</TableCell>
                        <TableCell className="text-sm">{getProjectTitle(p.project_id)}</TableCell>
                        <TableCell className="font-bold">{Number(p.amount).toLocaleString("hr-HR")} €</TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(p.date)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setEditPonuda(p)}><Edit className="w-4 h-4" /></Button>
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
                        <TableCell className="text-sm">{getProfileName(r.user_id)}</TableCell>
                        <TableCell className="text-sm">{getProjectTitle(r.project_id)}</TableCell>
                        <TableCell className="font-bold">{Number(r.amount).toLocaleString("hr-HR")} €</TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(r.date)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setEditRacun(r)}><Edit className="w-4 h-4" /></Button>
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
                        <TableCell className="text-sm">{getProfileName(c.user_id)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(c.created_at)}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          <AdminChatDialog
                            conversationId={c.id}
                            conversationName={c.name}
                            adminUserId={session?.user?.id ?? ""}
                            adminName={session?.user?.user_metadata?.full_name ?? session?.user?.email ?? "Admin"}
                          />
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

        {/* Edit Dialogs */}
        <EditProjectDialog item={editProject} onClose={() => setEditProject(null)} profiles={profiles} onUpdated={fetchAll} />
        <EditPonudaDialog item={editPonuda} onClose={() => setEditPonuda(null)} profiles={profiles} projects={projects} onUpdated={fetchAll} />
        <EditRacunDialog item={editRacun} onClose={() => setEditRacun(null)} profiles={profiles} projects={projects} onUpdated={fetchAll} />
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


// Admin Chat Dialog
const AdminChatDialog = ({ conversationId, conversationName, adminUserId, adminName }: {
  conversationId: string; conversationName: string; adminUserId: string; adminName: string;
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("poruke")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!open) return;
    fetchMessages();
    const channel = supabase
      .channel(`admin-chat-${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "poruke",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as any]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [open, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    await supabase.from("poruke").insert({
      conversation_id: conversationId,
      sender_id: adminUserId,
      sender_name: adminName,
      text: newMsg.trim(),
    });
    setNewMsg("");
  };

  const formatTime = (d: string) => {
    try {
      const date = new Date(d);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } catch { return ""; }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><MessageSquare className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> {conversationName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-3 py-4 min-h-[300px] max-h-[400px]">
          {loading && <p className="text-center text-muted-foreground text-sm">Učitavanje...</p>}
          {!loading && messages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">Nema poruka u ovom razgovoru.</p>
          )}
          {messages.map((msg) => {
            const isAdmin = msg.sender_id === adminUserId;
            return (
              <div key={msg.id} className={cn("flex", isAdmin ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  isAdmin
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                )}>
                  {!isAdmin && <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender_name}</p>}
                  <p className="text-sm">{msg.text}</p>
                  <p className={cn("text-[10px] mt-1", isAdmin ? "text-primary-foreground/60" : "text-muted-foreground")}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-border/50 pt-3 flex items-center gap-2">
          <Input
            placeholder="Napišite poruku..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="rounded-xl"
          />
          <Button size="icon" className="shrink-0 rounded-xl" onClick={handleSend}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Edit Project Dialog
const EditProjectDialog = ({ item, onClose, profiles, onUpdated }: { item: any; onClose: () => void; profiles: any[]; onUpdated: () => void }) => {
  const [form, setForm] = useState({ title: "", location: "", status: "planned", progress: 0, start_date: "", type: "" });

  useEffect(() => {
    if (item) setForm({
      title: item.title ?? "", location: item.location ?? "", status: item.status ?? "planned",
      progress: item.progress ?? 0, start_date: item.start_date ?? "", type: item.type ?? "",
    });
  }, [item]);

  const handleSubmit = async () => {
    const { error } = await supabase.from("projects").update({
      title: form.title, location: form.location || null, status: form.status,
      progress: form.progress, start_date: form.start_date || null, type: form.type || null,
    }).eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Projekt ažuriran!");
    onClose();
    onUpdated();
  };

  return (
    <Dialog open={!!item} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Uredi projekt</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Klijent</Label><Input disabled value={profiles.find((p: any) => p.id === item?.user_id)?.full_name || profiles.find((p: any) => p.id === item?.user_id)?.email || ""} /></div>
          <div><Label>Naslov</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Lokacija</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
            <div><Label>Tip</Label><Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} /></div>
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
          <Button onClick={handleSubmit} className="w-full">Spremi promjene</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Edit Ponuda Dialog
const EditPonudaDialog = ({ item, onClose, profiles, projects, onUpdated }: { item: any; onClose: () => void; profiles: any[]; projects: any[]; onUpdated: () => void }) => {
  const [form, setForm] = useState({ project_id: "", code: "", title: "", amount: 0, status: "pending" });

  useEffect(() => {
    if (item) setForm({
      project_id: item.project_id ?? "", code: item.code ?? "", title: item.title ?? "",
      amount: item.amount ?? 0, status: item.status ?? "pending",
    });
  }, [item]);

  const handleSubmit = async () => {
    const { error } = await supabase.from("ponude").update({
      project_id: form.project_id || null, code: form.code, title: form.title,
      amount: form.amount, status: form.status,
    }).eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Ponuda ažurirana!");
    onClose();
    onUpdated();
  };

  return (
    <Dialog open={!!item} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Uredi ponudu</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Klijent</Label><Input disabled value={profiles.find((p: any) => p.id === item?.user_id)?.full_name || profiles.find((p: any) => p.id === item?.user_id)?.email || ""} /></div>
          <div>
            <Label>Projekt (opcionalno)</Label>
            <Select value={form.project_id} onValueChange={(v) => setForm(f => ({ ...f, project_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Odaberi projekt" /></SelectTrigger>
              <SelectContent>
                {projects.filter((p: any) => p.user_id === item?.user_id).map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Šifra</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} /></div>
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
          <Button onClick={handleSubmit} className="w-full">Spremi promjene</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Edit Racun Dialog
const EditRacunDialog = ({ item, onClose, profiles, projects, onUpdated }: { item: any; onClose: () => void; profiles: any[]; projects: any[]; onUpdated: () => void }) => {
  const [form, setForm] = useState({ project_id: "", code: "", title: "", amount: 0, status: "pending" });

  useEffect(() => {
    if (item) setForm({
      project_id: item.project_id ?? "", code: item.code ?? "", title: item.title ?? "",
      amount: item.amount ?? 0, status: item.status ?? "pending",
    });
  }, [item]);

  const handleSubmit = async () => {
    const { error } = await supabase.from("racuni").update({
      project_id: form.project_id || null, code: form.code, title: form.title,
      amount: form.amount, status: form.status,
    }).eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Račun ažuriran!");
    onClose();
    onUpdated();
  };

  return (
    <Dialog open={!!item} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Uredi račun</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Klijent</Label><Input disabled value={profiles.find((p: any) => p.id === item?.user_id)?.full_name || profiles.find((p: any) => p.id === item?.user_id)?.email || ""} /></div>
          <div>
            <Label>Projekt (opcionalno)</Label>
            <Select value={form.project_id} onValueChange={(v) => setForm(f => ({ ...f, project_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Odaberi projekt" /></SelectTrigger>
              <SelectContent>
                {projects.filter((p: any) => p.user_id === item?.user_id).map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Šifra</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} /></div>
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
          <Button onClick={handleSubmit} className="w-full">Spremi promjene</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Admin;
