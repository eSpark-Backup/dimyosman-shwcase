import { NextFunction, Request, RequestHandler, Response } from "express";
import { Amenities, Category, CategoryType, User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../utils";
import { ICustomRequest, IFileRequest, UploadResult } from "../interfaces";
import { CLOUD_FOLDERS, HTTP_STATUS } from "../constants";
import { uploadService } from "../services";

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
      const { files } = file;

      if (!files?.image) {
        throw new ApiError(
          "Missing required files:'image'",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const FolderName = `${CLOUD_FOLDERS.AMENITY}/${amenityName}`;
      const amenityUrls = (await uploadService.uploadMultipleFiles(
        files.image,
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
