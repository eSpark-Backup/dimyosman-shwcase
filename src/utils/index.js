import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { emptyInquiryCount, emptyNotificationCount, setGoToMessage } from "../store/slices/notification";
import moment from "moment";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function getValue(item, keys) {
  if (keys.length === 1) {
    return item[keys[0]];
  }
  let value = item;

  keys.forEach((key) => {
    value = value[key];
  });

  return value;
}

export const formatDate = (date) => {
  if (!(date instanceof Date)) return ""; // Check if the input is a valid Date object

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const generate8DigitNumber = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0"); // Add leading zero if day is single digit
  const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed, so add 1
  const year = now.getFullYear();

  // Combine day, month, and year into an 8-digit number (DDMMYYYY)
  const eightDigitNumber = `${day}${month}${year}`;

  return eightDigitNumber;
};

export function useClickOutside(ref, onClickOutside) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

export function setCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

export function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=-1; path=/`;
}

export const deleteAllCookiesExcept = (exceptions = []) => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (!exceptions.includes(name)) {
      deleteCookie(name);
    }
  });
};

export const logoutAuthUtils = (logout) => {
  logout({ returnTo: window.location.origin, openUrl: false });
  deleteAllCookiesExcept();
}

// FOR PICKER
export const addEmoji = (
  emoji,
  isCursorActive,
  quillInstance,
  setEmojiPickerVisible
) => {
  const isActive = isCursorActive();
  if (!isActive) {
    quillInstance.current.focus();
  }

  const range = quillInstance.current.getSelection();
  const cursorPosition = range
    ? range.index
    : quillInstance.current.getLength();

  quillInstance.current.insertText(cursorPosition, emoji.native, "user");

  quillInstance.current.formatText(
    cursorPosition,
    emoji.native.length,
    "emoji",
    true
  );

  quillInstance.current.setSelection(cursorPosition + emoji.native.length, 0);

  setEmojiPickerVisible(false);
};

export const inquireInputStyles = (isLessThan1400, isLessThan1280) => {
  return {
    position: "relative",
    display: "flex",
    flexDirection: "column",

    "& .ql-toolbar.ql-snow+.ql-container.ql-snow": {
      border: "1px solid rgba(209, 219, 215, 0.5) !important",
      borderTop: "1px solid rgba(209, 219, 215, 0.5) !important",
      borderRadius: "5px",
      marginBottom: isLessThan1400 ? 1.25 : 1.5,
    },

    "& .ql-editor": {
      padding: "10px 16px",
      fontSize: "16px",
      fontFamily: `"Segoe UI", "sans-serif"`,
      fontStyle: "unset",
      fontWeight: 400,
      lineHeight: "21px",
    },

    "& .ql-blank::before": {
      fontStyle: "unset",
      color: "rgba(0, 20, 28, 0.5)",
    },

    "& .ql-tooltip": {
      left: "0px !important",
    },

    "& .ql-toolbar": {
      border: "none",
      order: 2,
      alignItems: "center",
      width: isLessThan1280 ? "calc(100% - 135px)" : "calc(100% - 145px)",
      padding: "4px 8px !important",

      "& .ql-formats": {
        columnGap: isLessThan1280 ? "15px" : "25px",
      },

      "& .ql-formats:has(.ql-link)": {
        flex: 1,
        justifyContent: "end",
        columnGap: "10px",
      },

      "& button": {
        padding: 0,
        width: "25px",
      },

      "& .ql-active": {
        "& img": {
          filter:
            "invert(21%) sepia(80%) saturate(4500%) hue-rotate(190deg) brightness(100%) contrast(90%)",
        },
      },
    },
  };
};

export const separateRawData = (rawData) => {
  // const spaceRegex = /Inquiry for: <strong>(.*?)<\/strong>/;
  const dateRangeRegex =
    /Date Range: <strong>(.*?)<\/strong> - <strong>(.*?)<\/strong>/;
  const leaseTotalRegex = /Lease Total: <strong>(.*?)<\/strong>/;

  // const spaceMatch = rawData.match(spaceRegex);
  const dateRangeMatch = rawData.match(dateRangeRegex);
  const leaseTotalMatch = rawData.match(leaseTotalRegex);

  if (dateRangeMatch && leaseTotalMatch) {
    const startDate = dateRangeMatch[1];
    const endDate = dateRangeMatch[2];
    const leaseTotal = leaseTotalMatch[1]?.split(".")[0];

    return {
      startDate,
      endDate,
      leaseTotal: leaseTotal?.split("$")[1],
    };
  }
};

export const convertToSameKeys = (
  selectedGroup = null,
  tenancyDetails = null
) => {
  return {
    spaceId: selectedGroup?.group?.parentId || tenancyDetails?.space?.id,
    chatId: selectedGroup?.chatGroup?.chatId || tenancyDetails?.chatId,
    brandId:
      selectedGroup?.chatGroup?.senderBrand?.id || tenancyDetails?.brand?.id,
    tenantId:
      selectedGroup?.chatGroup?.senderBrand?.user?.id || tenancyDetails?.id,
    host:
      selectedGroup?.chatGroup?.receiverbrandName ||
      tenancyDetails?.space?.brand?.brandName,
    space: selectedGroup?.group?.parentName || tenancyDetails?.space?.spaceName,
    spaceOwner:
      selectedGroup?.group?.ownerDetails?.name ||
      tenancyDetails?.space?.user?.name,
    tenant:
      selectedGroup?.chatGroup?.senderBrand?.brandName ||
      tenancyDetails?.brand?.brandName,
    tenantOwner:
      selectedGroup?.chatGroup?.senderBrand?.user?.name ||
      tenancyDetails?.contractDetails?.tenantDetails?.tenantOwner,
    leaseInfo:
      (selectedGroup?.chatGroup?.inquiryDetails
        ? selectedGroup?.chatGroup?.inquiryDetails?.message
        : selectedGroup?.chatGroup?.messages[0]?.content) ||
      tenancyDetails?.contractDetails?.leaseInfo,
    spaceImage:
      selectedGroup?.group?.parentImage || tenancyDetails?.space?.spaceImage,
    activity: selectedGroup?.group?.parentActivity || "space",
    hostAdditionalInfo:
      tenancyDetails?.contractDetails?.hostDetails?.additionalInfo || "",
    tenantAdditionalInfo:
      tenancyDetails?.contractDetails?.tenantDetails?.additionalInfo || "",
    contractDescription: tenancyDetails?.contractDetails?.description || "",
  };
};

export const spacesAction = (
  item,
  type,
  navigate,
  setTenantDetails,
  setShowIinquiryModal,
  setVerifyPayModal,
  setVerifyDetail,
  leaseSpace,
  tenantSpace,
  findLeaseDetails,
  dispatch
) => {
  switch (type) {
    case "edit":
      // if (location?.pathname === "/space") {
        navigate(`/my-spaces/${addHyphenToName(item?.eventName)}/edit`, {
          state: { id: item?.id },
        });
      // }
      break;

    case "Sign":
    case "Details":
      if (item?.tenant) {
        const findClickedTenantDetails = tenantSpace?.find(
          (tenant) => tenant.id === item.id
        );
        setTenantDetails(findClickedTenantDetails);
        setShowIinquiryModal(true);
      } else {
        const findClickedLeaseDetails = leaseSpace?.find(
          (lease) => lease.id === item.id
        );
        setTenantDetails(findClickedLeaseDetails);
        setShowIinquiryModal(true);
      }
      break;

    case "Message":
      const navDetails = tenantSpace?.find((tenant) => tenant.id === item.id);
      const navigateData = {
        pName: navDetails?.space?.spaceName,
        chatId: navDetails.chatId,
      };
      dispatch(setGoToMessage(navigateData));

      navigate("/message");
      break;

    case "Verify Pay 0/2":
    case "Verify 1/2":
      const details = findLeaseDetails(type, item.id);
      setVerifyPayModal(true);
      setVerifyDetail(details);
      break;

    default:
      break;
  }
};

export const keysForBrandsSapcesEvents = async (object, type, address) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
  };

  const coverArray =
    object?.coverImages?.map((imageItem) => imageItem?.url || "") || [];

  const coverObject = {
    profileId: object?.brand?.id,
    shareableLink: object?.shareableLink,
    isFavourite: object?.isFavourite,
    id: object?.id,
    activity: type,
    content: [object?.details?.description || ""],
    activityLocation:
      type === "event"
        ? object?.space?.spaceName
        : object?.brand?.brandName || "",
    userImage: object?.brand?.brandImage || "",
    userRole: "brand",
    activityLocationId: type === "event" ? object?.space?.id : "",
    activityLocation2: type === "event" ? object?.brand?.brandName : "",
    slides: coverArray,
    isDraftedBrandOwner:
      object?.brand?.status === "DRAFT" ? object?.brand?.user?.id : null,
    brandStatus: object?.brand?.status,
    isFollowed: object?.isFollowed,
    publicProfile: object?.user?.profile,
  };

  if (type === "space") {
    address = await fetchAddressFromCoordinates(
      object?.brand?.location?.lat,
      object?.brand?.location?.long
    );

    const filterPrice =
      object?.pricing?.filter((pricingItem) => pricingItem?.term === "Day") ||
      [];

    const spaceFeatures =
      object?.amenity?.map((amenityItem) => ({
        icon: amenityItem?.iconUrl || "",
        description: amenityItem?.name || "",
      })) || [];

      const category = object?.spaceCategory;

    return {
      ...coverObject,
      spaceId: object?.id || "",
      activityName: object?.spaceName || "",
      activityAddress: address || "",
      activityMaker: category[0]?.name || "",
      value: filterPrice[0]?.price ? `$${filterPrice[0]?.price}/day` : "N/A",
      deadline: filterPrice[0]?.minimum
        ? `minimum lease: ${filterPrice[0]?.minimum} days`
        : "N/A",
      features: spaceFeatures,
      activityImage: object?.spaceImage || "",
      location: object?.brand?.location || [],
      userName: object?.brand?.brandName || "",
      isDraftedSpaceOwner: null,
    };
  } else if (type === "event") {
    address = await fetchAddressFromCoordinates(
      object?.space?.brand?.location?.lat,
      object?.space?.brand?.location?.long
    );
    const category = object?.eventCategory;

    return {
      ...coverObject,
      rsvpDates: object.event_rsvp?.attendanceDates?.rsvpDates
        ? object.event_rsvp?.attendanceDates?.rsvpDates?.map(
            (item) => item.dateTime
          )
        : [],
      startDate: object?.eventDate[0]?.startDate || "",
      endDate: object?.eventDate[0]?.endDate || "",
      eventId: object?.id || "",
      activityName: object?.eventName || "",
      activityImage: object?.eventImage || "",
      activityAddress: address || "",
      activityMaker: category[0]?.name || "",
      value: object?.eventDate[0]?.startDate
        ? moment
            .utc(new Date(object?.eventDate[0]?.startDate))
            .add(1, "day")
            .format("DD.MM.YYYY")
        : "N/A",
      deadline: object?.eventDate[0]?.endDate
        ? moment
            .utc(new Date(object?.eventDate[0]?.endDate))
            .add(1, "day")
            .format("DD.MM.YYYY")
        : "N/A",
      location: object?.space?.brand?.location || [],
      userName: object?.brand?.brandName,
      isDraftedSpaceOwner:
        object?.space?.status === "DRAFT" ? object?.space?.user?.id : null,
      spaceStatus: object?.space?.status,
    };
  }
};

export const removeActiveNotifications = (dispatch) => {
  dispatch(emptyNotificationCount());
  deleteCookie("newNotification");
};

export const removeNewInquiry = (dispatch) => {
  dispatch(emptyInquiryCount());
  deleteCookie("newInquiry");
};

export const messageBox = (parentObj, chatDetails, allMessages) => {
  const getParentObject = () => {
    const isSpacesChats = parentObj?.spaceDetails;
    const isEventsChats = parentObj?.eventDetails;

    const details = isSpacesChats ? parentObj?.spaceDetails : isEventsChats ? parentObj?.eventDetails : parentObj?.brandDetails;

    return {
      parentId: details?.id,
      parentActivity: isSpacesChats ? "space" : isEventsChats ? "event" : "brand",
      parentName: details?.brandName || details?.spaceName || details?.eventName,
      parentImage: details?.brandImage || details?.spaceImage || details?.eventImage,
      ownerDetails: details?.user,
    };
  };

  const getMatchingChatDetails = (chatId) => {
    return chatDetails?.find((item) => item?._id === chatId) || {};
  };

  const getMessagesForChat = (chatId) => {
    return allMessages?.filter((message) => message?.chat === chatId);
  };

  const formatDate = (date) => format(new Date(date), "MM/dd/yy");
  const formatTime = (date) => format(new Date(date), "h:mma");

  const parentObject = getParentObject();

  return {
    ...parentObject,
    read: false,
    reviews: 12345,
    leases: 12345,
    rating: 5,
    chatGroups: parentObj?.chats
      ?.map((item) => {
        const matchingItem = getMatchingChatDetails(item?._id);
        const currentChatMessages = getMessagesForChat(item?._id);

        const isSpacesChats = parentObj?.spaceDetails;
        const isEventsChats = parentObj?.eventDetails;
        
        const spaces =
          isSpacesChats ||
          isEventsChats ||
          (item?.isInquiryRole && item?.isInquiryRole === "receiver")
            ? matchingItem?.senderBrand?.spaceCount
            : matchingItem?.receiverBrand?.spaceCount;

        const followers =
          isSpacesChats ||
          isEventsChats ||
          (item?.isInquiryRole && item?.isInquiryRole === "receiver")
            ? matchingItem?.senderBrand?.followedCount
            : matchingItem?.receiverSpace?.followedCount ||
              matchingItem?.receiverEvent?.followedCount ||
              matchingItem?.receiverBrand?.followedCount;

        const saved =
          isSpacesChats ||
          isEventsChats ||
          (item?.isInquiryRole && item?.isInquiryRole === "receiver")
            ? matchingItem?.senderBrand?.likedCount
            : matchingItem?.receiverSpace?.likedCount ||
              matchingItem?.receiverEvent?.likedCount ||
              matchingItem?.receiverBrand?.likedCount;

        const childName =
          isSpacesChats ||
          isEventsChats ||
          (item?.isInquiryRole && item?.isInquiryRole === "receiver")
            ? item?.senderBrand?.brandName
            : item?.receiverSpace?.spaceName ||
              item?.receiverEvent?.eventName ||
              item?.receiverBrand?.brandName;

        const childImage =
          isSpacesChats ||
          isEventsChats ||
          (item?.isInquiryRole && item?.isInquiryRole === "receiver")
            ? item?.senderBrand?.brandImage
            : item?.receiverSpace?.spaceImage ||
              item?.receiverEvent?.eventImage ||
              item?.receiverBrand?.brandImage;

        const creator =
          isSpacesChats ||
          isEventsChats ||
          (item?.isInquiryRole && item?.isInquiryRole === "receiver")
            ? item?.senderBrand?.user?.name
            : item?.receiverBrand?.user?.name || item?.receiverEvent?.user?.name;

        const receiverbrandName = isSpacesChats || isEventsChats
          ? item?.receiverBrand?.brandName || item?.receiverEvent?.brand?.brandName
          : "";

        const activity =
          isSpacesChats ||
          isEventsChats ||
          item?.isInquiryRole === "receiver" ||
          (item?.isInquiryRole === "sender" &&
            !item?.receiverEvent &&
            !item?.receiverSpace)
            ? "brand"
            : item?.receiverEvent?.eventName
            ? "event"
            : "space";

        return {
          ...item,
          id: item?._id,
          chatId: matchingItem?._id,
          members: matchingItem?.members,
          inquiryDetails: item?.inquiryDetails ? item?.inquiryDetails : null,
          childName,
          childImage,
          receiverbrandName,
          creator,
          chatName: matchingItem?.name,
          spaces: spaces || 0,
          followers:followers|| 0,
          saved: saved|| 0,
          activity,
          read: false,
          date: matchingItem?.createdAt
            ? formatDate(matchingItem?.createdAt)
            : "",
          time: matchingItem?.createdAt
            ? formatTime(matchingItem?.createdAt)
            : "",
          fulldate: matchingItem?.createdAt,
          isActive: false,
          messages: currentChatMessages.map((messageItem) => {
            return {
              ...messageItem,
              id: messageItem?._id,
              childName,
              childImage,
              activity: "brand",
              creator: parentObj?.name,
              date: formatDate(messageItem?.createdAt),
              time: formatTime(messageItem?.createdAt),
            };
          }),
        };
      })
      .sort((a, b) => new Date(b.fulldate) - new Date(a.fulldate)),
  };
};

export const handleNotificationUpdate = (cookieName, action, dispatch) => {
  const currentValue = getCookie(cookieName);
  const newCount = currentValue ? parseInt(currentValue) + 1 : 1;

  setCookie(cookieName, newCount);
  dispatch(action(newCount));
};

export const fetchAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.results[0]) {
      return data.results[0].formatted_address;
    }
    return "";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "";
  }
};

export const addHyphenToName = (name) => {
  return name?.toLowerCase()?.replace(/ /g, '-');
}
