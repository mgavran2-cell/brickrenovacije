import { useEffect } from "react";

const useOutboundLinkTracking = () => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.href;
      if (!href) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.hostname === window.location.hostname) return;

        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", "outbound_click", {
            event_category: "engagement",
            event_label: href,
            transport_type: "beacon",
          });
        }
      } catch {
        // invalid URL, skip
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);
};

export default useOutboundLinkTracking;
