import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatFcfa } from "@/lib/format";
import { describeRule } from "@/sections/pricing/price-format";
import { features } from "@/config/features";

/**
 * Estimate panel displaying plan, options, capacity lines, and totals.
 *
 * @param {Object} props
 * @param {Object} props.data - Configurator state
 * @param {string} props.effectivePlan - Current plan id
 * @param {Object} props.plansById - Plans map
 * @param {Object} props.est - Estimate calculation result
 * @param {(partial: Object) => void} [props.patch] - State patch callback
 * @param {boolean} [props.isAside=false] - Whether rendered inside sidebar aside
 * @param {string} [props.className]
 */
export function EstimatePanel({
  data,
  effectivePlan,
  plansById: _plansById,
  est,
  patch,
  isAside = false,
  className = "",
}) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language?.startsWith("fr") ? "fr" : "en";

  const [liveAnnouncement, setLiveAnnouncement] = useState(() =>
    !features.pricingPublic ? t("pricing:page.priceOnRequest") : "",
  );
  const debounceTimerRef = useRef(null);

  const isPublic = features.pricingPublic;
  const isEnterprise = effectivePlan === "enterprise";
  const planName = t(`pricing:plans.${effectivePlan}.name`);

  // Build announcement text for polite live region
  useEffect(() => {
    if (!isPublic) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isEnterprise) {
        setLiveAnnouncement(`${planName}: ${t("pricing:page.customQuote")}`);
      } else if (data.billing === "annual") {
        const planAnn = est.plan?.annual ? formatFcfa(est.plan.annual, lng) : "";
        const optMonthly = est.monthlyOptions ? formatFcfa(est.monthlyOptions, lng) : "0";
        setLiveAnnouncement(
          `${planName}: ${planAnn} ${t("pricing:page.perYear")} ${t("pricing:page.exclTax")}. ${t("configurator:panel.options")}: ${optMonthly} ${t("pricing:page.perMonth")}.`,
        );
      } else {
        const total = est.totalMonthly ? formatFcfa(est.totalMonthly, lng) : "";
        const formattedTotal = est.isLowerBound
          ? t("configurator:customize.totalFrom", { amount: total })
          : total;
        setLiveAnnouncement(
          `${t("configurator:customize.total")}: ${formattedTotal} ${t("pricing:page.perMonth")} ${t("pricing:page.exclTax")}`,
        );
      }
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    isPublic,
    isEnterprise,
    data.billing,
    effectivePlan,
    est.totalMonthly,
    est.monthlyOptions,
    est.extraModules,
    est.plan?.annual,
    est.isLowerBound,
    lng,
    planName,
    t,
  ]);

  return (
    <div className={`rounded-xl border border-line bg-surface-raised p-6 ${className}`}>
      <h2 className="sr-only">{t("configurator:customize.estimateTitle")}</h2>
      <p className="font-display text-h3 text-heading" aria-hidden="true">
        {t("configurator:customize.estimateTitle")}
      </p>
      <p className="mt-1 text-sm text-fg-muted">{t("configurator:customize.estimateHelper")}</p>

      {/* Screen reader live announcement */}
      <p aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </p>

      {/* When pricing is NOT public: show capacity facts & price on request */}
      {!isPublic ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-surface-tint p-4 text-center">
            <span className="font-display text-lg font-bold text-accent-strong">
              {t("pricing:page.priceOnRequest")}
            </span>
          </div>

          <dl className="divide-y divide-line text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-fg-muted">{t("configurator:panel.plan")}</dt>
              <dd className="font-semibold text-heading">{planName}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-fg-muted">{t("pricing:page.usersLabel")}</dt>
              <dd className="font-semibold text-heading">{data.users}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-fg-muted">{t("pricing:page.entitiesLabel")}</dt>
              <dd className="font-semibold text-heading">{data.entities}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-fg-muted">{t("configurator:panel.storage")}</dt>
              <dd className="font-semibold text-heading">
                {data.storage === "more"
                  ? t("configurator:customize.storageMore", { value: 50 })
                  : t("pricing:page.storageValue", { value: data.storage })}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Billing Switcher */}
          {patch && (
            <div>
              <SegmentedControl
                label={t("pricing:page.billingLabel")}
                value={data.billing}
                onChange={(val) => patch({ billing: val })}
                options={[
                  { value: "monthly", label: t("pricing:page.monthly") },
                  { value: "annual", label: t("pricing:page.annual") },
                ]}
              />
            </div>
          )}

          {/* Breakdown List */}
          <dl className="divide-y divide-line text-sm">
            {/* Plan row */}
            <div className="flex items-baseline justify-between gap-2 py-2.5">
              <dt className="leading-snug font-semibold text-heading">{planName}</dt>
              <dd className="shrink-0 text-right leading-snug font-semibold text-fg">
                {isEnterprise ? (
                  t("pricing:page.customQuote")
                ) : data.billing === "annual" ? (
                  <>
                    {formatFcfa(est.plan?.annual, lng)}{" "}
                    <span className="text-xs font-normal text-fg-muted">
                      {t("pricing:page.perYear")}
                    </span>
                  </>
                ) : (
                  <>
                    {formatFcfa(est.plan?.monthly, lng)}{" "}
                    <span className="text-xs font-normal text-fg-muted">
                      {t("pricing:page.perMonth")}
                    </span>
                  </>
                )}
              </dd>
            </div>
            {/* TODO(Debass): annual billing of additional modules is assumed monthly; the V3 notes do not say. */}
            {/* Line items for extra capacity and options */}
            {est.lines.map((line) => {
              let label = "";
              if (line.group === "users") {
                label = t("configurator:customize.extraUsersCount", {
                  count: line.count,
                });
              } else if (line.group === "entities") {
                label = t("configurator:customize.extraEntitiesCount", {
                  count: line.count,
                });
              } else if (line.group === "modules") {
                label = t("configurator:customize.extraModulesCount", {
                  count: line.count,
                });
              } else {
                label = t(`pricing:optional.items.${line.id}`);
              }

              let valueDisplay = "";
              if (line.included) {
                valueDisplay = t("configurator:customize.includedLabel");
              } else if (line.rule) {
                valueDisplay = describeRule(line.rule, t, lng);
              } else {
                valueDisplay = `${formatFcfa(line.amount, lng)} ${t("pricing:page.perMonth")}`;
              }

              const isLong = valueDisplay.length > 28;

              if (isAside && isLong) {
                return (
                  <div key={line.id} className="py-2.5">
                    <dt className="leading-snug font-medium text-fg-muted">{label}</dt>
                    <dd className="mt-1 text-xs leading-relaxed font-medium text-fg">
                      {valueDisplay}
                    </dd>
                  </div>
                );
              }

              if (isLong) {
                return (
                  <div key={line.id} className="py-2.5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <dt className="leading-snug font-medium text-fg-muted">{label}</dt>
                      <dd className="text-left text-xs leading-snug font-medium text-fg sm:text-right sm:text-sm">
                        {valueDisplay}
                      </dd>
                    </div>
                  </div>
                );
              }

              return (
                <div key={line.id} className="flex items-baseline justify-between gap-2 py-2">
                  <dt className="leading-snug font-medium text-fg-muted">{label}</dt>
                  <dd className="shrink-0 text-right leading-snug font-medium text-fg">
                    {valueDisplay}
                  </dd>
                </div>
              );
            })}
          </dl>

          {/* Totals Section */}
          <div className="border-t border-line pt-4">
            {isEnterprise ? (
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-heading">
                  {t("configurator:customize.total")}
                </span>
                <span className="font-display text-lg font-bold text-accent-strong">
                  {t("pricing:page.customQuote")}
                </span>
              </div>
            ) : data.billing === "monthly" ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-heading">
                    {t("configurator:customize.total")}
                  </span>
                  <span className="font-display text-2xl font-bold text-heading">
                    {est.isLowerBound
                      ? t("configurator:customize.totalFrom", {
                          amount: formatFcfa(est.totalMonthly, lng),
                        })
                      : formatFcfa(est.totalMonthly, lng)}
                  </span>
                </div>
                <p className="mt-1 text-right text-xs text-fg-muted">
                  {t("pricing:page.perMonth")} {t("pricing:page.exclTax")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-heading">
                    {planName} ({t("pricing:page.annual")})
                  </span>
                  <span className="font-display text-xl font-bold text-heading">
                    {formatFcfa(est.plan?.annual, lng)}{" "}
                    <span className="text-xs font-normal text-fg-muted">
                      {t("pricing:page.perYear")} {t("pricing:page.exclTax")}
                    </span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-heading">
                    {t("configurator:panel.options")}
                  </span>
                  <span className="font-display text-lg font-semibold text-heading">
                    {est.isLowerBound
                      ? t("configurator:customize.totalFrom", {
                          amount: formatFcfa(est.monthlyOptions, lng),
                        })
                      : formatFcfa(est.monthlyOptions, lng)}{" "}
                    <span className="text-xs font-normal text-fg-muted">
                      {t("pricing:page.perMonth")} {t("pricing:page.exclTax")}
                    </span>
                  </span>
                </div>

                <p className="text-xs text-fg-muted">
                  {t("configurator:customize.annualOptionsNote")}
                </p>
              </div>
            )}
          </div>

          {/* Footnotes */}
          <div className="space-y-1 text-xs text-fg-muted">
            {est.hasUsage && <p>{t("configurator:customize.usageNote")}</p>}
            {est.hasQuote && <p>{t("configurator:customize.quoteNote")}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
