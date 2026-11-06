import { cn } from "@/lib/cn";

const sizeMap = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
};

/**
 * Standard section heading with fluid typography, optional eyebrow and lead.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.titleClassName]
 * @param {string} [props.lead]
 * @param {string} [props.leadClassName]
 * @param {string} [props.eyebrow]
 * @param {"start"|"center"} [props.align="start"]
 * @param {import("react").ElementType} [props.as="h2"]
 * @param {"h1"|"h2"|"h3"} [props.size]
 * @param {"default"|"inverse"} [props.tone="default"]
 * @param {string} [props.id]
 * @param {string} [props.className]
 */
export function SectionHeading({
  title,
  titleClassName,
  lead,
  leadClassName,
  eyebrow,
  align = "start",
  as: HeadingTag = "h2",
  size,
  tone = "default",
  id,
  className,
  ...rest
}) {
  const isCentered = align === "center";
  const isInverse = tone === "inverse";
  const headingSizeClass = size
    ? sizeMap[size]
    : typeof HeadingTag === "string" && sizeMap[HeadingTag]
      ? sizeMap[HeadingTag]
      : sizeMap.h2;

  return (
    <div
      className={cn(
        "mb-8 flex flex-col md:mb-12",
        isCentered && "mx-auto items-center text-center",
        className,
      )}
      {...rest}
    >
      {eyebrow && (
        <p className={cn("mb-2 text-sm font-semibold text-link", isInverse && "text-white")}>
          {eyebrow}
        </p>
      )}

      <HeadingTag
        id={id}
        className={cn(
          "font-display leading-tight font-semibold tracking-tight text-heading",
          headingSizeClass,
          isInverse && "text-white",
          titleClassName,
        )}
      >
        {title}
      </HeadingTag>

      {lead && (
        <p
          className={cn(
            "mt-4 max-w-[62ch] text-lead leading-relaxed text-fg-muted",
            isInverse && "text-fg-inverse-muted",
            leadClassName,
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
