import { UserModel, AdminModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";

class UserController {
  static register = async (req, res) => {
    const { username, location } = req.body;
    const user = await UserModel.findOne({ username: username });
    if (user) {
      res.send({ status: "failed", message: "Username already in use" });
    } else {
      if (username && location) {
        try {
          const user = new UserModel({
            username: username,
            location: location,
            score: 0,
            image: "",
          });
          await user
            .save()
            .then(async () => {
              const saved_user = await UserModel.findOne({
                username: username,
              });
              const token = jwt.sign(
                {
                  id: saved_user._id,
                },
                process.env.JWT_SECRET,
                { expiresIn: "10d" }
              );

              res.send({
                status: "success",
                message: "User Registered Successfully",
                token: token,
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
            const token = jwt.sign(
              {
                id: user._id,
              },
              process.env.JWT_SECRET,
              { expiresIn: "10d" }
            );
            res.send({
              status: "success",
              message: "Login Successfully",
              token: token,
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

  static authenticate = async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
      try {
        const user = await AdminModel.findOne({ username: username });
        if (user && user.password === password) {
          const token = jwt.sign(
            {
              id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
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
}

export default UserController;
