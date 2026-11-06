import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DataTable } from "@/components/patterns/DataTable";
import { useFormat } from "@/hooks/useFormat";
import { getHomePricing, MODULES_INCLUDED } from "@/data/home-pricing";

/**
 * Plan comparison table section.
 * Displays specs, capacity limits, and service commitments across all four plans.
 *
 * @param {Object} props
 * @param {boolean} props.showPrices
 * @param {"default"|"muted"} [props.tone="muted"]
 * @returns {import("react").JSX.Element}
 */
export function PlanComparison({ showPrices, tone = "muted" }) {
  const { t } = useTranslation();
  const { lng, formatNumber, formatFcfa } = useFormat();
  const homePricing = getHomePricing();
  const plansData = homePricing.plans;

  const head = [
    "",
    t("home:pricing.table.plans.start"),
    t("home:pricing.table.plans.business"),
    t("home:pricing.table.plans.professional"),
    t("home:pricing.table.plans.enterprise"),
  ];

  const rows = [
    [
      t("home:pricing.table.rows.for"),
      t("home:pricing.table.for.start"),
      t("home:pricing.table.for.business"),
      t("home:pricing.table.for.professional"),
      t("home:pricing.table.for.enterprise"),
    ],
    ...(showPrices
      ? [
          [
            t("home:pricing.table.rows.monthly"),
            formatFcfa(plansData.start.monthly, lng),
            formatFcfa(plansData.business.monthly, lng),
            formatFcfa(plansData.professional.monthly, lng),
            t("home:pricing.table.onQuote"),
          ],
          [
            t("home:pricing.table.rows.annual"),
            formatFcfa(plansData.start.annual, lng),
            formatFcfa(plansData.business.annual, lng),
            formatFcfa(plansData.professional.annual, lng),
            t("home:pricing.table.onQuote"),
          ],
        ]
      : []),
    [
      t("home:pricing.table.rows.modules"),
      formatNumber(MODULES_INCLUDED.start, lng),
      formatNumber(MODULES_INCLUDED.business, lng),
      formatNumber(MODULES_INCLUDED.professional, lng),
      t("home:pricing.table.asNeeded"),
    ],
    [
      t("home:pricing.table.rows.users"),
      formatNumber(plansData.start.users, lng),
      formatNumber(plansData.business.users, lng),
      formatNumber(plansData.professional.users, lng),
      t("home:pricing.table.asNeeded"),
    ],
    [
      t("home:pricing.table.rows.entities"),
      formatNumber(plansData.start.legalEntities, lng),
      formatNumber(plansData.business.legalEntities, lng),
      formatNumber(plansData.professional.legalEntities, lng),
      t("home:pricing.table.multiEntity"),
    ],
    [
      t("home:pricing.table.rows.storage"),
      t("pricing:page.storageValue", {
        value: formatNumber(plansData.start.storageGb, lng),
      }),
      t("pricing:page.storageValue", {
        value: formatNumber(plansData.business.storageGb, lng),
      }),
      t("pricing:page.storageValue", {
        value: formatNumber(plansData.professional.storageGb, lng),
      }),
      t("home:pricing.table.sizedToNeed"),
    ],
    [
      t("home:pricing.table.rows.engine"),
      t("home:pricing.table.included"),
      t("home:pricing.table.included"),
      t("home:pricing.table.included"),
      t("home:pricing.table.included"),
    ],
    [
      t("home:pricing.table.rows.level"),
      t("home:pricing.table.levels.start"),
      t("home:pricing.table.levels.business"),
      t("home:pricing.table.levels.professional"),
      t("home:pricing.table.levels.enterprise"),
    ],
  ];

  return (
    <Section tone={tone} spacing="md" className="py-10 md:py-14">
      <Container>
        <Reveal>
          <h2
            id="plan-compare-heading"
            className="font-display text-2xl font-bold text-heading sm:text-3xl"
          >
            {t("pricing:compare.title")}
          </h2>

          <DataTable
            labelledBy="plan-compare-heading"
            head={head}
            rows={rows}
            highlightColumn={2}
            minWidth="min-w-[40rem]"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
