import Sensor from "../models/sensor.model.js";
import { sendEmail, generateEmailTemplateAlert } from "../utils/sendEmail.js";

export const sensorData = async (req, res, next) => {

  const {
    sensorId,
    carbon_monoxide,
    temperature,
    humidity,
    light,
    atmospheric_pressure,
    typical_particle_size,
    particulate_matter,
    number_concentration,
  } = req.body;

  if (!sensorId) return res.status(400).json({ success: false, message: "Invalid sensor ID" });

  const newValues = {
    carbon_monoxide,
    temperature,
    humidity,
    atmospheric_pressure,
    typical_particle_size,
    light: {
      values: {
        intensity: light?.values?.intensity,
        rawALS: light?.values?.rawALS,
        rawWhite: light?.values?.rawWhite,
      },
    },
    particulate_matter: {
      values: {
        PM1_0: particulate_matter?.values?.PM1_0,
        PM2_5: particulate_matter?.values?.PM2_5,
        PM4_0: particulate_matter?.values?.PM4_0,
        PM10_0: particulate_matter?.values?.PM10_0,
      },
    },
    number_concentration: {
      values: {
        NC0_5: number_concentration?.values?.NC0_5,
        NC1_0: number_concentration?.values?.NC1_0,
        NC2_5: number_concentration?.values?.NC2_5,
        NC4_0: number_concentration?.values?.NC4_0,
        NC10_0: number_concentration?.values?.NC10_0,
      },
    },
    timestamp: new Date(),
  };

  try {
    const sensor = await Sensor.findOne({ sensorId: sensorId });
    if (!sensor) res.status(404).json({ success: false, message: "Sensor not found" });

    await Sensor.findByIdAndUpdate(
      sensor._id,
      {
        $set: {
          carbon_monoxide,
          temperature,
          humidity,
          atmospheric_pressure,
          typical_particle_size,
          light: {
            values: {
              intensity: light?.values?.intensity,
              rawALS: light?.values?.rawALS,
              rawWhite: light?.values?.rawWhite,
            },
          },
          particulate_matter: {
            values: {
              PM1_0: particulate_matter?.values?.PM1_0,
              PM2_5: particulate_matter?.values?.PM2_5,
              PM4_0: particulate_matter?.values?.PM4_0,
              PM10_0: particulate_matter?.values?.PM10_0,
            },
          },
          number_concentration: {
            values: {
              NC0_5: number_concentration?.values?.NC0_5,
              NC1_0: number_concentration?.values?.NC1_0,
              NC2_5: number_concentration?.values?.NC2_5,
              NC4_0: number_concentration?.values?.NC4_0,
              NC10_0: number_concentration?.values?.NC10_0,
            },
          },
          timestamp: new Date(),
        },
        $push: { historyValues: newValues },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Data saved successfully' });

  } catch (error) {
    next(error);
  }
};

export const sensorAlert = async (req, res, next) => {
  const { email, alerts } = req.body;

  try {
    if (!email || !Array.isArray(alerts) || alerts.length === 0) {
      return res.status(400).json({ success: false, message: "Cannot send the email" });
    }

    await sendEmail({
      email: email,
      subject: alerts.length === 1 ? "Dangerous value alert" : "Dangerous values alert",
      html: generateEmailTemplateAlert(alerts),
    });

    return res.status(200).json({ success: true, message: "Alert email sent successfully" });
    
  } catch (error) {
    next(error);
  }
};
