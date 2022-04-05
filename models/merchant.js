const { type } = require("express/lib/response")
const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const merchantSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        uniqu: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true,
        default: "+91"
    },
    address: [{ type: Schema.Types.ObjectId, ref: "merchantAddress" }],
    status: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true })

const MerchantModel = mongoose.model('merchant', merchantSchema)

module.exports = {
    MerchantModel
}