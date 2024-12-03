import { Router } from "express";
import { CategoryValidation, validate } from "../validations";
import { Category, User } from "../entity";
import { AppDataSource } from "../typeorm.config";
import { BrandController, CategoryController } from "../controllers";
import { checkJwt, setPagination, validateRoles } from "../middleware";
import { ROLES } from "../constants";

const router = Router();
const categoryRepository = AppDataSource.getRepository(Category);
const userRepository = AppDataSource.getRepository(User);
const categoryController = new CategoryController(
  categoryRepository,
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
  "/",
  checkJwt,
  validateRoles([ROLES.USER]),
  validate(CategoryValidation.CreateCategory, "body"),
  (req, res, next) => categoryController.createCategory(req, res, next)
);

export { router };
