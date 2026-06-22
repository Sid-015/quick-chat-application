import React from "react";
import { Link } from "react-router-dom";
import { signUpUser } from "../../apiCalls/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";

function Signup() {
  const dispatch = useDispatch();
  //components cannot be async function, I accidentaly made the Signup component an async function, which is not allowed in React. React components must be synchronous functions that return JSX. To handle asynchronous operations, such as API calls, we can define an async function inside the component and call it when needed, such as in an event handler for form submission. This way, we can keep the component synchronous while still being able to perform asynchronous tasks.
  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  async function onFormSubmit(event) {
    event.preventDefault(event);
    try {
      dispatch(showLoader()); // Show the loader when the form is submitted
      const response = await signUpUser(user);
      dispatch(hideLoader()); // Hide the loader when the form submission is complete
      //seperating the business logic and ui logic. The business logic resides in apiCalls/auth.js and the ui logic resides in the component. This makes the code more modular and easier to maintain. The signUpUser function is responsible for making the API call to the server to sign up the user, while the onFormSubmit function is responsible for handling the form submission and updating the UI based on the response from the server.
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoader()); // Hide the loader if there is an error during form submission
      toast.error("Error signing up user: " + error.message);
    }
    //Prevent the default form submission behavior, which would typically cause a page reload. By calling event.preventDefault(), we can handle the form submission in a custom way, such as sending the data to a server or performing client-side validation, without triggering a full page refresh.
  }
  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Create Account</h1>
        </div>
        <div className="form">
          <form onSubmit={(e) => onFormSubmit(e)}>
            <div className="column">
              <input
                type="text"
                placeholder="First Name"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
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
            <button>Sign Up</button>
          </form>
        </div>
        <div className="card_terms">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
