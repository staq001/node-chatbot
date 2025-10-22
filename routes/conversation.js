const { Router } = require("express");

const conversationController = require("../controllers/conversation.controller");

const convoRouter = Router();
const convoController = new conversationController();

convoRouter.get("/conversations", convoController.getAllConvos);

convoRouter.post("/conversation", convoController.createConversation);

convoRouter.post("/message/:conversation_id", convoController.createMessage);

convoRouter.get("/conversation/:conversation_id", convoController.getConversation);

convoRouter.get("/message/:message_id", convoController.getMessage);

convoRouter.patch("/updateMessage/:message_id", convoController.updateMessage);

convoRouter.patch("/updateTitle/:conversation_id", convoController.updateConversationTitle);

convoRouter.delete("/conversation/:conversation_id", convoController.deleteConversation)

module.exports = convoRouter;