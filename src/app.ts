import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes";
import { AppDataSource } from "./typeorm.config";
import { swaggerOptions } from "./swagger-config";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/errorHandler";
import express, { Request, Response, NextFunction } from "express";
import { clearUploadsFolder } from "./middleware";

dotenv.config();

const app = express();
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log("Memory Stack:", process.memoryUsage());
console.log(process.cwd());
console.log(__dirname);
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully.");
    app.use(clearUploadsFolder);
    app.use("/api", router);
    app.use(errorHandler);
  })
  .catch((error: any) => {
    console.error("Error connecting to the database:", error);
  });

export { app };
