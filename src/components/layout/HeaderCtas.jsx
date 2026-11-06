import { CtaLink } from "@/components/common/CtaLink";
import { cn } from "@/lib/cn";

/**
 * Header and Mobile Menu CTA button.
 * Renders the Book a Demo CTA with primary styling.
 *
 * @param {Object} props
 * @param {string} [props.location="header"]
 * @param {"md"|"lg"} [props.size="md"]
 * @param {boolean} [props.stacked=false]
 * @param {boolean} [props.onDark=false]
 * @param {string} [props.className]
 */
export function HeaderCtas({
  location = "header",
  size = "md",
  stacked = false,
  onDark = false,
  className,
}) {
  return (
    <div className={cn("flex items-center gap-3", stacked && "w-full flex-col", className)}>
      <CtaLink
        intent="demo"
        variant={onDark ? "onDark" : "primary"}
        size={size}
        location={location}
        className={stacked ? "w-full" : undefined}
      />
    </div>
  );
}
