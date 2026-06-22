import { useSelector, useDispatch } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import moment from "moment";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import { setAllChats } from "../../../redux/userSlice";
import store from "../../../redux/store";

function ChatArea({ socket }) {
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer,
  );
  let selectedUser = null;
  if (selectedChat) {
    selectedUser = selectedChat.members.find((u) => u._id !== user._id); // Find the user whose id doesnt match the currently logged in user.
  }

  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const sendMessage = async () => {
    try {
      const NewMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
      };

      socket.emit("send-message", {
        ...NewMessage,
        members: selectedChat.members.map((member) => member._id), // Send the message to all members of the chat, so that they can update their UI in real-time.
        read: false, // Set read to false when sending a new message, so that the recipients can see that there is an unread message and update their UI accordingly.
        createdAt: moment().format("DD-MM-YYYY hh:mm:ss"), // Send the createdAt timestamp when sending a new message, so that the recipients can display the correct timestamp in their UI.
      });

      const response = await createNewMessage(NewMessage);

      if (response.success) {
        // append the newly created message to the list so UI updates immediately
        setAllMessages((prev) => [...prev, response.data]);
        setMessage("");
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message || "Failed to send message");
      return error;
    }
  };

  const getMessages = async () => {
    try {
      let response = null;
      dispatch(showLoader());
      if (selectedChat !== null) {
        response = await getAllMessages(selectedChat._id);
      }
      dispatch(hideLoader());

      if (response && response.success) {
        setAllMessages(response.data);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
      return error;
    }
  };

  const formatTime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    } else if (diff == 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    } else {
      return `${moment(timestamp).format("MMMM D, hh:mm A")}`;
    }
  };

  function formatName(user) {
    let fname =
      user.firstName.at(0).toUpperCase() +
      user.firstName.slice(1).toLowerCase();
    let lname =
      user.lastName.at(0).toUpperCase() + user.lastName.slice(1).toLowerCase();

    return fname + " " + lname;
  }

  const clearUnreadMessages = async () => {
    try {
      let response = null;
      dispatch(showLoader());
      if (selectedChat !== null) {
        response = await clearUnreadMessageCount(selectedChat._id);
      }

      if (response.success) {
        allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          } // return chat which we have updated in the MongoDb databse.
          return chat;
        });
      }
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
      return error;
    }
  };

  // We only want to fetch messages when selectedChat changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user?._id) {
      clearUnreadMessages();
    }

    const handleReceive = (message) => {
      console.log("socket receive-message in ChatArea:", message);
      const selectedChat = store.getState().userReducer.selectedChat; // cannot use states inside these socket functions, because these functions are not re-rendered when the states change, so they will always have access to the initial values of the states when the component is first rendered. To get around this issue, we can use a functional update form of the state setter function (setAllMessages) which allows us to access the most recent state value (prevMsg) and update it based on that value, rather than relying on the state value that was captured when the socket event listener was first set up.
      if (selectedChat._id === message.chatId) {
        setAllMessages((prevMsg) => [...prevMsg, message]);
      }
    };

    socket.on("receive-message", handleReceive);
    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [selectedChat]);

  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area");
    if (msgContainer) {
      msgContainer.scrollTop = msgContainer.scrollHeight; // Scroll to the bottom of the chat area whenever allMessages changes, so that the latest message is always visible to the user.
    }
  }, [allMessages]);
  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">{formatName(selectedUser)}</div>
          <div className="main-chat-area">
            {allMessages.map((msg) => {
              const isCurrentUserSender = msg.sender === user._id;
              return (
                <div
                  className="message-container"
                  style={
                    isCurrentUserSender
                      ? { justifyContent: "end" }
                      : { justifyContent: "start" }
                  }
                >
                  <div>
                    <div
                      className={
                        isCurrentUserSender
                          ? "send-message"
                          : "received-message"
                      }
                    >
                      {msg.text}
                    </div>
                    <div
                      className="message-timestamp"
                      style={
                        isCurrentUserSender
                          ? { float: "right" }
                          : { float: "left" }
                      }
                    >
                      {formatTime(msg.createdAt)}{" "}
                      {isCurrentUserSender && msg.read && (
                        <i
                          className="fa fa-check-circle"
                          aria-hidden="true"
                          style={{ color: "#e74c3c" }}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            ></input>
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={sendMessage}
            ></button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatArea;
