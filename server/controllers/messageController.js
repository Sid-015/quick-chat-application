const router = require("express").Router();
const authMiddleware = require("../../middleware/authMiddleware");
const Chat = require("../../models/chat");
const Message = require("../../models/message");

router.post("/new-message", authMiddleware, async (req, res) => {
  try {
    //Store the new message in the database
    const message = await new Message(req.body);
    const savedMessage = await message.save();

    //Update the last message field in the chat collection for the corresponding chat.

    const currChat = await Chat.findOneAndUpdate(
      { _id: req.body.chatId },
      { lastMessage: savedMessage._id, $inc: { unreadMessagesCount: 1 } },
    );

    res.status(201).send({
      message: "New message created successfully",
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating new message",
      error: error.message,
      success: false,
    });
  }
});

router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) => {
  {
    try {
      const allMessages = await Message.find({
        chatId: req.params.chatId,
      }).sort({ createdAt: 1 }); //The find() method is used to retrieve all message documents from the database that have a chatId equal to the chat ID provided in the request parameters (req.params.chatId). The resulting array of message documents is stored in the messages variable.
      //sort function is used to sort the messages in ascending order based on their createdAt timestamp. This ensures that the messages are returned in the order they were created, with the oldest message appearing first and the newest message appearing last.
      res.status(200).send({
        message: "All messages fetched successfully",
        success: true,
        data: allMessages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error fetching all messages",
        error: error.message,
        success: false,
      });
    }
  }
});

module.exports = router;
