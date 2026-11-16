import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { DOCUMENT_TYPE_LABELS, isPending, type ProjectDocument } from "@/lib/documents";
import { formatDate } from "@/lib/adminFormat";

const DocumentCard = ({ doc }: { doc: ProjectDocument }) => {
  const navigate = useNavigate();
  const deadline = doc.valid_until ? `Vrijedi do ${formatDate(doc.valid_until)}` : doc.due_date ? `Rok ${formatDate(doc.due_date)}` : null;
  return <button type="button" onClick={() => navigate(`/dashboard/dokumenti/${doc.id}`)} className="w-full text-left bg-dash-card rounded-2xl border border-dash-border p-5 flex items-center gap-4 hover:bg-dash-hover/40 transition-colors">
    <div className="relative shrink-0"><FileText className="text-primary" size={26} />{isPending(doc.status) && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />}</div>
    <div className="flex-1 min-w-0"><p className="text-xs text-dash-subtle">{doc.document_number} · <span className="px-2 py-0.5 rounded-full bg-dash-soft text-dash-ink">{DOCUMENT_TYPE_LABELS[doc.document_type]}</span></p><p className="font-medium mt-1 break-words">{doc.title}</p>{deadline && <p className="text-sm text-dash-muted mt-0.5">{deadline}</p>}</div>
    <StatusBadge status={doc.status} /><ChevronRight className="text-dash-subtle shrink-0" size={18} />
  </button>;
};
export default DocumentCard;
