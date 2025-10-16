const express = require("express");
const http = require("http")
// const { Server } = require('socket.io');
const sock = require("./src/io");

const app = express();
const server = http.createServer(app);
const io = sock(server);

require("./db/mongoose");
const { generateResponse, generateTitle } = require("./src/gemini")
const ConversationService = require("./services/conversation.services");

const convoService = new ConversationService();

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));



// io.on("connection", (socket) => {

//   socket.on("chat message", async (text) => {

//     const title = await generateTitle(text);
//     const response = await generateResponse(text);

//     console.log(title);
//     console.log(response);

//     const [message, conversation] = await convoService.createMessage(title, text, response)
//     console.log(message, conversation);
//     socket.emit("bot reply", response);
//   })
// })

app.get("/", (req, res) => {
  res.sendFile("index.html");
})

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

