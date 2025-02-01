import { NextFunction, Request, RequestHandler, Response } from "express";
import { Category, CategoryType, User } from "../../entity";
import { ApiError } from "../../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../../utils";
import { ICustomRequest, IFileRequest, UploadResult } from "../../interfaces";
import { CATEGORY_TYPE } from "../../constants";

export class CategoryController {
  constructor(
    private categoryRepo: Repository<Category>,
    private userRepo: Repository<User>
  ) {}

  async createCategory(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryName, categoryType } = req.body;
      const checkName = await this.categoryRepo.createQueryBuilder("category")
        .where("name = :name", { name: categoryName })
        .andWhere("categoryType = :categoryType", { categoryType })
        .getOne();
      if (checkName) {
        throw new ApiError("Category with this name already exists", 400
        );
      }
      const newCategory = new Category();
      newCategory.name = categoryName;
      newCategory.categoryType = categoryType;
      const createdCategory = await this.categoryRepo.save(newCategory);
      res
        .status(201)
        .json(handleResponse("Category Created Successfully", createdCategory));
      return next();
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { type } = req.query;

      const filter = type as CategoryType;

      const categories = await this.categoryRepo.find({
        where: { categoryType: filter },
      });
      res
        .status(200)
        .json(handleResponse("Categories Fetched Successfully", categories));
    } catch (error) {
      next(error);
    }
  }
}
