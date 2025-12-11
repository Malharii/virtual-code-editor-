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

export const handleContainerCreate = async (
  projectId,
  socket,
  req,
  tcpSocket,
  head,
  res,
  terminalSocket
) => {
  console.log("Project id recevied for container create ", projectId);
  try {
    // Delete existing container with the same name if exists
    const existingContainers = await docker.listContainers({ name: projectId });
    console.log("Existing containers with the same name: ", existingContainers);

    if (existingContainers.length > 0) {
      const container = docker.getContainer(existingContainers[0].Id);

      await container.remove({ force: true });
      console.log(`Removed existing container with name ${projectId}`);
    }

    const container = await docker.createContainer({
      Image: "sandbox", // # name given by us for the written dockerfile
      AttachStdin: true,
      AttachStdout: true,
      Cmd: ["/bin/bash"],
      name: projectId,
      Tty: true,
      User: "sandbox",
      ExposedPorts: {
        "5173/tcp": {},
      },

      Env: ["HOST=0.0.0.0"],
      HostConfig: {
        // mounting the project directory to the container

        Binds: [`${process.cwd()}/projects/${projectId}:/home/sandbox/app`],
        PortBindings: {
          "5173/tcp": [{ HostPort: "0" }], // random port can assigned by docker
        },
      },
    });
    console.log("container Created ", container.id);

    await container.start();

    console.log("container started");

    // below  is the place where we upgrade the connection to websocket

    // socket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
    //   socket.emit("connection", establishedWSConn, req, container);
    // });
    return container;
  } catch (error) {
    console.error("Error creating container:", error);
    return res.status(500).json({ message: "Failed to create container" });
  }
};

export async function getContainerPort({ containerName }) {
  const containers = await docker.listContainers({
    name: containerName,
  });

  if (containers.length > 0) {
    const containerInfo = await docker.getContainer(containers[0].Id).inspect();
    console.log("Container Info:", containerInfo);
    return containerInfo.NetworkSettings.Ports["5173/tcp"][0].HostPort;
  }
}
