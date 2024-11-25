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
const allowedOrigins = [
  "http://localhost:8080",
  "https://shwcase-stg.esparkconsultants.com",
  "https://shwcase.esparkconsultants.com",
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
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
