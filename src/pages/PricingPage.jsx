import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo";
import { PageHeader } from "@/components/patterns/PageHeader";
import { buttonStyles } from "@/components/ui/button-styles";
import { pricingCatalog } from "@/data/pricing-catalog";
import { features } from "@/config/features";
import { track, EVENTS } from "@/lib/analytics";
import { PlansSection } from "@/sections/pricing/PlansSection";
import { ExtensionsSection } from "@/sections/pricing/ExtensionsSection";
import { OptionalChargesSection } from "@/sections/pricing/OptionalChargesSection";
import { EnterpriseSection } from "@/sections/pricing/EnterpriseSection";

// TODO(Debass): the PDF intro continues "Prices below are internal commercial V2 reference figures, not automatically approved for public publication." This internal note is intentionally NOT displayed.
// TODO(Debass): "Compare plans" and "Optional charges" are functional labels taken from the V3 notes ("interactive plan comparison", "separate inclusions from optional charges"); the PDF has no heading text for them.

/**
 * Pricing page displaying plans, extensions,
 * optional add-ons/connectors, and enterprise block.
 *
 * @returns {import("react").JSX.Element}
 */
export default function PricingPage() {
  const { t } = useTranslation();
  const showPrices = features.pricingPublic;
  const [billing, setBilling] = useState("monthly");
  const hasWarnedRef = useRef(false);

  // Track page view
  useEffect(() => {
    track(EVENTS.PRICING_VIEW);
  }, []);

  // Intentional developer warning when pricing is public in DEV but catalog figures are not approved
  useEffect(() => {
    if (
      import.meta.env.DEV &&
      showPrices &&
      !pricingCatalog.approvedForPublic &&
      !hasWarnedRef.current
    ) {
      hasWarnedRef.current = true;
      console.warn(
        "[pricing] Amounts shown are internal commercial reference figures not approved for public publication.",
      );
    }
  }, [showPrices]);

  const handleBillingChange = (newBilling) => {
    setBilling(newBilling);
    track(EVENTS.BILLING_CHANGE, { billing: newBilling });
  };

  return (
    <>
      <Seo pageKey="pricing" />

      {/* 1. Header */}
      <PageHeader
        title={t("pricing:hero.title")}
        lead={t("pricing:hero.lead")}
        tone="tint"
        spacing="md"
        className="py-12 md:py-16 lg:py-20"
        titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.25rem] lg:leading-[1.1] max-w-[32ch]"
        leadClassName="mt-4 md:mt-5 text-base sm:text-lg lg:text-lead leading-relaxed max-w-2xl"
        actions={
          <Link to="/configure" className={buttonStyles({ variant: "primary", size: "lg" })}>
            {t("common:cta.simulatePrice")}
          </Link>
        }
      />

      {/* 2. Plans cards with billing toggle */}
      <PlansSection
        billing={billing}
        onBillingChange={handleBillingChange}
        showPrices={showPrices}
        tone="default"
      />

      {/* 3. Extensions table (rendered only when prices are public) */}
      {showPrices && <ExtensionsSection tone="muted" />}

      {/* 4. Add-ons and connectors */}
      <OptionalChargesSection tone={showPrices ? "default" : "muted"} />

      {/* 5. Enterprise block */}
      <EnterpriseSection tone={showPrices ? "muted" : "default"} />
    </>
  );
}
