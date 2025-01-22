import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: null,
  notifications: [],
};

const slice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    getNotification: (state, action) => {
      state.notifications = action.payload;
    },
    getNotificationCount: (state, action) => {
      state.count = action.payload;
    },
    emptyNotificationCount: (state) => {
      state.count = null;
    },
    emptyNotification: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  getNotification,
  getNotificationCount,
  emptyNotificationCount,
  emptyNotification,
} = slice.actions;

export default slice.reducer;
