import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";

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

export const addEmoji = (emoji, isCursorActive, quillInstance, setEmojiPickerVisible) => {
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

export const messageBox = (parentObj, chatDetails, allMessages) => {
  const getParentObject = () => {
    const isSpacesChats = parentObj?.spaceDetails;
   
    const details = isSpacesChats
      ? parentObj?.spaceDetails
      : parentObj?.brandDetails;

    return {
      parentId: details?.id,
      parentActivity: isSpacesChats ? "space" : "brand",
      parentName: details?.brandName || details?.spaceName,
      parentImage: details?.brandImage || details?.spaceImage,
    };
  };

  const getMatchingChatDetails = (chatId) => {
    return chatDetails?.find((item) => item._id === chatId) || {};
  };

  const getMessagesForChat = (chatId) => {
    return allMessages.filter((message) => message.chat === chatId);
  };

  const formatDate = (date) => format(new Date(date), "MM/dd/yy");
  const formatTime = (date) => format(new Date(date), "h:mma");

  const parentObject = getParentObject();

  return {
    ...parentObject,
    read: false,
    spaces: 1234,
    followers: 234566,
    saved: "789k",
    reviews: 12345,
    leases: 12345,
    rating: 5,
    chatGroups: parentObj?.chats?.map((item) => {
      const matchingItem = getMatchingChatDetails(item._id);
      const currentChatMessages = getMessagesForChat(item._id);

      const isSpacesChats = parentObj?.spaceDetails;

      const childName = isSpacesChats
        ? item?.senderBrand?.brandName
        : item?.receiverSpace?.spaceName;
      const childImage = isSpacesChats
        ? item?.senderBrand?.brandImage
        : item?.receiverSpace?.spaceImage;
      const creator = isSpacesChats
        ? item?.senderBrand?.user?.name
        : item?.receiverBrand?.user?.name;
      const receiverbrandName = isSpacesChats
        ? item?.receiverBrand?.brandName
        : "";
      const activity = isSpacesChats ? "brand" : "space";


      return {
        ...item,
        id: item?._id,
        chatId: matchingItem?._id,
        members: matchingItem?.members,
        childName,
        childImage,
        receiverbrandName,
        creator,
        chatName: matchingItem?.name,
        activity,
        read: false,
        date: matchingItem?.createdAt ? formatDate(matchingItem?.createdAt) : '',
        time: matchingItem?.createdAt ? formatTime(matchingItem?.createdAt) : '',
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
    }),
  };
};
