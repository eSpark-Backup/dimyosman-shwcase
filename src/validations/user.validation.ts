import Joi from "joi";
import { LoginType } from "../entity";
import { profile } from "console";

export class UserValidation {
  static countryCodeValidation = Joi.string().when("phone", {
    is: Joi.exist(),
    then: Joi.string().required(),
  });
  static signupUser = Joi.object({
    firstName: Joi.string()?.optional(),
    email: Joi.string().email(),
    password: Joi.string().min(8)?.optional(),
    lastName: Joi.string()?.optional(),
    profileImage: Joi.string()?.optional(),
    loginType: Joi.string()
      .valid(...Object.values(LoginType))
      .optional(),
    isSocialLogin: Joi.boolean().optional(),
    socialId: Joi.string().optional(),
  });

  static verifyOtp = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string(),
    countryCode: Joi.string(),
    otp: Joi.string().length(4).required(),
  }).xor("email", "phone");

  static resendOtp = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string(),
    countryCode: Joi.string(),
  }).xor("email", "phone");

  static passwordReset = Joi.object({
    password: Joi.string().min(8),
    token: Joi.string().required(),
  });
}
