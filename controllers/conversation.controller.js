const Conversation = require("../model/conversation");
const Messages = require("../model/messages");
const { ObjectId } = require("mongodb");
const { generateReponse, generateTitle } = require("../src/gemini");
const ConversationService = require("../services/conversation.services");

const convoService = new ConversationService();

class conversationController {
  async createConversation(req, res, next) {
    try {
      const { firstMessage } = req.body;
      if (!firstMessage) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. Fields (firstMessage) cannot be empty",
        });
        return;
      }
      const title = await generateTitle(firstMessage);

      const conversation = await convoService.createConversation(title, next);

      res.status(201).json({
        status: 201,
        message: "Conversation created successfully",
        data: {
          conversation
        }
      })
    } catch (e) {
      next(e);
    }
  }
  async createMessage(req, res, next) {
    try {
      const { message } = req.body;
      const { conversation_id } = req.params;

      if (!message) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. Fields (message) cannot be empty",
        });
        return;
      }
      const response = await generateReponse(message);

      const messages = await convoService.createMessage(conversation_id, message, response, next);

      res.status(201).json({
        status: 201,
        message: "Message created successfully",
        data: {
          messages
        }
      })
    } catch (e) {
      next(e);
    }
  }

  async getConversation(req, res, next) {
    try {
      const { conversation_id } = req.params;


      const [conversation, messages] = await convoService.getConversation(conversation_id, next);
      if (!conversation && !messages) {
        res.status(404).json({
          status: 404,
          message: "Conversation does not exist"
        })
        return;
      }
      res.status(200).json({
        status: 200,
        data: {
          conversation,
          messages
        }
      })

    } catch (e) {
      next(e)
    }
  }

  async getMessage(req, res, next) {
    try {
      const { message_id } = req.params;


      const message = await convoService.getMessage(conversation_id, next);
      if (!message) {
        res.status(404).json({
          status: 404,
          message: "Message does not exist"
        })
        return;
      }
      res.status(200).json({
        status: 200,
        data: {
          conversation,
          message
        }
      })

    } catch (e) {
      next(e)
    }
  }


  async updateConversationTitle(req, res, next) {
    try {
      const { conversation_id } = req.params;
      const { newTitle } = req.body;

      if (!conversation_id) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. Fields (conversation_id) cannot be empty",
        });
        return;
      }
      const conversation = await convoService.updateConversation(conversation_id, newTitle, next);

      if (!conversation) {
        res.status(404).json({
          status: 404,
          message: "Conversation not found",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: "Conversation title updated successfully",
        data: {
          updatedTitle: conversation.title
        }
      })
    } catch (e) {
      next(e);
    }
  }

  async updateMessage(req, res, next) {
    try {
      const { conversation_id } = req.params;
      const { message } = req.body;

      if (!message) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. Fields (message) cannot be empty",
        });
        return;
      }

      const response = await generateReponse(message)
      const messages = await convoService.updateMessage(conversation_id, message, response, next);

      if (!messages) {
        res.status(404).json({
          status: 404,
          message: "Message not found",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: "Conversation title updated successfully",
        data: {
          messages
        }
      })
    } catch (e) {
      next(e);
    }
  }

  async deleteConversation(req, res, next) {
    try {
      const { conversation_id } = req.params;

      const conversation = await convoService.deleteConversation(conversation_id, next)

      if (!conversation) {
        res.status(404).json({
          status: 404,
          message: "Conversation not found"
        })
      }

      const messages = await convoService.deleteMessage(conversation_id, next)

      if (!messages) {
        res.status(404).json({
          status: 404,
          message: "Messages not found",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: "Conversation deleted successfully",
        data: {
          messagesDeleted: messages.deletedCount,
        }
      })
    } catch (e) {
      next(e)
    }
  }
}