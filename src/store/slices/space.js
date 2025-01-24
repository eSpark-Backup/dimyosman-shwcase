import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  spaces: [],
  page: 1,
  activeTab: "Space",
};

const slice = createSlice({
  name: "space",
  initialState,
  reducers: {
    addSpace: (state, action) => {
      state.spaces.push(action.payload);
    },
    editSpace: (state, action) => {
      const { id, updatedSpace } = action.payload;
      const index = state.spaces.findIndex((space) => space.id === id);
      if (index !== -1) {
        state.spaces[index] = { ...state.spaces[index], ...updatedSpace };
      }
    },
    updateSpace(state, action) {
      state.spaces = action.payload;
    },
    whenVerifyClicked: (state, { payload }) => {
      state.page = payload.page;
      state.activeTab = payload.activeTab;
    },
  },
});

export const { addSpace, editSpace, updateSpace, whenVerifyClicked } =
  slice.actions;

export default slice.reducer;
