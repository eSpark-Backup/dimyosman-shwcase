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
} from "../assets";

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
  const smallSidebarLink = ["/message", "/profile"];
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
    activity: "event",
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
    activityAddress: "123 Williamsburg Ave, Brooklyn, NY 11211",
    value: "28.02.2025.",
    deadline: "until 15.4.2025.",
    userImage: eventUserImage,
    activityImage: eventActivityImage,
    userRole: "event",
    slides: [eventMain, eventMain2, eventMain3],
  },
  {
    activity: "space",
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
    userName: "Emily Thompson",
    userImage: brandUserImage,
    mainImage: brandMain,
    activityImage: brandActivityImage,
    activityName: "EcoLux Designs",
    activityMaker: "Sustainable Fashion",
    content: [
      "EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials."
    ],
    userRole: "account",
    slides: [brandMain],
  },
]