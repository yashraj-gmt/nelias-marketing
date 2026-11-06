import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { Alert } from "@/components/ui/Alert";
import { optionalCharges } from "@/data/pricing-catalog";
import { useFormat } from "@/hooks/useFormat";
import { describeRule } from "./price-format";
import { cn } from "@/lib/cn";

// TODO(Debass): the catalog still holds standard-pack and industry-plus as options; the document says the base sector configuration is included in all plans and Industry+ packs are coming soon. Update the catalog in the pricing update.

/**
 * Expandable pricing details section displaying add-ons and connectors
 * in an interactive structured layout.
 *
 * @param {Object} props
 * @param {"default"|"muted"} [props.tone="muted"]
 * @returns {import("react").JSX.Element}
 */
export function OptionalChargesSection({ tone = "muted" }) {
  const { t } = useTranslation();
  const { lng } = useFormat();
  const [expanded, setExpanded] = useState(true);

  const groups = [
    { key: "addOns", items: optionalCharges.addOns },
    { key: "connectors", items: optionalCharges.connectors },
  ];

  const renderGroup = ({ key, items }) => (
    <div key={key} className="space-y-3">
      <h3 className="font-display text-lg font-semibold text-heading">
        {t(`pricing:optional.groups.${key}`)}
      </h3>
      <ResponsiveTable
        caption={t(`pricing:optional.groups.${key}`)}
        captionHidden={true}
        label={t(`pricing:optional.groups.${key}`)}
        tableClassName="min-w-full"
      >
        <thead>
          <tr>
            <th scope="col" className="w-1/2 min-w-[9.5rem]">
              {t("pricing:page.itemCol")}
            </th>
            <th scope="col" className="w-1/2 min-w-[10rem]">
              {t("pricing:page.ruleCol")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, rule }) => (
            <tr key={id}>
              <th scope="row" className="font-medium text-fg">
                {t(`pricing:optional.items.${id}`)}
              </th>
              <td className="font-semibold text-heading tabular-nums">
                {describeRule(rule, t, lng)}
              </td>
            </tr>
          ))}
        </tbody>
      </ResponsiveTable>
    </div>
  );

  return (
    <Section tone={tone} spacing="md" className="py-10 md:py-14">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-heading sm:text-3xl">
                {t("pricing:page.devPricingTitle")}
              </h2>
              <p className="mt-2 max-w-2xl text-base text-fg-muted">
                {t("pricing:page.optionalLead")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-md border border-line bg-surface-raised px-4 py-2 text-sm font-semibold text-fg-strong shadow-2xs transition-colors hover:bg-surface-muted hover:text-heading sm:self-center"
            >
              <span>
                {expanded ? t("pricing:page.collapseDetails") : t("pricing:page.expandDetails")}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  expanded && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
          </div>

          {expanded && (
            <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              {groups.map(renderGroup)}
            </div>
          )}

          {/* Pricing disclaimer note */}
          <div className="mt-8 max-w-3xl">
            <Alert tone="note">{t("pricing:disclaimer")}</Alert>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
