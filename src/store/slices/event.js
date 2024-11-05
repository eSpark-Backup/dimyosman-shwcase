import { createSlice } from "@reduxjs/toolkit";
import {
  eventActivityImage,
  eventMain,
  eventMain2,
  eventMain3,
  eventMainImage,
} from "../../assets";

const initialState = {
  events: [
    {
      id: 3,
      by: 1,
      type: "event",
      owned: true,
      slides: [eventMain, eventMain2, eventMain3],
      profilePic: eventActivityImage,
      profileName: "Ecolux Chic Pop-Up",
      category: "Sustainable Fashion",
      details: {
        by: "EcoLux Designs ",
        starting: "28.02.2025.",
        RSVP: "234566",
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
                `A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.`,
                `Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.`,
                `The event will also include workshops on sustainable fashion and personal styling sessions.`,
                `Visitors will immerse themselves in a unique shopping experience, discovering the intersection of luxury and eco-conscious fashion. This pop-up is perfect for those looking to elevate their wardrobe while supporting sustainable and ethical design practices.`,
              ],
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              space: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              startingDate: "28.02.2025.",
              endingDate: "15.4.2025.",
              expectedPoint: {
                title: "What to Expect:",
                ulPoints: [
                  `Exclusive Collection: Shoppers will have the first opportunity to explore and purchase limited-edition, high-end clothing and accessories. Each piece is thoughtfully crafted from organic cotton, recycled fabrics, and other eco-conscious materials. The collection combines timeless elegance with modern trends, offering a perfect blend of luxury and environmental responsibility.`,
                  `Workshops & Events: In addition to shopping, attendees can participate in a series of workshops focused on sustainable fashion. Learn from industry experts about eco-friendly design practices, circular fashion, and how to build a more sustainable wardrobe. Personal styling sessions will also be available, allowing guests to get tailored advice on how to incorporate sustainable pieces into their everyday looks.`,
                  `Interactive Displays: The pop-up will feature interactive displays showcasing the journey of each garment—from the sourcing of raw materials to the sustainable manufacturing processes. Attendees can gain insight into the environmental impact of their fashion choices and discover ways to make more conscious decisions.`,
                  `Eco-Friendly Environment: The venue itself will reflect the brand’s commitment to sustainability, with eco-friendly decor, recycled packaging for purchases, and zero-waste event practices.`,
                ],
              },
              overviewImage: eventMainImage,
              otherPoints2: {
                title: "Why Attend:",
                points: [
                  `This is more than just a shopping event—it’s a celebration of sustainable fashion and an opportunity to connect with like-minded individuals who value ethical practices and luxury design. Whether you're a fashion enthusiast, an eco-conscious shopper, or just curious about sustainable fashion, this pop-up store offers something for everyone.`,
                ],
              },
            },
          },
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
      id: 4,
      type: "event",
      owned: false,
      slides: [eventMain, eventMain2, eventMain3],
      profilePic: eventActivityImage,
      profileName: "Ecolux Chic Pop-Up",
      category: "Sustainable Fashion",
      details: {
        by: "EcoLux Designs ",
        starting: "28.02.2025.",
        RSVP: "234566",
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
                `A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.`,
                `Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.`,
                `The event will also include workshops on sustainable fashion and personal styling sessions.`,
                `Visitors will immerse themselves in a unique shopping experience, discovering the intersection of luxury and eco-conscious fashion. This pop-up is perfect for those looking to elevate their wardrobe while supporting sustainable and ethical design practices.`,
              ],
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              space: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              startingDate: "28.02.2025.",
              endingDate: "15.4.2025.",
              expectedPoint: {
                title: "What to Expect:",
                ulPoints: [
                  `Exclusive Collection: Shoppers will have the first opportunity to explore and purchase limited-edition, high-end clothing and accessories. Each piece is thoughtfully crafted from organic cotton, recycled fabrics, and other eco-conscious materials. The collection combines timeless elegance with modern trends, offering a perfect blend of luxury and environmental responsibility.`,
                  `Workshops & Events: In addition to shopping, attendees can participate in a series of workshops focused on sustainable fashion. Learn from industry experts about eco-friendly design practices, circular fashion, and how to build a more sustainable wardrobe. Personal styling sessions will also be available, allowing guests to get tailored advice on how to incorporate sustainable pieces into their everyday looks.`,
                  `Interactive Displays: The pop-up will feature interactive displays showcasing the journey of each garment—from the sourcing of raw materials to the sustainable manufacturing processes. Attendees can gain insight into the environmental impact of their fashion choices and discover ways to make more conscious decisions.`,
                  `Eco-Friendly Environment: The venue itself will reflect the brand’s commitment to sustainability, with eco-friendly decor, recycled packaging for purchases, and zero-waste event practices.`,
                ],
              },
              overviewImage: eventMainImage,
              otherPoints2: {
                title: "Why Attend:",
                points: [
                  `This is more than just a shopping event—it’s a celebration of sustainable fashion and an opportunity to connect with like-minded individuals who value ethical practices and luxury design. Whether you're a fashion enthusiast, an eco-conscious shopper, or just curious about sustainable fashion, this pop-up store offers something for everyone.`,
                ],
              },
            },
          },
        },
        {
          label: "Reviews",
          props: null,
        },
      ],
    },
    {
      id: 5,
      type: "event",
      owned: false,
      slides: [eventMain, eventMain2, eventMain3],
      profilePic: eventActivityImage,
      profileName: "Ecolux Chic Pop-Up",
      category: "Sustainable Fashion",
      details: {
        by: "EcoLux Designs ",
        starting: "28.02.2025.",
        RSVP: "234566",
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
                `A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.`,
                `Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.`,
                `The event will also include workshops on sustainable fashion and personal styling sessions.`,
                `Visitors will immerse themselves in a unique shopping experience, discovering the intersection of luxury and eco-conscious fashion. This pop-up is perfect for those looking to elevate their wardrobe while supporting sustainable and ethical design practices.`,
              ],
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              space: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              startingDate: "28.02.2025.",
              endingDate: "15.4.2025.",
              expectedPoint: {
                title: "What to Expect:",
                ulPoints: [
                  `Exclusive Collection: Shoppers will have the first opportunity to explore and purchase limited-edition, high-end clothing and accessories. Each piece is thoughtfully crafted from organic cotton, recycled fabrics, and other eco-conscious materials. The collection combines timeless elegance with modern trends, offering a perfect blend of luxury and environmental responsibility.`,
                  `Workshops & Events: In addition to shopping, attendees can participate in a series of workshops focused on sustainable fashion. Learn from industry experts about eco-friendly design practices, circular fashion, and how to build a more sustainable wardrobe. Personal styling sessions will also be available, allowing guests to get tailored advice on how to incorporate sustainable pieces into their everyday looks.`,
                  `Interactive Displays: The pop-up will feature interactive displays showcasing the journey of each garment—from the sourcing of raw materials to the sustainable manufacturing processes. Attendees can gain insight into the environmental impact of their fashion choices and discover ways to make more conscious decisions.`,
                  `Eco-Friendly Environment: The venue itself will reflect the brand’s commitment to sustainability, with eco-friendly decor, recycled packaging for purchases, and zero-waste event practices.`,
                ],
              },
              overviewImage: eventMainImage,
              otherPoints2: {
                title: "Why Attend:",
                points: [
                  `This is more than just a shopping event—it’s a celebration of sustainable fashion and an opportunity to connect with like-minded individuals who value ethical practices and luxury design. Whether you're a fashion enthusiast, an eco-conscious shopper, or just curious about sustainable fashion, this pop-up store offers something for everyone.`,
                ],
              },
            },
          },
        },
        {
          label: "Reviews",
          props: null,
        },
      ],
    },
    {
      id: 6,
      type: "event",
      owned: false,
      slides: [eventMain, eventMain2, eventMain3],
      profilePic: eventActivityImage,
      profileName: "Ecolux Chic Pop-Up",
      category: "Sustainable Fashion",
      details: {
        by: "EcoLux Designs ",
        starting: "28.02.2025.",
        RSVP: "234566",
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
                `A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.`,
                `Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.`,
                `The event will also include workshops on sustainable fashion and personal styling sessions.`,
                `Visitors will immerse themselves in a unique shopping experience, discovering the intersection of luxury and eco-conscious fashion. This pop-up is perfect for those looking to elevate their wardrobe while supporting sustainable and ethical design practices.`,
              ],
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              space: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              startingDate: "28.02.2025.",
              endingDate: "15.4.2025.",
              expectedPoint: {
                title: "What to Expect:",
                ulPoints: [
                  `Exclusive Collection: Shoppers will have the first opportunity to explore and purchase limited-edition, high-end clothing and accessories. Each piece is thoughtfully crafted from organic cotton, recycled fabrics, and other eco-conscious materials. The collection combines timeless elegance with modern trends, offering a perfect blend of luxury and environmental responsibility.`,
                  `Workshops & Events: In addition to shopping, attendees can participate in a series of workshops focused on sustainable fashion. Learn from industry experts about eco-friendly design practices, circular fashion, and how to build a more sustainable wardrobe. Personal styling sessions will also be available, allowing guests to get tailored advice on how to incorporate sustainable pieces into their everyday looks.`,
                  `Interactive Displays: The pop-up will feature interactive displays showcasing the journey of each garment—from the sourcing of raw materials to the sustainable manufacturing processes. Attendees can gain insight into the environmental impact of their fashion choices and discover ways to make more conscious decisions.`,
                  `Eco-Friendly Environment: The venue itself will reflect the brand’s commitment to sustainability, with eco-friendly decor, recycled packaging for purchases, and zero-waste event practices.`,
                ],
              },
              overviewImage: eventMainImage,
              otherPoints2: {
                title: "Why Attend:",
                points: [
                  `This is more than just a shopping event—it’s a celebration of sustainable fashion and an opportunity to connect with like-minded individuals who value ethical practices and luxury design. Whether you're a fashion enthusiast, an eco-conscious shopper, or just curious about sustainable fashion, this pop-up store offers something for everyone.`,
                ],
              },
            },
          },
        },
        {
          label: "Reviews",
          props: null,
        },
      ],
    },
    {
      id: 7,
      type: "event",
      owned: false,
      slides: [eventMain, eventMain2, eventMain3],
      profilePic: eventActivityImage,
      profileName: "Ecolux Chic Pop-Up",
      category: "Sustainable Fashion",
      details: {
        by: "EcoLux Designs ",
        starting: "28.02.2025.",
        RSVP: "234566",
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
                `A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.`,
                `Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.`,
                `The event will also include workshops on sustainable fashion and personal styling sessions.`,
                `Visitors will immerse themselves in a unique shopping experience, discovering the intersection of luxury and eco-conscious fashion. This pop-up is perfect for those looking to elevate their wardrobe while supporting sustainable and ethical design practices.`,
              ],
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              space: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              startingDate: "28.02.2025.",
              endingDate: "15.4.2025.",
              expectedPoint: {
                title: "What to Expect:",
                ulPoints: [
                  `Exclusive Collection: Shoppers will have the first opportunity to explore and purchase limited-edition, high-end clothing and accessories. Each piece is thoughtfully crafted from organic cotton, recycled fabrics, and other eco-conscious materials. The collection combines timeless elegance with modern trends, offering a perfect blend of luxury and environmental responsibility.`,
                  `Workshops & Events: In addition to shopping, attendees can participate in a series of workshops focused on sustainable fashion. Learn from industry experts about eco-friendly design practices, circular fashion, and how to build a more sustainable wardrobe. Personal styling sessions will also be available, allowing guests to get tailored advice on how to incorporate sustainable pieces into their everyday looks.`,
                  `Interactive Displays: The pop-up will feature interactive displays showcasing the journey of each garment—from the sourcing of raw materials to the sustainable manufacturing processes. Attendees can gain insight into the environmental impact of their fashion choices and discover ways to make more conscious decisions.`,
                  `Eco-Friendly Environment: The venue itself will reflect the brand’s commitment to sustainability, with eco-friendly decor, recycled packaging for purchases, and zero-waste event practices.`,
                ],
              },
              overviewImage: eventMainImage,
              otherPoints2: {
                title: "Why Attend:",
                points: [
                  `This is more than just a shopping event—it’s a celebration of sustainable fashion and an opportunity to connect with like-minded individuals who value ethical practices and luxury design. Whether you're a fashion enthusiast, an eco-conscious shopper, or just curious about sustainable fashion, this pop-up store offers something for everyone.`,
                ],
              },
            },
          },
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
  name: "event",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    editEvent: (state, action) => {
      const { id, updatedEvent } = action.payload;
      const index = state.events.findIndex((event) => event.id === id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...updatedEvent };
      }
    },
  },
});

export const { addEvent, editEvent } = slice.actions;

export default slice.reducer;
