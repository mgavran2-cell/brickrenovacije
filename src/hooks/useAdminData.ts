import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockRequests, mockContractors, type AdminRequest, type AdminContractor } from "@/lib/adminMock";

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
  const [rows, setRows] = useState<import("@/lib/projects").Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    supabase.from("projects").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (!live) return;
      setRows(data ?? []); setError(error ? "Projekte nije moguće učitati." : ""); setLoading(false);
    });
    return () => { live = false; };
  }, []);
  return { rows, isMock: false, loading, error };
};
