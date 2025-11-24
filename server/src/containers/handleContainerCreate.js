import Docker from "dockerode";

const docker = new Docker();

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
    container.exec(
      {
        Cmd: ["/bin/bash"],
        User: "sandbox",
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      },
      (err, exec) => {
        if (err) {
          console.error("Error creating exec instance:", err);
          return;
        }
        exec.start({ hijack: true, stdin: true }, (err, stream) => {
          if (err) {
            console.error("Error starting exec instance:", err);
            return;
          }
          processStream(stream, socket);
          socket.on("shell-input", (data) => {
            console.log("Received shell input:", data);
            stream.write("pwd\n", (err) => {
              if (err) {
                console.error("Error while  writing to stream:", err);
              } else {
                console.log("Successfully wrote to stream");
              }
            });
          });
        });
      }
    );
    // below the place where we upgrade the connection to websocket

    // terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
    //   terminalSocket.emit("container", establishedWSConn, req, container);
    // });
  } catch (error) {
    console.error("Error creating container:", error);
    return res.status(500).json({ message: "Failed to create container" });
  }
};

function processStream(stream, socket) {
  let buffer = Buffer.from("");
  stream.on("data", (data) => {
    buffer = Buffer.concat([buffer, data]);
    console.log("Received data:", data.toString());
    socket.emit("shell-output", buffer.toString());
    buffer = Buffer.from("");
  });
  stream.on("end", () => {
    console.log("Stream ended");
    socket.emit("shell-output", buffer.toString());
  });
  stream.on("error", (error) => {
    console.error("Stream error:", error);
    socket.emit("shell-output", error.message);
  });
}
