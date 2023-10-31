import jwt from "jsonwebtoken";

const validate_request = (model) => {
  return async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        token = authorization.split(" ")[1];
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await model.findById(id);
        next();
      } catch (error) {
        console.log(error);
        res.status(401).send({ status: 401, message: "Unauthorized User" });
      }
    }
  };
};

export { validate_request };
