import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/auth";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { data } = payload;
        state.token = data.token;
        state.user = data?.userWithoutPassword;
        localStorage.setItem("token", data.token);
      }
    );
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        const { data } = payload;
        state.token = data.token;
        state.user = data?.user;
        localStorage.setItem("token", data.token);
      }
    );
  },
});

export const { logout } = slice.actions;

export default slice.reducer;
