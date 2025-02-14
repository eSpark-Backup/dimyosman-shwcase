import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: null,
  countInquiry: null,
  notifications: [],
  gotToMessage: null,
  fromNotification: false,
  forceReload: false
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
    getInquiryCount: (state, action) => {
      state.countInquiry = action.payload;
    },
    emptyInquiryCount: (state) => {
      state.countInquiry = null;
    },
    emptyNotification: (state) => {
      state.notifications = [];
    },
    setGoToMessage: (state, { payload }) => {
      if (payload?.brandName) {
        state.gotToMessage = {
          brandName: payload?.brandName,
          chatId: payload?.chatId,
        };
      } else {
        state.gotToMessage = {
          pName: payload?.pName,
          chatId: payload?.chatId,
        };
      }
    },
    emptyGoToMessage: (state) => {
      state.gotToMessage = null;
    },
    setFromNotification: (state, action) => {
      state.fromNotification = action.payload;
    },
    setForceReload: (state, action) => {
      state.forceReload = action.payload;
    },
  },
});

export const {
  getNotification,
  getNotificationCount,
  emptyNotificationCount,
  getInquiryCount,
  emptyInquiryCount,
  emptyNotification,
  setGoToMessage,
  emptyGoToMessage,
  setFromNotification,
  setForceReload
} = slice.actions;

export default slice.reducer;
