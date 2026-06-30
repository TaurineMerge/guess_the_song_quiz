import { create } from "zustand";
import type {
  Player,
  PlayerStatus,
  RoomState,
  RoundState,
} from "../types/room.types";

interface RoomStore {
  room: RoomState | null;

  // room_state: полная замена стейта (инициализация комнаты, reconnect)
  setRoomState: (room: RoomState) => void;

  // player_joined / player_left
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;

  // round_started
  startRound: (round: RoundState) => void;

  // answer_result: сервер сообщает, кто ответил и правильно ли
  setPlayerStatus: (playerId: string, status: PlayerStatus) => void;

  // score_updated
  setPlayerScore: (playerId: string, score: number) => void;

  // game_started / game_finished
  setRoomStatus: (status: RoomState["status"]) => void;

  // buzz mode: кто-то нажал кнопку ответа / отпустил её
  setAnsweringPlayer: (playerId: string | null) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,

  setRoomState: (room) => set({ room }),

  addPlayer: (player) =>
    set((state) => {
      if (!state.room) return state;
      // защита от дублей: на reconnect player_joined может прилететь повторно
      if (state.room.players.some((p) => p.id === player.id)) return state;
      return {
        room: { ...state.room, players: [...state.room.players, player] },
      };
    }),

  removePlayer: (playerId) =>
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          players: state.room.players.filter((p) => p.id !== playerId),
        },
      };
    }),

  startRound: (round) =>
    set((state) => {
      if (!state.room) return state;
      return { room: { ...state.room, currentRound: round } };
    }),

  setPlayerStatus: (playerId, status) =>
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          players: state.room.players.map((p) =>
            p.id === playerId ? { ...p, status } : p,
          ),
        },
      };
    }),

  setPlayerScore: (playerId, score) =>
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          players: state.room.players.map((p) =>
            p.id === playerId ? { ...p, score } : p,
          ),
        },
      };
    }),

  setRoomStatus: (status) =>
    set((state) => {
      if (!state.room) return state;
      return { room: { ...state.room, status } };
    }),

  setAnsweringPlayer: (playerId) =>
    set((state) => {
      if (!state.room || !state.room.currentRound) return state;
      return {
        room: {
          ...state.room,
          currentRound: {
            ...state.room.currentRound,
            answeringPlayerId: playerId,
          },
        },
      };
    }),
}));
