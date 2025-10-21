import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/index.js";
import { Server } from "socket.io";
import chokidar from "chokidar";

import { handleEditorSocketEvents } from "./socketHandlers/editorHandler.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
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

  socket.on("disconnect", async () => {
    await console.log("a user disconnected");
  });
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
