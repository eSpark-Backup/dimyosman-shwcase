import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  Brand,
  Events,
  Spaces,
  User,
  LeaseSpace,
  LeaseStatus,
  SavedEntity,
  SavedEntityType,
  ActionType,
  SpaceStatus,
  EventStatus,
} from "../../entity";
import { ApiError } from "../../errors";
import { Like, Repository } from "typeorm";
import {
  calculatePricing,
  emitEvent,
  generateShareableLink,
  handleResponse,
  logger,
} from "../../utils";
import {
  CLOUD_FOLDERS,
  HTTP_STATUS,
  NEW_MESSAGE,
  NEW_NOTIFICATION,
  NEW_REQUEST,
  PAGINATION,
  PAYMENT_NOTIFICATION,
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
export class SpaceController {
  constructor(
    private spaceRepo: Repository<Spaces>,
    private userRepo: Repository<User>,
    private brandRepo: Repository<Brand>,
    private eventsRepo: Repository<Events>,
    private leaseSpaceRepo: Repository<LeaseSpace>,
    private chatModel: typeof Chat,
    private userModel: typeof UserForChat,
    private notificationModel: typeof Notification,
    private messageModel: typeof Message,
    private savedEntity: Repository<SavedEntity>
  ) {}

  async getSpaceForEvent(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.id;
      let { page, pageSize, check, eventId } = req.query;
      const skipNumber = Number(page);
      const takeNumber = Number(pageSize);

      // Fetching spaces where the user is the space owner
      const [spaces, totalSpaces] = await this.spaceRepo
        .createQueryBuilder("space")
        .leftJoinAndSelect("space.brand", "brand")
        .leftJoinAndSelect("space.user", "user")
        .where("space.status = :status", { status: SpaceStatus.PUBLISH })
        .andWhere("space.user = :userId", { userId })

        .skip(Number(skipNumber) || 0)
        .take(Number(takeNumber) || 10)
        .select([
          "space.id",
          "space.spaceName",
          "space.spaceCategory",
          "brand.brandName",
          "brand.id",
          "brand.location",
          "space.createdAt",
        ])
        .orderBy("space.createdAt", "DESC")
        .getManyAndCount();

      // Fetching spaces leased by the user (tenant)
      const queryBuilder = this.leaseSpaceRepo
        .createQueryBuilder("leaseSpace")
        .leftJoinAndSelect("leaseSpace.space", "space")
        .leftJoinAndSelect("leaseSpace.tenant", "tenant")
        .leftJoinAndSelect("leaseSpace.event", "event")
        .leftJoinAndSelect("space.brand", "brand")
        .leftJoinAndSelect("space.user", "user")
        .select([
          "leaseSpace.id",
          "leaseSpace.contractDetails",
          "leaseSpace.isUsed",
          "event.id",
          "leaseSpace.status",
          "tenant.id",
          "space.id",
          "space.spaceName",
          "space.createdAt",
          "brand.brandName",
          "brand.location",
        ])
        .andWhere("tenant.id = :userId", { userId })
        .andWhere("leaseSpace.status = :status", {
          status: LeaseStatus.ACTIVE,
        });

      if (check) {
        queryBuilder.andWhere("leaseSpace.isUsed = :isUsed", { isUsed: false });
      } else {
        queryBuilder.andWhere(
          "(leaseSpace.event IS NULL OR leaseSpace.event = :eventId)",
          { eventId }
        );
      }

      const [tenantSpaces, totalTenantSpaces] = await queryBuilder
        .skip(Number(skipNumber) || 0)
        .take(Number(takeNumber) || 10)
        .getManyAndCount();

      if (totalSpaces === 0 && totalTenantSpaces === 0) {
        throw new ApiError("No spaces found", HTTP_STATUS.OK);
      }

      if (spaces.length > 0) {
        for (const space of spaces) {
          const events = await this.eventsRepo
            .createQueryBuilder("event")
            .where("event.space = :spaceId", { spaceId: space.id })
            .andWhere("event.status = :status",{status:EventStatus.PUBLISH})
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
      }
      if (tenantSpaces.length > 0) {
        //parse the contractDetails field
        for (const tenantSpace of tenantSpaces) {
          tenantSpace.contractDetails = JSON.parse(
            tenantSpace.contractDetails as unknown as string
          );
        }
      }
      // Preparing the result to return in the response
      const result = {
        availableSpaces: spaces,
        tenantSpaces: tenantSpaces,
        pagination: {
          totalItems: totalSpaces + totalTenantSpaces,
          currentPage: Number(skipNumber) || 0,
          pageSize: Number(takeNumber) || 10,
          totalPages: Math.ceil(
            (totalSpaces + totalTenantSpaces) / (Number(takeNumber) || 10)
          ),
        },
      };
      res.status(HTTP_STATUS.OK).json(handleResponse("Spaces fetched", result));
      return next();
    } catch (error) {
      logger.error(
        `Error fetching available spaces: ${(error as Error).message}`
      );
      return next(error);
    }
  }

  async paymentVerification(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const userId = req.user.id;
    try {
      const leaseSpace = await this.leaseSpaceRepo
        .createQueryBuilder("leaseSpace")
        .where("leaseSpace.id = :id", { id })
        .leftJoinAndSelect("leaseSpace.tenant", "tenant")
        .leftJoinAndSelect("leaseSpace.brand", "brand")
        .leftJoinAndSelect("leaseSpace.space", "space")
        .leftJoinAndSelect("leaseSpace.owner", "owner")
        .getOne();
      if (!leaseSpace) {
        throw new ApiError("Lease space not found", HTTP_STATUS.BAD_REQUEST);
      }
      if (userId !== leaseSpace.tenant.id && userId !== leaseSpace.owner.id) {
        throw new ApiError(
          "You are not authorized to verify this payment",
          HTTP_STATUS.FORBIDDEN
        );
      }
      if (userId == leaseSpace.tenant.id) {
        if (leaseSpace.status !== LeaseStatus.VERIFY_AND_PAY) {
          throw new ApiError(
            "You are not authorized to verify this payment",
            HTTP_STATUS.FORBIDDEN
          );
        }
        leaseSpace.status = LeaseStatus.PENDING;
        await this.leaseSpaceRepo.save(leaseSpace);
        await this.notificationModel.create({
          user: leaseSpace.owner.userChatId,
          title: `Received Request For Payment Verification`,
          metadata: {
            senderImage: leaseSpace.brand.brandImage,
            redirect: "Tenant",
          },

          message: `Tenant ${leaseSpace.tenant.name} has requested for payment verification of the ${leaseSpace.space.spaceName} space`,
          type: "info",
        }),
          emitEvent(req, PAYMENT_NOTIFICATION, [leaseSpace.owner.userChatId], {
            name: `Tenant ${leaseSpace.tenant.name} has requested for payment verification of the ${leaseSpace.space.spaceName} space`,
            senderImage: leaseSpace.brand.brandImage,
            receiverId: leaseSpace.owner.userChatId,
            redirect: "Tenant",
          });
        res
          .status(HTTP_STATUS.OK)
          .json(
            handleResponse("Payment Verification Request Sent Successfully")
          );
        return next();
      } else if (userId == leaseSpace.owner.id) {
        if (leaseSpace.status !== LeaseStatus.PENDING) {
          throw new ApiError(
            "You are not authorized to verify this payment",
            HTTP_STATUS.FORBIDDEN
          );
        }
        leaseSpace.status = LeaseStatus.ACTIVE;
        await this.leaseSpaceRepo.save(leaseSpace);
        await this.notificationModel.create({
          user: leaseSpace.tenant.userChatId,
          title: `Payment Verified`,
          metadata: {
            senderImage: leaseSpace.space.spaceImage,
            redirect: "Lease",
          },
          message: `Owner ${leaseSpace.owner.name} has verified the payment for the ${leaseSpace.space.spaceName} space`,
          type: "info",
        }),
          emitEvent(req, PAYMENT_NOTIFICATION, [leaseSpace.tenant.userChatId], {
            name: `Owner ${leaseSpace.owner.name} has verified the payment`,
            senderImage: leaseSpace.space.spaceImage,
            receiverId: leaseSpace.tenant.userChatId,
            redirect: "Lease",
          });
        res
          .status(HTTP_STATUS.OK)
          .json(handleResponse("Payment Verified Successfully"));
        return next();
      }
    } catch (error) {
      logger.error(
        `SpaceController :: paymentVerification :: ${(error as Error)?.message}`
      );

      return next(error);
    }
  }
  async tenantUploadSignature(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const imageFilesPath = path.join(process.cwd(), "uploads");

      const tenant = await this.userRepo.findOne({
        where: { id: req.user.id },
      });
      if (!tenant) {
        throw new ApiError("Tenant not found", HTTP_STATUS.BAD_REQUEST);
      }

      const leaseSpace = await this.leaseSpaceRepo
        .createQueryBuilder("leaseSpace")
        .where("leaseSpace.id = :id", { id })
        .leftJoinAndSelect("leaseSpace.tenant", "tenant")
        .getOne();
      if (!leaseSpace) {
        throw new ApiError("Lease space not found", HTTP_STATUS.BAD_REQUEST);
      }

      if (leaseSpace.tenant.id !== tenant.id) {
        throw new ApiError(
          "You are not authorized to sign this lease",
          HTTP_STATUS.FORBIDDEN
        );
      }

      const imageFiles = fs
        .readdirSync(imageFilesPath)
        .filter((file) => file.startsWith("image"));
      if (!imageFiles.length) {
        throw new ApiError(
          "Missing required signature file",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const imageFileObjects = imageFiles.map((file) =>
        commonHelper.createFileObject(path.join(imageFilesPath, file), "image")
      );

      const FolderName = `${
        CLOUD_FOLDERS.SPACE
      }/CONTRACT/${tenant.name.trim()}`;
      const imageUrls = (await uploadService.uploadMultipleFiles(
        imageFileObjects,
        FolderName
      )) as UploadResult[];

      leaseSpace.tenantSign = imageUrls[0].url as string;
      leaseSpace.tenantSignImageKey = imageUrls[0].public_id;
      leaseSpace.status = LeaseStatus.VERIFY_AND_PAY;

      await this.leaseSpaceRepo.save(leaseSpace);

      imageFiles.forEach((file) => {
        const filePath = path.join(imageFilesPath, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Tenant Signature Uploaded Successfully"));
    } catch (error) {
      logger.error(
        `SpaceController :: tenantUploadSignature :: ${
          (error as Error)?.message
        }`
      );

      const uploadsPath = path.join(process.cwd(), "uploads");

      fs.readdirSync(uploadsPath).forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        logger.error(`Deleted file: ${filePath}`);
      });

      return next(error);
    }
  }

  async leaseSpace(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { spaceId, tenantId, chatId, contractDetails, brandId } = req.body;
      const imageFilesPath = path.join(process.cwd(), "uploads");
      const space = await this.spaceRepo
        .createQueryBuilder("space")
        .where("space.id = :spaceId", { spaceId })
        .leftJoinAndSelect("space.user", "user")
        .getOne();
      if (!space) {
        throw new ApiError("Space not found", HTTP_STATUS.BAD_REQUEST);
      }
      const brand = await this.brandRepo
        .createQueryBuilder("brand")
        .where("brand.id = :brandId", { brandId })
        .getOne();
      const imageFiles = fs
        .readdirSync(path.join(imageFilesPath))
        .filter((file) => file.startsWith("image")); // Filter for image files

      if (!imageFiles.length) {
        throw new ApiError(
          "Missing required files: 'image'",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const imageFileObjects: IFileObject[] = imageFiles.map((file) =>
        commonHelper.createFileObject(path.join(imageFilesPath, file), "image")
      );

      const tenant = await this.userRepo.findOne({
        where: { id: tenantId },
      });
      if (!tenant) {
        throw new ApiError("Tenant not found", HTTP_STATUS.BAD_REQUEST);
      }

      const owner = await this.userRepo.findOne({ where: { id: req.user.id } });
      if (!owner) {
        throw new ApiError("Owner not found", HTTP_STATUS.BAD_REQUEST);
      }
      if (owner.id != space.user.id) {
        throw new ApiError(
          "You are not the owner of this space",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const FolderName = `${CLOUD_FOLDERS.SPACE}/CONTRACT/${owner.name.trim()}`;
      const imageUrls = (await uploadService.uploadMultipleFiles(
        imageFileObjects,
        FolderName
      )) as UploadResult[];
      const leaseSpace = new LeaseSpace();
      leaseSpace.owner = owner;
      leaseSpace.space = space;
      leaseSpace.brand = brand;
      leaseSpace.chatId = chatId;
      leaseSpace.ownerSign = imageUrls[0].url as string;
      leaseSpace.ownerSignImageKey = imageUrls[0].public_id;
      leaseSpace.tenant = tenant;
      leaseSpace.contractDetails = JSON.stringify(contractDetails) as Object;

      await this.leaseSpaceRepo.save(leaseSpace);
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Lease Contract Sent Successfully"));
      return next();
    } catch (error) {
      logger.error(
        `SpaceController :: leaseSpace :: ${(error as Error)?.message}`
      );
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        logger.error(`Deleted file: ${filePath}`);
      });

      return next(error);
    }
  }

  async inquireSpace(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { receiverSpaceId, message, receiverBrandId, senderBrandId } =
        req.body;
      const receiverBrand = await this.brandRepo
        .createQueryBuilder("brand")
        .where("brand.id = :receiverBrandId", { receiverBrandId })
        .leftJoinAndSelect("brand.user", "user")
        .getOne();
      if (!receiverBrand) {
        throw new ApiError("Receiver Brand not found", HTTP_STATUS.NOT_FOUND);
      }
      const receiverSpace = await this.spaceRepo
        .createQueryBuilder("space")
        .where("space.id = :receiverSpaceId", { receiverSpaceId })
        .leftJoinAndSelect("space.user", "user")
        .getOne();
      if (!receiverSpace) {
        throw new ApiError("Receiver Space not found", HTTP_STATUS.NOT_FOUND);
      }
      const members = [req.user?._id, receiverBrand.user.userChatId];

      const [NewChat, Notification, senderBrand] = await Promise.all([
        this.chatModel.create({
          members,
          name: `Inquiring Brand ${receiverBrand.brandName} For Space ${receiverSpace.spaceName}`,
          receiverBrand: receiverBrand.id,
          inquiryDetails: { message },
          senderBrand: senderBrandId,
          creator: req.user?._id,
          receiverSpace: receiverSpace.id,
        }),

        this.notificationModel.create({
          user: receiverBrand.user.userChatId,
          title: `New Inquiry For ${receiverSpace.spaceName}`,

          message,
          type: "info",
        }),
        this.brandRepo
          .createQueryBuilder("brand")
          .where("brand.id = :senderBrandId", { senderBrandId })
          .leftJoinAndSelect("brand.user", "user")

          .getOne(),
      ]);
      Notification.metadata = {
        ChatId: NewChat._id,
        spaceId: receiverSpace.id,
        spaceImage: receiverSpace.spaceImage,
        senderBrandId: senderBrand.id,
        senderBrandImage: senderBrand.brandImage,
        senderBrandUserName: senderBrand.user.name,
        receiverSpaceName: receiverSpace.spaceName,
      };
      await Notification.save();
      const ChatId = NewChat.id.toString();
      const messageForDB = {
        content: message,
        sender: req.user?._id,
        chat: ChatId,
      };
      await this.messageModel.create(messageForDB);

      emitEvent(req, REFETCH_CHATS, members);

      emitEvent(req, NEW_REQUEST, [receiverBrand.user.userChatId], {
        name: `${senderBrand.brandName} sent you an inquiry for Space ${receiverSpace.spaceName}`,
        senderBrandImage: senderBrand.brandImage,
        senderBrandUserName: senderBrand.user.name,
        receiverSpaceName: receiverSpace.spaceName,
        receiverId: receiverBrand.user.userChatId,
        chatId: NewChat._id,
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Inquiry Sent Successfully"));
      return next();
    } catch (error) {
      logger.error(
        `SpaceController :: InquireSpace :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async createSpace(
    req: ICustomRequest,
    file: IFileRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        spaceName,
        spaceCategory,
        details,
        // location,
        status,
        brandId,
        amenity,
        pricing,
      } = req.body;

      const coverFilesPath = path.join(process.cwd(), "uploads");
      const imageFilesPath = path.join(process.cwd(), "uploads");
      const coverFiles = fs
        .readdirSync(coverFilesPath)
        .filter((file) => file.startsWith("cover")); // Filter for cover files
      const imageFiles = fs
        .readdirSync(path.join(imageFilesPath))
        .filter((file) => file.startsWith("image")); // Filter for image files

      if (
        (!coverFiles.length || !imageFiles.length) &&
        status == SpaceStatus.PUBLISH
      ) {
        throw new ApiError(
          "Missing required files: 'cover' or 'image'",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const checkName = await this.spaceRepo.findOne({ where: { spaceName } });
      if (
        checkName &&
        status == SpaceStatus.PUBLISH &&
        checkName.status == SpaceStatus.PUBLISH
      ) {
        throw new ApiError(
          "Space with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const similarSpace = await this.spaceRepo.find({
        where: { spaceName: Like(`${spaceName}%`) },
      });

      let maxSuffix = -1;

      similarSpace.forEach((space) => {
        if (space.spaceName === spaceName) {
          maxSuffix = Math.max(maxSuffix, 0);
        } else {
          const regex = new RegExp(`^${spaceName}\\s(\\d+)$`);
          const match = space.spaceName.match(regex);
          if (match) {
            const suffix = parseInt(match[1], 10);
            maxSuffix = Math.max(maxSuffix, suffix);
          }
        }
      });

      const newSpaceName =
        maxSuffix === -1 ? spaceName : `${spaceName} ${maxSuffix + 1}`;

      const coverFileObjects: IFileObject[] = coverFiles.map((file) =>
        commonHelper.createFileObject(path.join(coverFilesPath, file), "cover")
      );

      const imageFileObjects: IFileObject[] = imageFiles.map((file) =>
        commonHelper.createFileObject(path.join(imageFilesPath, file), "image")
      );

      const FolderName = `${CLOUD_FOLDERS.SPACE}/${spaceName.trim()}`;
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
      let brand = null;
      if (brandId) {
        brand = await this.brandRepo.findOne({ where: { id: brandId } });
        if (!brand) {
          throw new ApiError("Brand not found", HTTP_STATUS.NOT_FOUND);
        }
      } else if (!brandId && status == SpaceStatus.PUBLISH) {
        throw new ApiError(
          "Brand is required for Publishing a Space",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const newSpace = new Spaces();
      newSpace.spaceName = newSpaceName;
      newSpace.spaceCategory = spaceCategory || null;
      newSpace.details = details || null;
      // newSpace.location = location;
      newSpace.status = status || null;
      newSpace.pricing = pricing || null;
      newSpace.user = user as User;
      newSpace.brand = (brand as Brand) || null;
      newSpace.amenity = amenity || null;
      newSpace.coverImages = JSON.stringify(coverUrls) as Object;
      newSpace.spaceImage = (imageUrls[0]?.url as string) || null;
      newSpace.imageKey = imageUrls[0]?.public_id || null;
      const space = await this.spaceRepo.save(newSpace);
      space.coverImages = JSON.parse(space.coverImages as unknown as string);
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Space Created Successfully", space));
      return next();
    } catch (error) {
      logger.error(
        `SpaceController :: CreateSpace :: ${(error as Error)?.message}`
      );
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        logger.error(`Deleted file: ${filePath}`);
      });

      return next(error);
    }
  }

  async updateSpace(
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
      let {
        spaceName,
        spaceCategory,
        details,
        // location,
        status,
        amenity,
        pricing,
        coverKeys,
        brandId,
      } = req.body;

      if (Array.isArray(coverKeys)) {
        coverKeys = coverKeys.filter((key) => typeof key === "string");
      }
      if (typeof coverKeys === "string" && !Array.isArray(coverKeys)) {
        coverKeys = coverKeys.split(",").map((item) => item.trim());
      }
      const existingSpace = await this.spaceRepo
        .createQueryBuilder("space")
        .where("space.id = :id", { id })
        .leftJoinAndSelect("space.user", "user")
        .getOne();
      if (!existingSpace) {
        return next(res.status(404).json({ message: "Space not found" }));
      }
      if (existingSpace.user.id != req.user.id) {
        throw new ApiError(
          "You are not the owner of this space",
          HTTP_STATUS.UN_AUTHORIZED
        );
      }
      if (
        existingSpace.status == SpaceStatus.ARCHIVE &&
        status == SpaceStatus.PUBLISH
      ) {
        throw new ApiError(
          "You can't publish an archived space, first draft it",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      if (status == SpaceStatus.DRAFT || status == SpaceStatus.ARCHIVE) {
        const events = await this.eventsRepo
          .createQueryBuilder("event")
          .where("event.space = :spaceId", { spaceId: existingSpace.id })
          .getMany();

        if (events.length > 0) {
          events.map((event) => {
            const eventDate =
              event.eventDate &&
              (event.eventDate as [{ startDate: string; endDate: string }]);
            const startDate = new Date(eventDate[0].startDate);
            const endDate = new Date(eventDate[0].endDate);
            const currentDate = new Date();
            //also add for ongoing
            if (startDate > currentDate) {
              throw new ApiError(
                "You can't draft/archive a space with upcoming events",
                HTTP_STATUS.BAD_REQUEST
              );
            }
            if (endDate > currentDate) {
              throw new ApiError(
                "You can't draft/archive a space with ongoing events",
                HTTP_STATUS.BAD_REQUEST
              );
            }
          });
        }
      }
      let brand = null;
      if (brandId) {
        brand = await this.brandRepo.findOne({ where: { id: brandId } });
        if (!brand) {
          throw new ApiError("Brand not found", HTTP_STATUS.NOT_FOUND);
        }
      } else if (!brandId && status == SpaceStatus.PUBLISH) {
        throw new ApiError(
          "Brand is required for Publishing an Event",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      if (spaceName) {
        const checkName = await this.spaceRepo.findOne({
          where: { spaceName },
        });
        if (
          checkName &&
          status == SpaceStatus.PUBLISH &&
          checkName.status == SpaceStatus.PUBLISH &&
          checkName.spaceName !== existingSpace.spaceName
        ) {
          throw new ApiError(
            "Space with this name already exists",
            HTTP_STATUS.BAD_REQUEST
          );
        }
        if (status != SpaceStatus.PUBLISH) {
          const similarSpace = await this.spaceRepo.find({
            where: { spaceName: spaceName },
          });

          let maxSuffix = -1;
          similarSpace.forEach((space) => {
            if (space.spaceName === spaceName && space.id !== id) {
              maxSuffix = Math.max(maxSuffix, 0);
            } else {
              const regex = new RegExp(`^${spaceName}\\s(\\d+)$`);
              const match = space.spaceName.match(regex);
              if (match) {
                const suffix = parseInt(match[1], 10);
                maxSuffix = Math.max(maxSuffix, suffix);
              }
            }
          });

          spaceName =
            maxSuffix === -1 ? spaceName : `${spaceName} ${maxSuffix + 1}`;
        }
      }
      let oldCoverImages: UploadResult[] = [];

      const FolderName = `${CLOUD_FOLDERS.SPACE}/${spaceName.trim()}`;
      if (typeof existingSpace.coverImages === "string") {
        try {
          oldCoverImages = JSON.parse(
            existingSpace.coverImages
          ) as UploadResult[];
        } catch (error) {
          logger.error("Failed to parse coverImages:", error);
          oldCoverImages = [];
        }
      } else {
        oldCoverImages = [];
      }

      const oldSpaceImage = existingSpace.spaceImage;

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
          : [{ url: oldSpaceImage }]
      ) as UploadResult[];
      if (oldCoverImages.length > 0) {
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
              !coverUrls.some(
                (url) => url.public_id === oldCoverImage.public_id
              )
            ) {
              await uploadService.deleteFile(oldCoverImage.public_id);
            }
          }
        }
      }

      if (
        imageFileObjects &&
        oldSpaceImage != null &&
        oldSpaceImage !== imageUrls[0]?.url
      ) {
        await uploadService.deleteFile(existingSpace.imageKey);
      }

      existingSpace.spaceName = spaceName || existingSpace.spaceName;
      existingSpace.spaceCategory =
        spaceCategory || existingSpace.spaceCategory;
      existingSpace.details = details || existingSpace.details;
      // existingSpace.location = location || existingSpace.location;
      existingSpace.amenity = amenity || existingSpace.amenity;
      existingSpace.status = status || existingSpace.status;
      existingSpace.pricing = pricing || existingSpace.pricing;
      existingSpace.brand = brand || existingSpace.brand;
      existingSpace.coverImages = JSON.stringify(coverUrls) as Object;
      existingSpace.spaceImage = imageUrls[0]?.url;
      existingSpace.imageKey = imageUrls[0]?.public_id;

      await this.spaceRepo.update(id, existingSpace);
      const uploadsPath = path.join(process.cwd(), "uploads");
      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
      });

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Space Updated Successfully"));
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
        `SpaceController :: updateSpace :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getSpacePrice(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { pricing, days } = req.body;

    if (!pricing || !days) {
      res.status(400).json({ error: "Pricing array and days are required." });
      return next();
    }

    try {
      const calculateAdditionalDays = (
        termPrice: any,
        divisor: any,
        additionalDays: any
      ) => {
        const dailyRate = parseFloat(termPrice) / divisor;
        return Math.round(dailyRate * additionalDays * 100) / 100;
      };

      const termOrder = { Day: 1, Week: 2, Month: 3, Year: 4 };
      pricing.sort(
        (a: PricingTerm, b: PricingTerm) =>
          termOrder[a.term] - termOrder[b.term]
      );

      let totalPrice = 0;
      let termDetails = {};
      let failedTerm = null;
      let requiredDays = null;

      for (const term of pricing) {
        const { term: termName, price, minimum } = term;
        const termPrice = parseFloat(price);
        const minTerm = parseInt(minimum, 10);

        switch (termName) {
          case "Day":
            if (days <= 6) {
              if (days >= minTerm) {
                totalPrice = termPrice * days;
                termDetails = { term: "Day", price: termPrice, days };
                break;
              } else {
                failedTerm = "Day";
                requiredDays = minTerm;
              }
            }
            break;

          case "Week":
            if (days >= 7 && days <= 29) {
              const weeks = Math.floor(days / 7);
              const additionalDays = days % 7;
              if (weeks >= minTerm) {
                totalPrice =
                  weeks * termPrice +
                  calculateAdditionalDays(termPrice, 7, additionalDays);
                termDetails = {
                  term: "Week",
                  price: termPrice,
                  weeks,
                  additionalDays,
                };
                break;
              } else {
                failedTerm = "Week";
                requiredDays = minTerm * 7; // Convert weeks to days
              }
            }
            break;

          case "Month":
            if (days >= 30 && days <= 364) {
              const months = Math.floor(days / 30);
              const additionalDays = days % 30;
              if (months >= minTerm) {
                totalPrice =
                  months * termPrice +
                  calculateAdditionalDays(termPrice, 30, additionalDays);
                termDetails = {
                  term: "Month",
                  price: termPrice,
                  months,
                  additionalDays,
                };
                break;
              } else {
                failedTerm = "Month";
                requiredDays = minTerm * 30; // Convert months to days
              }
            }
            break;

          case "Year":
            if (days >= 365) {
              const years = Math.floor(days / 365);
              const additionalDays = days % 365;
              if (years >= minTerm) {
                totalPrice =
                  years * termPrice +
                  calculateAdditionalDays(termPrice, 365, additionalDays);
                termDetails = {
                  term: "Year",
                  price: termPrice,
                  years,
                  additionalDays,
                };
                break;
              } else {
                failedTerm = "Year";
                requiredDays = minTerm * 365; // Convert years to days
              }
            }
            break;
          default:
            break;
        }

        if (totalPrice > 0) break;
      }

      if (totalPrice === 0) {
        res.status(400).json({
          error: `Number of days (${days}) is below the minimum required for term ${failedTerm}. Required: ${requiredDays} days.`,
        });
        return next();
      }

      res.status(200).json({ totalPrice: totalPrice.toFixed(2), termDetails });
      return next();
    } catch (error) {
      res
        .status(500)
        .json({ error: "Server error occurred.", details: error.message });
      return next();
    }
  }

  async getAllSpaces(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { page, take, skip, tab } = req?.query;
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      if (id && id !== "{id}") {
        const singleSpace = await this.spaceRepo
          .createQueryBuilder("space")
          .leftJoinAndSelect("space.brand", "brand")
          .where("space.id = :id", { id })
          .leftJoinAndSelect("space.user", "user")
          .getOne();

        if (!singleSpace) {
          res.status(200).json(handleResponse("Space not found"));
          return next();
        }

        if (typeof singleSpace.coverImages === "string") {
          singleSpace.coverImages = JSON.parse(singleSpace.coverImages);
        }
        const events = await this.eventsRepo
          .createQueryBuilder("event")
          .where("event.space = :spaceId", { spaceId: singleSpace.id })
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
        (singleSpace as any).calendarEvents = calendarEvents;
        if (singleSpace.pricing != null) {
          const totalPricing = calculatePricing(
            singleSpace.pricing as PricingTerm[],
            1
          );
        }

        let [tenantSpaceDetail, totalLeasSpace] = await this.leaseSpaceRepo
          .createQueryBuilder("leaseSpace")

          .leftJoinAndSelect("leaseSpace.owner", "owner")
          .leftJoinAndSelect("leaseSpace.event", "event")
          .leftJoinAndSelect("leaseSpace.brand", "leaseBrand")
          .leftJoinAndSelect("leaseSpace.space", "space")
          .where("owner.id = :userId", { userId: req.user?.id })
          .andWhere("leaseSpace.space = :spaceId", { spaceId: singleSpace.id })
          .leftJoinAndSelect("space.brand", "brand")
          .leftJoinAndSelect("space.user", "user")
          .orderBy("leaseSpace.createdAt", "DESC")
          .skip(skipNumber)
          .take(takeNumber)
          .getManyAndCount();

        const [savedEntities, followedEntities] = await Promise.all([
          this.savedEntity
            .createQueryBuilder("savedEntity")
            .where("savedEntity.ActionType = :actionType", {
              actionType: ActionType.FAVORITE,
            })
            .andWhere("savedEntity.type = :type", {
              type: SavedEntityType.SPACE,
            })
            .leftJoinAndSelect("savedEntity.space", "space")
            .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
            .andWhere("savedEntity.space = :spaceId", {
              spaceId: singleSpace.id,
            })
            .getOne(),

          this.savedEntity
            .createQueryBuilder("savedEntity")
            .where("savedEntity.ActionType = :actionType", {
              actionType: ActionType.FOLLOW,
            })
            .andWhere("savedEntity.type = :type", {
              type: SavedEntityType.SPACE,
            })
            .leftJoinAndSelect("savedEntity.space", "space")
            .andWhere("savedEntity.user = :userId", { userId: req.user?.id })
            .andWhere("savedEntity.space = :spaceId", {
              spaceId: singleSpace.id,
            })
            .getOne(),
        ]);

        const [getFollowedCount, getLikedCount] = await Promise.all([
          this.savedEntity
            .createQueryBuilder("savedEntity")
            .where("savedEntity.ActionType = :actionType", {
              actionType: ActionType.FOLLOW,
            })
            .andWhere("savedEntity.type = :type", {
              type: SavedEntityType.SPACE,
            })
            .leftJoinAndSelect("savedEntity.space", "space")
            .andWhere("space.id = :spaceId", { spaceId: singleSpace.id })
            .getCount(),
          this.savedEntity
            .createQueryBuilder("savedEntity")
            .where("savedEntity.ActionType = :actionType", {
              actionType: ActionType.FAVORITE,
            })
            .andWhere("savedEntity.type = :type", {
              type: SavedEntityType.SPACE,
            })
            .leftJoinAndSelect("savedEntity.space", "space")
            .andWhere("space.id = :spaceId", { spaceId: singleSpace.id })
            .getCount(),
        ]);

        const isFavourite = savedEntities ? true : false;
        const isFollowed = followedEntities ? true : false;

        const space = {
          tenantSpaceDetail,
          shareableLink: generateShareableLink({
            id: singleSpace.id,
            type: "space",
            typeName: singleSpace.spaceName,
          }),
          totalLeasSpace,
          likedCount: getLikedCount,
          followedCount: getFollowedCount,
          ...singleSpace,
          isFavourite,
          isFollowed,
        };

        res.status(200).json(handleResponse("Space Found Successfully", space));
        return next();
      }
      if (tab == "Space") {
        let [spaces, totalItems] = await this.spaceRepo
          .createQueryBuilder("space")
          .leftJoinAndSelect("space.brand", "brand")
          .where("space.user = :userId", { userId: req.user?.id })
          .leftJoinAndSelect("space.user", "user")
          .orderBy("space.createdAt", "DESC")
          .skip(skipNumber)
          .take(takeNumber)
          .getManyAndCount();

        if (spaces.length === 0) {
          res.status(200).json(handleResponse("No Spaces Found"));
          return next();
        }

        spaces.forEach((space) => {
          if (typeof space.coverImages === "string") {
            space.coverImages = JSON.parse(space.coverImages);
          }
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
          if (space.pricing != null) {
            const totalPricing = calculatePricing(
              space.pricing as PricingTerm[],
              1
            );

            return {
              ...space,
              totalPricing,
            };
          }
          return space;
        });

        res.status(200).json(
          handleResponse("Spaces Fetched Successfully", {
            spaces,
            pagination: {
              totalItems,
              currentPage: parseInt(page as string, 10),
              pageSize: takeNumber,
              totalPages: Math.ceil(totalItems / takeNumber),
            },
          })
        );
      } else if (tab == "Group") {
        let [spaces, totalItems] = await this.spaceRepo
          .createQueryBuilder("space")
          .leftJoinAndSelect("space.brand", "brand")
          .where("space.user = :userId", { userId: req.user?.id })
          .leftJoinAndSelect("space.user", "user")
          .orderBy("space.createdAt", "DESC")
          .skip(skipNumber)
          .take(takeNumber)
          .getManyAndCount();

        if (spaces.length === 0) {
          res.status(200).json(handleResponse("No Spaces Found"));
          return next();
        }

        spaces.forEach((space) => {
          if (typeof space.coverImages === "string") {
            space.coverImages = JSON.parse(space.coverImages);
          }
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
          if (space.pricing != null) {
            const totalPricing = calculatePricing(
              space.pricing as PricingTerm[],
              1
            );
            return {
              ...space,
              totalPricing,
            };
          }
          return space;
        });

        const groupedSpaces = {
          publishedSpaces: spaces
            .filter((space) => space.status === SpaceStatus.PUBLISH)
            .map((space) => ({
              ...space,
              shareableLink: generateShareableLink({
                id: space.id,
                type: "space",
                typeName: space.spaceName,
              }),
            })),
          draftSpaces: spaces.filter(
            (spaces) => spaces.status === SpaceStatus.DRAFT
          ),
          archivedSpaces: spaces.filter(
            (spaces) => spaces.status === SpaceStatus.ARCHIVE
          ),
          allSpaces: spaces.map((space) =>
            space.status === SpaceStatus.PUBLISH
              ? {
                  ...space,
                  shareableLink: generateShareableLink({
                    id: space.id,
                    type: "space",
                    typeName: space.spaceName,
                  }),
                }
              : space
          ),
          totalItems,
        };

        res.status(200).json(
          handleResponse("Events Fetched Successfully", {
            groupedSpaces,
            pagination: {
              totalItems,
              currentPage: parseInt(page as string, 10),
              pageSize: takeNumber,
              totalPages: Math.ceil(totalItems / takeNumber),
            },
          })
        );
      } else if (tab == "Lease") {
        let [leaseSpace, totalItems] = await this.leaseSpaceRepo
          .createQueryBuilder("leaseSpace")
          .leftJoinAndSelect("leaseSpace.space", "space")
          .leftJoinAndSelect("leaseSpace.brand", "leaseSpaceBrand")
          .leftJoinAndSelect("leaseSpace.owner", "owner")
          .leftJoinAndSelect("leaseSpace.event", "event")
          .leftJoinAndSelect("leaseSpace.tenant", "tenant")
          .where("tenant.id = :userId", { userId: req.user?.id })

          .leftJoinAndSelect("space.brand", "brand")
          .leftJoinAndSelect("space.user", "user")
          .orderBy("leaseSpace.createdAt", "DESC")
          .skip(skipNumber)
          .take(takeNumber)
          .getManyAndCount();

        if (leaseSpace.length === 0) {
          res.status(200).json(handleResponse("No Spaces Found"));
          return next();
        }

        leaseSpace.forEach((space) => {
          if (typeof space.space.coverImages === "string") {
            space.space.coverImages = JSON.parse(space.space.coverImages);
            if (typeof space.contractDetails === "string") {
              space.contractDetails = JSON.parse(space.contractDetails);
            }
          }
        });
        for (const space of leaseSpace) {
          const events = await this.eventsRepo
            .createQueryBuilder("event")
            .where("event.space = :spaceId", { spaceId: space.space.id })
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

        res.status(200).json(
          handleResponse("Spaces Fetched Successfully", {
            leaseSpace,
            pagination: {
              totalItems,
              currentPage: parseInt(page as string, 10),
              pageSize: takeNumber,
              totalPages: Math.ceil(totalItems / takeNumber),
            },
          })
        );
      } else if (tab == "Tenant") {
        let [tenantSpace, totalItems] = await this.leaseSpaceRepo
          .createQueryBuilder("leaseSpace")
          .leftJoinAndSelect("leaseSpace.space", "space")
          .leftJoinAndSelect("leaseSpace.owner", "owner")
          .leftJoinAndSelect("leaseSpace.event", "event")
          .leftJoinAndSelect("leaseSpace.brand", "leaseBrand")
          .where("owner.id = :userId", { userId: req.user?.id })

          .leftJoinAndSelect("space.brand", "brand")
          .leftJoinAndSelect("space.user", "user")
          .orderBy("leaseSpace.createdAt", "DESC")
          .skip(skipNumber)
          .take(takeNumber)
          .getManyAndCount();

        if (tenantSpace.length === 0) {
          res.status(200).json(handleResponse("No Spaces Found"));
          return next();
        }

        tenantSpace.forEach((space) => {
          if (typeof space.space.coverImages === "string") {
            space.space.coverImages = JSON.parse(space.space.coverImages);
            if (typeof space.contractDetails === "string") {
              space.contractDetails = JSON.parse(space.contractDetails);
            }
          }
        });
        for (const space of tenantSpace) {
          const events = await this.eventsRepo
            .createQueryBuilder("event")
            .where("event.space = :spaceId", { spaceId: space.space.id })
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

        res.status(200).json(
          handleResponse("Spaces Fetched Successfully", {
            tenantSpace,
            pagination: {
              totalItems,
              currentPage: parseInt(page as string, 10),
              pageSize: takeNumber,
              totalPages: Math.ceil(totalItems / takeNumber),
            },
          })
        );
      }
      return next();
    } catch (error) {
      next(error);
    }
  }

  async getAllPublishedSpaces(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { page, take, skip } = req?.query;
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      if (id && id !== "{id}") {
        const space = await this.spaceRepo
          .createQueryBuilder("space")
          .leftJoinAndSelect("space.brand", "brand")
          .where("space.id = :id", { id })
          .leftJoinAndSelect("space.user", "user")
          .getOne();

        if (!space) {
          res.status(200).json(handleResponse("Space not found"));
          return next();
        }

        if (typeof space.coverImages === "string") {
          space.coverImages = JSON.parse(space.coverImages);
        }
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
        const totalPricing = calculatePricing(
          space.pricing as PricingTerm[],
          1
        );
        res.status(200).json(handleResponse("Space Found Successfully", space));
        return next();
      }

      let [spaces, totalItems] = await this.spaceRepo
        .createQueryBuilder("space")
        .leftJoinAndSelect("space.brand", "brand")
        .where("space.user != :userId", { userId: req.user?.id })
        .leftJoinAndSelect("space.user", "user")
        .orderBy("space.createdAt", "DESC")
        .skip(skipNumber)
        .take(takeNumber)
        .getManyAndCount();

      if (spaces.length === 0) {
        res.status(200).json(handleResponse("No Spaces Found"));
        return next();
      }

      spaces.forEach((space) => {
        if (typeof space.coverImages === "string") {
          space.coverImages = JSON.parse(space.coverImages);
        }
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

      res.status(200).json(
        handleResponse("Spaces Fetched Successfully", {
          spaces,
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

  async deleteSpace(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const Space = await this.spaceRepo.findOne({
        where: { id, user: { id: req.user?.id } },
      });

      if (!Space) {
        res
          .status(404)
          .json(handleResponse("Space not found or does not belong to user"));
        return;
      }

      await this.spaceRepo.delete(id);

      res.status(200).json(handleResponse("Space Deleted Successfully"));
    } catch (error) {
      next(error);
    }
  }
}
