import Joi from "joi";
import { BRAND_STATUS } from "../constants";

export class BrandValidation {
  static CreateBrand = Joi.object({
    brandName: Joi.string().required(),
    brandCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .required(),
    details: Joi.object({
      description: Joi.string().optional(),
      htmlContent: Joi.string().optional(),
    }).optional(),
    location: Joi.object({
      long: Joi.number().required(),
      lat: Joi.number().required(),
      additional: Joi.string().optional(),
    }).optional(),
    status: Joi.string()
      .valid(...Object.values(BRAND_STATUS))
      .required(),
  });

  static UpdateBrand = Joi.object({
    brandName: Joi.string().optional(),
    brandCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .optional(),
    details: Joi.object({
      description: Joi.string().optional(),
      htmlContent: Joi.string().optional(),
    }).optional(),
    location: Joi.object({
      long: Joi.number().optional(),
      lat: Joi.number().optional(),
      additional: Joi.string().optional(),
    }).optional(),
    coverKeys: Joi.alternatives()
      .try(Joi.string(), Joi.array().items(Joi.string()))
      .optional(),
    status: Joi.string()
      .valid(...Object.values(BRAND_STATUS))
      .optional(),
  });
}
