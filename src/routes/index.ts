import { Router } from "express";
import { router as authRoutes } from "./auth.routes"; // Import routes from auth.routes.ts

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});
router.use("/auth", authRoutes);

export { router };
