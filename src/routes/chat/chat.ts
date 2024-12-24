import express, { Router } from "express";
import {
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  sendAttachments,
} from "../../controllers";
import { atachmentsMulter, isAuthenticated } from "../../middleware";
import {
  chatIdValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../../lib";

const router = Router();

router.use(isAuthenticated);

// Get My chats
router.get("/my", getMyChats);

// Send Attachments
router.post(
  "/message",
  atachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);

// Get Messages
router.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

// Get Chat Details, Rename, Delete
router
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .delete(chatIdValidator(), validateHandler, deleteChat);

export { router };
