import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  ActionType,
  Brand,
  BrandStatus,
  Events,
  SavedEntity,
  SavedEntityType,
  User,
} from "../../entity";
import { ApiError } from "../../errors";
import { Repository } from "typeorm";
import {
  emitEvent,
  generateShareableLink,
  handleResponse,
  logger,
  parseCoverImages,
} from "../../utils";
import { commonHelper } from "../../helpers";

import {
  BRAND_STATUS,
  CLOUD_FOLDERS,
  HTTP_STATUS,
  NEW_NOTIFICATION,
  PAGINATION,
  REFETCH_CHATS,
} from "../../constants";
import { uploadService } from "../../services";
import {
  ICustomRequest,
  IFileObject,
  IFileRequest,
  UploadResult,
} from "../../interfaces";
import fs from "fs";
import path from "path";
import { Chat, Message, Notification } from "@/models";
export class BrandController {
  constructor(
    private brandRepo: Repository<Brand>,
    private userRepo: Repository<User>,
    private chatModel: typeof Chat,
    private notificationModel: typeof Notification,
    private eventsRepo: Repository<Events>,

    private messageModel: typeof Message,
    private savedEntity: Repository<SavedEntity>
  ) {}

  async sendMessage(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { message, senderBrandId } = req.body;
      let receiverEvent;
      const receiverBrand = await this.brandRepo
        .createQueryBuilder("brand")
        .where("brand.id = :id", { id })
        .leftJoinAndSelect("brand.user", "user")
        .getOne();

      const senderBrand = await this.brandRepo
        .createQueryBuilder("brand")
        .where("brand.id = :senderBrandId", { senderBrandId })
        .leftJoinAndSelect("brand.user", "user")
        .getOne();
      if (!receiverBrand) {
        receiverEvent = await this.eventsRepo
          .createQueryBuilder("event")
          .where("event.id = :id", { id })
          .leftJoinAndSelect("event.user", "user")
          .getOne();

        if (!receiverEvent) {
          res.status(200).json(handleResponse("Event/Brand not found"));
          return next();
        }
      }
      if (receiverBrand) {
        const members = [req.user?._id, receiverBrand.user.userChatId];

        const chat = await this.chatModel.create({
          members,
          name: `${receiverBrand.brandName}`,
          directChat: true,
          senderBrand: senderBrand.id,

          receiverBrand: receiverBrand.id,
          creator: req.user?._id,
        });
        await this.notificationModel.create({
          user: receiverBrand.user.userChatId,
          title: `New message received for ${receiverBrand.brandName}`,
          message,
          metadata: {
            name: `${senderBrand.brandName} sent you a message on Brand ${receiverBrand.brandName}`,  
            senderBrandImage: senderBrand.brandImage,
            senderBrandName: senderBrand.brandName,
            chatId: chat.id.toString(),
          },
          type: "info",
        });
        const ChatId = chat.id.toString();

        const messageForDB = {
          content: message,
          sender: req.user?._id,
          chat: ChatId,
        };
        await this.messageModel.create(messageForDB);

        emitEvent(req, REFETCH_CHATS, members);

        emitEvent(req, NEW_NOTIFICATION, [receiverBrand.user.userChatId], {
          name: `${senderBrand.brandName} sent you a message on Brand ${receiverBrand.brandName}`,
          senderBrandImage: senderBrand.brandImage,
          senderBrandName: senderBrand.brandName,
          chatId: ChatId,
        });
      } else if (receiverEvent) {
        const members = [req.user?._id, receiverEvent.user.userChatId];

        const chat = await this.chatModel.create({
          members,
          name: `${receiverEvent.eventName}`,
          directChat: true,
          senderBrand: senderBrand.id,
          receiverEvent: receiverEvent.id,
          creator: req.user?._id,
        });
        await this.notificationModel.create({
          user: receiverEvent.user.userChatId,
          title: `New message received for ${receiverEvent.eventName}`,
          message,
          metadata: {
            name: `${senderBrand.brandName} sent you a message on Event ${receiverEvent.eventName}`,  
            senderBrandImage: senderBrand.brandImage,
            senderBrandName: senderBrand.brandName,
            chatId: chat.id.toString(),
          },
          type: "info",
        });
        const ChatId = chat.id.toString();
        const messageForDB = {
          content: message,
          sender: req.user?._id,
          chat: ChatId,
        };
        await this.messageModel.create(messageForDB);
        emitEvent(req, REFETCH_CHATS, members);

        emitEvent(req, NEW_NOTIFICATION, [receiverEvent.user.userChatId], {
          name: `${senderBrand.brandName} sent you a message on Event ${receiverEvent.eventName}`,
          senderBrandImage: senderBrand.brandImage,
          senderBrandName: senderBrand.brandName,
          chatId: ChatId,
        });
      }

      res.status(200).json(handleResponse("Message Sent Successfully"));
      return next();
    } catch (error) {
      next(error);
    }
  }

  async createBrand(
    req: ICustomRequest,
    file: IFileRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coverFilesPath = path.join(process.cwd(), "uploads");
      const imageFilesPath = path.join(process.cwd(), "uploads");
      let coverFiles = fs
        .readdirSync(coverFilesPath)
        .filter((file) => file.startsWith("cover")); // Filter for cover files
      const imageFiles = fs
        .readdirSync(path.join(imageFilesPath))
        .filter((file) => file.startsWith("image")); // Filter for image files

      if (!coverFiles.length || !imageFiles.length) {
        throw new ApiError(
          "Missing required files: 'cover' or 'image'",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const {
        brandName,
        brandCategory,
        details,
        location,
        status,
        coverOrder,
      } = req.body;
      const checkName = await this.brandRepo.findOne({ where: { brandName } });
      if (checkName) {
        throw new ApiError(
          "Brand with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      coverFiles = commonHelper.reorderCoverFiles(coverFiles, coverOrder);

      const coverFileObjects: IFileObject[] = coverFiles.map((file) =>
        commonHelper.createFileObject(path.join(coverFilesPath, file), "cover")
      );

      const imageFileObjects: IFileObject[] = imageFiles.map((file) =>
        commonHelper.createFileObject(path.join(imageFilesPath, file), "image")
      );

      const FolderName = `${CLOUD_FOLDERS.BRAND}/${brandName}`;
      const coverUrls = (await uploadService.uploadMultipleFiles(
        coverFileObjects,
        FolderName
      )) as UploadResult[];

      const imageUrls = (await uploadService.uploadMultipleFiles(
        imageFileObjects,
        FolderName
      )) as UploadResult[];

      const userId = req.user?.id;
      const user = await this.userRepo.findOne({ where: { id: userId } });

      const newBrand = new Brand();
      newBrand.brandName = brandName;
      newBrand.brandCategory = brandCategory;
      newBrand.details = details;
      newBrand.location = location;
      newBrand.status = status;
      newBrand.user = user as User;
      newBrand.coverImages = JSON.stringify(coverUrls) as Object;
      newBrand.brandImage = imageUrls[0].url as any;
      newBrand.imageKey = imageUrls[0].public_id;
      await this.brandRepo.save(newBrand);

      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      });
      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Brand Created Successfully"));
    } catch (error) {
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);
      if (files.length > 0) {
        files.forEach((file) => {
          const filePath = path.join(uploadsPath, file);
          fs.unlinkSync(filePath);
          logger.error(`Deleted file From Catch Block: ${filePath}`);
        });
      }
      logger.error(
        `BrandController :: CreateBrand :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async updateBrand(
    req: ICustomRequest,
    file: IFileRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coverFilesPath = path.join(process.cwd(), "uploads");
      const imageFilesPath = path.join(process.cwd(), "uploads");
      const coverFiles = fs
        .readdirSync(coverFilesPath)
        .filter((file) => file.startsWith("cover")); // Filter for cover files
      const imageFiles = fs
        .readdirSync(path.join(imageFilesPath))
        .filter((file) => file.startsWith("image")); // Filter for image files

      const coverFileObjects: IFileObject[] = coverFiles.map((file) =>
        commonHelper.createFileObject(path.join(coverFilesPath, file), "cover")
      );

      // Create IFileObject array for image files
      const imageFileObjects: IFileObject[] = imageFiles.map((file) =>
        commonHelper.createFileObject(path.join(imageFilesPath, file), "image")
      );

      const { id } = req.params;
      let { brandName, brandCategory, details, location, status, coverKeys } =
        req.body;

      if (Array.isArray(coverKeys)) {
        coverKeys = coverKeys.filter((key) => typeof key === "string");
      }

      if (typeof coverKeys === "string" && !Array.isArray(coverKeys)) {
        coverKeys = coverKeys.split(",").map((item) => item.trim());
      }

      const existingBrand = await this.brandRepo.createQueryBuilder("brand")
        .where("brand.id = :id", { id })
        .leftJoinAndSelect("brand.user", "user")
        .getOne();
      if (!existingBrand) {
        return next(res.status(404).json({ message: "Brand not found" }));
      }
      if(existingBrand.user.id !== req.user?.id){
        throw new ApiError("You are not authorized to update this brand", HTTP_STATUS.UN_AUTHORIZED);
      }
      if (
        existingBrand.status == BrandStatus.ARCHIVE &&
        status == BrandStatus.PUBLISH
      ) {
        throw new ApiError(
          "You cannot publish an archived brand, first draft it",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const checkName = await this.brandRepo.findOne({ where: { brandName } });
      if (checkName && checkName.brandName !== existingBrand.brandName) {
        throw new ApiError(
          "Brand with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      let oldCoverImages: UploadResult[] = [];

      const FolderName = `${CLOUD_FOLDERS.BRAND}/${brandName.trim()}`;
      if (typeof existingBrand.coverImages === "string") {
        try {
          oldCoverImages = JSON.parse(
            existingBrand.coverImages
          ) as UploadResult[];
        } catch (error) {
          logger.error("Failed to parse coverImages:", error);
          oldCoverImages = [];
        }
      } else {
        oldCoverImages = [];
      }

      const oldBrandImage = existingBrand.brandImage;

      const coverUrls = (
        coverFileObjects?.length > 0
          ? await uploadService.uploadMultipleFiles(
              coverFileObjects,
              FolderName
            )
          : []
      ) as UploadResult[];

      const imageUrls = (
        imageFileObjects?.length > 0
          ? await uploadService.uploadMultipleFiles(
              imageFileObjects,
              FolderName
            )
          : [{ url: oldBrandImage }]
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

      if (imageFileObjects && oldBrandImage !== imageUrls[0]?.url) {
        await uploadService.deleteFile(existingBrand.imageKey);
      }

      existingBrand.brandName = brandName || existingBrand.brandName;
      existingBrand.brandCategory =
        brandCategory || existingBrand.brandCategory;
      existingBrand.details = details || existingBrand.details;
      existingBrand.location = location || existingBrand.location;
      existingBrand.status = status || existingBrand.status;
      existingBrand.coverImages = JSON.stringify(coverUrls) as Object;
      existingBrand.brandImage = imageUrls[0].url;
      existingBrand.imageKey = imageUrls[0].public_id;

      const UpdatedBrand = await this.brandRepo.update(id, existingBrand);
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Brand Updated Successfully", UpdatedBrand));
    } catch (error) {
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        logger.error(`Deleted file: ${filePath}`);
      });
      logger.error(
        `BrandController :: updateBrand :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getAllBrands(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { page, take, skip } = req?.query;
      // Ensure skip and take are numbers
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      if (id && id !== "{id}") {
        const singleBrand = await this.brandRepo
          .createQueryBuilder("brand")
          .where("brand.id = :id", { id })
          .leftJoinAndSelect("brand.user", "user")

          .getOne();

        if (!singleBrand) {
          res.status(200).json(handleResponse("Brand not found"));
          return next();
        }

        if (typeof singleBrand.coverImages === "string") {
          singleBrand.coverImages = JSON.parse(singleBrand.coverImages);
        }
        const singleEvent = await this.eventsRepo
          .createQueryBuilder("event")
          .leftJoinAndSelect("event.user", "user")
          .andWhere("event.brand = :eventId", { eventId: singleBrand.id })
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
                  ), '{}')`, // Ensure null values don't break the JSON
                "event_rsvp"
              )
              .from("RSVP", "rsvp")
              .where("rsvp.event = event.id")
              .andWhere("rsvp.user = :userId", { userId: req.user?.id })
              .limit(1);
          }, "event_rsvp")

          .getRawAndEntities();

        const savedEntities = await this.savedEntity
          .createQueryBuilder("savedEntity")
          .where("savedEntity.ActionType = :actionType", {
            actionType: ActionType.FAVORITE,
          })
          .andWhere("savedEntity.type = :type", { type: SavedEntityType.BRAND })
          .leftJoinAndSelect("savedEntity.brand", "brand")
          .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
          .andWhere("brand.id = :brandId", { brandId: singleBrand.id })
          .getOne();

        const followedEntities = await this.savedEntity
          .createQueryBuilder("savedEntity")
          .where("savedEntity.ActionType = :actionType", {
            actionType: ActionType.FOLLOW,
          })
          .andWhere("savedEntity.type = :type", { type: SavedEntityType.BRAND })
          .leftJoinAndSelect("savedEntity.brand", "brand")
          .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
          .andWhere("brand.id = :brandId", { brandId: singleBrand.id })
          .getOne();

        const [getFollowedCount, getLikedCount] = await Promise.all([
          this.savedEntity
            .createQueryBuilder("savedEntity")
            .where("savedEntity.ActionType = :actionType", {
              actionType: ActionType.FOLLOW,
            })
            .andWhere("savedEntity.type = :type", {
              type: SavedEntityType.BRAND,
            })
            .leftJoinAndSelect("savedEntity.brand", "brand")
            .andWhere("brand.id = :brandId", { brandId: singleBrand.id })
            .getCount(),
          this.savedEntity
            .createQueryBuilder("savedEntity")
            .where("savedEntity.ActionType = :actionType", {
              actionType: ActionType.FAVORITE,
            })
            .andWhere("savedEntity.type = :type", {
              type: SavedEntityType.BRAND,
            })
            .leftJoinAndSelect("savedEntity.brand", "brand")
            .andWhere("brand.id = :brandId", { brandId: singleBrand.id })
            .getCount(),
        ]);

        const { entities: rsvpEvents, raw } = singleEvent;
        const totalEventsCount = rsvpEvents.length;

        const brandEvents = rsvpEvents.map((rsvp, index) => {
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

        const isFavourite = savedEntities ? true : false;
        const isFollowed = followedEntities ? true : false;

        const brand = {
          brandEvents,
          ...singleBrand,
          followedCount: getFollowedCount,
          shareableLink: generateShareableLink({
            id: singleBrand.id,
            type: "brand",
          }),
          likedCount: getLikedCount,
          totalEventsCount,
          isFavourite,
          isFollowed,
        };

        res.status(200).json(handleResponse("Brand Found Successfully", brand));
        return next();
      }

      const [brands, totalItems] = await this.brandRepo
        .createQueryBuilder("brand")
        .where("brand.user = :userId", { userId: req.user?.id })
        .leftJoinAndSelect("brand.user", "user")

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

      const groupedBrands = {
        publishedBrands: brands
          .filter((brand) => brand.status === BrandStatus.PUBLISH)
          .map((brand) => ({
            ...brand,
            shareableLink: generateShareableLink({
              id: brand.id,
              type: "brand",
            }),
          })),
        draftBrands: brands.filter((brand) => brand.status === BrandStatus.DRAFT),
        archivedBrands: brands.filter((brand) => brand.status === BrandStatus.ARCHIVE),
        allBrands: brands.map((brand) =>
          brand.status === BrandStatus.PUBLISH
            ? {
                ...brand,
                shareableLink: generateShareableLink({
                  id: brand.id,
                  type: "brand",
                }),
              }
            : brand
        ),
          
        totalItems,
      };
      

      res.status(200).json(
        handleResponse("Brands Fetched Successfully", {
          groupedBrands,
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

  async deleteBrand(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const brand = await this.brandRepo.findOne({
        where: { id, user: { id: req.user?.id } },
      });

      if (!brand) {
        res
          .status(200)
          .json(handleResponse("Brand not found or does not belong to user"));
        return;
      }

      await this.brandRepo.delete(id);

      res.status(200).json(handleResponse("Brand Deleted Successfully"));
    } catch (error) {
      next(error);
    }
  }
}
