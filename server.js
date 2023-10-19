import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./config/connect.js";
import router from "./routes/routes.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;

app.use(cors());
app.use(express.json());
connect(DATABASE_URI);

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server Listening on port at http://localhost:${PORT}`);
});
