import { create } from "zustand";

interface SessionStore {
  currentUserId: string | null;
  accessToken: string | null;
  setCurrentUserId: (id: string | null) => void;
  setAccessToken: (token: string | null) => void;
  initFromStorage: () => void;
  clear: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  currentUserId: null,
  accessToken: null,

  setCurrentUserId: (id) => set({ currentUserId: id }),

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
    set({ accessToken: token });
  },

  initFromStorage: () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      set({ accessToken: token, currentUserId: payload.sub });
    } catch {
      localStorage.removeItem("access_token");
    }
  },

  clear: () => {
    localStorage.removeItem("access_token");
    set({ accessToken: null, currentUserId: null });
  },
}));
