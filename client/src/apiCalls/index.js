import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}); // Creates an axios instance to export it to other files.
// In order to make call to protected apis, we need to set the token in the header of the request. We can do this by using interceptors in axios. Interceptors are functions that are called before a request is sent or after a response is received. We can use interceptors to add the token to the header of the request before it is sent to the server.
