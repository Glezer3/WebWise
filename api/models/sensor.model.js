import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    sensorId: {
        type: String,
        required: true,
        unique: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    photo: {
        type: String,
        default: "https://www.brnkl.io/wp-content/uploads/2022/05/black-blog-feature-495x400.png",
    },

    status: {
        type: String,
        default: "inactive",
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },

    ammonia: { // (NH3)
        type: Number,
    }, // - MQ-135

    benzene: { // (C6H6)
        type: Number,
    }, // - MQ-135

    methane: { // (CH4)
        type: Number, 
    }, // - MQ-2

    propane: { // (C3H8)
        type: Number,
    }, // - MQ-2

    bhutan: { // (C4H10)
        type: Number,
    }, // - MQ-2

    carbon_monoxide: { // CO2
        type: Number,
    }, // - MQ-135

    smoke: {
        type: Number,
    }, // - MQ-2

    air_quality: {
        type: Number,
    }, // - MQ-135

    temperature: {
        type: Number,
    },

    humidity: {
        type: Number,
    },

    historyValues: [{
        timestamp: {
            type: Date,
            required: true,
        },
    
        ammonia: { type: Number },
        benzene: { type: Number },
        methane: { type: Number },
        propane: { type: Number },
        bhutan: { type: Number },
        carbon_monoxide: { type: Number },
        smoke: { type: Number },
        air_quality: { type: Number },
        temperature: { type: Number },
        humidity: { type: Number },
    }],

}, {timestamps: true});

const Sensor = mongoose.model("Sensor", sensorSchema);

export default Sensor;