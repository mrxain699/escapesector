import express from "express";
import UserController from "../controllers/UserController.js";
import SectorController from "../controllers/SectorController.js";
const router = express.Router();

// User Routes
router.get("/", UserController.getAllUser);
router.post("/register", UserController.register);

// Sector Routes
router.get("/official-sectors", SectorController.get_all_official_sectors);
router.get("/community-sectors", SectorController.get_all_community_sectors);
router.post("/add-sector", SectorController.add_sector);

export default router;
