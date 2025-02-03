import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allActivityData: [],
  activitySpaceData: [],
  page: 1,
};

const slice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setAllActivityData: (state, action) => {
      state.allActivityData = action.payload;
    },
    setSpaceData: (state, action) => {
      state.activitySpaceData = action.payload;
    },
    setActivityPageNumber: (state, action) => {
      state.page = action.payload;
    }
  },
});

export const { setAllActivityData, setSpaceData, setActivityPageNumber } = slice.actions;

export default slice.reducer;
