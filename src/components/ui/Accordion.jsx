import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Accessible FAQ / accordion component following WAI-ARIA disclosure pattern.
 *
 * @param {Object} props
 * @param {Array<{ id: string, title: string, content: import("react").ReactNode }>} props.items
 * @param {"single"|"multiple"} [props.type="single"]
 * @param {string[]} [props.defaultOpen]
 * @param {number} [props.headingLevel=3]
 * @param {"ruled"} [props.variant="ruled"]
 * @param {string} [props.className]
 */
export function Accordion({
  items = [],
  type = "single",
  defaultOpen = [],
  headingLevel = 3,
  variant = "ruled",
  className,
}) {
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpen));
  const headerRefs = useRef([]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (type === "single") {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleKeyDown = (e, index) => {
    const buttons = headerRefs.current.filter(Boolean);
    if (!buttons.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % buttons.length;
      buttons[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + buttons.length) % buttons.length;
      buttons[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttons[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttons[buttons.length - 1]?.focus();
    }
  };

  const HeadingTag = `h${headingLevel}`;

  return (
    <div
      className={cn(variant === "ruled" && "divide-y divide-line border-y border-line", className)}
    >
      {items.map(({ id, title, content }, index) => {
        const isOpen = openIds.has(id);
        const headerId = `accordion-header-${id}`;
        const panelId = `accordion-panel-${id}`;

        return (
          <div key={id} className="group">
            <HeadingTag className="m-0 p-0">
              <button
                ref={(el) => {
                  headerRefs.current[index] = el;
                }}
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-display text-lg font-semibold text-heading transition-colors hover:text-link focus-visible:outline-2 focus-visible:outline-focus"
              >
                <span>{title}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-fg-subtle transition-transform duration-200",
                    isOpen && "rotate-180 text-heading",
                  )}
                  aria-hidden="true"
                />
              </button>
            </HeadingTag>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-soft",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pt-1 pb-5 text-base leading-relaxed text-fg-muted">{content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
