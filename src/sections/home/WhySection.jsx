import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { whyItems } from "@/data/home-content";
import { features } from "@/config/features";
import { cn } from "@/lib/cn";

// TODO(Debass): "Data in Africa / hosting available in Côte d’Ivoire" must stay consistent with the published legal documents (Terms of Use article 10, DPA article 6, Privacy Policy article 5: main hosting with Hodi in Grand-Bassam, recovery site in Johannesburg).

/**
 * Why NELIAS value propositions section of the Home page.
 * Uses a balanced responsive grid that adapts to visible item count
 * to ensure no empty space across desktop, tablet, and mobile.
 *
 * @param {Object} props
 * @param {string} [props.tone="default"]
 * @param {string} [props.headingId="why-heading"]
 */
export function WhySection({ tone = "default", headingId = "why-heading" }) {
  const { t } = useTranslation();

  const visibleItems = whyItems.filter((item) => {
    if (item.show === false) return false;
    if (item.needsPrices && !features.pricingPublic) return false;
    return true;
  });

  const isFiveItems = visibleItems.length === 5;
  const isFourItems = visibleItems.length === 4;

  const gridColsClass = isFourItems
    ? "sm:grid-cols-2 lg:grid-cols-4"
    : isFiveItems
      ? "sm:grid-cols-2 lg:grid-cols-6"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section id="why" tone={tone} spacing="lg" aria-labelledby={headingId}>
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <h2
              id={headingId}
              className="font-display text-h2 leading-tight font-semibold tracking-tight text-heading"
            >
              {t("home:why.title")}
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <ul className={cn("mt-10 grid gap-6", gridColsClass)}>
            {visibleItems.map(({ id, icon }, index) => {
              let itemClass = "";
              if (isFiveItems) {
                if (index < 3) {
                  itemClass = "lg:col-span-2";
                } else if (index === 3) {
                  itemClass = "lg:col-span-2 lg:col-start-2";
                } else if (index === 4) {
                  itemClass =
                    "sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full lg:w-auto lg:max-w-none lg:mx-0 lg:col-span-2";
                }
              }

              return (
                <li
                  key={id}
                  className={cn(
                    "group flex flex-col justify-between rounded-2xl border border-line bg-surface-raised p-6 shadow-xs transition-all duration-200 hover:border-accent hover:shadow-card md:p-7",
                    itemClass,
                  )}
                >
                  <div>
                    <IconBadge
                      icon={icon}
                      tone="azure"
                      size="md"
                      className="mb-5 transition-transform duration-200 group-hover:scale-105"
                    />
                    <h3 className="font-display text-lg font-bold text-heading transition-colors group-hover:text-accent-strong md:text-xl">
                      {t(`home:why.items.${id}.title`)}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-fg-muted md:text-base">
                      {t(`home:why.items.${id}.text`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
