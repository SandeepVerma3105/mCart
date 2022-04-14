const { type } = require("express/lib/response")
const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const userSchema = mongoose.Schema({

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
        required: true
    },
    email: {
        type: String,
    },
    countryCode: {
        type: String,
        default: "+91"

    },
    address: [{ type: Schema.Types.ObjectId, ref: "userAddress" }],
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

const UserModel = mongoose.model('user', userSchema)

module.exports = {
    UserModel
}