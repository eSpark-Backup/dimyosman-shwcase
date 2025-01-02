import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  myChat: [],
  chatDetails: {},
  messages: [],
  hasChats: "",
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getMyChat: (state, action) => {
      const newChat = action.payload;
      state.myChat = newChat;
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
    isUserHasChat(state,action) {
      state.hasChats = action.payload;
    },
  },
});

export const {
  getMyChat,
  getChatDetails,
  getMessages,
  removeMychat,
  isUserHasChat,
} = slice.actions;

export default slice.reducer;
