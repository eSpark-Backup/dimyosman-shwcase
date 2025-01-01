import { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../../entity";
import { ApiError } from "../../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../../utils";
import { CHAT_COOKIE, HTTP_STATUS } from "../../constants";
import jwt from "jsonwebtoken";
import { UserForChat } from "../../models";
import bcrypt from "bcryptjs";
import { mailService } from "../../services/mail.service";
const cookieOptions: {
  maxAge: number;
  sameSite: "none" | "lax" | "strict";
  httpOnly: boolean;
  secure: boolean;
} = {
  maxAge: 3600000,
  sameSite: "lax",
  httpOnly: true,
  secure: true,
};

export class AuthController {
  constructor(private usersRepo: Repository<User>) {}

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        loginType,
        isSocialLogin,
        socialId,
        profileImage,
      } = req.body;

      if (isSocialLogin) {
        if (!socialId || !profileImage) {
          throw new ApiError(
            "Please provide socialId and profileImage for social login.",
            HTTP_STATUS.BAD_REQUEST
          );
        }

        const existingUser = (await this.usersRepo.findOne({
          where: { email, loginType },
        })) as User;

        if (existingUser && existingUser.isSocialLogin == false) {
          throw new ApiError(
            "Invalid Login Method or Email Already Exists",
            HTTP_STATUS.BAD_REQUEST
          );
        }

        if (existingUser && existingUser.loginType == loginType) {
          const userChat = await UserForChat.findById(existingUser.userChatId);
          let socketUser = userChat;
          if (!userChat) {
            const newUserChat = await UserForChat.create({
              name: firstName + " " + lastName,
              accountId: existingUser.id,
              username: email,
              password: "",
              bio: "",
              avatar: profileImage,
            });
            socketUser = newUserChat;
            const usersocketId = socketUser._id;
            existingUser.userChatId = usersocketId.toString();
            await this.usersRepo.save(existingUser);
          }

          const token = jwt.sign(
            {
              id: existingUser.id,
              email: existingUser.email,
              role: existingUser.role,
              _id: socketUser._id,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
          );

          res
            .status(HTTP_STATUS.OK)
            .cookie(CHAT_COOKIE, token, cookieOptions)
            .json(
              handleResponse("Social Login successful", {
                token,
                user: existingUser,
              })
            );
          return next();
        }

        const user = new User();
        user.name = firstName + " " + lastName;
        user.email = email;
        user.profileImage = profileImage;
        user.loginType = loginType;
        user.isSocialLogin = true;
        user.role = role;
        user.userChatId = "";

        user.socialId = socialId;

        const newUser = await this.usersRepo.save(user);

        let socketUser;

        const newUserChat = await UserForChat.create({
          name: firstName + " " + lastName,
          accountId: newUser.id,
          username: email,
          password: "",
          bio: "",
          avatar: profileImage,
        });
        socketUser = newUserChat;

        const usersocketId = socketUser._id;
        newUser.userChatId = usersocketId.toString();
        await this.usersRepo.save(newUser);
        // Generate JWT for new social login user
        const token = jwt.sign(
          {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            _id: socketUser._id,
          },
          process.env.JWT_SECRET!,
          { expiresIn: "24h" }
        );

        res
          .status(HTTP_STATUS.CREATED)
          .cookie(CHAT_COOKIE, token, cookieOptions)
          .json(
            handleResponse("Social Sign Up Successfully", {
              token,
              user: newUser,
            })
          );
        return next();
      }

      // Standard Login Flow
      if (!password) {
        throw new ApiError(
          "Password is required for standard login.",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const existingUser = await this.usersRepo.findOne({ where: { email } });
      if (existingUser) {
        throw new ApiError(
          "Email is already registered. Please log in.",
          HTTP_STATUS.ALREADY_EXISTS
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User();
      user.name = firstName + " " + lastName;
      user.email = email;
      user.password = hashedPassword;
      user.role = role;
      user.loginType = loginType;
      user.isSocialLogin = false;

      const newUser = await this.usersRepo.save(user);

      const userChat = await UserForChat.findOne({
        where: { accountId: newUser.id },
      });
      let socketUser = userChat;
      if (!userChat) {
        const newUserChat = await UserForChat.create({
          name: firstName + " " + lastName,
          accountId: newUser.id,
          username: email,
          password: "",
          bio: "",
          avatar: profileImage,
        });
        socketUser = newUserChat;
        const usersocketId = socketUser._id;
        newUser.userChatId = usersocketId.toString();
        await this.usersRepo.save(newUser);
      }

      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          _id: socketUser._id,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );
      const { password: _, ...userWithoutPassword } = newUser;

      res
        .status(HTTP_STATUS.CREATED)
        .cookie(CHAT_COOKIE, token, cookieOptions)
        .json(
          handleResponse("Sign Up Successfully", {
            token,
            user: userWithoutPassword,
          })
        );
    } catch (error) {
      logger.error(
        `AuthController :: registerUser :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async deleteAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      const user = await this.usersRepo.findOne({ where: { email } });
      if (!user) {
        throw new ApiError("User not found.", HTTP_STATUS.NOT_FOUND);
      }

      await this.usersRepo.delete(user.id);

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Account deleted successfully."));
      return next();
    } catch (error) {
      logger.error(
        `AuthController :: deleteAccount :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, loginType, socialId } = req.body;

      // Check if the user exists
      const user = await this.usersRepo.findOne({ where: { email } });
      if (!user) {
        throw new ApiError(
          "Invalid email or password.",
          HTTP_STATUS.UN_AUTHORIZED
        );
      }

      // Handle Standard Login
      if (!password) {
        throw new ApiError("Password is required.", HTTP_STATUS.BAD_REQUEST);
      }
      if (user.isSocialLogin) {
        throw new ApiError(
          "This email is registered as a social login. Please use social login.",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(
          "Invalid email or password.",
          HTTP_STATUS.UN_AUTHORIZED
        );
      }
      const userChat = await UserForChat.findById(user.userChatId);
      let socketUser = userChat;
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          _id: socketUser._id,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );
      const { password: _, ...userWithoutPassword } = user;

      res
        .status(HTTP_STATUS.OK)
        .cookie(CHAT_COOKIE, token, cookieOptions)
        .json(
          handleResponse("Login successful", { token, userWithoutPassword })
        );
      return next();
    } catch (error) {
      logger.error(
        `AuthController :: loginUser :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
}
