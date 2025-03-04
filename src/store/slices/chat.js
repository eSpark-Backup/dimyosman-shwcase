import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  myChat: [],
  directChats: [],
  chatDetails: [],
  messages: [],
  hasChats: "",
  activeMembers: [],
  allChatIds: [],
  unreadTypes: [],
  allGroups: [],
  hasMessages: "",
  totalPagesOfMessage: [],
  fromSideBar: false,
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
      const gatherEvents = newChat?.events?.flatMap((chat) =>
        chat.chats.map((c) => c)
      );

      const mergeAll = [
        ...gatherBrands,
        ...gatherSpaces,
        ...gatherEvents,
        ...newChat.user,
      ];

      const mergeAllChats = [
        ...newChat?.brands,
        ...newChat?.spaces,
        ...newChat?.events,
        ...newChat.user
      ];

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
    getTotalPages(state, action) {
      state.totalPagesOfMessage = action.payload;
    },
    removeMychat(state) {
      state.myChat = [];
      state.chatDetails = [];
      state.messages = [];
      state.allChatIds = [];
      state.allGroups = [];
      state.totalPagesOfMessage = [];
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
    changeMessageType: (state, action) => {
      state.hasMessages = action.payload;
    },
    getUnreadTypesSlice(state, action) {
      state.unreadTypes = action.payload;
    },
    setFromSidebar: (state, action) => {
      state.fromSideBar = action.payload;
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
  changeMessageType,
  getTotalPages,
  getUnreadTypesSlice,
  setFromSidebar
} = slice.actions;

export default slice.reducer;
