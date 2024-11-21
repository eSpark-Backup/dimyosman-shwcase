export enum ROLES {
  USER = "user",
  ADMIN = "admin",
}

export enum LOGIN_TYPE {
  GOOGLE = "google",
  APPLE = "apple",
  FACEBOOK = "facebook",
  MANUAL = "manual",
}

export const ZERO = 0;
export const defaultCountryCode = "+91";
export const OTP_LENGTH = 4;
export const TOKEN_LENGTH = 30;
export const ONE_MIN_MS = 1000 * 60;

export const enum EXPIRATION_TIME {
  OTP = 15,
  TOKEN = 60,
}

export const BLOCKED_MIN = 15;
export const MAX_WRONG_ATTEMPTS = 3;

export enum ORDER_STATUS {
  INITIATED = "initiated",
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
  DISPATCHED = "dispatched",
  DELIVERED = "delivered",
}

export const DEFAULT_CATEGORIES_LENGTH = 10;

export const DEFAULT_WISHLIST_NAME = "All Product";

export enum FOLLOW_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

export const USER_SELECTS =
  "email name email phone bio language profileImg userName";
