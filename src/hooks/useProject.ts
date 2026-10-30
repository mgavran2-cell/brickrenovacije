import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Project, ProjectPhase } from "@/lib/projects";

export function useProject(id?: string, client = false) {
  const { session, loading: authLoading } = useAuth();
  const uid = session?.user.id;
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (authLoading) return;
    let live = true;
    setLoading(true); setError(""); setProject(null); setPhases([]);
    if ((client && !uid) || (!client && !id)) { setLoading(false); return; }
    (async () => {
      try {
        const query = supabase.from("projects").select("*");
        const result = client
          ? await query.eq("client_id", uid ?? "").eq("is_draft", false).order("created_at", { ascending: false }).limit(1).maybeSingle()
          : await query.eq("id", id ?? "").maybeSingle();
        if (result.error) throw result.error;
        if (result.data) {
          const response = await supabase.from("project_phases").select("*").eq("project_id", result.data.id).order("phase_order");
          if (response.error) throw response.error;
          if (live) { setProject(result.data); setPhases(response.data ?? []); }
        }
      } catch { if (live) setError("Podatke projekta nije moguće učitati. Pokušajte ponovno."); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, [id, client, uid, authLoading]);
  return { project, phases, loading, error };
}