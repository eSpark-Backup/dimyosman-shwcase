import { Router } from "express";
import { router as authRoutes } from "./auth.routes"; // Import routes from auth.routes.ts
import { router as brandRoutes } from "./brand.routes"; // Import routes from brand.routes.ts

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});
router.use("/auth", authRoutes);
router.use("/brand", brandRoutes);

export { router };
