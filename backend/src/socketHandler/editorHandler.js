import fs from "fs/promises";
import pathModule from "path";
import { getContainerPort } from "../containers/handleContainerCreate.js";
import { getProjectTreeService } from "../services/projectService.js";
export const handleEditorSocketEvent = (socket, editorNameSpace) => {
  socket.on("writeFile", async ({ data, pathToFileOrFolder }) => {
    try {
      const response = await fs.writeFile(pathToFileOrFolder, data);
      editorNameSpace.emit("writeFileSuccess", {
        data: "File written successfully",
        path: pathToFileOrFolder,
      });
    } catch (error) {
      console.log("Error writing the file ", error);
      socket.emit("error", { data: "Error writing the file" });
    }
  });

  socket.on("createFile", async ({ pathToFileOrFolder }) => {
    console.log("the create file path is ", pathToFileOrFolder);

    try {
      // Check if file exists
      await fs.stat(pathToFileOrFolder);
      // If no error, file already exists
      socket.emit("error", { data: "File already exists" });
      return;
    } catch (err) {
      if (err.code !== "ENOENT") {
        // An error other than "file doesn't exist"
        console.log("Error checking file existence", err);
        socket.emit("error", { data: "Unexpected error while checking file" });
        return;
      }
      // ENOENT means the file doesn't exist — this is expected, so continue
    }

    // Try creating the file
    try {
      await fs.writeFile(pathToFileOrFolder, "");
      socket.emit("createFileSuccess", {
        data: "File created successfully!",
      });
    } catch (error) {
      console.log("Error creating the file", error);
      socket.emit("error", { data: "Error creating the file" });
    }
  });

  socket.on("readFile", async ({ pathToFileOrFolder }) => {
    try {
      const response = await fs.readFile(pathToFileOrFolder);
      console.log("response of reading file", response.toString());

      socket.emit("readFileSuccess", {
        value: response.toString(),
        path: pathToFileOrFolder,
      });
    } catch (error) {
      console.log("Error creating the file", error);
      socket.emit("error", { data: "Error creating the file" });
    }
  });

  socket.on("deleteFile", async ({ pathToFileOrFolder }) => {
    try {
      const response = await fs.unlink(pathToFileOrFolder);
      socket.emit("deleteFileSuccess", { data: "File deleted successfullyj" });
    } catch (err) {
      console.log("Error deleting the file", err);
      socket.emit("error", { data: "Error deleting the file" });
    }
  });

  socket.on("renamePath", async ({ oldPath, newName }) => {
    try {
      const directory = pathModule.dirname(oldPath);
      const newPath = pathModule.join(directory, newName);

      await fs.rename(oldPath, newPath);

      socket.emit("renamePathSuccess", {
        data: "Path renamed successfully!",
        oldPath,
        newPath,
      });
    } catch (error) {
      console.log("Error renaming the path", error);
      socket.emit("error", { data: "Error renaming the path" });
    }
  });

  socket.on("createFolder", async ({ pathToFileOrFolder }) => {
    try {
      console.log("the create folder path is ", pathToFileOrFolder);

      const response = await fs.mkdir(pathToFileOrFolder, { recursive: true });
      socket.emit("createFolderSuccess", {
        data: "Folder created successfully!",
      });
    } catch (error) {
      console.log("Error deleting the file", error);
      socket.emit("error", { data: "Error deleting the file" });
    }
  });

  socket.on("deleteFolder", async ({ pathToFileOrFolder }) => {
    try {
      const response = await fs.rmdir(pathToFileOrFolder, { recursive: true });
      socket.emit("folderDeleteSuccess", {
        data: "Folder deleted successfully!",
      });
    } catch (error) {
      console.log("Error deleting the folder", error);
      socket.emit("error", { data: "Error deleting the folder" });
    }
  });

  socket.on("getPort", async ({ containerName }) => {
    console.log("the container name is ", containerName);

    const port = await getContainerPort(containerName);
    console.log("port data", port);
    socket.emit("getPortSuccess", {
      port: port,
    });
  });
};
