import { Router } from "express";
import { SpaceValidation, validate } from "../validations";
import { Brand, Spaces, User } from "../entity";
import { AppDataSource } from "../typeorm.config";
import { SpaceController } from "../controllers";
import {
  checkJwt,
  handleMultipleFiles,
  handleSingleFile,
  setPagination,
  validateRoles,
} from "../middleware";
import { FILE_FIELDS, ROLES } from "../constants";
import { parseJsonFields } from "../utils";
import { IFileRequest } from "../interfaces";

const router = Router();
const spaceRepository = AppDataSource.getRepository(Spaces);
const userRepository = AppDataSource.getRepository(User);
const brandRepository = AppDataSource.getRepository(Brand);
const spaceController = new SpaceController(
  spaceRepository,
  userRepository,
  brandRepository
);

/**
 * @swagger
 * /space:
 *   post:
 *     summary: Create a new space
 *     description: This endpoint allows users with the USER role to create a new space.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               brandId:
 *                 type: string
 *                 description: Name of the space.
 *               spaceName:
 *                 type: string
 *                 description: Name of the space.
 *               minLeaseDays:
 *                 type: string
 *                 description: Number days of Lease.
 *               spaceCategory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the space category.
 *                 description: The category of the space.
 *               amenity:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the Amenity.
 *                     iconUrl:
 *                       type: string
 *                       description: URL of the icon image.
 *                 description: The Amenities and Features of the space.
 *               details:
 *                  type: object
 *                  properties:
 *                    description:
 *                       type: string
 *                       description: A brief description of the space
 *                    htmlContent:
 *                       type: string
 *                       description: HTML content related to the space (e.g., description with HTML tags)
 *               location:
 *                 type: object
 *                 properties:
 *                   long:
 *                     type: number
 *                     description: Longitude of the space's location.
 *                   lat:
 *                     type: number
 *                     description: Latitude of the space's location.
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
 *                 description: Array of cover images for the space.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Additional image of the space.
 *     responses:
 *       201:
 *         description: space created successfully.
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
  parseJsonFields(["spaceCategory", "details", "location", "amenity"]),
  validate(SpaceValidation.CreateSpace, "body"),
  (req, res, next) => spaceController.createSpace(req, req as any, res, next)
);

/**
 * @swagger
 * /space/{id}:
 *   put:
 *     summary: Update an existing space
 *     description: This endpoint allows users with the USER role to update an existing space.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the space to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               spaceName:
 *                 type: string
 *               minLeaseDays:
 *                 type: string
 *                 description: Number days of Lease.
 *               spaceCategory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *               amenity:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the Amenity.
 *                     iconUrl:
 *                       type: string
 *                       description: URL of the icon image.
 *                 description: The Amenities and Features of the space.
 *               details:
 *                  type: object
 *                  properties:
 *                    description:
 *                       type: string
 *                       description: A brief description of the space
 *                    htmlContent:
 *                       type: string
 *                       description: HTML content related to the space (e.g., description with HTML tags)
 *               location:
 *                 type: object
 *                 properties:
 *                   long:
 *                     type: number
 *                   lat:
 *                     type: number
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: space updated successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: space not found.
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
  parseJsonFields(["spaceCategory", "details", "location", "amenity"]),
  validate(SpaceValidation.UpdateSpace, "body"),
  (req, res, next) => spaceController.updateSpace(req, req as any, res, next)
);

/**
 * @swagger
 * /space/{id}:
 *   get:
 *     summary: Get a specific space by ID or all spaces for the authenticated user
 *     description: This endpoint retrieves a specific space by its ID (if provided) or all spaces associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: ID of the space to retrieve (optional).
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
 *         description: space found by ID or all spaces for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 spaces:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       spaceName:
 *                         type: string
 *                         description: Name of the space.
 *                       spaceCategory:
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
 *                         description: Categories of the space.
 *                       details:
 *                         type: object
 *                         description: Details about the space.
 *                       location:
 *                         type: object
 *                         properties:
 *                           long:
 *                             type: number
 *                             description: Longitude of the space's location.
 *                           lat:
 *                             type: number
 *                             description: Latitude of the space's location.
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
 *         description: space not found (if ID is provided) or no spaces found for the user.
 *       500:
 *         description: Server error.
 */
router.get(
  "/:id?",
  checkJwt,
  validateRoles([ROLES.USER]),
  setPagination,
  (req, res, next) => spaceController.getAllSpaces(req, res, next)
);

/**
 * @swagger
 * /space/{id}:
 *   delete:
 *     summary: Delete a specific space by ID
 *     description: This endpoint allows users with the USER role to delete a space by its ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the space to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: space deleted successfully.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: space not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", checkJwt, validateRoles([ROLES.USER]), (req, res, next) =>
  spaceController.deleteSpace(req, res, next)
);

export { router };
