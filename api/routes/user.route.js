import express from "express";
import { updateUser, deleteUser, fetchSensors, updateSensor, sensorInfo, sensorActivity } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/sensors/:id', fetchSensors);
router.post('/updateSensor/:id', updateSensor);
router.get('/sensors/:id/:sensorID', sensorInfo);
router.patch('/sensors/:id/:sensorID', sensorActivity);

export default router;