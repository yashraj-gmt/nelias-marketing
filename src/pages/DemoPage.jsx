import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo.jsx";
import { PageHeader } from "@/components/patterns/PageHeader.jsx";
import { ContactLayout } from "@/sections/contact/ContactLayout.jsx";

// TODO(Debass): the PDF gives no Demo page copy; the approved label "Book a Demo" is the title and the approved Section 10 body is the lead. The page is an explicitly labelled demo REQUEST (no live scheduling tool is specified; demo scheduling needs Debass approval).

/**
 * Demo request page with hero header and 2-column demo/lead form layout.
 *
 * @returns {import("react").JSX.Element}
 */
export default function DemoPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t("contact:seo.demoTitle")} description={t("contact:seo.description")} />

      <PageHeader
        title={t("contact:demo.title")}
        lead={t("contact:hero.lead")}
        tone="tint"
        accent={true}
      />

      <ContactLayout type="demo" />
    </>
  );
}
