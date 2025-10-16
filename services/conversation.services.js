// const { ObjectId } = require("mongodb");

const Messages = require("../model/messages");
const Conversation = require("../model/conversation");

class ConversationService {

  async createConversation(title, next) {
    try {
      const conversation = await Conversation.create({
        title,
      });
      await conversation.save();
      return conversation;
    } catch (e) {
      throw new next(e);
    }
  }
  async createMessage(id, post, reply, next) {
    try {
      const message = await Messages.create({
        conversation_id: id,
        question: post,
        reply: reply
      })
      await message.save();
      return message
    } catch (e) {
      throw new next(e);
    }
  }

  async updateMessage(id, post, reply, next) {
    try {
      const updates = {};
      updates.$set = { question: post };
      updates.$set = { reply: reply };


      const _id = new ObjectId(String(id))
      const message = await Messages.findByIdAndUpdate(_id, updates, { new: true });
      if (!message) throw new Error("Message not found");

      return message;
    } catch (e) {
      throw new next(e);
    }
  }

  async deleteConversation(id, next) {
    try {
      const _id = ObjectId(String(id));
      const conversation = await Conversation.findByIdAndDelete({ _id });

      if (!conversation) throw new Error("Conversation does not exist.")
      return conversation.id;
    } catch (e) {
      throw new next(e);
    }
  }

  async deleteMessage(id, next) {
    try {
      const _id = ObjectId(String(id));

      const message = await Messages.deleteMany({
        conversation_id: id
      })
      if (!message) throw new Error("Message does not exist.")
      return message.deletedCount;
    } catch (e) {
      throw new next(e);
    }
  }
}



module.exports = ConversationService;