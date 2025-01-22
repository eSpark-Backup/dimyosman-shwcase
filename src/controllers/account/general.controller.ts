import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  Brand,
  Events,
  Spaces,
  User,
  LeaseSpace,
  Category,
  CategoryType,
} from "../../entity";
import { ApiError } from "../../errors";
import { Brackets, Repository } from "typeorm";
import {
  calculatePricing,
  emitEvent,
  handleResponse,
  logger,
  parseCoverImages,
} from "../../utils";
import {
  CLOUD_FOLDERS,
  HTTP_STATUS,
  NEW_MESSAGE,
  NEW_REQUEST,
  PAGINATION,
  REFETCH_CHATS,
} from "../../constants";
import { uploadService } from "../../services";
import { Chat, UserForChat, Notification, Message } from "../../models";

import {
  EventDate,
  ICustomRequest,
  IFileObject,
  IFileRequest,
  PricingTerm,
  UploadResult,
} from "../../interfaces";
import fs from "fs";
import path from "path";
import { commonHelper } from "../../helpers";
import { eventNames } from "process";
export class GeneralController {
  constructor(
    private spaceRepo: Repository<Spaces>,
    private userRepo: Repository<User>,
    private brandRepo: Repository<Brand>,
    private eventsRepo: Repository<Events>,
    private leaseSpaceRepo: Repository<LeaseSpace>,
    private categoryRepository: Repository<Category>,
    private chatModel: typeof Chat,
    private userModel: typeof UserForChat,
    private notificationModel: typeof Notification,
    private messageModel: typeof Message
  ) {}

  async generalSearch(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        name,
        page = 1,
        take = 10,
        lat,
        radius = 10,
        long,
        additional,
        entity = "All",
        categoryNames, // Array of category names to filter
      } = req.query;
      const skipNumber = (Number(page) - 1) * Number(take);
      const takeNumber = Number(take);

      const userId = req.user?.id;
      const earthRadius = 6371;

      // Initialize base queries
      let spaceQuery = this.spaceRepo
        .createQueryBuilder("space")
        .leftJoinAndSelect("space.brand", "brand")
        .andWhere("space.user != :userId", { userId })
        .skip(skipNumber)
        .take(takeNumber);

      let eventQuery = this.eventsRepo
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.brand", "brand")
        .andWhere("event.user != :userId", { userId })
        .skip(skipNumber)
        .take(takeNumber);

      let brandQuery = this.brandRepo
        .createQueryBuilder("brand")
        .skip(skipNumber)
        .take(takeNumber);

      // Apply name filter if provided
      if (name) {
        spaceQuery.andWhere("space.spaceName LIKE :name", {
          name: `%${name}%`,
        });
        eventQuery.andWhere("event.eventName LIKE :name", {
          name: `%${name}%`,
        });
        brandQuery.andWhere("brand.brandName LIKE :name", {
          name: `%${name}%`,
        });
      }

      if (categoryNames) {
        // Split categoryNames into an array if it's a string
        const categoryArray: string[] =
          typeof categoryNames === "string"
            ? categoryNames.split(",").map((item) => item.trim()) // Split by commas and trim whitespace
            : Array.isArray(categoryNames)
            ? (categoryNames as string[])
            : [];

        // Prepare the filter with OR conditions for each category in categoryArray
        const spaceCategoryFilter = categoryArray
          .map((category: string) => {
            return `JSON_CONTAINS(space.spaceCategory, '{"name": "${category}"}')`;
          })
          .join(" OR "); // Join the individual conditions with OR

        spaceQuery.andWhere(`(${spaceCategoryFilter})`);

        const eventCategoryFilter = categoryArray
          .map((category: string) => {
            return `JSON_CONTAINS(event.eventCategory, '{"name": "${category}"}')`;
          })
          .join(" OR "); // Join the individual conditions with OR

        eventQuery.andWhere(`(${eventCategoryFilter})`);

        const brandCategoryFilter = categoryArray
          .map((category: string) => {
            return `JSON_CONTAINS(brand.brandCategory, '{"name": "${category}"}')`;
          })
          .join(" OR "); // Join the individual conditions with OR

        brandQuery.andWhere(`(${brandCategoryFilter})`);
      }

      if (lat && long) {
        brandQuery.andWhere(
          new Brackets((qb) => {
            qb.where(
              `(${earthRadius} * acos(
          cos(radians(:lat)) *
          cos(radians(CAST(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.lat')) AS DECIMAL(10, 6)))) *
          cos(radians(CAST(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.long')) AS DECIMAL(10, 6))) - radians(:long)) +
          sin(radians(:lat)) *
          sin(radians(CAST(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.lat')) AS DECIMAL(10, 6))))
        )) <= :radius`,
              { lat, long, radius }
            );
          })
        );
      }

      if (additional) {
        brandQuery.andWhere(
          "JSON_EXTRACT(brand.location, '$.additional') LIKE :additional",
          {
            additional: `%${additional}%`,
          }
        );
      }

      if (entity !== "All") {
        if (entity === "SPACE") {
          eventQuery = null;
          brandQuery = null;
        } else if (entity === "EVENT") {
          spaceQuery = null;
          brandQuery = null;
        } else if (entity === "BRAND") {
          spaceQuery = null;
          eventQuery = null;
        }
      }

      // Execute queries based on available filters
      const queries = [];
      if (spaceQuery) queries.push(spaceQuery.getManyAndCount());
      if (eventQuery) queries.push(eventQuery.getManyAndCount());
      if (brandQuery) queries.push(brandQuery.getManyAndCount());

      // Execute the queries in parallel
      const results = await Promise.all(queries);

      // Process the results
      const [spacesResult, eventsResult, brandsResult] = results;
      const [spaces, spaceCount] = spacesResult || [[], 0];
      const [events, eventCount] = eventsResult || [[], 0];
      const [brands, brandCount] = brandsResult || [[], 0];

      if (events.length > 0) {
        events.forEach((event) => {
          parseCoverImages(event);
          if ("brand" in event) {
            parseCoverImages(event.brand);
          }
        });
      }
      if (spaces && spaces.length > 0) {
        spaces.forEach((space) => {
          parseCoverImages(space);
          if ("brand" in space) {
            parseCoverImages(space.brand);
          }
        });
      }
      if (brands.length > 0) {
        brands.forEach((brand) => {
          parseCoverImages(brand);
        });
      }

      const totalResults = spaceCount + eventCount + brandCount;

      // Combine results
      const response = {
        spaces,
        events,
        brands,
        totalResults,
        pagination: {
          currentPage: parseInt(page as string, 10),
          pageSize: takeNumber,
          totalPages: Math.ceil(totalResults / takeNumber),
        },
      };

      res
        .status(200)
        .json(handleResponse("Search completed successfully", response));
      return next();
    } catch (error) {
      logger.error(
        `GeneralController :: General Search :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getCategoriesByType(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryType } = req.query;

      let categories = this.categoryRepository.createQueryBuilder("category");

      if (categoryType) {
        categories.where("category.categoryType = :categoryType", {
          categoryType,
        });
      }
      const categoryResults = await categories.getMany();

      const results = categoryResults.map((category: any) => category.name);

      res
        .status(200)
        .json(
          handleResponse("Category Search completed successfully", results)
        );
      return next();
    } catch (error) {
      logger.error(
        `GeneralController :: Search Category :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
}
