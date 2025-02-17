import { ErrorRequestHandler } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants";
import { logToDatabase } from "../services"; 

export const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  try {
    const message = err.message || ERROR_MESSAGES.SOMETHING_WRONG;
    const level = err?.statusCode === HTTP_STATUS.SERVER_ERROR ? "error" : "warning"; 
    
    await logToDatabase(message, level);

  } catch (logError) {
    console.error("Error logging to database", logError); 
  }

  res.status(err?.statusCode ?? HTTP_STATUS.SERVER_ERROR).json({
    status: false,
    data: null,
    message: err?.message ?? ERROR_MESSAGES.SOMETHING_WRONG,
    statusCode: err?.statusCode ?? HTTP_STATUS.SERVER_ERROR,
  });
};
