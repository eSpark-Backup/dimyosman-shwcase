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

export const messageBox = (parentObj, chatDetails, allMessages, length) => {
  const parentObject = {
    id: "",
    activity: "",
    brandName: "",
    brandImage: "",
  };

  if (length === 0) {
    parentObject.id = parentObj?.brandDetails?.id;
    parentObject.activity = "brand";
    parentObject.brandName = parentObj?.brandDetails?.brandName;
    parentObject.brandImage = parentObj?.brandDetails?.brandImage;
  } else {
    parentObject.id = parentObj?.receiverSpace?.id;
    parentObject.activity = "space";
    parentObject.brandName = parentObj?.receiverSpace?.spaceName;
    parentObject.brandImage = parentObj?.receiverSpace?.spaceImage;
  }

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
      let matchingItem = chatDetails
        ?.map((item2) => {
          if (item2.chat._id === item._id) {
            return {
              members: item2.chat?.members,
              name: item2.chat?.name,
              createdAt: item2.chat?.createdAt,
              updatedAt: item2.chat?.updatedAt,
              chatId: item2.chat?._id,
            };
          }
        })
        .find((result) => result !== undefined);
      const currentChatMessages = [];

      allMessages.forEach((message) => {
        if (message.chat === item?._id) {
          currentChatMessages.push(message);
        }
      });

      return {
        ...item,
        id: item?._id,
        chatId: matchingItem && matchingItem?.chatId,
        members: matchingItem && matchingItem?.members,
        brandName:
          length === 0
            ? item?.receiverBrand?.brandName
            : item?.senderBrand?.brandName,
        brandImage:
          length === 0
            ? item?.receiverBrand?.brandImage
            : item?.senderBrand?.brandImage,
        creator:
          length === 0
            ? item?.receiverBrand?.user?.name
            : item?.senderBrand?.user?.name,
        chatName: matchingItem && matchingItem?.name,
        activity: length === 0 ? "space" : "brand",
        read: false,
        date:
          matchingItem && format(new Date(matchingItem?.createdAt), "MM/dd/yy"),
        time:
          matchingItem && format(new Date(matchingItem?.createdAt), "h:mma"),
        messages: currentChatMessages?.map((messageItem) => {
          return {
            ...messageItem,
            id: messageItem?._id,
            brandName:
              length === 0
                ? item?.receiverBrand?.brandName
                : item?.senderBrand?.brandName,
            brandImage:
              length === 0
                ? item?.receiverBrand?.brandImage
                : item?.senderBrand?.brandImage,
            activity: "brand",
            creator: parentObj?.name,
            date: format(new Date(messageItem?.createdAt), "MM/dd/yy"),
            time: format(new Date(messageItem?.createdAt), "h:mma"),
          };
        }),
      };
    }),
  };
};