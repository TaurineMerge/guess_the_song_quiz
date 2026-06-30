import styles from "./answer-button.module.css";

interface AnswerButtonProps {
  disabled?: boolean;
  onAnswer?: () => void;
}

// disabled пригодится при buzz mode: кнопка блокируется,
// если кто-то другой уже отвечает (currentRound.answeringPlayerId !== currentUserId).
export function AnswerButton({
  disabled = false,
  onAnswer,
}: AnswerButtonProps) {
  return (
    <button className={styles.button} disabled={disabled} onClick={onAnswer}>
      Кнопка ответа
    </button>
  );
}
