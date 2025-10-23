const { Server } = require("socket.io");

const { generateResponse, generateTitle } = require("./gemini.js");
const ConversationService = require("../services/conversation.services.js")
const handleError = require("./error.js");
const convoService = new ConversationService();

function sock(listener) {
  const io = new Server(listener);


  io.on("connection", (socket) => {

    socket.on("chat message", async (reply) => {
      const [text, id] = reply;
      const title = await generateTitle(text);
      const response = await generateResponse(text);

      const isValidConversation = await convoService.isValidConversation(id);

      const convo_id = isValidConversation ? id : (await convoService.createConversation(title)).id;
      console.log(convo_id);


      const message = await convoService.createMessage(convo_id, text, response);

      socket.emit("bot reply", [response, convo_id]);
    })
  })

  return io;
}

module.exports = sock;