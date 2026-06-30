import { create } from "zustand";

// Отдельный стор от roomStore: session/auth-уровень данных,
// который будет жить независимо от конкретной комнаты (переживает переход
// между комнатами, восстанавливается из localStorage/jwt при реконнекте).
// RoomState нарочно не содержит этого поля — он зеркалит то, что приходит
// с сервера и одинаково для всех клиентов.
interface SessionStore {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  currentUserId: null,
  setCurrentUserId: (id) => set({ currentUserId: id }),
}));
