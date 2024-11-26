import { Router } from "express";
import { BrandValidation, validate } from "../validations";
import { Brand } from "../entity";
import { AppDataSource } from "../typeorm.config";
import { BrandController } from "../controllers";
import {
  checkJwt,
  handleMultipleFiles,
  handleSingleFile,
  validateRoles,
} from "../middleware";
import { FILE_FIELDS, ROLES } from "../constants";

const router = Router();
const brandRepository = AppDataSource.getRepository(Brand);
const brandController = new BrandController(brandRepository);

/**
 * @swagger
 * /brand:
 *   post:
 *     summary: Create a new brand
 *     description: This endpoint allows users with the USER role to create a new brand.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brand
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               brandCategory:
 *                 type: object
 *                 description: The category of the brand.
 *               details:
 *                 type: object
 *                 description: Details about the brand.
 *               location:
 *                 type: object
 *                 properties:
 *                   long:
 *                     type: number
 *                     description: Longitude of the brand's location.
 *                   lat:
 *                     type: number
 *                     description: Latitude of the brand's location.
 *               status:
 *                 type: string
 *                 enum:
 *                   - PUBLISH
 *                   - DRAFT
 *                   - ARCHIVE
 *               cover:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of cover images for the brand.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Additional image of the brand.
 *     responses:
 *       201:
 *         description: Brand created successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Server error.
 */

router.post(
  "",
  checkJwt,
  validateRoles([ROLES.USER]),
  handleMultipleFiles([
    { name: FILE_FIELDS.COVER, maxCount: 10 },
    { name: FILE_FIELDS.IMAGE, maxCount: 1 },
  ]),
  validate(BrandValidation.CreateBrand, "body"),
  (req, res, next) => brandController.createBrand(req, res, next)
);

export { router };
