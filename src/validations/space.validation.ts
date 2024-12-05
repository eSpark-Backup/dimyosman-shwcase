import Joi from "joi";
import { SPACE_STATUS } from "../constants";

export class SpaceValidation {
  static CreateSpace = Joi.object({
    spaceName: Joi.string().required(),
    spaceCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .required(),
    brandId: Joi.string().required(),
    amenity: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          iconUrl: Joi.string().required(),
        })
      )
      .required(),
    details: Joi.object({
      description: Joi.string().required(),
      htmlContent: Joi.string().required(),
    }).optional(),
    minLeaseDays: Joi.string().required(),
    location: Joi.object({
      long: Joi.number().required(),
      lat: Joi.number().required(),
    }).optional(),
    status: Joi.string()
      .valid(...Object.values(SPACE_STATUS))
      .required(),
  });

  static UpdateSpace = Joi.object({
    spaceName: Joi.string().optional(),
    spaceCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .optional(),
    minLeaseDays: Joi.string().optional(),
    amenity: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          iconUrl: Joi.string().required(),
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
    }).optional(),
    status: Joi.string()
      .valid(...Object.values(SPACE_STATUS))
      .optional(),
  });
}
