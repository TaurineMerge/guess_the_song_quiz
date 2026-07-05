import { type Socket } from "socket.io-client";
import { useRoomStore } from "../store/room-store";
import { roomServerEvents } from "shared/rooms/events/room-server-events";
import type {
  RoomDto,
  Player,
  PlayerLeftPayload,
  Round,
  AnswerResultPayload,
  ScoreUpdatedPayload,
} from "shared/rooms/types/room.types";

export class RoomEventHandler {
  #socket: Socket;

  constructor(socket: Socket) {
    this.#socket = socket;
    this.register();
  }

  register() {
    const store = useRoomStore.getState();

    this.#socket.on(roomServerEvents.ROOM_STATE, (payload: RoomDto) => {
      store.setRoomState(payload);
    });

    this.#socket.on(roomServerEvents.PLAYER_JOINED, (payload: Player) => {
      store.addPlayer(payload);
    });

    this.#socket.on(
      roomServerEvents.PLAYER_LEFT,
      (payload: PlayerLeftPayload) => {
        store.removePlayer(payload.playerId);
      },
    );

    this.#socket.on(roomServerEvents.ROUND_STARTED, (payload: Round) => {
      store.startRound(payload);
    });

    this.#socket.on(
      roomServerEvents.ANSWER_RESULT,
      (payload: AnswerResultPayload) => {
        store.setPlayerStatus(payload.playerId, payload.status);
      },
    );

    this.#socket.on(
      roomServerEvents.SCORE_UPDATED,
      (payload: ScoreUpdatedPayload) => {
        store.setPlayerScore(payload.playerId, payload.score);
      },
    );

    this.#socket.on(roomServerEvents.GAME_STARTED, () => {
      store.setRoomStatus("active");
    });

    this.#socket.on(roomServerEvents.GAME_FINISHED, () => {
      store.setRoomStatus("finished");
    });

    // error: пока просто логируем. Полноценная обработка (тосты, реконнект-логика)
    // — отдельная задача, не относится к подключению событий комнаты.
    this.#socket.on(roomServerEvents.ERROR, (payload: unknown) => {
      console.error("[socket] server error:", payload);
    });
  }

  unregisterAll() {
    this.#socket.off(roomServerEvents.ROOM_STATE);
    this.#socket.off(roomServerEvents.PLAYER_JOINED);
    this.#socket.off(roomServerEvents.PLAYER_LEFT);
    this.#socket.off(roomServerEvents.ROUND_STARTED);
    this.#socket.off(roomServerEvents.ANSWER_RESULT);
    this.#socket.off(roomServerEvents.SCORE_UPDATED);
    this.#socket.off(roomServerEvents.GAME_STARTED);
    this.#socket.off(roomServerEvents.GAME_FINISHED);
    this.#socket.off(roomServerEvents.ERROR);
  }
}
