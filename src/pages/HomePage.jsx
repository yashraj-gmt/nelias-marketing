import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo";
import { HomeHero } from "@/sections/home/HomeHero";
import { ModulesSection } from "@/sections/home/ModulesSection";
import { HomePricingSection } from "@/sections/home/HomePricingSection";
import { SecuritySection } from "@/sections/home/SecuritySection";
import { WhySection } from "@/sections/home/WhySection";
import { AboutSection } from "@/sections/home/AboutSection";
import { HomeFinalCta } from "@/sections/home/HomeFinalCta";
import { features } from "@/config/features";

// TODO(Debass): the document's problem, platform, configurator, hosting, sector packs and FAQ parts are intentionally not on Home.

/**
 * Home page for the NELIAS marketing portal.
 * Structured into exactly seven sections according to the 26 October 2026 content specification.
 */
export default function HomePage() {
  const { t } = useTranslation();

  // TODO(Debass): the document gives the description with "public prices in FCFA"; while prices are not public it is shortened to its first two sentences.
  const seoTitle = t("home:seo.title");
  const seoDescription = features.pricingPublic
    ? t("home:seo.description")
    : t("home:seo.descriptionNoPrices");

  return (
    <>
      <Seo pageKey="home" title={seoTitle} description={seoDescription} />
      <HomeHero />
      <ModulesSection />
      <HomePricingSection />
      <SecuritySection />
      <WhySection />
      <AboutSection />
      <HomeFinalCta />
    </>
  );
}
