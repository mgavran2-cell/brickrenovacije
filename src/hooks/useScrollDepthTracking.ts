import { useEffect } from "react";

const THRESHOLDS = [25, 50, 75, 100];

const useScrollDepthTracking = () => {
  useEffect(() => {
    const reached = new Set<number>();

    const handleScroll = () => {
      if (typeof (window as any).gtag !== "function") return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const t of THRESHOLDS) {
        if (percent >= t && !reached.has(t)) {
          reached.add(t);
          (window as any).gtag("event", "scroll_depth", {
            event_category: "engagement",
            event_label: `${t}%`,
            value: t,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};

export default useScrollDepthTracking;
