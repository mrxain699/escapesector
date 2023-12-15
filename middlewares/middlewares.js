import jwt from "jsonwebtoken";

const validate_request = (model) => {
  return async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        token = authorization.split(" ")[1];
        const decodedToken = jwt.decode(token, { complete: true });
        if (decodedToken && decodedToken.payload.exp * 1000 < Date.now()) {
          return res.send({ status: "failed", message: "Token has expired" });
        }
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await model.findById(id).select("-password");
        next();
      } catch (error) {
        console.log(error);
        res.send({ status: 401, message: "Unauthorized User" });
      }
    }
  };
};

export { validate_request };
