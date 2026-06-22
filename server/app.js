const express = require("express");
const app = express();
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");

app.use(express.json()); // Middleware to parse JSON bodies. Converts incoming JSON request bodies into JavaScript objects and makes them available under req.body.
const server = require("http").createServer(app); // http is built in package in node.js. Creating a server using the app object.

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", //whitelists any request coming from client on port 3000.
    methods: ["GET", "POST"], //whitelisted methods
  },
}); //
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    socket.join(userId); // Join a room with the user's ID to receive messages intended for that user.
  });

  socket.on("send-message", (message) => {
    console.log(message);
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message); // Send the message to all members of the chat, so that they can update their UI in real-time. The socket.to() method is used to send a message to specific rooms (in this case, the rooms corresponding to the user IDs of the chat members). The emit() method is used to send the 'receive-message' event along with the message data to those rooms.
  });
}); //

module.exports = server; //instead of listening to requests on app, we'd be listening to requests on the server hence exporting server object instead of app object.
