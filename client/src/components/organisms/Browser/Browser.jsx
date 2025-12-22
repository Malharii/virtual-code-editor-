import { Input, Row } from "antd";
import { useEffect } from "react";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { usePortStore } from "../../../store/portStore";
import { ReloadOutlined } from "@ant-design/icons";

export const Browser = ({ projectId }) => {
  const { port, reloadKey, triggerReload } = usePortStore();
  const { editorSocket } = useEditorSocketStore();

  // 🔹 Ask backend for port
  useEffect(() => {
    if (editorSocket && projectId) {
      editorSocket.emit("getPort", { containerName: projectId });
    }
  }, [editorSocket, projectId]);

  // 🔹 Listen for preview reload
  useEffect(() => {
    if (!editorSocket) return;

    const onReload = () => {
      console.log("🔄 Preview reload received");
      triggerReload();
    };

    editorSocket.on("preview-reload", onReload);
    return () => editorSocket.off("preview-reload", onReload);
  }, [editorSocket, triggerReload]);

  if (!port) return <div>Loading preview…</div>;

  return (
    <Row style={{ backgroundColor: "#22212b" }}>
      <Input
        value={`http://localhost:${port}`}
        readOnly
        prefix={<ReloadOutlined onClick={triggerReload} />}
      />

      <iframe
        key={reloadKey} // 🔥 THIS forces full reload
        src={`http://localhost:${port}?v=${reloadKey}`} // 🔥 cache-buster
        style={{
          width: "100%",
          height: "95vh",
          border: "none",
        }}
      />
    </Row>
  );
};
