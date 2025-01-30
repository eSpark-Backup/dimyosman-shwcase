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
  BRAND_STATUS,
  CLOUD_FOLDERS,
  EVENT_STATUS,
  HTTP_STATUS,
  NEW_MESSAGE,
  NEW_REQUEST,
  PAGINATION,
  REFETCH_CHATS,
  SPACE_STATUS,
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
        .andWhere("space.status = :STATUS", { STATUS: SPACE_STATUS.PUBLISH })
        .skip(skipNumber)
        .take(takeNumber);

      let eventQuery = this.eventsRepo
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.brand", "brand")
        .andWhere("event.status = :STATUS", { STATUS: EVENT_STATUS.PUBLISH })
        .andWhere("event.user != :userId", { userId })
        .skip(skipNumber)
        .take(takeNumber);

      let brandQuery = this.brandRepo
        .createQueryBuilder("brand")
        .andWhere("brand.status = :STATUS", { STATUS: BRAND_STATUS.PUBLISH })
        .andWhere("brand.user != :userId", { userId })
        .leftJoinAndSelect("brand.user", "user")
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

      const entityMap: {
        Space: [Spaces[], number] | null;
        Event: [Events[], number] | null;
        Brand: [Brand[], number] | null;
      } = {
        Space: null,
        Event: null,
        Brand: null,
      };

      // Assign results to corresponding entities
      results.forEach((result, index) => {
        if (entity === "SPACE") {
          entityMap.Space = result as [Spaces[], number];
        } else if (entity === "EVENT") {
          entityMap.Event = result as [Events[], number];
        } else if (entity === "BRAND") {
          entityMap.Brand = result as [Brand[], number];
        }
      });

      // Extract results for spaces, events, and brands
      const [spaces, spaceCount] = entityMap.Space || [[], 0];
      const [events, eventCount] = entityMap.Event || [[], 0];
      const [brands, brandCount] = entityMap.Brand || [[], 0];

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

  // async getActivity(
  //   req: ICustomRequest,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const { page, take, skip } = req?.query;
  //     const skipNumber = Number(skip);
  //     const takeNumber = Number(take);

  //     let [spaces, totalItems] = await this.spaceRepo
  //       .createQueryBuilder("space")
  //       .leftJoinAndSelect("space.brand", "brand")
  //       .where("space.user != :userId", { userId: req.user?.id })
  //       .leftJoinAndSelect("space.user", "user")
  //       .orderBy("space.createdAt", "DESC")
  //       .skip(skipNumber)
  //       .take(takeNumber)
  //       .getManyAndCount();

  //     if (spaces.length === 0) {
  //       res.status(200).json(handleResponse("No Spaces Found"));
  //       return next();
  //     }

  //     spaces.forEach((space) => {
  //       if (typeof space.coverImages === "string") {
  //         space.coverImages = JSON.parse(space.coverImages);
  //       }
  //     });
  //     for (const space of spaces) {
  //       const events = await this.eventsRepo
  //         .createQueryBuilder("event")
  //         .where("event.space = :spaceId", { spaceId: space.id })
  //         .getMany();

  //       const calendarEvents = events.flatMap((event) => {
  //         const eventDates: EventDate[] = Array.isArray(event.eventDate)
  //           ? event.eventDate
  //           : JSON.parse(event.eventDate as unknown as string);

  //         return eventDates.map((dateRange) => ({
  //           eventId: event.id,
  //           title: event.eventName,
  //           start: new Date(dateRange.startDate),
  //           end: new Date(dateRange.endDate),
  //         }));
  //       });

  //       (space as any).calendarEvents = calendarEvents;
  //     }

  //     spaces = spaces.map((space) => {
  //       const totalPricing = calculatePricing(
  //         space.pricing as PricingTerm[],
  //         1
  //       );
  //       return {
  //         ...space,
  //         totalPricing,
  //       };
  //     });

  //     res.status(200).json(
  //       handleResponse("Spaces Fetched Successfully", {
  //         spaces,
  //         pagination: {
  //           totalItems,
  //           currentPage: parseInt(page as string, 10),
  //           pageSize: takeNumber,
  //           totalPages: Math.ceil(totalItems / takeNumber),
  //         },
  //       })
  //     );
  //     return next();
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async getActivity(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, take, skip } = req?.query;
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      const [events] = await this.eventsRepo
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.brand", "brand")
        .leftJoinAndSelect("event.space", "space")
        .leftJoinAndSelect("space.brand", "spaceBrand")
        .where("event.user != :userId", { userId: req.user?.id })
        .leftJoinAndSelect("event.user", "user")

        .orderBy("event.createdAt", "DESC")
        .getManyAndCount();

      const [brands] = await this.brandRepo
        .createQueryBuilder("brand")
        .leftJoinAndSelect("brand.user", "user")
        .where("brand.user != :userId", { userId: req.user?.id })
        .orderBy("brand.createdAt", "DESC")
        .getManyAndCount();
      let [spaces] = await this.spaceRepo
        .createQueryBuilder("space")
        .leftJoinAndSelect("space.brand", "brand")
        .where("space.user != :userId", { userId: req.user?.id })
        .leftJoinAndSelect("space.user", "user")
        .orderBy("space.createdAt", "DESC")
        .getManyAndCount();

      spaces.forEach((space) => {
        parseCoverImages(space);
      });
      brands.forEach((brand) => {
        parseCoverImages(brand);
      });
      events.forEach((event) => {
        parseCoverImages(event);
        parseCoverImages(event.brand);
        parseCoverImages(event.space);
      });
      for (const space of spaces) {
        const events = await this.eventsRepo
          .createQueryBuilder("event")
          .where("event.space = :spaceId", { spaceId: space.id })
          .getMany();

        const calendarEvents = events.flatMap((event) => {
          const eventDates: EventDate[] = Array.isArray(event.eventDate)
            ? event.eventDate
            : JSON.parse(event.eventDate as unknown as string);

          return eventDates.map((dateRange) => ({
            eventId: event.id,
            title: event.eventName,
            start: new Date(dateRange.startDate),
            end: new Date(dateRange.endDate),
          }));
        });

        (space as any).calendarEvents = calendarEvents;
      }

      spaces = spaces.map((space) => {
        const totalPricing = calculatePricing(
          space.pricing as PricingTerm[],
          1
        );
        return {
          ...space,
          totalPricing,
        };
      });

      const eventsWithType = events.map((event: any) => ({
        ...event,
        type: "event",
      }));

      const brandsWithType = brands.map((brand: any) => ({
        ...brand,
        type: "brand",
      }));

      const spacesWithType = spaces.map((space: any) => ({
        ...space,
        type: "space",
      }));

      const activity = [
        ...eventsWithType,
        ...brandsWithType,
        ...spacesWithType,
      ];

      const sortedActivity = activity.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const paginatedActivity = sortedActivity.slice(
        skipNumber,
        skipNumber + takeNumber
      );

      const totalItems = sortedActivity.length;
      const totalPages = Math.ceil(totalItems / takeNumber);

      res.status(200).json(
        handleResponse("Activity Fetched Successfully", {
          activity: paginatedActivity,
          pagination: {
            totalItems,
            currentPage: Number(page),
            pageSize: takeNumber,
            totalPages,
          },
        })
      );

      return next();
    } catch (error) {
      logger.error(
        `GeneralController :: General Activity :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
}
