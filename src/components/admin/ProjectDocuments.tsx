import { useCallback, useEffect, useState } from "react";
import { FileText, MoreHorizontal, Plus, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import ConfirmDialog from "@/components/ConfirmDialog";
import DestructiveConfirmDialog from "@/components/DestructiveConfirmDialog";
import DocumentUploadDialog from "@/components/admin/DocumentUploadDialog";
import { toast } from "@/components/ui/toast-notifications";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { downloadDocument, useDocumentUrl } from "@/hooks/useDocumentUrl";
import { DOCUMENT_TYPE_LABELS, documentActions, type ProjectDocument } from "@/lib/documents";
import { eur, formatDate } from "@/lib/adminFormat";

const ProjectDocuments = ({ projectId, projectIsDraft }: { projectId: string; projectIsDraft: boolean }) => {
  const { session } = useAuth();
  const [docs, setDocs] = useState<ProjectDocument[]>([]); const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false); const [preview, setPreview] = useState<ProjectDocument | null>(null);
  const [cancelDoc, setCancelDoc] = useState<ProjectDocument | null>(null); const [deleteDoc, setDeleteDoc] = useState<ProjectDocument | null>(null);
  const previewUrl = useDocumentUrl(preview?.storage_path);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("project_documents").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
    if (error) toast.error("Dokumenti nisu učitani", "Pokušajte ponovno."); else setDocs(data);
    setLoading(false);
  }, [projectId]);
  useEffect(() => {
    void load();
    const ch = supabase.channel(`docs-admin-${projectId}`).on("postgres_changes", { event: "*", schema: "public", table: "project_documents", filter: `project_id=eq.${projectId}` }, () => void load()).subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [projectId, load]);

  const send = async (doc: ProjectDocument, reminder: boolean) => {
    if (projectIsDraft) { toast.warning("Projekt je draft", "Dokument se može poslati nakon kreiranja projekta."); return; }
    const r = await supabase.functions.invoke("send-document-for-signature", { body: { document_id: doc.id, reminder } });
    if (r.error || !r.data?.success) { toast.error("Slanje nije uspjelo", "Pokušajte ponovno."); return; }
    if (r.data.emailSent) toast.success(reminder ? "Podsjetnik poslan" : `Dokument ${doc.document_number} poslan klijentu`);
    else toast.warning("Email nije isporučen", "Status je ažuriran, ali email klijentu nije poslan.");
    void load();
  };
  const cancel = async () => {
    const doc = cancelDoc; if (!doc) return; setCancelDoc(null);
    const { error } = await supabase.from("project_documents").update({ status: "otkazano" }).eq("id", doc.id);
    if (error) { toast.error("Dokument nije otkazan", "Pokušajte ponovno."); return; }
    await supabase.from("project_activity_log").insert({ project_id: projectId, actor_id: session?.user.id ?? null, action: "document_cancelled", entity_type: "document", entity_id: doc.id, metadata: { number: doc.document_number, title: doc.title } });
    toast.success("Dokument otkazan", doc.document_number); void load();
  };
  const remove = async () => {
    const doc = deleteDoc; if (!doc) return; setDeleteDoc(null);
    const { error } = await supabase.from("project_documents").delete().eq("id", doc.id);
    if (error) { toast.error("Dokument nije obrisan", "Pokušajte ponovno."); return; }
    await supabase.storage.from("project-documents").remove([doc.storage_path]);
    toast.success("Dokument obrisan", doc.document_number); void load();
  };
  const download = async (doc: ProjectDocument) => { if (!(await downloadDocument(doc.storage_path, doc.file_name))) toast.error("Preuzimanje nije uspjelo", "Pokušajte ponovno."); };

  const signedCount = docs.filter(d => d.status === "potpisano").length;
  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div><h2 className="text-2xl font-serif font-normal">Dokumenti</h2><p className="text-sm text-dash-subtle font-dashboard mt-1">{docs.length} dokumenata · {signedCount} potpisanih</p></div>
      <Button onClick={() => setUploadOpen(true)}><Plus size={16} className="mr-2" />Novi dokument</Button>
    </div>
    {loading ? <TableSkeleton rows={4} /> : docs.length === 0 ? (
      <EmptyState icon={FileText} title="Još nema dokumenata" description="Dodajte prvu ponudu, aneks ili ugovor — klijent može pregledati i potpisati digitalno." actionLabel="Dodaj dokument" onAction={() => setUploadOpen(true)} />
    ) : (
      <div className="divide-y divide-dash-border-soft bg-dash-card rounded-2xl border border-dash-border">
        {docs.map(doc => <div key={doc.id} role="button" tabIndex={0} onClick={() => setPreview(doc)} onKeyDown={e => { if (e.key === "Enter") setPreview(doc); }} className="flex flex-wrap md:flex-nowrap gap-4 p-5 cursor-pointer hover:bg-dash-hover/40 transition-colors font-dashboard">
          <div className="flex gap-3 min-w-0 md:w-2/5"><FileText className="text-primary shrink-0 mt-0.5" size={22} /><div className="min-w-0"><p className="text-xs text-dash-subtle">{doc.document_number}</p><p className="font-medium break-words">{doc.title}</p><span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-dash-soft text-dash-ink">{DOCUMENT_TYPE_LABELS[doc.document_type]}</span></div></div>
          <div className="flex-1 min-w-0 text-sm text-dash-muted">{doc.description && <p className="line-clamp-2">{doc.description}</p>}<p className="mt-1">{doc.total_amount != null && <span className="text-foreground">{eur(doc.total_amount)} € </span>}{doc.valid_until && <span>· Vrijedi do {formatDate(doc.valid_until)}</span>}</p>{doc.client_comment && <p className="mt-1 italic">„{doc.client_comment}”</p>}</div>
          <div className="flex items-start gap-2 shrink-0" onClick={e => e.stopPropagation()}>
            <StatusBadge status={doc.status} />
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Akcije dokumenta"><MoreHorizontal size={18} /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">{documentActions(doc.status).map(a => {
                if (a === "send") return <DropdownMenuItem key={a} onClick={() => void send(doc, false)}>Pošalji klijentu</DropdownMenuItem>;
                if (a === "remind") return <DropdownMenuItem key={a} onClick={() => void send(doc, true)}>Pošalji podsjetnik</DropdownMenuItem>;
                if (a === "cancel") return <DropdownMenuItem key={a} onClick={() => setCancelDoc(doc)}>Otkaži</DropdownMenuItem>;
                if (a === "download") return <DropdownMenuItem key={a} onClick={() => void download(doc)}>Preuzmi PDF</DropdownMenuItem>;
                return <DropdownMenuItem key={a} className="text-destructive" onClick={() => setDeleteDoc(doc)}>Obriši</DropdownMenuItem>;
              })}</DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>)}
      </div>
    )}
    <Dialog open={!!preview} onOpenChange={o => { if (!o) setPreview(null); }}>
      <DialogContent className="max-w-4xl bg-dash-card">
        <DialogHeader><DialogTitle className="font-serif font-normal text-2xl">{preview?.document_number} · {preview?.title}</DialogTitle><DialogDescription>{preview?.file_name}</DialogDescription></DialogHeader>
        {previewUrl ? <iframe src={previewUrl} title="PDF pregled" className="w-full h-[65vh] rounded-xl border border-dash-border" /> : <div className="h-[65vh] rounded-xl bg-dash-soft animate-pulse" />}
        <div className="flex gap-3 justify-end">{previewUrl && <Button variant="outline" asChild><a href={previewUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} className="mr-2" />Otvori u novom tabu</a></Button>}{preview && <Button onClick={() => void download(preview)}><Download size={16} className="mr-2" />Preuzmi PDF</Button>}</div>
      </DialogContent>
    </Dialog>
    <DocumentUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} projectId={projectId} projectIsDraft={projectIsDraft} onSaved={() => void load()} />
    <ConfirmDialog open={!!cancelDoc} onOpenChange={o => { if (!o) setCancelDoc(null); }} title="Otkazati dokument?" description={`Klijent više neće moći potpisati dokument ${cancelDoc?.document_number ?? ""}.`} confirmLabel="Otkaži dokument" variant="destructive" onConfirm={() => void cancel()} />
    <DestructiveConfirmDialog open={!!deleteDoc} onOpenChange={o => { if (!o) setDeleteDoc(null); }} title="Obrisati draft dokument?" description={`Dokument ${deleteDoc?.document_number ?? ""} i njegov PDF bit će trajno obrisani.`} requireText="OBRIŠI" confirmLabel="Obriši dokument" onConfirm={() => void remove()} />
  </div>;
};
export default ProjectDocuments;
