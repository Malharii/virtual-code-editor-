import fs from "fs/promises";
import { getContainerPort } from "../containers/handleContainerCreate.js";
export const handleEditorSocketEvents = (socket, editorNameSpace) => {
  socket.on("writeFile", async ({ data, pathToFileorFolder }) => {
    try {
      const response = await fs.writeFile(pathToFileorFolder, data);
      editorNameSpace.emit("writeFileSuccess", {
        data: "File written successfully",
        path: pathToFileorFolder,
      });
    } catch (error) {
      console.log("Error the  writing file", error);
      socket.emit("error", {
        data: "Error the  writing file",
      });
    }
  });
  socket.on("getPort", () => {
    console.log("getPort event received");
  });
  socket.on("createFile", async ({ pathToFileorFolder }) => {
    const isFileAlreadyPresent = await fs.stat(pathToFileorFolder);

    if (isFileAlreadyPresent) {
      socket.emit("error", {
        data: "File already present",
      });
      return;
    }
    try {
      const response = await fs.writeFile(pathToFileorFolder, "");
      socket.emit("createFileSuccess", {
        data: "File created successfully",
      });
    } catch (error) {
      console.log("Error the   creating  file", error);
      socket.emit("error", {
        data: "Error the  creating  file",
      });
    }
  });

  socket.on("readFile", async ({ pathToFileorFolder }) => {
    try {
      const response = await fs.readFile(pathToFileorFolder);
      console.log(response.toString());
      socket.emit("readFileSuccess", {
        value: response.toString(),
        path: pathToFileorFolder,
      });
    } catch (error) {
      console.log("Error the   creating  file", error);
      socket.emit("error", {
        data: "Error the  creating  file",
      });
    }
  });

  socket.on("deleteFile", async ({ pathToFileorFolder }) => {
    try {
      const response = await fs.unlink(pathToFileorFolder);
      socket.emit("deleteFileSuccess", {
        data: "File deleted successfully",
      });
    } catch (error) {
      console.log("Error the   creating  file", error);
      socket.emit("error", {
        data: "Error the  creating  file",
      });
    }
  });

  socket.on("createFolder", async ({ pathToFileorFolder }) => {
    try {
      const response = await fs.mkdir(pathToFileorFolder);
      console.log(response);
      socket.emit("createFolderSuccess", {
        data: "Folder created successfully",
      });
    } catch (error) {
      console.log("Error the   creating  file", error);
      socket.emit("error", {
        data: "Error the  creating  file",
      });
    }
  });

  socket.on("renameFolder", async ({ pathToFileorFolder, newName }) => {
    try {
      const response = await fs.rename(pathToFileorFolder, newName);
      socket.emit("renameFolderSuccess", {
        data: "Folder renamed successfully",
      });
    } catch (error) {
      console.log("Error the   creating  file", error);
      socket.emit("error", {
        data: "Error the  creating  file",
      });
    }
  });
  socket.on("deleteFolder", async ({ pathToFileorFolder }) => {
    try {
      const response = await fs.rm(pathToFileorFolder, { recursive: true });
      socket.emit("deleteFolderSuccess", {
        data: "Folder deleted successfully",
      });
    } catch (error) {
      console.log("Error the   creating  file", error);
      socket.emit("error", {
        data: "Error the  creating  file",
      });
    }
  });

  socket.on("getPort", async ({ containerName }) => {
    const port = await getContainerPort(containerName);
    console.log("port Data ", port);
    socket.emit("getPortSuccess", {
      port: port,
    });
  });
};
