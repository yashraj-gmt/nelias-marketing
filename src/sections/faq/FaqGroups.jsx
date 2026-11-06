import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/ui/Accordion";
import { TextLink } from "@/components/ui/TextLink";
import { features } from "@/config/features";
import { MODULES_INCLUDED, getHomePricing } from "@/data/home-pricing";
import { needsPrices } from "@/data/faq-content";
import { useFormat } from "@/hooks/useFormat";

/**
 * FaqGroups component rendering questions grouped by topic with WAI-ARIA disclosure accordions.
 *
 * @param {Object} props
 * @param {Array<{ id: string, items: string[] }>} props.groups
 */
export function FaqGroups({ groups = [] }) {
  const { t } = useTranslation();
  const { formatFcfa } = useFormat();
  const homePricing = getHomePricing();

  // Filter groups and items based on pricing visibility
  const visibleGroups = groups
    .map((group) => {
      const visibleItems = group.items.filter((itemKey) => {
        if (needsPrices.includes(itemKey) && !features.pricingPublic) {
          return false;
        }
        return true;
      });

      return {
        ...group,
        visibleItems,
      };
    })
    .filter((group) => group.visibleItems.length > 0);

  /**
   * Builds the accordion content for a given question key.
   * Handles dynamic placeholders and special interactive elements.
   *
   * @param {string} key
   * @returns {import("react").ReactNode}
   */
  const renderItemContent = (key) => {
    if (key === "includes") {
      return (
        <p>
          {t("faq:items.includes.a", {
            start: MODULES_INCLUDED.start,
            business: MODULES_INCLUDED.business,
            professional: MODULES_INCLUDED.professional,
          })}
        </p>
      );
    }

    if (key === "moreModules") {
      return (
        <p>
          {t("faq:items.moreModules.a", {
            amount: formatFcfa(homePricing.extraModule),
          })}
        </p>
      );
    }

    if (key === "packsDate") {
      return (
        <>
          <p>{t("faq:items.packsDate.a")}</p>
          <div className="mt-3">
            {/* TODO(Debass): the answer says visitors can ask to be notified when the Industry+ packs are available; no dedicated notification list exists, so the link opens the contact page. */}
            <TextLink to="/contact">{t("common:cta.contactTeam")}</TextLink>
          </div>
        </>
      );
    }

    if (key === "hosted") {
      return (
        <>
          {/* TODO(Debass): this answer (Côte d’Ivoire hosting only with the Sovereign offer) must be aligned with the published legal documents (Terms of Use article 10, DPA article 6 and annex 2, Privacy Policy article 5: main hosting with Hodi in Grand-Bassam, recovery site in Johannesburg). */}
          <p>{t("faq:items.hosted.a")}</p>
        </>
      );
    }

    return <p>{t(`faq:items.${key}.a`)}</p>;
  };

  return (
    <div className="space-y-12">
      {visibleGroups.map((group) => {
        const accordionItems = group.visibleItems.map((key) => ({
          id: key,
          title: t(`faq:items.${key}.q`),
          content: renderItemContent(key),
        }));

        return (
          <section
            key={group.id}
            id={`group-${group.id}`}
            aria-labelledby={`group-${group.id}-title`}
            className="mt-12 scroll-mt-28 first:mt-0"
          >
            <h2
              id={`group-${group.id}-title`}
              className="text-center font-display text-h3 text-heading"
            >
              {t(`faq:groups.${group.id}`)}
            </h2>
            <Accordion
              items={accordionItems}
              headingLevel={3}
              type="single"
              className="mt-6 w-full"
            />
          </section>
        );
      })}
    </div>
  );
}
