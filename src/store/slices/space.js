import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  spaces: [],
  navigationActiveTab: "",
  activeTabForNotif: "Space",
  refetchTriggered: false,
  hasPaymentDone: false,
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
    setRefetchTriggered: (state, action) => {
      state.refetchTriggered = action.payload;
    },
    setHasPaymentDone: (state, action) => {
      state.hasPaymentDone = action.payload;
    },
    setRedirectTab: (state, action) => {
      state.navigationActiveTab = action.payload;
    },
    setTabForNotification: (state, action) => {
      state.activeTabForNotif = action.payload;
    },
  },
});

export const {
  addSpace,
  editSpace,
  updateSpace,
  setRefetchTriggered,
  setHasPaymentDone,
  setRedirectTab,
  setTabForNotification
} = slice.actions;

export default slice.reducer;
