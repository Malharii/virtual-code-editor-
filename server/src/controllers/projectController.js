// Helper function to find npm path

import {
  createProjectService,
  getProjectTreeService,
} from "../service/projectService.js";

export const createProjectController = async (req, res) => {
  const projectId = await createProjectService();

  return res
    .status(201)
    .json({ message: "Project created successfully", data: projectId });
};

export const getProjectTreeController = async (req, res) => {
  const projectId = req.params.projectId;
  const tree = await getProjectTreeService(projectId);
  return res
    .status(200)
    .json({ data: tree, sucess: true, message: "Project tree fetched successfully" });
};
