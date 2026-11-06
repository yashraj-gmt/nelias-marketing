import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { PageHeader } from "@/components/patterns/PageHeader";
import { CapabilityMosaic } from "@/sections/features/CapabilityMosaic";
import { ModulesSection } from "@/sections/home/ModulesSection";
import { FeatureFilterList } from "@/sections/features/FeatureFilterList";
import { SecuritySection } from "@/sections/home/SecuritySection";
import { FeaturesSectors } from "@/sections/features/FeaturesSectors";
import { FeaturesClosing } from "@/sections/features/FeaturesClosing";

// TODO(Debass): the document gives no per-module description; modules appear as names grouped by family next to the existing capability areas. Supply descriptions to enrich this page.

/**
 * Features page presenting platform modules, capability areas, security, sector configurations, and closing CTA.
 *
 * @returns {import("react").JSX.Element}
 */
export default function FeaturesPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo pageKey="features" />
      <PageHeader
        title={t("features:hero.title")}
        lead={t("features:hero.lead")}
        tone="tint"
        spacing="md"
        className="py-12 md:py-16 lg:py-20"
        titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.25rem] lg:leading-[1.1] max-w-[20ch]"
        leadClassName="mt-4 md:mt-5 text-base sm:text-lg lg:text-lead leading-relaxed max-w-[48ch]"
        media={<CapabilityMosaic />}
      />

      {/* 2. Modules */}
      <ModulesSection tone="muted" headingId="features-modules-heading" />
      <div className="-mt-10 bg-surface-muted pb-12 md:-mt-16 md:pb-16">
        <Container>
          <TextLink to="/pricing">{t("home:pricing.cta")}</TextLink>
        </Container>
      </div>

      {/* 3. Capability areas */}
      <FeatureFilterList />

      {/* 4. Security */}
      {/* TODO(Debass): confirm the audit log of administration, billing and provisioning actions and single sign-on "depending on the offer" exist as stated. */}
      <SecuritySection tone="muted" headingId="features-security-heading" />

      {/* 5. Sector configurations & Industry+ Packs */}
      <FeaturesSectors tone="default" />

      {/* 6. Closing conversion CTA */}
      <FeaturesClosing />
    </>
  );
}
