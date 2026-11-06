import { useEffect, useState } from "react";

/**
 * Returns true if window.scrollY exceeds the threshold.
 * Passive scroll listener throttled with requestAnimationFrame.
 * Runs once on mount to set the initial value and cleans up on unmount.
 *
 * @param {number} [threshold=8]
 * @returns {boolean}
 */
export function useScrolled(threshold = 8) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let rafId = null;

    const checkScroll = () => {
      const scrolled = window.scrollY > threshold;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        checkScroll();
        rafId = null;
      });
    };

    // Run once on mount to determine initial scroll position
    checkScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [threshold]);

  return isScrolled;
}
