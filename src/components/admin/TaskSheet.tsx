import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "@/components/ui/toast-notifications";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { initialsOf } from "@/lib/adminFormat";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/components/admin/StatusBadge";
import type { Project, ProjectPhase, ProjectTask } from "@/lib/projects";
import { TASK_STATUSES } from "@/lib/projects";

const PRIORITIES = [
  { value: "nizak", label: "Nizak" },
  { value: "srednji", label: "Srednji" },
  { value: "visok", label: "Visok" },
];

interface TaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  phases: ProjectPhase[];
  /** Ako je postavljen, sheet je u načinu uređivanja. */
  task?: ProjectTask | null;
  /** Pretpunjena faza za novi task. */
  defaultPhaseId?: string | null;
  onSaved: () => void;
}

const logActivity = (projectId: string, actorId: string | undefined, action: string, entityId: string | null, metadata: Record<string, string>) =>
  supabase.from("project_activity_log").insert({ project_id: projectId, actor_id: actorId ?? null, action, entity_type: "task", entity_id: entityId, metadata });

const TaskSheet = ({ open, onOpenChange, project, phases, task, defaultPhaseId, onSaved }: TaskSheetProps) => {
  const { session } = useAuth();
  const editing = Boolean(task);
  const [team, setTeam] = useState<{ id: string; full_name: string }[]>([]);
  const [name, setName] = useState("");
  const [phaseId, setPhaseId] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [assigneeText, setAssigneeText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("srednji");
  const [description, setDescription] = useState("");
  const [clientPresence, setClientPresence] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("planirano");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase.rpc("project_managers").then(({ data }) => setTeam(data ?? []));
    setName(task?.name ?? "");
    setPhaseId(task?.phase_id ?? defaultPhaseId ?? null);
    setAssigneeId(task?.assigned_to_user_id ?? null);
    setAssigneeText(task?.assigned_to_text ?? "");
    setStartDate(task?.start_date ?? "");
    setDueDate(task?.due_date ?? "");
    setPriority(task?.priority ?? "srednji");
    setDescription(task?.description ?? "");
    setClientPresence(task?.requires_client_presence ?? false);
    setProgress(task?.progress_percent ?? 0);
    setStatus(task?.status ?? "planirano");
  }, [open, task, defaultPhaseId]);

  const phaseName = phases.find(p => p.id === phaseId)?.name;

  const save = async () => {
    if (!name.trim()) { toast.warning("Naziv je obavezan", "Unesite naziv zadatka."); return; }
    if (saving) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      phase_id: phaseId,
      assigned_to_user_id: assigneeId,
      assigned_to_text: assigneeId ? null : assigneeText.trim() || null,
      start_date: startDate || null,
      due_date: dueDate || null,
      priority,
      description: description.trim() || null,
      requires_client_presence: clientPresence,
      progress_percent: progress,
      status,
    };
    const uid = session?.user.id;
    if (editing && task) {
      const { error } = await supabase.from("project_tasks").update(payload).eq("id", task.id);
      setSaving(false);
      if (error) { toast.error("Spremanje nije uspjelo", "Pokušajte ponovno."); return; }
      if (task.status !== status) {
        await logActivity(project.id, uid, status === "zavrseno" ? "task_completed" : "task_status_changed", task.id, { name: task.name, from: statusLabel(task.status), to: statusLabel(status) });
      }
      toast.success("Zadatak spremljen", name.trim());
    } else {
      const { data, error } = await supabase.from("project_tasks").insert({ ...payload, project_id: project.id, created_by: uid ?? null }).select("id").single();
      setSaving(false);
      if (error || !data) { toast.error("Zadatak nije dodan", "Pokušajte ponovno."); return; }
      await logActivity(project.id, uid, "task_created", data.id, { name: name.trim(), phase: phaseName ?? "" });
      // Faza koja je bila planirana prelazi u tijek kad dobije prvi zadatak.
      const phase = phases.find(p => p.id === phaseId);
      if (phase && phase.status === "planirano") {
        await supabase.from("project_phases").update({ status: "u_tijeku" }).eq("id", phase.id);
        await logActivity(project.id, uid, "phase_started", phase.id, { name: phase.name });
      }
      toast.success("Zadatak dodan", `${name.trim()} dodan u fazu ${phaseName ?? "bez faze"}`);
    }
    onOpenChange(false);
    onSaved();
  };

  const remove = async () => {
    if (!task || deleting) return;
    setDeleting(true);
    const { error } = await supabase.from("project_tasks").delete().eq("id", task.id);
    setDeleting(false);
    if (error) { toast.error("Zadatak nije obrisan", "Pokušajte ponovno."); return; }
    await logActivity(project.id, session?.user.id, "task_deleted", task.id, { name: task.name });
    toast.success("Zadatak obrisan", task.name);
    setConfirmDelete(false);
    onOpenChange(false);
    onSaved();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-dash-card flex flex-col">
          <SheetHeader>
            <p className="text-xs uppercase tracking-wider text-dash-subtle font-dashboard">{project.title} · {project.client_name}</p>
            <SheetTitle className="font-serif text-3xl font-normal">{editing ? "Uredi zadatak" : "Novi zadatak"}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 py-6">
            <div>
              <Label htmlFor="task-name" className="font-dashboard">Naziv zadatka*</Label>
              <Input id="task-name" className="mt-2" placeholder="Postavljanje pločica u kupaonici" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label className="font-dashboard">Faza projekta</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {phases.map(p => (
                  <button key={p.id} type="button" onClick={() => setPhaseId(p.id === phaseId ? null : p.id)}
                    className={cn("rounded-full px-4 py-1.5 text-sm font-dashboard border border-dash-border transition-colors", phaseId === p.id ? "bg-dash-ink text-dash-card border-dash-ink" : "bg-dash-card text-dash-ink hover:bg-dash-soft")}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-dashboard">Dodijeli</Label>
              <div className="mt-2 space-y-2">
                {team.map(m => (
                  <label key={m.id} className="flex items-center gap-3 rounded-xl border border-dash-border p-3 cursor-pointer hover:bg-dash-soft">
                    <Checkbox checked={assigneeId === m.id} onCheckedChange={checked => setAssigneeId(checked ? m.id : null)} />
                    <span className="w-8 h-8 rounded-full bg-dash-active flex items-center justify-center text-xs font-medium font-dashboard">{initialsOf(m.full_name)}</span>
                    <span className="font-dashboard text-sm">{m.full_name}</span>
                  </label>
                ))}
                <Input placeholder="Vanjski izvođač (npr. Elektro Horvat)" value={assigneeText} onChange={e => { setAssigneeText(e.target.value); if (e.target.value) setAssigneeId(null); }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="task-start" className="font-dashboard">Datum početka</Label>
                <Input id="task-start" type="date" className="mt-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="task-due" className="font-dashboard">Rok</Label>
                <Input id="task-due" type="date" className="mt-2" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="font-dashboard">Prioritet</Label>
              <div className="flex gap-2 mt-2">
                {PRIORITIES.map(pr => (
                  <button key={pr.value} type="button" onClick={() => setPriority(pr.value)}
                    className={cn("rounded-full px-4 py-1.5 text-sm font-dashboard border border-dash-border transition-colors", priority === pr.value ? "bg-dash-ink text-dash-card border-dash-ink" : "bg-dash-card text-dash-ink hover:bg-dash-soft")}>
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="task-desc" className="font-dashboard">Opis</Label>
              <Textarea id="task-desc" rows={4} className="mt-2" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-dash-border p-4">
              <Label htmlFor="task-presence" className="font-dashboard cursor-pointer">Zahtijeva prisutnost klijenta</Label>
              <Switch id="task-presence" checked={clientPresence} onCheckedChange={setClientPresence} />
            </div>
            {editing && (
              <>
                <div>
                  <Label className="font-dashboard">Napredak · {progress}%</Label>
                  <Slider className="mt-3" min={0} max={100} step={5} value={[progress]} onValueChange={([v]) => setProgress(v)} />
                </div>
                <div>
                  <Label className="font-dashboard">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <div className="sticky bottom-0 bg-dash-card pt-4 pb-2 border-t border-dash-border flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Odustani</Button>
            <Button className="flex-1" disabled={saving} onClick={() => void save()}>{editing ? "Spremi" : "Dodaj zadatak"}</Button>
          </div>
          {editing && (
            <Button variant="ghost" className="text-destructive hover:text-destructive" disabled={deleting} onClick={() => setConfirmDelete(true)}>Obriši zadatak</Button>
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={confirmDelete} onOpenChange={setConfirmDelete} title="Obrisati zadatak?" description={`Zadatak „${task?.name}” bit će trajno uklonjen iz projekta.`} confirmLabel="Obriši" onConfirm={() => void remove()} />
    </>
  );
};

export default TaskSheet;
