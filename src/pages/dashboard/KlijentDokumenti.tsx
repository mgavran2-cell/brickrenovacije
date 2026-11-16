import { FileText } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import DocumentCard from "@/components/dashboard/DocumentCard";
import { useClientDocuments } from "@/hooks/useClientDocuments";
import { groupClientDocuments } from "@/lib/documents";

const KlijentDokumenti = () => {
  const { docs, loading, error } = useClientDocuments();
  if (loading) return <PageSkeleton />;
  const g = groupClientDocuments(docs);
  const groups = [["Čekaju vaš potpis", g.pending], ["Potpisani", g.signed], ["Ostali", g.other]] as const;
  return <div className="max-w-4xl p-6 md:p-10">
    <h1 className="text-4xl md:text-5xl font-serif mb-3">Dokumenti</h1>
    <p className="text-lg text-dash-muted mb-10">{error || `${g.pending.length} čeka potpis · ${g.signed.length} potpisanih`}</p>
    {docs.length === 0 ? <EmptyState icon={FileText} title="Još nema dokumenata" description="Kad Marko pošalje ponudu ili aneks, pojavit će se ovdje." /> :
      groups.filter(([, list]) => list.length).map(([title, list]) => <section key={title} className="mb-10"><h2 className="text-2xl font-serif mb-4">{title}</h2><div className="space-y-3">{list.map(d => <DocumentCard key={d.id} doc={d} />)}</div></section>)}
  </div>;
};
export default KlijentDokumenti;
