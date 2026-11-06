import { useTranslation } from "react-i18next";
import { frenchSpacing } from "@/lib/typography.js";

const LINK_PATTERN =
  /(https?:\/\/[^\s]*[^\s.,;:!?)]|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\+225(?: \d{2}){5})/g;

const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_PATTERN = /^\+225(?: \d{2}){5}$/;

const linkClasses =
  "text-link underline underline-offset-4 hover:decoration-2 break-words focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

/**
 * Renders text with auto-linked URLs, emails, and phone numbers without altering visible characters.
 * Runs frenchSpacing before splitting.
 *
 * @param {object} props
 * @param {string} props.text
 * @returns {import("react").JSX.Element}
 */
export function Linkified({ text }) {
  const { i18n } = useTranslation();
  if (typeof text !== "string" || !text) return null;

  const spaced = frenchSpacing(text, i18n.language);
  const parts = spaced.split(LINK_PATTERN);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith("http://") || part.startsWith("https://")) {
          return (
            <a key={index} href={part} className={linkClasses}>
              {part}
            </a>
          );
        }

        if (EMAIL_PATTERN.test(part)) {
          return (
            <a key={index} href={`mailto:${part}`} className={linkClasses}>
              {part}
            </a>
          );
        }

        if (PHONE_PATTERN.test(part)) {
          const telHref = `tel:${part.replace(/\s+/g, "")}`;
          return (
            <a key={index} href={telHref} className={linkClasses}>
              {part}
            </a>
          );
        }

        return part;
      })}
    </>
  );
}
