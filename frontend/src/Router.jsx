import { Route, Routes } from "react-router-dom";
import { CreateProject } from "./pages/CreateProject";
import { ProjectPlayGround } from "./pages/ProjectPlayGround";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateProject />} />
      <Route path="/project/:id" element={<ProjectPlayGround />} />
    </Routes>
  );
};
