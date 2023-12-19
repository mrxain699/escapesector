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
          // const expiresIn = 7 * 24 * 60 * 60;
          await user
            .save()
            .then(async () => {
              const saved_user = await UserModel.findOne({
                username: username,
              }).select("-password");
              // const token = jwt.sign(
              //   {
              //     id: saved_user._id,
              //   },
              //   process.env.JWT_SECRET,
              //   { expiresIn: expiresIn }
              // );

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
            // const token = jwt.sign(
            //   {
            //     id: user._id,
            //   },
            //   process.env.JWT_SECRET
            // );
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
      console.log(error);
    }
  };

  // static login = async (req, res) => {
  //   try {
  //     const { username } = req.body;
  //     if (username) {
  //       const user = await UserModel.findOne({ username: username });
  //       if (user != null) {
  //         if (user.username === username) {
  //           res.send({
  //             status: "success",
  //             message: "Login Successfully",
  //             user: user,
  //           });
  //         } else {
  //           res.send({
  //             status: "Failed",
  //             message: "Invalid username",
  //           });
  //         }
  //       } else {
  //         res.send({
  //           status: "Failed",
  //           message: "Invalid username",
  //         });
  //       }
  //     } else {
  //       res.send({ status: "Failed", message: "Field are required" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  static authenticate = async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
      try {
        const user = await AdminModel.findOne({ username: username });
        if (user && user.password === password) {
          const expiresIn = 7 * 24 * 60 * 60;
          const token = jwt.sign(
            {
              id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: expiresIn }
          );
          res.send({
            status: "success",
            message: "Login Successfully",
            token: token,
          });
        } else {
          res.send({ status: "Failed", message: "Wrong username or password" });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send({ status: "Failed", message: "Both fields are required" });
    }
  };

  static loggedUser = (req, res) => {
    if (req.user) {
      res.send({ status: "success", user: req.user });
    } else {
      res.send({ status: "failed", message: "Unauthorized User" });
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

  // static addCompletedTask = async (
  //   user_id,
  //   mission_id,
  //   mission_object,
  //   res
  // ) => {
  //   const addMission = await UserModel.updateOne(
  //     { _id: user_id },
  //     { $push: { completed_missions: mission_object } }
  //   );
  //   if (addMission.modifiedCount > 0) {
  //     if (await UserController.isMissionComplete(user_id, mission_id)) {
  //       res.send({
  //         status: "success",
  //         message: "Mission Completed Successfully",
  //       });
  //     } else {
  //       res.send({
  //         status: "success",
  //         message: "Task added in the completed list",
  //       });
  //     }
  //   } else {
  //     res.send({
  //       status: "failed",
  //       message: "Unable to add task in the completed list",
  //     });
  //   }
  // };

  // static isMissionComplete = async (user_id, mission_id) => {
  //   const get_mission = await SectorModel.findOne({
  //     _id: mission_id,
  //   });
  //   const get_completed_mission = await UserModel.findOne(
  //     {
  //       _id: user_id,
  //       completed_missions: {
  //         $elemMatch: { mission_id: mission_id },
  //       },
  //     },
  //     { _id: 0, "completed_missions.$": 1 }
  //   );
  //   if (
  //     get_mission.tasks.length ===
  //     get_completed_mission.completed_missions[0].tasks.length
  //   ) {
  //     const update_is_commplete = await UserModel.updateOne(
  //       {
  //         _id: user_id,
  //         completed_missions: { $elemMatch: { mission_id: mission_id } },
  //       },
  //       { $set: { "completed_missions.$.isCompleted": true } }
  //     );

  //     if (update_is_commplete && update_is_commplete.modifiedCount > 0) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
}

export default UserController;
