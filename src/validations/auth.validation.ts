import Joi from "joi";

export class AuthValidation {
  static countryCodeValidation = Joi.string().when("phone", {
    is: Joi.exist(),
    then: Joi.string().required(),
  });
  static signupUser = Joi.object({
    firstName: Joi.string()?.optional(),
    email: Joi.string().email(),
    password: Joi.string().min(8).required(),
    lastName: Joi.string()?.optional(),
  });

  static LoginValidations = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8),
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
