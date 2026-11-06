import { useEffect, useRef, useId } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

/**
 * Accessible modal dialog using native <dialog> with showModal().
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 * @param {import("react").ReactNode} [props.footer]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  className,
  children,
}) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;

  // Sync open state with native dialog methods
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  // Sync native Esc (cancel event) and close events
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  // Handle backdrop clicks
  const handleDialogClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClick={handleDialogClick}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] animate-modal-in overflow-y-auto rounded-xl bg-surface-raised p-0 text-fg shadow-raised backdrop:bg-navy-950/60 open:flex open:flex-col",
        sizeMap[size] || sizeMap.md,
        className,
      )}
    >
      {/* Modal header */}
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line p-6">
        <div>
          <h2 id={titleId} className="font-display text-xl leading-snug font-semibold text-heading">
            {title}
          </h2>
          {description && (
            <p id={descId} className="mt-1 text-sm text-fg-muted">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("ui.close")}
          className="inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-strong transition-colors hover:bg-surface-sunken hover:text-heading"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Modal body */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>

      {/* Modal footer */}
      {footer && (
        <div className="flex shrink-0 items-center justify-end gap-3 rounded-b-xl border-t border-line bg-surface-muted p-4">
          {footer}
        </div>
      )}
    </dialog>
  );
}
