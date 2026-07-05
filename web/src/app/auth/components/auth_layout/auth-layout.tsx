import { type ReactNode } from "react";
import styles from "./auth-layout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.root}>
      <div className={styles.brand}>
        <div className={styles.brandInner}>
          <p className={styles.eyebrow}>Музыкальная викторина</p>
          <h1 className={styles.title}>
            Угадай <span className={styles.titleAccent}>мелодию</span>
          </h1>
          <p className={styles.description}>
            Создавай комнаты, добавляй плейлисты, соревнуйся с друзьями в
            реальном времени.
          </p>
          <ul className={styles.features}>
            <li className={styles.feature}>
              <span className={styles.featureDot} />
              Плейлисты с YouTube — любая музыка
            </li>
            <li className={styles.feature}>
              <span className={styles.featureDot} />
              До 8 игроков в одной комнате
            </li>
            <li className={styles.feature}>
              <span className={styles.featureDot} />
              Buzz mode
            </li>
          </ul>
        </div>
        <p className={styles.privacy}>
          Регистрируясь, вы соглашаетесь с{" "}
          <a href="/privacy" className={styles.privacyLink}>
            политикой конфиденциальности
          </a>
        </p>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.form}>{children}</div>
    </div>
  );
}
