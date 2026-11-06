import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buttonStyles } from "@/components/ui/button-styles";
import { track, EVENTS } from "@/lib/analytics";

// TODO(Debass): the About document has no closing action; the approved button from the earlier PDF (Section 9) is used.
// TODO(Debass): the closing signature reads "…Your environment, automatically." while the brand promise reads "…automatically configured." Kept exactly as in the document; confirm which one is intended.
export function AboutClosing() {
  const { t } = useTranslation();

  return (
    <Section id="closing" tone="tint" spacing="lg" aria-label={t("about:closing.ariaLabel")}>
      <Container>
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl font-display text-h2 leading-tight font-semibold text-heading">
              {t("about:closing.signature")}
            </p>

            <div className="shrink-0">
              <Link
                to="/contact"
                onClick={() =>
                  track(EVENTS.CTA_CLICK, {
                    intent: "contact",
                    location: "about-final",
                  })
                }
                className={buttonStyles({
                  variant: "primary",
                  size: "lg",
                  className: "w-full sm:w-auto",
                })}
              >
                {t("common:cta.contactNeliasTeam")}
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
