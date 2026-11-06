import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MessageSquare, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/common/Logo";
import { footerNav, legalNav } from "@/config/navigation";
import { site } from "@/config/site";
import { toTelHref, toWhatsAppHref } from "@/lib/contact";

/**
 * Site footer with brand ribbon, plate logo, explore links, and contact channels.
 */
export function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="site-footer" data-tone="inverse" className="relative bg-brand-deep text-fg-inverse">
      {/* 4px top brand ribbon */}
      <div className="h-1 w-full bg-brand-ribbon" role="presentation" />

      <Container className="py-8 md:py-10">
        <div className="flex flex-col items-start gap-10 sm:flex-row sm:flex-wrap lg:flex-nowrap lg:justify-between">
          {/* Brand column */}
          <div className="flex max-w-sm shrink-0 flex-col items-start lg:max-w-md">
            <Logo variant="plate" />
            <p className="mt-3.5 text-sm leading-relaxed text-fg-inverse-muted">
              {t("brand.footerTagline")}
            </p>
          </div>

          {/* Explore column */}
          <div className="shrink-0">
            <h2 className="mb-3 text-base font-semibold text-white">
              {t("footer.exploreHeading")}
            </h2>
            <nav aria-label={t("footer.navLabel")}>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5 sm:gap-x-12">
                {footerNav.map(({ key, to }) => (
                  <li key={key}>
                    <NavLink
                      to={to}
                      onClick={(e) => {
                        if (to === "#") e.preventDefault();
                      }}
                      className="inline-flex py-1 text-sm text-fg-inverse-muted transition-colors hover:text-white hover:underline"
                    >
                      {t(`nav.${key}`)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact column */}
          <div className="shrink-0">
            <h2 className="mb-3 text-base font-semibold text-white">
              {t("footer.contactHeading")}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {site.contact.email && (
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="inline-flex items-center gap-2.5 py-1 text-sm text-fg-inverse-muted transition-colors hover:text-white hover:underline"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
                    <span>{site.contact.email}</span>
                  </a>
                </li>
              )}
              {site.contact.phone && (
                <li>
                  <a
                    href={toTelHref(site.contact.phone)}
                    className="inline-flex items-center gap-2.5 py-1 text-sm text-fg-inverse-muted transition-colors hover:text-white hover:underline"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
                    <span>{site.contact.phone}</span>
                  </a>
                </li>
              )}
              {site.contact.whatsapp && (
                <li>
                  <a
                    href={toWhatsAppHref(site.contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("footer.whatsapp")} ${site.contact.whatsapp}`}
                    className="inline-flex items-center gap-2.5 py-1 text-sm text-fg-inverse-muted transition-colors hover:text-white hover:underline"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
                    <span>
                      {t("footer.whatsapp")}: {site.contact.whatsapp}
                    </span>
                  </a>
                </li>
              )}
              {site.address && (
                <li className="inline-flex items-center gap-2.5 py-1 text-sm text-fg-inverse-muted">
                  <MapPin className="h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
                  <span>{site.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom hairline & legal bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-fg-inverse-muted sm:flex-row">
          <p>{t("brand.copyright")}</p>
          <nav
            aria-label={t("footer.legalNavLabel")}
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {legalNav.map(({ key, to }) => (
              <NavLink
                key={key}
                to={to}
                className="inline-flex items-center py-1 text-fg-inverse-muted transition-colors hover:text-white hover:underline"
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
