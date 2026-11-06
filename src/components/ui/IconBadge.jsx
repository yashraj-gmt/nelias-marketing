import { cn } from "@/lib/cn";

const toneMap = {
  azure: "bg-accent-soft text-accent-strong",
  navy: "bg-selected text-selected-fg",
  neutral: "bg-surface-sunken text-heading",
};

const sizeMap = {
  sm: "h-8 w-8 min-h-8 min-w-8 [&>svg]:h-4 [&>svg]:w-4",
  md: "h-10 w-10 min-h-10 min-w-10 [&>svg]:h-5 [&>svg]:w-5",
  lg: "h-12 w-12 min-h-12 min-w-12 [&>svg]:h-6 [&>svg]:w-6",
};

/**
 * Standard icon container badge. Never uses orange.
 *
 * @param {Object} props
 * @param {import("react").ComponentType} props.icon
 * @param {"azure"|"navy"|"neutral"} [props.tone="azure"]
 * @param {"md"|"lg"} [props.size="md"]
 * @param {string} [props.className]
 */
export function IconBadge({
  icon: IconComponent,
  tone = "azure",
  size = "md",
  className,
  ...rest
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md",
        toneMap[tone] || toneMap.azure,
        sizeMap[size] || sizeMap.md,
        className,
      )}
      {...rest}
    >
      {IconComponent && <IconComponent aria-hidden="true" />}
    </span>
  );
}
