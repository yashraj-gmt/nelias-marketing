import { useTranslation } from "react-i18next";
import { Clock, Layers, Sparkles, MessagesSquare } from "lucide-react";
import { Panel, IconBadge, TextLink } from "@/components/ui";

const ICONS = [Clock, Layers, Sparkles, MessagesSquare];

/**
 * Sidebar panel for the Demo page explaining what to expect during the live walkthrough,
 * eliminating duplicate contact information while providing an alternative route for general inquiries.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import("react").JSX.Element}
 */
export function DemoExpectations({ className }) {
  const { t } = useTranslation();

  const items = t("contact:demoSidebar.items", { returnObjects: true }) || [];

  return (
    <Panel tone="tint" padding="lg" className={className}>
      <h2 className="font-display text-h3 text-heading">{t("contact:demoSidebar.title")}</h2>
      <p className="mt-2 text-sm text-fg-muted">{t("contact:demoSidebar.lead")}</p>

      <ul className="mt-6 space-y-5">
        {Array.isArray(items) &&
          items.map((item, index) => {
            const Icon = ICONS[index] || Sparkles;
            return (
              <li key={item.title} className="flex gap-4">
                <IconBadge
                  icon={Icon}
                  tone="azure"
                  className="h-10 min-h-10 w-10 min-w-10 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-heading">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">{item.desc}</p>
                </div>
              </li>
            );
          })}
      </ul>

      <div className="mt-8 border-t border-line pt-6">
        <h3 className="text-sm font-semibold text-heading">
          {t("contact:demoSidebar.altContactTitle")}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-fg-muted">
          {t("contact:demoSidebar.altContactDesc")}
        </p>
        <div className="mt-3">
          <TextLink to="/contact">{t("contact:demoSidebar.altContactLink")}</TextLink>
        </div>
      </div>
    </Panel>
  );
}
