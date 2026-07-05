import { useEffect, useState } from "react";
import { AlertDialog } from "radix-ui";
import { useRoomStore } from "../../store/room-store";
import { useSessionStore } from "../../../auth/store/session-store";
import { PlayerCard } from "../player_card/player-card";
import { Visualizer } from "../visualizer/visualizer";
import { AnswerButton } from "../answer_button/answer-button";
import { AnswerInput } from "../answer_input/answer-input";
import { YoutubePlayer } from "../youtube_player/youtube-player";
import { socket } from "../../socket/client";
import { roomClientEvents } from "shared/rooms/events/room-client-events";
import styles from "./room-lobby.module.css";
import { RoomEventHandler } from "../../socket/room-event-handler";
import { useParams } from "react-router";

export function RoomLobby() {
  const { roomId } = useParams<{ roomId: string }>();

  const room = useRoomStore((state) => state.room);
  const currentUserId = useSessionStore((state) => state.currentUserId);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    socket.auth = {
      token,
    };

    socket.connect();

    const handler = new RoomEventHandler(socket);

    socket.once("connect", () => {
      socket.emit(roomClientEvents.JOIN_ROOM, { roomId });
      console.log("connected:", socket.id);
    });

    return () => {
      socket.emit(roomClientEvents.LEAVE_ROOM, { roomId });
      handler.unregisterAll();
      socket.disconnect();
    };
  }, []);

  const [isAnswering, setIsAnswering] = useState(false);

  const handleExit = () => {
    console.log("leave_room");
    socket.emit(roomClientEvents.LEAVE_ROOM);
  };

  const handleAnswerButtonClick = () => {
    socket.emit(roomClientEvents.ANSWER_LOCK);
    setIsAnswering(true);
  };

  const handleAnswerSubmit = (value: string) => {
    if (!socket.connected) {
      console.warn("socket not connected, cannot submit answer");
      return;
    }
    socket.emit(roomClientEvents.SUBMIT_ANSWER, value);
    setIsAnswering(false);
  };

  const handleAnswerCancel = () => {
    setIsAnswering(false);
  };

  if (!room) {
    return <div className={styles.room}>Загрузка комнаты...</div>;
  }

  const isSomeoneElseAnswering =
    room.currentRound?.answeringPlayerId != null &&
    room.currentRound.answeringPlayerId !== currentUserId;

  return (
    <div className={styles.room}>
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
