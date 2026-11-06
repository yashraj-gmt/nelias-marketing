import { useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { StepProgress } from "@/components/patterns/StepProgress";
import { Seo } from "@/components/common/Seo";
import { useConfigurator } from "@/hooks/useConfigurator";
import { STEPS } from "@/lib/configurator/constants";
import { ConfigNav } from "./ConfigNav";
import { SummaryPanel } from "./SummaryPanel";
import { EstimatePanel } from "./EstimatePanel";
import { StepIntro } from "./StepIntro";
import { StepProfile } from "./StepProfile";
import { StepOperations } from "./StepOperations";
import { StepRecommendation } from "./StepRecommendation";
import { StepCustomize } from "./StepCustomize";
import { StepSummary } from "./StepSummary";

// TODO(Debass): the PDF gives no SEO copy for the configurator; the description is the approved helper line.

/**
 * Main shell component for Configure My NELIAS page.
 */
export function ConfiguratorApp() {
  const { t } = useTranslation();
  const {
    step,
    data,
    error,
    saved,
    shared,
    hasDraft,
    plansById,
    catalog,
    rec,
    effectivePlan,
    options,
    est,
    effectiveModules,
    recommendedModules,
    visibleModules,
    info,
    labels,
    toggleModule,
    resetModules,
    start,
    resume,
    startAgain,
    goTo,
    back,
    next,
    patch,
    toggleIn,
    setIndustry,
    save,
  } = useConfigurator();

  const cardRef = useRef(null);
  const prevStepRef = useRef(step);

  const isIntro = step === "intro";
  const stepIndex = STEPS.indexOf(step);

  const stepItems = useMemo(
    () =>
      STEPS.map((id) => ({
        id,
        label: t(`configurator:steps.${id}`),
      })),
    [t],
  );

  // Focus management and scroll on step change
  useEffect(() => {
    if (prevStepRef.current !== step) {
      prevStepRef.current = step;
      if (cardRef.current) {
        const heading = cardRef.current.querySelector("h2");
        if (heading) {
          heading.focus({ preventScroll: true });
        }
        cardRef.current.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }
  }, [step]);

  return (
    <>
      <Seo title={t("configurator:seo.title")} description={t("configurator:seo.description")} />

      {/* Top Banner / Progress Area */}
      <Section tone="tint" spacing="md">
        <Container>
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-h1 text-heading">{t("configurator:page.title")}</h1>

            {!isIntro && (
              <StepProgress
                steps={stepItems}
                current={stepIndex}
                onStepClick={(idx) => {
                  if (idx < stepIndex) {
                    goTo(STEPS[idx]);
                  }
                }}
                aria-label={t("configurator:page.progressLabel")}
              />
            )}
          </div>
        </Container>
      </Section>

      {/* Main Content Area */}
      <Section tone="default" spacing="lg">
        <Container>
          {isIntro ? (
            <div ref={cardRef}>
              <StepIntro
                hasDraft={hasDraft}
                onStart={start}
                onResume={resume}
                onStartAgain={startAgain}
              />
            </div>
          ) : (
            <div>
              {/* Mobile / Tablet Accordion (placed ABOVE the card below lg) */}
              <div className="mb-6 block lg:hidden">
                <details
                  className="group rounded-lg border border-line bg-surface-muted p-4"
                  open={step === "customize"}
                >
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-heading select-none">
                    <span>{t("configurator:panel.title")}</span>
                    <span className="text-xs font-normal text-fg-muted">
                      ({t("ui.details") || "Details"})
                    </span>
                  </summary>
                  <div className="mt-4 space-y-6">
                    <SummaryPanel
                      data={data}
                      effectivePlan={effectivePlan}
                      plansById={plansById}
                      catalog={catalog}
                      info={info}
                    />
                    {step !== "profile" && Boolean(effectivePlan) && (
                      <EstimatePanel
                        data={data}
                        effectivePlan={effectivePlan}
                        plansById={plansById}
                        est={est}
                        patch={patch}
                        isAside
                      />
                    )}
                  </div>
                </details>
              </div>

              {/* Responsive Grid */}
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left: Step Form Card */}
                <div
                  ref={cardRef}
                  className="rounded-xl border border-line bg-surface-raised p-6 md:p-8 lg:col-span-8"
                >
                  {step === "profile" && (
                    <StepProfile
                      data={data}
                      setIndustry={setIndustry}
                      patch={patch}
                      error={error}
                    />
                  )}

                  {step === "operations" && (
                    <StepOperations
                      data={data}
                      plansById={plansById}
                      effectivePlan={effectivePlan}
                      visibleModules={visibleModules}
                      effectiveModules={effectiveModules}
                      recommendedModules={recommendedModules}
                      labels={labels}
                      info={info}
                      toggleModule={toggleModule}
                      resetModules={resetModules}
                      patch={patch}
                    />
                  )}

                  {step === "recommendation" && (
                    <StepRecommendation
                      data={data}
                      rec={rec}
                      effectivePlan={effectivePlan}
                      plansById={plansById}
                      options={options}
                      catalog={catalog}
                      effectiveModules={effectiveModules}
                      recommendedModules={recommendedModules}
                      labels={labels}
                      info={info}
                    />
                  )}

                  {step === "customize" && (
                    <StepCustomize
                      data={data}
                      effectivePlan={effectivePlan}
                      rec={rec}
                      plansById={plansById}
                      catalog={catalog}
                      options={options}
                      visibleModules={visibleModules}
                      effectiveModules={effectiveModules}
                      recommendedModules={recommendedModules}
                      labels={labels}
                      info={info}
                      toggleModule={toggleModule}
                      resetModules={resetModules}
                      toggleIn={toggleIn}
                      patch={patch}
                    />
                  )}

                  {step === "summary" && (
                    <StepSummary
                      data={data}
                      shared={shared}
                      saved={saved}
                      rec={rec}
                      effectivePlan={effectivePlan}
                      plansById={plansById}
                      est={est}
                      catalog={catalog}
                      effectiveModules={effectiveModules}
                      info={info}
                      goTo={goTo}
                      save={save}
                      patch={patch}
                    />
                  )}

                  <ConfigNav step={step} onBack={back} onNext={next} />
                </div>

                {/* Right: Sticky Sidebar Aside (Desktop from lg) */}
                <aside className="hidden space-y-6 lg:sticky lg:top-28 lg:col-span-4 lg:block lg:self-start">
                  <SummaryPanel
                    data={data}
                    effectivePlan={effectivePlan}
                    plansById={plansById}
                    catalog={catalog}
                    info={info}
                  />

                  {step !== "profile" && Boolean(effectivePlan) && (
                    <EstimatePanel
                      data={data}
                      effectivePlan={effectivePlan}
                      plansById={plansById}
                      est={est}
                      patch={patch}
                      isAside
                    />
                  )}
                </aside>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
