import express from "express";
import { sensorData, sensorAlert } from "../controllers/sensor.controller.js";

const router = express.Router();
router.post('/sensor-data', sensorData);
router.post('/sensor-alert', sensorAlert);

export default router;