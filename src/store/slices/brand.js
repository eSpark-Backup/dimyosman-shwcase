import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
  objectForNewBrand: null,
  isBrand: false,
};

const slice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
    editBrand: (state, action) => {
      const { id, updatedBrand } = action.payload;
      const index = state.brands.findIndex((brand) => brand.id === id);
      if (index !== -1) {
        state.brands[index] = { ...state.brands[index], ...updatedBrand };
      }
    },
    updateBrands(state, action) {
      state.brands = action.payload;
    },
    setObjectForNewBrand: (state, action) => {
      state.objectForNewBrand = action.payload;
    },
    setIsBrand:(state,action) => {
      state.isBrand = action.payload;
    }
  },
});

export const { addBrand, editBrand, updateBrands, setObjectForNewBrand, setIsBrand } =
  slice.actions;

export default slice.reducer;
