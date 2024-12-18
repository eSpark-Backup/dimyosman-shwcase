import { Router } from "express";
import Joi from "joi";
import { AuthValidation, validate } from "../validations";
import { UserController } from "../controllers";
import { User } from "../entity";
import { getRepository } from "typeorm";
import { AppDataSource } from "../typeorm.config";

const router = Router();
const userRepository = AppDataSource.getRepository(User);
const userController = new UserController(userRepository);

/**
 * @swagger
 * /user/calender:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user.
 *     tags:
 *      - User
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
 *               role:
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
  (req, res, next) => userController.registerUser(req, res, next)
);

export { router };
