import { useParams } from "react-router-dom";
import { EditorComponet } from "../components/molecules/EditorComponet/EdditorComponet";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreesStructure } from "../components/organisms/TreeStructure/TreesStructure";
import { useTreeStructuerStore } from "../store/treeStructuerStore";
import { useEffect } from "react";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";

import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";

export const ProjectPlayGround = () => {
  const { projectId: projectIdfromUrl } = useParams();

  const { setProjectId, projectId } = useTreeStructuerStore();
  const { setEditorSocket } = useEditorSocketStore();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    if (projectIdfromUrl) {
      setProjectId(projectIdfromUrl);
      const setEditorSocketconnection = io(`${backendUrl}/editor`, {
        query: {
          projectId: projectIdfromUrl,
        },

        transports: ["websocket"],
      });
      setEditorSocket(setEditorSocketconnection);
    }
  }, [setProjectId, projectIdfromUrl, setEditorSocket]);

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
      <EditorButton isAcitve={true} />
      <EditorButton isAcitve={false} />

      <div>
        <BrowserTerminal />
      </div>
    </>
  );
};
