import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { securityKeys } from "@/data/home-content";

// TODO(Debass): confirm the audit log of administration, billing and provisioning actions and single sign-on "depending on the offer" exist as stated.

/**
 * Security and data isolation section of the Home page.
 *
 * @param {Object} props
 * @param {string} [props.tone="muted"]
 * @param {string} [props.headingId="security-heading"]
 */
export function SecuritySection({ tone = "muted", headingId = "security-heading" }) {
  const { t } = useTranslation();

  return (
    <Section id="security" tone={tone} spacing="lg" aria-labelledby={headingId}>
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <h2
              id={headingId}
              className="font-display text-h2 leading-tight font-semibold tracking-tight text-heading"
            >
              {t("home:security.title")}
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-8">
            <Panel tone="default" padding="lg" className="border border-line shadow-2xs">
              <ul className="space-y-3.5">
                {securityKeys.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-base leading-relaxed text-fg">
                      {t(`home:security.items.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
