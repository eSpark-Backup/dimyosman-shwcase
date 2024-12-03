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
 * /category:
 *   post:
 *     summary: Create a new category
 *     description: This endpoint allows users with the USER role to create a new category.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: Name of the category.
 *               categoryType:
 *                 type: string
 *                 enum:
 *                   - BRANDS
 *                   - EVENTS
 *                   - SPACES
 *                 description: Type of the category.
 *     responses:
 *       201:
 *         description: Category created successfully.
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

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retrieve all categories
 *     description: This endpoint allows users with the USER role to fetch all categories. Optionally, you can filter categories by type.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Category
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - BRANDS
 *             - EVENTS
 *             - SPACES
 *         description: Filter categories by type.
 *     responses:
 *       200:
 *         description: Successfully retrieved categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier of the category.
 *                   categoryName:
 *                     type: string
 *                     description: Name of the category.
 *                   categoryType:
 *                     type: string
 *                     description: Type of the category.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Server error.
 */
router.get("/", checkJwt, validateRoles([ROLES.USER]), (req, res, next) =>
  categoryController.getAllCategories(req, res, next)
);

export { router };
