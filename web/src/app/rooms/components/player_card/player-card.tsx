import { DropdownMenu } from "radix-ui";
import type { Player } from "../../types/room.types";
import styles from "./player-card.module.css";

interface PlayerCardProps {
  player: Player;
}

const STATUS_LABEL: Record<Player["status"], string | null> = {
  idle: null,
  answering: "отвечает",
  correct: "ответил верно",
  wrong: "ответил неверно",
};

export function PlayerCard({ player }: PlayerCardProps) {
  const statusLabel = STATUS_LABEL[player.status];

  return (
    <div className={styles.card} data-status={player.status}>
      <span className={styles.name}>{player.name}</span>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={styles.menuTrigger}
            aria-label="Действия с игроком"
          >
            ⋯
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={styles.menuContent} sideOffset={4}>
            {/* Заглушка */}
            <DropdownMenu.Item className={styles.menuItem} disabled>
              Действия скоро появятся
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {statusLabel && <span className={styles.statusLabel}>{statusLabel}</span>}
    </div>
  );
}
