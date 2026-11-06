import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/button-styles";
import { SignUpLink } from "@/components/common/SignUpLink";
import { useFormat } from "@/hooks/useFormat";
import { MODULES_INCLUDED } from "@/data/home-pricing";
import { track, EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Plan card component displaying plan identity, pricing block, structured facts list, and external Sign Up link.
 *
 * @param {Object} props
 * @param {import("@/data/pricing-catalog").Plan} props.plan
 * @param {"monthly"|"annual"} [props.billing="monthly"]
 * @param {boolean} [props.showPrices=false]
 * @returns {import("react").JSX.Element}
 */
export function PlanCard({ plan, billing = "monthly", showPrices = false }) {
  const { t } = useTranslation();
  const { lng, formatNumber, formatFcfa } = useFormat();

  const isEnterprise = plan.id === "enterprise";
  const isFeatured = Boolean(plan.featured);
  const planName = t(`home:pricing.table.plans.${plan.id}`);

  const handleCtaClick = () => {
    track(EVENTS.PLAN_SELECT, { plan: plan.id, billing });
  };

  const priceAmount = billing === "annual" ? plan.annual : plan.monthly;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col justify-between rounded-lg border bg-surface-raised p-6 shadow-2xs transition-colors",
        isFeatured ? "border-accent ring-1 ring-accent" : "border-line",
      )}
    >
      <div>
        {/* Recommended badge on featured card */}
        {isFeatured && (
          <div className="mb-4">
            <Badge className="bg-selected text-selected-fg">{t("pricing:page.recommended")}</Badge>
          </div>
        )}

        {/* Plan Name & Target Audience */}
        <h3 className="font-display text-2xl font-bold text-heading">{planName}</h3>
        <p className="mt-1.5 min-h-[2.5rem] text-sm leading-snug text-fg-muted">
          {t(`home:pricing.table.for.${plan.id}`)}
        </p>

        {/* Price block */}
        <div className="mt-6 flex min-h-[5rem] flex-col justify-end border-b border-line pb-5">
          {isEnterprise ? (
            <div>
              <p className="font-display text-2xl font-bold text-heading sm:text-3xl">
                {t("home:pricing.table.onQuote")}
              </p>
              <p className="mt-1 text-xs text-fg-subtle">{t("pricing:page.customQuote")}</p>
            </div>
          ) : showPrices ? (
            <div>
              <p className="font-display text-2xl font-bold text-heading tabular-nums sm:text-3xl">
                {formatFcfa(priceAmount, lng)}
              </p>
              <p className="mt-1 text-xs text-fg-subtle">
                {billing === "annual" ? t("pricing:page.perYear") : t("pricing:page.perMonth")} ·{" "}
                {t("pricing:page.exclTax")}
              </p>
            </div>
          ) : (
            <p className="font-display text-lg font-semibold text-heading sm:text-xl">
              {t("pricing:page.priceOnRequest")}
            </p>
          )}
        </div>

        {/* Facts specification list */}
        <dl className="mt-6 divide-y divide-line border-b border-line text-sm">
          <div className="flex justify-between py-3">
            <dt className="text-fg-muted">{t("home:pricing.table.rows.modules")}</dt>
            <dd className="font-semibold text-heading">
              {isEnterprise
                ? t("home:pricing.table.asNeeded")
                : formatNumber(MODULES_INCLUDED[plan.id], lng)}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-fg-muted">{t("home:pricing.table.rows.users")}</dt>
            <dd className="font-semibold text-heading">
              {isEnterprise ? t("home:pricing.table.asNeeded") : formatNumber(plan.users, lng)}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-fg-muted">{t("home:pricing.table.rows.entities")}</dt>
            <dd className="font-semibold text-heading">
              {isEnterprise
                ? t("home:pricing.table.multiEntity")
                : formatNumber(plan.legalEntities, lng)}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-fg-muted">{t("home:pricing.table.rows.storage")}</dt>
            <dd className="font-semibold text-heading">
              {isEnterprise
                ? t("home:pricing.table.sizedToNeed")
                : t("pricing:page.storageValue", {
                    value: formatNumber(plan.storageGb, lng),
                  })}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-fg-muted">{t("home:pricing.table.rows.engine")}</dt>
            <dd className="font-semibold text-heading">{t("home:pricing.table.included")}</dd>
          </div>
          {/* TODO(Debass): service levels (Standard, Standard+, Priority, SLA) are still to be specified in the contractual terms. */}
          <div className="flex justify-between py-3">
            <dt className="text-fg-muted">{t("home:pricing.table.rows.level")}</dt>
            <dd className="font-semibold text-heading">
              {t(`home:pricing.table.levels.${plan.id}`)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Action CTA Button */}
      <div className="mt-8 pt-2">
        {isEnterprise ? (
          <Link
            to="/contact"
            onClick={handleCtaClick}
            className={cn(buttonStyles({ variant: "secondary", size: "md" }), "w-full text-center")}
          >
            {t("common:cta.talkToExpert")}
          </Link>
        ) : (
          <SignUpLink
            variant={isFeatured ? "primary" : "outline"}
            size="md"
            location={`pricing-${plan.id}`}
            aria-label={t("pricing:overview.configureFor", { plan: planName })}
            onClick={handleCtaClick}
            className="w-full text-center"
          >
            {t("common:cta.configure")}
          </SignUpLink>
        )}
      </div>
    </div>
  );
}
