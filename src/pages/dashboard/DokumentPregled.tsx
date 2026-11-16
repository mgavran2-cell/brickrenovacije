import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/Logo";
import EmptyState from "@/components/EmptyState";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { toast } from "@/components/ui/toast-notifications";
import { supabase } from "@/integrations/supabase/client";
import { downloadDocument, useDocumentUrl } from "@/hooks/useDocumentUrl";
import { DOCUMENT_TYPE_LABELS, isPending, withVat, type ProjectDocument } from "@/lib/documents";
import { formatDate, formatTime } from "@/lib/adminFormat";

const money = (n: number) => `${new Intl.NumberFormat("hr-HR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} €`;
const InfoCard = ({ label, value }: { label: string; value: string }) => <div className="bg-dash-bg rounded-xl p-4 min-w-0"><p className="text-xs uppercase tracking-widest text-dash-subtle mb-1">{label}</p><p className="font-medium break-words">{value || "—"}</p></div>;

const DokumentPregled = () => {
  const { id } = useParams(); const navigate = useNavigate();
  const [doc, setDoc] = useState<ProjectDocument | null>(null);
  const [project, setProject] = useState<{ title: string; address: string | null; client_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"none" | "accept" | "revise">("none");
  const [signerName, setSignerName] = useState(""); const [comment, setComment] = useState(""); const [terms, setTerms] = useState(false); const [busy, setBusy] = useState(false);
  const viewed = useRef(false);
  const url = useDocumentUrl(doc?.storage_path);

  useEffect(() => {
    let live = true;
    const load = async () => {
      const { data } = await supabase.from("project_documents").select("*").eq("id", id ?? "").maybeSingle();
      if (!live) return;
      setDoc(data);
      if (data) {
        const p = await supabase.from("projects").select("title,address,client_name").eq("id", data.project_id).maybeSingle();
        if (live) setProject(p.data);
        if (data.status === "poslano" && !viewed.current) { viewed.current = true; await supabase.rpc("mark_document_viewed", { _document_id: data.id }); }
      }
      if (live) setLoading(false);
    };
    void load();
    const ch = supabase.channel(`doc-${id}`).on("postgres_changes", { event: "UPDATE", schema: "public", table: "project_documents", filter: `id=eq.${id}` }, () => void load()).subscribe();
    return () => { live = false; void supabase.removeChannel(ch); };
  }, [id]);

  const respond = async (response: "potpisano" | "odbijeno") => {
    if (!doc || busy) return; setBusy(true);
    const { error } = await supabase.rpc("respond_to_document", { _document_id: doc.id, _response: response, _signer_name: signerName, _comment: comment });
    if (error) { setBusy(false); toast.error("Odgovor nije spremljen", "Pokušajte ponovno ili nas nazovite."); return; }
    void supabase.functions.invoke("notify-document-response", { body: { document_id: doc.id } });
    toast.success("Hvala! Marko je obaviješten.");
    setTimeout(() => navigate("/dashboard/dokumenti"), 2000);
  };
  const handleSign = (e: FormEvent) => { e.preventDefault(); if (signerName.trim().length >= 3 && terms) void respond("potpisano"); };
  const handleRevise = (e: FormEvent) => { e.preventDefault(); if (comment.trim().length >= 10) void respond("odbijeno"); };

  if (loading) return <PageSkeleton />;
  if (!doc) return <div className="p-6 md:p-10"><EmptyState icon={FileText} title="Dokument nije pronađen" description="Dokument ne postoji ili Vam nije dostupan." actionLabel="Natrag na dokumente" onAction={() => navigate("/dashboard/dokumenti")} /></div>;
  const typeLabel = (DOCUMENT_TYPE_LABELS[doc.document_type] ?? "Dokument").toUpperCase();

  return <div className="max-w-5xl p-6 md:p-10">
    <Link to="/dashboard/dokumenti" className="inline-flex items-center gap-2 text-sm text-dash-muted hover:text-foreground mb-6"><ArrowLeft size={16} />Svi dokumenti</Link>
    <div className="bg-primary text-primary-foreground px-6 md:px-8 py-5 flex flex-wrap gap-3 justify-between items-center rounded-t-2xl">
      <div className="flex items-center gap-3"><span className="bg-primary-foreground rounded-lg p-1"><Logo size={28} /></span><span className="font-serif text-xl">brick.hr</span></div>
      <span className="text-sm uppercase tracking-widest opacity-90">{typeLabel} BR. {doc.document_number}</span>
    </div>
    <div className="bg-dash-card p-6 md:p-8 rounded-b-2xl border border-t-0 border-dash-border">
      <p className="text-xs uppercase tracking-widest text-primary mb-3">{typeLabel} ZA {project?.client_name?.toUpperCase()}</p>
      <h1 className="text-4xl md:text-5xl font-serif font-normal mb-4 break-words">{doc.title}</h1>
      {doc.description && <p className="text-lg text-dash-muted mb-8 leading-relaxed">{doc.description}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <InfoCard label="Datum" value={formatDate(doc.sent_at || doc.created_at)} />
        <InfoCard label={doc.valid_until ? "Vrijedi do" : "Rok potpisa"} value={formatDate(doc.valid_until || doc.due_date)} />
        <InfoCard label="Projekt" value={project?.title ?? ""} />
        <InfoCard label="Adresa" value={project?.address ?? ""} />
      </div>
      {doc.total_amount != null && <div className="bg-dash-ink text-dash-card rounded-2xl p-8 mb-10 text-center">
        <p className="text-xs uppercase tracking-widest opacity-70 mb-3">UKUPNO S PDV-OM</p>
        <p className="text-4xl md:text-6xl font-serif font-normal">{money(withVat(Number(doc.total_amount)))}</p>
        <p className="text-sm opacity-70 mt-3">Osnovica {money(Number(doc.total_amount))} + PDV 25%</p>
      </div>}
      <div className="flex flex-wrap gap-3 mb-4">
        {url && <Button variant="outline" asChild><a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} className="mr-2" />Otvori PDF</a></Button>}
        <Button variant="outline" onClick={() => void downloadDocument(doc.storage_path, doc.file_name).then(ok => { if (!ok) toast.error("Preuzimanje nije uspjelo", "Pokušajte ponovno."); })}><Download size={16} className="mr-2" />Preuzmi PDF</Button>
      </div>
      {url ? <iframe src={url} title="PDF dokument" className="w-full h-[600px] rounded-xl border border-dash-border hidden sm:block" /> : <div className="h-[600px] rounded-xl bg-dash-soft animate-pulse hidden sm:block" />}
    </div>

    {isPending(doc.status) && <div className="bg-dash-card rounded-2xl border border-dash-border p-6 md:p-8 mt-8">
      <h3 className="text-2xl font-serif font-normal mb-5">Vaš odgovor</h3>
      {mode === "none" && <div className="flex flex-wrap gap-4"><Button onClick={() => setMode("accept")}>Prihvaćam {doc.document_type === "ponuda" ? "ponudu" : "dokument"}</Button><Button variant="outline" onClick={() => setMode("revise")}>Trebam izmjene</Button></div>}
      {mode === "accept" && <form onSubmit={handleSign} className="space-y-5">
        <p>Potvrdom prihvaćate dokument u navedenim uvjetima.</p>
        <div><Label htmlFor="signer">Vaše puno ime (digitalni potpis)</Label><Input id="signer" className="mt-2" value={signerName} onChange={e => setSignerName(e.target.value)} required minLength={3} /></div>
        <div><Label htmlFor="sign-comment">Komentar (opcionalno)</Label><Textarea id="sign-comment" className="mt-2" value={comment} onChange={e => setComment(e.target.value)} rows={3} /></div>
        <label className="flex items-start gap-3 text-sm"><Checkbox className="mt-0.5" checked={terms} onCheckedChange={v => setTerms(v === true)} />Prihvaćam uvjete i sadržaj dokumenta. Suglasan/a sam da ovaj digitalni potpis ima pravni učinak jednak vlastoručnom potpisu.</label>
        <div className="flex gap-3 pt-2"><Button type="button" variant="ghost" onClick={() => setMode("none")}>Natrag</Button><Button type="submit" disabled={busy || signerName.trim().length < 3 || !terms}>Potpiši {doc.document_type === "ponuda" ? "ponudu" : "dokument"}</Button></div>
      </form>}
      {mode === "revise" && <form onSubmit={handleRevise} className="space-y-5">
        <p>Opišite što biste htjeli izmijeniti — Marko će Vam se javiti unutar 24h.</p>
        <div><Label htmlFor="revise-comment">Komentar*</Label><Textarea id="revise-comment" className="mt-2" value={comment} onChange={e => setComment(e.target.value)} rows={5} required placeholder="Npr. Molim da se umjesto Marazzi pločica razmotri Ragno kolekcija..." /></div>
        <div className="flex gap-3"><Button type="button" variant="ghost" onClick={() => setMode("none")}>Natrag</Button><Button type="submit" variant="destructive" disabled={busy || comment.trim().length < 10}>Zatraži izmjene</Button></div>
      </form>}
    </div>}

    {doc.status === "potpisano" && doc.signed_at && <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-3 mb-2"><CheckCircle className="text-primary" size={24} /><h3 className="font-serif text-2xl">Potpisano</h3></div>
      <p>Potpisali ste {formatDate(doc.signed_at)} u {formatTime(doc.signed_at)} kao {doc.signed_by_name}. Kopija je poslana na Vaš email.</p>
      {doc.client_comment && <p className="mt-3 italic text-dash-subtle">„{doc.client_comment}”</p>}
    </div>}
    {doc.status === "odbijeno" && <div className="bg-dash-card border border-dash-border rounded-2xl p-6 mt-8"><h3 className="font-serif text-2xl mb-2">Zatražene izmjene</h3><p className="text-dash-muted">Marko priprema izmijenjenu verziju.</p>{doc.client_comment && <p className="mt-3 italic text-dash-subtle">„{doc.client_comment}”</p>}</div>}
    {doc.status === "otkazano" && <div className="bg-dash-card border border-dash-border rounded-2xl p-6 mt-8"><h3 className="font-serif text-2xl mb-2">Dokument je otkazan</h3><p className="text-dash-muted">Ovaj dokument više nije važeći.</p></div>}
  </div>;
};
export default DokumentPregled;
