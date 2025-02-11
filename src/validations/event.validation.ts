import Joi from "joi";
import { EVENT_STATUS } from "../constants";

export class EventValidation {
  static CreateEvent = Joi.object({
    eventName: Joi.string().required(),
    eventCategory: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().optional(),
        })
      )
      .optional(),
    leaseId: Joi.string().optional(),
    brandId: Joi.string().optional(),
    spaceId: Joi.string().optional(),
    eventDate: Joi.array()
      .items(
        Joi.object({
          startDate: Joi.string().optional(),
          endDate: Joi.string().optional(),
        })
      )
      .optional(),
    details: Joi.object({
      description: Joi.string().optional(),
      htmlContent: Joi.string().optional(),
    }).optional(),
    coverOrder: Joi.alternatives()
      .try(Joi.string(), Joi.array().items(Joi.string()))
      .optional(),

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
    leaseId: Joi.string().optional(),
    coverOrder: Joi.array().items(Joi.string()).optional(),
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
    spaceId: Joi.string().optional(),
    brandId: Joi.string().optional(),
    status: Joi.string()
      .valid(...Object.values(EVENT_STATUS))
      .optional(),
  });

  static RsvpEvent = Joi.object({
    attendanceDates: Joi.object().optional(),
  });
}
