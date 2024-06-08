import express from "express";
import { sensorData } from "../controllers/sensor.controller.js";

const router = express.Router();
router.post('/sensor-data', sensorData);

export default router;