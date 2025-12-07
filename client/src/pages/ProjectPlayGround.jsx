import { useParams } from "react-router-dom";
import { EditorComponet } from "../components/molecules/EditorComponet/EdditorComponet";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreesStructure } from "../components/organisms/TreeStructure/TreesStructure";
import { useTreeStructuerStore } from "../store/treeStructuerStore";
import { useEffect } from "react";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";

import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";

export const ProjectPlayGround = () => {
  const { projectId: projectIdfromUrl } = useParams();

  const { setProjectId, projectId } = useTreeStructuerStore();
  const { setEditorSocket, editorSocket } = useEditorSocketStore();
  const { setTerminalSocket } = useTerminalSocketStore();

  function fetchPort() {
    editorSocket.emit("getPort");
    console.log("fetching port");
  }

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (projectIdfromUrl) {
      setProjectId(projectIdfromUrl);
      const setEditorSocketconnection = io(`${backendUrl}/editor`, {
        query: {
          projectId: projectIdfromUrl,
        },

        transports: ["websocket"],
      });
      const ws = new WebSocket(
        `ws://localhost:4000/terminal?projectId=${projectIdfromUrl}`
      );
      setTerminalSocket(ws);
      setEditorSocket(setEditorSocketconnection);
    }
  }, [setProjectId, projectIdfromUrl, setEditorSocket, setTerminalSocket]);

  return (
    <>
      <div style={{ display: "flex" }}>
        {projectId && (
          <div
            style={{
              backgroundColor: "#333254",
              paddingRight: "10px",
              paddingTop: "0.3vh",
              minWidth: "200px",
              maxWidth: "20%",
              height: "99.7vh",
              overflow: "auto",
            }}
          >
            <TreesStructure />
          </div>
        )}
        <EditorComponet />
      </div>
      {/* <EditorButton isAcitve={true} />
      <EditorButton isAcitve={false} /> */}
      <div>
        <button
          onClick={fetchPort}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
          }}
        >
          Get Port
        </button>
      </div>
      <BrowserTerminal />
    </>
  );
};
