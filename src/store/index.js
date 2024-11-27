import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import brand from "./slices/brand";
import event from "./slices/event";
import space from "./slices/space";
import { authApi } from "../services/auth";

const store = configureStore({
  reducer: {
    auth,
    brand,
    event,
    space,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
});

export default store;
