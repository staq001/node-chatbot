const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
  },
  questions: {
    type: String,
    trim: true,
  },
  replies: {
    type: String,
    trim: true,
  }
},
  {
    _id: false
  }
);

const messageSchema = new Schema({
  messages: questionSchema,
}, {
  toJSON: { virtuals: true }, toObject: { virtuals: true },
})

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;