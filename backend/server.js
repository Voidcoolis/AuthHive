import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// Debugging middleware to log all routes to find issues

// ["get", "post", "put", "delete", "patch", "use"].forEach(method => {
// 	const original = app[method].bind(app);
// 	app[method] = (path, ...handlers) => {
// 		console.log(`[ROUTE DEBUG] ${method.toUpperCase()} →`, path);
// 		return original(path, ...handlers);
// 	};
// });


const PORT = process.env.PORT || 5000;

const __dirname = path.resolve(); // get the current directory name

app.use(cors({origin: "http://localhost:5173", credentials: true})); // allows cross-origin requests - 5173 is the react app

app.use(express.json()); // allows us to parse incoming request bodies as JSON --> req.body
app.use(cookieParser()); // allows us to parse incoming cookies in the request --> req.cookies

app.use("/api/auth", authRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// make sure this part is always like this : " /.*/ " or else to work you have to install express 4
	app.get(/.*/, (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: " + PORT);
});
