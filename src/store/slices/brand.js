import { createSlice } from "@reduxjs/toolkit";
import {
  brandMain,
  brandMain2,
  eventMain2,
  eventMain3,
  eventMain,
  eventUserImage,
  spaceUserImage,
} from "../../assets";

const initialState = {
  brands: [
    // {
    //   id: 1,
    //   type: "brand",
    //   owned: true,
    //   slides: [eventMain, eventMain2, eventMain3],
    //   profilePic: eventUserImage,
    //   profileName: "EcoLux Designs",
    //   category: "Sustainable Fashion",
    //   details: {
    //     by: "Emily Thompson",
    //     events: "1234",
    //     followes: "234566",
    //     saved: "789k",
    //   },
    //   rating: 5,
    //   ratingBased: "Based on 12345 reviews from 12345 Events",
    //   tabs: [
    //     {
    //       label: "Details",
    //       props: {
    //         details: {
    //           overview: [
    //             `EcoLux Designs is a sustainable fashion brand that merges luxury
    //             with eco-friendly materials. It specializes in creating high-end
    //             clothing and accessories made from organic and recycled materials.`,
    //           ],
    //           location: "123 Williamsburg Ave, Brooklyn, NY 11211",
    //           expectedPoint: {
    //             title: "What to Expect:",
    //             points: [
    //               `In an industry where trends come and go, EcoLux Designs stands out by
    //           creating fashion with a purpose. As a trailblazer in the world of
    //           sustainable luxury, this brand is redefining high-end fashion by
    //           merging style with eco-friendly practices. Every piece in the EcoLux
    //           collection is crafted with the utmost care, using organic fabrics,
    //           recycled materials, and responsible manufacturing processes.`,
    //               `From elegant dresses to timeless accessories, EcoLux Designs offers a
    //           wide range of high-end fashion pieces that not only look good but also
    //           do good for the planet. The brand’s commitment to sustainability goes
    //           beyond just the materials—they focus on ethical production and
    //           long-lasting designs, ensuring that each item has minimal
    //           environmental impact and maximum longevity in your wardrobe.`,
    //             ],
    //           },
    //           overviewImage: brandMain,
    //           otherPoints2: {
    //             title: "Leading the Movement Toward Eco-Conscious Fashion",
    //             points: [
    //               `What makes EcoLux Designs truly special is the balance it strikes
    //           between luxury and sustainability. The designs are contemporary, chic,
    //           and versatile, proving that eco-conscious fashion doesn't have to
    //           compromise on style. Whether you’re attending a gala or simply
    //           updating your everyday wardrobe, EcoLux Designs has something that
    //           will elevate your look while aligning with your values.`,
    //               `    As more consumers seek out brands that reflect their commitment to the
    //           environment, EcoLux Designs is at the forefront of this
    //           movement—proving that fashion can be both luxurious and sustainable.
    //           By investing in quality over quantity, this brand is making a
    //           statement that fashion should enhance the world, not harm it.`,
    //             ],
    //           },
    //         },
    //       },
    //     },
    //     {
    //       label: "Events",
    //       props: null,
    //     },
    //     {
    //       label: "Stats",
    //       props: null,
    //     },
    //     {
    //       label: "Reviews",
    //       props: null,
    //     },
    //   ],
    // },
  ],
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
  },
});

export const { addBrand, editBrand, updateBrands } = slice.actions;

export default slice.reducer;
