import Joi from "joi";

export class AmenityValidation {
  static CreateAmenity = Joi.object({
    amenityName: Joi.string().required(),
  });

  static UpdateAmenity = Joi.object({
    amenityName: Joi.string().optional(),
  });
}
