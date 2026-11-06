import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll to top on route change, unless the URL has a hash (anchor link).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
