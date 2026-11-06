import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo.jsx";
import { PageHeader } from "@/components/patterns/PageHeader.jsx";
import { ContactLayout } from "@/sections/contact/ContactLayout.jsx";
import { ContactLocation } from "@/sections/contact/ContactLocation.jsx";

// TODO(Debass): the PDF gives no SEO copy for Contact and Demo; titles follow the approved "<Page> | NELIAS BMP" pattern and the description is the first approved sentence of the body.

/**
 * Contact page with hero header, 2-column contact form layout, and interactive location map.
 *
 * @returns {import("react").JSX.Element}
 */
export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t("contact:seo.contactTitle")} description={t("contact:seo.description")} />

      <PageHeader
        title={t("contact:hero.title")}
        lead={t("contact:hero.lead")}
        tone="tint"
        accent={true}
      />

      <ContactLayout type="contact" />

      <ContactLocation />
    </>
  );
}
