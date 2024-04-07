import cron from "node-cron";
import Sensor from "../models/sensor.model.js";

const updateSensorData = cron.schedule('*/3 * * * *', async () => {
    try {

        console.log("Automatic data update: START");

        const currentTime = new Date();
        const timeLimit = new Date(currentTime.getTime() - 3 * 24 * 60 * 60 * 1000);

        const sensors = await Sensor.find();

        sensors.forEach(async (sensor) => {
            const validData = sensor.historyValues.filter((data) => data.timestamp >= timeLimit);
            sensor.historyValues = validData;

        await sensor.save();
        });

        console.log("Automatic data update: COMPLETED");
        
    } catch (error) {
        console.log("Error during updating data: " + error);
    }
});

export default updateSensorData;