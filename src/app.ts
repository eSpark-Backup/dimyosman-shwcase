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
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

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
