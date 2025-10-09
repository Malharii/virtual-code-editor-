import util from "util";
import child_process from "child_process";
import fs from "fs/promises";
import uuid4 from "uuid4";
import { REACT_PROJECT_COMMAND } from "../config/serverConfig";

const execPromisified = util.promisify(child_process.exec);

export const createProjectController = async (req, res) => {
  //Create a unique id and then inside the projects folder create a new  folder with that id
  const projectId = uuid4();
  console.log("new project id ", projectId);
  await fs.mkdir(`./projects/${projectId}`);

  // afeter this call the npm create vite command in the newly created project folder

  const response = await execPromisified(REACT_PROJECT_COMMAND, {
    cwd: `./projects/${projectId}`,
  });

  return res.status(200).json({ message: "Project created", data: projectId });
};
