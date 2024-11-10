import express from "express";
import { signup, verification, verifyNewEmail, signin, google, signout, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify/:id/:verify_token", verification);
router.get("/verifyNewEmail/:id/:newEmail_token", verifyNewEmail);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:id/:reset_token", resetPassword);

export default router;