import { useTranslation } from "react-i18next";
import { Layers, Sparkles, ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { features } from "@/config/features";

/**
 * Icons mapped to the three core brand taglines.
 */
const taglineIcons = [Layers, Sparkles, ShieldCheck];

/**
 * Enhanced About NELIAS section on the Home page.
 * Displays the core company narrative and the three key platform pillars
 * with dedicated iconography and elevated surfaces.
 */
export function AboutSection() {
  const { t } = useTranslation();

  const taglines = t("home:about.taglines", { returnObjects: true }) || [];

  return (
    <Section id="about" tone="tint" spacing="lg" aria-labelledby="about-heading">
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <h2
              id="about-heading"
              className="font-display text-h2 leading-tight font-semibold tracking-tight text-heading"
            >
              {t("home:about.title")}
            </h2>

            <p className="mt-5 text-lead leading-relaxed font-medium text-fg">
              {t("home:about.p1")}
            </p>
          </div>

          {/* Narrative Story Panel */}
          <div className="mt-8 rounded-2xl border border-line bg-surface-raised p-6 shadow-xs md:p-8">
            <div className="grid gap-6 md:grid-cols-2 md:divide-x md:divide-line">
              <div className="flex flex-col justify-between">
                <p className="text-sm leading-relaxed text-fg-muted md:text-base">
                  {t("home:about.p2a")}
                  {features.pricingPublic && <> {t("home:about.p2b")}</>}
                </p>
              </div>
              <div className="flex flex-col justify-between md:pl-6">
                <p className="text-sm leading-relaxed text-fg-muted md:text-base">
                  {t("home:about.p3")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12">
            {/* 3 Tagline Pillar Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {taglines.map((tagline, idx) => {
                const Icon = taglineIcons[idx] || Sparkles;

                return (
                  <div
                    key={idx}
                    className="group flex flex-col justify-between rounded-2xl border border-line bg-surface-raised p-6 shadow-xs transition-all duration-200 hover:border-accent hover:shadow-card md:p-7"
                  >
                    <div>
                      <IconBadge
                        icon={Icon}
                        tone="azure"
                        size="md"
                        className="mb-5 transition-transform duration-200 group-hover:scale-105"
                      />
                      <h3 className="font-display text-lg leading-snug font-bold text-heading transition-colors group-hover:text-accent-strong md:text-xl">
                        {tagline}
                      </h3>
                    </div>

                    {/* Subtle hover accent bar */}
                    <div className="mt-6 border-t border-line/50 pt-4">
                      <div className="h-1 w-10 rounded-full bg-accent/30 transition-all duration-300 group-hover:w-16 group-hover:bg-brand-ribbon" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
