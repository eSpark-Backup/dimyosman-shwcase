import { Router } from "express";
import { SpaceValidation, validate } from "../../validations";
import {
  Brand,
  Events,
  LeaseSpace,
  Spaces,
  User,
  Category,
  SavedEntity,
} from "../../entity";
import { AppDataSource } from "../../typeorm.config";
import { GeneralController, SpaceController } from "../../controllers/account";
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
const categoryRepository = AppDataSource.getRepository(Category);
const savedEntityRepository=AppDataSource.getRepository(SavedEntity)

const generalController = new GeneralController(
  spaceRepository,
  userRepository,
  brandRepository,
  eventRepository,
  leaseSpaceRepository,
  categoryRepository,

  Chat,
  UserForChat,
  Notification,
  Message,
  savedEntityRepository

);

/**
 * @swagger
 * /general/search/{id}:
 *   get:
 *     summary: Get a specific space by ID or all spaces for the authenticated user
 *     description: This endpoint retrieves a specific space by its ID (if provided) or all spaces associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - General
 *     parameters:
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
 *         name: entity
 *         required: false
 *         description: Name of the Entity.
 *         schema:
 *          type: string
 *          enum:
 *            - All
 *            - SPACE
 *            - EVENT
 *            - BRAND
 *       - in: query
 *         name: name
 *         required: false
 *         description: name to filter the All.
 *         schema:
 *          type: string
 *          example: Eco Lux
 *       - in: query
 *         name: radius
 *         required: false
 *         description: Radius to filter the All.
 *         schema:
 *          type: integer
 *          example: 10
 *       - in: query
 *         name: long
 *         required: false
 *         description: Longitude
 *         schema:
 *          type: float
 *          example: 23.222
 *       - in: query
 *         name: lat
 *         required: false
 *         description: Latitude
 *         schema:
 *          type: float
 *          example: 60.222
 *       - in: query
 *         name: additional
 *         required: false
 *         description: Address Of the Entity
 *         schema:
 *           type: string
 *           example: Street 2
 *       - in: query
 *         name: categoryNames
 *         required: false
 *         description: Comma-separated list of category names to filter by (e.g., "Real Estate, Technology, Events").
 *         schema:
 *           type: string
 *           example: "Real Estate, Technology, Events"
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
  "/search/:id?",
  checkJwt,
  validateRoles([ROLES.USER]),
  setPagination,
  (req, res, next) => generalController.generalSearch(req, res, next)
);

/**
 * @swagger
 * /general/category:
 *   get:
 *     summary: Retrieve categories
 *     description: Get all categories or filter by category type.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - General
 *     parameters:
 *       - in: query
 *         name: categoryType
 *         required: false
 *         description: The type of category to filter by (e.g., BRANDS, SPACES, EVENTS).
 *         schema:
 *           type: string
 *           enum:
 *             - BRANDS
 *             - SPACES
 *             - EVENTS
 *     responses:
 *       200:
 *         description: Categories retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category Search completed successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: ["Category 1", "Category 2"]
 *       400:
 *         description: Invalid request or validation error.
 *       500:
 *         description: Server error.
 */

router.get(
  "/category",
  checkJwt,
  validateRoles([ROLES.USER]),
  (req, res, next) => generalController.getCategoriesByType(req, res, next)
);

/**
 * @swagger
 * /general/activity:
 *   get:
 *     summary: Get a specific space by ID or all spaces for the authenticated user
 *     description: This endpoint retrieves a specific space by its ID (if provided) or all spaces associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - General
 *     parameters:
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
 *         description: Timeline found by ID or all Entities for the authenticated user.
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
  "/activity",
  checkJwt,
  validateRoles([ROLES.USER]),
  setPagination,
  (req, res, next) => generalController.getActivity(req, res, next)
);



/**
 * @swagger
 * /general/share/{data}:
 *   get:
 *     summary: Get a specific space by ID or all spaces for the authenticated user
 *     description: This endpoint retrieves a specific space by its ID (if provided) or all spaces associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - General
 *     parameters:
 *       - in: path
 *         name: data
 *         required: true
 *         description: Data of Entity.
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
 *       404:
 *         description: space not found (if ID is provided) or no spaces found for the user.
 *       500:
 *         description: Server error.
 */
router.get(
  "/share/:data",
  (req, res, next) => generalController.getSharedEntity(req, res, next)
);




/**
 * @swagger
 * /general/location:
 *   post:
 *     summary: Get a specific Address by Input
 *     description: This endpoint retrieves a specific space by its ID (if provided) or all spaces associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - General
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Some Place.
 *         schema:
 *           type: string
 *           example: House 13
 *     responses:
 *       200:
 *         description: Timeline found by ID or all Entities for the authenticated user.
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

router.post
( "/location",
  checkJwt,
  validateRoles([ROLES.USER]),
  (req, res, next) => generalController.getSuggestion(req, res, next)
);



/**
 * @swagger
 * /general/getUserPublicProfile/{id}:
 *   get:
 *     summary: Get authenticated user's profile
 *     description: This endpoint retrieves the profile details of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - General
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id of the User.
 *         schema:
 *           type: string
 *           example: House 13
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID.
 *                 username:
 *                   type: string
 *                   description: Username of the user.
 *                 email:
 *                   type: string
 *                   description: Email of the user.
 *                 fullName:
 *                   type: string
 *                   description: Full name of the user.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: User account creation date.
 *       404:
 *         description: User profile not found.
 *       500:
 *         description: Server error.
 */
router.get
("/getUserPublicProfile/:id",
  checkJwt,
  validateRoles([ROLES.USER]),
  (req, res, next) => generalController.getPublicUserProfile(req, res, next)
)





export { router };
