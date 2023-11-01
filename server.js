import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./config/connect.js";
import router from "./routes/routes.js";
import mongoose from "mongoose";
const app = express();
dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;

app.use(
  cors({
    origin: ["*", "http://localhost:5173"],
  })
);
app.use(
  express.json({
    limit: "100mb",
  })
);
connect(DATABASE_URI);

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server Listening on port at http://localhost:${PORT}`);
});
