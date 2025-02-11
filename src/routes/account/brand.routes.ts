import { Router } from "express";
import { BrandValidation, validate } from "../../validations";
import { Brand, Events, SavedEntity, User } from "../../entity";
import { AppDataSource } from "../../typeorm.config";
import { BrandController } from "../../controllers/account";
import {
  checkJwt,
  handleMultipleFiles,
  handleSingleFile,
  setPagination,
  validateRoles,
} from "../../middleware";
import { FILE_FIELDS, ROLES } from "../../constants";
import { parseJsonFields } from "../../utils";
import { IFileRequest } from "../../interfaces";
import { Chat, Message, Notification } from "../../models";

const router = Router();
const brandRepository = AppDataSource.getRepository(Brand);
const userRepository = AppDataSource.getRepository(User);
const savedEntityRepository=AppDataSource.getRepository(SavedEntity)
const eventEntityRepository=AppDataSource.getRepository(Events)

const brandController = new BrandController(
  brandRepository,
  userRepository,
  Chat,
  Notification,
  eventEntityRepository,
  Message,
  savedEntityRepository

);

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
 *               brandName:
 *                 type: string
 *                 description: Name of the brand.
 *               brandCategory:
 *                 type: array
 *                 required: false
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the brand category.
 *                 description: The category of the brand.
 *               details:
 *                  type: object
 *                  required: false
 *                  properties:
 *                    description:
 *                       type: string
 *                       description: A brief description of the brand
 *                    htmlContent:
 *                       type: string
 *                       description: HTML content related to the brand (e.g., description with HTML tags)
 *               location:
 *                 type: object
 *                 required: false
 *                 properties:
 *                   long:
 *                     type: number
 *                     description: Longitude of the brand's location.
 *                   lat:
 *                     type: number
 *                     description: Latitude of the brand's location.
 *                   additional:
 *                     type: string
 *                     description: Additional information about the location.
 *               status:
 *                 type: string
 *                 enum:
 *                   - PUBLISH
 *                   - DRAFT
 *                   - ARCHIVE
 *               coverOrder:
 *                  type: array
 *                  required: false
 *                  items:
 *                    type: string
 *                  description: Array specifying the order of cover filenames.
 *               cover:
 *                 type: array
 *                 required: false
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of cover images for the brand.
 *               image:
 *                 type: string
 *                 required: false
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
  parseJsonFields(["brandCategory", "details", "location"]),
  validate(BrandValidation.CreateBrand, "body"),
  (req, res, next) => brandController.createBrand(req, req as any, res, next)
);

/**
 * @swagger
 * /brand/{id}:
 *   put:
 *     summary: Update an existing brand
 *     description: This endpoint allows users with the USER role to update an existing brand.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the brand to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *               brandCategory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *               details:
 *                  type: object
 *                  properties:
 *                    description:
 *                       type: string
 *                       description: A brief description of the brand
 *                    htmlContent:
 *                       type: string
 *                       description: HTML content related to the brand (e.g., description with HTML tags)
 *               location:
 *                 type: object
 *                 properties:
 *                   long:
 *                     type: number
 *                   lat:
 *                     type: number
 *                   additional:
 *                     type: string
 *
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
 *               coverKeys:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of cover keys for the space.
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Brand updated successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Brand not found.
 *       500:
 *         description: Server error.
 */
router.put(
  "/:id",
  checkJwt,
  validateRoles([ROLES.USER]),
  handleMultipleFiles([
    { name: FILE_FIELDS.COVER, maxCount: 10 },
    { name: FILE_FIELDS.IMAGE, maxCount: 1 },
  ]),
  parseJsonFields(["brandCategory", "details", "location"]),
  validate(BrandValidation.UpdateBrand, "body"),
  (req, res, next) => brandController.updateBrand(req, req as any, res, next)
);

/**
 * @swagger
 * /brand/{id}:
 *   get:
 *     summary: Get a specific brand by ID or all brands for the authenticated user
 *     description: This endpoint retrieves a specific brand by its ID (if provided) or all brands associated with the authenticated user. Pagination is supported for retrieving multiple brands.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: ID of the brand to retrieve (optional).
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageSize
 *         required: false
 *         description: Number of items per page (for paginated results).
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number to retrieve (for paginated results).
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Brand found by ID or all brands for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brands:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       brandName:
 *                         type: string
 *                         description: Name of the brand.
 *                       brandCategory:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: Name of the category.
 *                             description:
 *                               type: string
 *                               description: Description of the category.
 *                         description: Categories of the brand.
 *                       details:
 *                         type: object
 *                         description: Details about the brand.
 *                       location:
 *                         type: object
 *                         properties:
 *                           long:
 *                             type: number
 *                             description: Longitude of the brand's location.
 *                           lat:
 *                             type: number
 *                             description: Latitude of the brand's location.
 *                           additional:
 *                             type: string
 *                             description: Additional information about the location.
 *                       status:
 *                         type: string
 *                         enum:
 *                           - PUBLISH
 *                           - DRAFT
 *                           - ARCHIVE
 *                       coverImages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               description: URL of the cover image.
 *                             public_id:
 *                               type: string
 *                               description: Public ID of the cover image.
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       description: Total number of items.
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number.
 *                     pageSize:
 *                       type: integer
 *                       description: Number of items per page.
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages.
 *       404:
 *         description: Brand not found (if ID is provided) or no brands found for the user.
 *       500:
 *         description: Server error.
 */
router.get(
  "/:id?",
  checkJwt,
  validateRoles([ROLES.USER]),
  setPagination,
  (req, res, next) => brandController.getAllBrands(req, res, next)
);

/**
 * @swagger
 * /brand/{id}:
 *   delete:
 *     summary: Delete a specific brand by ID
 *     description: This endpoint allows users with the USER role to delete a brand by its ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the brand to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand deleted successfully.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Brand not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", checkJwt, validateRoles([ROLES.USER]), (req, res, next) =>
  brandController.deleteBrand(req, res, next)
);


/**
 * @swagger
 * /brand/{id}:
 *   post:
 *     summary: Send Direct Message to  a specific brand by ID
 *     description: This endpoint allows users with the USER role to delete a brand by its ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the brand to delete
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               senderBrandId:
 *                 type: string
 *                 description: ID of the brand.
 *     responses:
 *       200:
 *         description: Brand deleted successfully.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Brand not found.
 *       500:
 *         description: Server error.
 */
router.post("/:id", checkJwt, validateRoles([ROLES.USER]),
validate(BrandValidation.sendMessage, "body"),
(req, res, next) =>
  brandController.sendMessage(req, res, next)
);

export { router };
