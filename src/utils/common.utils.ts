import crypto from "crypto";
import {
  EXPIRATION_TIME,
  HTTP_STATUS,
  NODE_ENVS,
  ONE_MIN_MS,
  OTP_LENGTH,
  TOKEN_LENGTH,
} from "../constants";
import { Request, Response, NextFunction } from "express";

/**
 * @description : For set success response data
 * @param message
 * @param data
 * @returns : Set success response data
 */
export const handleResponse = (
  message = "SUCCESS",
  data: unknown = null,
  statusCode: number = HTTP_STATUS.OK
) => {
  return {
    status: true,
    data: data,
    message: message,
    statusCode,
  };
};

export function parseJsonFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    fields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          return res.status(422).json({
            status: false,
            message: `${field} must be a valid JSON string`,
          });
        }
      }
    });
    return next();
  };
}

export const getTime = (
  value: number = EXPIRATION_TIME.OTP,
  duration: "min" | "hour" = "min",
  operation: "add" | "substract" = "add"
) => {
  const milliseconds =
    duration === "min" ? value * ONE_MIN_MS : value * 60 * ONE_MIN_MS;
  if (operation === "add") {
    return new Date(Date.now() + milliseconds);
  } else {
    return new Date(Date.now() - milliseconds);
  }
};

export const generateToken = (length: number = TOKEN_LENGTH) => {
  let tokenLength = length;
  if (!Number.isInteger(length) || length <= 0) {
    tokenLength = TOKEN_LENGTH;
  }
  const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
  const token = randomBytes.toString("hex").slice(0, length);
  return token;
};
