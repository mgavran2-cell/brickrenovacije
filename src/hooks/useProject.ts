import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Project, ProjectActivity, ProjectPhase, ProjectTask } from "@/lib/projects";

export function useProject(id?: string, client = false) {
  const { session, loading: authLoading } = useAuth();
  const uid = session?.user.id;
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const query = supabase.from("projects").select("*");
      const result = client
        ? await query.eq("client_id", uid ?? "").eq("is_draft", false).order("created_at", { ascending: false }).limit(1).maybeSingle()
        : await query.eq("id", id ?? "").maybeSingle();
      if (result.error) throw result.error;
      if (!result.data) { setProject(null); setPhases([]); setTasks([]); setActivities([]); return null; }
      const pid = result.data.id;
      const [ph, tk, ac] = await Promise.all([
        supabase.from("project_phases").select("*").eq("project_id", pid).order("phase_order"),
        supabase.from("project_tasks").select("*").eq("project_id", pid).order("created_at"),
        supabase.from("project_activity_log").select("*").eq("project_id", pid).order("created_at", { ascending: false }).limit(10),
      ]);
      if (ph.error) throw ph.error;
      if (tk.error) throw tk.error;
      setProject(result.data);
      setPhases(ph.data ?? []);
      setTasks(tk.data ?? []);
      setActivities(ac.data ?? []);
      return pid;
    } catch {
      setError("Podatke projekta nije moguće učitati. Pokušajte ponovno.");
      return null;
    }
  }, [id, client, uid]);

  useEffect(() => {
    if (authLoading) return;
    let live = true;
    setLoading(true); setError(""); setProject(null); setPhases([]); setTasks([]); setActivities([]);
    if ((client && !uid) || (!client && !id)) { setLoading(false); return; }
    let channel: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const pid = await load();
      if (live) setLoading(false);
      if (live && pid) {
        channel = supabase
          .channel(`project-${pid}`)
          .on("postgres_changes", { event: "*", schema: "public", table: "project_tasks", filter: `project_id=eq.${pid}` }, () => void load())
          .on("postgres_changes", { event: "*", schema: "public", table: "project_activity_log", filter: `project_id=eq.${pid}` }, () => void load())
          .on("postgres_changes", { event: "*", schema: "public", table: "project_phases", filter: `project_id=eq.${pid}` }, () => void load())
          .subscribe();
      }
    })();
    return () => { live = false; if (channel) void supabase.removeChannel(channel); };
  }, [id, client, uid, authLoading, load]);

  return { project, phases, tasks, activities, loading, error, reload: load };
}
