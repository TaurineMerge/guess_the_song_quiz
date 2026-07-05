import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import styles from "./form-field.module.css";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, id, ...inputProps }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${fieldId}-error`;

    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={styles.input}
          data-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          {...inputProps}
        />
        {hint && !error && <p className={styles.hint}>{hint}</p>}
        {error && (
          <p className={styles.error} id={errorId} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
