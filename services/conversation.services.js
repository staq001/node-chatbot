const { ObjectId } = require("mongodb");

const Messages = require("../model/messages");
const Conversation = require("../model/conversation");

class ConversationService {
  async createMessage(title, post, reply, next) {
    try {
      const conversation = await Conversation.create({
        title
      });
      await conversation.save();
      const message = await Messages.create({
        "message.conversation": conversation.id,
        "message.questions": post,
        "messages.replies": reply
      })
      await message.save();
      return [message, conversation];
    } catch (e) {
      next(e);
    }
  }

  async updateMessage(id, post, reply, next) {
    try {
      const updates = {};
      updates.$set = { "message.conversation": post };
      updates.$set = { "message.conversation": reply };


      const _id = new ObjectId(String(id))
      const message = await Messages.findByIdAndUpdate(_id, updates, { new: true });
      if (!message) throw new Error("Message not found");

      return message;
    } catch (e) {
      next(e);
    }
  }

  async deleteConversation(id, next) {
    try {
      const _id = ObjectId(String(id));
      const conversation = await Conversation.findByIdAndDelete({ _id });
      const message = await Messages.deleteMany({
        "messages.conversations": conversation.id
      })
      return message.deletedCount;
    } catch (e) {
      next(e);
    }
  }
}



module.exports = { ConversationService };