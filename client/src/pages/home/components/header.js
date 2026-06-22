import { useSelector } from "react-redux";

function Header() {
  const user = useSelector((state) => state.userReducer?.user); //This line uses the useSelector hook from the react-redux library to access the user information from the Redux store. The useSelector hook allows you to extract data from the Redux store state, and in this case, we are accessing the user property from the userReducer. This user information can be used to display user details or perform other actions that require knowledge of the current user's identity within the Header component or any child components that it renders.¯

  function getFullName() {
    let fname =
      user?.firstName.at(0).toUpperCase() +
      user?.firstName.slice(1).toLowerCase();
    let lname =
      user?.lastName.at(0).toUpperCase() +
      user?.lastName.slice(1).toLowerCase();

    return fname + " " + lname;
  }
  function getInitials() {
    if (user) {
      return (
        user.firstName.toLowerCase().charAt(0).toUpperCase() +
        user.lastName.toLowerCase().charAt(0).toUpperCase()
      );
    }
    return "";
  }

  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Quick Chat
      </div>
      <div className="app-user-profile">
        <div className="logged-user-name">{getFullName()}</div>
        <div className="logged-user-profile-pic">{getInitials()}</div>
      </div>
    </div>
  );
}

export default Header;
