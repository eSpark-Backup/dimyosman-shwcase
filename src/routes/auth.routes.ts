import { Router } from "express";
import Joi from "joi";
import { AuthValidation, validate } from "../validations";
import { AuthController } from "../controllers/auth.controller";
import { User } from "../entity";
import { getRepository } from "typeorm";
import { AppDataSource } from "../typeorm.config";

const router = Router();
const userRepository = AppDataSource.getRepository(User);
const authController = new AuthController(userRepository);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Server error
 */
router.post(
  "/register",
  validate(AuthValidation.signupUser, "body"),
  (req, res, next) => authController.registerUser(req, res, next)
);

export { router };
