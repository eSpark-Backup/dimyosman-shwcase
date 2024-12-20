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
  profileBanner,
  profileBanner2,
  profileImage2,
  brandCardImage,
  spaceImage,
  profileAbout,
  fbIcon,
  telegramIcon,
  twitterIcon,
  whatsAppIcon,
  emailIcon,
  shareIcon,
  accountIcon,
} from "../assets";
import {
  followingBrandColumns,
  likedBrandColumns,
  myBrandColumns,
} from "../columns/brand";
import {
  likedEventColumns,
  myEventsColumns,
  rsvpEventColumns,
} from "../columns/event";
import {
  leasingSpaceColumns,
  likedSpaceColumns,
  mySpaceColumns,
} from "../columns/space";

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
  const smallSidebarLink = [
    "/message",
    "/profile",
    `/brand/${id}`,
    `/brand/${id}/edit`,
    "/new-brand",
    `/event/${id}`,
    `/event/${id}/edit`,
    "/new-event",
    `/space/${id}`,
    "/new-space",
    `/space/${id}/edit`,
  ];
  return smallSidebarLink.includes(currentLink);
};

export const spaceFeatures = [
  {
    icon: arrow,
    description: "Flexible Layout",
  },
  {
    icon: wifi,
    description: "WI-FI",
  },
  {
    icon: accessibility,
    description: "Accessible Location",
  },
  {
    icon: sun,
    description: "Natural Lighting",
  },
  {
    icon: storage,
    description: "Compact Storage Area",
  },
  {
    icon: security,
    description: "On-Site Security",
  },
];

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
      "The event will also include workshops on sustainable fashion and personal styling sessions.",
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
      "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
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

const myEventData = [
  {
    id: 1,
    type: "event",
    eventName: "Ecolux Chic Pop-Up",
    eventImg: eventActivityImage,
    brand: "Ecolux Designs",
    brandUrl: "-",
    rsvp: 123,
    startDate: "dd.mm.yyyy.",
    status: "Published",
    hostedIn: "Urban Pop-Up Studio 3B",
    spaceUrl: "-",
    action: "Cancel",
  },
  {
    id: 2,
    type: "event",
    eventName: "Event Name 1",
    eventImg: null,
    brand: "Ecolux Designs",
    brandUrl: "-",
    rsvp: 124,
    startDate: "dd.mm.yyyy.",
    status: "Draft",
    hostedIn: "Space 1",
    spaceUrl: null,
    action: "Verify Att",
  },
  {
    id: 3,
    type: "event",
    eventName: "Event Name 2",
    eventImg: null,
    brand: "Brand Name 2",
    brandUrl: null,
    rsvp: 12,
    startDate: "dd.mm.yyyy.",
    status: "Draft",
    hostedIn: "Space 2",
    spaceUrl: null,
    action: "Verify Att",
  },
  {
    id: 4,
    type: "event",
    eventName: "Event Name 3",
    eventImg: null,
    brand: "Brand Name 3",
    brandUrl: null,
    rsvp: 1234,
    startDate: "dd.mm.yyyy.",
    status: "Archived",
    hostedIn: "Space 3",
    spaceUrl: null,
    action: "Review",
  },
];

export const rsvcEventData = [
  {
    id: 1,
    type: "event",
    eventName: "Ecolux Chic Pop-Up",
    eventImg: eventActivityImage,
    brand: "Ecolux Designs",
    brandUrl: "-",
    rsvp: 123,
    startDate: "dd.mm.yyyy.",
    status: "Upcoming",
    hostedIn: "Urban Pop-Up Studio 3B",
    liveSpace: true,
    spaceUrl: "-",
    action: "Cancel",
  },
  {
    id: 2,
    type: "event",
    eventName: "Event Name 4",
    eventImg: null,
    brand: "Ecolux Designs",
    brandUrl: "-",
    rsvp: 124,
    startDate: "dd.mm.yyyy.",
    status: "Ongoing",
    hostedIn: "Space 1",
    spaceUrl: null,
    action: "Verify Att",
  },
  {
    id: 3,
    type: "event",
    eventName: "Event Name 5",
    eventImg: null,
    brand: "Brand Name 2",
    brandUrl: null,
    rsvp: 12,
    startDate: "dd.mm.yyyy.",
    status: "Ongoing",
    hostedIn: "Space 2",
    spaceUrl: null,
    action: "Verify Att",
  },
  {
    id: 4,
    type: "event",
    eventName: "Event Name 6",
    eventImg: null,
    brand: "Brand Name 3",
    brandUrl: null,
    rsvp: 1234,
    startDate: "dd.mm.yyyy.",
    status: "Ended",
    hostedIn: "Space 3",
    spaceUrl: null,
    action: "Review",
  },
];

export const likedEventData = [
  {
    id: 1,
    type: "event",
    eventName: "Ecolux Chic Pop-Up",
    eventImg: eventActivityImage,
    brand: "Ecolux Designs",
    brandUrl: "-",
    category: "Sustainable Fashion",
    startDate: "dd.mm.yyyy.",
    status: "Upcoming",
    hostedIn: "Urban Pop-Up Studio 3B",
    spaceUrl: "-",
    action: "Cancel",
  },
  {
    id: 2,
    type: "event",
    eventName: "Event Name 7",
    eventImg: null,
    brand: "Ecolux Designs",
    brandUrl: "-",
    category: "Sustainable Fashion",
    startDate: "dd.mm.yyyy.",
    status: "Ongoing",
    hostedIn: "Space 1",
    spaceUrl: null,
    action: "Verify Att",
  },
  {
    id: 3,
    type: "event",
    eventName: "Event Name 8",
    eventImg: null,
    brand: "Brand Name 2",
    brandUrl: null,
    category: "Real Estate",
    startDate: "dd.mm.yyyy.",
    status: "Ongoing",
    hostedIn: "Space 2",
    spaceUrl: null,
    action: "Verify Att",
  },
  {
    id: 4,
    type: "event",
    eventName: "Event Name 9",
    eventImg: null,
    brand: "Brand Name 3",
    brandUrl: null,
    category: "1234",
    startDate: "dd.mm.yyyy.",
    status: "Ended",
    hostedIn: "Space 3",
    spaceUrl: null,
    action: "Review",
  },
];

const mySpaceData = [
  {
    id: 1,
    type: "space",
    eventName: "Urban Pop-Up Studio 3B",
    eventImg: spaceActivityImage,
    price: "$1000",
    term: "Monthly",
    brand: "Urban Pop-Up Pavilion",
    brandUrl: "-",
    action: "Edit"
  },
];

export const leaseSpaceData = [
  {
    id: 1,
    type: "space",
    eventName: "Urban Pop-Up Studio 3B",
    eventImg: spaceActivityImage,
    currently: "Leasing",
    price: "$1000",
    term: "Monthly",
    event: "Ecolux Chic Pop-Up",
    brand: "Urban Pop-Up Pavilion",
    eventUrl: "-",
    brandUrl: "-",
    action: "Details",
    colHeader1: "Table cell",
    colHeader2: "Table cell",
    colHeader3: "Table cell",
    colHeader4: "Table cell",
    colHeader5: "Table cell",
    colHeader6: "Table cell",
  },
  {
    id: 2,
    type: "space",
    eventName: "Space Name 1",
    eventImg: null,
    currently: "Pending Sign",
    price: "$200",
    term: "Weekly",
    event: "---",
    brand: "Brand 1",
    eventUrl: null,
    brandUrl: null,
    action: "Sign",
    colHeader1: "Table cell",
    colHeader2: "Table cell",
    colHeader3: "Table cell",
    colHeader4: "Table cell",
    colHeader5: "Table cell",
    colHeader6: "Table cell",
  },
  {
    id: 3,
    type: "space",
    eventName: "Space Name 2",
    eventImg: null,
    currently: "Pending Pay",
    price: "$100",
    term: "Daily",
    event: "---",
    brand: "Brand 2",
    eventUrl: null,
    brandUrl: null,
    action: "Verify Pay 1/2",
    colHeader1: "Table cell",
    colHeader2: "Table cell",
    colHeader3: "Table cell",
    colHeader4: "Table cell",
    colHeader5: "Table cell",
    colHeader6: "Table cell",
  },
  {
    id: 4,
    type: "space",
    eventName: "Space Name 3",
    eventImg: null,
    currently: "Lease Ended",
    price: "$4000",
    term: "Monthly",
    event: "Event 3",
    brand: "Brand 3",
    eventUrl: null,
    brandUrl: null,
    action: "Review",
    colHeader1: "Table cell",
    colHeader2: "Table cell",
    colHeader3: "Table cell",
    colHeader4: "Table cell",
    colHeader5: "Table cell",
    colHeader6: "Table cell",
  },
];

export const likedSpaceData = [
  {
    id: 1,
    type: "space",
    eventName: "Urban Pop-Up Studio 3B",
    eventImg: spaceActivityImage,
    brand: "Urban Pop-Up Pavilion",
    brandUrl: "-",
    price: "$1000",
    term: "Monthly",
    status: "Leasing",
  },
  {
    id: 2,
    type: "space",
    eventName: "Space Name 1",
    eventImg: null,
    brand: "Brand 1",
    brandUrl: null,
    price: "$200",
    term: "Weekly",
    status: "Inquired",
  },
  {
    id: 3,
    type: "space",
    eventName: "Space Name 2",
    eventImg: null,
    brand: "Brand 2",
    brandUrl: null,
    price: "$100",
    term: "Daily",
    status: "Talking",
  },
  {
    id: 4,
    type: "space",
    eventName: "Space Name 3",
    eventImg: null,
    brand: "Brand 3",
    brandUrl: null,
    price: "$4000",
    term: "Monthly",
    status: "---",
  },
];

export const brandTableData = (gotoDetail, handleAction, myBrandData) => [
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

export const eventTableData = (gotoDetail, handleAction, myEventData, gotoBrand, gotoSpace) => [
  {
    data: myEventData,
    column: myEventsColumns(gotoDetail, (item) => handleAction(item, "edit"), gotoBrand, gotoSpace),
  },
  {
    data: rsvcEventData,
    column: rsvpEventColumns(gotoDetail, (item) =>
      handleAction(item, item?.action)
    ),
  },
  {
    data: likedEventData,
    column: likedEventColumns(gotoDetail, (item) =>
      handleAction(item, "remove")
    ),
  },
];
export const spaceTableData = (gotoDetail, handleAction, mySpaceData,gotoBrand) => [
  {
    data: mySpaceData,
    column: mySpaceColumns(gotoDetail, (item) => handleAction(item, "edit"), gotoBrand),
  },
  {
    data: leaseSpaceData,
    column: leasingSpaceColumns(gotoDetail, (item) =>
      handleAction(item, item?.action)
    ),
  },
  {
    data: likedSpaceData,
    column: likedSpaceColumns(gotoDetail, (item) =>
      handleAction(item, "remove")
    ),
  },
];
export const reviews = [
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


export const profileStats = [
  {
    name: "Brands:",
    value: 1234
  },
  {
    name: "Events:",
    value: 1234
  },
  {
    name: "Spaces:",
    value: 1234
  },
  {
    name: "Member since:",
    value: "mm.yyyy."
  }
]



export const profileAboutSection = [
  {
    type: "heading",
    content: "A Passion for Sustainable Fashion"
  },
  {
    type: "paragraph",
    content: "Hi, I'm Emily Thompson, founder and designer at EcoLux Designs. For as long as I can remember, I've been passionate about creating beautiful clothing that doesn't come at the expense of our planet. My goal has always been to merge the world of luxury fashion with sustainable practices, offering high-end pieces that not only look incredible but are also made with care for the environment."
  },
  {
    type: "breaker"
  },
  {
    type: "paragraph",
    content: "At EcoLux Designs, I work with organic fabrics and recycled materials to ensure every garment is as eco-friendly as it is stylish. I believe that fashion can be both timeless and responsible, and my collections reflect that balance. From the design process to production, I’m committed to reducing waste and promoting ethical practices in every step."
  },
  {
    type: "image",
    content: brandMain
  },
  {
    type: "heading",
    content: "Leading the Movement Toward Eco-Conscious Fashion"
  },
  {
    type: "paragraph",
    content: "Sustainability isn’t just a trend for me—it’s at the core of everything I do. My hope is to inspire others to make more conscious choices in their wardrobes while still enjoying the luxury and elegance that fashion can bring. I love collaborating with like-minded individuals and brands, and I’m always exploring new ways to push the boundaries of what sustainable fashion can achieve."
  }
]


export const brandCardContent = [
  {
    profileImage: eventUserImage,
    brandName: "EcoLux Designs",
    brandCategory: "Sustainable Fashion",
    description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
    brandImage: brandMain
  },
  {
    profileImage: eventUserImage,
    brandName: "EcoLux Designs",
    brandCategory: "Sustainable Fashion",
    description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
    brandImage: brandMain
  },
  {
    profileImage: eventUserImage,
    brandName: "EcoLux Designs",
    brandCategory: "Sustainable Fashion",
    description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
    brandImage: brandMain
  },

]


export const profileContent = [
  {
    name: "Emily Thompson",
    bannerImage: profileBanner,
    userImage: brandUserImage,
    tabs: ["About", "Brands", "Events", "Spaces"],
    aboutSection: [
      {
        type: "heading",
        content: "A Passion for Sustainable Fashion"
      },
      {
        type: "paragraph",
        content: "Hi, I'm Emily Thompson, founder and designer at EcoLux Designs. For as long as I can remember, I've been passionate about creating beautiful clothing that doesn't come at the expense of our planet. My goal has always been to merge the world of luxury fashion with sustainable practices, offering high-end pieces that not only look incredible but are also made with care for the environment."
      },
      {
        type: "breaker"
      },
      {
        type: "paragraph",
        content: "At EcoLux Designs, I work with organic fabrics and recycled materials to ensure every garment is as eco-friendly as it is stylish. I believe that fashion can be both timeless and responsible, and my collections reflect that balance. From the design process to production, I’m committed to reducing waste and promoting ethical practices in every step."
      },
      {
        type: "image",
        content: brandMain
      },
      {
        type: "heading2",
        content: "Leading the Movement Toward Eco-Conscious Fashion"
      },
      {
        type: "paragraph",
        content: "Sustainability isn’t just a trend for me—it’s at the core of everything I do. My hope is to inspire others to make more conscious choices in their wardrobes while still enjoying the luxury and elegance that fashion can bring. I love collaborating with like-minded individuals and brands, and I’m always exploring new ways to push the boundaries of what sustainable fashion can achieve."
      }
    ],
    brandSection: [
      {
        id: 1,
        profileImage: eventUserImage,
        brandName: "EcoLux Designs",
        brandCategory: "Sustainable Fashion",
        description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
        brandImage: brandMain
      },
      {
        id: 2,
        profileImage: eventUserImage,
        brandName: "EcoLux Designs",
        brandCategory: "Sustainable Fashion",
        description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
        brandImage: brandMain
      },
      {
        id: 3,
        profileImage: eventUserImage,
        brandName: "EcoLux Designs",
        brandCategory: "Sustainable Fashion",
        description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
        brandImage: brandMain
      },

    ],
    spaceSection: [
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
    ]
  },
  {
    name: "Michael Harrison",
    bannerImage: profileBanner2,
    userImage: profileImage2,
    tabs: ["About", "Brands", "Events", "Spaces"],
    aboutSection: [
      {
        type: "heading",
        content: "Creating Spaces for Innovation and Community"
      },
      {
        type: "paragraph",
        content: "Hi, I’m Michael Harrison, founder of Urban Pop-Up Pavilion. My passion lies in transforming spaces into platforms for creativity, innovation, and community connection. I’ve always believed that a great space can do more than just house events—it can inspire new ideas, bring people together, and offer unique experiences."
      },
      {
        type: "breaker"
      },
      {
        type: "paragraph",
        content: "With Urban Pop-Up Pavilion, I wanted to create a versatile venue that could adapt to a wide range of uses, from retail pop-ups to art installations and beyond. Located in the heart of Brooklyn, our space is designed to be both functional and flexible, providing the perfect backdrop for brands, artists, and event organizers to bring their visions to life."
      },
      {
        type: "image",
        content: profileAbout
      },
      {
        type: "heading",
        content: "Leading the Movement Toward Eco-Conscious Fashion"
      },
      {
        type: "paragraph",
        content: "Sustainability isn’t just a trend for me—it’s at the core of everything I do. My hope is to inspire others to make more conscious choices in their wardrobes while still enjoying the luxury and elegance that fashion can bring. I love collaborating with like-minded individuals and brands, and I’m always exploring new ways to push the boundaries of what sustainable fashion can achieve."
      }
    ],
    brandSection: [
      {
        id: 1,
        profileImage: eventUserImage,
        brandName: "Urban Pop-Up Pavilion",
        brandCategory: "Real Estate",
        description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
        brandImage: brandCardImage
      },
      {
        id: 2,
        profileImage: eventUserImage,
        brandName: "Urban Pop-Up Pavilion",
        brandCategory: "Real Estate",
        description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
        brandImage: brandCardImage
      },
      {
        id: 3,
        profileImage: eventUserImage,
        brandName: "Urban Pop-Up Pavilion",
        brandCategory: "Real Estate",
        description: "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.",
        brandImage: brandCardImage
      },

    ],
    spaceSection: [
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
      {
        spaceName: "Urban Pop-Up Studio 3B",
        spaceAddress: "Urban Pop-Up Pavilion",
        spaceDescription: "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
        spacePrice: "$200/day",
        spaceDeadline: "miniumum lease: 7 days",
        spacePic: spaceImage
      },
    ]
  },
]


export const socialShareOptions = [
  {
    name: "Facebook",
    icon: fbIcon,
  },
  {
    name: "Telegram",
    icon: telegramIcon,
  },
  {
    name: "Twitter",
    icon: twitterIcon,
  },
  {
    name: "Whatsapp",
    icon: whatsAppIcon,
  },
  {
    name: "E-mail",
    icon: emailIcon,
  },
  {
    name: "More",
    icon: shareIcon,
  },
]



export const allMessages = [
  {
    id: 1,
    activity: "brand",
    userName: "EcoLux Designs",
    icon: eventUserImage,
    read: false,
    creator: "Michael Harrison",
    spaces: 1234,
    followers: 234566,
    saved: "789k",
    reviews: 12345,
    leases: 12345,
    rating: 5,
    messageGroups: [
      {
        id: 1,
        userName: "Urban Pop-Up Pavilion",
        activity: "brand",
        icon: spaceUserImage,
        read: true,
        messages: [
          {
            id: 1,
            userName: "Urban Pop-Up Pavilion",
            activity: "brand",
            creator: "Michael Harrison",
            icon: spaceUserImage,
            date: "07/11/24",
            time: "4:34PM",
            text: "Hi Emily, thanks for reaching out! The Pavilion is available, but for a more intimate setting, I’d actually recommend our Urban Pop-Up Studio 3B, which is located inside the Pavilion. It’s an 800 sq. ft. space, perfect for a focused and personalized shopping experience, especially for luxury brands like yours. The studio still includes all the amenities—Wi-Fi, security, and a flexible layout—but in a smaller, more manageable footprint.",
          },
          {
            id: 2,
            userName: "EcoLux Designs",
            activity: "brand",
            creator: "Emily Thompson",
            icon: eventUserImage,
            date: "07/11/24",
            time: "4:34PM",
            text: "That sounds great! I actually like the idea of a smaller, more intimate space for the pop-up. Could you send me some photos and more details about Studio 3B? Also, I’m free Tuesday or Thursday afternoon next week to come by for a tour.",
          },
          {
            id: 3,
            userName: "Urban Pop-Up Pavilion",
            activity: "brand",
            creator: "Michael Harrison",
            icon: spaceUserImage,
            date: "07/11/24",
            time: "4:34PM",
            text: `
            <p>Glad to hear that, Emily!</p>
            <p>You can see all on the following link: </p>
            <a href="">shwcase.co/urban-pop-up-pavilion/urban-pop-up-studio-3b</a>
            <br />
            <br />
            <p> Let’s set up a tour for Thursday at 2 PM. I think Studio 3B will work perfectly for your event, especially given its cozy atmosphere and premium feel. Looking forward to showing you the space!</p>
            `,
          },
        ],
      },
      {
        id: 2,
        userName: "Urban Pop-Up Studio 3B",
        activity: "space",
        icon: spaceActivityImage,
        read: false,
        messages: [
          {
            id: 1,
            userName: "EcoLux Designs",
            activity: "brand",
            creator: "Emily Thompson",
            icon: eventUserImage,
            date: "07/11/24",
            time: "4:34PM",
            text: `
            <p>Inquiry for: <strong>Urban Pop-Up Studio 3B</strong></p>
            <p>Date Range: <strong>dd.mm.yyyy. - dd.mm.yyyy.</strong></p>
            <p>Lease Total: <strong>$2000</strong></p>
            <p>Thursday at 2 PM works for me! Thanks for the quick response</p>
            `,
          },
          {
            id: 2,
            userName: "Urban Pop-Up Pavilion",
            activity: "brand",
            creator: "Michael Harrison",
            icon: spaceUserImage,
            date: "07/11/24",
            time: "4:34PM",
            text: "Great! See you on Thursday!",
          },
        ],
      },
      {
        id: 3,
        userName: "Sophia Ramirez",
        activity: "profile",
        icon: reviewer,
        read: false,
        messages: [
          {
            id: 1,
            userName: "",
            activity: "",
            creator: "",
            icon: "",
            date: "07/11/24",
            time: "4:34PM",
            text: "",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    activity: "brand",
    userName: "Brand Name 2",
    icon: "",
    read: true,
    creator: "",
    spaces: 1234,
    followers: 234566,
    saved: "789k",
    reviews: 12345,
    leases: 12345,
    rating: 5,
    messageGroups: [
      {
        userName: "Brand Name 4",
        activity: "brand",
        icon: "",
        read: true,
        messages: [
          {
            id: 1,
            userName: "Brand Name 2",
            activity: "brand",
            creator: "Emily Thompson",
            icon: "",
            date: "07/11/24",
            time: "4:34PM",
            text: "Hi Michael! I’m interested in booking Urban Pop-Up Pavilion for an upcoming event in February. We’re planning a limited-time pop-up for our new eco-friendly luxury fashion collection, and I think your space would be perfect. Could you let me know what availability you have around the end of February?",
          },
          {
            id: 2,
            userName: "Brand Name 4",
            activity: "brand",
            creator: "Member Name",
            icon: "",
            date: "07/11/24",
            time: "4:34PM",
            text: "Hi Emily, thanks for reaching out! The Pavilion is available, but for a more intimate setting, I’d actually recommend our Urban Pop-Up Studio 3B, which is located inside the Pavilion. It’s an 800 sq. ft. space, perfect for a focused and personalized shopping experience, especially for luxury brands like yours. The studio still includes all the amenities—Wi-Fi, security, and a flexible layout—but in a smaller, more manageable footprint.",
          },
        ],
      },
      {
        userName: "Space name 5",
        activity: "space",
        icon: "",
        messages: [
          {
            id: 1,
            userName: "",
            activity: "",
            creator: "Brand Name",
            icon: "",
            date: "07/11/24",
            time: "4:34PM",
            text: "",
          },
        ],
      },
      {
        userName: "Member Name",
        activity: "profile",
        icon: "",
        messages: [
          {
            id: 1,
            userName: "",
            activity: "",
            creator: "",
            icon: "",
            date: "07/11/24",
            time: "4:34PM",
            text: "",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    activity: "event",
    userName: "Ecolux Chic Pop-Up",
    icon: eventActivityImage,
    read: true,
    creator: "",
    spaces: 1234,
    followers: 234566,
    saved: "789k",
    reviews: 12345,
    leases: 12345,
    rating: 5,
    messageGroups: [],
  },
];
