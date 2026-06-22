import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/index";
import Login from "./pages/login/index";
import Signup from "./pages/signup/index";
import ProtectedRoute from "./components/protectedRoute";
import { Toaster } from "react-hot-toast";
import Loader from "./components/loader";
import { useSelector } from "react-redux";

function App() {
  const loader = useSelector((state) => state.loaderReducer.loader); //This line uses the useSelector hook from the react-redux library to access the loading state from the Redux store. The useSelector hook allows you to extract data from the Redux store state, and in this case, we are accessing the loading property from the loaderReducer. This loading state can be used to conditionally render a loading spinner or other UI elements to indicate that a loading process is in progress in the application.
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } // By wrapping the home component with the ProtectedRoute component, we can ensure that only authenticated users can access the home page. If an unauthenticated user tries to access the home page, they will be redirected to the login page. This is a common pattern for protecting routes in a React application and ensuring that sensitive content is only accessible to authorized users.
            // The Home component gets passed as a child to the ProtectedRoute component, which allows the ProtectedRoute component to render the Home component if the user is authenticated. If the user is not authenticated, the ProtectedRoute component can handle the logic to redirect the user to the login page or display an appropriate message. This way, we can control access to the Home component based on the user's authentication status.
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
//Using curly braces for the element to specify the component that should be rendered when the route is matched. This allows us to render the Home, Login, and Signup components when the corresponding routes are accessed in the application. The BrowserRouter component is used to wrap the entire routing structure, enabling client-side routing in the React application.

export default App;
