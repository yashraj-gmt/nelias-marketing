import { cn } from "@/lib/cn";

const toneMap = {
  default: "bg-surface text-fg",
  muted: "bg-surface-muted text-fg",
  tint: "bg-surface-tint text-fg",
  inverse: "bg-brand-deep text-fg-inverse",
};

const spacingMap = {
  sm: "py-8 md:py-12 lg:py-14",
  md: "py-14 md:py-20",
  lg: "py-16 md:py-24 lg:py-28",
};

/**
 * Page section with tone and spacing presets.
 * @param {Object} props
 * @param {"default"|"muted"|"tint"|"inverse"} [props.tone="default"]
 * @param {"sm"|"md"|"lg"} [props.spacing="md"]
 * @param {string} [props.id]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function Section({ tone = "default", spacing = "md", id, className, children, ...rest }) {
  return (
    <section
      id={id}
      data-tone={tone === "inverse" ? "inverse" : undefined}
      className={cn(toneMap[tone], spacingMap[spacing], className)}
      {...rest}
    >
      {children}
    </section>
  );
}
