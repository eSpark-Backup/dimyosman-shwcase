import { NextFunction, Request, RequestHandler, Response } from "express";
import { Brand, Spaces, User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../utils";
import { CLOUD_FOLDERS, HTTP_STATUS, PAGINATION } from "../constants";
import { uploadService } from "../services";
import { ICustomRequest, IFileRequest, UploadResult } from "../interfaces";

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
      const { files } = file;

      if (!files?.cover || !files?.image) {
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
        minLeaseDays,
      } = req.body;
      const checkName = await this.spaceRepo.findOne({ where: { spaceName } });
      if (checkName) {
        throw new ApiError(
          "Space with this name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const FolderName = `${CLOUD_FOLDERS.SPACE}/${spaceName}`;
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

      const newSpace = new Spaces();
      newSpace.spaceName = spaceName;
      newSpace.spaceCategory = spaceCategory;
      newSpace.details = details;
      newSpace.location = location;
      newSpace.status = status;
      newSpace.minLeaseDays = minLeaseDays;
      newSpace.user = user as User;
      newSpace.brand = brand as Brand;
      newSpace.amenity = amenity;
      newSpace.coverImages = JSON.stringify(coverUrls) as Object;
      newSpace.spaceImage = imageUrls[0].url as string;
      newSpace.imageKey = imageUrls[0].public_id;
      const space = await this.spaceRepo.save(newSpace);
      space.coverImages = JSON.parse(space.coverImages as unknown as string);

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Space Created Successfully successful", space));
      return next();
    } catch (error) {
      logger.error(
        `SpaceController :: CreateSpace :: ${(error as Error)?.message}`
      );
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
      const { files } = file;
      const { id } = req.params;
      let {
        spaceName,
        spaceCategory,
        details,
        location,
        status,
        amenity,
        coverKeys,
      } = req.body;
      if (typeof coverKeys === "string") {
        coverKeys = coverKeys.split(",").map((key) => key.trim());
      }

      if (Array.isArray(coverKeys)) {
        coverKeys = coverKeys.filter((key) => typeof key === "string");
      }
      const existingSpace = await this.spaceRepo.findOne({ where: { id } });
      if (!existingSpace) {
        return next(res.status(404).json({ message: "Space not found" }));
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

      const FolderName = `${CLOUD_FOLDERS.SPACE}/${spaceName}`;
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

      const coverUrls: UploadResult[] = files?.cover
        ? ((await uploadService.uploadMultipleFiles(
            files.cover,
            FolderName
          )) as UploadResult[])
        : oldCoverImages;

      const imageUrls = (
        files?.image
          ? await uploadService.uploadMultipleFiles(files.image, FolderName)
          : [{ url: oldSpaceImage }]
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

      if (files?.image && oldSpaceImage !== imageUrls[0]?.url) {
        await uploadService.deleteFile(existingSpace.imageKey);
      }

      existingSpace.spaceName = spaceName || existingSpace.spaceName;
      existingSpace.spaceCategory =
        spaceCategory || existingSpace.spaceCategory;
      existingSpace.details = details || existingSpace.details;
      existingSpace.location = location || existingSpace.location;
      existingSpace.amenity = amenity || existingSpace.amenity;
      existingSpace.status = status || existingSpace.status;
      existingSpace.coverImages = JSON.stringify(coverUrls) as Object;
      existingSpace.spaceImage = imageUrls[0].url;
      existingSpace.imageKey = imageUrls[0].public_id;

      await this.spaceRepo.save(existingSpace);

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Space Updated Successfully"));
      return next();
    } catch (error) {
      logger.error(
        `SpaceController :: updateSpace :: ${(error as Error)?.message}`
      );
      return next(error);
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
          res.status(404).json(handleResponse("Space not found"));
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
        res.status(404).json(handleResponse("No Spaces Found"));
        return next();
      }

      spaces.forEach((space) => {
        if (typeof space.coverImages === "string") {
          space.coverImages = JSON.parse(space.coverImages);
        }
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
