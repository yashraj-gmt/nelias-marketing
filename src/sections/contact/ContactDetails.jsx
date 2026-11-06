import { useTranslation } from "react-i18next";
import { Mail, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { Panel, IconBadge, TextLink } from "@/components/ui";
import { site } from "@/config/site.js";
import { toTelHref, toWhatsAppHref } from "@/lib/contact.js";

/**
 * Contact details sidebar panel.
 *
 * @param {object} props
 * @param {"contact"|"demo"} [props.type="contact"]
 * @param {string} [props.className]
 */
export function ContactDetails({ type = "contact", className }) {
  const { t } = useTranslation();

  const items = [
    {
      key: "email",
      icon: Mail,
      label: t("contact:details.email"),
      value: site.contact.email,
      render: (val) => (
        <a
          href={`mailto:${val}`}
          className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {val}
        </a>
      ),
    },
    {
      key: "phone",
      icon: Phone,
      label: t("contact:details.phone"),
      value: site.contact.phone,
      render: (val) => (
        <a
          href={toTelHref(val)}
          className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {val}
        </a>
      ),
    },
    {
      key: "whatsapp",
      icon: MessageCircle,
      label: t("contact:details.whatsapp"),
      value: site.contact.whatsapp,
      render: (val) => (
        <a
          href={toWhatsAppHref(val)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {val}
        </a>
      ),
    },
    {
      key: "address",
      icon: MapPin,
      label: t("contact:details.address"),
      value: site.address,
      render: (val) => <span>{val}</span>,
    },
    {
      key: "hours",
      icon: Clock,
      label: t("contact:hours.title"),
      value: t("contact:hours.schedule"),
      render: (val) => (
        <div>
          <span>{val}</span>
          <span className="mt-1 block text-xs font-normal text-fg-muted">
            {t("contact:hours.response")}
          </span>
        </div>
      ),
    },
  ].filter((item) => Boolean(item.value));

  const crossLink =
    type === "contact"
      ? { to: "/demo", label: t("cta.bookDemo") }
      : { to: "/contact", label: t("cta.contactTeam") };

  return (
    <Panel tone="tint" padding="lg" className={className}>
      <h2 className="font-display text-h3 text-heading">{t("contact:details.title")}</h2>

      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.key} className="flex gap-4">
            <IconBadge
              icon={item.icon}
              tone="azure"
              className="h-11 min-h-11 w-11 min-w-11 shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-fg-muted">{item.label}</span>
              <div className="mt-0.5 text-lg font-semibold break-words text-heading">
                {item.render(item.value)}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-line pt-5">
        <TextLink to={crossLink.to}>{crossLink.label}</TextLink>
      </div>
    </Panel>
  );
}
