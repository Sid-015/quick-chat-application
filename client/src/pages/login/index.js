import React from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../apiCalls/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux"; // We can call the actions on loaderSlice using useDispatch hook from react-redux. The useDispatch hook allows us to dispatch actions to the Redux store, which can then trigger state updates and re-render components that are connected to the store. By using useDispatch, we can easily manage the state of the loader in our application by dispatching actions to show or hide the loader based on the status of our API calls or other asynchronous operations.
import { showLoader, hideLoader } from "../../redux/loaderSlice"; // We can call the actions on loaderSlice using useDispatch hook from react-redux. The useDispatch hook allows us to dispatch actions to the Redux store, which can then trigger state updates and re-render components that are connected to the store. By using useDispatch, we can easily manage the state of the loader in our application by dispatching actions to show or hide the loader based on the status of our API calls or other asynchronous operations.

function Login() {
  const dispatch = useDispatch();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  async function onFormSubmit(e) {
    e.preventDefault();
    try {
      dispatch(showLoader()); //This line dispatches an action to the Redux store with the type "SHOW_LOADER". This action is typically used to indicate that a loading process has started, and it can trigger a state update in the loader reducer to set the loading state to true. This allows the application to display a loading spinner or other UI elements to indicate that a loading process is in progress while waiting for an API response or performing other asynchronous tasks.
      let response = await loginUser(user);
      dispatch(hideLoader()); //This line dispatches an action to the Redux store with the type "HIDE_LOADER". This action is typically used to indicate that a loading process has completed, and it can trigger a state update in the loader reducer to set the loading state to false. This allows the application to hide the loading spinner or other UI elements that were displayed while waiting for an API response or performing other asynchronous tasks, providing feedback to the user that the process has finished.
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.token); //The token is stored in the browser's local storage using localStorage.setItem(). This allows the application to persist the user's authentication state across different pages and sessions. The token can be retrieved later when needed, such as when making authenticated API requests, by using localStorage.getItem("token").
        window.location.href = "/"; //After a successful login, the user is redirected to the home page ("/") using window.location.href. This allows the user to access the main content of the application after logging in. The redirection is typically done to provide a seamless user experience and to ensure that the user is taken to the appropriate page after authentication.
      } else {
        toast.error("Error logging in user: " + response.message);
      }
    } catch (error) {
      dispatch(hideLoader()); //This line dispatches an action to the Redux store with the type "HIDE_LOADER". This action is typically used to indicate that a loading process has completed, and it can trigger a state update in the loader reducer to set the loading state to false. This allows the application to hide the loading spinner or other UI elements that were displayed while waiting for an API response or performing other asynchronous tasks, providing feedback to the user that the process has finished. In this case, it ensures that the loader is hidden even if there was an error during the login process.
      toast.error("Error logging in user: " + error.message);
    }
  }

  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Login Here</h1>
        </div>
        <div className="form" onSubmit={(e) => onFormSubmit(e)}>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button>Login</button>
          </form>
        </div>
        <div className="card_terms">
          <span>Don't have an account yet?</span>
          <Link to="/signup">Signup</Link>{" "}
          {/* The Link component from react-router-dom is used to create a link that navigates to the "/signup" route when clicked. This allows users who don't have an account to easily navigate to the signup page and create a new account. The Link component is a convenient way to handle client-side navigation in a React application without causing a full page reload. */}
        </div>
      </div>
    </div>
  );
}

export default Login;
