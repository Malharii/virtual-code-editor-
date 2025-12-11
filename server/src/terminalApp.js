import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";

import { handleContainerCreate } from "./containers/handleContainerCreate.js";
import { handleTerminalCreation } from "./containers/handleTerminalCreation.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

server.listen(4000, () => {
  console.log(" Terminal WS Server running on port 4000");
});

const terminalWSS = new WebSocketServer({ noServer: true });

terminalWSS.on("connection", async (ws, request) => {
  console.log("🔌 Terminal WebSocket connected");

  const projectId = new URL(request.url, "http://localhost").searchParams.get(
    "projectId"
  );

  console.log("Terminal for Project:", projectId);

  const container = await handleContainerCreate(projectId);

  handleTerminalCreation(container, ws);

  ws.on("close", () => {
    console.log("Terminal closed. Removing container…");

    container.remove({ force: true }, (err) => {
      if (err) console.error("Failed to remove container:", err);
      else console.log("Container removed");
    });
  });
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/terminal")) {
    terminalWSS.handleUpgrade(req, socket, head, (ws) => {
      terminalWSS.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});
