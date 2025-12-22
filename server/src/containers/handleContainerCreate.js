import Docker from "dockerode";

const docker = new Docker();

export const listContainers = async () => {
  const containers = await docker.listContainers();
  console.log("Containers:", containers);
  // Print PORTS array From all containers
  containers.forEach((containerInfo) => {
    console.log(containerInfo.Ports);
  });
};

export const handleContainerCreate = async (projectId) => {
  console.log("Project id received for container create:", projectId);

  try {
    // 1️⃣ Remove existing container (if any)
    const existing = await docker.listContainers({ name: projectId });

    if (existing.length > 0) {
      const oldContainer = docker.getContainer(existing[0].Id);
      await oldContainer.remove({ force: true });
      console.log("Removed old container:", projectId);
    }

    // 2️⃣ Create container
    const container = await docker.createContainer({
      Image: "sandbox",
      name: projectId,

      Cmd: ["/bin/bash"],
      Tty: true,
      User: "sandbox",

      ExposedPorts: {
        "5173/tcp": {},
      },

      Env: ["HOST=0.0.0.0"],

      HostConfig: {
        Binds: [`${process.cwd()}/projects/${projectId}:/home/sandbox/app`],
        PortBindings: {
          "5173/tcp": [{ HostPort: "0" }], // random host port
        },
      },
    });

    await container.start();
    console.log("Container started:", container.id);

    return container;
  } catch (error) {
    console.error("Error creating container:", error);
    throw error;
  }
};

export async function getContainerPort(containerName, retries = 10) {
  for (let i = 0; i < retries; i++) {
    const containers = await docker.listContainers({ name: containerName });

    if (containers.length > 0) {
      const info = await docker.getContainer(containers[0].Id).inspect();

      const port = info?.NetworkSettings?.Ports?.["5173/tcp"]?.[0]?.HostPort;

      if (port) {
        console.log("✅ Found host port:", port);
        return port;
      }
    }

    // wait 500ms and retry
    await new Promise((res) => setTimeout(res, 500));
  }

  console.log("❌ Port not found for container:", containerName);
  return undefined;
}
