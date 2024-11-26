import multer, { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";
import {
  ALLOWED_IMG_TYPES,
  FILE_FIELDS,
  MAX_FILES_COUNTS,
  MULTER_ERROR,
} from "../constants";
import { ApiError } from "../errors";
import { logger } from "../utils";
import { commonHelper } from "../helpers";
import { IFileObject } from "../interfaces";
import { extname } from "path";

/**
 * @description Function to handle form data
 */
export const handleMultipleFiles = (
  fields: { name: string; maxCount: number }[],
  filterFunction?: Function
) =>
  function (req: Request, res: Response, next: NextFunction) {
    const upload = multer({
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        const fieldExists = fields.some(
          (field) => field.name === file.fieldname
        );
        if (fieldExists) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }).fields(fields);

    upload(req, res, function (err) {
      try {
        if (err) {
          handleMulterError(err);
        }

        if (filterFunction) {
          filterFunction(req);
        }
        return next();
      } catch (err) {
        logger.error(`Error in handleFormData :: ${(err as Error)?.message}`);
        next(err);
      }
    });
  };

export const handleSingleFile = (fieldName: FILE_FIELDS = FILE_FIELDS.FILE) =>
  function (req: Request, res: Response, next: NextFunction) {
    const upload = multer().single(fieldName);
    upload(req, res, function (err) {
      try {
        if (err) {
          handleMulterError(err);
        }
        if (Object.values(req?.body)?.length) {
          req.body = commonHelper.parseBody(req?.body);
        }
        return next();
      } catch (err) {
        logger.error(
          `Error in uploadSingleFile middleware :: ${(err as Error)?.message}`
        );
        return next(err);
      }
    });
  };
const handleMulterError = function (err: any) {
  if (err instanceof MulterError) {
    const errorMessage = MULTER_ERROR[err?.code];
    throw new ApiError(`Error in uploading file :: ${errorMessage}`, 422);
  } else {
    throw new ApiError("Error in uploading file" + err?.message, 422);
  }
};

const filterFiles = function (req: any) {
  if (req?.files?.length) {
    // const isAllowedFile = req?.files?.filter(file => !ALLOWED_IMG_TYPES.includes(file?.mimetype))?.length > 0;
    // if (isAllowedFile) throw new ApiError('Only image files are allowed', 422);
  }
  if (req?.file) {
    if (!ALLOWED_IMG_TYPES.includes(req?.file?.mimetype))
      throw new ApiError("Only image files are allowed", 422);
  }
  return true;
};
