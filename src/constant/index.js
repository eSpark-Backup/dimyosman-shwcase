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
