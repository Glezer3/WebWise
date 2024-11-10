import { errorHandler } from "../utils/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import Sensor from "../models/sensor.model.js";
import crypto from "crypto";
import { sendEmail, generateNewEmailTemplateVerify } from "../utils/sendEmail.js";
import Token from "../models/token.model.js";

export const userInfo = async (req, res, next) => {

  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(500, "Server error");
  }
};

export const updateUser = async (req, res, next) => {
  const { username, email, avatar } = req.body;

  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {

    if (username) {
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername && existingUserByUsername._id.toString() !== req.params.id) {
        return next(errorHandler(400, "This username is already taken."));
      }
    }

    if (email) {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail && existingUserByEmail._id.toString() !== req.params.id) {
        return next(errorHandler(400, "This email is already in use."));
      }
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    
    const user = await User.findById(req.params.id);

    if (email && email !== user.email) {

      if(user.newEmail && user.newEmail === email) {
        return next(errorHandler(500, "The verification email has already been sent. Please check your inbox."));
      }

      const emailToken = await Token.findOne({ userId: user._id});
      if(emailToken) {
        await emailToken.deleteOne();
      }

      const newEmail_token = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await newEmail_token.save();

      user.newEmail = email;
      await user.save();

      const verifyNewEmailURL = `${req.protocol}://${req.get("host")}/verifyNewEmail/${user._id}/${newEmail_token.token}`;
      const message = `We have received a NEW email verification request. Please use the link below to verify your NEW email: \n\n ${verifyNewEmailURL} \n\n Please remember that this link for your new email verification will be valid only for 1 hour.`;

      try {
        await sendEmail({
          email: user.newEmail,
          subject: "Verify your new email",
          message: message,
          html: generateNewEmailTemplateVerify(verifyNewEmailURL),
        });

        return res.status(200).json({ success: true, message: "Verification email sent. Please verify your new email first." });

      } catch (error) {
        await newEmail_token.deleteOne();
        return next(errorHandler(500, "Something went wrong. Please try again later"));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: username,
          email: email,
          password: req.body.password,
          avatar: avatar,
        },
      },
      { new: true }
    );

    const { password: _, ...rest } = updatedUser._doc;
    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message:"User has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const fetchSensors = async (req, res, next) => {
  const id = req.params.id;

  try {
    const sensors = await Sensor.find({ userId: id });
    res.status(200).json(sensors);
  } catch (error) {
    next(error);
  }
};

export const addSensor = async (req, res, next) => {
  const userId = req.params.id;
  const { sensorName, sensorId } = req.body;

  try {
    const sensor = await Sensor.findOne({ sensorId: sensorId });

    if (!sensor) {
      return res.status(404).json({ success: false, message: "Sensor not found" });
    }

    if(sensor.userId && sensor.userId !== userId) {
      return res.status(404).json({ success: false, message: "Sensor is already assigned to another user" });
    } else if (sensor.sensorId && sensor.sensorId === userId ) {
      return res.status(404).json({ success: false, message: "Sensor is already assigned to you" });
    }

    sensor.userId = userId;
    sensor.name = sensorName;
    await sensor.save();

    res.status(200).json({ success: true, message: "Sensor successfully added" });
    
  } catch (error) {
    next(error);
  }
}

export const updateSensor = async (req, res, next) => {
  const { id } = req.params;
  const { sensorId, name, photo } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const sensor = await Sensor.findById(sensorId);

    if (!sensor) {
      return res.status(404).json({ success: false, message: "Sensor not found" });
    }

    const updatedSensor = await Sensor.findByIdAndUpdate(
      sensorId,
      {
        $set: {
          name: name,
          photo: photo,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedSensor);
  } catch (error) {
    next(error);
    console.error(error);
    return res.status(500).json({ success: false, message:"Internal server error" });
  }
};

export const deleteSensor = async (req, res, next) => {
  const { id } = req.params;
  const { sensorId } = req.body;

  try {

    const sensor = await Sensor.findOne({ _id: sensorId, userId: id });

        if (!sensor) {
            return res.status(404).json({ success: false, message: 'Sensor not found or not owned by user.' });
        }

        const fieldsToRemove = Object.keys(sensor._doc).reduce((acc, key) => {
          if (!['sensorId', '_id', 'updatedAt'].includes(key)) {
            acc[key] = "";
          }
          return acc;
        }, {});
    
        await Sensor.updateOne({ _id: sensor._id }, { $unset: fieldsToRemove });

      res.status(200).json({ success: true, message: 'Sensor deleted successfully.' });
    
  } catch (error) {
    console.log(error)
    next(error);
  }
}

export const sensorInfo = async (req, res, next) => {
  const { id, sensorID } = req.params;

  try {
    const sensor = await Sensor.findOne({ userId: id, _id: sensorID });
    if (!sensor) res.status(404).json({ success: false, message:"Sensor not found" });

    const {
      sensorId,
      userId,
      name,
      status,
      carbon_monoxide,
      temperature,
      humidity,
      atmospheric_pressure,
      typical_particle_size,
      light,
      particulate_matter,
      number_concentration,
    } = sensor;

    const dataHistory = sensor.historyValues;

    return res.status(200).json({
      success: true,
      sensorId,
      userId,
      name,
      status,
      carbon_monoxide,
      temperature,
      humidity,
      atmospheric_pressure,
      typical_particle_size,
      light: {
        intensity: light?.values?.intensity,
        rawALS: light?.values?.rawALS,
        rawWhite: light?.values?.rawWhite,
      },
      particulate_matter: {
        PM1_0: particulate_matter?.values?.PM1_0,
        PM2_5: particulate_matter?.values?.PM2_5,
        PM4_0: particulate_matter?.values?.PM4_0,
        PM10_0: particulate_matter?.values?.PM10_0,
      },
      number_concentration: {
        NC0_5: number_concentration?.values?.NC0_5,
        NC1_0: number_concentration?.values?.NC1_0,
        NC2_5: number_concentration?.values?.NC2_5,
        NC4_0: number_concentration?.values?.NC4_0,
        NC10_0: number_concentration?.values?.NC10_0,
      },
      dataHistory,
    });
  } catch (error) {
    next(error);
  }
};

export const sensorActivity = async (req, res, next) => {
  const { id, sensorID } = req.params;
  const { status } = req.body;

  try {
    const sensor = await Sensor.findOne({ userId: id, _id: sensorID });
    if (!sensor) res.status(404).json({ success: false, message: "Sensor not found" });

    sensor.status = status;
    await sensor.save();

    return res.status(200).json(sensor);
  } catch (error) {
    next(error);
  }
};
