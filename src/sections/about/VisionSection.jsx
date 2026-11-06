import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PullStatement } from "./PullStatement";
import { VisionRipple } from "./VisionRipple";

// TODO(Debass): the vision statement says "a leading business management platform". It is a vision statement kept as approved; confirm it may be published (the publishing rules ask for evidence behind claims).
export function VisionSection() {
  const { t } = useTranslation();

  return (
    <Section id="vision" tone="default" spacing="lg" aria-labelledby="vision-heading">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left vision text content */}
          <div className="lg:col-span-7">
            <Reveal>
              <div>
                <SectionHeading
                  as="h2"
                  size="h2"
                  id="vision-heading"
                  title={t("about:vision.title")}
                  className="mb-0 md:mb-0"
                />

                <div className="mt-6">
                  <PullStatement variant="plain" size="md">
                    {t("about:vision.statement")}
                  </PullStatement>
                </div>

                <div className="mt-8 space-y-5">
                  <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:vision.p1")}</p>
                  <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:vision.p2")}</p>
                  <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:vision.p3")}</p>
                </div>

                <div className="mt-10">
                  <PullStatement variant="ribbon" size="md">
                    {t("about:vision.pull")}
                  </PullStatement>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right vision ripple illustration */}
          <div className="mt-12 lg:col-span-5 lg:mt-0">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl border border-line bg-surface-raised shadow-card">
              <VisionRipple />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
