import { Brand, Events, Spaces } from "../../entity";
import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../../constants";
import { getOtherMember } from "../../lib/";
import { TryCatch } from "../../middleware";
import { UserForChat, Message, Chat } from "../../models";
import {
  deleteFilesFromCloudinary,
  emitEvent,
  uploadFilesToCloudinary,
  ErrorHandler,
} from "../../utils";
import { AppDataSource } from "../../typeorm.config";

const getMyChats = TryCatch(async (req: any, res: any, next: any) => {
  const chats = await Chat.find({ members: req.socketUserId }).populate(
    "members",
    "name avatar"
  );

  if (chats.length < 1) {
    return res.status(200).json({
      success: true,
      chats: { brands: [], spaces: [] },
    });
  }

  const transformedChats = await Promise.all(
    chats.map(
      async ({
        _id,
        name,
        members,
        groupChat,
        creator,
        receiverBrand,
        receiverEvent,
        senderBrand,
        receiverSpace,
        directChat,
        inquiryDetails,
      }) => {
        const otherMember = getOtherMember(members, req.socketUserId);
        const brandRepository = AppDataSource.getRepository(Brand);
        const spaceRepository = AppDataSource.getRepository(Spaces);
        const eventRepository = AppDataSource.getRepository(Events);

        // Populate receiverBrand and senderBrand if needed
        const populatedReceiverBrand = receiverBrand
          ? await brandRepository
              .createQueryBuilder("brand")
              .where("brand.id = :id", { id: receiverBrand })
              .leftJoinAndSelect("brand.user", "user")
              .select([
                "brand.id",
                "brand.brandName",
                "brand.brandImage",
                "user.id",
                "user.name",
                "user.userChatId",
              ])
              .getOne()
          : null;
        const populatedSenderBrand = senderBrand
          ? await brandRepository
              .createQueryBuilder("brand")
              .where("brand.id = :id", { id: senderBrand })
              .leftJoinAndSelect("brand.user", "user")
              .select([
                "brand.id",
                "brand.brandName",
                "brand.brandImage",
                "user.id",
                "user.name",
                "user.userChatId",
              ])
              .getOne()
          : null;

        const populatedReceiverSpace = receiverSpace
          ? await spaceRepository
              .createQueryBuilder("space")
              .where("space.id = :id", { id: receiverSpace })
              .leftJoinAndSelect("space.user", "user")
              .select([
                "space.id",
                "space.spaceName",
                "space.spaceImage",
                "user.id",
                "user.name",
                "user.userChatId",
              ])
              .getOne()
          : null;

        const populateReceiverEvent = receiverEvent
        ? await eventRepository.createQueryBuilder("event")
            .where("event.id = :id", { id: receiverEvent })
            .leftJoinAndSelect("event.user", "user")
            .select([
              "event.id",
              "event.eventName",
              "event.eventImage",
              "user.id",
              "user.name",
              "user.userChatId",
            ])
            .getOne()
            : null;

        return {
          _id,
          groupChat,
          avatar: groupChat
            ? members
                .slice(0, 3)
                .map((member: { avatar: { url: string } }) => member.avatar)
            : [otherMember.avatar],
          chatName: name,
          creator: creator.toString(),
          directChat: directChat,
          inquiryDetails: inquiryDetails,
          receiverBrand: populatedReceiverBrand,
          senderBrand: populatedSenderBrand,
          receiverSpace: populatedReceiverSpace,
          receiverEvent: populateReceiverEvent,
          name: otherMember.name,
          members: members.reduce((prev: any, curr: any) => {
            if (curr._id.toString() !== req.socketUserId.toString()) {
              prev.push(curr._id);
            }
            return prev;
          }, []),
        };
      }
    )
  );

  const groupedByUser = transformedChats.reduce(
    (acc: any, chat: any) => {

      const isSender = chat.senderBrand?.user?.userChatId === req.socketUserId;
      const isReceiver =
        chat.receiverBrand?.user?.userChatId === req.socketUserId;

      const userRoleKey = isSender
        ? chat.senderBrand?.id || "unknown_sender"
        : isReceiver
        ? chat.receiverBrand?.id || "unknown_receiver"
        : "unknown";

      if (!isReceiver && isSender ) {
        if (!acc.brands[userRoleKey]) {
          acc.brands[userRoleKey] = {
            brandDetails: isSender
              ? chat.senderBrand || {
                  id: "unknown_sender",
                  brandName: "Unknown Sender Brand",
                  brandImage: null,
                }
              : {
                  id: "unknown",
                  brandName: "Unknown Brand",
                  brandImage: null,
                },
            chats: [],
          };
        }
        if(isSender || isReceiver){
        acc.brands[userRoleKey].chats.push({
          ...chat,
          isInquiryRole: isSender ? "sender" : "unknown", // Inquiry role only applies for brands
        });
      }
      }

      // Handle spaces
      if (chat.receiverSpace?.user?.userChatId === req.socketUserId) {
        const spaceKey = chat.receiverSpace?.id || "unknown_space";

        if (!acc.spaces[spaceKey]) {
          acc.spaces[spaceKey] = {
            spaceDetails: chat.receiverSpace || {
              id: "unknown_space",
              spaceName: "Unknown Space",
              spaceImage: null,
            },
            chats: [],
          };
        }

        acc.spaces[spaceKey].chats.push(chat);
      }

      if (chat.receiverEvent?.user?.userChatId === req.socketUserId) {
        const eventKey = chat.receiverEvent?.id || "unknown_event";

        if (!acc.events[eventKey]) {
          acc.events[eventKey] = {
            eventDetails: chat.receiverEvent || {
              id: "unknown_event",
              eventName: "Unknown Event",
              eventImage: null,
            },
            chats: [],
          };
        }

        acc.events[eventKey].chats.push(chat);
      }
    
    

      return acc;
    },
    { brands: {}, spaces: {},events:{} }
  );

  // Format the grouped data for response
  const formattedData = {
    brands: Object.values(groupedByUser.brands).map((group: any) => ({
      ...group,
    })),
    spaces: Object.values(groupedByUser.spaces).map((group: any) => ({
      ...group,
    })),
    events:Object.values(groupedByUser.events).map((group: any) => ({
      ...group
    }))
  };

  res.status(200).json({
    success: true,
    chats: formattedData,
  });
});

const sendAttachments = TryCatch(async (req: any, res: any, next: any) => {
  const { chatId } = req.body;

  const files = req.files || [];

  if (files.length < 1)
    return next(new ErrorHandler("Please Upload Attachments", 400));

  if (files.length > 5)
    return next(new ErrorHandler("You can upload at most 5 files", 400));

  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    UserForChat.findById(req.socketUserId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("chat not found", 404));

  if (files.length < 1) return next(new ErrorHandler("No files found", 400));

  // Upload files to cloudinary
  const attachments = await uploadFilesToCloudinary(files);

  const messageForDb = {
    content: "",
    attachments,
    sender: user._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDb,
    sender: {
      _id: user._id,
      name: user.name,
    },
  };

  const message = await Message.create(messageForDb);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = TryCatch(async (req: any, res: any, next: any) => {
  const chatId = req.params.id;

  if (req.query.populate === "true") {
    const chat: any = await Chat.findById(chatId)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return next(new ErrorHandler("chat not found", 404));

    chat.members = chat.members.map(
      ({
        _id,
        name,
        avatar,
      }: {
        _id: any;
        name: string;
        avatar: { url: string };
      }) => ({
        _id,
        name,
        avatar: avatar.url,
      })
    );

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("chat not found", 404));

    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const deleteChat = TryCatch(async (req: any, res: any, next: any) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  // Permissions check
  if (
    chat.groupChat &&
    chat.creator.toString() !== req.socketUserId.toString()
  ) {
    return next(
      new ErrorHandler("You are not allowed to delete this group", 403)
    );
  }

  if (!chat.groupChat && !chat.members.includes(req.socketUserId.toString())) {
    return next(
      new ErrorHandler("You are not allowed to delete this chat", 403)
    );
  }

  // Retrieve messages with attachments
  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  // Delete attachments from Cloudinary
  const attachmentsToDelete = messagesWithAttachments.flatMap(
    (message) => message.attachments // An array of Cloudinary public_ids
  );

  if (attachmentsToDelete.length > 0) {
    try {
      const deleteResults = await deleteFilesFromCloudinary(
        attachmentsToDelete
      );
      console.log("Deleted attachments:", deleteResults);
    } catch (error) {
      return next(
        new ErrorHandler(`Error deleting attachments: ${error.message}`, 500)
      );
    }
  }

  // Delete messages from the database
  await Message.deleteMany({ chat: chatId });

  // Finally, delete the chat
  await Chat.findByIdAndDelete(chatId);

  res.status(200).json({
    success: true,
    message: "Chat and its messages have been successfully deleted",
  });
});

const getMessages = TryCatch(async (req: any, res: any, next: any) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;

  const resultPerPage = 20;
  const skip = (page - 1) * resultPerPage;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("chat not found", 404));

  if (!chat.members.includes(req.socketUserId.toString()))
    return next(new ErrorHandler("You are not allowed to view this chat", 403));

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

  res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

export { deleteChat, getChatDetails, getMessages, getMyChats, sendAttachments };
