import Header from "./components/header";
import Sidebar from "./components/sideBar";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { setAllChats, setLastIncomingMessage } from "../../redux/userSlice";
import ChatArea from "./components/chat";

const socket = io("http://localhost:4000");

function Home() {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const { allChats } = useSelector((state) => state.userReducer);
  // to ensure the client side stays connectd to express server.

  // join the user's socket room once the user is available
  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
      console.log("socket: join-room emitted for user", user._id);
    }
  }, [user]);

  // log socket connection
  useEffect(() => {
    const onConnect = () => console.log("socket connected", socket.id);
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, []);
  useEffect(() => {
    if (!user) return;

    const handleReceive = (message) => {
      // update chats list (lastMessage + unread count)
      const updatedChats = allChats.map((chat) => {
        if (chat._id === message.chatId) {
          const isFromCurrentUser = message.sender === user._id;
          return {
            ...chat,
            lastMessage: message,
            unreadMessagesCount: isFromCurrentUser
              ? chat.unreadMessagesCount
              : (chat.unreadMessagesCount || 0) + 1,
          };
        }
        return chat;
      });
      dispatch(setAllChats(updatedChats));
      // also expose the incoming message so ChatArea can append when needed
      dispatch(setLastIncomingMessage(message));
    };

    socket.on("receive-message", handleReceive);
    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [allChats, user, dispatch]);
  return (
    <div className="home-page">
      <Header></Header>
      <div className="main-content">
        <Sidebar></Sidebar>
        {selectedChat && <ChatArea socket={socket}></ChatArea>}
      </div>
    </div>
  );
}

export default Home;
