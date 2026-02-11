const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const { generateResponse, generateTitle } = require("./gemini.js");
const ConversationService = require("../services/conversation.services.js")
const handleError = require("./error.js");
const convoService = new ConversationService();

function sock(listener) {
  const io = new Server(listener, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded.id });

      if (!user) {
        return next(new Error("Unauthorized"));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.userId} connected`);

    socket.on("chat message", async (reply) => {
      try {
        const [text, id] = reply;
        const title = await generateTitle(text);
        const response = await generateResponse(text);

        const isValidConversation = await convoService.isValidConversation(id);

        const convo_id = isValidConversation ? id : (await convoService.createConversation(title, socket.userId)).id;

        const message = await convoService.createMessage(convo_id, text, response);

        socket.emit("bot reply", [response, convo_id]);
      } catch (error) {
        console.error("Chat message error:", error);
        socket.emit("error", "Failed to process message");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  return io;
}

module.exports = sock;