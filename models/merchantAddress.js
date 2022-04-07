const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const merchantAddress = mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    houseNo: {
        type: String,
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
        ref: "merchant"
    }

}, { timestamps: true })

const MerchantAddressModel = mongoose.model("merchantAddress", merchantAddress)

module.exports = {
    MerchantAddressModel
}