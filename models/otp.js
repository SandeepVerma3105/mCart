const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const otpSchema = mongoose.Schema({
        phoneNumber: {
            type: Number,
            required: true
        },
        otp: {
            type: Number,
            required: true
        },
    }

    , { timestamps: true }
)


const OtpModel = mongoose.model("otp", otpSchema)
module.exports = {
    OtpModel
}