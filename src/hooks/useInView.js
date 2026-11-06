import { useEffect, useState } from "react";

/**
 * Hook to observe if an element has scrolled into view.
 *
 * @param {import("react").RefObject<HTMLElement | null>} ref
 * @param {Object} [options]
 * @param {boolean} [options.once=true]
 * @param {number} [options.threshold=0.02]
 * @param {string} [options.rootMargin="0px 0px 40px 0px"]
 * @returns {boolean}
 */
export function useInView(
  ref,
  { once = true, threshold = 0.02, rootMargin = "0px 0px 40px 0px" } = {},
) {
  const [isInView, setIsInView] = useState(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const element = ref?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, once, threshold, rootMargin]);

  return isInView;
}
