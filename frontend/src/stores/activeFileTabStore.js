import { create } from "zustand";
export const useActiveFileTabStore = create((set) => {
  return {
    activeFileTab: null,
    setActiveFileTab: (path, value, extension) => {
      const parts = path.split("/");
      const tabName = parts[parts.length - 1]; // Get file name from path

      set({
        activeFileTab: {
          path: path,
          value: value,
          extension: extension,
          fileName: tabName,
        },
      });
    },
  };
});
