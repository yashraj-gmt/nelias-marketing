import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PullStatement } from "./PullStatement";
import { FoundationIllustration } from "./FoundationIllustration";

// TODO(Debass): French is an AI-drafted translation pending native review ("scalable" is rendered "évolutive").
export function AnswerSection({ tone = "default" }) {
  const { t } = useTranslation();
  const triadItems = t("about:answer.triad", { returnObjects: true }) || [];

  return (
    <Section id="answer" tone={tone} spacing="lg" aria-labelledby="answer-heading">
      <Container>
        <Reveal>
          <div>
            {/* Title h2 */}
            <SectionHeading as="h2" size="h2" id="answer-heading" title={t("about:answer.title")} />

            {/* Row 1: Text paragraphs + FoundationIllustration */}
            <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14">
              <div className="space-y-5 lg:col-span-7">
                <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:answer.p1")}</p>
                <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:answer.p2")}</p>
                <p className="max-w-[62ch] text-lead text-fg-muted">{t("about:answer.p3")}</p>
              </div>

              <div className="mt-10 lg:col-span-5 lg:mt-0">
                <div className="mx-auto w-full max-w-md">
                  <FoundationIllustration />
                </div>
              </div>
            </div>

            {/* Row 2: Philosophy pull statement + Triad display */}
            <div className="mt-14 md:mt-20">
              <PullStatement
                variant="accent"
                size="custom"
                className="max-w-3xl text-[calc(var(--text-h3)_-_2px)] md:text-[calc(var(--text-h2)_-_2px)]"
              >
                {t("about:answer.philosophy")}
              </PullStatement>

              <div className="mt-10 md:mt-14">
                <p className="font-display text-[calc(var(--text-h1)_-_2px)] leading-[1.1] font-semibold text-heading">
                  {Array.isArray(triadItems) &&
                    triadItems.map((item, index) => (
                      <span key={index} className="block">
                        {item}
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
