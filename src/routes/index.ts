import { Router } from "express";
import { router as authRoutes } from "./auth.routes";
import { router as brandRoutes } from "./brand.routes";
import { router as categoryRoutes } from "./category.routes";
import { router as AmenitiesRoutes } from "./amenities.routes";
import { router as spaceRoutes } from "./space.routes";
import { router as eventRoutes } from "./event.routes";
import { checkJwt, validateRoles } from "../middleware";
import { router as UserRoutes } from "./user.routes";
import { ROLES } from "../constants";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});
router.use("/auth", authRoutes);
router.use("/user", checkJwt, validateRoles([ROLES.USER]), UserRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/amenities", AmenitiesRoutes);
router.use("/space", spaceRoutes);
router.use("/event", eventRoutes);

export { router };
