import { NextFunction, Request, RequestHandler, Response } from "express";
import { Brand, Events, Spaces, User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger, parseCoverImages } from "../utils";
import { CLOUD_FOLDERS, HTTP_STATUS, PAGINATION } from "../constants";
import { uploadService } from "../services";
import {
  ICustomRequest,
  IFileObject,
  IFileRequest,
  UploadResult,
} from "../interfaces";
import fs from "fs";
import path from "path";
import { commonHelper } from "../helpers";
export class EventController {
  constructor(
    private spaceRepo: Repository<Spaces>,
    private userRepo: Repository<User>,
    private brandRepo: Repository<Brand>,
    private eventRepo: Repository<Events>
  ) {}

  async createEvent(
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

      if (!coverFiles.length || !imageFiles.length) {
        throw new ApiError(
          "Missing required files: 'cover' or 'image'",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const {
        eventName,
        eventCategory,
        details,
        location,
        status,
        brandId,
        spaceId,
        eventDate,
        minLeaseDays,
      } = req.body;
      const checkName = await this.eventRepo.findOne({ where: { eventName } });
      if (checkName) {
        throw new ApiError(
          "Event with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const coverFileObjects: IFileObject[] = coverFiles.map((file) =>
        commonHelper.createFileObject(path.join(coverFilesPath, file), "cover")
      );

      const imageFileObjects: IFileObject[] = imageFiles.map((file) =>
        commonHelper.createFileObject(path.join(imageFilesPath, file), "image")
      );

      const FolderName = `${CLOUD_FOLDERS.EVENT}/${eventName}`;
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
      const brand = await this.brandRepo.findOne({ where: { id: brandId } });
      if (!brand) {
        throw new ApiError("Brand not found", HTTP_STATUS.NOT_FOUND);
      }
      const space = await this.spaceRepo.findOne({ where: { id: spaceId } });
      if (!space) {
        throw new ApiError("Space not found", HTTP_STATUS.NOT_FOUND);
      }

      const newEvent = new Events();
      newEvent.eventName = eventName;
      newEvent.eventCategory = eventCategory;
      newEvent.details = details;
      newEvent.location = location;
      newEvent.status = status;
      newEvent.minLeaseDays = minLeaseDays;
      newEvent.user = user as User;
      newEvent.brand = brand as Brand;
      newEvent.space = space as Spaces;
      newEvent.eventDate = eventDate;
      newEvent.coverImages = JSON.stringify(coverUrls) as Object;
      newEvent.eventImage = imageUrls[0].url as string;
      newEvent.imageKey = imageUrls[0].public_id;
      const event = await this.eventRepo.save(newEvent);
      event.coverImages = JSON.parse(event.coverImages as unknown as string);

      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Event Created Successfully", event));
      return next();
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
        `EventController :: CreateEvent :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async updateEvent(
    req: ICustomRequest,
    file: IFileRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      let {
        eventName,
        eventCategory,
        details,
        location,
        status,
        eventDate,
        coverKeys,
      } = req.body;

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

      if (Array.isArray(coverKeys)) {
        coverKeys = coverKeys.filter((key) => typeof key === "string");
      }
      const existingEvent = await this.eventRepo.findOne({ where: { id } });
      if (!existingEvent) {
        return next(res.status(404).json({ message: "Event not found" }));
      }
      if (eventName) {
        const checkName = await this.eventRepo.findOne({
          where: { eventName },
        });
        if (checkName && checkName.eventName !== existingEvent.eventName) {
          throw new ApiError(
            "Event with this name already exists",
            HTTP_STATUS.BAD_REQUEST
          );
        }
      }
      let oldCoverImages: UploadResult[] = [];

      const FolderName = `${CLOUD_FOLDERS.EVENT}/${eventName}`;

      if (typeof existingEvent.coverImages === "string") {
        try {
          oldCoverImages = JSON.parse(
            existingEvent.coverImages
          ) as UploadResult[];
        } catch (error) {
          logger.error("Failed to parse coverImages:", error);
          oldCoverImages = [];
        }
      } else {
        oldCoverImages = [];
      }

      const oldEventImage = existingEvent.eventImage;

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
          : [{ url: oldEventImage }]
      ) as UploadResult[];

      for (const oldCoverImage of oldCoverImages) {
        if (coverKeys.length > 0) {
          if (!coverKeys.includes(oldCoverImage.public_id)) {
            await uploadService.deleteFile(oldCoverImage.public_id);
          } else {
            coverUrls.push(oldCoverImage);
          }
        } else {
          if (
            !coverUrls.some((url) => url.public_id === oldCoverImage.public_id)
          ) {
            await uploadService.deleteFile(oldCoverImage.public_id);
          }
        }
      }

      if (imageFileObjects && oldEventImage !== imageUrls[0]?.url) {
        await uploadService.deleteFile(existingEvent.imageKey);
      }

      existingEvent.eventName = eventName || existingEvent.eventName;
      existingEvent.eventCategory =
        eventCategory || existingEvent.eventCategory;
      existingEvent.details = details || existingEvent.details;
      existingEvent.location = location || existingEvent.location;
      existingEvent.eventDate = eventDate || existingEvent.eventDate;
      existingEvent.status = status || existingEvent.status;
      existingEvent.coverImages = JSON.stringify(coverUrls) as Object;
      existingEvent.eventImage = imageUrls[0].url;
      existingEvent.imageKey = imageUrls[0].public_id;

      await this.eventRepo.update(id, existingEvent);
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Event Updated Successfully"));
      return next();
    } catch (error) {
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        logger.error(`Deleted file: ${filePath}`);
      });
      logger.error(
        `EventController :: updateEvent :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getAllEvents(
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
        const event = await this.eventRepo.findOne({
          where: { id },
          relations: ["brand", "space"],
        });

        if (!event) {
          res.status(404).json(handleResponse("Event not found"));
          return next();
        }

        if (typeof event.coverImages === "string") {
          event.coverImages = JSON.parse(event.coverImages);
        }

        res.status(200).json(handleResponse("Event Found Successfully", event));
        return next();
      }

      const [events, totalItems] = await this.eventRepo.findAndCount({
        where: { user: { id: req.user?.id } },
        relations: ["brand", "space"],

        skip: skipNumber,
        take: takeNumber,
        order: {
          createdAt: "DESC",
        },
      });

      if (events.length === 0) {
        res.status(404).json(handleResponse("No Events Found"));
        return next();
      }

      events.forEach((event) => {
        parseCoverImages(event);
        parseCoverImages(event.brand);
        parseCoverImages(event.space);
      });

      res.status(200).json(
        handleResponse("Events Fetched Successfully", {
          events,
          pagination: {
            totalItems,
            currentPage: parseInt(page as string, 10),
            pageSize: takeNumber,
            totalPages: Math.ceil(totalItems / takeNumber),
          },
        })
      );
      return next();
    } catch (error) {
      next(error);
    }
  }
}
