import Docker from "dockerode";
import path from "path";

const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
  console.log("Project id recevied for container create ", projectId);
  try {
    const container = await docker.createContainer({
      Image: "sandbox", // # name given by us for the written dockerfile
      AttachStdin: true,
      AttachStdout: true,
      CMD: ["/bin/bash"],
      Tty: true,
      User: "sandbox",
      HostConfig: {
        // mounting the project directory to the container

        Binds: [`${process.cwd()}/projects/${projectId}:/home/sandbox/app`],
        PortBindings: {
          "5173/tcp": [{ HostPort: "0" }], // random port can assigned by docker
        },
        ExposedPorts: {
          "5173/tcp": {},
        },
        Env: ["HOST:0.0.0.0"],
      },
    });
    console.log("container Created ", container.id);

    await container.start();

    console.log("container started");

    container.exec(
      {
        Cmd: ["/bin/bash"],
        User: "sandbox",
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
      },
      (err, exec) => {
        if (err) {
          console.error("Error executing command:", err);
          return;
        }

        exec.start({ hijack: true }, (err, stream) => {
          if (err) {
            console.error("Error starting stream:", err);
            return;
          }

          processStream(stream, socket);
          socket.on("shell-input", (data) => {
            stream.write(data);
          });
        });
        // console.log("Container started successfully");
        // socket.emit("container-started", { containerId: container.id });
      }
    );
  } catch (error) {
    console.error("Error creating container:", error);
    return res.status(500).json({ message: "Failed to create container" });
  }
};

function processStream(stream, socket) {
  let buffer = Buffer.from("");
  stream.on("data", (data) => {
    buffer = Buffer.concat([buffer, data]);
    console.log("Stream data:", buffer.toString());
    socket.emit("shell-output", buffer.toString());
    buffer = Buffer.from("");
  });

  stream.on("end", () => {
    console.log("Stream ended");
    socket.emit("shell-output", "Stream ended");
  });

  stream.on("error", (error) => {
    console.error("Stream error:", error);
    socket.emit("shell-output", `Stream error: ${error.message}`);
  });
}
