import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import moment from "moment";

function UserList({ searchKey }) {
  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
  } = useSelector((state) => state.userReducer);
  // Since we already have a variable named user, thus aliasing the global state user as currentUser
  const Dispatch = useDispatch();
  const startNewChat = async (searchedUserId) => {
    let response = null;

    try {
      Dispatch(showLoader());
      response = await createNewChat([currentUser._id, searchedUserId]);
      Dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChat = [...allChats, newChat];
        Dispatch(setAllChats(updatedChat));
        Dispatch(setSelectedChat(newChat));
      }
    } catch (error) {
      toast.error(response.message);
      Dispatch(hideLoader());
    }
  };

  const openChat = async (selectedUserID) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((m) => m._id).includes(currentUser._id) &&
        chat.members.map((m) => m._id).includes(selectedUserID), // Searching for a chat in all chats that has the loggen in user id and id of the user whose div has been selected.
    );

    if (chat) {
      Dispatch(setSelectedChat(chat));
    }
  };

  const isSelectedChat = (user) => {
    if (selectedChat) {
      return selectedChat.members.map((m) => m._id).includes(user._id); // If the selected chat contains the userID that means that chat is the selected Chat.
    }
    return false;
  };

  const getLastMessageTimeStamp = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId),
    );

    if (!chat || !chat?.lastMessage) {
      return "";
    } else {
      return moment(chat?.lastMessage?.createdAt).format("hh:mm A");
    }
  };

  const getLastMessage = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId),
    );

    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const msgPrefix =
        chat?.lastMessage?.sender === currentUser._id ? "You: " : "";
      return msgPrefix + chat?.lastMessage?.text.substring(0, 25);
    }
  };

  const getUnreadMessageCount = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId),
    );

    if (
      chat &&
      chat.unreadMessagesCount &&
      chat.lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="unread-message-counter">{chat.unreadMessagesCount}</div>
      );
    } else {
      return "";
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

  function getData() {
    if (searchKey === "") {
      return allChats;
    } else {
      return allUsers.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchKey.toLowerCase())
        );
      });
    }
  }

  return getData().map((obj) => {
    let user = obj;
    if (obj.members) {
      //if obj contains members array, that implies it is of type Chat, because only chat object has member array.
      user = obj.members.find((mem) => mem._id !== currentUser._id); // finding user whose ID doesnt match the currentUser id and assigning it to user variable to display in the list.
    }
    return (
      <div
        className="user-search-filter"
        onClick={() => {
          openChat(user._id);
        }}
        key={user._id}
      >
        <div
          className={!isSelectedChat(user) ? "filtered-user" : "selected-user"}
        >
          {user.profilePic && (
            <img
              src={user.profilePic}
              alt="User's profile pic"
              className="user-profile-image"
            />
          )}
          {!user.profilePic && (
            <div
              className={
                isSelectedChat(user)
                  ? " user-selected-avatar"
                  : "user-default-avatar"
              }
            >
              {user.firstName.charAt(0).toUpperCase() +
                user.lastName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="filter-user-details">
            <div className="user-display-name">{formatName(user)}</div>
            <div className="user-display-email">
              {getLastMessage(user._id) || user.email}
            </div>
            <div>
              {getUnreadMessageCount(user._id)}
              <div className="last-message-timestamp">
                {getLastMessageTimeStamp(user._id)}
              </div>
            </div>
            {!allChats.find((chat) =>
              chat.members.map((m) => m._id).includes(user._id),
            ) && (
              <div className="user-start-chat">
                <button
                  className="start-chat-btn"
                  onClick={() => startNewChat(user._id)}
                >
                  Start Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });
}

export default UserList;
