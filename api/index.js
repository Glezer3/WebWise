import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import sensorRouter from "./routes/sensor.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import databaseCleanUp from "./management/database.cleanup.js";
import updateSensorData from "./management/sensor.cleanup.js";
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected succesfully")
}).catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/sensor', sensorRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

updateSensorData.start();
databaseCleanUp.start();

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
});