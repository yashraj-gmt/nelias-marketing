import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Panel } from "@/components/ui/Panel";
import { CtaLink } from "@/components/common/CtaLink";

/**
 * Enterprise section highlighting tailored deployments, sovereignty, and SLA.
 *
 * @param {Object} props
 * @param {"default"|"muted"} [props.tone="muted"]
 * @returns {import("react").JSX.Element}
 */
export function EnterpriseSection({ tone = "muted" }) {
  const { t } = useTranslation();

  return (
    <Section tone={tone} spacing="md" className="py-10 md:py-14">
      <Container>
        <Reveal>
          <Panel tone="tint" padding="lg">
            <h2 className="font-display text-2xl font-bold text-heading sm:text-3xl">
              {t("home:pricing.table.plans.enterprise")}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-fg-muted sm:text-lg">
              {t("home:pricing.enterprise")}
            </p>
            <div className="mt-6">
              <CtaLink to="/contact" variant="primary" size="md" location="pricing-enterprise">
                {t("common:cta.talkToExpert")}
              </CtaLink>
            </div>
          </Panel>
        </Reveal>
      </Container>
    </Section>
  );
}
