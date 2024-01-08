import express from "express";
import UserController from "../controllers/UserController.js";
import SectorController from "../controllers/SectorController.js";
import SideQuestController from "../controllers/SideQuestController.js";
import LeaderboardController from "../controllers/LeaderboardController.js";
import { UserModel, AdminModel } from "../models/UserModel.js";
import { validate_request } from "../middlewares/middlewares.js";

const router = express.Router();

// Game Api middlewares
// router.use("/official-sectors", validate_request);
// router.use("/community-sectors", validate_request);
// router.use("/nearby-sectors", validate_request);
// router.use("/add-sector", validate_request);
router.use("/auth/change-password", validate_request(AdminModel));

// Game Api Sector Routes
router.post("/add-sector", SectorController.add_sector);
router.get("/official-sectors", SectorController.get_all_official_sectors);
router.get("/community-sectors", SectorController.get_all_community_sectors);
router.get(
  "/nearby-sectors/:lat/:long/:official",
  SectorController.get_nearby_sectors
);

router.put("/unlocked-mission", SectorController.addUnlockedSector);

// Game Api User Routes
router.get("/", UserController.getAllUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/save-mission", UserController.save_mission);

// Leaderboard Routes
router.post("/leaderboard", LeaderboardController.AddLeader);
router.get("/leaderboard/:missionId", LeaderboardController.getLeader);
router.get(
  "/leaderboard/:missionId/:userId",
  LeaderboardController.getUserFromLeader
);
// Web Api middleware
router.use("/user", validate_request(AdminModel));

// Web Api User Routes
router.post("/auth/register", UserController.createUser);
router.post("/auth", UserController.authenticate);
router.post("/auth/change-password", UserController.changePassword);
router.get("/user", UserController.loggedUser);

// Web api  sectors
router.get("/sectors/:official", SectorController.sectors);
router.post("/add-task", SectorController.add_task);
router.post("/update-sector", SectorController.update_sector);
router.post("/update-task", SectorController.update_task);
router.get("/sector/:sectorId", SectorController.get_sector);
router.get("/sector/:sectorId/:taskId", SectorController.get_sector_task);
router.get("/tasks/:sectorId/", SectorController.get_sector_tasks);
router.delete("/delete-sector/:sectorId", SectorController.delete_sector);
router.delete("/delete-task/:sectorId/:taskId", SectorController.delete_task);

// Web api side quests
router.post("/sidequest", SideQuestController.add_side_quest);
router.put("/sidequest/update", SideQuestController.update_side_quest);
router.get("/sidequests/:mission_id", SideQuestController.get_side_quests);
router.get("/sidequest/:quest_id", SideQuestController.get_side_quest);
router.delete(
  "/sidequest/delete/:quest_id",
  SideQuestController.delete_side_quest
);

export default router;
