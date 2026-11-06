import { useState, useCallback } from "react";

/**
 * Hook managing authentication form state, per-field blur validation,
 * submission handling, and accessible error focus management.
 *
 * @param {Object} options
 * @param {Record<string, string | boolean>} [options.initialValues={}]
 * @param {(values: Record<string, any>) => Record<string, { code: string } | null>} [options.validate]
 * @returns {{
 *   values: Record<string, any>,
 *   errors: Record<string, any>,
 *   touched: Record<string, boolean>,
 *   setValue: (name: string, value: any) => void,
 *   onBlur: (name: string) => void,
 *   handleSubmit: (onValid: (values: Record<string, any>) => void | Promise<void>) => (e?: import("react").SyntheticEvent) => Promise<void>,
 *   submitting: boolean,
 *   setSubmitting: import("react").Dispatch<import("react").SetStateAction<boolean>>,
 *   summary: boolean,
 *   setSummary: import("react").Dispatch<import("react").SetStateAction<boolean>>,
 *   setErrors: import("react").Dispatch<import("react").SetStateAction<Record<string, any>>>
 * }}
 */
export function useAuthForm({ initialValues = {}, validate }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState(false);

  const setValue = useCallback(
    (name, value) => {
      setValues((prev) => {
        const nextValues = { ...prev, [name]: value };
        if (touched[name] && validate) {
          const nextErrors = validate(nextValues) || {};
          setErrors((prevErr) => ({
            ...prevErr,
            [name]: nextErrors[name] || null,
          }));
        }
        return nextValues;
      });
    },
    [touched, validate],
  );

  const onBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validate) {
        const nextErrors = validate(values) || {};
        setErrors((prevErr) => ({
          ...prevErr,
          [name]: nextErrors[name] || null,
        }));
      }
    },
    [values, validate],
  );

  const handleSubmit = useCallback(
    (onValid) => async (e) => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }

      if (submitting) {
        return;
      }

      const currentErrors = validate ? validate(values) || {} : {};
      const hasErrors = Object.values(currentErrors).some(Boolean);

      const allTouched = {};
      for (const key of Object.keys(values)) {
        allTouched[key] = true;
      }
      setTouched(allTouched);
      setErrors(currentErrors);

      if (hasErrors) {
        setSummary(true);
        // Focus error summary if present, otherwise focus the first invalid field
        requestAnimationFrame(() => {
          const summaryEl = document.getElementById("form-error-summary");
          if (summaryEl) {
            summaryEl.focus();
          } else {
            const invalidFieldNames = Object.keys(currentErrors).filter((k) => currentErrors[k]);
            for (const name of invalidFieldNames) {
              const el = document.getElementById(name) || document.querySelector(`[name="${name}"]`);
              if (el && typeof el.focus === "function") {
                el.focus();
                break;
              }
            }
          }
        });
        return;
      }

      setSummary(false);
      if (onValid) {
        setSubmitting(true);
        try {
          await onValid(values);
        } finally {
          setSubmitting(false);
        }
      }
    },
    [values, validate, submitting],
  );

  return {
    values,
    errors,
    touched,
    setValue,
    onBlur,
    handleSubmit,
    submitting,
    setSubmitting,
    summary,
    setSummary,
    setErrors,
  };
}

