import { Routes, Route } from "react-router-dom";
import { CreateProject } from "./pages/CreateProject";
import { ProjectPlayGround } from "./pages/ProjectPlayGround";
import { TerminalPage } from "./pages/TerminalPage";
import { Workspace } from "./pages/Workspace";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateProject />} />
      <Route path="/project/:projectId" element={<Workspace />} />
    </Routes>
  );
};
