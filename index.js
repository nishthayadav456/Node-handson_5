const express = require("express");
const path = require("path");
const { socket } = require("socket.io");
const app = express();
const server = app.listen(4005, () =>
  console.log(`server is live at 4005`)
);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsConected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketsConected.add(socket.id);
  socket.emit("popup", "Welcome chat Application");

  io.emit("client-total", socketsConected.size);

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    socketsConected.delete(socket.id);
    io.emit("client-total", socketsConected.size);
  });
  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feeback", data);
  });
}