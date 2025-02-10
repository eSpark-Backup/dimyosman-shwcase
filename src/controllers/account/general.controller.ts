import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  Brand,
  Events,
  Spaces,
  User,
  LeaseSpace,
  Category,
  CategoryType,
  SavedEntity,
  ActionType,
  SavedEntityType,
  BrandStatus,
} from "../../entity";
import {
  decryptShareableLink,
  generateShareableLink,
  getPlaceSuggestions,
} from "../../utils";
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
    private messageModel: typeof Message,
    private savedEntity: Repository<SavedEntity>
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
        .leftJoinAndSelect("event.space", "space")
        .leftJoinAndSelect("space.brand", "spaceBrand")
        .andWhere("event.status = :STATUS", { STATUS: EVENT_STATUS.PUBLISH })
        .andWhere("event.user != :userId", { userId })
        .addSelect((subQuery) => {
          return subQuery
            .select(
              `COALESCE(
                  JSON_OBJECT(
                      'id', rsvp.id,
                      'attendanceDates', rsvp.attendanceDates,
                      'verifyAttendance', rsvp.verifyAttendance,
                      'review', rsvp.review,
                      'rating', rsvp.rating
                  ), '{}')`, // Ensure null values don't break the JSON
              "event_rsvp"
            )
            .from("RSVP", "rsvp")
            .where("rsvp.event = event.id")
            .andWhere("rsvp.user = :userId", { userId })
            .limit(1);
        }, "event_rsvp")
        .skip(skipNumber)
        .take(takeNumber);

        let eventCountQuery =this.eventsRepo
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.brand", "brand")
        .leftJoinAndSelect("event.space", "space")
        .leftJoinAndSelect("space.brand", "spaceBrand")
        .andWhere("event.status = :STATUS", { STATUS: EVENT_STATUS.PUBLISH })
        .andWhere("event.user != :userId", { userId })
        .addSelect((subQuery) => {
          return subQuery
            .select(
              `COALESCE(
                  JSON_OBJECT(
                      'id', rsvp.id,
                      'attendanceDates', rsvp.attendanceDates,
                      'verifyAttendance', rsvp.verifyAttendance,
                      'review', rsvp.review,
                      'rating', rsvp.rating
                  ), '{}')`, // Ensure null values don't break the JSON
              "event_rsvp"
            )
            .from("RSVP", "rsvp")
            .where("rsvp.event = event.id")
            .andWhere("rsvp.user = :userId", { userId })
            .limit(1);
        }, "event_rsvp")
  

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
        const newlat = parseFloat(lat as string);
        const newlong = parseFloat(long as string);
        const searchRadius = parseFloat(radius as string); // Ensure radius is float

        brandQuery.andWhere(
          new Brackets((qb) => {
            qb.where(
              `(${earthRadius} * acos(
                        cos(radians(:lat)) *
                        cos(radians(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.lat')) * 1)) *
                        cos(radians(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.long')) * 1) - radians(:long)) +
                        sin(radians(:lat)) *
                        sin(radians(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.lat')) * 1))
                    )) <= :radius`,
              { lat: newlat, long: newlong, radius: searchRadius }
            );
          })
        );

        spaceQuery.andWhere(
          new Brackets((qb) => {
            qb.where(
              `(${earthRadius} * acos(
                        cos(radians(:lat)) *
                        cos(radians(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.lat')) * 1)) *
                        cos(radians(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.long')) * 1) - radians(:long)) +
                        sin(radians(:lat)) *
                        sin(radians(JSON_UNQUOTE(JSON_EXTRACT(brand.location, '$.lat')) * 1))
                    )) <= :radius`,
              { lat: newlat, long: newlong, radius: searchRadius }
            );
          })
        );
        eventQuery.andWhere(
          new Brackets((qb) => {
            qb.where(
              `(${earthRadius} * acos(
                        cos(radians(:lat)) *
                        cos(radians(JSON_UNQUOTE(JSON_EXTRACT(spaceBrand.location, '$.lat')) * 1)) *
                        cos(radians(JSON_UNQUOTE(JSON_EXTRACT(spaceBrand.location, '$.long')) * 1) - radians(:long)) +
                        sin(radians(:lat)) *
                        sin(radians(JSON_UNQUOTE(JSON_EXTRACT(spaceBrand.location, '$.lat')) * 1))
                    )) <= :radius`,
              { lat: newlat, long: newlong, radius: searchRadius }
            );
          })
        );

        eventCountQuery.andWhere(
          new Brackets((qb) => {
            qb.where(
              `(${earthRadius} * acos(
                        cos(radians(:lat)) *
                        cos(radians(JSON_UNQUOTE(JSON_EXTRACT(spaceBrand.location, '$.lat')) * 1)) *
                        cos(radians(JSON_UNQUOTE(JSON_EXTRACT(spaceBrand.location, '$.long')) * 1) - radians(:long)) +
                        sin(radians(:lat)) *
                        sin(radians(JSON_UNQUOTE(JSON_EXTRACT(spaceBrand.location, '$.lat')) * 1))
                    )) <= :radius`,
              { lat: newlat, long: newlong, radius: searchRadius }
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
          eventCountQuery=null;
        } else if (entity === "EVENT") {
          spaceQuery = null;
          brandQuery = null;
        } else if (entity === "BRAND") {
          spaceQuery = null;
          eventQuery = null;
          eventCountQuery=null;

        }
      }

      const queries = [];
      if (spaceQuery) queries.push(spaceQuery.getManyAndCount());
      if (eventQuery) queries.push(eventQuery.getRawAndEntities());
      if (brandQuery) queries.push(brandQuery.getManyAndCount());
      if(eventCountQuery) queries.push(eventCountQuery.getRawAndEntities());


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
      const totalEventsCount = results ? results[1] : 0;
      delete results[1];
      

      results.forEach((result, index) => {
        if (entity === "SPACE") {
          entityMap.Space = result as [Spaces[], number];
        } else if (entity === "EVENT") {
          if (result && "entities" in result && "raw" in result) {
            const { entities: rsvpEvents, raw } = result;

            const events = rsvpEvents.map((eventRaw, index) => {
              const rawData = raw[index];
              const event = eventRaw as any;

              // Parse the RSVP data if needed
              if (rawData.event_rsvp) {
                event.event_rsvp = JSON.parse(rawData.event_rsvp);
              }

              if (event.brand) {
                event.brand = {
                  ...event.brand,
                };
              }

              return event;
            });

            entityMap.Event = [events, raw] as unknown as [Events[], number];
          }
        } else if (entity === "BRAND") {
          entityMap.Brand = result as [Brand[], number];
        }
      });

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
      spaces.map((space) => {
        const totalPricing = calculatePricing(
          space.pricing as PricingTerm[],
          1
        );
        return {
          ...space,
          totalPricing,
        };
      });
      if (brands.length > 0) {
        brands.forEach((brand) => {
          parseCoverImages(brand);
        });
      }

      let saveQuery;
      let savedEntitiesQuery = this.savedEntity
        .createQueryBuilder("savedEntity")
        .where("savedEntity.ActionType = :actionType", {
          actionType: ActionType.FAVORITE,
        })
        .andWhere("savedEntity.user = :userId", { userId: req.user?.id });
      let followedEntitiesQuery = this.savedEntity
        .createQueryBuilder("savedEntity")
        .where("savedEntity.ActionType = :actionType", {
          actionType: ActionType.FOLLOW,
        })
        .andWhere("savedEntity.user = :userId", { userId: req.user?.id });

      if (entity === "SPACE") {
        savedEntitiesQuery = savedEntitiesQuery.leftJoinAndSelect(
          "savedEntity.space",
          "space"
        );
        followedEntitiesQuery = followedEntitiesQuery.leftJoinAndSelect(
          "savedEntity.space",
          "space"
        );
      } else if (entity === "EVENT") {
        savedEntitiesQuery = savedEntitiesQuery.leftJoinAndSelect(
          "savedEntity.event",
          "event"
        );
        followedEntitiesQuery = followedEntitiesQuery.leftJoinAndSelect(
          "savedEntity.event",
          "event"
        );
      } else if (entity === "BRAND") {
        savedEntitiesQuery = savedEntitiesQuery.leftJoinAndSelect(
          "savedEntity.brand",
          "brand"
        );
        followedEntitiesQuery = followedEntitiesQuery.leftJoinAndSelect(
          "savedEntity.brand",
          "brand"
        );
      } else {
        throw new ApiError("Invalid entity type", HTTP_STATUS.BAD_REQUEST);
      }

      const savedEntities = await savedEntitiesQuery.getMany();
      const followedEntities = await followedEntitiesQuery.getMany();

      const savedEntityIds = new Set(
        savedEntities
          .map(
            (entity) => entity.space?.id || entity.event?.id || entity.brand?.id
          )
          .filter(Boolean)
      );
      const followedEntityIds = new Set(
        followedEntities
          .map(
            (entity) => entity.space?.id || entity.event?.id || entity.brand?.id
          )
          .filter(Boolean)
      );

      const updatedSpaces = spaces.map((space) => ({
        ...space,
        isFavourite: savedEntityIds.has(space.id),
        shareableLink: generateShareableLink({ id: space.id, type: "space" }),
        isFollowed: followedEntityIds.has(space.id),
      }));

      const updatedEvents = events.map((event) => ({
        ...event,
        isFavourite: savedEntityIds.has(event.id),
        shareableLink: generateShareableLink({ id: event.id, type: "event" }),
        isFollowed: followedEntityIds.has(event.id),
      }));

      const updatedBrands = brands.map((brand) => ({
        ...brand,
        isFavourite: savedEntityIds.has(brand.id),
        shareableLink: generateShareableLink({ id: brand.id, type: "brand" }),
        isFollowed: followedEntityIds.has(brand.id),
      }));
      const totalResults = spaceCount + (totalEventsCount && 'entities' in totalEventsCount ? totalEventsCount.entities.length : 0) + brandCount;

      const response = {
        spaces: updatedSpaces,
        events: updatedEvents,
        brands: updatedBrands,
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

  async getSuggestion(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { query } = req.query as { query: string };
      if (!query) {
        res.status(400).json({ error: "Query input is required" });
      }

      const suggestions = await getPlaceSuggestions(query);
      res
        .status(200)
        .json(
          handleResponse("Location Fetch completed successfully", suggestions)
        );
    } catch (error) {
      logger.error(
        `GeneralController :: Get Suggestion :: ${(error as Error)?.message}`
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
      const eventsWithRSVP = await this.eventsRepo
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.brand", "brand")
        .leftJoinAndSelect("event.space", "space")
        .leftJoinAndSelect("space.brand", "spaceBrand")
        .where("event.user != :userId", { userId: req.user?.id })
        .andWhere("event.status = :STATUS", { STATUS: EVENT_STATUS.PUBLISH })
        .leftJoinAndSelect("event.user", "user")
        .leftJoin(
          (qb) => {
            return qb
              .select("rsvp_sub.event", "eventId")
              .addSelect("COUNT(rsvp_sub.id)", "rsvpCount")
              .from("rsvp", "rsvp_sub")
              .groupBy("rsvp_sub.event");
          },
          "rsvpCountSubquery",
          "rsvpCountSubquery.eventId = event.id"
        )
        .addSelect(
          "COALESCE(rsvpCountSubquery.rsvpCount, 0)",
          "event_rsvpCount"
        )
        .addSelect((subQuery) => {
          return subQuery
            .select(
              `COALESCE(
                  JSON_OBJECT(
                      'id', rsvp.id,
                      'attendanceDates', rsvp.attendanceDates,
                      'verifyAttendance', rsvp.verifyAttendance,
                      'review', rsvp.review,
                      'rating', rsvp.rating
                  ), '{}')`, // Ensure null values don't break the JSON
              "event_rsvp"
            )
            .from("RSVP", "rsvp")
            .where("rsvp.event = event.id")
            .andWhere("rsvp.user = :userId", { userId: req.user?.id })
            .limit(1);
        }, "event_rsvp")

        .orderBy("event.createdAt", "DESC")
        .getRawAndEntities();

      const [brands] = await this.brandRepo
        .createQueryBuilder("brand")
        .leftJoinAndSelect("brand.user", "user")
        .where("brand.user != :userId", { userId: req.user?.id })
        .andWhere("brand.status = :STATUS", { STATUS: BRAND_STATUS.PUBLISH })
        .orderBy("brand.createdAt", "DESC")
        .getManyAndCount();
      let [spaces] = await this.spaceRepo
        .createQueryBuilder("space")
        .leftJoinAndSelect("space.brand", "brand")
        .where("space.user != :userId", { userId: req.user?.id })
        .andWhere("space.status = :STATUS", { STATUS: SPACE_STATUS.PUBLISH })
        .leftJoinAndSelect("space.user", "user")
        .orderBy("space.createdAt", "DESC")
        .getManyAndCount();

      spaces.forEach((space) => {
        parseCoverImages(space);
      });
      brands.forEach((brand) => {
        parseCoverImages(brand);
      });
      const { entities: rsvpEvents, raw } = eventsWithRSVP;

      const formattedRsvpEvents = rsvpEvents.map((rsvp, index) => {
        const rawData = raw[index];
        parseCoverImages(rsvp);
        parseCoverImages(rsvp.brand);
        parseCoverImages(rsvp.space);
        let event_rsvp;
        if (rawData.event_rsvp) {
          event_rsvp = JSON.parse(rawData.event_rsvp);
        }
        const eventDate =
          rsvp.eventDate &&
          (rsvp.eventDate as [{ startDate: string; endDate: string }]);

        if (eventDate) {
          const currentDate = new Date();

          let eventStatus = "Ended";
          if (currentDate < new Date(eventDate[0].startDate)) {
            eventStatus = "Upcoming";
          } else if (
            currentDate >= new Date(eventDate[0].startDate) &&
            currentDate <= new Date(eventDate[0].endDate)
          ) {
            eventStatus = "Ongoing";
          }

          return {
            ...rsvp,
            rsvpCount: Number(rawData.event_rsvpCount) || 0,
            event_rsvp,
            eventStatus,
          };
        }

        return {
          ...rsvp,
          event_rsvp,
          rsvpCount: Number(rawData.event_rsvpCount) || 0,
        };
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

      const eventsWithType = formattedRsvpEvents.map((event: any) => ({
        ...event,
        type: "event",
        shareableLink: generateShareableLink({ id: event.id, type: "event" }),
      }));

      const brandsWithType = brands.map((brand: any) => ({
        ...brand,
        type: "brand",
        shareableLink: generateShareableLink({ id: brand.id, type: "brand" }),
      }));

      const spacesWithType = spaces.map((space: any) => ({
        ...space,
        type: "space",
        shareableLink: generateShareableLink({ id: space.id, type: "space" }),
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

      const [savedEntities, followedEntities] = await Promise.all([
        this.savedEntity
          .createQueryBuilder("savedEntity")
          .where("savedEntity.ActionType = :actionType", {
            actionType: ActionType.FAVORITE,
          })
          .leftJoinAndSelect("savedEntity.event", "event")
          .leftJoinAndSelect("savedEntity.space", "space")
          .leftJoinAndSelect("savedEntity.brand", "brand")
          .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
          .getMany(),

        this.savedEntity
          .createQueryBuilder("savedEntity")
          .where("savedEntity.ActionType = :actionType", {
            actionType: ActionType.FOLLOW,
          })
          .leftJoinAndSelect("savedEntity.event", "event")
          .leftJoinAndSelect("savedEntity.space", "space")
          .leftJoinAndSelect("savedEntity.brand", "brand")
          .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
          .getMany(),
      ]);

      const savedEntityIds = new Set(
        savedEntities
          .map(
            (entity) => entity.space?.id || entity.event?.id || entity.brand?.id
          )
          .filter(Boolean)
      );
      const followedEntityIds = new Set(
        followedEntities
          .map(
            (entity) => entity.space?.id || entity.event?.id || entity.brand?.id
          )
          .filter(Boolean)
      );

      const updatedPaginatedActivity = paginatedActivity.map((activity) => ({
        ...activity,
        isFavourite: savedEntityIds.has(activity.id),
        isFollowed: followedEntityIds.has(activity.id),
      }));

      res.status(200).json(
        handleResponse("Activity Fetched Successfully", {
          activity: updatedPaginatedActivity,
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

  async getSharedEntity(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { data } = req.params;
      const entities = decryptShareableLink(data as string);
      const { id, type } = entities[0];

      let entity;
      if(type === "user") {
        const userId=id
        const user = (await this.userRepo
          .createQueryBuilder("user")
          .where("user.id = :userId", { userId })
          .getOne()) as User;
        if (!user) {
          throw new ApiError("User profile not found", HTTP_STATUS.NOT_FOUND);
        }
        if (!user.profile) {
          throw new ApiError("User profile is not Public", HTTP_STATUS.NOT_FOUND);
        }

        const [getBrandsCount, getEventsCount, getSpacesCount] =
        await Promise.all([
          this.brandRepo
            .createQueryBuilder("brand")
            .where("brand.status = :status", { status: BRAND_STATUS.PUBLISH })
            .andWhere("brand.user = :userId", { userId })
            .getCount(),
          this.eventsRepo
            .createQueryBuilder("event")
            .where("event.status = :status", { status: EVENT_STATUS.PUBLISH })
            .andWhere("event.user = :userId", { userId })
            .getCount(),
          this.spaceRepo
            .createQueryBuilder("space")
            .where("space.status = :status", { status: SPACE_STATUS.PUBLISH })
            .andWhere("space.user = :userId", { userId })
            .getCount(),
        ]);

         const { password: _, ...userProfile } = user as User & {
        brandsCount?: number;
        eventsCount?: number;
        spacesCount?: number;
      };
      userProfile.coverImages = JSON.parse(
        userProfile.coverImages as Object as string
      );
      userProfile.brandsCount = getBrandsCount;
      userProfile.eventsCount = getEventsCount;
      userProfile.spacesCount = getSpacesCount;
      res.status(200).json(handleResponse("User Found Successfully", userProfile));
      return next();
      }
     else  if (type === "space") {
        entity = await this.spaceRepo
          .createQueryBuilder("space")
          .leftJoinAndSelect("space.brand", "brand")
          .where("space.id = :id", { id })
          .leftJoinAndSelect("space.user", "user")
          .getOne();
        if (typeof entity.coverImages === "string") {
          entity.coverImages = JSON.parse(entity.coverImages);
        }
        const events = await this.eventsRepo
          .createQueryBuilder("event")
          .where("event.space = :spaceId", { spaceId: entity.id })
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
        (entity as any).calendarEvents = calendarEvents;
        const totalPricing = calculatePricing(
          entity.pricing as PricingTerm[],
          1
        );

        const savedEntities = await this.savedEntity
          .createQueryBuilder("savedEntity")
          .where("savedEntity.ActionType = :actionType", {
            actionType: ActionType.FAVORITE,
          })
          .andWhere("savedEntity.type = :type", { type: SavedEntityType.SPACE })
          .leftJoinAndSelect("savedEntity.space", "space")
          .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
          .getMany();
        const savedEventIds = new Set(
          savedEntities.map((entity) => entity.space?.id).filter(Boolean) // Remove undefined/null values
        );

        const isFavourite = savedEventIds.has(entity.id);
        const space = {
          ...entity,
          isFavourite,
          type: "space",
        };
        res.status(200).json(handleResponse("Space Found Successfully", space));
        return next();
      } else if (type === "event") {
        entity = await this.eventsRepo
          .createQueryBuilder("event")
          .where("event.id = :id", { id })
          .leftJoinAndSelect("event.user", "user")
          .leftJoinAndSelect("event.brand", "brand")
          .leftJoinAndSelect("event.space", "space")
          .leftJoinAndSelect("event.leaseSpace", "leaseSpace")
          .leftJoinAndSelect("space.brand", "spaceBrand")
          .leftJoin(
            (qb) => {
              return qb
                .select("rsvp_sub.event", "eventId")
                .addSelect("COUNT(rsvp_sub.id)", "rsvpCount")
                .from("rsvp", "rsvp_sub")
                .groupBy("rsvp_sub.event");
            },
            "rsvpCountSubquery",
            "rsvpCountSubquery.eventId = event.id"
          )
          .addSelect(
            "COALESCE(rsvpCountSubquery.rsvpCount, 0)",
            "event_rsvpCount"
          )
          .addSelect((subQuery) => {
            return subQuery
              .select(
                `COALESCE(
                  JSON_OBJECT(
                      'id', rsvp.id,
                      'attendanceDates', rsvp.attendanceDates,
                      'verifyAttendance', rsvp.verifyAttendance,
                      'review', rsvp.review,
                      'rating', rsvp.rating
                  ), '{}')`,
                "event_rsvp"
              )
              .from("RSVP", "rsvp")
              .where("rsvp.event = event.id")
              .andWhere("rsvp.user = :userId", { userId: req.user?.id })
              .limit(1);
          }, "event_rsvp")

          .getRawAndEntities();
        if (!entity) {
          res.status(200).json(handleResponse("Event not found"));
          return next();
        }
        const { entities: rsvpEvents, raw } = entity;
        const formattedRsvpEvents = rsvpEvents.map((rsvp, index) => {
          const rawData = raw[index];
          parseCoverImages(rsvp);
          parseCoverImages(rsvp.brand);
          parseCoverImages(rsvp.space);
          let event_rsvp;
          if (rawData.event_rsvp) {
            event_rsvp = JSON.parse(rawData.event_rsvp);
          }
          const eventDate =
            rsvp.eventDate &&
            (rsvp.eventDate as [{ startDate: string; endDate: string }]);

          if (eventDate) {
            const currentDate = new Date();

            let eventStatus = "Ended";
            if (currentDate < new Date(eventDate[0].startDate)) {
              eventStatus = "Upcoming";
            } else if (
              currentDate >= new Date(eventDate[0].startDate) &&
              currentDate <= new Date(eventDate[0].endDate)
            ) {
              eventStatus = "Ongoing";
            }

            return {
              ...rsvp,
              rsvpCount: Number(rawData.event_rsvpCount) || 0,
              event_rsvp,
              eventStatus,
            };
          }

          return {
            ...rsvp,
            event_rsvp,
            rsvpCount: Number(rawData.event_rsvpCount) || 0,
          };
        });
        const savedEntities = await this.savedEntity
          .createQueryBuilder("savedEntity")
          .where("savedEntity.ActionType = :actionType", {
            actionType: ActionType.FAVORITE,
          })
          .andWhere("savedEntity.type = :type", { type: SavedEntityType.EVENT })
          .leftJoinAndSelect("savedEntity.event", "event")
          .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
          .getMany();

        const savedEventIds = new Set(
          savedEntities.map((entity) => entity.event?.id).filter(Boolean) // Remove undefined/null values
        );

        const event = formattedRsvpEvents.map((activity) => ({
          ...activity,
          isFavourite: savedEventIds.has(activity.id),
          type: "event",
        }));

        res
          .status(200)
          .json(handleResponse("Event Found Successfully", event[0]));
        return next();
      } else if (type == "brand") {
        entity = await this.brandRepo
          .createQueryBuilder("brand")
          .where("brand.id = :id", { id })
          .leftJoinAndSelect("brand.user", "user")
          .getOne();
        if (!entity) {
          res.status(200).json(handleResponse("Brand not found"));
          return next();
        }

        if (typeof entity.coverImages === "string") {
          entity.coverImages = JSON.parse(entity.coverImages);
        }

        const savedEntities = await this.savedEntity
          .createQueryBuilder("savedEntity")
          .where("savedEntity.ActionType = :actionType", {
            actionType: ActionType.FAVORITE,
          })
          .andWhere("savedEntity.type = :type", { type: SavedEntityType.BRAND })
          .leftJoinAndSelect("savedEntity.brand", "brand")
          .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
          .getMany();

        const savedEventIds = new Set(
          savedEntities.map((entity) => entity.brand?.id).filter(Boolean) // Remove undefined/null values
        );

        const isFavourite = savedEventIds.has(entity.id);
        const brand = {
          ...entity,
          isFavourite,
          type: "brand",
        };
        res.status(200).json(handleResponse("Brand Found Successfully", brand));
        return next();
      } else {
        throw new ApiError("Invalid entity type", HTTP_STATUS.BAD_REQUEST);
      }
      if (!entity) {
        throw new ApiError("Entity not found", HTTP_STATUS.NOT_FOUND);
      }
      res
        .status(200)
        .json(handleResponse("Entity Fetched Successfully", entity));
      return next();
    } catch (error) {
      logger.error(
        `GeneralController :: Get Shared Entity :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getPublicUserProfile(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params?.id;
      const user = (await this.userRepo
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne()) as User;
      if (!user) {
        throw new ApiError("User profile not found", HTTP_STATUS.NOT_FOUND);
      }
      if (!user.profile) {
        throw new ApiError("User profile is not Public", HTTP_STATUS.NOT_FOUND);
      }

      const [getBrandsCount, getEventsCount, getSpacesCount] =
        await Promise.all([
          this.brandRepo
            .createQueryBuilder("brand")
            .where("brand.status = :status", { status: BRAND_STATUS.PUBLISH })
            .andWhere("brand.user = :userId", { userId })
            .getCount(),
          this.eventsRepo
            .createQueryBuilder("event")
            .where("event.status = :status", { status: EVENT_STATUS.PUBLISH })
            .andWhere("event.user = :userId", { userId })
            .getCount(),
          this.spaceRepo
            .createQueryBuilder("space")
            .where("space.status = :status", { status: SPACE_STATUS.PUBLISH })
            .andWhere("space.user = :userId", { userId })
            .getCount(),
        ]);
      const shareableLink = generateShareableLink({
        id: user.id,
        type: "user",
      });
      const { password: _, ...userProfile } = user as User & {
        shareableLink?: string;
        brandsCount?: number;
        eventsCount?: number;
        spacesCount?: number;
      };

      userProfile.coverImages = JSON.parse(
        userProfile.coverImages as Object as string
      );

      userProfile.brandsCount = getBrandsCount;
      userProfile.eventsCount = getEventsCount;
      userProfile.spacesCount = getSpacesCount;
      userProfile.shareableLink = shareableLink;
      res
        .status(HTTP_STATUS.OK)
        .json(
          handleResponse("User profile retrieved successfully", userProfile)
        );
    } catch (error) {
      logger.error(
        `UserController :: getUserProfile :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

     async getAllPublicBrands(
        req: ICustomRequest,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const userId = req.params?.id;
          const findUser= await this.userRepo.createQueryBuilder("user")
          .where("user.id = :userId", { userId })
          .getOne()as User;
          if (!findUser) {
            throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
          }
          if (!findUser.profile) {
            throw new ApiError("User profile is not Public", HTTP_STATUS.NOT_FOUND);
          }
          const { page, take, skip } = req?.query;
          const skipNumber = Number(skip);
          const takeNumber = Number(take);
         
    
          const [brands, totalItems] = await this.brandRepo
            .createQueryBuilder("brand")
            .where("brand.user = :userId", { userId: req.user?.id })
            .leftJoinAndSelect("brand.user", "user")
            .andWhere("brand.status = :STATUS", { STATUS: BRAND_STATUS.PUBLISH })
            .orderBy("brand.createdAt", "DESC")
            .skip(skipNumber)
            .take(takeNumber)
            .getManyAndCount();
    
          if (brands.length === 0) {
            res.status(200).json(handleResponse("No Brands Found"));
            return next();
          }
    
          brands.forEach((brand) => {
            if (typeof brand.coverImages === "string") {
              brand.coverImages = JSON.parse(brand.coverImages);
            }
          });


          
    
       
    
          res.status(200).json(
            handleResponse("User Public Brands Fetched Successfully", {
              brands,
              pagination: {
                totalItems,
                currentPage: parseInt(page as string, 10),
                pageSize: takeNumber,
                totalPages: Math.ceil(totalItems / takeNumber),
              },
            })
          );
        } catch (error) {
          next(error);
        }
      }




      async publicEntityProfile(
        req: ICustomRequest,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const {
            page = 1,
            take = 10,
            entity = "All",
          } = req.query;
          const skipNumber = (Number(page) - 1) * Number(take);
          const takeNumber = Number(take);
    
          const userId = req.params?.id;
          const user = (await this.userRepo
            .createQueryBuilder("user")
            .where("user.id = :userId", { userId })
            .getOne()) as User;
          if (!user) {
            throw new ApiError("User profile not found", HTTP_STATUS.NOT_FOUND);
          }
          if (!user.profile) {
            throw new ApiError("User profile is not Public", HTTP_STATUS.NOT_FOUND);
          }

    
          // Initialize base queries
          let spaceQuery = this.spaceRepo
            .createQueryBuilder("space")
            .leftJoinAndSelect("space.brand", "brand")
            .andWhere("space.user = :userId", { userId })
            .andWhere("space.status = :STATUS", { STATUS: SPACE_STATUS.PUBLISH })
            .skip(skipNumber)
            .take(takeNumber);
    
          let eventQuery = this.eventsRepo
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.brand", "brand")
            .leftJoinAndSelect("event.space", "space")
            .leftJoinAndSelect("space.brand", "spaceBrand")
            .andWhere("event.status = :STATUS", { STATUS: EVENT_STATUS.PUBLISH })
            .andWhere("event.user = :userId", { userId })
            // .addSelect((subQuery) => {
            //   return subQuery
            //     .select(
            //       `COALESCE(
            //           JSON_OBJECT(
            //               'id', rsvp.id,
            //               'attendanceDates', rsvp.attendanceDates,
            //               'verifyAttendance', rsvp.verifyAttendance,
            //               'review', rsvp.review,
            //               'rating', rsvp.rating
            //           ), '{}')`,
            //       "event_rsvp"
            //     )
            //     .from("RSVP", "rsvp")
            //     .where("rsvp.event = event.id")
            //     .andWhere("rsvp.user = :userId", { userId:req.user?.id })
            //     .limit(1);
            // }, "event_rsvp")
            .skip(skipNumber)
            .take(takeNumber);
    
          let brandQuery = this.brandRepo
            .createQueryBuilder("brand")
            .andWhere("brand.status = :STATUS", { STATUS: BRAND_STATUS.PUBLISH })
            .andWhere("brand.user = :userId", { userId })
            .leftJoinAndSelect("brand.user", "user")
            .skip(skipNumber)
            .take(takeNumber);
    
     
    
 
    
    
    
     
    
        
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
    
          const queries = [];
          if (spaceQuery) queries.push(spaceQuery.getManyAndCount());
          if (eventQuery) queries.push(eventQuery.getRawAndEntities());
          if (brandQuery) queries.push(brandQuery.getManyAndCount());
    
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
    
          results.forEach((result, index) => {
            if (entity === "SPACE") {
              entityMap.Space = result as [Spaces[], number];
            } else if (entity === "EVENT") {
              if (result && "entities" in result && "raw" in result) {
                const { entities: rsvpEvents, raw } = result;
    
                const events = rsvpEvents.map((eventRaw, index) => {
                  const rawData = raw[index];
                  const event = eventRaw as any;
                  const eventDate =
                  event.eventDate &&
                  (event.eventDate as [
                    { startDate: string; endDate: string }
                  ]);


    
                  // Parse the RSVP data if needed
                  if (rawData.event_rsvp) {
                    event.event_rsvp = JSON.parse(rawData.event_rsvp);
                  }
    
                  if (event.brand) {
                    event.brand = {
                      ...event.brand,
                    };
                  }

                  if (eventDate) {
                    const currentDate = new Date();
      
                    let eventStatus = "Ended";
                    if (currentDate < new Date(eventDate[0].startDate)) {
                      eventStatus = "Upcoming";
                    } else if (
                      currentDate >= new Date(eventDate[0].startDate) &&
                      currentDate <= new Date(eventDate[0].endDate)
                    ) {
                      eventStatus = "Ongoing";
                    }
      
                    return {
                      ...event,
                      eventStatus,
                    };
                  }
    
                });
                
    
                entityMap.Event = [events, raw] as unknown as [Events[], number];
              }
            } else if (entity === "BRAND") {
              entityMap.Brand = result as [Brand[], number];
            }
          });
    
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
          spaces.map((space) => {
            const totalPricing = calculatePricing(
              space.pricing as PricingTerm[],
              1
            );
            return {
              ...space,
              totalPricing,
            };
          });
          if (brands.length > 0) {
            brands.forEach((brand) => {
              parseCoverImages(brand);
            });
          }
    
          let saveQuery;
          let savedEntitiesQuery = this.savedEntity
            .createQueryBuilder("savedEntity")
            .where("savedEntity.ActionType = :actionType", {
              actionType: ActionType.FAVORITE,
            })
            .andWhere("savedEntity.user = :userId", { userId: req.user?.id });
          let followedEntitiesQuery = this.savedEntity
            .createQueryBuilder("savedEntity")
            .where("savedEntity.ActionType = :actionType", {
              actionType: ActionType.FOLLOW,
            })
            .andWhere("savedEntity.user = :userId", { userId: req.user?.id });
    
          if (entity === "SPACE") {
            savedEntitiesQuery = savedEntitiesQuery.leftJoinAndSelect(
              "savedEntity.space",
              "space"
            );
            followedEntitiesQuery = followedEntitiesQuery.leftJoinAndSelect(
              "savedEntity.space",
              "space"
            );
          } else if (entity === "EVENT") {
            savedEntitiesQuery = savedEntitiesQuery.leftJoinAndSelect(
              "savedEntity.event",
              "event"
            );
            followedEntitiesQuery = followedEntitiesQuery.leftJoinAndSelect(
              "savedEntity.event",
              "event"
            );
          } else if (entity === "BRAND") {
            savedEntitiesQuery = savedEntitiesQuery.leftJoinAndSelect(
              "savedEntity.brand",
              "brand"
            );
            followedEntitiesQuery = followedEntitiesQuery.leftJoinAndSelect(
              "savedEntity.brand",
              "brand"
            );
          } else {
            throw new ApiError("Invalid entity type", HTTP_STATUS.BAD_REQUEST);
          }
    
          const savedEntities = await savedEntitiesQuery.getMany();
          const followedEntities = await followedEntitiesQuery.getMany();
    
          const savedEntityIds = new Set(
            savedEntities
              .map(
                (entity) => entity.space?.id || entity.event?.id || entity.brand?.id
              )
              .filter(Boolean)
          );
          const followedEntityIds = new Set(
            followedEntities
              .map(
                (entity) => entity.space?.id || entity.event?.id || entity.brand?.id
              )
              .filter(Boolean)
          );
    
          const updatedSpaces = spaces.map((space) => ({
            ...space,
            isFavourite: savedEntityIds.has(space.id),
            shareableLink: generateShareableLink({ id: space.id, type: "space" }),
            isFollowed: followedEntityIds.has(space.id),
          }));
    
          const updatedEvents = events.map((event) => ({
            ...event,
            isFavourite: savedEntityIds.has(event.id),
            shareableLink: generateShareableLink({ id: event.id, type: "event" }),
            isFollowed: followedEntityIds.has(event.id),
          }));
    
          const updatedBrands = brands.map((brand) => ({
            ...brand,
            isFavourite: savedEntityIds.has(brand.id),
            shareableLink: generateShareableLink({ id: brand.id, type: "brand" }),
            isFollowed: followedEntityIds.has(brand.id),
          }));
          const totalResults = spaceCount + updatedEvents.length + brandCount;
    
          const response = {
            spaces: updatedSpaces,
            events: updatedEvents,
            brands: updatedBrands,
            totalResults,
            pagination: {
              currentPage: parseInt(page as string, 10),
              pageSize: takeNumber,
              totalPages: Math.ceil(totalResults / takeNumber),
            },
          };
    
          res
            .status(200)
            .json(handleResponse("Public Entities fetched successfully", response));
          return next();
        } catch (error) {
          logger.error(
            `GeneralController :: General Get All For Public :: ${(error as Error)?.message}`
          );
          return next(error);
        }
      }

}
