import { UserModel, AdminModel } from "../models/UserModel.js";
import SectorModel from "../models/SectorModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

class UserController {
  static register = async (req, res) => {
    const { username, password, location } = req.body;
    const user = await UserModel.findOne({ username: username });
    if (user) {
      res.send({ status: "failed", message: "Username already in use" });
    } else {
      if (username && password && location) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        try {
          const user = new UserModel({
            username: username,
            password: hashPassword,
            location: location,
            score: 0,
            image: "",
            completed_tasks: [],
            unlocked_missions: [],
          });
          await user
            .save()
            .then(async () => {
              const saved_user = await UserModel.findOne({
                username: username,
              }).select("-password");
              res.send({
                status: "success",
                message: "User Registered Successfully",
                user: saved_user,
              });
            })
            .catch((err) => {
              res.send({ status: "error", message: err.message });
            });
        } catch (error) {
          console.log(error);
          res.send({ status: "failed", message: "Unable to connect" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };

  static getAllUser = async (req, res) => {
    const users = await UserModel.find({});
    if (users.length > 0) {
      res.send({ users: users });
    } else {
      res.send({ status: "Failed", message: "User not found" });
    }
  };

  static login = async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username && password) {
        const user = await UserModel.findOne({ username: username });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.username === username && isMatch) {
            res.send({
              status: "success",
              message: "Login Successfully",
              user: user,
            });
          } else {
            res.send({
              status: "Failed",
              message: "Invalid username or password",
            });
          }
        } else {
          res.send({
            status: "Failed",
            message: "Invalid username or password",
          });
        }
      } else {
        res.send({ status: "Failed", message: "Both fields are required" });
      }
    } catch (error) {
      res.send({ status: "Failed", message: error.message });
    }
  };

  static save_mission = async (req, res) => {
    try {
      const { user_id, task_id } = req.body;
      if (user_id && task_id) {
        const user = await UserModel.findOne({ _id: user_id });
        if (user) {
          if (
            await UserController.updateCompletedMissionTask(user_id, task_id)
          ) {
            res.send({
              status: "success",
              message: "Task added in the completed list",
            });
          } else {
            res.send({
              status: "failed",
              message: "Task already added in the completed list",
            });
          }
        }
      } else {
        res.send({ status: "failed", message: "User not Found" });
      }
    } catch (error) {
      res.send({ status: "failed", message: error.message });
    }
  };

  static updateCompletedMissionTask = async (user_id, task_id) => {
    const update_com_mission = await UserModel.updateOne(
      {
        _id: user_id,
      },
      { $addToSet: { completed_tasks: task_id } }
    );
    if (update_com_mission && update_com_mission.modifiedCount > 0) {
      return true;
    }
    return false;
  };
}

export default UserController;
