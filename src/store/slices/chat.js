import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  myChat: [],
  chatDetails: [],
  messages: [],
  hasChats: "",
  activeMembers: [],
  allChatIds: [],
  allGroups: [],
  hasMessages: "",
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getMyChat: (state, action) => {
      const newChat = action.payload;

      const gatherBrands = newChat?.brands?.flatMap((chat) =>
        chat.chats.map((c) => c)
      );
      const gatherSpaces = newChat?.spaces?.flatMap((chat) =>
        chat.chats.map((c) => c)
      );

      const mergeAll = [...gatherBrands, ...gatherSpaces];
      const mergeAllChats = [...newChat?.brands, ...newChat?.spaces];

      const gatherAllIds = mergeAll.map((c) => c._id);

      state.myChat = mergeAllChats;
      state.allChatIds = gatherAllIds;
    },
    getChatDetails: (state, action) => {
      state.chatDetails = action.payload;
    },
    getMessages(state, action) {
      state.messages = action.payload;
    },
    removeMychat(state) {
      state.myChat = [];
      state.chatDetails = [];
      state.messages = [];
      state.allChatIds = [];
    },
    isUserHasChat(state, action) {
      state.hasChats = action.payload;
    },
    isActiveMembers(state, action) {
      state.activeMembers = action.payload;
    },
    emptyActiveMembers(state) {
      state.activeMembers = [];
    },
    getAllMyGroups: (state, action) => {
      state.allGroups = action.payload;
    },
    filterAllMyGroups: (state, action) => {
      const { type, filterGroups } = action.payload;

      state.allGroups = filterGroups;

      if (type === "all") {
        state.hasMessages = "";
      } else if (filterGroups?.length > 0) {
        state.hasMessages = "";
      } else {
        state.hasMessages = "No Chats";
      }
    },
    changeMessageType: (state) => {
      state.hasMessages = "";
    },
  },
});

export const {
  getMyChat,
  getChatDetails,
  getMessages,
  removeMychat,
  isUserHasChat,
  isActiveMembers,
  emptyActiveMembers,
  getAllMyGroups,
  filterAllMyGroups,
  changeMessageType,
} = slice.actions;

export default slice.reducer;
