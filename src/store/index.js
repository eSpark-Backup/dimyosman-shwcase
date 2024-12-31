import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import brand from "./slices/brand";
import event from "./slices/event";
import space from "./slices/space";
import chat from "./slices/chat";
import { authApi } from "../services/auth";

const store = configureStore({
  reducer: {
    auth,
    brand,
    event,
    space,
    chat,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
});

export default store;
