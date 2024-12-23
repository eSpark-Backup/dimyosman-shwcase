import { NextFunction, Request, RequestHandler, Response } from "express";
import { Amenities, Category, CategoryType, User } from "../../entity";
import { ApiError } from "../../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../../utils";
import {
  ICustomRequest,
  IFileObject,
  IFileRequest,
  UploadResult,
} from "../../interfaces";
import { CLOUD_FOLDERS, HTTP_STATUS } from "../../constants";
import { uploadService } from "../../services";
import fs from "fs";
import path from "path";
import { commonHelper } from "../../helpers";
export class AmenityController {
  constructor(
    private amenityRepo: Repository<Amenities>,
    private userRepo: Repository<User>
  ) {}

  async createAmenity(
    req: ICustomRequest,
    file: IFileRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { amenityName } = req.body;
      const imageFilesPath = path.join(process.cwd(), "uploads");

      const imageFiles = fs
        .readdirSync(path.join(imageFilesPath))
        .filter((file) => file.startsWith("image")); // Filter for image files

      const imageFileObjects: IFileObject[] = imageFiles.map((file) =>
        commonHelper.createFileObject(path.join(imageFilesPath, file), "image")
      );

      const FolderName = `${CLOUD_FOLDERS.AMENITY}/${amenityName}`;
      const amenityUrls = (await uploadService.uploadMultipleFiles(
        imageFileObjects,
        FolderName
      )) as UploadResult[];

      const newAmenity = new Amenities();

      newAmenity.amenitiesName = amenityName;
      newAmenity.amenitiesImage = amenityUrls[0].url as string;
      newAmenity.imageKey = amenityUrls[0].public_id;

      const createdAmenity = await this.amenityRepo.save(newAmenity);
      res
        .status(201)
        .json(handleResponse("Amenity Created Successfully", createdAmenity));
      return next();
    } catch (error) {
      next(error);
    }
  }

  async getAllAmenities(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const amenities = await this.amenityRepo.find();

      res
        .status(200)
        .json(handleResponse("Amenities Fetched Successfully", amenities));
    } catch (error) {
      next(error);
    }
  }
}
