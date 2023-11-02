import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./config/connect.js";
import router from "./routes/routes.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;

app.use(cors());
app.use(
  express.json({
    limit: "100mb",
  })
);
app.use("/static", express.static(path.join(__dirname, "static")));

connect(DATABASE_URI);

app.use("/api", router);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server Listening on port at http://localhost:${PORT}`);
});
