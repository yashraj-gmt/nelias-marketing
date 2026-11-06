import { useTranslation } from "react-i18next";
import {
  Boxes,
  Users,
  Building2,
  HardDrive,
  Sparkles,
  Layers,
  Calculator,
  Info,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { useFormat } from "@/hooks/useFormat";
import { getHomePricing, exampleStart } from "@/data/home-pricing";

/**
 * Extensions pricing section displaying modular capacity and feature add-ons.
 * Shown only when features.pricingPublic is enabled.
 *
 * @param {Object} props
 * @param {"default"|"muted"} [props.tone="default"]
 * @returns {import("react").JSX.Element}
 */
export function ExtensionsSection({ tone = "default" }) {
  const { t } = useTranslation();
  const { lng, formatNumber, formatFcfa } = useFormat();
  const { extensions, plans } = getHomePricing();
  const ex = exampleStart(5);

  const extensionItems = [
    {
      id: "module",
      icon: Boxes,
      label: t("pricing:grow.items.module.label"),
      value: t("pricing:grow.items.module.value", {
        amount: formatFcfa(extensions.extraModule, lng),
      }),
      isNumeric: true,
    },
    {
      id: "user",
      icon: Users,
      label: t("pricing:grow.items.user.label"),
      value: t("pricing:grow.items.user.value", {
        amount: formatFcfa(extensions.user1, lng),
      }),
      isNumeric: true,
    },
    {
      id: "users5",
      icon: Users,
      label: t("pricing:grow.items.users5.label"),
      value: t("pricing:grow.items.users5.value", {
        amount: formatFcfa(extensions.users5, lng),
      }),
      isNumeric: true,
    },
    {
      id: "users10",
      icon: Users,
      label: t("pricing:grow.items.users10.label"),
      value: t("pricing:grow.items.users10.value", {
        amount: formatFcfa(extensions.users10, lng),
      }),
      isNumeric: true,
    },
    {
      id: "entity",
      icon: Building2,
      label: t("pricing:grow.items.entity.label"),
      value: t("pricing:grow.items.entity.value", {
        amount: formatFcfa(extensions.legalEntity, lng),
      }),
      isNumeric: true,
    },
    {
      id: "pack",
      icon: Sparkles,
      label: t("pricing:grow.items.pack.label"),
      value: t("pricing:grow.items.pack.value", {
        amount: formatFcfa(extensions.industryPack, lng),
      }),
      isNumeric: true,
    },
    {
      id: "storage",
      icon: HardDrive,
      label: t("pricing:grow.items.storage.label"),
      value: t("pricing:grow.items.storage.value"),
      isNumeric: false,
    },
    {
      id: "addons",
      icon: Layers,
      label: t("pricing:grow.items.addons.label"),
      value: t("pricing:grow.items.addons.value"),
      isNumeric: false,
    },
  ];

  return (
    <Section tone={tone} spacing="md" className="py-12 md:py-16">
      <Container>
        <Reveal>
          {/* Header */}
          <div className="mb-8">
            <h2
              id="extensions-heading"
              className="font-display text-2xl font-bold tracking-tight text-heading sm:text-3xl"
            >
              {t("pricing:grow.title")}
            </h2>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-12">
            {/* Left: Enhanced Extensions Table Card (7 cols on lg) */}
            <div className="overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-xs lg:col-span-7">
              <div className="flex items-center justify-between border-b border-line bg-surface-muted/50 px-5 py-3.5 text-xs font-semibold tracking-wider text-fg-muted uppercase">
                <span>{t("pricing:grow.head.extension")}</span>
                <span>{t("pricing:grow.head.monthly")}</span>
              </div>

              <ul aria-labelledby="extensions-heading" className="divide-y divide-line/60 text-sm">
                {extensionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-tint/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-tint text-accent">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <span className="truncate font-medium text-heading">{item.label}</span>
                      </div>
                      <span
                        className={
                          item.isNumeric
                            ? "shrink-0 text-right text-xs font-semibold text-heading tabular-nums sm:text-sm"
                            : "max-w-[14rem] shrink-0 text-right text-xs text-fg-muted"
                        }
                      >
                        {item.value}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right: Dynamic Calculation & Transparency Showcase (5 cols on lg) */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              {/* Interactive / Visual Math Card */}
              <div className="relative overflow-hidden rounded-2xl border border-line bg-surface-raised p-6 shadow-xs">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent">
                    <Calculator className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <Badge className="border border-accent/20 bg-surface-tint text-xs font-semibold text-accent">
                    {t("pricing:grow.head.extension")}
                  </Badge>
                </div>

                <h3 className="font-display text-lg font-bold text-heading">
                  {plans.start ? t("home:pricing.table.plans.start") : "START"} + 1{" "}
                  {t("home:pricing.table.rows.modules")}
                </h3>

                {/* Math breakdown pills */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <div className="rounded-lg border border-line bg-surface-muted/60 px-3 py-2 text-center">
                    <span className="block text-[11px] text-fg-muted">START (4 mod.)</span>
                    <strong className="font-semibold text-heading tabular-nums">
                      {formatNumber(ex.base, lng)}
                    </strong>
                  </div>
                  <span className="font-bold text-fg-muted">+</span>
                  <div className="rounded-lg border border-accent/30 bg-surface-tint px-3 py-2 text-center">
                    <span className="block text-[11px] text-accent">+1 mod.</span>
                    <strong className="font-semibold text-accent tabular-nums">
                      {formatNumber(ex.extra, lng)}
                    </strong>
                  </div>
                  <span className="font-bold text-fg-muted">=</span>
                  <div className="rounded-lg border-2 border-accent bg-accent/10 px-3.5 py-2 text-center">
                    <span className="block text-[11px] font-medium text-heading">Total / mo</span>
                    <strong className="text-sm font-bold text-accent tabular-nums sm:text-base">
                      {formatFcfa(ex.total, lng)}
                    </strong>
                  </div>
                </div>

                {/* Full Explanation Note */}
                <p className="mt-5 text-xs leading-relaxed text-fg-muted sm:text-sm">
                  {t("pricing:grow.example", {
                    base: formatNumber(ex.base, lng),
                    extra: formatNumber(ex.extra, lng),
                    total: formatFcfa(ex.total, lng),
                  })}
                </p>
              </div>

              {/* Legal & Project Consultation Callout */}
              <div className="flex items-start gap-3 rounded-xl border border-line/70 bg-surface-muted/40 p-4 text-xs text-fg-muted">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <p className="leading-relaxed">{t("home:pricing.legal")}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
