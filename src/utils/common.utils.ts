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
import { PricingTerm } from "../interfaces";

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

export const parseCoverImages = (obj: any) => {
  if (obj && typeof obj.coverImages === "string") {
    obj.coverImages = JSON.parse(obj.coverImages);
  }
};

export function calculatePricing(
  pricing: PricingTerm[],
  dateRangeInDays: number
): number {
  // Ensure Day term is present
  const dayTerm = pricing.find((term) => term.term === "Day");
  if (!dayTerm) {
    throw new Error("Day term pricing is mandatory.");
  }

  // Automatically calculate missing terms based on Day price
  const dayPrice = parseFloat(dayTerm.price as any);
  if (!pricing.find((term) => term.term === "Week")) {
    pricing.push({
      term: "Week",
      price: (dayPrice * 7).toFixed(2),
      minimum: "1",
    });
  }
  if (!pricing.find((term) => term.term === "Month")) {
    pricing.push({
      term: "Month",
      price: (dayPrice * 30).toFixed(2),
      minimum: "1",
    });
  }
  if (!pricing.find((term) => term.term === "Year")) {
    pricing.push({
      term: "Year",
      price: (dayPrice * 365).toFixed(2),
      minimum: "1",
    });
  }

  // Sort terms for correct application
  const terms = pricing.sort((a, b) => {
    const order = { Day: 1, Week: 2, Month: 3, Year: 4 };
    return order[a.term] - order[b.term];
  });

  // Calculate the price
  let totalPrice = 0;
  for (const term of terms) {
    const termPrice = parseFloat(term.price);
    if (term.term === "Day" && dateRangeInDays <= 6) {
      totalPrice = dateRangeInDays * termPrice;
      break;
    } else if (term.term === "Week" && dateRangeInDays >= 7) {
      const weeks = Math.floor(dateRangeInDays / 7);
      const extraDays = dateRangeInDays % 7;
      const weeklyRate = termPrice;
      const dailyRate = weeklyRate / 7;
      totalPrice = weeks * weeklyRate + extraDays * dailyRate;
      break;
    } else if (term.term === "Month" && dateRangeInDays >= 30) {
      const months = Math.floor(dateRangeInDays / 30);
      const extraDays = dateRangeInDays % 30;
      const monthlyRate = termPrice;
      const dailyRate = monthlyRate / 30;
      totalPrice = months * monthlyRate + extraDays * dailyRate;
      break;
    } else if (term.term === "Year" && dateRangeInDays >= 365) {
      const years = Math.floor(dateRangeInDays / 365);
      const extraDays = dateRangeInDays % 365;
      const yearlyRate = termPrice;
      const dailyRate = yearlyRate / 365;
      totalPrice = years * yearlyRate + extraDays * dailyRate;
      break;
    }
  }

  return Number(totalPrice.toFixed(2));
}

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
