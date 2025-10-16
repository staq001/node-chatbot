const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    question: {
      type: String,
      trim: true,
    },
    reply: {
      type: String,
      trim: true,
    },
    conversation_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },

  }, {
  toJSON: { virtuals: true }, toObject: { virtuals: true },
})

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;