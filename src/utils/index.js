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

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

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

export const messageBox = (parentObj, chatDetails, allMessages) => {
  const getParentObject = () => {
    const isReceiverChats = parentObj?.hasReceiverChats;
    const details = isReceiverChats ? parentObj?.receiverSpace : parentObj?.brandDetails;

    return {
      id: details?.id || '',
      activity: isReceiverChats ? "space" : "brand",
      brandName: details?.brandName || details?.spaceName,
      brandImage: details?.brandImage || details?.spaceImage,
    };
  };

  const getMatchingChatDetails = (chatId) => {
    return chatDetails?.find(item => item.chat._id === chatId)?.chat || {};
  };

  const getMessagesForChat = (chatId) => {
    return allMessages.filter(message => message.chat === chatId);
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
    messageGroups: parentObj?.chats?.map((item) => {
      const matchingItem = getMatchingChatDetails(item._id);
      const currentChatMessages = getMessagesForChat(item._id);

      const isReceiverChats = parentObj?.hasReceiverChats;
      const brandName = isReceiverChats ? item?.senderBrand?.brandName : item?.receiverBrand?.brandName;
      const brandImage = isReceiverChats ? item?.senderBrand?.brandImage : item?.receiverBrand?.brandImage;
      const creator = isReceiverChats ? item?.senderBrand?.user?.name : item?.receiverBrand?.user?.name;
      const activity = isReceiverChats ? "brand" : "space";

      return {
        ...item,
        id: item?._id,
        chatId: matchingItem?._id,
        members: matchingItem?.members,
        brandName,
        brandImage,
        creator,
        chatName: matchingItem?.name,
        activity,
        read: false,
        date: matchingItem?.createdAt ? formatDate(matchingItem?.createdAt) : '',
        time: matchingItem?.createdAt ? formatTime(matchingItem?.createdAt) : '',
        messages: currentChatMessages.map((messageItem) => {
          return {
            ...messageItem,
            id: messageItem?._id,
            brandName,
            brandImage,
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