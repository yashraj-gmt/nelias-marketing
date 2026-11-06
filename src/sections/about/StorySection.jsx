import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PullStatement } from "./PullStatement";

export function StorySection() {
  const { t } = useTranslation();

  return (
    <Section id="story" tone="default" spacing="lg" aria-labelledby="story-heading">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Left sticky title */}
          <div className="mb-8 lg:sticky lg:top-28 lg:col-span-4 lg:mb-0 lg:self-start">
            <SectionHeading
              as="h2"
              size="h2"
              id="story-heading"
              title={t("about:story.title")}
              className="mb-0 md:mb-0"
            />
          </div>

          {/* Right story flow */}
          <div className="lg:col-span-8">
            <Reveal>
              <div className="space-y-6 md:space-y-8">
                <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:story.p1")}</p>

                <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:story.p2")}</p>

                <PullStatement variant="accent">{t("about:story.pull")}</PullStatement>

                <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:story.p3")}</p>

                <Panel tone="tint" padding="lg">
                  <PullStatement variant="plain" size="md">
                    {t("about:story.question")}
                  </PullStatement>
                </Panel>

                <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:story.p4")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
