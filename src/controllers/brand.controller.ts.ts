import { NextFunction, Request, RequestHandler, Response } from "express";
import { Brand, BrandStatus, User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../utils";
import { commonHelper } from "../helpers";

import {
  BRAND_STATUS,
  CLOUD_FOLDERS,
  HTTP_STATUS,
  PAGINATION,
} from "../constants";
import { uploadService } from "../services/";
import {
  ICustomRequest,
  IFileObject,
  IFileRequest,
  UploadResult,
} from "../interfaces";
import fs from "fs";
import path from "path";
export class BrandController {
  constructor(
    private brandRepo: Repository<Brand>,
    private userRepo: Repository<User>
  ) {}

  async createBrand(
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

      const { brandName, brandCategory, details, location, status } = req.body;
      const checkName = await this.brandRepo.findOne({ where: { brandName } });
      if (checkName) {
        throw new ApiError(
          "Brand with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }

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
      return next();
    } catch (error) {
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);
      if (files.length > 0) {
        files.forEach((file) => {
          const filePath = path.join(uploadsPath, file);
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
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
  ): Promise<any> {
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

      if (typeof coverKeys === "string") {
        coverKeys = coverKeys.split(",").map((key) => key.trim());
      }

      if (Array.isArray(coverKeys)) {
        coverKeys = coverKeys.filter((key) => typeof key === "string");
      }
      const existingBrand = await this.brandRepo.findOne({ where: { id } });
      if (!existingBrand) {
        return next(res.status(404).json({ message: "Brand not found" }));
      }
      const checkName = await this.brandRepo.findOne({ where: { brandName } });
      if (checkName && checkName.brandName !== existingBrand.brandName) {
        throw new ApiError(
          "Brand with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      let oldCoverImages: UploadResult[] = [];

      const FolderName = `${CLOUD_FOLDERS.BRAND}/${brandName}`;
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

      const coverUrls: UploadResult[] = coverFileObjects?.length
        ? ((await uploadService.uploadMultipleFiles(
            coverFileObjects,
            FolderName
          )) as UploadResult[])
        : oldCoverImages;

      const imageUrls = (
        imageFileObjects?.length
          ? await uploadService.uploadMultipleFiles(
              imageFileObjects,
              FolderName
            )
          : [{ url: oldBrandImage }]
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
        console.log(`Deleted file: ${filePath}`);
      });

      return res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Brand Updated Successfully", UpdatedBrand));
    } catch (error) {
      const uploadsPath = path.join(process.cwd(), "uploads");

      const files = fs.readdirSync(uploadsPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsPath, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
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
  ): Promise<any> {
    try {
      const { id } = req.params;
      const { page, take, skip } = req?.query;
      // Ensure skip and take are numbers
      const skipNumber = Number(skip);
      const takeNumber = Number(take);
      if (id && id !== "{id}") {
        const brand = await this.brandRepo.findOne({
          where: { id },
        });

        if (!brand) {
          res.status(404).json(handleResponse("Brand not found"));
          return next();
        }

        if (typeof brand.coverImages === "string") {
          brand.coverImages = JSON.parse(brand.coverImages);
        }

        res.status(200).json(handleResponse("Brand Found Successfully", brand));
        return next();
      }

      const [brands, totalItems] = await this.brandRepo.findAndCount({
        where: { user: { id: req.user?.id } },
        skip: skipNumber,
        take: takeNumber,
        order: {
          createdAt: "DESC",
        },
      });

      if (brands.length === 0) {
        res.status(404).json(handleResponse("No Brands Found"));
        return next();
      }

      brands.forEach((brand) => {
        if (typeof brand.coverImages === "string") {
          brand.coverImages = JSON.parse(brand.coverImages);
        }
      });

      const groupedBrands = {
        publishedBrands: brands.filter(
          (brand) => brand.status === BrandStatus.PUBLISH
        ),
        draftBrands: brands.filter(
          (brand) => brand.status === BrandStatus.DRAFT
        ),
        archivedBrands: brands.filter(
          (brand) => brand.status === BrandStatus.ARCHIVE
        ),
        totalItems,
      };

      return res.status(200).json(
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
          .status(404)
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
