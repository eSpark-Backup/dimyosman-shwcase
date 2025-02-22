import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allData: [],
  spaceData: [],
  skip: true,
  parameters: {
    entity: "BRAND",
    name: "",
    locaion: "",
    long: "",
    lat: "",
    radius: "",
    additional: "",
    categoryNames: "",
  },
  allFilterCategories: [],
  allCategoriesNotSearch: [],
  allLocations: [],
  page: 1,
  isTyping: false,
  search_query: null,
  shouldReturn: false
};

const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setAllSearchData: (state, action) => {
      state.allData = action.payload;
    },
    setSpaceSearchData: (state, action) => {
      state.spaceData = action.payload;
    },
    setAllFilterCategories: (state, action) => {
      state.allFilterCategories = action.payload;
    },
    setEntity: (state, action) => {
      state.parameters.entity = action.payload;
    },
    setName: (state, action) => {
      state.parameters.name = action.payload;
    },
    setLocation: (state, { payload }) => {
      state.parameters.long = payload.long;
      state.parameters.lat = payload.lat;
      state.parameters.locaion = payload.locaion;
    },
    setRadius: (state, action) => {
      state.parameters.radius = action.payload;
    },
    setAdditional: (state, action) => {
      state.parameters.additional = action.payload;
    },
    setCategoryNames: (state, action) => {
      state.parameters.categoryNames = action.payload;
    },
    setSkip: (state, action) => {
      state.skip = action.payload;
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    emptyFilters: (state) => {
      state.parameters = {
        entity: "BRAND",
        name: "",
        locaion: "",
        long: "",
        lat: "",
        radius: "",
        additional: "",
        categoryNames: "",
      };
    },
    setAllCategoriesNotSearch: (state, action) => {
      state.allCategoriesNotSearch = action.payload;
    },
    emptyCategoryNames: (state) => {
      state.parameters.categoryNames = "";
    },
    setAllLocations: (state, action) => {
      state.allLocations = action.payload;
    },
    emptyAllLocations: (state) => {
      state.allLocations = [];
    },
    setPageNumber: (state, action) => {
      state.page = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.search_query = action.payload;
    },
    setShouldReturn: (state, action) => {
      state.shouldReturn = action.payload;
    },
  },
});

export const {
  setAllSearchData,
  setSpaceSearchData,
  setAllFilterCategories,
  setEntity,
  setName,
  setLocation,
  setAdditional,
  setCategoryNames,
  setSkip,
  setRadius,
  emptyFilters,
  setAllCategoriesNotSearch,
  emptyCategoryNames,
  setAllLocations,
  emptyAllLocations,
  setPageNumber,
  setIsTyping,
  setSearchQuery,
  setShouldReturn
} = slice.actions;

export default slice.reducer;
