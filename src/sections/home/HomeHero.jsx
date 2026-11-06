import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/button-styles";
import { features } from "@/config/features";
import { EVENTS, track } from "@/lib/analytics";
import { HeroComposition } from "./HeroComposition";
import { cn } from "@/lib/cn";

/**
 * Main Hero section of the Home page.
 */
export function HomeHero() {
  const { t } = useTranslation();

  return (
    <Section
      id="hero"
      tone="default"
      spacing="lg"
      aria-labelledby="hero-heading"
      className="overflow-hidden py-14 md:py-20 lg:py-24"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Text column */}
          <div className="flex flex-col items-start text-left lg:col-span-6">
            <p className="mb-4 text-sm font-semibold text-fg-muted">{t("home:hero.eyebrow")}</p>

            <h1
              id="hero-heading"
              className="max-w-[20ch] font-display text-h1 leading-tight font-semibold tracking-tight text-heading"
            >
              {t("home:hero.title")}
            </h1>

            <p className="mt-6 max-w-[52ch] text-lead leading-relaxed text-fg-muted">
              {t("home:hero.subtitle")}
            </p>

            <div className="mt-8 flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:items-center">
              <Link
                to="/configure"
                onClick={() => track(EVENTS.CTA_CLICK, { intent: "configure", location: "hero" })}
                className={cn(
                  buttonStyles({ variant: "primary", size: "lg" }),
                  "w-full text-center sm:w-auto",
                )}
              >
                {t("home:hero.simulatePrice")}
              </Link>
              <Link
                to="/contact"
                onClick={() => track(EVENTS.CTA_CLICK, { intent: "contact", location: "hero" })}
                className={cn(
                  buttonStyles({ variant: "outline", size: "lg" }),
                  "w-full text-center sm:w-auto",
                )}
              >
                {t("common:cta.talkToExpert")}
              </Link>
            </div>

            {features.pricingPublic && (
              <p className="mt-6 max-w-[52ch] text-sm text-fg-muted">
                {t("home:hero.reassurance")}
              </p>
            )}
          </div>

          {/* Decorative composition column */}
          <div className="mt-4 w-full lg:col-span-6 lg:mt-0">
            <HeroComposition />
          </div>
        </div>
      </Container>
    </Section>
  );
}
