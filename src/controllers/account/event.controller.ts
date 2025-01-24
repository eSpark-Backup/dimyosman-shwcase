import { NextFunction, Request, RequestHandler, Response } from "express";
import { Brand, Events, RSVP, Spaces, User } from "../../entity";
import { ApiError } from "../../errors";
import { Repository } from "typeorm";
import { handleResponse, logger, parseCoverImages } from "../../utils";
import { CLOUD_FOLDERS, HTTP_STATUS, PAGINATION } from "../../constants";
import { uploadService } from "../../services";
import {
  ICustomRequest,
  IFileObject,
  IFileRequest,
  UploadResult,
} from "../../interfaces";
import fs from "fs";
import path from "path";
import { commonHelper } from "../../helpers";
export class EventController {
  constructor(
    private spaceRepo: Repository<Spaces>,
    private userRepo: Repository<User>,
    private brandRepo: Repository<Brand>,
    private eventRepo: Repository<Events>,
    private rsvpEventRepo: Repository<RSVP>
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
      let {
        eventName,
        eventCategory,
        details,
        status,
        brandId,
        spaceId,
        eventDate,
        coverOrder,
      } = req.body;
      const checkName = await this.eventRepo.findOne({ where: { eventName } });
      if (checkName) {
        throw new ApiError(
          "Event with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      coverOrder = coverOrder || [];
      coverFiles = commonHelper.reorderCoverFiles(coverFiles, coverOrder);
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
      newEvent.status = status;
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
        status,
        spaceId,
        eventDate,
        coverKeys,
      } = req.body;

      const space = await this.spaceRepo.findOne({ where: { id: spaceId } });
      if (!space) {
        throw new ApiError("Space not found", HTTP_STATUS.NOT_FOUND);
      }

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

      if (typeof coverKeys === "string" && !Array.isArray(coverKeys)) {
        coverKeys = coverKeys.split(",").map((item) => item.trim());
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

      if (imageFileObjects && oldEventImage !== imageUrls[0]?.url) {
        await uploadService.deleteFile(existingEvent.imageKey);
      }

      existingEvent.eventName = eventName || existingEvent.eventName;
      existingEvent.eventCategory =
        eventCategory || existingEvent.eventCategory;
      existingEvent.details = details || existingEvent.details;
      existingEvent.eventDate = eventDate || existingEvent.eventDate;
      existingEvent.space = space || existingEvent.space;
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

  async rsvpEvent(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { attendanceDates } = req.body;
      const event = await this.eventRepo.findOne({ where: { id } });
      if (!event) {
        throw new ApiError("Event not found", HTTP_STATUS.NOT_FOUND);
      }
      const user = await this.userRepo.findOne({ where: { id: req.user?.id } });
      if (!user) {
        throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
      }
      const newRsvpEvent = new RSVP();
      newRsvpEvent.user = user;
      newRsvpEvent.event = event;
      newRsvpEvent.attendanceDates = attendanceDates;
      await this.rsvpEventRepo.save(newRsvpEvent);

      res.status(200).json(handleResponse("RSVP Successful"));
      return next();
    } catch (error) {
      logger.error(
        `EventController :: RSVP Event :: ${(error as Error)?.message}`
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
      const { page, take, skip, tab } = req?.query;
      // Ensure skip and take are numbers
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      if (id && id !== "{id}") {
        const event = await this.eventRepo
          .createQueryBuilder("event")
          .where("event.id = :id", { id })
          .leftJoinAndSelect("event.brand", "brand")
          .leftJoinAndSelect("event.space", "space")
          .leftJoinAndSelect("space.brand", "brand")
          .getOne();

        if (!event) {
          res.status(200).json(handleResponse("Event not found"));
          return next();
        }

        if (typeof event.coverImages === "string") {
          event.coverImages = JSON.parse(event.coverImages);
        }

        res.status(200).json(handleResponse("Event Found Successfully", event));
        return next();
      }

      if (tab == "Event") {
        const [events, totalItems] = await this.eventRepo
          .createQueryBuilder("event")
          .leftJoinAndSelect("event.brand", "brand")
          .leftJoinAndSelect("event.space", "space")
          .leftJoinAndSelect("space.brand", "spaceBrand")

          .where("event.user = :userId", { userId: req.user?.id })
          .skip(skipNumber)
          .take(takeNumber)
          .orderBy("event.createdAt", "DESC")
          .getManyAndCount();

        if (events.length === 0) {
          res.status(200).json(handleResponse("No Events Found"));
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
      }
      if (tab === "RSVP") {
        try {
          const rsvpEventsWithCounts = await this.rsvpEventRepo
            .createQueryBuilder("rsvp")
            .leftJoinAndSelect("rsvp.event", "event")
            .leftJoinAndSelect("event.brand", "brand")
            .leftJoinAndSelect("event.space", "space")
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
            ) // Include RSVP count
            .where("rsvp.user = :userId", { userId: req.user?.id })
            .skip(skipNumber)
            .take(takeNumber)
            .orderBy("rsvp.createdAt", "DESC")
            .getRawAndEntities();

          // Extract entities and raw data
          const { entities: rsvpEvents, raw } = rsvpEventsWithCounts;

          // Format the results with RSVP count
          const formattedRsvpEvents = rsvpEvents.map((rsvp, index) => {
            const rawData = raw[index];
            parseCoverImages(rsvp.event);
            parseCoverImages(rsvp.event.brand);
            parseCoverImages(rsvp.event.space);

            const eventDate =
              rsvp.event.eventDate &&
              (rsvp.event.eventDate as [
                { startDate: string; endDate: string }
              ]);

            if (eventDate) {
              const currentDate = new Date();

              let eventStatus = "Ended"; // Default to ended if no condition is met

              if (currentDate < new Date(eventDate[0].startDate)) {
                eventStatus = "Upcoming"; // Event has not started yet
              } else if (
                currentDate >= new Date(eventDate[0].startDate) &&
                currentDate <= new Date(eventDate[0].endDate)
              ) {
                eventStatus = "Ongoing"; // Event is happening now
              }

              return {
                ...rsvp,
                rsvpCount: Number(rawData.event_rsvpCount) || 0,
                eventStatus, // Update the event status (Upcoming, Ongoing, Ended)
              };
            }

            return {
              ...rsvp,
              rsvpCount: Number(rawData.event_rsvpCount) || 0,
            };
          });

          // Handle empty results
          if (rsvpEvents.length === 0) {
            res.status(200).json(handleResponse("No RSVP Events Found"));
            return next();
          }
          const [, totalItems] = await this.rsvpEventRepo
            .createQueryBuilder("rsvp")
            .where("rsvp.user = :userId", { userId: req.user?.id })
            .getManyAndCount();

          // Return response
          res.status(200).json({
            data: formattedRsvpEvents,
            pagination: {
              totalItems: totalItems,
              currentPage: Math.ceil(skipNumber / takeNumber) + 1,
              pageSize: takeNumber,
            },
          });
        } catch (error) {
          logger.error(
            `EventController :: Fetch RSVP Events :: ${
              (error as Error)?.message
            }`
          );
          return next(error);
        }
      }
    } catch (error) {
      logger.error(
        `EventController :: getAllEvents :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
}
