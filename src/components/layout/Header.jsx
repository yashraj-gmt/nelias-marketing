import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { DesktopNav } from "./DesktopNav";
import { HeaderCtas } from "./HeaderCtas";
import { MobileMenu } from "./MobileMenu";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";

/**
 * Sticky main site header.
 * Adjusts heights (64px mobile, 72px from md) and reveals shadow on scroll.
 */
export function Header() {
  const { t } = useTranslation();
  const isScrolled = useScrolled(8);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-surface transition-shadow duration-200",
        isScrolled && "border-b border-line shadow-card",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Logo />

        <DesktopNav />

        {/* Right cluster: CTAs, ThemeToggle and Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle visible below xl */}
          <div className="xl:hidden">
            <ThemeToggle size="md" />
          </div>

          {/* Header CTA: Book a Demo (md+) */}
          <div className="hidden md:block">
            <HeaderCtas location="header" size="md" />
          </div>

          {/* Hamburger button visible below xl */}
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={t("a11y.openMenu")}
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md text-fg-strong transition-colors hover:bg-surface-sunken hover:text-heading xl:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </Container>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
