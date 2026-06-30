import styles from "./visualizer.module.css";

// Заглушка
export function Visualizer() {
  return (
    <div className={styles.visualizer}>
      <span className={styles.label}>Визуализатор</span>
    </div>
  );
}
