import { useEffect, useRef, useState } from "react";
import styles from "./answer-input.module.css";

interface AnswerInputProps {
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function AnswerInput({ onSubmit, onCancel }: AnswerInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите ответ..."
        autoComplete="off"
      />
      <button
        type="submit"
        className={styles.submitButton}
        disabled={value.trim().length === 0}
      >
        Отправить
      </button>
    </form>
  );
}
