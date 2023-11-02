import express from "express";
import UserController from "../controllers/UserController.js";
import SectorController from "../controllers/SectorController.js";
import { UserModel, AdminModel } from "../models/UserModel.js";
import { validate_request } from "../middlewares/middlewares.js";
import { Admin } from "mongodb";
const router = express.Router();

// Game Api middlewares
// router.use("/official-sectors", validate_request);
// router.use("/community-sectors", validate_request);
// router.use("/nearby-sectors", validate_request);
// router.use("/add-sector", validate_request);

// Game Api Sector Routes
router.get("/official-sectors", SectorController.get_all_official_sectors);
router.get("/community-sectors", SectorController.get_all_community_sectors);
router.get(
  "/nearby-sectors/:lat/:long/:official",
  SectorController.get_nearby_sectors
);
router.post("/add-sector", SectorController.add_sector);
router.get("/tasks/:sectorId/", SectorController.get_sector_tasks);
router.get("/delete-sector/:sectorId", SectorController.delete_sector);

// Game Api User Routes
router.get("/", UserController.getAllUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Web Api middleware
router.use("/user", validate_request(AdminModel));

// Web Api User Routes
router.post("/auth", UserController.authenticate);
router.get("/user", UserController.loggedUser);

export default router;
