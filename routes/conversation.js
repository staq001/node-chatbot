const { Router } = require("express");

const conversationController = require("../controllers/conversation.controller");

const convoRouter = Router();
const convoController = new conversationController();
const auth = require("../middleware/auth")

convoRouter.get("/conversations", auth, convoController.getAllConvos);

convoRouter.post("/conversation", auth, convoController.createConversation);

convoRouter.post("/message/:conversation_id", auth, convoController.createMessage);

convoRouter.get("/conversation/:conversation_id", auth, convoController.getConversation);

convoRouter.get("/message/:message_id", auth, convoController.getMessage);

convoRouter.patch("/updateMessage/:message_id", auth, convoController.updateMessage);

convoRouter.patch("/updateTitle/:conversation_id", auth, convoController.updateConversationTitle);

convoRouter.delete("/conversation/:conversation_id", auth, convoController.deleteConversation)

module.exports = convoRouter;