import { Router } from "express";
import Joi from "joi";
import { AuthValidation, UserValidation, validate } from "../../validations";
import { UserController } from "../../controllers/account";
import { Events, RSVP, SavedEntity, User } from "../../entity";
import { getRepository } from "typeorm";
import { AppDataSource } from "../../typeorm.config";
import {
  checkJwt,
  handleMultipleFiles,
  setPagination,
  validateRoles,
} from "../../middleware";
import { Notification } from "../../models";
import { FILE_FIELDS, ROLES } from "../../constants";

const router = Router();
const userRepository = AppDataSource.getRepository(User);
const eventRepository = AppDataSource.getRepository(Events);
const savedEntityRepo = AppDataSource.getRepository(SavedEntity);
const rsvpRepo = AppDataSource.getRepository(RSVP);
const userController = new UserController(
  userRepository,
  eventRepository,
  Notification,
  savedEntityRepo,
  rsvpRepo
);

/**
 * @swagger
 * /user/calender:
 *   get:
 *     summary: Get a specific space by ID or all spaces for the authenticated user
 *     description: This endpoint retrieves a specific space by its ID (if provided) or all spaces associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
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
router.get("/calender", setPagination, (req, res, next) =>
  userController.getCalender(req, res, next)
);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     description: This endpoint retrieves the profile details of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
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
router.get("/profile", (req, res, next) =>
  userController.getUserProfile(req, res, next)
);

/**
 * @swagger
 * /user/notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     description: This endpoint retrieves all notifications associated with the authenticated user. Pagination is supported for retrieving multiple notifications.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
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
 *         description: Notifications retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID of the notification.
 *                       title:
 *                         type: string
 *                         description: Title of the notification.
 *                       message:
 *                         type: string
 *                         description: Content of the notification.
 *                       type:
 *                         type: string
 *                         description: Type of the notification (e.g., alert, info, reminder).
 *                       isRead:
 *                         type: boolean
 *                         description: Whether the notification has been read.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time the notification was created.
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
 *         description: No notifications found for the user.
 *       500:
 *         description: Server error.
 */
router.get("/notifications", setPagination, (req, res, next) =>
  userController.fetchNotifications(req, res, next)
);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     description: This endpoint allows users to update their profile details.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name.
 *               lastName:
 *                 type: string
 *                 description: The user's last name.
 *               profileImage:
 *                 type: string
 *                 description: The URL of the user's profile image.
 *               loginType:
 *                 type: string
 *                 enum: [email, google, facebook]
 *                 description: The type of login used.
 *               isSocialLogin:
 *                 type: boolean
 *                 description: Indicates if the user logged in via social login.
 *               profile:
 *                 type: boolean
 *                 description: Indicates if the profile is active.
 *               sendEmails:
 *                 type: boolean
 *                 description: Whether the user opts to receive emails.
 *               socialId:
 *                 type: string
 *                 description: The social login ID.
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User profile updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     loginType:
 *                       type: string
 *                     isSocialLogin:
 *                       type: boolean
 *                     profile:
 *                       type: boolean
 *                     sendEmails:
 *                       type: boolean
 *                     socialId:
 *                       type: string
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
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
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
router.put(
  "/profile",
  checkJwt,
  validateRoles([ROLES.USER]),
  validate(UserValidation.updateUser, "body"),
  (req, res, next) => userController.updateUser(req, res, next)
);

/**
 * @swagger
 * /user/profileImage:
 *   put:
 *     summary: Update User Profile Image
 *     description: This endpoint allows users with the USER role to Update User Profile Image.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image of the User.
 *     responses:
 *       201:
 *         description: user profile updated successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Server error.
 */
router.put(
  "/profileImage",
  checkJwt,
  validateRoles([ROLES.USER]),
  handleMultipleFiles([{ name: FILE_FIELDS.IMAGE, maxCount: 1 }]),
  (req, res, next) => userController.updateProfileImage(req, res, next)
);

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change user password
 *     description: Allows users to change their password by providing the old password and a new password.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password to set.
 *                 example: newPassword456
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized - Incorrect old password.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/change-password",
  checkJwt,
  validateRoles([ROLES.USER]),
  validate(UserValidation.changePasswordValidation, "body"),
  (req, res, next) => userController.changePassword(req, res, next)
);

/**
 * @swagger
 * /user/email:
 *   put:
 *     summary: Update user email address
 *     description: This endpoint allows users to update their email address.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *                 description: The new email address.
 *               oldEmail:
 *                 type: string
 *                 description: The current email address.
 *     responses:
 *       200:
 *         description: Email updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email updated successfully.
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
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
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
router.put(
  "/email",
  checkJwt,
  validateRoles([ROLES.USER]),
  validate(UserValidation.updateEmail, "body"),
  (req, res, next) => userController.updateEmail(req, res, next)
);

/**
 * @swagger
 * /user/confirm-email:
 *   get:
 *     summary: Verify the email confirmation token
 *     description: This endpoint verifies the email confirmation token to update the user’s email address.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The confirmation token sent to the user.
 *       - in: query
 *         name: expiresAt
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The expiration time of the token.
 *     responses:
 *       200:
 *         description: Token is valid and email has been successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email has been successfully updated and verified."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     email:
 *                       type: string
 *                       example: "newemail@example.com"
 *       400:
 *         description: Bad request due to invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing token."
 *       403:
 *         description: The token has expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token has expired."
 *       404:
 *         description: User not found for the given token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get("/confirm-email", checkJwt, (req, res, next) =>
  userController.verifyTokenAPI(req, res, next)
);

/**
 * @swagger
 * /user/favourites:
 *   get:
 *     summary: Get a specific Favourites by Entity for the authenticated user
 *     description: This endpoint retrieves all entities associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
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
 *         required: true
 *         description: Name of the Entity.
 *         schema:
 *          type: string
 *          enum:
 *            - SPACE
 *            - EVENT
 *            - BRAND
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
  "/favourites",
  checkJwt,
  validateRoles([ROLES.USER]),
  setPagination,
  (req, res, next) => userController.getFavourites(req, res, next)
);

/**
 * @swagger
 * /user/favourites:
 *   post:
 *     summary: Calculate total price for a space based on pricing and date range
 *     description: Calculate the total price dynamically for a given date range and pricing structure.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entityId:
 *                 type: string
 *                 description: The Id of the Entity.
 *                 example: 223232
 *               entityType:
 *                 type: string
 *                 description: The Type of the Entity.
 *                 example: BRAND
 *     responses:
 *       200:
 *         description: Entity Added To Favourites completed successfully.
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
router.post(
  "/favourites",
  checkJwt,
  validateRoles([ROLES.USER]),
  validate(UserValidation.addToFavorites, "body"),
  (req, res, next) => userController.addToFavourites(req, res, next)
);

/**
 * @swagger
 * /user/follow:
 *   get:
 *     summary: Get a specific Follow by Entity for the authenticated user
 *     description: This endpoint retrieves all entities associated with the authenticated user. Pagination is supported for retrieving multiple spaces.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
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
 *         required: true
 *         description: Name of the Entity.
 *         schema:
 *          type: string
 *          enum:
 *            - SPACE
 *            - EVENT
 *            - BRAND
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
  "/follow",
  checkJwt,
  validateRoles([ROLES.USER]),
  setPagination,
  (req, res, next) => userController.getFollow(req, res, next)
);

/**
 * @swagger
 * /user/follow:
 *   post:
 *     summary: Calculate total price for a space based on pricing and date range
 *     description: Calculate the total price dynamically for a given date range and pricing structure.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entityId:
 *                 type: string
 *                 description: The Id of the Entity.
 *                 example: 223232
 *               entityType:
 *                 type: string
 *                 description: The Type of the Entity.
 *                 example: BRAND
 *     responses:
 *       200:
 *         description: Entity Added To Favourites completed successfully.
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
router.post(
  "/follow",
  checkJwt,
  validateRoles([ROLES.USER]),
  validate(UserValidation.addToFavorites, "body"),
  (req, res, next) => userController.addToFollow(req, res, next)
);

export { router };
