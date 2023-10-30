import express from "express";
import UserController from "../controllers/UserController.js";
import SectorController from "../controllers/SectorController.js";
import { validate_request } from "../middlewares/middlewares.js";
const router = express.Router();

// middlewares
// router.use("/official-sectors", validate_request);
// router.use("/community-sectors", validate_request);
// router.use("/nearby-sectors", validate_request);
// router.use("/add-sector", validate_request);

// User Routes
router.get("/", UserController.getAllUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/auth", UserController.authenticate);

// Sector Routes
router.get("/official-sectors", SectorController.get_all_official_sectors);
router.get("/community-sectors", SectorController.get_all_community_sectors);
router.get(
  "/nearby-sectors/:lat/:long/:official",
  SectorController.get_nearby_sectors
);
router.post("/add-sector", SectorController.add_sector);

export default router;
