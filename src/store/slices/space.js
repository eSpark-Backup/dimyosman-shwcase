import { createSlice } from "@reduxjs/toolkit";
import {
  spaceActivityImage,
  spaceMain,
  spaceMain2,
  spaceMain3,
} from "../../assets";
import { spaceFeatures } from "../../constant";

const initialState = {
  spaces: [
    {
      id: 5,
      type: "space",
      owned: true,
      slides: [spaceMain, spaceMain2, spaceMain3],
      profilePic: spaceActivityImage,
      profileName: "Urban Pop-Up Studio 3B",
      category: "Real Estate",
      details: {
        by: "Urban Pop-Up Pavilion",
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
                `Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.`,
                `With natural lighting, flexible space, Wi-Fi, and security services, it’s perfect for brands looking to host a smaller, impactful event.`,
              ],
              feature: {
                title: "Ammenities & Features:",
                points: spaceFeatures,
              },
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              space: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              startingDate: "28.02.2025.",
              endingDate: "15.4.2025.",
              expectedPoint: {
                title: "What to Expect:",
                ulPoints: [
                  `              Adaptable Space:  The flexible layout of Urban Pop-Up Studio 3B allows for easy customization, ensuring the space can be tailored to suit a variety of events, from retail showcases to creative exhibits.`,
                  `Modern Amenities: The studio is equipped with natural lighting, high-speed Wi-Fi, and on-site security to support seamless, professional event execution. A compact storage area is also available for inventory or event materials.
`,
                  `Prime Location: Situated in the vibrant Williamsburg district of Brooklyn, the studio is easily accessible via public transportation, making it an ideal venue for local and visiting event-goers alike.
`,
                ],
              },
              overviewImage: spaceMain3,
              otherPoints2: {
                title: "Why Attend:",
                points: [
                  `Urban Pop-Up Studio 3B offers the perfect combination of size, functionality, and location for brands looking to create a memorable event in a smaller, intimate setting. Whether you're hosting a pop-up shop, an art exhibit, or a product launch, this studio provides everything needed for a successful, impactful experience.`,
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
          label: "Teenacy",
          props: {
            teenacy: [
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
              {
                tenat: "EcoLux Designs",
                event: "Ecolux Chic Pop-Up",
                by: "Emily Thompson",
                message:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                starting: "28.02.2025.",
                ending: "15.04.2025.",
                leaseAmount: 2000,
              },
            ],
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
      type: "space",
      owned: false,
      slides: [spaceMain, spaceMain2, spaceMain3],
      profilePic: spaceActivityImage,
      profileName: "Urban Pop-Up Studio 3B",
      category: "Real Estate",
      details: {
        by: "Urban Pop-Up Pavilion",
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
                `Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.`,
                `With natural lighting, flexible space, Wi-Fi, and security services, it’s perfect for brands looking to host a smaller, impactful event.`,
              ],
              feature: {
                title: "Ammenities & Features:",
                points: spaceFeatures,
              },
              location: "123 Williamsburg Ave, Brooklyn, NY 11211",
              space: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              startingDate: "28.02.2025.",
              endingDate: "15.4.2025.",
              expectedPoint: {
                title: "What to Expect:",
                ulPoints: [
                  `              Adaptable Space:  The flexible layout of Urban Pop-Up Studio 3B allows for easy customization, ensuring the space can be tailored to suit a variety of events, from retail showcases to creative exhibits.`,
                  `Modern Amenities: The studio is equipped with natural lighting, high-speed Wi-Fi, and on-site security to support seamless, professional event execution. A compact storage area is also available for inventory or event materials.
`,
                  `Prime Location: Situated in the vibrant Williamsburg district of Brooklyn, the studio is easily accessible via public transportation, making it an ideal venue for local and visiting event-goers alike.
`,
                ],
              },
              overviewImage: spaceMain3,
              otherPoints2: {
                title: "Why Attend:",
                points: [
                  `Urban Pop-Up Studio 3B offers the perfect combination of size, functionality, and location for brands looking to create a memorable event in a smaller, intimate setting. Whether you're hosting a pop-up shop, an art exhibit, or a product launch, this studio provides everything needed for a successful, impactful experience.`,
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
  name: "space",
  initialState,
  reducers: {
    addSpace: (state, action) => {
      state.spaces.push(action.payload);
    },
    editSpace: (state, action) => {
      const { id, updatedSpace } = action.payload;
      const index = state.spaces.findIndex((space) => space.id === id);
      if (index !== -1) {
        state.spaces[index] = { ...state.spaces[index], ...updatedSpace };
      }
    },
  },
});

export const { addSpace, editSpace } = slice.actions;

export default slice.reducer;
