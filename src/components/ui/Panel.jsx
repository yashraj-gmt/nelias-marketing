import { cn } from "@/lib/cn";

const toneMap = {
  default: "bg-surface-raised border-line text-fg",
  muted: "bg-surface-muted border-line text-fg",
  tint: "bg-surface-tint border-accent-line text-fg",
  inverse: "bg-brand-deep border-white/10 text-fg-inverse",
};

const paddingMap = {
  md: "p-6 md:p-8",
  lg: "p-8 md:p-12",
  xl: "p-10 md:p-16",
};

/**
 * Large surface panel with rounded-xl corners.
 *
 * @param {Object} props
 * @param {"default"|"muted"|"tint"|"inverse"} [props.tone="default"]
 * @param {"md"|"lg"|"xl"} [props.padding="lg"]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function Panel({ tone = "default", padding = "lg", className, children, ...rest }) {
  const isInverse = tone === "inverse";

  return (
    <div
      data-tone={isInverse ? "inverse" : undefined}
      className={cn(
        "rounded-xl border transition-colors",
        toneMap[tone] || toneMap.default,
        paddingMap[padding] || paddingMap.lg,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
