import util from "util";
import child_process from "child_process";
import fs from "fs/promises";
import uuid4 from "uuid4";
import path from "path";
import { fileURLToPath } from "url";

const execPromisified = util.promisify(child_process.exec);

// Helper function to find npm path
async function findNpmPath() {
  const possiblePaths = [
    "C:\\Program Files\\nodejs\\npm.cmd",
    "C:\\Program Files (x86)\\nodejs\\npm.cmd",
    path.join(process.env.APPDATA, "npm", "npm.cmd"),
    path.join(process.env.ProgramFiles, "nodejs", "npm.cmd"),
  ];

  for (const npmPath of possiblePaths) {
    try {
      await fs.access(npmPath);
      return npmPath;
    } catch {
      continue;
    }
  }

  // Fallback: try to use 'where' command to find npm
  try {
    const { stdout } = await execPromisified("where npm", { shell: true });
    return stdout.trim().split("\n")[0];
  } catch {
    throw new Error("npm not found. Please ensure Node.js is installed.");
  }
}

export const createProjectController = async (req, res) => {
  try {
    const projectId = uuid4();
    console.log("new project id", projectId);
    await fs.mkdir(`./projects/${projectId}`);

    // Find npm path
    const npmPath = await findNpmPath();
    console.log("Using npm at:", npmPath);

    // Use the full path to npm
    const response = await execPromisified(
      `"${npmPath}" create vite@latest . -- --template react`,
      {
        cwd: `./projects/${projectId}`,
        shell: true,
        env: process.env,
      }
    );

    console.log("Vite project created:", response.stdout);

    return res.status(200).json({
      message: "Project created",
      data: projectId,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};
