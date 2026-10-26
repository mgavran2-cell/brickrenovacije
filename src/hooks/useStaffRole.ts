import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/** True when the signed-in user has the admin or moderator role (checked server-side via has_role). */
export const useStaffRole = () => {
  const { session, loading: authLoading } = useAuth();
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const uid = session?.user?.id;
    if (!uid) { setIsStaff(false); setLoading(false); return; }
    Promise.all([
      supabase.rpc("has_role", { _user_id: uid, _role: "admin" }),
      supabase.rpc("has_role", { _user_id: uid, _role: "moderator" }),
    ]).then(([a, m]) => { setIsStaff(a.data === true || m.data === true); setLoading(false); });
  }, [session?.user?.id, authLoading]);

  return { isStaff, loading: loading || authLoading };
};
