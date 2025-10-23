const { ObjectId } = require("mongodb");
const handleError = require("../src/error.js");

const Messages = require("../model/messages");
const Conversation = require("../model/conversation");

class ConversationService {
  async createConversation(title) {
    try {
      const conversation = await Conversation.create({
        title,
      });
      await conversation.save();
      return conversation;
    } catch (e) {
      throw new handleError(e, 505);
    }
  }

  async createMessage(id, post, reply) {
    try {
      const message = await Messages.create({
        conversation_id: id,
        question: post,
        reply
      })
      await message.save();
      return message
    } catch (e) {
      throw new handleError(e, 505)
    }
  }


  async getConversation(id) {
    try {
      const _id = new ObjectId(String(id));

      const conversation = await Conversation.findById({ _id });
      if (!conversation) throw new handleError("Conversation not found", 404);

      const messages = await Messages.find({ conversation_id: conversation.id });
      if (!messages) throw new handleError("Messages not found", 404);

      return [conversation, messages]
    } catch (e) {
      throw new handleError(e, 505);
    }
  }
  async getAllConversations() {
    try {

      const conversations = await Conversation.find({});
      if (conversations.length === 0) throw new handleError("Conversations not found", 404);

      return conversations
    } catch (e) {
      throw new handleError(e, 505);
    }
  }

  async getMessage(id) {
    try {
      const _id = new ObjectId(String(id));

      const message = await Messages.findById({ _id });
      if (!message) throw new handleError("Message not found", 404);

      return message;
    } catch (e) {
      throw new handleError(`Error fetching message: ${e}`, 404);
    }
  }

  async updateConversation(id, title) {
    try {
      let updates = {};
      updates.$set = { title };

      const _id = new ObjectId(String(id))
      const conversation = await Conversation.findByIdAndUpdate(_id, updates, { new: true });

      if (!conversation) throw new handleError("Conversation not found", 404);
      return conversation
    } catch (e) {

      throw new handleError(e, 505);
    }
  }

  async updateMessage(id, post, reply) {
    try {
      const updates = {};
      updates.$set = {
        question: post,
        reply
      }

      const _id = new ObjectId(String(id))
      const message = await Messages.findByIdAndUpdate(_id, updates, { new: true });
      if (!message) throw new handleError("Message not found", 404);

      return message;
    } catch (e) {
      throw new handleError(e, 505);
    }
  }

  async deleteConversation(id) {
    try {
      const _id = new ObjectId(String(id));
      const conversation = await Conversation.findByIdAndDelete({ _id });

      if (!conversation) throw new handleError("Conversation does not exist.", 404);
      return conversation.id;
    } catch (e) {
      throw new handleError(e, 505);
    }
  }

  async deleteMessage(id) {
    try {
      const _id = new ObjectId(String(id));

      const message = await Messages.deleteMany({
        conversation_id: _id
      })
      if (!message) throw new handleError("Message does not exist.", 404)
      return message.deletedCount;
    } catch (e) {
      throw new handleError(e, 505);
    }
  }

  async isValidConversation(id) {
    try {
      const _id = new ObjectId(String(id));
      const conversation = await Conversation.findById({ _id });

      if (!conversation) return false;
      return true;
    } catch (e) {
      throw new handleError(e, 505)
    }
  }
}



module.exports = ConversationService;