import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo";
import { PageHeader } from "@/components/patterns/PageHeader";
import { StorySection } from "@/sections/about/StorySection";
import { WhySection } from "@/sections/home/WhySection";
import { AnswerSection } from "@/sections/about/AnswerSection";
import { MissionSection } from "@/sections/about/MissionSection";
import { VisionSection } from "@/sections/about/VisionSection";
import { AboutClosing } from "@/sections/about/AboutClosing";

// TODO(Debass): the About copy comes from NELIAS_About_Us_For_Rahul_EN.docx and replaces the earlier PDF Section 9 text (headline "Built from African business realities. Designed for broader ambition.", the Abidjan description and the one-sentence vision). Confirm.
export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo pageKey="about" />
      <PageHeader
        title={t("about:header.title")}
        lead={t("about:header.lead")}
        tone="tint"
        spacing="sm"
        accent={true}
      />
      <StorySection />
      <WhySection tone="muted" headingId="about-why-heading" />
      <AnswerSection tone="default" />
      <MissionSection />
      <VisionSection />
      <AboutClosing />
    </>
  );
}
