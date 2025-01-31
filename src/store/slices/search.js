import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  skip: true,
  parameters: {
    entity: "",
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
};

const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
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
      // state.parameters.locaion = payload.locaion;
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
    emptyFilters: (state) => {
      state.parameters = {
        entity: "",
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
  },
});

export const {
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
} = slice.actions;

export default slice.reducer;
