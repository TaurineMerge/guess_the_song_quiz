import { type Socket } from "socket.io-client";
import { useRoomStore } from "../store/room-store";
import type {
  RoomState,
  Player,
  PlayerLeftPayload,
  RoundState,
  AnswerResultPayload,
  ScoreUpdatedPayload,
} from "../types/room.types";

export class RoomEventHandler {
  #socket: Socket;

  constructor(socket: Socket) {
    this.#socket = socket;
    this.register();
  }

  register() {
    const store = useRoomStore.getState();

    this.#socket.on("room_state", (payload: RoomState) => {
      store.setRoomState(payload);
    });

    this.#socket.on("player_joined", (payload: Player) => {
      store.addPlayer(payload);
    });

    this.#socket.on("player_left", (payload: PlayerLeftPayload) => {
      store.removePlayer(payload.playerId);
    });

    this.#socket.on("round_started", (payload: RoundState) => {
      store.startRound(payload);
    });

    this.#socket.on("answer_result", (payload: AnswerResultPayload) => {
      store.setPlayerStatus(payload.playerId, payload.status);
    });

    this.#socket.on("score_updated", (payload: ScoreUpdatedPayload) => {
      store.setPlayerScore(payload.playerId, payload.score);
    });

    this.#socket.on("game_started", () => {
      store.setRoomStatus("active");
    });

    this.#socket.on("game_finished", () => {
      store.setRoomStatus("finished");
    });

    // error: пока просто логируем. Полноценная обработка (тосты, реконнект-логика)
    // — отдельная задача, не относится к подключению событий комнаты.
    this.#socket.on("error", (payload: unknown) => {
      console.error("[socket] server error:", payload);
    });
  }

  unregisterAll() {
    this.#socket.off("room_state");
    this.#socket.off("player_joined");
    this.#socket.off("player_left");
    this.#socket.off("round_started");
    this.#socket.off("answer_result");
    this.#socket.off("score_updated");
    this.#socket.off("game_started");
    this.#socket.off("game_finished");
    this.#socket.off("error");
  }
}
