const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        }, // Reference to the users collection. This indicates that each member in the chat is a user from the users collection.
      ], // Using an array of ObjectIds allows for multiple members to be part of the same chat, enabling group chats as well as one-on-one conversations.
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    }, // Reference to the messages collection. This indicates that the last message in the chat is a message from the messages collection between two users.
    unreadMessagesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("chats", chatSchema); //chats is the name of the collection in the database
