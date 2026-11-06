import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Tabs } from "@/components/ui/Tabs";
import { industries } from "@/data/industries";
import { industryProfiles } from "@/data/home-content";
import { track, EVENTS } from "@/lib/analytics";
import { FeatureList } from "./FeatureList";

/**
 * Filterable capability area section with industry pill tabs.
 * Synchronizes selected industry tab with URL query parameter (?industry=<slug>).
 *
 * @returns {import("react").JSX.Element}
 */
export function FeatureFilterList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawIndustry = searchParams.get("industry");
  const selectedIndustry = industries.includes(rawIndustry) ? rawIndustry : "all";

  const handleFilterChange = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") {
      next.delete("industry");
    } else {
      next.set("industry", value);
    }
    setSearchParams(next, { replace: true, preventScrollReset: true });
    track(EVENTS.FILTER_CHANGE, { filter: "industry", value });
  };

  const tabItems = [
    {
      id: "all",
      label: t("features:page.filterAll"),
      icon: LayoutGrid,
      content: <FeatureList filter="all" />,
    },
    ...industries.map((slug) => ({
      id: slug,
      label: t(`industries:items.${slug}.name`),
      icon: industryProfiles[slug]?.icon,
      content: <FeatureList filter={slug} />,
    })),
  ];

  return (
    <Section tone="default" spacing="lg">
      <Container>
        <Reveal>
          <Tabs
            variant="pill"
            value={selectedIndustry}
            onValueChange={handleFilterChange}
            label={t("features:page.filterLabel")}
            items={tabItems}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
