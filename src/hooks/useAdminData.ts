import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockProjects, mockRequests, mockContractors, type AdminProject, type AdminRequest, type AdminContractor } from "@/lib/adminMock";

const PHASE: Record<string, string> = { procjena: "Procjena", ugovor: "Ugovor", priprema: "Priprema", izvodenje: "Izvođenje", active: "Izvođenje", predaja: "Predaja", zavrseno: "Završeno", completed: "Završeno" };

export const useAdminRequests = () => {
  const [rows, setRows] = useState<AdminRequest[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const { data } = await supabase.from("renovation_requests").select("*").order("created_at", { ascending: false });
    if (data && data.length) { setRows(data as AdminRequest[]); setIsMock(false); }
    else { setRows(mockRequests); setIsMock(true); }
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
    const ch = supabase.channel("admin-requests").on("postgres_changes", { event: "*", schema: "public", table: "renovation_requests" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);
  return { rows, setRows, isMock, loading, reload: load };
};

export const useAdminContractors = () => {
  const [rows, setRows] = useState<AdminContractor[]>([]);
  const [isMock, setIsMock] = useState(false);
  const load = useCallback(async () => {
    const { data } = await supabase.from("contractor_applications").select("*").order("created_at", { ascending: false });
    if (data && data.length) { setRows(data as AdminContractor[]); setIsMock(false); }
    else { setRows(mockContractors); setIsMock(true); }
  }, []);
  useEffect(() => { load(); }, [load]);
  return { rows, setRows, isMock, reload: load };
};

export const useAdminProjects = () => {
  const [rows, setRows] = useState<AdminProject[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (!data || !data.length) { setRows(mockProjects); setIsMock(true); setLoading(false); return; }
      const ids = [...new Set(data.map((p) => p.user_id))];
      const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
      const byId = new Map((profs ?? []).map((p) => [p.id, p]));
      setRows(data.map((p) => {
        const prof = byId.get(p.user_id);
        return {
          id: p.id, title: p.title, client_name: prof?.full_name || prof?.email || "Klijent", location: p.location ?? "—", address: p.location ?? "—",
          type: p.type ?? "—", sqm: null, total_price: null, paid: null, progress: p.progress, status: p.status,
          current_phase: PHASE[p.status] ?? p.status, current_task: "—", start_date: p.start_date, end_date: null, work_hours: "—",
          teams: [], client_email: prof?.email ?? "", client_phone: "",
        };
      }));
      setIsMock(false); setLoading(false);
    })();
  }, []);
  return { rows, isMock, loading };
};
