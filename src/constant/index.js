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
import {
  likedEventColumns,
  myEventsColumns,
  rsvpEventColumns,
} from "../columns/event";
import { leasingSpaceColumns, likedSpaceColumns, mySpaceColumns } from "../columns/space";

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
  const smallSidebarLink = ["/message", "/profile", `/brand/${id}`, `/brand/${id}/edit`, "/new-brand", `/event/${id}`, `/event/${id}/edit`, "/new-event", `/space/${id}`];
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
    status: "Upcoming",
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
    status: "Ongoing",
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
    status: "Ongoing",
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
    status: "Ended",
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

const mySpaceData = [];

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
    action: "Details"
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
    action: "Sign"
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
    action: "Verify Pay 1/2"
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
    action: "Review"
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

export const eventTableData = (gotoDetail, handleAction) => [
  {
    data: myEventData,
    column: myEventsColumns(gotoDetail, (item) => handleAction(item, "edit")),
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
export const spaceTableData = (gotoDetail, handleAction) => [
  {
    data:  mySpaceData,
    column: mySpaceColumns(gotoDetail, (item) => handleAction(item, "edit")),
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
