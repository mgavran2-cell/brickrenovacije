import { useEffect } from "react";

const THRESHOLDS = [30, 60, 120, 300]; // seconds

const useTimeOnPageTracking = () => {
  useEffect(() => {
    const reached = new Set<number>();
    const start = Date.now();

    const interval = setInterval(() => {
      if (typeof (window as any).gtag !== "function") return;

      const elapsed = Math.floor((Date.now() - start) / 1000);

      for (const t of THRESHOLDS) {
        if (elapsed >= t && !reached.has(t)) {
          reached.add(t);
          (window as any).gtag("event", "time_on_page", {
            event_category: "engagement",
            event_label: `${t}s`,
            value: t,
          });
        }
      }

      if (reached.size === THRESHOLDS.length) clearInterval(interval);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
};

export default useTimeOnPageTracking;
