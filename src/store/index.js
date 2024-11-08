import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import brand from "./slices/brand";
import event from "./slices/event";
import space from "./slices/space";

const store = configureStore({
  reducer: {
    auth,
    brand,
    event,
    space,
  },
});

export default store;
