import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStore";
import { useTreeStructureStore } from "./treeStructureStore";
import { usePortStore } from "./portStore";

export const useEditorSocketStore = create((set) => ({
  editorSocket: null,
  setEditorSocket: (incomingSocket) => {
    const activeFileTabSetter =
      useActiveFileTabStore.getState().setActiveFileTab;
    const projectTreeStructureSetter =
      useTreeStructureStore.getState().setTreeStructure;

    const portSetter = usePortStore.getState().setPort;
    incomingSocket?.on("readFileSuccess", (data) => {
      const fileExtension = data.path.split(".").pop();
      activeFileTabSetter(data.path, data.value, fileExtension);
    });
    incomingSocket?.on("writeFileSuccess", (data) => {
      console.log("Write File success", data);
      // incomingSocket.emit("readFile", {
      //   pathToFileOrFolder: data.path,
      // });
    });
    incomingSocket?.on("deleteFileSuccess", () => {
      projectTreeStructureSetter();
    });
    incomingSocket?.on("createFileSuccess", () => {
      projectTreeStructureSetter();
    });
    incomingSocket?.on("createFolderSuccess", () => {
      projectTreeStructureSetter();
    });
    incomingSocket?.on("deleteFolderSuccess", () => {
      projectTreeStructureSetter();
    });
    incomingSocket?.on("renamePathSuccess", () => {
      projectTreeStructureSetter();
    });
    incomingSocket?.on("getPortSuccess", (port) => {
      console.log("The port is ", port);
      portSetter(port);
    });

    set({ editorSocket: incomingSocket });
  },
}));
