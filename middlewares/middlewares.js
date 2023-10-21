import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const validate_request = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(id);
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: 401, message: "Unauthorized User" });
    }
  }
};

export { validate_request };
