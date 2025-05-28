import { create } from "zustand";
export const useCreatePromptStore = create((set) => ({
  isVisible: false,
  isFolder: null,
  targetPath: null,
  setIsVisible: (isVisible) => set({ isVisible }),
  setIsFolder: (inputIsFolder) => {
    set({ isFolder: inputIsFolder });
  },
  setTargetPath: (path) => {
    set({ targetPath: path });
  },
}));
