import Sensor from "../models/sensor.model.js";

export const sensorData = async (req, res, next) => {

  const {
    sensorId,
    ammonia,
    benzene,
    methane,
    propane,
    bhutan,
    carbon_monoxide,
    smoke,
    air_quality,
    temperature,
    humidity,
  } = req.body;

  if (!sensorId) return res.status(400).json({ success: false, message: "Invalid sensor ID" });

  const newValues = {
    ammonia,
    benzene,
    methane,
    propane,
    bhutan,
    carbon_monoxide,
    smoke,
    air_quality,
    temperature,
    humidity,
    timestamp: new Date(),
  };

  try {
    const sensor = await Sensor.findOne({ sensorId: sensorId });
    if (!sensor) res.status(404).json({ success: false, message: "Sensor not found" });

    const updateValues = await Sensor.findByIdAndUpdate(
      sensor._id,
      {
        $set: {
          ammonia,
          benzene,
          methane,
          propane,
          bhutan,
          carbon_monoxide,
          smoke,
          air_quality,
          temperature,
          humidity,
          timestamp: new Date(),
        },
        $push: { historyValues: newValues },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Data saved successfully', updateValues });

  } catch (error) {
    next(error);
  }
};
