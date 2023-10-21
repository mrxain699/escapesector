import express from "express";
import UserController from "../controllers/UserController.js";
import SectorController from "../controllers/SectorController.js";
const router = express.Router();

router.get("/", UserController.getAllUser);
router.post("/register", UserController.register);

router.get("/official-sectors", SectorController.get_all_official_sectors);

export default router;
