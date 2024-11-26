import Joi from "joi";
import { BRAND_STATUS } from "../constants";

export class BrandValidation {
  static CreateBrand = Joi.object({
    brandCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .required(),
    details: Joi.object().optional(),
    location: Joi.object({
      long: Joi.number().required(),
      lat: Joi.number().required(),
    }).optional(),
    status: Joi.string()
      .valid(...Object.values(BRAND_STATUS))
      .required(),
  });
}
