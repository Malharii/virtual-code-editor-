import { create } from "zustand";
import { useActiveFileTabStore } from "./acitveFileTabStore";
import { useTreeStructuerStore } from "./treeStructuerStore";

export const useEditorSocketStore = create((set) => {
  return {
    editorSocket: null,

    setEditorSocket: (incomingSocket) => {
      const acitveFileTabStore = useActiveFileTabStore.getState().setActiveFileTab;
      const projectTreeStructureSetter =
        useTreeStructuerStore.getState().setTreeStructuer;

      incomingSocket?.on("readFileSuccess", (data) => {
        console.log("read File Success", data);
        const fileExtention = data.path.split(".").pop();
        acitveFileTabStore(data.path, data.value, fileExtention);
      });
      incomingSocket?.on("writeFileSuccess", (data) => {
        console.log("write File Success", data);
        incomingSocket.emit("readFile", {
          pathToFileorFolder: data.path,
        });
      });
      incomingSocket?.on("deleteFileSuccess", () => {
        console.log("delete File Success");
        projectTreeStructureSetter();
      });
      incomingSocket?.on("deleteFolderSuccess", () => {
        console.log("delete Folder Success");
        projectTreeStructureSetter();
      });
      set({ editorSocket: incomingSocket });
    },
  };
});
