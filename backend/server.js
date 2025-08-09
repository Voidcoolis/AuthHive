import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin: "http://localhost:5173", credentials: true})); // allows cross-origin requests - 5173 is the react app

app.use(express.json()); // allows us to parse incoming request bodies as JSON --> req.body
app.use(cookieParser()); // allows us to parse incoming cookies in the request --> req.cookies

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: " + PORT);
});
