const mongoose = require("mongoose");

const { Schema } = mongoose;

const conversationSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  toJSON: { virtuals: true }, toObject: { virtuals: true }
})

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation; 