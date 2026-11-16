import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast-notifications";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, hasAmount, hasValidUntil, safeFileName, validatePdf } from "@/lib/documents";

interface Props { open: boolean; onOpenChange: (o: boolean) => void; projectId: string; projectIsDraft: boolean; onSaved: () => void }

const DocumentUploadDialog = ({ open, onOpenChange, projectId, projectIsDraft, onSaved }: Props) => {
  const { session } = useAuth();
  const [type, setType] = useState<string>("ponuda");
  const [title, setTitle] = useState(""); const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(""); const [validUntil, setValidUntil] = useState(""); const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null); const [sendNow, setSendNow] = useState(true);
  const [drag, setDrag] = useState(false); const [saving, setSaving] = useState(false); const [err, setErr] = useState("");

  const reset = () => { setType("ponuda"); setTitle(""); setDescription(""); setAmount(""); setValidUntil(""); setDueDate(""); setFile(null); setSendNow(true); setErr(""); };
  const pick = (f: File | undefined) => { if (!f) return; const e = validatePdf(f); setErr(e ?? ""); setFile(e ? null : f); };

  const submit = async () => {
    if (saving) return;
    if (!title.trim()) return setErr("Unesite naslov dokumenta.");
    if (!file) return setErr("Odaberite PDF datoteku.");
    if (hasAmount(type) && amount && (!Number.isFinite(Number(amount)) || Number(amount) < 0)) return setErr("Iznos mora biti pozitivan broj.");
    setSaving(true); setErr("");
    const num = await supabase.rpc("generate_document_number");
    if (num.error || !num.data) { setSaving(false); return setErr("Broj dokumenta nije moguće generirati."); }
    const number = num.data;
    const path = `${projectId}/${number}-${safeFileName(file.name)}`;
    const up = await supabase.storage.from("project-documents").upload(path, file, { contentType: "application/pdf", upsert: false });
    if (up.error) { setSaving(false); return setErr("PDF nije prenesen. Pokušajte ponovno."); }
    const { data: doc, error } = await supabase.from("project_documents").insert({
      project_id: projectId, document_number: number, title: title.trim(), document_type: type, description: description.trim() || null,
      total_amount: hasAmount(type) && amount ? Number(amount) : null, valid_until: hasValidUntil(type) && validUntil ? validUntil : null, due_date: dueDate || null,
      storage_path: path, file_name: file.name, file_size_bytes: file.size, created_by: session?.user.id ?? null,
    }).select("id").single();
    if (error || !doc) { await supabase.storage.from("project-documents").remove([path]); setSaving(false); return setErr("Dokument nije spremljen. Pokušajte ponovno."); }
    await supabase.from("project_activity_log").insert({ project_id: projectId, actor_id: session?.user.id ?? null, action: "document_uploaded", entity_type: "document", entity_id: doc.id, metadata: { type, title: title.trim(), number, status: sendNow && !projectIsDraft ? "poslano" : "draft" } });
    let sent = false;
    if (sendNow && !projectIsDraft) {
      const r = await supabase.functions.invoke("send-document-for-signature", { body: { document_id: doc.id } });
      sent = !r.error && r.data?.success;
      if (sent && !r.data?.emailSent) toast.warning("Email nije poslan", "Dokument je označen kao poslan, ali email klijentu nije isporučen.");
    }
    setSaving(false);
    toast.success(`Dokument ${number} ${sent ? "poslan klijentu" : "spremljen kao draft"}`);
    reset(); onOpenChange(false); onSaved();
  };

  return <Sheet open={open} onOpenChange={o => { if (!saving) { onOpenChange(o); if (!o) reset(); } }}>
    <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-dash-card font-dashboard">
      <SheetHeader><SheetTitle className="font-serif font-normal text-2xl">Novi dokument</SheetTitle><SheetDescription>Klijent ga može pregledati i potpisati digitalno.</SheetDescription></SheetHeader>
      <div className="space-y-5 mt-6">
        <div><Label>Tip dokumenta</Label><div className="flex flex-wrap gap-2 mt-2">{DOCUMENT_TYPES.map(t => <button key={t} type="button" onClick={() => setType(t)} className={cn("px-3 py-1.5 rounded-full text-sm border transition-colors", type === t ? "bg-primary text-primary-foreground border-primary" : "border-dash-border text-dash-muted hover:bg-dash-hover/60")}>{DOCUMENT_TYPE_LABELS[t]}</button>)}</div></div>
        <div><Label htmlFor="doc-title">Naslov*</Label><Input id="doc-title" className="mt-2" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ponuda br. 2026-031 - Kompletna renovacija" /></div>
        <div><Label htmlFor="doc-desc">Opis</Label><Textarea id="doc-desc" className="mt-2" rows={3} value={description} onChange={e => setDescription(e.target.value)} /></div>
        {hasAmount(type) && <div><Label htmlFor="doc-amount">Ukupan iznos (EUR, bez PDV-a)</Label><Input id="doc-amount" className="mt-2" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} /></div>}
        <div className="grid grid-cols-2 gap-3">
          {hasValidUntil(type) && <div><Label htmlFor="doc-valid">Vrijedi do</Label><Input id="doc-valid" className="mt-2" type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} /></div>}
          <div><Label htmlFor="doc-due">Rok potpisa</Label><Input id="doc-due" className="mt-2" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
        </div>
        <div><Label>PDF datoteka*</Label>
          <label onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }} className={cn("mt-2 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition-colors", drag ? "border-primary bg-primary/5" : "border-dash-border")}>
            {file ? <><FileText className="text-primary" /><span className="text-sm break-all">{file.name}</span><span className="text-xs text-dash-subtle">{(file.size / 1048576).toFixed(1)} MB</span></> : <><Upload className="text-dash-subtle" /><span className="text-sm">Povucite PDF ovdje ili kliknite</span><span className="text-xs text-dash-subtle">Samo PDF, najviše 10 MB</span></>}
            <input type="file" accept="application/pdf" className="sr-only" aria-label="PDF datoteka" onChange={e => pick(e.target.files?.[0])} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={sendNow && !projectIsDraft} disabled={projectIsDraft} onCheckedChange={v => setSendNow(v === true)} />Pošalji klijentu odmah</label>
        {projectIsDraft && <p className="text-xs text-dash-subtle">Projekt je draft — dokument se sprema kao draft dok projekt ne bude kreiran.</p>}
        {err && <p className="text-sm text-destructive" role="alert">{err}</p>}
        <div className="flex gap-3 justify-end pt-2"><Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Odustani</Button><Button disabled={saving} onClick={() => void submit()}>{saving ? "Spremanje…" : "Spremi dokument"}</Button></div>
      </div>
    </SheetContent>
  </Sheet>;
};
export default DocumentUploadDialog;
