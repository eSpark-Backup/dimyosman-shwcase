import { createSlice } from "@reduxjs/toolkit";
import {
  brandMain,
  brandMain2,
  eventMain2,
  eventMain3,
  eventMainModal1,
  eventUserImage,
  spaceUserImage,
} from "../../assets";

const initialState = {
  brands: [
    {
      id: 1,
      type: "brand",
      owned: true,
      slides: [eventMainModal1, eventMain2, eventMain3],
      profilePic: eventUserImage,
      profileName: "EcoLux Designs",
      category: "Sustainable Fashion",
      details: {
        by: "Emily Thompson",
        events: "1234",
        followes: "234566",
        saved: "789k",
      },
      rating: 5,
      ratingBased: "Based on 12345 reviews from 12345 Events",
      tabs: [
        {
          label: "Details",
          props: {
            details: {
              overview: [
                `EcoLux Designs is a sustainable fashion brand that merges luxury
                with eco-friendly materials. It specializes in creating high-end
                clothing and accessories made from organic and recycled materials.`,
              ],
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              expectedPoint: {
                title: "What to Expect:",
                points: [
                  `In an industry where trends come and go, EcoLux Designs stands out by
              creating fashion with a purpose. As a trailblazer in the world of
              sustainable luxury, this brand is redefining high-end fashion by
              merging style with eco-friendly practices. Every piece in the EcoLux
              collection is crafted with the utmost care, using organic fabrics,
              recycled materials, and responsible manufacturing processes.`,
                  `From elegant dresses to timeless accessories, EcoLux Designs offers a
              wide range of high-end fashion pieces that not only look good but also
              do good for the planet. The brand’s commitment to sustainability goes
              beyond just the materials—they focus on ethical production and
              long-lasting designs, ensuring that each item has minimal
              environmental impact and maximum longevity in your wardrobe.`,
                ],
              },
              overviewImage: brandMain,
              otherPoints2: {
                title: "Leading the Movement Toward Eco-Conscious Fashion",
                points: [
                  `What makes EcoLux Designs truly special is the balance it strikes
              between luxury and sustainability. The designs are contemporary, chic,
              and versatile, proving that eco-conscious fashion doesn't have to
              compromise on style. Whether you’re attending a gala or simply
              updating your everyday wardrobe, EcoLux Designs has something that
              will elevate your look while aligning with your values.`,
                  `    As more consumers seek out brands that reflect their commitment to the
              environment, EcoLux Designs is at the forefront of this
              movement—proving that fashion can be both luxurious and sustainable.
              By investing in quality over quantity, this brand is making a
              statement that fashion should enhance the world, not harm it.`,
                ],
              },
            },
          },
        },
        {
          label: "Events",
          props: null,
        },
        {
          label: "Stats",
          props: null,
        },
        {
          label: "Reviews",
          props: null,
        },
      ],
    },
    {
      id: 2,
      type: "brand",
      owned: false,
      slides: [eventMainModal1, eventMain2, eventMain3],
      profilePic: spaceUserImage,
      profileName: "Urban Pop-Up Pavilion",
      category: "Real Estate",
      details: {
        by: "Michael Harrison",
        spaces: "1234",
        followes: "234566",
        saved: "789k",
      },
      rating: 5,
      ratingBased: "Based on 12345 reviews from 12345 Leases",
      tabs: [
        {
          label: "Details",
          props: {
            details: {
              overview: [
                `Urban Pop-Up Pavilion is a dynamic real estate brand that offers premium spaces for temporary retail, art exhibits, and community events in Broklyn, New York.`,
              ],
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              expectedPoint: {
                title:
                  "Urban Pop-Up Pavilion: A Dynamic Space for Creativity and Commerce",
                points: [
                  `Located in the heart of Brooklyn, Urban Pop-Up Pavilion is redefining the concept of temporary spaces. Designed to cater to the needs of brands, artists, and event organizers, this versatile venue offers a perfect blend of style, functionality, and prime location. Whether you're launching a product, hosting an art exhibition, or running a pop-up retail store, Urban Pop-Up Pavilion provides a dynamic environment where creativity meets commerce.`,
                ],
              },
              otherPoints: {
                title: "Flexible Spaces for Every Event",
                points: [
                  `What sets Urban Pop-Up Pavilion apart is its flexibility. With over 5,000 square feet of reconfigurable space, the venue can be tailored to meet the specific needs of any event. The high ceilings and open layout make it ideal for large installations, while adjustable LED lighting allows for optimal presentation. Whether you need an intimate setting or a larger showcase, Urban Pop-Up Pavilion adapts to fit the occasion perfectly.`,
                ],
              },
              overviewImage: brandMain2,
              otherPoints2: {
                title: "Modern Amenities to Elevate Your Event",
                points: [
                  `The Pavilion is equipped with modern amenities to ensure a seamless experience. High-speed Wi-Fi, on-site security, and a dedicated storage area offer convenience and security for both event organizers and attendees. The venue’s eco-friendly design aligns with the growing demand for sustainable event spaces, offering energy-efficient solutions while maintaining a sleek and modern appearance.`,
                ],
              },
            },
          },
        },
        {
          label: "Spaces",
          props: null,
        },
        {
          label: "Reviews",
          props: null,
        },
      ],
    },
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
  },
});

export const { addBrand, editBrand } = slice.actions;

export default slice.reducer;
