import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/index.js";
import { Server } from "socket.io";
import chokidar from "chokidar";

import { handleEditorSocketEvents } from "./socketHandlers/editorHandler.js";
import { handleContainerCreate } from "./containers/handleContainerCreate.js";
import { WebSocketServer } from "ws";
import { handleTerminalCreation } from "./containers/handleTerminalCreation.js";
import { error } from "node:console";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // 👈 your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", apiRouter);

const editorNameSpace = io.of("/editor");

editorNameSpace.on("connection", (socket) => {
  console.log("a edditor connected");

  let projectId = socket.handshake.query.projectId;

  console.log("projectId", projectId);
  if (projectId) {
    var watcher = chokidar.watch(`./projects/${projectId}`, {
      ignored: (path) => path.includes("node_modules"),

      persistent: true, // keps the watcher in running state fill the time app is running

      awiteWriteFinish: {
        stabilityThreshold: 2000, // ensures stabletty of files before triggering event
      },

      ignoreInitial: true, // ignores the initial fiels in the directory
    });

    watcher.on("all", (event, path) => {
      console.log(event, path);
    });
  }

  handleEditorSocketEvents(socket, editorNameSpace);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const webSocketForTerminal = new WebSocketServer({
  noServer: true, // we will handle the upgrade event manually
});

server.on("upgrade", (req, tcp, head) => {
  /*
  request: The incoming HTTP request object.
  socket: The network socket between the server and the client. or tcp socket
  head: buffer containing The first packet of the upgraded stream.
  */
  //this callback will call  when client tries to connect to the server through websocket

  const isTerminal = req.url.includes("/terminal");
  if (isTerminal) {
    console.log("req url recived", req.url);
    const projectId = req.url.split("=")[1];
    console.log("projectId for terminal after split ", projectId);
    handleContainerCreate(projectId, webSocketForTerminal, req, tcp, head);
  }
});

webSocketForTerminal.on("connection", (ws, req, container) => {
  console.log("New terminal connected", ws, req, container);
  handleTerminalCreation(container, ws);

  // Handle terminal disconnection and container cleanup

  ws.on("close", () => {
    console.log("Terminal disconnected");
    container.remove(
      {
        force: true,
      },
      (err, data) => {
        if (err) {
          console.log("Error removing container", err);
        }
        console.log("Container removed successfully", data);
      }
    );
  });
});
