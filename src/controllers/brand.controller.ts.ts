import { NextFunction, Request, RequestHandler, Response } from "express";
import { Brand, User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../utils";
import { CLOUD_FOLDERS, HTTP_STATUS, PAGINATION } from "../constants";
import { uploadService } from "../services";
import { ICustomRequest, IFileRequest, UploadResult } from "../interfaces";

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
      const { files } = file;

      if (!files?.cover || !files?.image) {
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

      const FolderName = `${CLOUD_FOLDERS.BRAND}/${brandName}`;
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

      const newBrand = new Brand();
      newBrand.brandName = brandName;
      newBrand.brandCategory = brandCategory;
      newBrand.details = details;
      newBrand.location = location;
      newBrand.status = status;
      newBrand.user = user as User;
      newBrand.coverImages = JSON.stringify(coverUrls) as Object;
      newBrand.brandImage = imageUrls[0].url as string;
      newBrand.imageKey = imageUrls[0].public_id;
      await this.brandRepo.save(newBrand);
      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Brand Created Successfully successful"));
      return next();
    } catch (error) {
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
      const { files } = file;
      const { id } = req.params;
      const { brandName, brandCategory, details, location, status } = req.body;

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

      const coverUrls: UploadResult[] = files?.cover
        ? ((await uploadService.uploadMultipleFiles(
            files.cover,
            FolderName
          )) as UploadResult[])
        : oldCoverImages;

      const imageUrls = (
        files?.image
          ? await uploadService.uploadMultipleFiles(files.image, FolderName)
          : [{ url: oldBrandImage }]
      ) as UploadResult[];

      for (const oldCoverImage of oldCoverImages) {
        if (
          !coverUrls.some((url) => url.public_id === oldCoverImage.public_id)
        ) {
          await uploadService.deleteFile(oldCoverImage.public_id);
        }
      }

      if (files?.image && oldBrandImage !== imageUrls[0]?.url) {
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

      await this.brandRepo.save(existingBrand);

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Brand Updated Successfully"));
      return next();
    } catch (error) {
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

      res.status(200).json(
        handleResponse("Brands Fetched Successfully", {
          brands,
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
