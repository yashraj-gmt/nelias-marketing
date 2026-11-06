import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo";
import { PageHeader } from "@/components/patterns/PageHeader";
import { IndustriesHub } from "@/sections/industries/IndustriesHub";
import { IndustryExplorer } from "@/sections/industries/IndustryExplorer";
import { FeaturesSectors } from "@/sections/features/FeaturesSectors";
import { WhySection } from "@/sections/home/WhySection";
import { IndustriesClosing } from "@/sections/industries/IndustriesClosing";

/**
 * Industries page presenting sector-aware configurations, interactive industry explorer,
 * sector capabilities, and why NELIAS propositions.
 *
 * @returns {import("react").JSX.Element}
 */
export default function IndustriesPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo pageKey="industries" />
      <PageHeader
        title={t("industries:landing.title")}
        lead={t("industries:landing.lead")}
        tone="tint"
        spacing="md"
        className="py-12 md:py-16 lg:py-20"
        titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.25rem] lg:leading-[1.1] max-w-[20ch]"
        leadClassName="mt-4 md:mt-5 text-base sm:text-lg lg:text-lead leading-relaxed max-w-[48ch]"
        media={<IndustriesHub />}
      />

      {/* 2. Industry Explorer (cards + inline detail) */}
      <IndustryExplorer tone="default" />

      {/* 3. Sector configurations and Industry+ Packs */}
      {/* TODO(Debass): the packs are not sold yet; the document gives no per-pack page. */}
      <FeaturesSectors tone="muted" showIndustriesLink={false} />

      {/* 4. Why NELIAS */}
      <WhySection tone="default" headingId="industries-why-heading" />

      {/* 5. Closing conversion CTA */}
      <IndustriesClosing />
    </>
  );
}
