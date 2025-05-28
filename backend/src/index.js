import express, { urlencoded } from "express";
import cors from "cors";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/index.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import chokidar from "chokidar";
import { handleEditorSocketEvent } from "./socketHandler/editorHandler.js";

import { handleContainerCreate } from "./containers/handleContainerCreate.js";
import { WebSocketServer } from "ws";
import { handleTerminalCreation } from "./containers/handleTerminalCreation.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
// use
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);
// route
app.get("/ping", (req, res) => {
  res.json({ message: "pong!" });
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

const editorNameSpace = io.of("/editor");
editorNameSpace.on("connection", (socket) => {
  console.log("Editor Connected!");
  //  const queryParams = queryString.parse(socket.handshake.query);
  const projectId = socket.handshake.query.projectId;

  console.log("project id received after connection ", projectId);
  let watcher;
  if (projectId) {
    watcher = chokidar.watch(`./projects/${projectId}`, {
      ignored: (path) => path.includes("node_modules"),
      persistent: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000 /**Ensuring stability of files before triggering event */,
      },
      ignoreInitial: true,
    });
    watcher.on("all", (event, path) => {
      console.log(event, path);
    });
  }
  handleEditorSocketEvent(socket, editorNameSpace);
  socket.on("disconnect", async () => {
    if (watcher) {
      await watcher.close();
      console.log("Watcher closed for project:", projectId);
    }
    console.log("Editor Disconnected!");
  });
});

// server listen
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const webSocketForTerminal = new WebSocketServer({
  noServer: true,
});
server.on("upgrade", (req, tcp, head) => {
  /**
   req parameter: It holds incoming http request
   socket parameter: TCP socket
   head : This is a buffer containing the first packet of the upgrading stream
   */
  //this callback will be called when a client tried to connect the server through websocket
  const isTerminal = req.url.includes("/terminal");
  if (isTerminal) {
    console.log("req url ", req.url);
    const projectId = req.url.split("=")[1];
    console.log("the project id received after connection ", projectId);
    handleContainerCreate(projectId, webSocketForTerminal, req, tcp, head);
  }
});

webSocketForTerminal.on("connection", (ws, req, container) => {
  console.log("Terminal connected!!");
  handleTerminalCreation(container, ws);

  ws.on("close", () => {
    container.remove({ force: true }, (err, data) => {
      if (err) {
        console.log("Error while removing container", err);
      }
      console.log("Old container removed", data);
    });
  });
});
