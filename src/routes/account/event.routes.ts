import { Router } from "express";
import { EventValidation, SpaceValidation, validate } from "../../validations";
import { Brand, Events, RSVP, SavedEntity, Spaces, User } from "../../entity";
import { AppDataSource } from "../../typeorm.config";
import { EventController } from "../../controllers/account";
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

const router = Router();
const spaceRepository = AppDataSource.getRepository(Spaces);
const userRepository = AppDataSource.getRepository(User);
const brandRepository = AppDataSource.getRepository(Brand);
const eventRepository = AppDataSource.getRepository(Events);
const rsvpEventRepository = AppDataSource.getRepository(RSVP);
const savedEntityRepository = AppDataSource.getRepository(SavedEntity);

const eventController = new EventController(
  spaceRepository,
  userRepository,
  brandRepository,
  eventRepository,
  rsvpEventRepository,
  savedEntityRepository
);

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Create a new event
 *     description: This endpoint allows users with the USER role to create a new event.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               brandId:
 *                 type: string
 *                 description: Id of the Brand.
 *               spaceId:
 *                 type: string
 *                 description: Id of the Space.
 *               eventName:
 *                 type: string
 *                 description: Name of the event.
 *               eventCategory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the event category.
 *                 description: The category of the event.
 *               eventDate:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       description: Name of the Amenity.
 *                     endDate:
 *                       type: string
 *                       description: URL of the icon image.
 *                 description: The Amenities and Features of the event.
 *               details:
 *                  type: object
 *                  properties:
 *                    description:
 *                       type: string
 *                       description: A brief description of the event
 *                    htmlContent:
 *                       type: string
 *                       description: HTML content related to the event (e.g., description with HTML tags)
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
 *                 description: Array of cover images for the event.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Additional image of the event.
 *     responses:
 *       201:
 *         description: event created successfully.
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
  parseJsonFields(["eventCategory", "details", "location", "eventDate"]),
  validate(EventValidation.CreateEvent, "body"),
  (req, res, next) => eventController.createEvent(req, req as any, res, next)
);

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Update an existing event
 *     description: This endpoint allows users with the USER role to update an existing event.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *               eventCategory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *               spaceId:
 *                 type: string
 *                 description: Id of the Space.
 *               eventDate:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       description: Name of the Amenity.
 *                     endDate:
 *                       type: string
 *                       description: URL of the icon image.
 *                 description: The Amenities and Features of the event.
 *               details:
 *                  type: object
 *                  properties:
 *                    description:
 *                       type: string
 *                       description: A brief description of the event
 *                    htmlContent:
 *                       type: string
 *                       description: HTML content related to the event (e.g., description with HTML tags)
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
 *                 description: Array of cover keys for the event.
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: event updated successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: event not found.
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
  parseJsonFields(["eventCategory", "details", "location", "eventDate"]),
  validate(EventValidation.UpdateEvent, "body"),
  (req, res, next) => eventController.updateEvent(req, req as any, res, next)
);

/**
 * @swagger
 * /event/rsvp/{id}:
 *   post:
 *     summary: RSVP an existing event
 *     description: This endpoint allows users with the USER role to RSVP an existing event.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to RSVP
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendanceDates:
 *                  type: object
 *                  properties:
 *                    dateTime:
 *                       type: string
 *                       description: Date and Time to RSVP
 *     responses:
 *       200:
 *         description: event rsvp successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: event not found.
 *       500:
 *         description: Server error.
 */
router.post(
  "/rsvp/:id",
  checkJwt,
  validateRoles([ROLES.USER]),
  parseJsonFields(["attendanceDates"]),
  validate(EventValidation.RsvpEvent, "body"),
  (req, res, next) => eventController.rsvpEvent(req, res, next)
);

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Get a specific event by ID or all events for the authenticated user
 *     description: This endpoint retrieves a specific event by its ID (if provided) or all events associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: ID of the event to retrieve (optional).
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
 *           example: Event
 *     responses:
 *       200:
 *         description: event found by ID or all events for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       eventName:
 *                         type: string
 *                         description: Name of the event.
 *                       eventCategory:
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
 *                         description: Categories of the event.
 *                       details:
 *                         type: object
 *                         description: Details about the event.
 *                       location:
 *                         type: object
 *                         properties:
 *                           long:
 *                             type: number
 *                             description: Longitude of the event's location.
 *                           lat:
 *                             type: number
 *                             description: Latitude of the event's location.
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
 *         description: event not found (if ID is provided) or no events found for the user.
 *       500:
 *         description: Server error.
 */
router.get(
  "/:id?",
  checkJwt,
  validateRoles([ROLES.USER]),
  setPagination,
  (req, res, next) => eventController.getAllEvents(req, res, next)
);

export { router };
