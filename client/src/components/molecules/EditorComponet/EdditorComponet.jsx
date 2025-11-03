import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useActiveFileTabStore } from "../../../store/acitveFileTabStore";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { extensionToFileType } from "../../../utils/extensionToFileType";
export const EditorComponet = () => {
  const [editorStore, setEditorStore] = useState({
    theme: null,
  });

  const { editorSocket } = useEditorSocketStore();
  const { activeFileTab } = useActiveFileTabStore();

  let timerId = null;
  async function downloadTheme() {
    try {
      const response = await fetch("/Dracula.json");
      if (!response.ok) throw new Error("Failed to load theme");
      const data = await response.json();
      setEditorStore({ theme: data });
    } catch (err) {
      console.error("Error loading theme:", err);
    }
  }

  function handleChange(value) {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      const editorContent = value;
      console.log("sending wirtefile event");
      editorSocket.emit("writeFile", {
        data: editorContent,
        pathToFileorFolder: activeFileTab?.path,
      });
    }, 2000);
  }

  function handleEditorTheme(editor, monaco) {
    if (editorStore.theme) {
      monaco.editor.defineTheme("dracula", editorStore.theme);
      monaco.editor.setTheme("dracula");
    }
  }

  useEffect(() => {
    downloadTheme();
  }, []);

  return (
    <>
      {editorStore.theme && (
        <Editor
          height={"100vh"}
          width={"80%"}
          defaultLanguage={undefined}
          language={extensionToFileType(activeFileTab?.extension)}
          value={activeFileTab?.value || ""}
          defaultValue="//Welcome to PlayGround"
          options={{ fontSize: 18, fontFamily: "monospace" }}
          onMount={handleEditorTheme}
          onChange={handleChange}
        />
      )}
    </>
  );
};
