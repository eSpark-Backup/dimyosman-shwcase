import Joi from "joi";
import { CATEGORY_TYPE } from "../constants";

export class CategoryValidation {
  static CreateCategory = Joi.object({
    categoryName: Joi.string().required(),

    categoryType: Joi.string()
      .valid(...Object.values(CATEGORY_TYPE))
      .required(),
  });
}
