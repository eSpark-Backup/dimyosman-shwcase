import { NextFunction, Request, RequestHandler, Response } from "express";
import { Brand, Spaces, User } from "../../entity";
import { ApiError } from "../../errors";
import { Repository } from "typeorm";
import { calculatePricing, handleResponse, logger } from "../../utils";
import { CLOUD_FOLDERS, HTTP_STATUS, PAGINATION } from "../../constants";
import { uploadService } from "../../services";
import {
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
    private brandRepo: Repository<Brand>
  ) {}

  async createSpace(
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
        spaceName,
        spaceCategory,
        details,
        location,
        status,
        brandId,
        amenity,
        pricing,
      } = req.body;
      const checkName = await this.spaceRepo.findOne({ where: { spaceName } });
      if (checkName) {
        throw new ApiError(
          "Space with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }

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
      const brand = await this.brandRepo.findOne({ where: { id: brandId } });
      if (!brand) {
        throw new ApiError("Brand not found", HTTP_STATUS.NOT_FOUND);
      }

      const newSpace = new Spaces();
      newSpace.spaceName = spaceName;
      newSpace.spaceCategory = spaceCategory;
      newSpace.details = details;
      newSpace.location = location;
      newSpace.status = status;
      newSpace.pricing = pricing;
      newSpace.user = user as User;
      newSpace.brand = brand as Brand;
      newSpace.amenity = amenity;
      newSpace.coverImages = JSON.stringify(coverUrls) as Object;
      newSpace.spaceImage = imageUrls[0].url as string;
      newSpace.imageKey = imageUrls[0].public_id;
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
        location,
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
      const existingSpace = await this.spaceRepo.findOne({ where: { id } });
      if (!existingSpace) {
        return next(res.status(404).json({ message: "Space not found" }));
      }
      const brand = await this.brandRepo.findOne({ where: { id: brandId } });
      if (!brand) {
        throw new ApiError("Brand not found", HTTP_STATUS.NOT_FOUND);
      }
      if (spaceName) {
        const checkName = await this.spaceRepo.findOne({
          where: { spaceName },
        });
        if (checkName && checkName.spaceName !== existingSpace.spaceName) {
          throw new ApiError(
            "Space with this name already exists",
            HTTP_STATUS.BAD_REQUEST
          );
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

      if (imageFileObjects && oldSpaceImage !== imageUrls[0]?.url) {
        await uploadService.deleteFile(existingSpace.imageKey);
      }

      existingSpace.spaceName = spaceName || existingSpace.spaceName;
      existingSpace.spaceCategory =
        spaceCategory || existingSpace.spaceCategory;
      existingSpace.details = details || existingSpace.details;
      existingSpace.location = location || existingSpace.location;
      existingSpace.amenity = amenity || existingSpace.amenity;
      existingSpace.status = status || existingSpace.status;
      existingSpace.pricing = pricing || existingSpace.pricing;
      existingSpace.brand = brand || existingSpace.brand;
      existingSpace.coverImages = JSON.stringify(coverUrls) as Object;
      existingSpace.spaceImage = imageUrls[0].url;
      existingSpace.imageKey = imageUrls[0].public_id;

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
      // Helper function to calculate additional days
      const calculateAdditionalDays = (
        termPrice: any,
        divisor: any,
        additionalDays: any
      ) => {
        const dailyRate = parseFloat(termPrice) / divisor;
        return Math.round(dailyRate * additionalDays * 100) / 100;
      };

      // Sort pricing terms by hierarchy: Day, Week, Month, Year
      const termOrder = { Day: 1, Week: 2, Month: 3, Year: 4 };
      pricing.sort(
        (a: PricingTerm, b: PricingTerm) =>
          termOrder[a.term] - termOrder[b.term]
      );

      let totalPrice = 0;
      let termDetails = {};

      for (const term of pricing) {
        const { term: termName, price, minimum } = term;
        const termPrice = parseFloat(price);

        switch (termName) {
          case "Day":
            if (days <= 6) {
              totalPrice = termPrice * days;
              termDetails = { term: "Day", price: termPrice, days };
              break;
            }
            break;
          case "Week":
            if (days >= 7 && days <= 29) {
              const weeks = Math.floor(days / 7);
              const additionalDays = days % 7;
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
            }
            break;
          case "Month":
            if (days >= 30 && days <= 364) {
              const months = Math.floor(days / 30);
              const additionalDays = days % 30;
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
            }
            break;
          case "Year":
            if (days >= 365) {
              const years = Math.floor(days / 365);
              const additionalDays = days % 365;
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
            }
            break;
          default:
            break;
        }

        if (totalPrice > 0) break; // Exit loop once price is calculated
      }

      if (totalPrice === 0) {
        res
          .status(400)
          .json({ error: "Invalid days for the provided pricing terms." });
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
      const { page, take, skip } = req?.query;
      // Ensure skip and take are numbers
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      if (id && id !== "{id}") {
        const space = await this.spaceRepo.findOne({
          where: { id },
          relations: ["brand"],
        });

        if (!space) {
          res.status(200).json(handleResponse("Space not found"));
          return next();
        }

        if (typeof space.coverImages === "string") {
          space.coverImages = JSON.parse(space.coverImages);
        }

        res.status(200).json(handleResponse("Space Found Successfully", space));
        return next();
      }

      const [spaces, totalItems] = await this.spaceRepo.findAndCount({
        where: { user: { id: req.user?.id } },
        relations: ["brand"],

        skip: skipNumber,
        take: takeNumber,
        order: {
          createdAt: "DESC",
        },
      });

      if (spaces.length === 0) {
        res.status(200).json(handleResponse("No Spaces Found"));
        return next();
      }

      spaces.forEach((space) => {
        if (typeof space.coverImages === "string") {
          space.coverImages = JSON.parse(space.coverImages);
        }
      });

      const spacesWithPricing = spaces.map((space) => {
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
          spacesWithPricing,
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
