import Joi from "joi";
import { EVENT_STATUS } from "../constants";

export class EventValidation {
  static CreateEvent = Joi.object({
    eventName: Joi.string().required(),
    eventCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .required(),
    brandId: Joi.string().required(),
    spaceId: Joi.string().required(),
    eventDate: Joi.array()
      .items(
        Joi.object({
          startDate: Joi.string().required(),
          endDate: Joi.string().required(),
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
      .valid(...Object.values(EVENT_STATUS))
      .required(),
  });

  static UpdateEvent = Joi.object({
    eventName: Joi.string().optional(),
    eventCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        })
      )
      .optional(),
    minLeaseDays: Joi.string().optional(),
    eventDate: Joi.array()
      .items(
        Joi.object({
          startDate: Joi.string().required(),
          endDate: Joi.string().required(),
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
    }).optional(),
    status: Joi.string()
      .valid(...Object.values(EVENT_STATUS))
      .optional(),
  });
}
