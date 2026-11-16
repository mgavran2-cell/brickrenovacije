import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isPending, type ProjectDocument } from "@/lib/documents";

/** Client's own sent documents (RLS scopes to their finalized projects), kept live via realtime. */
export const useClientDocuments = () => {
  const { session, loading: authLoading } = useAuth();
  const uid = session?.user.id;
  const [docs, setDocs] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("project_documents").select("*").neq("status", "draft").order("created_at", { ascending: false });
    if (error) setError("Dokumente nije moguće učitati."); else { setDocs(data); setError(""); }
    setLoading(false);
  }, []);
  useEffect(() => {
    if (authLoading) return;
    if (!uid) { setLoading(false); return; }
    void load();
    const ch = supabase.channel(`client-docs-${uid}-${Math.random().toString(36).slice(2)}`).on("postgres_changes", { event: "*", schema: "public", table: "project_documents" }, () => void load()).subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [uid, authLoading, load]);
  return { docs, loading, error, reload: load };
};

export const useClientPendingDocsCount = () => {
  const { docs } = useClientDocuments();
  return docs.filter(d => isPending(d.status)).length;
};
