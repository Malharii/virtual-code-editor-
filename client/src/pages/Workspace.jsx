import { ProjectPlayGround } from "./ProjectPlayGround";
import { TerminalPage } from "./TerminalPage";

export const Workspace = () => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", paddingTop: "10px" }}>
        <ProjectPlayGround /> {/* editor + Socket.IO */}
        {/* <TerminalPage /> terminal + raw WS */}
      </div>
    </>
  );
};
