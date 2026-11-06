import { useState, useEffect } from "react";

/**
 * Hook to determine current grid column count based on Tailwind breakpoints:
 * - < 640px (sm): 1 column
 * - 640px to 1023px (lg): 2 columns
 * - >= 1024px: 4 columns
 *
 * @returns {1 | 2 | 4} Number of grid columns
 */
export function useGridColumns() {
  const getColumns = () => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return 1;
    }
    if (window.matchMedia("(min-width: 1024px)").matches) {
      return 4;
    }
    if (window.matchMedia("(min-width: 640px)").matches) {
      return 2;
    }
    return 1;
  };

  const [columns, setColumns] = useState(getColumns);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mqlLg = window.matchMedia("(min-width: 1024px)");
    const mqlSm = window.matchMedia("(min-width: 640px)");

    const handleChange = () => {
      setColumns(getColumns());
    };

    if (mqlLg.addEventListener) {
      mqlLg.addEventListener("change", handleChange);
      mqlSm.addEventListener("change", handleChange);
    } else {
      mqlLg.addListener(handleChange);
      mqlSm.addListener(handleChange);
    }

    setColumns(getColumns());

    return () => {
      if (mqlLg.removeEventListener) {
        mqlLg.removeEventListener("change", handleChange);
        mqlSm.removeEventListener("change", handleChange);
      } else {
        mqlLg.removeListener(handleChange);
        mqlSm.removeListener(handleChange);
      }
    };
  }, []);

  return columns;
}
