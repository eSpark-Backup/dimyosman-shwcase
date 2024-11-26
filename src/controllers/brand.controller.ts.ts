import { NextFunction, Request, RequestHandler, Response } from "express";
import { Brand, User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../utils";
import { HTTP_STATUS } from "../constants";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class BrandController {
  constructor(private brandRepo: Repository<Brand>) {}

  async createBrand(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Brand Created Successfully successful"));
      return next();
    } catch (error) {
      logger.error(
        `BrandController :: CreateBrand :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
}
