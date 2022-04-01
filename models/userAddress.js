const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const userAddressSchema = mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    houseNo: {
        type: Number,
        required: true
    },
    colony: {
        type: String
    },
    landMark: {
        type: String
    },
    pinCode: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: "India"
    },
    deletedAt: {
        type: Date
    },
    merchantId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }

}, { timestamps: true })

const UserAddressModel = mongoose.model("userAddress", userAddressSchema)

module.exports = {
    UserAddressModel
}