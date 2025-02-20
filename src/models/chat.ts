import { required, string } from "joi";
import mongoose, { Schema, Types, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
    },
    receiverBrand: {
      type: String,
      required: false,
    },
    inquiryDetails:{
      type: Object,
      required: false,
    },
    senderBrand: {
      type: String,
      required: false,
    },
    receiverSpace: {
      type: String,
      required: false,
    },
    receiverEvent: {
      type: String,
      required: false,
    },
    creatorBrand: {
      type: String,
      required: false,
    },
    directChat: {
      type: Boolean,
      default: false,
      required: false,
    },
    userToUser: {
      type: Boolean,
      default: false,
      required: false,
    },

    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.models.Chat || model("Chat", schema);
