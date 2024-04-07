import mongoose from "mongoose";
//import defaultPFP from "../../client/src/assets/others/defaultPFP.svg";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    passwordResetToken: {
        type: String,
    },

    passwordResetTokenExpires: {
        type: Date,
    },

    passwordChangedAt: {
        type: Date,
    },

    avatar: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
    },

    verified: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;