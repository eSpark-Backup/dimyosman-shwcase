import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  myChat: [],
  chatDetails: {},
  messages: [],
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getMyChat: (state, action) => {
      const newChat = action.payload;
      state.myChat.push(...newChat);
      // state.myChat = action.payload;
    },
    getChatDetails: (state, action) => {
      state.chatDetails = action.payload;
    },
    getMessages(state, action) {
      state.messages = action.payload;
    },
    removeMychat(state) {
      state.myChat = [];
    },
  },
});

export const { getMyChat, getChatDetails, getMessages, removeMychat } =
  slice.actions;

export default slice.reducer;
