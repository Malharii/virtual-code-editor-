import { create } from "zustand";
import { useActiveFileTabStore } from "./acitveFileTabStore";

export const useEditorSocketStore = create((set) => {
  return {
    editorSocket: null,

    setEditorSocket: (incomingSocket) => {
      const acitveFileTabStore = useActiveFileTabStore.getState().setActiveFileTab;

      incomingSocket?.on("readFileSuccess", (data) => {
        console.log("read File Success", data);
        acitveFileTabStore(data.path, data.value);
      });
      incomingSocket?.on("writeFileSuccess", (data) => {
        console.log("write File Success", data);
        incomingSocket.emit("readFile", {
          pathToFileorFolder: data.path,
        });
      });
      set({ editorSocket: incomingSocket });
    },
  };
});
