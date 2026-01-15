import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Ensures in-app navigation to #hash anchors works reliably with React Router.
 * It waits for the target element to exist (SPA rendering) and then scrolls to it.
 */
const ScrollToHash = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.replace("#", ""));
    if (!id) return;

    // "Kako funkcionira" section exists only on the home page.
    if (id === "kako-funkcionira" && location.pathname !== "/") {
      navigate({ pathname: "/", hash: "#kako-funkcionira" }, { replace: true });
      return;
    }

    let cancelled = false;
    let attempt = 0;

    const tryScroll = () => {
      if (cancelled) return;

      const el = document.getElementById(id);
      if (el) {
        // Use smooth scroll for a more polished UX.
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      attempt += 1;
      if (attempt > 10) return;

      // Retry a few times to allow async rendering/animations.
      window.setTimeout(tryScroll, 50);
    };

    // Start after the current paint.
    window.setTimeout(tryScroll, 0);

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.hash, navigate]);

  return null;
};

export default ScrollToHash;
