import { errorHandler } from "../utils/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import Sensor from "../models/sensor.model.js";

export const updateUser = async (req, res, next) => {
   const { username, email, avatar } = req.body;
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
          $set: {
            username: username,
            email: email,
            password: req.body.password,
            avatar: avatar,
          },
        }, { new: true } 
        
        );
  
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);

    } catch (error) {
      next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"))
      try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token");
        res.status(200).json("User has been deleted");
      } catch (error) {
        next(error)
      }  
};

export const fetchSensors = async (req, res, next) => {
    const id = req.params.id;

  try {
    const sensors = await Sensor.find({ userId: id });
    res.status(200).json(sensors);
  }

  catch (error) {
    next(error);
  }
};

export const updateSensor = async (req, res, next) => {
  const { id } = req.params;
  const { sensorId, name, photo } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json('User not found');
    }

    const sensor = await Sensor.findById(sensorId);

    if (!sensor) {
      return res.status(404).json('Sensor not found');
    }

    const updatedSensor = await Sensor.findByIdAndUpdate(sensorId, {
      $set: {
        name: name,
        photo: photo,
      },
    }, { new: true }) 

    res.status(200).json(updatedSensor);

  } catch (error) {
    next(error);
    console.error(error);
    return res.status(500).json('Internal server error');
  }
};

export const sensorInfo = async (req, res, next) => {
  const { id, sensorID } = req.params;
  
  try {
    const sensor = await Sensor.findOne({ userId: id, _id: sensorID });
    if(!sensor) res.status(404).json("Sensor not found");

    const {sensorId, userId, name, status, propane, smoke, methane, ammonia, bhutan, carbon_monoxide, benzene, air_quality, temperature, humidity} = sensor;
    const dataHistory = sensor.historyValues;
    return res.status(200).json({
        success: true,
        sensorId,
        userId,
        name,
        status,
        propane,
        smoke,
        methane,
        ammonia,
        bhutan,
        carbon_monoxide,
        benzene,
        air_quality,
        temperature,
        humidity,
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
    if(!sensor) res.status(404).json("Sensor not found");

    sensor.status = status;
    await sensor.save();

    return res.status(200).json(sensor);
    
  } catch (error) {
    next(error);
  }
}

