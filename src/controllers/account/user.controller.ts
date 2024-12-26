import { NextFunction, Request, RequestHandler, Response } from "express";
import { Events, User } from "../../entity";
import { ApiError } from "../../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../../utils";
import { HTTP_STATUS } from "../../constants";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { EventDate, ICustomRequest } from "../../interfaces";
import { Notification } from "../../models";

export class UserController {
  constructor(
    private usersRepo: Repository<User>,
    private eventsRepo: Repository<Events>,
    private notificationModel: typeof Notification
  ) {}

  async fetchNotifications(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;

      const { page = 1, pageSize = 10 } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageLimit = parseInt(pageSize as string, 10);

      const [notifications, totalItems] = await Promise.all([
        this.notificationModel
          .find({ user: userId })
          .sort({ createdAt: -1 })
          .skip((pageNumber - 1) * pageLimit)
          .limit(pageLimit)
          .lean(),
        this.notificationModel.countDocuments({ user: userId }),
      ]);

      const totalPages = Math.ceil(totalItems / pageLimit);

      res.status(HTTP_STATUS.OK).json(
        handleResponse("Notifications fetched successfully", {
          notifications,
          pagination: {
            totalItems,
            currentPage: pageNumber,
            pageSize: pageLimit,
            totalPages,
          },
        })
      );
    } catch (error) {
      logger.error(
        `UserController :: fetchNotifications :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getUserProfile(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Retrieve the authenticated user's details
      const userId = req.user?.id;
      const user = (await this.usersRepo
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne()) as User;
      if (!user) {
        throw new ApiError("User profile not found", HTTP_STATUS.NOT_FOUND);
      }

      const { password: _, ...userProfile } = user;
      res
        .status(HTTP_STATUS.OK)
        .json(
          handleResponse("User profile retrieved successfully", userProfile)
        );
    } catch (error) {
      logger.error(
        `UserController :: getUserProfile :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }

  async getCalender(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const events: Events[] = await this.eventsRepo
        .createQueryBuilder("events")
        .where("events.user = :userId", { userId })
        .getMany();

      const calendarEvents = events.flatMap((event) => {
        const eventDates: EventDate[] = Array.isArray(event.eventDate)
          ? event.eventDate
          : JSON.parse(event.eventDate as unknown as string);

        return eventDates.map((dateRange) => ({
          id: event.id,
          title: event.eventName,
          start: new Date(dateRange.startDate),
          end: new Date(dateRange.endDate),
        }));
      });

      res
        .status(HTTP_STATUS.CREATED)
        .json(handleResponse("User Calendar", calendarEvents));
      return next();
    } catch (error) {
      logger.error(
        `UserController :: getCalendar :: ${(error as Error)?.message}`
      );
      return next(error);
    }
  }
}
