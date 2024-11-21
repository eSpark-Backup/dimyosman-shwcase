import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes";
import { AppDataSource } from "./typeorm.config";
import { swaggerOptions } from "./swagger-config";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/errorHandler";
import express, { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully.");
    app.use("/api", router);
    app.use(errorHandler);
  })
  .catch((error: any) => {
    console.error("Error connecting to the database:", error);
  });

export { app };
