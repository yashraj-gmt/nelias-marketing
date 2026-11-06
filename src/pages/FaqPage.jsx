import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo";
import { PageHeader } from "@/components/patterns/PageHeader";
import { CtaBand } from "@/components/patterns/CtaBand";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/button-styles";
import { FaqGroups } from "@/sections/faq/FaqGroups";
import { faqGroups, needsPrices } from "@/data/faq-content";
import { features } from "@/config/features";
import { EVENTS, track } from "@/lib/analytics";

/**
 * Frequently asked questions page (/faq).
 * Consolidates all company, product, hosting, and pricing questions into topic groups.
 */
export default function FaqPage() {
  const { t } = useTranslation();

  // Compute groups that have at least one visible item based on pricing public gate
  const visibleGroups = faqGroups.filter((group) => {
    return group.items.some((itemKey) => {
      if (needsPrices.includes(itemKey) && !features.pricingPublic) {
        return false;
      }
      return true;
    });
  });

  const actions = (
    <>
      <Link
        to="/demo"
        onClick={() => track(EVENTS.CTA_CLICK, { intent: "demo", location: "faq-final" })}
        className={buttonStyles({ variant: "primary", size: "lg" })}
      >
        {t("common:cta.bookDemo")}
      </Link>
      <Link
        to="/contact"
        onClick={() => track(EVENTS.CTA_CLICK, { intent: "contact", location: "faq-final" })}
        className={buttonStyles({ variant: "onDark", size: "lg" })}
      >
        {t("common:cta.talkToExpert")}
      </Link>
    </>
  );

  return (
    <>
      {/* TODO(Debass): no approved SEO description exists for the FAQ page. */}
      <Seo title={t("faq:seo.title")} />

      <PageHeader
        title={t("faq:page.title")}
        tone="tint"
        spacing="sm"
        accent={true}
        className="py-6 sm:py-8 md:py-10 [&_.bg-brand-ribbon]:mx-auto [&_.max-w-3xl]:mx-auto [&_.max-w-3xl]:text-center"
      />

      <Section tone="default" spacing="lg">
        <Container>
          {/* Topic jump list navigation */}
          <nav aria-label={t("faq:page.jumpLabel")} className="mb-12 flex justify-center">
            <ul className="flex flex-wrap justify-center gap-2.5">
              {visibleGroups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#group-${group.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-fg shadow-xs transition-colors hover:border-accent hover:bg-surface-tint hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    {t(`faq:groups.${group.id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Grouped questions centered */}
          <div className="mx-auto max-w-3xl">
            <FaqGroups groups={visibleGroups} />
          </div>
        </Container>
      </Section>

      {/* Closing conversion band */}
      <CtaBand
        id="faq-closing"
        tone="inverse"
        aria-label={t("faq:page.nextStep")}
        title={t("faq:closing.title")}
        body={t("faq:closing.body")}
        actions={actions}
      />
    </>
  );
}
