import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { LanguageAnnouncer } from "@/components/common/LanguageAnnouncer";

/**
 * Root layout wrapping all routes.
 * Contains utility bar, sticky header, main content landmark,
 * footer, sticky mobile CTA, language announcer and scroll-to-top handler.
 */
export default function RootLayout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  // Move focus to main on route change (without scrolling)
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <LanguageAnnouncer />
      <UtilityBar />
      <Header />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <StickyMobileCta />
      <ScrollToTop />
    </div>
  );
}
