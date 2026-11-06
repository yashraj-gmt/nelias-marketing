import { CtaLink } from "./CtaLink";

/**
 * Primary CTA helper component for marketing pages.
 * Resolves to the demo CTA ("Request a Demo").
 *
 * @param {Object} props
 * @param {string} [props.location]
 * @param {"md"|"lg"} [props.size="md"]
 * @param {boolean} [props.onDark=false]
 * @param {string} [props.className]
 */
export function PrimaryCta({ location, size = "md", onDark = false, className }) {
  const variant = onDark ? "onDark" : "primary";

  return (
    <CtaLink
      intent="demo"
      variant={variant}
      size={size}
      location={location}
      className={className}
    />
  );
}
