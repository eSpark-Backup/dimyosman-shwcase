import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: null,
  countInquiry: null,
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
    getInquiryCount: (state, action) => {
      state.countInquiry = action.payload;
    },
    emptyInquiryCount: (state) => {
      state.countInquiry = null;
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
  getInquiryCount,
  emptyInquiryCount,
  emptyNotification,
} = slice.actions;

export default slice.reducer;
