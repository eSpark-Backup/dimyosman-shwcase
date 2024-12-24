import { Router } from "express";
import {
  AmenityValidation,
  CategoryValidation,
  validate,
} from "../../validations";
import { Amenities, User } from "../../entity";
import { AppDataSource } from "../../typeorm.config";
import {
  AmenityController,
  BrandController,
  CategoryController,
} from "../../controllers/account";
import {
  checkJwt,
  handleMultipleFiles,
  setPagination,
  validateRoles,
} from "../../middleware";
import { FILE_FIELDS, ROLES } from "../../constants";

const router = Router();
const amenityRepository = AppDataSource.getRepository(Amenities);
const userRepository = AppDataSource.getRepository(User);
const amenityController = new AmenityController(
  amenityRepository,
  userRepository
);

/**
 * @swagger
 * /amenities:
 *   post:
 *     summary: Create a new Amenities
 *     description: This endpoint allows users with the USER role to create a new Amenity.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Amenities & Features
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               amenityName:
 *                 type: string
 *                 description: Name of the Amenity.
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Amenity created successfully.
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
  handleMultipleFiles([{ name: FILE_FIELDS.IMAGE, maxCount: 1 }]),
  validate(AmenityValidation.CreateAmenity, "body"),
  (req, res, next) =>
    amenityController.createAmenity(req, req as any, res, next)
);

/**
 * @swagger
 * /amenities:
 *   get:
 *     summary: Get all Amenities
 *     description: Retrieve a list of all available amenities.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Amenities & Features
 *     responses:
 *       200:
 *         description: List of amenities fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Amenities Fetched Successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "d91a35de-06b1-40da-85f7-8d7a3e5a5d3a"
 *                       amenityName:
 *                         type: string
 *                         example: "Swimming Pool"
 *                       amenitiesImage:
 *                         type: string
 *                         example: "https://cloud-storage/amenities/swimming_pool.jpg"
 *                       imageKey:
 *                         type: string
 *                         example: "amenities/swimming_pool"
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Server error.
 */
router.get("", checkJwt, validateRoles([ROLES.USER]), (req, res, next) =>
  amenityController.getAllAmenities(req, res, next)
);

export { router };
