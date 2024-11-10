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

    carbon_monoxide: { //CO2 - ppm
        type: Number,
    },

    temperature: {
        type: Number,
    },

    humidity: {
        type: Number,
    },

    atmospheric_pressure: {
        type: Number,
    },

    typical_particle_size: { //µm
        type: Number,
    },

    light: {
        type: Object,
        values: {
            intensity: { type: Number },
            rawALS: { type: Number },
            rawWhite: { type: Number },
        },
    },

    particulate_matter: { //PM - µg/m³
        type: Object,
        values: {
            PM1_0: { type: Number },
            PM2_5: { type: Number },
            PM4_0: { type: Number },
            PM10_0: { type: Number },
        },
    },

    number_concentration: { //NC - particles/cm³
        type: Object,
        values: {
            NC0_5: { type: Number },
            NC1_0: { type: Number },
            NC2_5: { type: Number },
            NC4_0: { type: Number },
            NC10_0: { type: Number },
        },
    },

    historyValues: [{
        timestamp: {
            type: Date,
            required: true,
        },
        carbon_monoxide: { type: Number },
        temperature: { type: Number },
        humidity: { type: Number },
        atmospheric_pressure: { type: Number },
        typical_particle_size: { type: Number, },
        light: {
            type: Object,
            values: {
                intensity: { type: Number },
                rawALS: { type: Number },
                rawWhite: { type: Number },
            },
        },
        particulate_matter: {
            type: Object,
            values: {
                PM1_0: { type: Number },
                PM2_5: { type: Number },
                PM4_0: { type: Number },
                PM10_0: { type: Number },
            },
        },
        number_concentration: {
            type: Object,
            values: {
                NC0_5: { type: Number },
                NC1_0: { type: Number },
                NC2_5: { type: Number },
                NC4_0: { type: Number },
                NC10_0: { type: Number },
            },
        },
    }],
}, {timestamps: true});

const Sensor = mongoose.model("Sensor", sensorSchema);

export default Sensor;