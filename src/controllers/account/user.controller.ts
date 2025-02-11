import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  ActionType,
  Brand,
  Events,
  RSVP,
  SavedEntity,
  SavedEntityType,
  Spaces,
  User,
} from "../../entity";
import { ApiError } from "../../errors";
import { Repository } from "typeorm";
import {
  decrypt,
  generateShareableLink,
  generateToken,
  handleResponse,
  logger,
  verifyToken,
} from "../../utils";
import {
  BRAND_STATUS,
  CLOUD_FOLDERS,
  EVENT_STATUS,
  HTTP_STATUS,
  SPACE_STATUS,
} from "../../constants";
import jwt from "jsonwebtoken";
import { UserForChat } from "../../models";

import bcrypt from "bcryptjs";
import {
  EventDate,
  ICustomRequest,
  IFileObject,
  UploadResult,
} from "../../interfaces";
import { Notification } from "../../models";
import fs from "fs";
import path from "path";
import { commonHelper } from "../../helpers";
import { mailService, uploadService } from "../../services";
import { json } from "stream/consumers";
export class UserController {
  constructor(
    private usersRepo: Repository<User>,
    private eventsRepo: Repository<Events>,
    private spaceRepo: Repository<Spaces>,
    private brandRepo: Repository<Brand>,
    private notificationModel: typeof Notification,
    private SavedEntityRepo: Repository<SavedEntity>,
    private rsvpEventRepo: Repository<RSVP>
  ) {}

  async verifyTokenAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, expiresAt } = req.query;

      if (!token || !expiresAt) {
        throw new ApiError(
          "Token and expiration time are required",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Check if the token has expired
      const currentTime = new Date();
      const expirationTime = new Date(expiresAt as string);
      if (currentTime > expirationTime) {
        throw new ApiError("The token has expired", HTTP_STATUS.BAD_REQUEST);
      }

      let payload: {
        userId: string;
        newEmail: string;
      };
      try {
        payload = verifyToken(token as string) as {
          userId: string;
          newEmail: string;
        };
      } catch (error) {
        throw new ApiError(
          "Invalid or tampered token",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const user = await this.usersRepo.findOne({
        where: { id: payload.userId },
      });
      if (!user) {
        throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
      }
      if (user.emailLinkExpire != expiresAt) {
        throw new ApiError(
          "Email Link maybe expired or Invalid",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      user.emailLinkExpire = null;
      user.isVerified = true;
      user.email = payload.newEmail;
      await this.usersRepo.save(user);

      res.status(HTTP_STATUS.OK).json({
        message: "Email has been successfully updated.",
        data: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      logger.error(
        `UserController :: verifyTokenAPI :: "${(error as Error)?.message}"`
      );
      return next(error);
    }
  }

  async updateEmail(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let userId = req.user?.id;
      let { newEmail, oldEmail } = req.body;

      const user = await this.usersRepo
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne();

      if (!user) {
        throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
      }

      if (user.email !== oldEmail) {
        throw new ApiError(
          "The current email does not match the user's email",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const { token, expiresAt } = generateToken({ userId, newEmail }, "1h");

      const link = `${process.env.FRONTEND_URL}confirm-email?token=${token}&expiresAt=${expiresAt}`;

      await mailService.changeEmailAddress({
        name: user.name,
        oldEmail,
        newEmail,
        link,
      });
      // user.email = newEmail;
      // user.isVerified = false;
      user.emailLinkExpire = expiresAt;
      const updatedUser = await this.usersRepo.save(user);

      res.status(HTTP_STATUS.OK).json(
        handleResponse("Email Sent successfully", {
          id: updatedUser.id,
          email: updatedUser.email,
        })
      );
    } catch (error) {
      logger.error(
        `UserController :: updateEmail :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async changePassword(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { oldPassword, newPassword } = req.body;

      const user = await this.usersRepo
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne();

      if (!user) {
        throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new ApiError("Incorrect old password", HTTP_STATUS.UN_AUTHORIZED);
      }
      if (oldPassword === newPassword) {
        throw new ApiError(
          "New password cannot be the same as old password",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await this.usersRepo.save(user);

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Password changed successfully"));
    } catch (error) {
      logger.error(
        `UserController :: changePassword :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
  async updateProfileImage(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const user = await this.usersRepo
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne();

      if (!user) {
        throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
      }

      const imageFilesPath = path.join(process.cwd(), "uploads");
      const coverFilesPath = path.join(process.cwd(), "uploads");

      const coverFiles = fs
        .readdirSync(coverFilesPath)
        .filter((file) => file.startsWith("cover")); // Filter for cover files

      const imageFiles = fs
        .readdirSync(path.join(imageFilesPath))
        .filter((file) => file.startsWith("image")); // Filter for image files

      const imageFileObjects: IFileObject[] = imageFiles.map((file) =>
        commonHelper.createFileObject(path.join(imageFilesPath, file), "image")
      );
      const coverFileObjects: IFileObject[] = coverFiles.map((file) =>
        commonHelper.createFileObject(path.join(coverFilesPath, file), "cover")
      );

      let { coverKeys, about,isProfile } = req.body;

      
      if (Array.isArray(coverKeys)) {
        coverKeys = coverKeys.filter((key) => typeof key === "string");
      }
      if (typeof coverKeys === "string" && !Array.isArray(coverKeys)) {
        coverKeys = coverKeys.split(",").map((item) => item.trim());
      }
      let oldCoverImages: UploadResult[] = [];
      const FolderName = `${CLOUD_FOLDERS.USER}/${user.name.trim()}`;
      if (typeof user.coverImages === "string") {
        try {
          oldCoverImages = JSON.parse(user.coverImages) as UploadResult[];
        } catch (error) {
          logger.error("Failed to parse coverImages:", error);
          oldCoverImages = [];
        }
      } else {
        oldCoverImages = [];
      }

      let coverUrls ;
      if(isProfile=="false")
      {

      coverUrls = (
        coverFileObjects?.length > 0
          ? await uploadService.uploadMultipleFiles(
              coverFileObjects,
              FolderName
            )
          : []
      ) as UploadResult[];


      for (const oldCoverImage of oldCoverImages) {
        if (coverKeys && coverKeys.length > 0) {
          const coverKeyNumbers = coverKeys
            .map((key: any) => {
              const splitKey = key.split("+");
              return {
                key: splitKey[0],
                order: parseInt(splitKey[1], 10),
              };
            })
            .filter((keyData: any) => !isNaN(keyData.order)); // Filter out invalid or undefined numbers

          const matchingKey = coverKeyNumbers.find(
            (keyData: any) => oldCoverImage.public_id.includes(keyData.key) // Match based on the key part of the public_id
          );

          if (!matchingKey) {
            await uploadService.deleteFile(oldCoverImage.public_id);
          } else {
            const { order } = matchingKey;

            const validOrder = Math.max(
              1,
              Math.min(order, coverUrls.length + 1)
            );

            if (validOrder === coverUrls.length + 1) {
              coverUrls.push(oldCoverImage);
            } else {
              coverUrls.splice(validOrder - 1, 0, oldCoverImage);
            }
          }
        } else {
          if (
            !coverUrls.some((url) => url.public_id === oldCoverImage.public_id)
          ) {
            await uploadService.deleteFile(oldCoverImage.public_id);
          }
        }
      }
    }

      const oldUserImage = user.profileImage;
      const imageUrls = (
        imageFileObjects?.length > 0
          ? await uploadService.uploadMultipleFiles(
              imageFileObjects,
              FolderName
            )
          : [{ url: oldUserImage }]
      ) as UploadResult[];

      if (user.imageKey) {
        if (imageFileObjects && oldUserImage !== imageUrls[0]?.url) {
          await uploadService.deleteFile(user.imageKey);
        }
      }
      user.profileImage = imageUrls[0]?.url;
      user.imageKey = imageUrls[0]?.public_id;
      user.about = about || user.about;
      if(isProfile=="false"){
      user.coverImages = JSON.stringify(coverUrls) as Object;
      }
      await this.usersRepo.save(user);
      const { password: _, ...userProfile } = user;
      userProfile.coverImages = JSON.parse(
        userProfile.coverImages as Object as string
      );

      const chatUser = await UserForChat.findById(req.user?._id);
      chatUser.avatar = imageUrls[0]?.url;
      await chatUser.save();
      const uploadsPath = path.join(process.cwd(), "uploads");
      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("User Profile Updated Successfully", userProfile));
      return next();
    } catch (error) {
      const uploadsPath = path.join(process.cwd(), "uploads");
      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
      });
      logger.error(
        `UserController :: updateProfileImage :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async updateUser(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { firstName, lastName, ...rest } = req.body;

      const name = [firstName, lastName].filter(Boolean).join(" ");

      // Retrieve user
      const user = await this.usersRepo
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne();

      if (!user) {
        throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
      }

      const updatedData = {
        ...user,
        ...rest,
        ...(name && { name }),
      };

      const chatUser = await UserForChat.findById(req.user?._id);
      chatUser.name = name;
      await chatUser.save();

      const updatedUser = await this.usersRepo.save(updatedData);

      const { password: _, ...userProfile } = updatedUser;

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("User profile updated successfully", userProfile));
    } catch (error) {
      logger.error(
        `UserController :: updateUser :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async fetchNotifications(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;

      const { page = 1, pageSize = 10 } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageLimit = parseInt(pageSize as string, 10);

      const [notifications, totalItems] = await Promise.all([
        this.notificationModel
          .find({ user: userId })
          .sort({ createdAt: -1 })
          .skip((pageNumber - 1) * pageLimit)
          .limit(pageLimit)
          .lean(),
        this.notificationModel.countDocuments({ user: userId }),
      ]);

      const totalPages = Math.ceil(totalItems / pageLimit);

      res.status(HTTP_STATUS.OK).json(
        handleResponse("Notifications fetched successfully", {
          notifications,
          pagination: {
            totalItems,
            currentPage: pageNumber,
            pageSize: pageLimit,
            totalPages,
          },
        })
      );
    } catch (error) {
      logger.error(
        `UserController :: fetchNotifications :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getUserProfile(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Retrieve the authenticated user's details
      const userId = req.user?.id;
      const user = (await this.usersRepo
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne()) as User;
      if (!user) {
        throw new ApiError("User profile not found", HTTP_STATUS.NOT_FOUND);
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
        brandsCount?: number;
        eventsCount?: number;
        spacesCount?: number;
        shareableLink: string;
      };

      userProfile.coverImages = JSON.parse(
        userProfile.coverImages as Object as string
      );
      userProfile.shareableLink = shareableLink;
      userProfile.brandsCount = getBrandsCount;
      userProfile.eventsCount = getEventsCount;
      userProfile.spacesCount = getSpacesCount;
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
  async getFavourites(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, take, skip, entity } = req?.query;
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      const userId = req.user?.id;

      let query = this.SavedEntityRepo.createQueryBuilder("savedEntity")
        .where("savedEntity.user = :userId", { userId })
        .andWhere("savedEntity.actionType = :actionType", {
          actionType: ActionType.FAVORITE,
        });

      if (entity == "EVENT") {
        query
          .leftJoinAndSelect("savedEntity.event", "event")
          .leftJoinAndSelect("event.brand", "brand")
          .leftJoinAndSelect("event.space", "space")
          .andWhere("savedEntity.type = :type", {
            type: SavedEntityType.EVENT,
          });
      } else if (entity == "SPACE") {
        query
          .leftJoinAndSelect("savedEntity.space", "space")
          .leftJoinAndSelect("space.brand", "brand")
          .andWhere("savedEntity.type = :type", {
            type: SavedEntityType.SPACE,
          });
      } else if (entity == "BRAND") {
        query
          .leftJoinAndSelect("savedEntity.brand", "brand")
          .andWhere("savedEntity.type = :type", {
            type: SavedEntityType.BRAND,
          });
      }

      const [savedEntities, totalItems] = await query
        .skip(skipNumber)
        .take(takeNumber)
        .getManyAndCount();

      if (entity == "BRAND") {
        const brandIds = savedEntities
          .map((entity) => entity.brand?.id)
          .filter(Boolean);

        if (brandIds.length > 0) {
          const followers = await this.SavedEntityRepo.createQueryBuilder(
            "savedEntity"
          )
            .where("savedEntity.brand IN (:...brandIds)", { brandIds })
            .andWhere("savedEntity.actionType = :actionType", {
              actionType: ActionType.FOLLOW,
            })
            .groupBy("savedEntity.brand")
            .select("savedEntity.brand")
            .addSelect("COUNT(savedEntity.id)", "followedCount")
            .getRawMany();

          const brandFollowerCountMap = new Map();
          followers.forEach((follower) => {
            brandFollowerCountMap.set(
              follower.brandId,
              parseInt(follower.followedCount, 10) || 0
            );
          });

          const brandEventsCount = await this.eventsRepo
            .createQueryBuilder("event")
            .select("event.brand")
            .addSelect("COUNT(event.id)", "eventCount")
            .where("event.brand IN (:...brandIds)", { brandIds })
            .groupBy("event.brand")
            .getRawMany();

          const brandEventCountMap = new Map();
          brandEventsCount.forEach((eventCount) => {
            brandEventCountMap.set(
              eventCount.brand,
              parseInt(eventCount.eventCount, 10) || 0
            );
          });

          savedEntities.forEach((entity) => {
            if (entity.brand && brandEventCountMap.has(entity.brand.id)) {
              (entity as any).eventCount = brandEventCountMap.get(
                entity.brand.id
              );
            }

            if (brandFollowerCountMap.has(entity.brand.id)) {
              (entity as any).followedCount = brandFollowerCountMap.get(
                entity.brand.id
              );
            }
          });
        }
      }

      res.status(HTTP_STATUS.OK).json(
        handleResponse("Favourites retrieved successfully", {
          savedEntities,

          pagination: {
            totalItems,
            currentPage: parseInt(page as string, 10),
            pageSize: takeNumber,
            totalPages: Math.ceil(totalItems / takeNumber),
          },
        })
      );
    } catch (error) {
      logger.error(
        `UserController :: getFavourites :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getFollow(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, take, skip, entity } = req?.query;
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      const userId = req.user?.id;

      let query = this.SavedEntityRepo.createQueryBuilder("savedEntity")
        .where("savedEntity.user = :userId", { userId })
        .andWhere("savedEntity.actionType = :actionType", {
          actionType: ActionType.FOLLOW,
        });

      if (entity == "EVENT") {
        query
          .leftJoinAndSelect("savedEntity.event", "event")
          .andWhere("savedEntity.type = :type", {
            type: SavedEntityType.EVENT,
          });
      } else if (entity == "SPACE") {
        query
          .leftJoinAndSelect("savedEntity.space", "space")
          .andWhere("savedEntity.type = :type", {
            type: SavedEntityType.SPACE,
          });
      } else if (entity == "BRAND") {
        query
          .leftJoinAndSelect("savedEntity.brand", "brand")
          .andWhere("savedEntity.type = :type", {
            type: SavedEntityType.BRAND,
          });
      }

      const [followedEntities, totalItems] = await query
        .skip(skipNumber)
        .take(takeNumber)
        .getManyAndCount();

      if (entity == "BRAND") {
        const brandIds = followedEntities
          .map((entity) => entity.brand?.id)
          .filter(Boolean);

        if (brandIds.length > 0) {
          const followers = await this.SavedEntityRepo.createQueryBuilder(
            "savedEntity"
          )
            .where("savedEntity.brand IN (:...brandIds)", { brandIds })
            .andWhere("savedEntity.actionType = :actionType", {
              actionType: ActionType.FOLLOW,
            })
            .groupBy("savedEntity.brand")
            .select("savedEntity.brand")
            .addSelect("COUNT(savedEntity.id)", "followedCount")
            .getRawMany();

          const brandFollowerCountMap = new Map();
          followers.forEach((follower) => {
            brandFollowerCountMap.set(
              follower.brandId,
              parseInt(follower.followedCount, 10) || 0
            );
          });

          const brandEventsCount = await this.eventsRepo
            .createQueryBuilder("event")
            .select("event.brand")
            .addSelect("COUNT(event.id)", "eventCount")
            .where("event.brand IN (:...brandIds)", { brandIds })
            .groupBy("event.brand")
            .getRawMany();

          const brandEventCountMap = new Map();
          brandEventsCount.forEach((eventCount) => {
            brandEventCountMap.set(
              eventCount.brand,
              parseInt(eventCount.eventCount, 10) || 0
            );
          });

          followedEntities.forEach((entity) => {
            if (entity.brand && brandEventCountMap.has(entity.brand.id)) {
              (entity as any).eventCount = brandEventCountMap.get(
                entity.brand.id
              );
            }

            if (brandFollowerCountMap.has(entity.brand.id)) {
              (entity as any).followedCount = brandFollowerCountMap.get(
                entity.brand.id
              );
            }
          });
        }
      }

      res.status(HTTP_STATUS.OK).json(
        handleResponse(`Followed ${entity} fetched Successfully`, {
          followedEntities,

          pagination: {
            totalItems,
            currentPage: parseInt(page as string, 10),
            pageSize: takeNumber,
            totalPages: Math.ceil(totalItems / takeNumber),
          },
        })
      );
    } catch (error) {
      logger.error(
        `UserController :: getFollows :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getCalender(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const [events, rsvpEventsResult] = await Promise.all([
        this.eventsRepo
          .createQueryBuilder("events")
          .where("events.user = :userId", { userId })
          .andWhere("events.status = :status", { status: EVENT_STATUS.PUBLISH })
          .getMany(),
        this.rsvpEventRepo
          .createQueryBuilder("rsvp")
          .leftJoinAndSelect("rsvp.event", "event")
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
          .where("rsvp.user = :userId", { userId })
          .orderBy("rsvp.createdAt", "DESC")
          .getRawAndEntities(),
      ]);

      const calendarEvents = events.flatMap((event) => {
        const eventDates: EventDate[] = Array.isArray(event.eventDate)
          ? event.eventDate
          : JSON.parse(event.eventDate as unknown as string);

        return eventDates.map((dateRange) => ({
          id: event.id,
          title: event.eventName,
          start: new Date(dateRange.startDate),
          end: new Date(dateRange.endDate),
        }));
      });
      const { entities: rsvpEvents, raw } = rsvpEventsResult;

      const rsvpCalendarEvents = rsvpEvents.map((rsvp, index) => {
        const rawData = raw[index];
        const event = rsvp.event;
        const eventDates: EventDate[] = Array.isArray(event.eventDate)
          ? event.eventDate
          : JSON.parse(event.eventDate as unknown as string);

        return eventDates.map((dateRange) => ({
          id: event.id,
          title: event.eventName,
          start: new Date(dateRange.startDate),
          end: new Date(dateRange.endDate),
          rsvpCount: rawData.event_rsvpCount,
        }));
      });
      const combinedCalendarEvents = [...calendarEvents, ...rsvpCalendarEvents];

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("User Calendar", combinedCalendarEvents));
      return next();
    } catch (error) {
      logger.error(
        `UserController :: getCalendar :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async addToFavourites(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { entityId, entityType } = req.body; // Expecting entityId and entityType in the request body
      const userId = req.user?.id;

      // Validate the entity type
      if (!Object.values(SavedEntityType).includes(entityType)) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(handleResponse("Invalid entity type"));
        return next();
      }

      let existingFavourite;

      // Check for existing favourite based on the entity type
      if (entityType === SavedEntityType.EVENT) {
        existingFavourite = await this.SavedEntityRepo.findOne({
          where: {
            user: { id: userId },
            type: SavedEntityType.EVENT,
            actionType: ActionType.FAVORITE,
            event: { id: entityId },
          },
          relations: ["event"],
        });
      } else if (entityType === SavedEntityType.SPACE) {
        existingFavourite = await this.SavedEntityRepo.findOne({
          where: {
            user: { id: userId },
            type: SavedEntityType.SPACE,
            actionType: ActionType.FAVORITE,
            space: { id: entityId },
          },
          relations: ["space"],
        });
      } else if (entityType === SavedEntityType.BRAND) {
        existingFavourite = await this.SavedEntityRepo.findOne({
          where: {
            user: { id: userId },
            type: SavedEntityType.BRAND,
            actionType: ActionType.FAVORITE,
            brand: { id: entityId },
          },
          relations: ["brand"],
        });
      }

      if (existingFavourite) {
        await this.SavedEntityRepo.remove(existingFavourite);
        res
          .status(HTTP_STATUS.OK)
          .json(
            handleResponse(
              `Removed from saved ${entityType.toLowerCase()}s successfully`
            )
          );
        return next();
      }

      const newFavourite = this.SavedEntityRepo.create({
        user: { id: userId },
        type: entityType,
        actionType: ActionType.FAVORITE,
        [entityType.toLowerCase()]: { id: entityId },
      });

      await this.SavedEntityRepo.save(newFavourite);

      res
        .status(HTTP_STATUS.CREATED)
        .json(
          handleResponse(
            `Added to saved ${entityType.toLowerCase()}s successfully`,
            newFavourite
          )
        );
    } catch (error) {
      logger.error(
        `UserController :: addToFavourites :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async addToFollow(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { entityId, entityType } = req.body; // Expecting entityId and entityType in the request body
      const userId = req.user?.id;

      // Validate the entity type
      if (!Object.values(SavedEntityType).includes(entityType)) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(handleResponse("Invalid entity type"));
        return next();
      }

      let existingFavourite;

      // Check for existing favourite based on the entity type
      if (entityType === SavedEntityType.EVENT) {
        existingFavourite = await this.SavedEntityRepo.findOne({
          where: {
            user: { id: userId },
            type: SavedEntityType.EVENT,
            event: { id: entityId },
            actionType: ActionType.FOLLOW,
          },
          relations: ["event"],
        });
      } else if (entityType === SavedEntityType.SPACE) {
        existingFavourite = await this.SavedEntityRepo.findOne({
          where: {
            user: { id: userId },
            type: SavedEntityType.SPACE,
            space: { id: entityId },
            actionType: ActionType.FOLLOW,
          },
          relations: ["space"],
        });
      } else if (entityType === SavedEntityType.BRAND) {
        existingFavourite = await this.SavedEntityRepo.findOne({
          where: {
            user: { id: userId },
            type: SavedEntityType.BRAND,
            brand: { id: entityId },
            actionType: ActionType.FOLLOW,
          },
          relations: ["brand"],
        });
      }

      if (existingFavourite) {
        await this.SavedEntityRepo.remove(existingFavourite);
        res
          .status(HTTP_STATUS.OK)
          .json(
            handleResponse(
              `${
                entityType.charAt(0).toUpperCase() +
                entityType.slice(1).toLowerCase()
              } Unfollowed Successfully`
            )
          );

        return next();
      }

      // Create a new SavedEntity object
      const newFavourite = this.SavedEntityRepo.create({
        user: { id: userId },
        type: entityType,
        actionType: ActionType.FOLLOW,
        [entityType.toLowerCase()]: { id: entityId }, // Map the relationship dynamically
      });

      // Save the favourite entity
      await this.SavedEntityRepo.save(newFavourite);

      res
        .status(HTTP_STATUS.CREATED)
        .json(
          handleResponse(
            `${
              entityType.charAt(0).toUpperCase() +
              entityType.slice(1).toLowerCase()
            } Followed Successfully`,
            newFavourite
          )
        );
    } catch (error) {
      logger.error(
        `UserController :: addToFavourites :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
}
