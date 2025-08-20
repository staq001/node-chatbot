const express = require("express");
const http = require("http")
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const generateResponse = require("./src/gemini")

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));



io.on("connection", (socket) => {

  socket.on("chat message", async (text) => {

    const response = await generateResponse(text);
    socket.emit("bot reply", response);
  })
})

app.get("/", (req, res) => {
  res.sendFile("index.html");
})

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

