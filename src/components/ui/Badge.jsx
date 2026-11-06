import { cn } from "@/lib/cn";

const toneMap = {
  neutral: "bg-surface-sunken text-fg-strong",
  info: "bg-accent-soft text-accent-strong",
  success: "bg-success-soft text-success-strong",
  warning: "bg-warning-soft text-warning-strong",
  danger: "bg-danger-soft text-danger-strong",
  highlight: "bg-highlight-soft text-highlight-strong",
  inverse: "bg-white/10 text-white",
};

const sizeMap = {
  sm: "text-xs px-2.5 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
};

/**
 * Status and category badge pill.
 *
 * @param {Object} props
 * @param {"neutral"|"info"|"success"|"warning"|"danger"|"highlight"|"inverse"} [props.tone="neutral"]
 * @param {"sm"|"md"} [props.size="md"]
 * @param {import("react").ComponentType} [props.icon]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function Badge({
  tone = "neutral",
  size = "md",
  icon: IconComponent,
  className,
  children,
  ...rest
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full leading-none font-semibold",
        toneMap[tone] || toneMap.neutral,
        sizeMap[size] || sizeMap.md,
        className,
      )}
      {...rest}
    >
      {IconComponent && (
        <IconComponent
          className={cn("shrink-0", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
