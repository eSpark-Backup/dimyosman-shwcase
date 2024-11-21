import { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../utils";
import { HTTP_STATUS } from "../constants";

export class AuthController {
  constructor(private usersRepo: Repository<User>) {}

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password, role, loginType, isSocialLogin } =
        req.body;

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;
      user.role = role;
      user.loginType = loginType;
      user.isSocialLogin = isSocialLogin;

      await this.usersRepo.save(user);

      res
        .status(HTTP_STATUS.OK)
        .json(handleResponse("Sign Up Successfully", user));
    } catch (error) {
      logger.error(
        `AuthController :: registerUser :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
}
