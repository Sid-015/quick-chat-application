import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser, getAllUsers } from "../apiCalls/users";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../redux/loaderSlice";
import { setUser, setAllUsers, setAllChats } from "../redux/userSlice";
import toast from "react-hot-toast";
import { getAllchats } from "../apiCalls/chat";

function ProtectedRoute({ children }) {
  // Safely read `user` from redux state. state.userReducer may be null during initialization,
  // so use optional chaining to avoid destructuring from null which throws an error.
  const user = useSelector((state) => state.userReducer?.user);

  const Navigate = useNavigate(); //The useNavigate hook from react-router-dom is used to programmatically navigate to different routes in a React application. In this case, we are using it to redirect the user to the login page if they are not authenticated. The useNavigate hook returns a function that can be called with a path as an argument to navigate to that path. In this code, we call Navigate("/login") to redirect the user to the login page if they do not have a valid token in local storage.
  const dispatch = useDispatch();

  const getLoggedInUser = async () => {
    let response = null;
    try {
      dispatch(showLoader()); // Show the loader when fetching the logged-in user
      //The get-logged-user API endpoint is expected to return a response with a success property indicating whether the request was successful, and a data property containing the details of the logged-in user if the request was successful. If the response indicates success, we update the user state with the data from the response, which can then be used to display user information or perform other actions that require knowledge of the current user's identity.
      //Plus the data property is sent by get-looged-user is sent by checking the id which we are sending in the token using the axiosinstance in index.js file, which is decoded in the server and then we are fetching the user details using that id and sending it back to the client.
      response = await getLoggedUser(); //The getLoggedInUser function is an asynchronous function that makes an API call to retrieve the details of the currently logged-in user. It uses the getLoggedInUser function from the apiCalls/users.js file, which sends a GET request to the server to fetch the user's information. The response from the server will contain the details of the logged-in user, which can be used by the caller to display user information or perform other actions that require knowledge of the current user's identity.
      dispatch(hideLoader()); // Hide the loader after fetching the logged-in user
      if (response.success) {
        dispatch(setUser(response.data)); // If the response indicates success, we update the user state with the data from the response, which can then be used to display user information or perform other actions that require knowledge of the current user's identity.
      } else {
        toast.error(response.message);
        Navigate("/login");
        console.log("Error fetching logged in user: ", response.message);
      }
    } catch (error) {
      dispatch(hideLoader()); // Hide the loader if there is an error during fetching the logged-in user
      Navigate("/login");
      console.log("Error fetching logged in user: ", error);
    }
  };

  const getAllUsersFromDB = async () => {
    let response = null;
    try {
      dispatch(showLoader()); // Show the loader when fetching all users
      response = await getAllUsers(); //The getAllUsers function is an asynchronous function that makes an API call to retrieve the details of all users. It uses the getAllUsers function from the apiCalls/users.js file, which sends a GET request to the server to fetch the information of all users. The response from the server will contain the details of all users, which can be used by the caller to display user information or perform other actions that require knowledge of all users in the system.
      dispatch(hideLoader()); // Hide the loader after fetching all users
      if (response.success) {
        dispatch(setAllUsers(response.data)); // If the response indicates success, we update the allUsers state with the data from the response, which can then be used to display user information or perform other actions that require knowledge of all users in the system.
        console.log("All users fetched successfully: ", response.data);
      } else {
        toast.error(response.message);
        console.log("Error fetching all users: ", response.message);
      }
    } catch (error) {
      dispatch(hideLoader()); // Hide the loader if there is an error during fetching all users
      console.log("Error fetching all users: ", error);
    }
  };

  const storeAllChats = async () => {
    let response = null;

    try {
      dispatch(showLoader());
      response = await getAllchats();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setAllChats(response.data));
        console.log("All chats fetched successfully.");
      } else {
        toast.error(response.messge);
        console.log("Error fetching chats: ", response.message);
      }
    } catch (error) {
      dispatch(hideLoader());
      console.log("Error fetching all chats.", error);
    }
  };
  useEffect(() => {
    //useEffect is a hook in React that allows you to perform side effects in function components. It takes a function as an argument and runs that function after the component has rendered. In this case, we are using useEffect to check for the presence of a token in local storage when the component mounts. If the token is not found, we redirect the user to the login page. This ensures that only authenticated users can access the protected route, and unauthenticated users are prompted to log in before accessing the content of the protected route.
    console.log("Checking for token in local storage...");
    if (localStorage.getItem("token")) {
      getLoggedInUser();
      getAllUsersFromDB();
      storeAllChats();
    } else {
      Navigate("/login");
    }
  }, []); //The empty dependency array ([]) means that this effect will only run once when the component mounts. This is because there are no dependencies that would trigger the effect to run again when they change. In this case, we want to check for the presence of a token in local storage only once when the component is first rendered, and we don't want it to run again on subsequent renders unless the component is unmounted and remounted.

  return <div>{children}</div>;
}

export default ProtectedRoute;
