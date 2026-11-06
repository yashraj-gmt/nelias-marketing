import { useTranslation } from "react-i18next";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Accessible numeric stepper control with plus/minus triggers.
 *
 * @param {Object} props
 * @param {number} [props.value=1]
 * @param {(value: number) => void} props.onChange
 * @param {number} [props.min=0]
 * @param {number} [props.max=9999]
 * @param {number} [props.step=1]
 * @param {string} [props.id]
 * @param {string} [props.decreaseLabel]
 * @param {string} [props.increaseLabel]
 * @param {string} [props.unit]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.aria-describedby]
 * @param {string} [props.aria-invalid]
 * @param {string} [props.className]
 */
export function NumberStepper({
  value = 1,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  id,
  decreaseLabel,
  increaseLabel,
  unit,
  disabled = false,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
}) {
  const { t } = useTranslation();

  const decLabel = decreaseLabel || t("ui.decrease");
  const incLabel = increaseLabel || t("ui.increase");

  const clamp = (val) => {
    const num = isNaN(val) ? min : val;
    return Math.max(min, Math.min(max, num));
  };

  const handleDecrease = () => {
    if (disabled || value <= min) return;
    const next = clamp(value - step);
    onChange?.(next);
  };

  const handleIncrease = () => {
    if (disabled || value >= max) return;
    const next = clamp(value + step);
    onChange?.(next);
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange?.(min);
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onChange?.(parsed);
    }
  };

  const handleBlur = (e) => {
    const parsed = parseInt(e.target.value, 10);
    const clamped = clamp(parsed);
    onChange?.(clamped);
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        aria-label={decLabel}
        disabled={disabled || value <= min}
        onClick={handleDecrease}
        className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-sm border border-field bg-surface-raised text-heading transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:border-line-strong disabled:bg-surface-sunken disabled:opacity-50"
      >
        <Minus className="h-5 w-5" aria-hidden="true" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        id={id}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="h-12 w-20 rounded-sm border border-field bg-surface-raised px-2 text-center text-lg font-semibold text-fg tabular-nums focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-fg-subtle"
      />

      <button
        type="button"
        aria-label={incLabel}
        disabled={disabled || value >= max}
        onClick={handleIncrease}
        className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-sm border border-field bg-surface-raised text-heading transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:border-line-strong disabled:bg-surface-sunken disabled:opacity-50"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>

      {unit && <span className="pl-1 text-sm font-medium text-fg-muted">{unit}</span>}
    </div>
  );
}
