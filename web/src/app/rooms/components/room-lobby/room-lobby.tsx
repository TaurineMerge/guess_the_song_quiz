import { useEffect, useState } from "react";
import { AlertDialog } from "radix-ui";
import {
  createMockRoomState,
  MOCK_CURRENT_USER_ID,
} from "../../mocks/room.mock";
import { useRoomStore } from "../../store/room-store";
import { useSessionStore } from "../../store/session-store";
import { PlayerCard } from "../player_card/player-card";
import { Visualizer } from "../visualizer/visualizer";
import { AnswerButton } from "../answer_button/answer-button";
import { AnswerInput } from "../answer_input/answer-input";
import { YoutubePlayer } from "../youtube_player/youtube-player";
import styles from "./room-lobby.module.css";

export function RoomLobby() {
  const room = useRoomStore((state) => state.room);
  const setRoomState = useRoomStore((state) => state.setRoomState);
  const currentUserId = useSessionStore((state) => state.currentUserId);
  const setCurrentUserId = useSessionStore((state) => state.setCurrentUserId);

  // Имитация того, что в реальности произойдёт при подключении к сокету:
  // сервер присылает room_state, и мы один раз кладём его в стор.
  // Когда появится socket.io-клиент, этот эффект заменится на socket.on('room_state', setRoomState)
  // внутри сокет-провайдера — сам стор и компоненты ниже не изменятся.
  useEffect(() => {
    setRoomState(createMockRoomState());
    setCurrentUserId(MOCK_CURRENT_USER_ID);
  }, [setRoomState, setCurrentUserId]);

  // UI-стейт: показывать поле ввода или кнопку. Не часть RoomState,
  // потому что это решение конкретного клиента, а не игровой стейт с сервера.
  const [isAnswering, setIsAnswering] = useState(false);

  const handleExit = () => {
    // Здесь будет emit('leave_room') + переход на страницу со списком комнат.
    console.log("leave_room (mock)");
  };

  const handleAnswerButtonClick = () => {
    // Реальная логика: emit('submit_answer', { type: 'start' }) если нужно
    // зафиксировать buzz до того, как игрок допечатает ответ (buzz mode).
    // Пока просто открываем поле ввода.
    setIsAnswering(true);
  };

  const handleAnswerSubmit = (value: string) => {
    // Здесь будет emit('submit_answer', { text: value }).
    console.log("submit_answer (mock):", value);
    setIsAnswering(false);
  };

  const handleAnswerCancel = () => {
    setIsAnswering(false);
  };

  // room ещё не пришёл (аналог ожидания room_state после подключения к сокету)
  if (!room) {
    return <div className={styles.room}>Загрузка комнаты...</div>;
  }

  const isSomeoneElseAnswering =
    room.currentRound?.answeringPlayerId != null &&
    room.currentRound.answeringPlayerId !== currentUserId;

  return (
    <div className={styles.room}>
      {/* Скрытый youtube-плеер. Рендерится только во время активного раунда */}
      {room.currentRound && (
        <YoutubePlayer playback={room.currentRound.playback} />
      )}

      <div className={styles.playerList}>
        {room.players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className={styles.exitButton}>Выход</button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlay} />
          <AlertDialog.Content className={styles.dialogContent}>
            <AlertDialog.Title className={styles.dialogTitle}>
              Выйти из комнаты?
            </AlertDialog.Title>
            <AlertDialog.Description className={styles.dialogDescription}>
              Вы потеряете текущий прогресс в этой игре.
            </AlertDialog.Description>
            <div className={styles.dialogActions}>
              <AlertDialog.Cancel asChild>
                <button className={styles.dialogButtonSecondary}>Отмена</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className={styles.dialogButtonDanger}
                  onClick={handleExit}
                >
                  Выйти
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <div className={styles.mainArea}>
        <Visualizer />
        {isAnswering ? (
          <AnswerInput
            onSubmit={handleAnswerSubmit}
            onCancel={handleAnswerCancel}
          />
        ) : (
          <AnswerButton
            disabled={isSomeoneElseAnswering}
            onAnswer={handleAnswerButtonClick}
          />
        )}
      </div>
    </div>
  );
}
