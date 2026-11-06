import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { plans } from "@/data/pricing-catalog";
import { PlanCard } from "./PlanCard";

/**
 * Plans section rendering the 4 plan cards with billing toggle (when prices public)
 * and the annual discount note.
 *
 * @param {Object} props
 * @param {"monthly"|"annual"} props.billing
 * @param {(billing: "monthly"|"annual") => void} props.onBillingChange
 * @param {boolean} props.showPrices
 * @param {"default"|"muted"} [props.tone="default"]
 * @returns {import("react").JSX.Element}
 */
export function PlansSection({ billing, onBillingChange, showPrices, tone = "default" }) {
  const { t } = useTranslation();

  return (
    <Section tone={tone} spacing="md" className="py-10 md:py-14">
      <Container>
        <Reveal>
          {/* Accessible section heading */}
          <h2 className="sr-only">{t("pricing:page.plansTitle")}</h2>

          {/* Billing toggle: only shown when pricing is public */}
          {showPrices && (
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <SegmentedControl
                name="billing"
                size="lg"
                label={t("pricing:page.billingLabel")}
                value={billing}
                onChange={onBillingChange}
                options={[
                  { value: "monthly", label: t("pricing:page.monthly") },
                  { value: "annual", label: t("pricing:page.annual") },
                ]}
              />

              {/* Polite live region announcing billing period change */}
              <p role="status" aria-live="polite" className="sr-only">
                {t("pricing:page.announce", {
                  period:
                    billing === "monthly"
                      ? t("pricing:page.periodMonthly")
                      : t("pricing:page.periodAnnual"),
                })}
              </p>
            </div>
          )}

          {/* Plan cards grid */}
          <ul
            aria-label={t("pricing:page.plansTitle")}
            className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {plans.map((plan) => (
              <li key={plan.id} className="flex">
                <PlanCard plan={plan} billing={billing} showPrices={showPrices} />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
