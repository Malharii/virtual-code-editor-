import { create } from "zustand";

export const usePortStore = create((set) => ({
  port: null,
  reloadKey: 0,

  setPort: (port) => set({ port }),

  // 🔥 THIS triggers iframe reload
  triggerReload: () => set((state) => ({ reloadKey: state.reloadKey + 1 })),
}));
