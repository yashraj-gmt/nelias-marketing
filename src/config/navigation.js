import { site } from "@/config/site";

/**
 * Main navigation items shown on the header nav bar.
 * Labels come from i18n keys `nav.*`.
 * @type {Array<{ key: string, to: string }>}
 */
export const mainNav = [
  { key: "about", to: "/about" },
  { key: "industries", to: "/industries" },
  { key: "features", to: "/features" },
  { key: "pricing", to: "/pricing" },
];

/**
 * Contact navigation item.
 * @type {{ key: string, to: string }}
 */
export const contactNav = { key: "contact", to: "/contact" };

/**
 * Primary navigation items (mainNav + contact).
 * @type {Array<{ key: string, to: string }>}
 */
export const primaryNav = [...mainNav, contactNav];

/**
 * Footer navigation items (Home + Industries, Features, Pricing, Contact).
 * Note: About Us is deliberately excluded from the footer in this step.
 * @type {Array<{ key: string, to: string }>}
 */
export const footerNav = [
  { key: "home", to: "/" },
  { key: "industries", to: "/industries" },
  { key: "features", to: "/features" },
  { key: "pricing", to: "/pricing" },
  contactNav,
];

/**
 * Footer legal links.
 * @type {Array<{ key: string, to: string }>}
 */
export const legalNav = [
  { key: "privacy", to: "/privacy" },
  { key: "terms", to: "/terms" },
  { key: "faq", to: "/faq" },
  { key: "dpa", to: "/dpa" },
  { key: "sla", to: "/sla" },
];

/**
 * Sign In and Sign Up navigation items.
 */
export const signUpLink = {
  key: "signUp",
  href: site.signUpUrl,
  external: !site.signUpUrl.startsWith("/"),
};

export const signInLink = {
  key: "signIn",
  href: site.loginUrl,
  external: !site.loginUrl.startsWith("/"),
};
