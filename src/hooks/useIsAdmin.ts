import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useIsAdmin = () => {
  const { session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" })
      .then(({ data }) => {
        setIsAdmin(data === true);
        setLoading(false);
      });
  }, [session?.user?.id]);

  return { isAdmin, loading };
};
