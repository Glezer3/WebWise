import express from "express";
import { signup, verification, signin, google, signout, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify/:id/:verify_token", verification);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:id/:reset_token", resetPassword);

export default router;