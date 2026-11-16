import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Short-lived (1h) signed URL for a private project document. */
export const useDocumentUrl = (path: string | null | undefined) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let live = true; setUrl(null);
    if (path) supabase.storage.from("project-documents").createSignedUrl(path, 3600).then(({ data }) => { if (live) setUrl(data?.signedUrl ?? null); });
    return () => { live = false; };
  }, [path]);
  return url;
};

export const downloadDocument = async (path: string, fileName: string) => {
  const { data } = await supabase.storage.from("project-documents").createSignedUrl(path, 3600, { download: fileName });
  if (!data?.signedUrl) return false;
  window.open(data.signedUrl, "_blank", "noopener");
  return true;
};
