import { create } from "zustand";
export const useTabStore = create((set) => ({
  fileName: null,
  setFileName: (fullPath) => {
    const parts = fullPath.split("/");
    const name = parts[parts.length - 1];
    set: ({ fileName: name });
  },
}));
