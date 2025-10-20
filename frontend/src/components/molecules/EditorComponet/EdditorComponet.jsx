import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useActiveFileTabStore } from "../../../store/acitveFileTabStore";
export const EditorComponet = () => {
  const [editorStore, setEditorStore] = useState({
    theme: null,
  });

  const { editorSocket } = useEditorSocketStore();
  const { activeFileTab, setActiveFileTab } = useActiveFileTabStore();
  const languageMap = {
    js: "javascript",
    ts: "typescript",
    tsx: "typescript",
    jsx: "javascript",
    html: "html",
    css: "css",
    json: "json",
    txt: "plaintext",
    md: "markdown",
    gitignore: "gitignore",
  };

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

  editorSocket?.on("readFileSuccess", (data) => {
    console.log("readFileSuccess", data);
    setActiveFileTab(data.path, data.value);
  });
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
          value={activeFileTab?.value || ""}
          defaultValue="//Welcome to PlayGround"
          options={{ fontSize: 18, fontFamily: "monospace" }}
          onMount={handleEditorTheme}
        />
      )}
    </>
  );
};
