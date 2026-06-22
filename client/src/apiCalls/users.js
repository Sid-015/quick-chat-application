import { axiosInstance } from "./index";

export const getLoggedUser = async () => {
  try {
    const response = await axiosInstance.get("/api/user/get-logged-user"); //making the get request to the api using axios to get the details of the logged in user. The token is automatically included in the header of the request by the axios instance we created in the index.js file, so we don't need to worry about it here. The response from the server will contain the details of the logged in user, which can be used by the caller to display user information or perform other actions that require knowledge of the current user's identity.
    console.log("Response from getLoggedUser API: ", response);
    return response.data;
  } catch (error) {
    return {
      message: "Error fetching logged in user",
      error: error.message,
      success: false,
    };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/user/get-all-users"); //making the get request to the api using axios to get the details of all users. The token is automatically included in the header of the request by the axios instance we created in the index.js file, so we don't need to worry about it here. The response from the server will contain the details of all users, which can be used by the caller to display user information or perform other actions that require knowledge of the current user's identity.
    console.log("Response from getAllUsers API: ", response);
    return response.data;
  } catch (error) {
    return {
      message: "Error fetching all users",
      error: error.message,
      success: false,
    };
  }
};
