import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CtaLink } from "@/components/common/CtaLink";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";

/**
 * Sticky bottom CTA bar for mobile screens (below md).
 * Shown after scrolling 480px, automatically hides when the footer is in view
 * or when the user is on /demo, /contact, /sign-in, or /sign-up.
 */
export function StickyMobileCta() {
  const { pathname } = useLocation();
  const isScrolled = useScrolled(480);
  const [footerIntersecting, setFooterIntersecting] = useState(false);

  const isExcludedRoute =
    pathname === "/demo" ||
    pathname === "/contact" ||
    pathname === "/sign-in" ||
    pathname === "/sign-up";

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(footer);
    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const isVisible = isScrolled && !footerIntersecting && !isExcludedRoute;

  return (
    <div
      aria-hidden={!isVisible ? "true" : undefined}
      inert={!isVisible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface-raised/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-200 md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <CtaLink intent="demo" size="lg" location="sticky" className="w-full" />
    </div>
  );
}
