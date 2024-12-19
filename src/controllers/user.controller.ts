import { NextFunction, Request, RequestHandler, Response } from "express";
import { Events, User } from "../entity";
import { ApiError } from "../errors";
import { Repository } from "typeorm";
import { handleResponse, logger } from "../utils";
import { HTTP_STATUS } from "../constants";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { EventDate, ICustomRequest } from "../interfaces";

export class UserController {
  constructor(
    private usersRepo: Repository<User>,
    private eventsRepo: Repository<Events>
  ) {}

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
