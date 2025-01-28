import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: null,
  notifications: [],
  gotToMessage: null,
  fromNotification: false,
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
    setGoToMessage: (state, { payload }) => {
      const { chatId, spaceName } = payload;

      state.gotToMessage = {
        spaceName,
        chatId,
      };
    },
    emptyGoToMessage: (state) => {
      state.gotToMessage = null;
    },
    setFromNotification: (state, action) => {
      state.fromNotification = action.payload;
    }
  },
});

export const {
  getNotification,
  getNotificationCount,
  emptyNotificationCount,
  emptyNotification,
  setGoToMessage,
  emptyGoToMessage,
  setFromNotification,
} = slice.actions;

export default slice.reducer;
