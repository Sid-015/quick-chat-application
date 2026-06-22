//This store is going to contain all the states such as loader, messages, chats, users etc.

import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    loaderReducer, //This line adds the loader reducer to the Redux store under the key "loader". This means that the state managed by the loader reducer will be accessible in the Redux store under the "loader" key. For example, if the loader reducer manages a loading state, you can access it in your components using state.loader.loading or similar, depending on how you structure your state.
    userReducer, //This line adds the user reducer to the Redux store under the key "user". This means that the state managed by the user reducer will be accessible in the Redux store under the "user" key. For example, if the user reducer manages a user state, you can access it in your components using state.user.user or similar, depending on how you structure your state.
  }, // Since the name is same, in ES6 we can simply write loaderReducer instead of loaderReducer: loaderReducer.
});

export default store;
