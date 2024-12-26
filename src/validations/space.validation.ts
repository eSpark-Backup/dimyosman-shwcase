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
    pricing: Joi.array().items(
      Joi.object({
        term: Joi.string().required(),
        price: Joi.string().required(),
        minimum: Joi.string().required(),
      })
    ),
    location: Joi.object({
      long: Joi.number().required(),
      lat: Joi.number().required(),
      additional: Joi.string().optional(),
    }).optional(),
    status: Joi.string()
      .valid(...Object.values(SPACE_STATUS))
      .required(),
  });

  static inquireSpace = Joi.object({
    message: Joi.string().required(),
    senderBrandId: Joi.string().required(),
    receiverBrandId: Joi.string().required(),
    receiverSpaceId: Joi.string().required(),
  });

  static UpdateSpace = Joi.object({
    spaceName: Joi.string().optional(),
    brandId: Joi.string().optional(),
    spaceCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .optional(),
    pricing: Joi.array().items(
      Joi.object({
        term: Joi.string().required(),
        price: Joi.string().required(),
        minimum: Joi.string().required(),
      })
    ),
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
    coverKeys: Joi.alternatives()
      .try(Joi.string(), Joi.array().items(Joi.string()))
      .optional(),
    location: Joi.object({
      long: Joi.number().optional(),
      lat: Joi.number().optional(),
      additional: Joi.string().optional(),
    }).optional(),
    status: Joi.string()
      .valid(...Object.values(SPACE_STATUS))
      .optional(),
  });
}
