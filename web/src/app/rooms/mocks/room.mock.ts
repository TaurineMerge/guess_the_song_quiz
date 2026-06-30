import type { RoomState } from "../types/room.types";

// Локальный мок вместо реального room_state с бэка.
// Когда подключим Zustand store + socket, эта функция просто заменится
// на чтение из store — компоненты, использующие RoomState, не изменятся.
// ID текущего пользователя в этой сессии. В реальном приложении придёт
// из auth/session store (после логина или анонимного входа), не из RoomState.
export const MOCK_CURRENT_USER_ID = "player-1";

export function createMockRoomState(): RoomState {
  return {
    roomId: "mock-room-1",
    status: "active",
    players: [
      {
        id: "player-1",
        name: "Игрок 1",
        isHost: true,
        status: "idle",
        score: 0,
      },
      {
        id: "player-2",
        name: "Игрок 2",
        isHost: false,
        status: "wrong",
        score: 10,
      },
      {
        id: "player-3",
        name: "Игрок 3",
        isHost: false,
        status: "answering",
        score: 20,
      },
    ],
    currentRound: {
      roundNumber: 1,
      // null — раунд активен, но пока никто не жмёт кнопку ответа.
      // Если нужно проверить disabled-сценарий buzz mode, поставь сюда 'player-3'.
      answeringPlayerId: null,
      playback: {
        status: "playing",
        youtubeVideoId: "dQw4w9WgXcQ",
        positionSeconds: 12,
      },
    },
  };
}
