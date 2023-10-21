import UserModel from "../models/UserModel.js";
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
            created_at: new Date(),
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
}

export default UserController;
