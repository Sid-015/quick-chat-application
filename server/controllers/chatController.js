const authMiddleware = require("../../middleware/authMiddleware");
const Chat = require("../../models/chat");
const router = require("express").Router();
const Message = require("../../models/message");

//authMiddleware is checking for a token in the request headers and verifying it. If the token is valid, it allows the request to proceed to the route handler. If the token is invalid or missing, it sends an unauthorized response back to the client. This ensures that only authenticated users can access the routes that are protected by this middleware.
router.post("/create-new-chat", authMiddleware, async (req, res) => {
  try {
    const chat = await new Chat(req.body);
    const savedChat = await chat.save();

    await savedChat.populate("members");

    res.status(201).send({
      message: "New chat created successfully",
      success: true,
      data: savedChat,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error creating new chat",
      error: error.message,
      success: false,
    });
  }
});

router.get("/get-all-chats", authMiddleware, async (req, res) => {
  try {
    const allChats = await Chat.find({
      members: { $in: req.body.userId },
    })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 }); //The populate() method in Mongoose automatically replaces a referenced field (ObjectId) with the actual document from another collection.Will fetch the user document from user collection using the userID so in databse we will get the complete user object in members array rather than only userIds.

    return res.status(200).send({
      message: "All chats fetched successfully",
      success: true,
      data: allChats,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error fetching all chats",
      error: error.message,
      success: false,
    });
  }
});

router.post("/clear-unread-message", authMiddleware, async (req, res) => {
  try {
    const chatId = req.body.chatId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.send({
        message: "No chat found with the given Id.",
        success: false,
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { unreadMessagesCount: 0 },
      { new: true }, // if new is not set to true, it will return the original document without any updates. With new set to true it will return the required updated Chat.
    )
      .populate("members")
      .populate("lastMessage");

    await Message.updateMany(
      {
        chatId: chatId,
        read: false, //update the message with matching chatId and with read property set to false.
      },
      { read: true }, // set the read property ro true
    );

    res.send({
      message: "Unread message cleared successfully",
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
