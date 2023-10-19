import express from "express";
import UserController from "../controllers/UserController.js";
const router = express.Router();

router.get("/", UserController.getAllUser);
router.post("/register", UserController.register);

export default router;
