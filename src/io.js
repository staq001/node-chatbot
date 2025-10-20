const { Server } = require("socket.io");

const { generateResponse, generateTitle } = require("./gemini.js");
const ConversationService = require("../services/conversation.services.js")
const handleError = require("./error.js");
const convoService = new ConversationService();

function sock(listener) {
  const io = new Server(listener);


  io.on("connection", (socket) => {

    socket.on("chat message", async (text) => {
      const title = await generateTitle(text);

      const conversation = await convoService.createConversation(title);

      socket.emit("conversation", [conversation.id, text]);
    })


    socket.on("new conversation", async (reply) => {
      const [id, question] = reply;

      const response = await generateResponse(question);

      const message = await convoService.createMessage
        (id, question, response);

      socket.emit("bot reply", message.reply);
    })
  })

  return io;
}

module.exports = sock;