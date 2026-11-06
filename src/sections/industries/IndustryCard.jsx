import { forwardRef } from "react";
import { Plus, Minus } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/cn";

/**
 * Industry selection card with button semantics.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.summary
 * @param {import("lucide-react").LucideIcon} [props.icon]
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClick
 * @param {string} [props.className]
 */
export const IndustryCard = forwardRef(function IndustryCard(
  { name, summary, icon: Icon, isOpen, onClick, className },
  ref,
) {
  const ToggleIcon = isOpen ? Minus : Plus;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={isOpen ? "industry-detail" : undefined}
      className={cn(
        "group relative flex min-h-[120px] w-full flex-col justify-between rounded-lg border p-5 text-left transition-colors duration-150",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
        isOpen
          ? "border-accent bg-surface-tint"
          : "border-line bg-surface-raised hover:border-accent-line",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        {Icon ? (
          <IconBadge icon={Icon} size="md" tone="azure" className="shrink-0" />
        ) : (
          <div className="h-10 w-10 shrink-0" />
        )}
        <span
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
            isOpen
              ? "border-accent text-accent"
              : "border-line text-fg-subtle group-hover:border-accent-line group-hover:text-heading",
          )}
          aria-hidden="true"
        >
          <ToggleIcon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4">
        <span className="block font-display text-xl leading-snug font-semibold text-heading">
          {name}
        </span>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">{summary}</p>
      </div>
    </button>
  );
});
