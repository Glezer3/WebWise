import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import path from "path";
import databaseCleanUp from "./management/database.cleanup.js";
import updateSensorData from "./management/sensor.cleanup.js";
dotenv.config();
import Sensor from "./models/sensor.model.js";

/*const addValuesToSensor = async (sensorId, userId, name, latestValue) => {
    try {
        const currentTime = new Date();
        const newValue = {
            timestamp: currentTime,
            ...latestValue,
        };

        await Sensor.updateOne({ sensorId }, { $push: { historyValues: newValue } });
        console.log(`Hodnota bola pridaná do historických hodnôt senzora s ID ${sensorId}`);

        await Sensor.updateOne({ sensorId }, { ...latestValue });
        console.log(`Najnovšie hodnoty boli aktualizované pre senzor s ID ${sensorId}`);
    } catch (error) {
        console.error("Chyba pri pridávaní hodnôt do senzora:", error);
    }
};

setInterval(async () => {
    try {
        const sensorsData = [
            { sensorId: "1", userId: "658e9830d15372118ea6c618", name: "Sensor 1" },
        ];
        for (const { sensorId, userId, name } of sensorsData) {
            const latestValue = {
                ammonia: Math.random() * 45,
                benzene: Math.random() * 1.5,
                methane: Math.random() * 1500,
                propane: Math.random() * 1500,
                bhutan: Math.random() * 1200,
                carbon_monoxide: Math.random() * 1500,
                smoke: Math.random() * 100,
                air_quality: Math.random() * 100,
                temperature: Math.random() * 100,
                humidity: Math.random() * 100,
            };
            await addValuesToSensor(sensorId, userId, name, latestValue);
        }
    } catch (error) {
        console.error("Chyba pri simulácii pridávania hodnôt:", error);
    }
}, 6000);*/

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