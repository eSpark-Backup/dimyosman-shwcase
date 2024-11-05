import {
  activity,
  brand,
  event,
  space,
  profile,
  calendar,
  message,
  settings,
  activityHover,
  brandHover,
  eventHover,
  spaceHover,
  profileHover,
  calendarHover,
  messageHover,
  settingsHover,
  arrow,
  wifi,
  accessibility,
  sun,
  storage,
  security,
  eventMain,
  eventUserImage,
  eventActivityImage,
  eventMain2,
  eventMain3,
  spaceUserImage,
  spaceActivityImage,
  spaceMain,
  spaceMain2,
  spaceMain3,
  brandUserImage,
  brandMain,
  brandActivityImage,
  reviewer,
  brandMain2,
  spaceProfile,
  eventMainImage,
} from "../assets";
import {
  followingBrandColumns,
  likedBrandColumns,
  myBrandColumns,
} from "../columns/brand";

export const sidebarRoutes = [
  {
    icon: activity,
    hoverIcon: activityHover,
    title: "Activity",
    link: "/activity",
  },
  {
    icon: brand,
    hoverIcon: brandHover,
    title: "Brands",
    link: "/brand",
  },
  {
    icon: event,
    hoverIcon: eventHover,
    title: "Events",
    link: "/event",
  },
  {
    icon: space,
    hoverIcon: spaceHover,
    title: "Spaces",
    link: "/space",
  },
  {
    icon: profile,
    hoverIcon: profileHover,
    title: "Profile",
    link: "/profile",
  },
  {
    icon: calendar,
    hoverIcon: calendarHover,
    title: "Calendar",
    link: "/calendar",
  },
  {
    icon: message,
    hoverIcon: messageHover,
    title: "Messages",
    link: "/message",
  },
  {
    icon: settings,
    hoverIcon: settingsHover,
    title: "Settings",
    link: "/settings",
  },
];

export const getSmallSidebar = (currentLink) => {
  const id = currentLink.split("/")[2];
  const smallSidebarLink = ["/message", "/profile", `/brand/${id}`];
  return smallSidebarLink.includes(currentLink);
};


export const spaceFeatures = [
  {
    icon: arrow,
    description: "Flexible Layout"
  },
  {
    icon: wifi,
    description: "WI-FI"
  },
  {
    icon: accessibility,
    description: "Accessible Location"
  },
  {
    icon: sun,
    description: "Natural Lighting"
  },
  {
    icon: storage,
    description: "Compact Storage Area"
  },
  {
    icon: security,
    description: "On-Site Security"
  },
]


export const activityItems = [
  {
    profileId: 1,
    activity: "event",
    eventId: 3,
    userName: "EcoLux Designs",
    activityName: "Ecolux Chic Pop-Up",
    activityMaker: "Sustainable Fashion",
    content: [
      "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.",
      "Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.",
      "The event will also include workshops on sustainable fashion and personal styling sessions."
    ],
    activityLocation: "Urban Pop-Up Studio 3B",
    activityLocation2: "Urban Pop-Up Pavilion",
    activityLocationId: 6,
    activityAddress: "123 Williamsburg Ave, Brooklyn, NY 11211",
    value: "28.02.2025.",
    deadline: "until 15.4.2025.",
    userImage: eventUserImage,
    activityImage: eventActivityImage,
    userRole: "brand",
    slides: [eventMain, eventMain2, eventMain3],
  },
  {
    profileId: 2,
    activity: "space",
    spaceId: 6,
    userName: "Urban Pop-Up Pavilion",
    activityName: "Urban Pop-Up Studio 3B",
    activityMaker: "Urban Pop-Up Pavilion",
    content: [
      "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
      "With natural lighting, flexible space, Wi-Fi, and security services, it’s perfect for brands looking to host a smaller, impactful event.",
    ],
    activityLocation: "Urban Pop-Up Pavilion",
    activityAddress: "123 Williamsburg Ave, Brooklyn, NY 11211",
    value: "$200/day",
    deadline: "minimum lease: 7 days",
    userImage: spaceUserImage,
    activityImage: spaceActivityImage,
    features: spaceFeatures, // Retained the features property
    userRole: "brand",
    slides: [spaceMain, spaceMain2, spaceMain3],
  },
  {
    activity: "brand", // Adjusted for the new item
    brandId: 1,
    userName: "Emily Thompson",
    userImage: brandUserImage,
    mainImage: brandMain,
    activityImage: eventUserImage,
    activityName: "EcoLux Designs",
    activityMaker: "Sustainable Fashion",
    content: [
      "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials."
    ],
    userRole: "profile",
    slides: [brandMain],
  },
];

export const myBrandData = [
  {
    id: 1,
    type: "brand",
    brandName: "EcoLux Designs",
    brandImg: eventUserImage,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: 12345,
    status: "Published",
    colHeader1: "Table cell",
    colHeader2: "Table cell",
    colHeader3: "Table cell",
    colHeader4: "Table cell",
    colHeader5: "Table cell",
    colHeader6: "Table cell",
    colHeader7: "Table cell",
  },
  {
    id: 2,
    type: "brand",
    brandName: "EcoLux Designs",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: 12345,
    status: "Published",
    colHeader1: "Table cell",
    colHeader2: "Table cell",
    colHeader3: "Table cell",
    colHeader4: "Table cell",
    colHeader5: "Table cell",
    colHeader6: "Table cell",
    colHeader7: "Table cell",
  },
  {
    id: 3,
    type: "brand",
    brandName: "EcoLux Designs",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: 12345,
    status: "Draft",
    colHeader1: "Table cell",
    colHeader2: "Table cell",
    colHeader3: "Table cell",
    colHeader4: "Table cell",
    colHeader5: "Table cell",
    colHeader6: "Table cell",
    colHeader7: "Table cell",
  },
  {
    id: 4,
    type: "brand",
    brandName: "EcoLux Designs",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: 12345,
    status: "Archived",
    colHeader1: "Table cell",
    colHeader2: "Table cell",
    colHeader3: "Table cell",
    colHeader4: "Table cell",
    colHeader5: "Table cell",
    colHeader6: "Table cell",
    colHeader7: "Table cell",
  },
];

export const followingBrandData = [
  {
    id: 1,
    type: "brand",
    brandName: "Brand Name 4",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: 2456,
    followDate: "dd.mm.yyyy.",
  },
  {
    id: 2,
    type: "brand",
    brandName: "Brand Name 5",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: "---",
    followDate: "dd.mm.yyyy.",
  },
  {
    id: 3,
    type: "brand",
    brandName: "Brand Name 6",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: "---",
    followDate: "dd.mm.yyyy.",
  },
  {
    id: 4,
    type: "brand",
    brandName: "Brand Name 7",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: 46582,
    followDate: "dd.mm.yyyy.",
  },
];

export const likedBrandData = [
  {
    id: 1,
    type: "brand",
    brandName: "Brand Name 8",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: 2456,
    savedDate: "dd.mm.yyyy.",
  },
  {
    id: 2,
    type: "brand",
    brandName: "Brand Name 9",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: "---",
    savedDate: "dd.mm.yyyy.",
  },
  {
    id: 3,
    type: "brand",
    brandName: "Brand Name 10",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: "---",
    savedDate: "dd.mm.yyyy.",
  },
  {
    id: 4,
    type: "brand",
    brandName: "Brand Name 11",
    brandImg: null,
    brandCategory: "Sustainable Fashion",
    events: 1234,
    followers: 46582,
    savedDate: "dd.mm.yyyy.",
  },
];

export const brandTableData = (gotoDetail, handleAction) => [
  {
    data: myBrandData,
    column: myBrandColumns(gotoDetail, (item) => handleAction(item, "edit")),
  },
  {
    data: followingBrandData,
    column: followingBrandColumns(gotoDetail, (item) =>
      handleAction(item, "unfollow")
    ),
  },
  {
    data: likedBrandData,
    column: likedBrandColumns(gotoDetail, (item) =>
      handleAction(item, "remove")
    ),
  },
];

export const profiles = [
  {
    id: 1,
    type: "brand",
    owned: true,
    slides: [brandMain, eventMain2, eventMain3],
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
        props: {
          events: [
            {
              eventId: 3,
              eventimage: eventMain,
              eventName: "Ecolux Chic Pop-Up",
              eventCategory: "Sustainable Fashion",
              eventMessage:
                "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
              by: "EcoLux Designs",
              startingDate: "28.02.2025.",
              rsvp: 234566,
            },
            {
              eventId: 3,
              eventimage: eventMain,
              eventName: "Ecolux Chic Pop-Up",
              eventCategory: "Sustainable Fashion",
              eventMessage:
                "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
              by: "EcoLux Designs",
              startingDate: "28.02.2025.",
              rsvp: 234566,
            },
            {
              eventId: 3,
              eventimage: eventMain,
              eventName: "Ecolux Chic Pop-Up",
              eventCategory: "Sustainable Fashion",
              eventMessage:
                "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
              by: "EcoLux Designs",
              startingDate: "28.02.2025.",
              rsvp: 234566,
            },
            {
              eventId: 3,
              eventimage: eventMain,
              eventName: "Ecolux Chic Pop-Up",
              eventCategory: "Sustainable Fashion",
              eventMessage:
                "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
              by: "EcoLux Designs",
              startingDate: "28.02.2025.",
              rsvp: 234566,
            },
            {
              eventId: 3,
              eventimage: eventMain,
              eventName: "Ecolux Chic Pop-Up",
              eventCategory: "Sustainable Fashion",
              eventMessage:
                "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
              by: "EcoLux Designs",
              startingDate: "28.02.2025.",
              rsvp: 234566,
            },
            {
              eventId: 3,
              eventimage: eventMain,
              eventName: "Ecolux Chic Pop-Up",
              eventCategory: "Sustainable Fashion",
              eventMessage:
                "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
              by: "EcoLux Designs",
              startingDate: "28.02.2025.",
              rsvp: 234566,
            },
          ],
        },
      },
      {
        label: "Stats",
        props: null,
      },
      {
        label: "Reviews",
        props: {
          reviews: [
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
          ],
        },
      },
    ],
  },
  {
    id: 2,
    type: "brand",
    owned: false,
    slides: [brandMain2, eventMain2, eventMain3],
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
        props: {
          spaces: [
            {
              spaceImage: spaceProfile,
              spaceName: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              spaceMessage:
                "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches. ",
              leaseFrom: "$200/day",
              minimumLease: "7 days",
            },
            {
              spaceImage: spaceProfile,
              spaceName: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              spaceMessage:
                "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches. ",
              leaseFrom: "$200/day",
              minimumLease: "7 days",
            },
            {
              spaceImage: spaceProfile,
              spaceName: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              spaceMessage:
                "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches. ",
              leaseFrom: "$200/day",
              minimumLease: "7 days",
            },
            {
              spaceImage: spaceProfile,
              spaceName: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              spaceMessage:
                "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches. ",
              leaseFrom: "$200/day",
              minimumLease: "7 days",
            },
            {
              spaceImage: spaceProfile,
              spaceName: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              spaceMessage:
                "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches. ",
              leaseFrom: "$200/day",
              minimumLease: "7 days",
            },
            {
              spaceImage: spaceProfile,
              spaceName: "Urban Pop-Up Studio 3B",
              spaceCategory: "Urban Pop-Up Pavilion",
              spaceMessage:
                "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches. ",
              leaseFrom: "$200/day",
              minimumLease: "7 days",
            },
          ],
        },
      },
      {
        label: "Reviews",
        props: {
          reviews: [
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
          ],
        },
      },
    ],
  },
  {
    id: 3,
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
        props: {
          reviews: [
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
          ],
        },
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
        props: {
          reviews: [
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
          ],
        },
      },
    ],
  },
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
              points: spaceFeatures
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
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
            {
              tenat: "EcoLux Designs",
              event: "Ecolux Chic Pop-Up",
              by: "Emily Thompson",
              message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
              starting: "28.02.2025.",
              ending: "15.04.2025.",
              leaseAmount: 2000
            },
          ],
        },
      },
      {
        label: "Reviews",
        props: {
          reviews: [
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
          ],
        },
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
              points: spaceFeatures
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
        props: {
          reviews: [
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
            {
              reviewerPRofile: reviewer,
              reviewerName: "Sophia Ramirez",
              profileName: "EcoLux Designs",
              rating: 5,
              message: `"The EcoLux Chic Pop-Up was an incredible experience! The
                collection was stunning - luxurious, yet sustainable, with such
                attention to detail in every piece. I loved learning about the
                eco-friendly materials used and how each item was crafted with
                sustainability in mind. The workshops were a great touch, and I
                came away with a ton of knowledge on how to build a more
                conscious wardrobe. Plus, the personal styling session was so
                helpful! Overall, this event exceeded my expectations in every
                way. Highly recommend!"`,
            },
          ],
        },
      },
    ],
  },
];



export const events = [
  {
    id: 1,
    eventimage: eventMain,
    eventName: "Ecolux Chic Pop-Up",
    eventCategory: "Sustainable Fashion",
    eventMessage:
      "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
    by: "EcoLux Designs",
    startingDate: "28.02.2025.",
    rsvp: 234566,
  },
  {
    id: 2,
    eventimage: eventMain,
    eventName: "Ecolux Chic Pop-Up",
    eventCategory: "Sustainable Fashion",
    eventMessage:
      "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
    by: "EcoLux Designs",
    startingDate: "28.02.2025.",
    rsvp: 234566,
  },
  {
    id: 3,
    eventimage: eventMain,
    eventName: "Ecolux Chic Pop-Up",
    eventCategory: "Sustainable Fashion",
    eventMessage:
      "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
    by: "EcoLux Designs",
    startingDate: "28.02.2025.",
    rsvp: 234566,
  },
  {
    id: 4,
    eventimage: eventMain,
    eventName: "Ecolux Chic Pop-Up",
    eventCategory: "Sustainable Fashion",
    eventMessage:
      "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
    by: "EcoLux Designs",
    startingDate: "28.02.2025.",
    rsvp: 234566,
  },
  {
    id: 5,
    eventimage: eventMain,
    eventName: "Ecolux Chic Pop-Up",
    eventCategory: "Sustainable Fashion",
    eventMessage:
      "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
    by: "EcoLux Designs",
    startingDate: "28.02.2025.",
    rsvp: 234566,
  },
  {
    id: 6,
    eventimage: eventMain,
    eventName: "Ecolux Chic Pop-Up",
    eventCategory: "Sustainable Fashion",
    eventMessage:
      "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion",
    by: "EcoLux Designs",
    startingDate: "28.02.2025.",
    rsvp: 234566,
  },
]



export const eventReviews = [
  {
    reviewerPRofile: reviewer,
    reviewerName: "Sophia Ramirez",
    profileName: "EcoLux Chic Pop-Up",
    rating: 5,
    message: `"The EcoLux Chic Pop-Up was an incredible experience! The
      collection was stunning - luxurious, yet sustainable, with such
      attention to detail in every piece. I loved learning about the
      eco-friendly materials used and how each item was crafted with
      sustainability in mind. The workshops were a great touch, and I
      came away with a ton of knowledge on how to build a more
      conscious wardrobe. Plus, the personal styling session was so
      helpful! Overall, this event exceeded my expectations in every
      way. Highly recommend!"`,
    approved: false,
  },
  {
    reviewerPRofile: reviewer,
    reviewerName: "Sophia Ramirez",
    profileName: "EcoLux Chic Pop-Up",
    rating: 5,
    message: `"The EcoLux Chic Pop-Up was an incredible experience! The
      collection was stunning - luxurious, yet sustainable, with such
      attention to detail in every piece. I loved learning about the
      eco-friendly materials used and how each item was crafted with
      sustainability in mind. The workshops were a great touch, and I
      came away with a ton of knowledge on how to build a more
      conscious wardrobe. Plus, the personal styling session was so
      helpful! Overall, this event exceeded my expectations in every
      way. Highly recommend!"`,
    approved: false,

  },
  {
    reviewerPRofile: reviewer,
    reviewerName: "Sophia Ramirez",
    profileName: "EcoLux Chic Pop-Up",
    rating: 5,
    message: `"The EcoLux Chic Pop-Up was an incredible experience! The
      collection was stunning - luxurious, yet sustainable, with such
      attention to detail in every piece. I loved learning about the
      eco-friendly materials used and how each item was crafted with
      sustainability in mind. The workshops were a great touch, and I
      came away with a ton of knowledge on how to build a more
      conscious wardrobe. Plus, the personal styling session was so
      helpful! Overall, this event exceeded my expectations in every
      way. Highly recommend!"`,
    approved: false,
  },
]