import Docker from "dockerode";
import path from "path";

const docker = new Docker();

export const handleContainerCreate = async (
  projectId,
  socket,
  req,
  tcpSocket,
  head,
  res
) => {
  console.log("Project id recevied for container create ", projectId);
  try {
    const container = await docker.createContainer({
      Image: "sandbox", // # name given by us for the written dockerfile
      AttachStdin: true,
      AttachStdout: true,
      Cmd: ["/bin/bash"],
      Tty: true,
      User: "sandbox",
      ExposedPorts: {
        "5173/tcp": {},
      },
      Env: ["HOST:0.0.0.0"],
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

    socket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
      establishedWSConn.emit("container", establishedWSConn, req, container);
    });
  } catch (error) {
    console.error("Error creating container:", error);
    return res.status(500).json({ message: "Failed to create container" });
  }
};
