import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function MissionSection() {
  const { t } = useTranslation();

  return (
    <Section id="mission" tone="inverse" spacing="lg" aria-labelledby="mission-heading">
      <Container>
        <Reveal>
          <div>
            <SectionHeading
              as="h2"
              size="h3"
              tone="inverse"
              id="mission-heading"
              title={t("about:mission.title")}
              className="mb-0 md:mb-0"
            />

            <p className="mt-6 max-w-4xl font-display text-h1 font-semibold text-fg-inverse">
              {t("about:mission.statement")}
            </p>

            <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-10">
              <p className="border-t border-white/20 pt-5 text-lead text-fg-inverse-muted">
                {t("about:mission.p1")}
              </p>
              <p className="border-t border-white/20 pt-5 text-lead text-fg-inverse-muted">
                {t("about:mission.p2")}
              </p>
              <p className="border-t border-white/20 pt-5 text-lead text-fg-inverse-muted">
                {t("about:mission.p3")}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
