import { NextFunction, Request, RequestHandler, Response } from "express";
import { Brand, Events, Spaces, User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger, parseCoverImages } from "../utils";
import { CLOUD_FOLDERS, HTTP_STATUS, PAGINATION } from "../constants";
import { uploadService } from "../services";
import { ICustomRequest, IFileRequest, UploadResult } from "../interfaces";

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
      const { files } = file;

      if (!files?.cover || !files?.image) {
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

      const FolderName = `${CLOUD_FOLDERS.EVENT}/${eventName}`;
      const coverUrls = await uploadService.uploadMultipleFiles(
        files.cover,
        FolderName
      );

      const imageUrls = (await uploadService.uploadMultipleFiles(
        files.image,
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

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Event Created Successfully", event));
      return next();
    } catch (error) {
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
      const { files } = file;
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
      if (typeof coverKeys === "string") {
        coverKeys = coverKeys.split(",").map((key) => key.trim());
      }

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

      const coverUrls: UploadResult[] = files?.cover
        ? ((await uploadService.uploadMultipleFiles(
            files.cover,
            FolderName
          )) as UploadResult[])
        : oldCoverImages;

      const imageUrls = (
        files?.image
          ? await uploadService.uploadMultipleFiles(files.image, FolderName)
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

      if (files?.image && oldEventImage !== imageUrls[0]?.url) {
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

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Event Updated Successfully"));
      return next();
    } catch (error) {
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
