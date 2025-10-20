import { create } from "zustand";

export const useEditorSocketStore = create((set) => {
  return {
    editorSocket: null,
    setEditorSocket: (incomingSocket) => set({ editorSocket: incomingSocket }),
  };
});
