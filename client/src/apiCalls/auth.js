import axios from "axios";

export const signUpUser = async (userData) => {
  try {
    const response = await axios.post("/api/auth/signup", userData); //making the post request to the api using axios and passing the userData in it as well.
    return response.data; //The response from the server is returned as a JavaScript object, which can be used by the caller to handle the result of the signup operation, such as displaying a success message or handling any errors that may occur during the signup process.
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post("/api/auth/login", userData); //making the post request to the api using axios and passing the userData in it as well.
    return response.data; //The response from the server is returned as a JavaScript object, which can be used by the caller to handle the result of the login operation, such as displaying a success message or handling any errors that may occur during the login process.
  } catch (error) {
    console.log("Error logging in user:", error);
    throw error;
  }
};
