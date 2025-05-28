import { create } from "zustand";
export const useShowTerminal = create((set) => ({
  showingTerminal: true,
  setShowingTerminal: (value) => set({ showingTerminal: value }),
}));
