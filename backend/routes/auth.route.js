import express from "express";
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword); // Reset password using token from email

/*
if the router was /reset-password/:xy , then we would extract the token like this in auth.controller.js:
 const { xy } = req.params;
*/
export default router;
