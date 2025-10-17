import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
export const EditorComponet = () => {
  const [editorStore, setEditorStore] = useState({
    theme: null,
  });

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
          defaultLanguage="javascript"
          defaultValue="//Welcome to PlayGround"
          options={{ fontSize: 18, fontFamily: "monospace" }}
          onMount={handleEditorTheme}
        />
      )}
    </>
  );
};
