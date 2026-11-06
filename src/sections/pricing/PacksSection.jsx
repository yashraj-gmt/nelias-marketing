import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/patterns/DataTable";
import { useFormat } from "@/hooks/useFormat";
import { getHomePricing } from "@/data/home-pricing";

// TODO(Debass): the packs are not sold yet and no dedicated notification list exists; the document asks for an email-capture button, so this button opens the contact page until a capture form is decided.
// TODO(Debass): decide whether the Industry+ packs are shown as coming soon or hidden until they are available (document, point 6 to confirm).

const PACK_IDS = ["immo", "courtage", "pharma", "chantier", "services"];

/**
 * Sector configurations and Industry+ Packs section.
 * Explains base sector engine inclusion and previews planned industry packs in a clear, easy-to-understand layout.
 *
 * @param {Object} props
 * @param {boolean} props.showPrices
 * @param {"default"|"muted"} [props.tone="default"]
 * @returns {import("react").JSX.Element}
 */
export function PacksSection({ showPrices, tone = "default" }) {
  const { t } = useTranslation();
  const { lng, formatFcfa } = useFormat();
  const { extensions } = getHomePricing();

  const head = [
    t("pricing:packs.head.pack"),
    t("pricing:packs.head.sector"),
    t("pricing:packs.head.functions"),
  ];

  const rows = PACK_IDS.map((id) => [
    t(`pricing:packs.items.${id}.name`),
    t(`pricing:packs.items.${id}.sector`),
    t(`pricing:packs.items.${id}.functions`),
  ]);

  return (
    <Section tone={tone} spacing="md" className="py-12 md:py-16">
      <Container>
        <Reveal>
          {/* 1. Sector configurations included (clear, intuitive reassurance card) */}
          <div className="rounded-2xl border border-line bg-surface-raised p-6 shadow-xs sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-tint text-accent">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-xl font-bold tracking-tight text-heading sm:text-2xl">
                    {t("pricing:sectors.title")}
                  </h2>
                  <Badge className="border border-accent/20 bg-surface-tint text-xs font-semibold text-accent">
                    {t("home:pricing.table.included")}
                  </Badge>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-muted sm:text-base">
                  {t("pricing:sectors.body")}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Industry+ Packs Preview */}
          <div className="mt-12 sm:mt-16">
            <div className="mb-6">
              <h3
                id="packs-heading"
                className="font-display text-xl font-bold tracking-tight text-heading sm:text-2xl"
              >
                {t("pricing:packs.title")}
              </h3>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-fg-muted sm:text-base">
                {t("pricing:packs.intro")}
              </p>
              {showPrices && (
                <p className="mt-2 text-sm font-semibold text-heading">
                  {t("pricing:packs.price", {
                    amount: formatFcfa(extensions.industryPack, lng),
                  })}
                </p>
              )}
            </div>

            <DataTable
              labelledBy="packs-heading"
              head={head}
              rows={rows}
              minWidth="min-w-[32rem]"
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
