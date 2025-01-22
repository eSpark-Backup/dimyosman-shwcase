import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: null,
};

const slice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    getNotificationCount: (state, action) => {
      state.count = action.payload;
    },
    emptyNotificationCount: (state) => {
      state.count = null;
    },
  },
});

export const { getNotificationCount, emptyNotificationCount } = slice.actions;

export default slice.reducer;
