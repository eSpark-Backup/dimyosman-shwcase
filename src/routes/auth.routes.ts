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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               loginType:
 *                 type: string
 *                 enum: [local, facebook, google, apple]
 *               isSocialLogin:
 *                 type: boolean
 *               profileImage:
 *                 type: string
 *               socialId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  "/register",
  validate(AuthValidation.signupUser, "body"),
  (req, res, next) => authController.registerUser(req, res, next)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: This endpoint logs in a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  "/login",
  validate(AuthValidation.loginUser, "body"), // Add a validation schema for login
  (req, res, next) => authController.loginUser(req, res, next)
);

export { router };
