import { Router } from "express";
import { SpaceValidation, validate } from "../../validations";
import { Brand, Events, LeaseSpace, Spaces, User } from "../../entity";
import { AppDataSource } from "../../typeorm.config";
import { SpaceController } from "../../controllers/account";
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
import { Chat, Message, Notification, UserForChat } from "../../models";

const router = Router();
const spaceRepository = AppDataSource.getRepository(Spaces);
const userRepository = AppDataSource.getRepository(User);
const brandRepository = AppDataSource.getRepository(Brand);
const eventRepository = AppDataSource.getRepository(Events);
const leaseSpaceRepository = AppDataSource.getRepository(LeaseSpace);

const spaceController = new SpaceController(
  spaceRepository,
  userRepository,
  brandRepository,
  eventRepository,
  leaseSpaceRepository,

  Chat,
  UserForChat,
  Notification,
  Message
);

/**
 * @swagger
 * /space/inquire:
 *   post:
 *     summary: Inquire about a space
 *     description: This endpoint allows users to inquire about a specific space by sending a message to the creator.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverSpaceId:
 *                 type: string
 *                 description: The ID of the space being inquired about.
 *               message:
 *                 type: string
 *                 description: The inquiry message.
 *               senderBrandId:
 *                 type: string
 *                 description: The ID of the sender's brand.
 *               receiverBrandId:
 *                 type: string
 *                 description: The ID of the Receiver's brand.
 *     responses:
 *       200:
 *         description: Inquiry sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inquiry sent successfully.
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation error.
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden access.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An unexpected error occurred.
 */
router.post(
  "/inquire",
  checkJwt,
  validateRoles([ROLES.USER]),
  validate(SpaceValidation.inquireSpace, "body"),
  (req, res, next) => spaceController.inquireSpace(req, res, next)
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
 *               pricing:
 *                 type: object
 *                 properties:
 *                   term:
 *                     type: string
 *                     description: Weekly/Daily/Monthly/Yearly.
 *                   price:
 *                     type: string
 *                     description: Price of that Term.
 *                   minimum:
 *                     type: string
 *                     description: Minimum Days of Term.
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
 *                   additional:
 *                     type: string
 *                     description: Additional information about the location.
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
  parseJsonFields([
    "spaceCategory",
    "details",
    "location",
    "amenity",
    "pricing",
  ]),
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
 *               brandId:
 *                 type: string
 *                 description: Id of the Brand.
 *               pricing:
 *                 type: object
 *                 properties:
 *                   term:
 *                     type: string
 *                     description: Weekly/Daily/Monthly/Yearly.
 *                   price:
 *                     type: string
 *                     description: Price of that Term.
 *                   minimum:
 *                     type: string
 *                     description: Minimum Days of Term.
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
 *                   additional:
 *                     type: string
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
  parseJsonFields([
    "spaceCategory",
    "details",
    "location",
    "amenity",
    "pricing",
  ]),
  validate(SpaceValidation.UpdateSpace, "body"),
  (req, res, next) => spaceController.updateSpace(req, req as any, res, next)
);

/**
 * @swagger
 * /space/leaseSpace:
 *   post:
 *     summary: Send a Lease Contract For Space
 *     description: This endpoint allows users with the USER role to send contract for Lease.
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
 *               spaceId:
 *                 type: string
 *                 description: ID of the space.
 *               chatId:
 *                 type: string
 *                 description: Name of the space.
 *               tenantId:
 *                 type: string
 *                 description: Name of the space.
 *               contractDetails:
 *                  type: object
 *                  properties:
 *                    description:
 *                       type: string
 *                       description: A brief description of the Lease Contract
 *                    htmlContent:
 *                       type: string
 *                       description: HTML content related to the Contract (e.g., description with HTML tags)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Additional image of the Owner Signature.
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
  "/leaseSpace",
  checkJwt,
  validateRoles([ROLES.USER]),
  handleMultipleFiles([{ name: FILE_FIELDS.IMAGE, maxCount: 1 }]),
  parseJsonFields(["contractDetails"]),
  validate(SpaceValidation.LeasingSpaceValidation, "body"),
  (req, res, next) => spaceController.leaseSpace(req, res, next)
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
 *       - in: query
 *         name: tab
 *         required: false
 *         description: Tab name to filter the spaces.
 *         schema:
 *           type: string
 *           example: Lease
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
 * /space/publishedSpace/{id}:
 *   get:
 *     summary: Get a specific space by ID or all spaces for the authenticated user
 *     description: This endpoint retrieves a specific space by its ID (if provided) or all spaces associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *      - bearerAuth: []
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
 *         description: space not found (if ID is provided) or no spaces found for the user.
 *       500:
 *         description: Server error.
 */
router.get(
  "/publishedSpace/:id?",
  checkJwt,
  validateRoles([ROLES.USER]),
  setPagination,
  (req, res, next) => spaceController.getAllPublishedSpaces(req, res, next)
);

/**
 * @swagger
 * /space/price:
 *   post:
 *     summary: Calculate total price for a space based on pricing and date range
 *     description: Calculate the total price dynamically for a given date range and pricing structure.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pricing:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     term:
 *                       type: string
 *                       enum: [Day, Week, Month, Year]
 *                       description: The pricing term.
 *                     price:
 *                       type: string
 *                       description: The price for the term.
 *                     minimum:
 *                       type: integer
 *                       description: Minimum number of terms required.
 *               days:
 *                 type: integer
 *                 description: The number of days for the calculation.
 *                 example: 38
 *     responses:
 *       200:
 *         description: Price calculation completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPrice:
 *                   type: string
 *                   description: Calculated total price.
 *                 termDetails:
 *                   type: object
 *                   description: The term used for calculation.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Server error.
 */
router.post("/price", checkJwt, validateRoles([ROLES.USER]), (req, res, next) =>
  spaceController.getSpacePrice(req, res, next)
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
