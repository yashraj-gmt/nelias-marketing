import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  Users,
  Megaphone,
  Headphones,
  Store,
  ShoppingCart,
  Boxes,
  Factory,
  ShieldCheck,
  Building2,
  Wallet,
  Coins,
  UserCheck,
  FolderKanban,
  SlidersHorizontal,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { moduleFamilies, moduleBenefits } from "@/data/home-content";
import { MODULES_INCLUDED, EXTRA_MODULE_MONTHLY } from "@/data/home-pricing";
import { features } from "@/config/features";
import { useFormat } from "@/hooks/useFormat";
import { cn } from "@/lib/cn";

/**
 * Icons mapped to each module family header.
 */
const familyIcons = {
  customerRelations: Users,
  operations: Boxes,
  financeTeams: Wallet,
};

/**
 * Icons mapped to each of the 14 standard modules.
 */
const moduleIcons = {
  sales: TrendingUp,
  crm: Users,
  marketing: Megaphone,
  customerSupport: Headphones,
  pointOfSale: Store,
  purchasing: ShoppingCart,
  inventory: Boxes,
  production: Factory,
  quality: ShieldCheck,
  assets: Building2,
  accounting: Wallet,
  payroll: Coins,
  hr: UserCheck,
  projects: FolderKanban,
};

/**
 * Enhanced Modules section of the Home page.
 * Displays the 14 modules across 3 functional families with distinct iconography,
 * an interactive badge layout, an elevated extra module callout, and a divided benefits panel.
 *
 * @param {Object} props
 * @param {string} [props.tone="tint"]
 * @param {string} [props.headingId="modules-heading"]
 */
export function ModulesSection({ tone = "tint", headingId = "modules-heading" }) {
  const { t } = useTranslation();
  const { formatFcfa } = useFormat();

  return (
    <Section id="modules" tone={tone} spacing="lg" aria-labelledby={headingId}>
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <h2
              id={headingId}
              className="font-display text-h2 leading-tight font-semibold tracking-tight text-heading"
            >
              {t("home:modules.title")}
            </h2>
            <p className="mt-4 text-lead leading-relaxed text-fg-muted">
              {t("home:modules.intro", {
                start: MODULES_INCLUDED.start,
                business: MODULES_INCLUDED.business,
                professional: MODULES_INCLUDED.professional,
              })}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 md:mt-12">
            {/* 3 Domain Family Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {moduleFamilies.map((family) => {
                const FamilyIcon = familyIcons[family.id];
                const moduleCount = family.modules.length;

                return (
                  <div
                    key={family.id}
                    className="flex flex-col justify-between rounded-xl border border-line bg-surface-raised p-6 shadow-xs transition-shadow duration-200 hover:shadow-card"
                  >
                    <div>
                      {/* Family Header */}
                      <div className="flex items-center justify-between gap-3 border-b border-line/60 pb-4">
                        <div className="flex min-w-0 items-center gap-3">
                          {FamilyIcon && (
                            <IconBadge
                              icon={FamilyIcon}
                              tone="azure"
                              size="sm"
                              className="shrink-0"
                            />
                          )}
                          <h3 className="truncate font-display text-lg font-semibold text-heading">
                            {t(`home:modules.families.${family.id}`)}
                          </h3>
                        </div>
                        <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-fg-subtle">
                          {moduleCount}
                        </span>
                      </div>

                      {/* Module Badge Chips */}
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {family.modules.map((modId) => {
                          const ModuleIcon = moduleIcons[modId];
                          return (
                            <li key={modId}>
                              <span className="inline-flex cursor-default items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg shadow-2xs transition-colors duration-150 hover:border-accent hover:bg-surface-tint hover:text-accent-strong sm:text-sm">
                                {ModuleIcon && (
                                  <ModuleIcon
                                    className="h-3.5 w-3.5 shrink-0 text-accent"
                                    aria-hidden="true"
                                  />
                                )}
                                <span>{t(`home:modules.names.${modId}`)}</span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extra module cost callout (only when pricing is public) */}
            {features.pricingPublic && (
              <div className="mt-8 flex items-start gap-3.5 rounded-lg border border-line bg-surface-raised p-4 shadow-2xs sm:items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-fg-muted md:text-base">
                  {t("home:modules.extraModule", {
                    amount: formatFcfa(EXTRA_MODULE_MONTHLY),
                  })}
                </p>
              </div>
            )}

            {/* 3 Platform Benefits (Divided Surface Panel) */}
            <div className="mt-12 rounded-xl border border-line bg-surface-raised p-6 shadow-xs md:p-8">
              <div className="grid gap-8 md:grid-cols-3 md:divide-x md:divide-line">
                {moduleBenefits.map(({ id, icon }, idx) => (
                  <div key={id} className={cn("flex flex-col items-start", idx > 0 && "md:pl-8")}>
                    <IconBadge icon={icon} tone="azure" size="md" className="mb-4 shadow-2xs" />
                    <h3 className="font-display text-base font-semibold text-heading md:text-lg">
                      {t(`home:modules.benefits.${id}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted md:text-base">
                      {t(`home:modules.benefits.${id}.text`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
