import express from "express";
import { userInfo, updateUser, deleteUser, fetchSensors, addSensor, updateSensor, deleteSensor, sensorInfo, sensorActivity } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post('/profile', userInfo);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/sensors/:id', fetchSensors);
router.post('/sensor/add_sensor/:id', addSensor);
router.post('/updateSensor/:id', updateSensor);
router.delete('/deleteSensor/:id', deleteSensor);
router.get('/sensors/:id/:sensorID', sensorInfo);
router.patch('/sensors/:id/:sensorID', sensorActivity);

export default router;